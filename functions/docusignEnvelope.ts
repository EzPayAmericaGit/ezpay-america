import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { SignJWT } from 'npm:jose@5.2.0';
import * as asn1js from 'npm:asn1js@3.0.5';
import * as pvutils from 'npm:pvutils@1.1.3';

const DOCUSIGN_AUTH_SERVER = 'account.docusign.com'; // Production
const DOCUSIGN_BASE_URL = 'https://na4.docusign.net/restapi'; // Production

// DocuSign Template Name
const TEMPLATE_NAME = 'EzPay MPA';

// Convert PKCS#1 to PKCS#8 format
function pkcs1ToPkcs8(pkcs1Base64) {
    const pkcs1Der = pvutils.stringToArrayBuffer(atob(pkcs1Base64));
    
    // PKCS#8 wraps PKCS#1 with algorithm identifier
    // AlgorithmIdentifier for RSA: OID 1.2.840.113549.1.1.1 + NULL
    const rsaOid = new asn1js.ObjectIdentifier({ value: '1.2.840.113549.1.1.1' });
    const algorithmId = new asn1js.Sequence({
        value: [rsaOid, new asn1js.Null()]
    });
    
    // PKCS#8 structure: SEQUENCE { version INTEGER, algorithm AlgorithmIdentifier, privateKey OCTET STRING }
    const pkcs8 = new asn1js.Sequence({
        value: [
            new asn1js.Integer({ value: 0 }), // version
            algorithmId,
            new asn1js.OctetString({ valueHex: pkcs1Der })
        ]
    });
    
    const pkcs8Der = pkcs8.toBER(false);
    const pkcs8Base64 = btoa(String.fromCharCode(...new Uint8Array(pkcs8Der)));
    
    // Format with line breaks
    const formatted = pkcs8Base64.match(/.{1,64}/g)?.join('\n') || pkcs8Base64;
    return `-----BEGIN PRIVATE KEY-----\n${formatted}\n-----END PRIVATE KEY-----`;
}

