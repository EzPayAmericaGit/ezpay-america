import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

const VALID_AUDIENCES = new Set([
  'all', 'pending_applications', 'approved_merchants', 'demo_requests', 'website_visitors', 'custom'
]);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { campaignId } = await req.json();

    if (!campaignId || typeof campaignId !== 'string' || campaignId.length > 100) {
      return Response.json({ error: 'Valid campaign ID required' }, { status: 400 });
    }

    const campaign = await base44.asServiceRole.entities.EmailCampaign.filter({ id: campaignId });
    if (!campaign || campaign.length === 0) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const campaignData = campaign[0];

    if (!VALID_AUDIENCES.has(campaignData.targetAudience)) {
      return Response.json({ error: 'Invalid target audience' }, { status: 400 });
    }

    let recipients = [];

    if (campaignData.targetAudience === 'all') {
      const [apps, demos] = await Promise.all([
        base44.asServiceRole.entities.MerchantApplication.list(),
        base44.asServiceRole.entities.DemoRequest.list()
      ]);
      recipients = [...apps.map(a => a.businessEmail), ...demos.map(d => d.email)];
    } else if (campaignData.targetAudience === 'pending_applications') {
      const apps = await base44.asServiceRole.entities.MerchantApplication.filter({ status: 'submitted' });
      recipients = apps.map(a => a.businessEmail);
    } else if (campaignData.targetAudience === 'approved_merchants') {
      const apps = await base44.asServiceRole.entities.MerchantApplication.filter({ status: 'approved' });
      recipients = apps.map(a => a.businessEmail);
    } else if (campaignData.targetAudience === 'demo_requests') {
      const demos = await base44.asServiceRole.entities.DemoRequest.list();
      recipients = demos.map(d => d.email);
    } else if (campaignData.targetAudience === 'custom') {
      recipients = (campaignData.customEmailList || []);
    }

    // Deduplicate and validate all emails — never send to invalid addresses
    recipients = [...new Set(recipients)].filter(isValidEmail);

    // Hard cap to prevent runaway sends
    if (recipients.length > 5000) {
      return Response.json({ error: 'Recipient list too large (max 5000)' }, { status: 400 });
    }

    await base44.asServiceRole.entities.EmailCampaign.update(campaignId, {
      status: 'sending',
      totalRecipients: recipients.length
    });

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');

    let sent = 0;
    let bounced = 0;

    for (const email of recipients) {
      try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email }] }],
            from: { email: FROM_EMAIL, name: 'EzPay America' },
            subject: campaignData.subject,
            content: [{ type: 'text/html', value: campaignData.content }]
          })
        });
        response.ok ? sent++ : bounced++;
      } catch {
        bounced++;
      }
    }

    await base44.asServiceRole.entities.EmailCampaign.update(campaignId, {
      status: 'sent',
      sentDate: new Date().toISOString(),
      sent,
      bounced
    });

    return Response.json({ success: true, sent, bounced, total: recipients.length });
  } catch (error) {
    console.error('Campaign send error:', error);
    return Response.json({ error: 'Failed to send campaign' }, { status: 500 });
  }
});