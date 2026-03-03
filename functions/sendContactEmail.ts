import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Escape HTML entities to prevent XSS in email content
const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

Deno.serve(async (req) => {
  try {
    const { name, email, phone, message } = await req.json();

    // Basic input validation
    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL");

    // Sanitize all user inputs before embedding in HTML
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || 'Not provided');
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const emailBody = {
      personalizations: [{
        to: [{ email: "mail@ezpayamerica.com" }],
        subject: `Contact Form: ${safeName}`
      }],
      from: { email: FROM_EMAIL },
      content: [{
        type: "text/html",
        value: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Message:</strong></p>
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
      const error = await response.text();
      throw new Error(`SendGrid error: ${error}`);
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});