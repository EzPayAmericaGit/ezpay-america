import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const escapeHtml = (str) => String(str || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
  .trim();

const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
};

const sanitize = (str, maxLen = 500) => escapeHtml(String(str || '').substring(0, maxLen));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (String(message).length > 2000) {
      return Response.json({ error: 'Message too long (max 2000 chars)' }, { status: 400 });
    }
    if (String(name).length > 100) {
      return Response.json({ error: 'Name too long' }, { status: 400 });
    }

    const safeName = sanitize(name, 100);
    const safeEmail = sanitize(email, 254);
    const safePhone = sanitize(phone, 20);
    const safeMessage = sanitize(message, 2000);

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');

    const emailResp = await fetch('https://api.sendgrid.com/v3/mail/send', {
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
                <p><strong>Email:</strong> ${safeEmail}</p>
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

    if (!emailResp.ok) {
      console.error('SendGrid error:', await emailResp.text());
      return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }

    // SMS via Twilio — use sanitized plain-text values (no HTML)
    const TWILIO_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    const TWILIO_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    const TWILIO_FROM = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM) {
      // Use raw (not HTML-escaped) values for SMS, but still length-limited
      const plainName = String(name).replace(/[^\w\s\-.,]/g, '').substring(0, 50);
      const plainPhone = String(phone || 'N/A').replace(/[^\d\+\-\(\)\s]/g, '').substring(0, 20);
      const plainEmail = String(email).substring(0, 80);
      const plainMsg = String(message).replace(/[^\w\s\-.,!?@#]/g, '').substring(0, 120);

      const smsBody = `New EzPay help request!\nName: ${plainName}\nPhone: ${plainPhone}\nEmail: ${plainEmail}\nMsg: ${plainMsg}`;

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
    console.error('Help request error:', error);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
});