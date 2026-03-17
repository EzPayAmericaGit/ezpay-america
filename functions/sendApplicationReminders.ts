import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const escapeHtml = (str) => String(str || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This function is called by a scheduled automation — verify admin or service context
    let user = null;
    try { user = await base44.auth.me(); } catch {}
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');

    if (!SENDGRID_API_KEY || !FROM_EMAIL) {
      return Response.json({ error: 'Email not configured' }, { status: 500 });
    }

    const now = new Date();
    const cutoff48h = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
    const cutoff7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch applications that need reminders
    const allApps = await base44.asServiceRole.entities.MerchantApplication.list('-created_date');

    const toRemind = allApps.filter(app => {
      const created = app.created_date;
      // New submission sitting idle for 48h+
      if (app.status === 'submitted' && created <= cutoff48h) return true;
      // Docs needed reminder after 48h
      if (app.status === 'documents_needed' && created <= cutoff48h) return true;
      // Gentle follow-up after 7 days still in review
      if (app.status === 'under_review' && created <= cutoff7d) return true;
      return false;
    });

    const reminderMessages = {
      submitted: {
        subject: 'Your EzPay America Application – Action Needed',
        headline: 'Your application is waiting to be reviewed',
        body: 'We noticed your merchant application was submitted but has not yet been moved into review. Our team will be in touch shortly. If you have questions or would like to expedite your review, please give us a call.',
      },
      documents_needed: {
        subject: 'Important: Documents Still Needed – EzPay America',
        headline: 'We still need documents to process your application',
        body: 'Your merchant application requires additional documents before we can proceed. Please log in to your account or contact us directly at <strong>(865) 316-9625</strong> so we can help you complete this step quickly.',
      },
      under_review: {
        subject: 'Application Update – EzPay America',
        headline: 'Your application is still under review',
        body: 'Your merchant application has been with our underwriting team for a little while. We want to make sure you know we haven\'t forgotten about you! If you have any questions or updates to provide, please don\'t hesitate to reach out.',
      },
    };

    let sent = 0;
    let skipped = 0;
    const errors = [];

    for (const app of toRemind) {
      if (!app.businessEmail) { skipped++; continue; }

      const msg = reminderMessages[app.status];
      if (!msg) { skipped++; continue; }

      const safeBusinessName = escapeHtml(String(app.legalBusinessName || 'your business').substring(0, 200));
      const safeOwnerName = escapeHtml(String(app.ownerFullName || 'there').substring(0, 100));

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 26px;">EzPay America</h1>
          </div>
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${safeOwnerName},</h2>
            <h3 style="color: #f59e0b;">${msg.headline}</h3>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${msg.body}</p>
            <p style="color: #4b5563; font-size: 14px; margin-top: 20px;">
              <strong>Application for:</strong> ${safeBusinessName}
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:8653169625" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Call (865) 316-9625
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 13px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Best regards,<br>The EzPay America Team<br>
              <a href="mailto:mail@ezpayamerica.com" style="color: #f59e0b;">mail@ezpayamerica.com</a>
            </p>
          </div>
          <div style="background: #f9fafb; padding: 16px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2025 EzPay America. All rights reserved.</p>
          </div>
        </div>
      `;

      try {
        const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: app.businessEmail }] }],
            from: { email: FROM_EMAIL, name: 'EzPay America' },
            subject: msg.subject,
            content: [{ type: 'text/html', value: html }],
          }),
        });

        if (res.ok) {
          sent++;
          // Log reminder in notes so we don't over-remind
          const existingNotes = app.notes || '';
          const reminderNote = `[Reminder sent ${now.toISOString().split('T')[0]} - status: ${app.status}]`;
          if (!existingNotes.includes(reminderNote)) {
            await base44.asServiceRole.entities.MerchantApplication.update(app.id, {
              notes: existingNotes ? `${existingNotes}\n${reminderNote}` : reminderNote
            });
          }
        } else {
          skipped++;
          errors.push(`Failed to send to ${app.businessEmail}: ${res.status}`);
        }
      } catch (e) {
        skipped++;
        errors.push(`Error for ${app.businessEmail}: ${e.message}`);
      }
    }

    console.log(`Application reminders: ${sent} sent, ${skipped} skipped, ${toRemind.length} evaluated`);

    return Response.json({
      success: true,
      evaluated: toRemind.length,
      sent,
      skipped,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Reminder function error:', error);
    return Response.json({ error: 'Failed to process reminders' }, { status: 500 });
  }
});