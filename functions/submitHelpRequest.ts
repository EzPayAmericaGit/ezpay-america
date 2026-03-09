import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sanitize = (str) => String(str || '').replace(/[<>&"']/g, (c) => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c])).trim();
    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safePhone = sanitize(phone);
    const safeMessage = sanitize(message);

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');

    // Send email to mail@ezpayamerica.com
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: 'mail@ezpayamerica.com' }] }],
        from: { email: FROM_EMAIL, name: 'EzPay America Widget' },
        reply_to: { email: safeEmail, name: safeName },
        subject: `New Help Request from ${safeName}`,
        content: [{
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 30px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">New Help Widget Request</h1>
              </div>
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb;">
                <p><strong>Name:</strong> ${safeName}</p>
                <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
                <p><strong>Phone:</strong> ${safePhone || 'Not provided'}</p>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p><strong>Message:</strong></p>
                <p style="background: #f9fafb; padding: 15px; border-radius: 8px; color: #374151;">${safeMessage.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
          `
        }]
      })
    });

    // Send SMS via Twilio to notify the team
    const TWILIO_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_FROM = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM) {
      const smsBody = `New EzPay help request!\nName: ${name}\nPhone: ${phone || 'N/A'}\nEmail: ${email}\nMsg: ${message.substring(0, 120)}`;
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: TWILIO_FROM,
          To: '+18653169625',
          Body: smsBody
        })
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});