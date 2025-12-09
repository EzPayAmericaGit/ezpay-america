import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email } = await req.json();

    // Find the "special offer" campaign
    const campaigns = await base44.asServiceRole.entities.EmailCampaign.filter({ 
      name: 'special offer' 
    });
    
    if (!campaigns || campaigns.length === 0) {
      return Response.json({ error: 'Special offer campaign not found' }, { status: 404 });
    }

    const campaign = campaigns[0];
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');

    // Send email
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }]
        }],
        from: { email: FROM_EMAIL, name: 'EzPay America' },
        subject: campaign.subject,
        content: [{
          type: 'text/html',
          value: campaign.content
        }]
      })
    });

    if (!response.ok) {
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Special offer email error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});