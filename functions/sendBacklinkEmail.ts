import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const SENDGRID_FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');

    if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL) {
      return Response.json({ error: 'SendGrid not configured' }, { status: 500 });
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }]
        }],
        from: { email: SENDGRID_FROM_EMAIL, name: 'EzPay America' },
        subject: subject,
        content: [{
          type: 'text/plain',
          value: body
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('SendGrid error:', error);
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});