async function getAccessToken() {
    const integrationKey = Deno.env.get('DOCUSIGN_INTEGRATION_KEY');
    const userId = Deno.env.get('DOCUSIGN_USER_ID');
    const privateKeyEnv = Deno.env.get('DOCUSIGN_PRIVATE_KEY');

    if (!integrationKey || !userId || !privateKeyEnv) {
        throw new Error('Missing DocuSign credentials. Please set DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_USER_ID, and DOCUSIGN_PRIVATE_KEY.');
    }

    let pemKey = privateKeyEnv;
    
    console.log('=== PRIVATE KEY DEBUG ===');
    console.log('Raw key length:', pemKey.length);
    
    // Handle literal \n sequences
    pemKey = pemKey.replace(/\\n/g, '\n');
    
    // Extract base64 content
    let base64Content;
    if (pemKey.includes('-----BEGIN')) {
        const match = pemKey.match(/-----BEGIN[^-]+-----(.+?)-----END[^-]+-----/s);
        if (match) {
            base64Content = match[1].replace(/[\s\r\n]/g, '');
        }
    } else {
        base64Content = pemKey.replace(/[\s\r\n]/g, '');
    }
    
    console.log('Base64 content length:', base64Content?.length);

    try {
        // Convert PKCS#1 to PKCS#8 format
        const pkcs8Pem = pkcs1ToPkcs8(base64Content);
        console.log('Converted to PKCS#8 format');
        
        // Import using Web Crypto API
        const pkcs8Der = pvutils.stringToArrayBuffer(
            atob(pkcs8Pem
                .replace('-----BEGIN PRIVATE KEY-----', '')
                .replace('-----END PRIVATE KEY-----', '')
                .replace(/[\s\r\n]/g, '')
            )
        );
        
        const privateKey = await crypto.subtle.importKey(
            'pkcs8',
            pkcs8Der,
            { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        console.log('Successfully imported private key');

        // Create JWT
        const now = Math.floor(Date.now() / 1000);
        
        const jwt = await new SignJWT({
            scope: 'signature impersonation'
        })
            .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
            .setIssuer(integrationKey)
            .setSubject(userId)
            .setAudience(DOCUSIGN_AUTH_SERVER)
            .setIssuedAt(now)
            .setExpirationTime(now + 3600)
            .sign(privateKey);

        console.log('JWT created successfully');

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
        
    } catch (e) {
        console.error('Key import error:', e.message, e.stack);
        throw new Error(`Failed to import private key: ${e.message}`);
    }
}

async function getTemplateId(accessToken, accountId) {
    // Search for the template by name
    const response = await fetch(`${DOCUSIGN_BASE_URL}/v2.1/accounts/${accountId}/templates?search_text=${encodeURIComponent(TEMPLATE_NAME)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to search templates: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.envelopeTemplates || data.envelopeTemplates.length === 0) {
        throw new Error(`Template "${TEMPLATE_NAME}" not found in DocuSign account`);
    }

    // Find exact match
    const template = data.envelopeTemplates.find(t => t.name === TEMPLATE_NAME);
    if (!template) {
        throw new Error(`Template "${TEMPLATE_NAME}" not found. Available: ${data.envelopeTemplates.map(t => t.name).join(', ')}`);
    }

    return template.templateId;
}

async function createEnvelope(accessToken, applicationData, signerEmail, signerName) {
    const accountId = Deno.env.get('DOCUSIGN_ACCOUNT_ID');

    // Get template ID
    const templateId = await getTemplateId(accessToken, accountId);
    console.log('Using template ID:', templateId);

    // Build pre-fill tabs from application data
    const textTabs = [];
    
    // Map form fields to template tab labels (these should match your DocuSign template tabs)
    const fieldMappings = {
        'legalBusinessName': applicationData.legalBusinessName,
        'dbaName': applicationData.dbaName,
        'businessPhone': applicationData.businessPhone,
        'businessEmail': applicationData.businessEmail,
        'taxId': applicationData.taxId,
        'businessAddress': applicationData.businessPhysicalAddress,
        'corporateAddress': applicationData.corporateAddress || applicationData.businessPhysicalAddress,
        'ownerFullName': applicationData.ownerFullName,
        'ownerTitle': applicationData.ownerTitle,
        'ownerOwnershipPercent': applicationData.ownerOwnershipPercent,
        'ownerHomeAddress': applicationData.ownerHomeAddress,
        'ownerPersonalPhone': applicationData.ownerPersonalPhone,
        'ownerSSN': applicationData.ownerSSN,
        'ownerDOB': applicationData.ownerDOB,
        'ownerPersonalEmail': applicationData.ownerPersonalEmail,
        'ownerDriversLicense': applicationData.ownerDriversLicense,
        'ownerDLState': applicationData.ownerDLState,
        'bankName': applicationData.bankName,
        'routingNumber': applicationData.routingNumber,
        'accountNumber': applicationData.accountNumber,
        'averageTicket': applicationData.averageTicket,
        'largestTicket': applicationData.largestTicket,
        'monthlyVolume': applicationData.monthlyVolume,
        'annualVolume': applicationData.annualVolume,
        'percentageSwiped': applicationData.percentageSwiped,
        'percentageKeyed': applicationData.percentageKeyed,
        'percentageInternet': applicationData.percentageInternet,
        'productsDescription': applicationData.productsDescription,
        'deliveryTimeframe': applicationData.deliveryTimeframe,
        'cancellationPolicy': applicationData.cancellationPolicy,
        'businessMarketType': applicationData.businessMarketType,
        'businessFormationType': applicationData.businessFormationType,
        'businessLocationType': applicationData.businessLocationType,
        'numberOfLocations': applicationData.numberOfLocations
    };

    // Create text tabs for each field
    for (const [tabLabel, value] of Object.entries(fieldMappings)) {
        if (value) {
            textTabs.push({
                tabLabel: tabLabel,
                value: String(value)
            });
        }
    }

    const envelopeDefinition = {
        templateId: templateId,
        emailSubject: 'EzPay America - Merchant Application for Signature',
        emailBlurb: `Dear ${signerName}, please review and sign your merchant application for ${applicationData.legalBusinessName || 'your business'}.`,
        templateRoles: [
            {
                email: signerEmail,
                name: signerName,
                roleName: 'Signer',  // This should match the role name in your template
                tabs: {
                    textTabs: textTabs
                }
            }
        ],
        status: 'sent'
    };

    console.log('Creating envelope with template:', templateId);

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

        console.log('Starting DocuSign process for:', signerEmail);
        
        const accessToken = await getAccessToken();
        console.log('Got access token successfully');
        
        const envelope = await createEnvelope(accessToken, applicationData, signerEmail, signerName);
        console.log('Envelope created:', envelope.envelopeId);

        return Response.json({
            success: true,
            envelopeId: envelope.envelopeId,
            status: envelope.status,
            message: 'Application sent for signature'
        });

    } catch (error) {
        console.error('DocuSign error:', error.message, error.stack);
        
        // Check if it's a consent error
        if (error.message && error.message.includes('consent_required')) {
            return Response.json({ 
                error: 'DocuSign consent required. Please visit the DocuSign admin console to grant consent.',
                consentUrl: `https://account.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=${Deno.env.get('DOCUSIGN_INTEGRATION_KEY')}&redirect_uri=https://www.docusign.com`
            }, { status: 400 });
        }
        
        return Response.json({ 
            error: error.message || 'Unknown error',
            stack: error.stack,
            name: error.name
        }, { status: 500 });
    }
});