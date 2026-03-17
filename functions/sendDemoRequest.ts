import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
};

const isValidPhone = (phone) => /^[\d\s\-\+\(\)]{7,20}$/.test(String(phone || ''));

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { contactName, email, phone, businessName, businessAddress, timeZone } = body;

    if (!contactName || !email || !phone || !businessName) {
      return Response.json({ error: 'Required fields are missing' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (!isValidPhone(phone)) {
      return Response.json({ error: 'Invalid phone number' }, { status: 400 });
    }
    if (String(contactName).length > 100 || String(businessName).length > 200) {
      return Response.json({ error: 'Field value too long' }, { status: 400 });
    }

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL");

    const safeContactName = escapeHtml(String(contactName).substring(0, 100));
    const safeEmail = escapeHtml(String(email).substring(0, 254));
    const safePhone = escapeHtml(String(phone).substring(0, 20));
    const safeBusinessName = escapeHtml(String(businessName).substring(0, 200));
    const safeBusinessAddress = escapeHtml(String(businessAddress || '').substring(0, 300));
    const safeTimeZone = escapeHtml(String(timeZone || '').substring(0, 50));

    const emailBody = {
      personalizations: [{
        to: [{ email: "mail@ezpayamerica.com" }],
        subject: `New Demo Request: ${safeBusinessName}`
      }],
      from: { email: FROM_EMAIL },
      reply_to: { email: safeEmail },
      content: [{
        type: "text/html",
        value: `
          <h2>New Demo Request Submitted</h2>
          <p><strong>Contact Name:</strong> ${safeContactName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Business Name:</strong> ${safeBusinessName}</p>
          <p><strong>Business Address:</strong> ${safeBusinessAddress}</p>
          <p><strong>Time Zone:</strong> ${safeTimeZone}</p>
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
      console.error('SendGrid error:', await response.text());
      return Response.json({ error: 'Failed to send demo request' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Demo request error:', error);
    return Response.json({ error: 'Failed to send demo request' }, { status: 500 });
  }
});