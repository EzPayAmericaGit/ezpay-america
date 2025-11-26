import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const DOCUSIGN_AUTH_SERVER = 'account-d.docusign.com'; // Use 'account.docusign.com' for production
const DOCUSIGN_BASE_URL = 'https://demo.docusign.net/restapi'; // Use 'https://na4.docusign.net/restapi' for production

// Your uploaded MPA PDF document URL
const MPA_DOCUMENT_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/2ab6082af_EZPAYAMERICANEWMPA102825.pdf';

async function getAccessToken() {
    const integrationKey = Deno.env.get('DOCUSIGN_INTEGRATION_KEY');
    const userId = Deno.env.get('DOCUSIGN_USER_ID');
    const privateKey = Deno.env.get('DOCUSIGN_PRIVATE_KEY');

    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: integrationKey,
        sub: userId,
        aud: DOCUSIGN_AUTH_SERVER,
        iat: now,
        exp: now + 3600,
        scope: 'signature impersonation'
    };

    const base64UrlEncode = (obj) => {
        const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
        const base64 = btoa(str);
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };

    const headerEncoded = base64UrlEncode(header);
    const payloadEncoded = base64UrlEncode(payload);
    const signingInput = `${headerEncoded}.${payloadEncoded}`;

    const pemContents = privateKey
        .replace('-----BEGIN RSA PRIVATE KEY-----', '')
        .replace('-----END RSA PRIVATE KEY-----', '')
        .replace(/\s/g, '');
    
    const binaryKey = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
    
    const cryptoKey = await crypto.subtle.importKey(
        'pkcs8',
        binaryKey,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        new TextEncoder().encode(signingInput)
    );

    const signatureEncoded = base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
    const jwt = `${signingInput}.${signatureEncoded}`;

    const tokenResponse = await fetch(`https://${DOCUSIGN_AUTH_SERVER}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Failed to get access token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}

async function createEnvelope(accessToken, applicationData, signerEmail, signerName) {
    const accountId = Deno.env.get('DOCUSIGN_ACCOUNT_ID');

    // Fetch the PDF document
    const pdfResponse = await fetch(MPA_DOCUMENT_URL);
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const documentBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)));

    // Prepare additional documents array
    const documents = [
        {
            documentBase64: documentBase64,
            name: 'Merchant Application and Agreement',
            fileExtension: 'pdf',
            documentId: '1'
        }
    ];

    // Add driver's license if uploaded
    if (applicationData.driversLicenseUrl) {
        try {
            const dlResponse = await fetch(applicationData.driversLicenseUrl);
            const dlBuffer = await dlResponse.arrayBuffer();
            const dlBase64 = btoa(String.fromCharCode(...new Uint8Array(dlBuffer)));
            const dlExt = applicationData.driversLicenseUrl.split('.').pop().toLowerCase();
            documents.push({
                documentBase64: dlBase64,
                name: 'Drivers License',
                fileExtension: dlExt === 'pdf' ? 'pdf' : 'jpg',
                documentId: '2'
            });
        } catch (e) {
            console.error('Error fetching drivers license:', e);
        }
    }

    // Add voided check if uploaded
    if (applicationData.voidedCheckUrl) {
        try {
            const checkResponse = await fetch(applicationData.voidedCheckUrl);
            const checkBuffer = await checkResponse.arrayBuffer();
            const checkBase64 = btoa(String.fromCharCode(...new Uint8Array(checkBuffer)));
            const checkExt = applicationData.voidedCheckUrl.split('.').pop().toLowerCase();
            documents.push({
                documentBase64: checkBase64,
                name: 'Voided Business Check',
                fileExtension: checkExt === 'pdf' ? 'pdf' : 'jpg',
                documentId: '3'
            });
        } catch (e) {
            console.error('Error fetching voided check:', e);
        }
    }

    // Parse address components
    const parseAddress = (address) => {
        if (!address) return { street: '', city: '', state: '', zip: '' };
        const parts = address.split(',').map(p => p.trim());
        if (parts.length >= 3) {
            const stateZip = parts[parts.length - 1].split(' ').filter(s => s);
            return {
                street: parts.slice(0, -2).join(', '),
                city: parts[parts.length - 2] || '',
                state: stateZip[0] || '',
                zip: stateZip[1] || ''
            };
        } else if (parts.length === 2) {
            const stateZip = parts[1].split(' ').filter(s => s);
            return {
                street: parts[0],
                city: '',
                state: stateZip[0] || '',
                zip: stateZip[1] || ''
            };
        }
        return { street: address, city: '', state: '', zip: '' };
    };

    const businessAddress = parseAddress(applicationData.businessPhysicalAddress);
    const corpAddress = parseAddress(applicationData.corporateAddress || applicationData.businessPhysicalAddress);
    const ownerHomeAddress = parseAddress(applicationData.ownerHomeAddress);

    // Calculate years in business
    const yearsInBusiness = applicationData.dateBusinessStarted 
        ? Math.floor((Date.now() - new Date(applicationData.dateBusinessStarted).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : '';

    // Map business type to checkbox
    const businessTypeMap = {
        'Retail': 'retail',
        'Restaurant': 'restaurant',
        'E-commerce': 'internet',
        'Professional Services': 'service',
        'Healthcare': 'service',
        'Hospitality': 'lodging',
        'Food Truck': 'restaurant',
        'Salon/Spa': 'service',
        'Auto Services': 'service',
        'Other': 'other'
    };

    // Map ownership type
    const ownershipTypeMap = {
        'Sole Proprietorship': 'sole_proprietor',
        'Partnership': 'partnership',
        'LLC': 'llc',
        'Corporation': 'corporation',
        'Non-Profit': 'non_profit'
    };

    // Map account type
    const accountTypeDisplay = {
        'business_checking': 'Business Checking',
        'business_savings': 'Business Savings',
        'personal_checking': 'Personal Checking',
        'personal_savings': 'Personal Savings'
    };

    const envelopeDefinition = {
        emailSubject: 'EzPay America - Merchant Application for Signature',
        emailBlurb: `Dear ${signerName}, please review and sign your merchant application for ${applicationData.legalBusinessName || 'your business'}. Please also attach a copy of your valid Driver's License and a Voided Business Check.`,
        documents: documents,
        recipients: {
            signers: [
                {
                    email: signerEmail,
                    name: signerName,
                    recipientId: '1',
                    routingOrder: '1',
                    tabs: {
                        // Page 1 - Business Information Section
                        textTabs: [
                            // Section 1: Business Information
                            { documentId: '1', pageNumber: '1', xPosition: '95', yPosition: '87', value: applicationData.legalBusinessName || '', width: 200, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '380', yPosition: '87', value: applicationData.dbaName || '', width: 200, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '95', yPosition: '103', value: corpAddress.street || '', width: 200, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '380', yPosition: '103', value: businessAddress.street || '', width: 200, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '119', value: corpAddress.city || '', width: 80, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '135', yPosition: '119', value: corpAddress.state || '', width: 30, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '200', yPosition: '119', value: corpAddress.zip || '', width: 50, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '330', yPosition: '119', value: businessAddress.city || '', width: 80, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '450', yPosition: '119', value: businessAddress.state || '', width: 30, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '520', yPosition: '119', value: businessAddress.zip || '', width: 50, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '95', yPosition: '135', value: applicationData.businessPhone || '', width: 100, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '210', yPosition: '135', value: applicationData.taxId || '', width: 100, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '380', yPosition: '135', value: applicationData.businessPhone || '', width: 100, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '480', yPosition: '135', value: applicationData.businessEmail || '', width: 120, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '80', yPosition: '151', value: yearsInBusiness.toString(), width: 30, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '160', yPosition: '151', value: applicationData.numberOfLocations || '1', width: 30, height: 12, fontSize: 'Size9' },

                            // Section 2: Owner Information
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '205', value: applicationData.ownerFullName || '', width: 180, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '225', value: applicationData.ownerTitle || 'Owner', width: 80, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '170', yPosition: '225', value: applicationData.ownerOwnershipPercent || '100', width: 40, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '255', value: ownerHomeAddress.street || '', width: 180, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '275', value: ownerHomeAddress.city || '', width: 80, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '145', yPosition: '275', value: ownerHomeAddress.state || '', width: 30, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '200', yPosition: '275', value: ownerHomeAddress.zip || '', width: 50, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '295', value: applicationData.ownerPersonalPhone || '', width: 120, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '315', value: applicationData.ownerSSN || '', width: 120, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '180', yPosition: '315', value: applicationData.ownerDOB || '', width: 100, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '335', value: applicationData.ownerPersonalEmail || applicationData.businessEmail || '', width: 180, height: 12, fontSize: 'Size9' },

                            // Section 3: Sales Profile - Ticket amounts and volumes
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '395', value: applicationData.averageTicket || '', width: 60, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '120', yPosition: '395', value: applicationData.largestTicket || '', width: 60, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '200', yPosition: '395', value: applicationData.monthlyVolume || '', width: 80, height: 12, fontSize: 'Size9' },
                            // Sales percentages
                            { documentId: '1', pageNumber: '1', xPosition: '520', yPosition: '370', value: applicationData.percentageSwiped || '0', width: 30, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '520', yPosition: '385', value: applicationData.percentageKeyed || '0', width: 30, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '520', yPosition: '415', value: applicationData.percentageInternet || '0', width: 30, height: 12, fontSize: 'Size9' },

                            // Section 4: Business Profile - MCC and goods/services
                            { documentId: '1', pageNumber: '1', xPosition: '120', yPosition: '510', value: applicationData.productsDescription || '', width: 400, height: 12, fontSize: 'Size9' },

                            // Banking Information
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '535', value: applicationData.bankName || '', width: 150, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '250', yPosition: '535', value: applicationData.routingNumber || '', width: 100, height: 12, fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '1', xPosition: '420', yPosition: '535', value: applicationData.accountNumber || '', width: 120, height: 12, fontSize: 'Size9' },

                            // Return Policy
                            { documentId: '1', pageNumber: '1', xPosition: '48', yPosition: '560', value: applicationData.cancellationPolicy || '', width: 500, height: 12, fontSize: 'Size9' },

                            // Section 5: Site Inspection - Zoning
                            { documentId: '1', pageNumber: '1', xPosition: '200', yPosition: '620', value: applicationData.businessLocationType || '', width: 150, height: 12, fontSize: 'Size9' },
                        ],
                        
                        // Checkboxes for business type
                        checkboxTabs: [
                            // Currently accept cards
                            { documentId: '1', pageNumber: '1', xPosition: '370', yPosition: '395', selected: applicationData.currentlyAcceptCards === 'yes', tabLabel: 'acceptCardsYes' },
                            { documentId: '1', pageNumber: '1', xPosition: '410', yPosition: '395', selected: applicationData.currentlyAcceptCards === 'no', tabLabel: 'acceptCardsNo' },
                            
                            // Business Type checkboxes
                            { documentId: '1', pageNumber: '1', xPosition: '75', yPosition: '510', selected: businessTypeMap[applicationData.businessMarketType] === 'retail', tabLabel: 'typeRetail' },
                            { documentId: '1', pageNumber: '1', xPosition: '120', yPosition: '510', selected: businessTypeMap[applicationData.businessMarketType] === 'restaurant', tabLabel: 'typeRestaurant' },
                            { documentId: '1', pageNumber: '1', xPosition: '180', yPosition: '510', selected: businessTypeMap[applicationData.businessMarketType] === 'service', tabLabel: 'typeService' },
                            { documentId: '1', pageNumber: '1', xPosition: '230', yPosition: '510', selected: businessTypeMap[applicationData.businessMarketType] === 'internet', tabLabel: 'typeInternet' },
                            { documentId: '1', pageNumber: '1', xPosition: '285', yPosition: '510', selected: businessTypeMap[applicationData.businessMarketType] === 'lodging', tabLabel: 'typeLodging' },

                            // Ownership Type checkboxes  
                            { documentId: '1', pageNumber: '1', xPosition: '22', yPosition: '490', selected: ownershipTypeMap[applicationData.businessFormationType] === 'sole_proprietor', tabLabel: 'ownerSole' },
                            { documentId: '1', pageNumber: '1', xPosition: '22', yPosition: '505', selected: ownershipTypeMap[applicationData.businessFormationType] === 'partnership', tabLabel: 'ownerPartnership' },
                            { documentId: '1', pageNumber: '1', xPosition: '175', yPosition: '490', selected: ownershipTypeMap[applicationData.businessFormationType] === 'llc', tabLabel: 'ownerLLC' },
                            { documentId: '1', pageNumber: '1', xPosition: '175', yPosition: '505', selected: ownershipTypeMap[applicationData.businessFormationType] === 'corporation', tabLabel: 'ownerCorp' },
                            { documentId: '1', pageNumber: '1', xPosition: '330', yPosition: '505', selected: ownershipTypeMap[applicationData.businessFormationType] === 'non_profit', tabLabel: 'ownerNonProfit' },

                            // Guarantor checkbox
                            { documentId: '1', pageNumber: '1', xPosition: '180', yPosition: '235', selected: true, tabLabel: 'guarantorYes' },
                        ],

                        // Page 3 - Signature tabs
                        signHereTabs: [
                            // Section 10: Merchant Acceptance - Signature of Principal/Owner #1
                            { documentId: '1', pageNumber: '3', xPosition: '270', yPosition: '168', scaleValue: 0.7 },
                            // Section 10: Signature of Principal/Owner #2 (optional)
                            { documentId: '1', pageNumber: '3', xPosition: '270', yPosition: '195', scaleValue: 0.7, optional: 'true' },
                            // Section 11: Guarantor #1 signature  
                            { documentId: '1', pageNumber: '3', xPosition: '50', yPosition: '340', scaleValue: 0.7 },
                            // Section 12: Final merchant signature
                            { documentId: '1', pageNumber: '3', xPosition: '100', yPosition: '545', scaleValue: 0.7 },
                        ],

                        dateSignedTabs: [
                            // Section 10 dates
                            { documentId: '1', pageNumber: '3', xPosition: '170', yPosition: '175', fontSize: 'Size9' },
                            // Section 11 Guarantor date
                            { documentId: '1', pageNumber: '3', xPosition: '170', yPosition: '345', fontSize: 'Size9' },
                            // Section 12 final dates
                            { documentId: '1', pageNumber: '3', xPosition: '480', yPosition: '545', fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '3', xPosition: '480', yPosition: '565', fontSize: 'Size9' },
                        ],

                        // Title tabs
                        titleTabs: [
                            { documentId: '1', pageNumber: '3', xPosition: '460', yPosition: '168', fontSize: 'Size9' },
                            { documentId: '1', pageNumber: '3', xPosition: '460', yPosition: '195', fontSize: 'Size9', optional: 'true' },
                        ],

                        // Printed name
                        fullNameTabs: [
                            { documentId: '1', pageNumber: '3', xPosition: '100', yPosition: '565', fontSize: 'Size9' },
                        ],

                        // Initial tabs for each page (bottom right corner)
                        initialHereTabs: [
                            { documentId: '1', pageNumber: '1', xPosition: '520', yPosition: '740', scaleValue: 0.5 },
                            { documentId: '1', pageNumber: '2', xPosition: '520', yPosition: '740', scaleValue: 0.5 },
                            { documentId: '1', pageNumber: '3', xPosition: '520', yPosition: '740', scaleValue: 0.5 },
                        ]
                    }
                }
            ]
        },
        status: 'sent'
    };

    const response = await fetch(`${DOCUSIGN_BASE_URL}/v2.1/accounts/${accountId}/envelopes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(envelopeDefinition)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create envelope: ${errorText}`);
    }

    return await response.json();
}

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { applicationData } = await req.json();

        if (!applicationData) {
            return Response.json({ error: 'Application data is required' }, { status: 400 });
        }

        const signerEmail = applicationData.businessEmail || user.email;
        const signerName = applicationData.ownerFullName || user.full_name;

        const accessToken = await getAccessToken();
        const envelope = await createEnvelope(accessToken, applicationData, signerEmail, signerName);

        return Response.json({
            success: true,
            envelopeId: envelope.envelopeId,
            status: envelope.status,
            message: 'Application sent for signature'
        });

    } catch (error) {
        console.error('DocuSign error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});