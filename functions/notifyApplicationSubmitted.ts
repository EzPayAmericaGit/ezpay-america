import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { applicationData } = await req.json();

        const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
        const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL");

        // Send email to business owner
        const emailBody = {
            personalizations: [{
                to: [{ email: "contact@ezpayamerica.com" }],
                subject: `New Merchant Application: ${applicationData.legalBusinessName}`
            }],
            from: { email: FROM_EMAIL },
            content: [{
                type: "text/html",
                value: `
                    <h2>New Merchant Application Submitted</h2>
                    <p><strong>Business Name:</strong> ${applicationData.legalBusinessName}</p>
                    <p><strong>DBA:</strong> ${applicationData.dbaName}</p>
                    <p><strong>Owner:</strong> ${applicationData.ownerFullName}</p>
                    <p><strong>Email:</strong> ${applicationData.businessEmail}</p>
                    <p><strong>Phone:</strong> ${applicationData.businessPhone}</p>
                    <p><strong>Monthly Volume:</strong> $${applicationData.monthlyVolume}</p>
                    <p><strong>Business Type:</strong> ${applicationData.businessMarketType}</p>
                    <p><strong>Documents:</strong></p>
                    <ul>
                        <li>Driver's License: ${applicationData.driversLicenseUrl ? 'Uploaded' : 'Not provided'}</li>
                        <li>Voided Check: ${applicationData.voidedCheckUrl ? 'Uploaded' : 'Not provided'}</li>
                        <li>Additional Documents: ${applicationData.additionalDocuments?.length || 0}</li>
                    </ul>
                    <p>Please review the application in the admin dashboard.</p>
                `
            }]
        };

        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailBody)
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`SendGrid error: ${error}`);
        }

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});