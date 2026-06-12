import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const STATUS_LABELS = {
  submitted: { label: 'Submitted', color: '#3b82f6' },
  under_review: { label: 'Under Review', color: '#f59e0b' },
  documents_needed: { label: 'Documents Needed', color: '#f97316' },
  approved: { label: 'Approved ✅', color: '#10b981' },
  declined: { label: 'Declined', color: '#ef4444' },
};

const STATUS_MESSAGES = {
  submitted: 'A merchant you referred has submitted their application. Our team will begin reviewing it shortly.',
  under_review: 'Great news! The merchant you referred is now under active review by our team.',
  documents_needed: 'The merchant you referred needs to provide additional documents to continue processing their application.',
  approved: '🎉 Excellent news! The merchant you referred has been approved! Your commission is on its way.',
  declined: 'Unfortunately, the merchant you referred was not approved at this time.',
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { event, data, old_data, changed_fields } = payload;

    // Only act on status changes
    if (!changed_fields?.includes('status') || !data?.status || data?.status === old_data?.status) {
      return Response.json({ skipped: true, reason: 'No status change detected' });
    }

    const application = data;
    const newStatus = application.status;

    // Find the affiliated referral via referral code stored in applicationData
    const refCode = application.applicationData?.refCode
      || application.applicationData?.referralCode
      || application.applicationData?.ref;

    if (!refCode) {
      return Response.json({ skipped: true, reason: 'No referral code on application' });
    }

    // Find the matching affiliate by referral code
    const affiliates = await base44.asServiceRole.entities.Affiliate.filter({ referralCode: refCode });
    if (!affiliates || affiliates.length === 0) {
      return Response.json({ skipped: true, reason: `No affiliate found for code: ${refCode}` });
    }

    const affiliate = affiliates[0];

    if (!affiliate.email) {
      return Response.json({ skipped: true, reason: 'Affiliate has no email' });
    }

    const statusInfo = STATUS_LABELS[newStatus] || { label: newStatus, color: '#6b7280' };
    const statusMessage = STATUS_MESSAGES[newStatus] || `The merchant you referred has a new status: ${newStatus}.`;

    const affiliateName = `${affiliate.firstName || ''} ${affiliate.lastName || ''}`.trim() || 'Partner';
    const businessName = application.dbaName || application.legalBusinessName || 'the referred merchant';
    const oldStatusLabel = STATUS_LABELS[old_data?.status]?.label || old_data?.status || 'N/A';

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">EzPay America</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">Affiliate Partner Update</p>
        </div>
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; margin-top: 0;">Hi ${affiliateName},</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${statusMessage}</p>

          <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin: 24px 0; border-left: 4px solid ${statusInfo.color};">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding: 6px 0; width: 40%;"><strong>Business:</strong></td>
                <td style="color: #111827; font-size: 14px; padding: 6px 0;">${businessName}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding: 6px 0;"><strong>Previous Status:</strong></td>
                <td style="color: #6b7280; font-size: 14px; padding: 6px 0;">${oldStatusLabel}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding: 6px 0;"><strong>New Status:</strong></td>
                <td style="padding: 6px 0;">
                  <span style="background: ${statusInfo.color}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: bold;">
                    ${statusInfo.label}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding: 6px 0;"><strong>Your Referral Code:</strong></td>
                <td style="color: #111827; font-size: 14px; padding: 6px 0; font-family: monospace; font-weight: bold;">${refCode}</td>
              </tr>
              ${newStatus === 'approved' ? `
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding: 6px 0;"><strong>Commission:</strong></td>
                <td style="color: #10b981; font-size: 14px; padding: 6px 0; font-weight: bold;">Pending processing</td>
              </tr>` : ''}
            </table>
          </div>

          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            Keep referring merchants to grow your earnings. You can view your dashboard for full details.
          </p>

          <p style="color: #9ca3af; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            Best regards,<br>The EzPay America Affiliate Team<br>
            <a href="tel:8653169625" style="color: #f59e0b;">(865) 316-9625</a>
          </p>
        </div>
        <div style="background: #f9fafb; padding: 16px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2025 EzPay America. All rights reserved.</p>
        </div>
      </div>
    `;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: affiliate.email,
      subject: `Referral Update: ${businessName} is now ${statusInfo.label} — EzPay America`,
      body: emailBody,
      from_name: 'EzPay America Affiliates',
    });

    console.log(`Notified affiliate ${affiliate.email} of status change to ${newStatus} for application ${application.id}`);
    return Response.json({ success: true, affiliateEmail: affiliate.email, newStatus });

  } catch (error) {
    console.error('Error in notifyAffiliateOnApplicationStatus:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});