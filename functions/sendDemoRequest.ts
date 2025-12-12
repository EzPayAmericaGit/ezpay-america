import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const { contactName, email, phone, businessName, businessAddress, timeZone } = await req.json();

        const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
        const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL");

        const emailBody = {
            personalizations: [{
                to: [{ email: "mail@ezpayamerica.com" }],
                subject: `New Demo Request: ${businessName}`
            }],
            from: { email: FROM_EMAIL },
            content: [{
                type: "text/html",
                value: `
                    <h2>New Demo Request Submitted</h2>
                    <p><strong>Contact Name:</strong> ${contactName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Business Name:</strong> ${businessName}</p>
                    <p><strong>Business Address:</strong> ${businessAddress}</p>
                    <p><strong>Time Zone:</strong> ${timeZone}</p>
                    <p>Please contact this prospect within 24 hours.</p>
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