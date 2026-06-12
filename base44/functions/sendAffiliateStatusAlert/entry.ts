import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Sends email alerts to affiliates and admin when referral status changes
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { referralId, newStatus, affiliateId } = await req.json();
    if (!referralId || !newStatus) return Response.json({ error: 'referralId and newStatus required' }, { status: 400 });

    // Load referral and affiliate
    const [referrals, affiliates] = await Promise.all([
      base44.asServiceRole.entities.AffiliateReferral.filter({ id: referralId }),
      affiliateId ? base44.asServiceRole.entities.Affiliate.filter({ id: affiliateId }) : Promise.resolve([]),
    ]);

    const referral = referrals[0];
    const affiliate = affiliates[0];

    if (!referral) return Response.json({ error: 'Referral not found' }, { status: 404 });

    const businessName = referral.referredBusiness || referral.referredName || "your referral";
    const affiliateName = affiliate ? `${affiliate.firstName} ${affiliate.lastName}` : "Affiliate";

    const statusMessages = {
      applied: { subject: "🎉 Your referral submitted an application!", body: `Great news! <strong>${businessName}</strong> has submitted a merchant application. We're reviewing it now.` },
      approved: { subject: "✅ Referral approved — commission incoming!", body: `<strong>${businessName}</strong> has been approved as a merchant! Your commission is being processed.` },
      processing: { subject: "⚙️ Referral is now processing", body: `<strong>${businessName}</strong> is now in the processing stage. Almost there!` },
      converted: { subject: "💰 Referral converted — commission earned!", body: `Congratulations! <strong>${businessName}</strong> is now an active EzPay America merchant. Your commission has been earned and will be released after the hold period.` },
      rejected: { subject: "ℹ️ Referral status update", body: `We wanted to let you know that <strong>${businessName}</strong> did not qualify at this time. Don't give up — keep referring businesses!` },
    };

    const msg = statusMessages[newStatus];
    if (!msg) return Response.json({ message: 'No alert configured for this status', sent: false });

    const results = [];

    // Send to affiliate
    if (affiliate?.email) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: affiliate.email,
        subject: msg.subject,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 24px; border-radius: 12px; color: white; margin-bottom: 24px;">
              <h1 style="margin: 0; font-size: 22px;">EzPay America Affiliates</h1>
            </div>
            <h2 style="color: #111827;">Hi ${affiliateName},</h2>
            <p style="color: #374151; font-size: 16px;">${msg.body}</p>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;"><strong>Business:</strong> ${businessName}</p>
              <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;"><strong>New Status:</strong> <span style="text-transform: capitalize; color: #059669; font-weight: bold;">${newStatus}</span></p>
              ${referral.commissionAmount ? `<p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;"><strong>Commission:</strong> <span style="color: #059669; font-weight: bold;">$${referral.commissionAmount}</span></p>` : ""}
            </div>
            <p style="color: #374151;">Track your referrals and earnings on your <a href="https://ezpayamerica.com/AffiliateDashboard" style="color: #d97706;">Affiliate Dashboard</a>.</p>
            <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">EzPay America Affiliate Program • mail@ezpayamerica.com</p>
          </div>
        `,
      });
      results.push({ to: affiliate.email, sent: true });
    }

    // Notify admin of conversion
    if (newStatus === "converted") {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: "mail@ezpayamerica.com",
        subject: `[Affiliate] New Conversion: ${businessName} by ${affiliateName}`,
        body: `
          <p><strong>${affiliateName}</strong> (${affiliate?.email}) has converted a referral.</p>
          <p><strong>Business:</strong> ${businessName}</p>
          <p><strong>Commission:</strong> $${referral.commissionAmount || 0}</p>
          <p>Log in to <a href="https://ezpayamerica.com/AffiliateAdmin">Affiliate Admin</a> to process payout.</p>
        `,
      });
      results.push({ to: "mail@ezpayamerica.com", sent: true });
    }

    return Response.json({ sent: true, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});