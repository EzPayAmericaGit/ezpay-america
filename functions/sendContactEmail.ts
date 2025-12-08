Deno.serve(async (req) => {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
        const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL");

        if (!SENDGRID_API_KEY || !FROM_EMAIL) {
            throw new Error("SendGrid configuration missing");
        }

        const emailBody = {
            personalizations: [{
                to: [{ email: "contact@ezpayamerica.com" }],
                subject: `Contact Form: ${name}`
            }],
            from: { 
                email: FROM_EMAIL,
                name: "EzPay America Website"
            },
            reply_to: {
                email: email,
                name: name
            },
            content: [{
                type: "text/html",
                value: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${(message || '').replace(/\n/g, '<br>')}</p>
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
            const errorText = await response.text();
            console.error("SendGrid error:", errorText);
            throw new Error(`SendGrid API error: ${response.status}`);
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error("Contact email error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});