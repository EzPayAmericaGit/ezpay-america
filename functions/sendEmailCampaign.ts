import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin user
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { campaignId } = await req.json();

    // Get campaign details
    const campaign = await base44.asServiceRole.entities.EmailCampaign.filter({ id: campaignId });
    if (!campaign || campaign.length === 0) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const campaignData = campaign[0];

    // Get recipient list based on target audience
    let recipients = [];
    
    if (campaignData.targetAudience === 'all') {
      const apps = await base44.asServiceRole.entities.MerchantApplication.list();
      const demos = await base44.asServiceRole.entities.DemoRequest.list();
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
      recipients = campaignData.customEmailList || [];
    }

    // Remove duplicates
    recipients = [...new Set(recipients)];

    // Update campaign status
    await base44.asServiceRole.entities.EmailCampaign.update(campaignId, {
      status: 'sending',
      totalRecipients: recipients.length
    });

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');

    let sent = 0;
    let bounced = 0;

    // Send emails in batches
    for (const email of recipients) {
      try {
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
            subject: campaignData.subject,
            content: [{
              type: 'text/html',
              value: campaignData.content
            }]
          })
        });

        if (response.ok) {
          sent++;
        } else {
          bounced++;
        }
      } catch (error) {
        console.error(`Failed to send to ${email}:`, error);
        bounced++;
      }
    }

    // Update campaign with results
    await base44.asServiceRole.entities.EmailCampaign.update(campaignId, {
      status: 'sent',
      sentDate: new Date().toISOString(),
      sent,
      bounced
    });

    return Response.json({ 
      success: true, 
      sent, 
      bounced,
      total: recipients.length 
    });
  } catch (error) {
    console.error('Campaign send error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});