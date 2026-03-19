import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { name, email, phone, message, firstName, lastName, businessName, service } = body;

    // Support both contact form and GetStarted form payloads
    const resolvedName = name || `${firstName || ''} ${lastName || ''}`.trim();
    const resolvedMessage = message || `Service Interest: ${service || 'General Inquiry'}\nBusiness: ${businessName || ''}`;
    const resolvedPhone = phone;

    if (!resolvedName || !email || !resolvedMessage) {
      return Response.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }
    if (String(resolvedName).length > 100) {
      return Response.json({ error: 'Name too long' }, { status: 400 });
    }
    if (String(resolvedMessage).length > 2000) {
      return Response.json({ error: 'Message too long (max 2000 characters)' }, { status: 400 });
    }

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL");

    const safeName = escapeHtml(String(resolvedName).substring(0, 100));
    const safeEmail = escapeHtml(String(email).substring(0, 254));
    const safePhone = escapeHtml(String(resolvedPhone || 'Not provided').substring(0, 20));
    const safeMessage = escapeHtml(String(resolvedMessage).substring(0, 2000)).replace(/\n/g, '<br>');
    const safeBusiness = escapeHtml(String(businessName || '').substring(0, 200));

    const emailBody = {
      personalizations: [{
        to: [{ email: "mail@ezpayamerica.com" }],
        subject: service ? `New Lead: ${service} – ${safeBusiness}` : `Contact Form: ${safeName}`
      }],
      from: { email: FROM_EMAIL },
      reply_to: { email: safeEmail },
      content: [{
        type: "text/html",
        value: `
          <h2>New Lead / Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          ${safeBusiness ? `<p><strong>Business:</strong> ${safeBusiness}</p>` : ''}
          <p><strong>Message / Details:</strong></p>
          <p>${safeMessage}</p>
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
      return Response.json({ error: 'Failed to send message' }, { status: 500 });
    }

    // Save lead to database using service role (works for unauthenticated users)
    base44.asServiceRole.entities.DemoRequest.create({
      contactName: resolvedName,
      email: String(email).substring(0, 254),
      phone: String(resolvedPhone || '').substring(0, 20),
      businessName: String(businessName || '').substring(0, 200),
      status: "pending"
    }).catch(err => console.error('DemoRequest save error:', err));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Contact email error:', error);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
});