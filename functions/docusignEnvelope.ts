import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const DOCUSIGN_AUTH_SERVER = 'account-d.docusign.com'; // Use 'account.docusign.com' for production
const DOCUSIGN_BASE_URL = 'https://demo.docusign.net/restapi'; // Use 'https://na4.docusign.net/restapi' for production

async function getAccessToken() {
    const integrationKey = Deno.env.get('DOCUSIGN_INTEGRATION_KEY');
    const userId = Deno.env.get('DOCUSIGN_USER_ID');
    const privateKey = Deno.env.get('DOCUSIGN_PRIVATE_KEY');

    // Create JWT header
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };

    // Create JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: integrationKey,
        sub: userId,
        aud: DOCUSIGN_AUTH_SERVER,
        iat: now,
        exp: now + 3600,
        scope: 'signature impersonation'
    };

    // Base64URL encode
    const base64UrlEncode = (obj) => {
        const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
        const base64 = btoa(str);
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    };

    const headerEncoded = base64UrlEncode(header);
    const payloadEncoded = base64UrlEncode(payload);
    const signingInput = `${headerEncoded}.${payloadEncoded}`;

    // Import the private key and sign
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

    // Exchange JWT for access token
    const tokenResponse = await fetch(`https://${DOCUSIGN_AUTH_SERVER}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
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

    // Create the document content from application data
    const documentContent = `
MERCHANT APPLICATION

Business Information
====================
Legal Business Name: ${applicationData.legalBusinessName || ''}
DBA Name: ${applicationData.dbaName || ''}
Business Phone: ${applicationData.businessPhone || ''}
Business Email: ${applicationData.businessEmail || ''}
Owner Name: ${applicationData.ownerFullName || ''}
Business Address: ${applicationData.businessPhysicalAddress || ''}
Tax ID: ${applicationData.taxId || ''}
Business Formation: ${applicationData.businessFormationType || ''}
Date Business Started: ${applicationData.dateBusinessStarted || ''}
Business Market Type: ${applicationData.businessMarketType || ''}

Current Processing
==================
Currently Accept Cards: ${applicationData.currentlyAcceptCards || 'No'}
Current Processor: ${applicationData.currentProcessorName || 'N/A'}
Number of Locations: ${applicationData.numberOfLocations || '1'}

Products & Services
===================
Products Description: ${applicationData.productsDescription || ''}
Order Methods: ${applicationData.orderMethod?.join(', ') || ''}
Delivery Timeframe: ${applicationData.deliveryTimeframe || ''}
Geographic Areas: ${applicationData.geographicAreas || ''}
International Card %: ${applicationData.internationalCardPercentage || '0'}%

Terms & Conditions
==================
By signing below, I certify that all information provided is accurate and complete.
I authorize EzPay America to process this merchant application.

Signature: ___________________________

Date: ___________________________
`;

    const documentBase64 = btoa(unescape(encodeURIComponent(documentContent)));

    const envelopeDefinition = {
        emailSubject: 'EzPay America - Merchant Application for Signature',
        emailBlurb: 'Please review and sign the attached merchant application.',
        documents: [
            {
                documentBase64: documentBase64,
                name: 'Merchant Application',
                fileExtension: 'txt',
                documentId: '1'
            }
        ],
        recipients: {
            signers: [
                {
                    email: signerEmail,
                    name: signerName,
                    recipientId: '1',
                    routingOrder: '1',
                    tabs: {
                        signHereTabs: [
                            {
                                documentId: '1',
                                pageNumber: '1',
                                xPosition: '100',
                                yPosition: '700'
                            }
                        ],
                        dateSignedTabs: [
                            {
                                documentId: '1',
                                pageNumber: '1',
                                xPosition: '100',
                                yPosition: '750'
                            }
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

        // Get access token
        const accessToken = await getAccessToken();

        // Create and send envelope
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