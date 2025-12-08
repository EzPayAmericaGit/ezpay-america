Deno.serve(async (req) => {
    try {
        const body = await req.json();
        console.log("Received contact form data:", { name: body.name, email: body.email });
        
        const { name, email, phone, message } = body;

        const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
        const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL");

        console.log("SendGrid config:", { 
            hasApiKey: !!SENDGRID_API_KEY, 
            fromEmail: FROM_EMAIL 
        });

        if (!SENDGRID_API_KEY) {
            throw new Error("SENDGRID_API_KEY not configured");
        }
        
        if (!FROM_EMAIL) {
            throw new Error("SENDGRID_FROM_EMAIL not configured");
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
                    <hr>
                    <div style="white-space: pre-wrap; font-family: monospace;">${(message || '').replace(/\n/g, '<br>')}</div>
                `
            }]
        };

        console.log("Sending to SendGrid...");
        
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailBody)
        });

        console.log("SendGrid response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("SendGrid error response:", errorText);
            throw new Error(`SendGrid error (${response.status}): ${errorText}`);
        }

        console.log("Email sent successfully");
        return Response.json({ success: true });
    } catch (error) {
        console.error("Contact email error:", error.message);
        console.error("Full error:", error);
        return Response.json({ 
            error: error.message,
            details: error.toString()
        }, { status: 500 });
    }
});