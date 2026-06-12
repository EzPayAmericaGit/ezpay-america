import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { affiliateName, affiliateEmail, paypalEmail, amount, referralCount, payoutId } = await req.json();

    if (!affiliateEmail || !amount) {
      return Response.json({ error: 'affiliateEmail and amount are required' }, { status: 400 });
    }

    const firstName = affiliateName?.split(' ')[0] || 'Partner';

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: affiliateEmail,
      subject: `🎉 Your EzPay America Payout of $${parseFloat(amount).toFixed(2)} is on its way!`,
      from_name: 'EzPay America Affiliates',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
          <div style="background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 40px 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">💸 Payout Sent!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;">EzPay America Affiliate Program</p>
          </div>
          <div style="background: white; padding: 40px 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; color: #111827;">Hi <strong>${firstName}</strong>,</p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6;">
              Great news! We've queued a PayPal payout for your approved commissions.
            </p>

            <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
              <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Payout Amount</p>
              <p style="margin: 8px 0 0; color: #047857; font-size: 48px; font-weight: 900;">$${parseFloat(amount).toFixed(2)}</p>
              <p style="margin: 8px 0 0; color: #6b7280; font-size: 13px;">Covering ${referralCount} approved referral${referralCount !== 1 ? 's' : ''}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">PayPal Address</td>
                <td style="padding: 12px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">${paypalEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Arrival Time</td>
                <td style="padding: 12px 0; color: #111827; font-size: 14px; font-weight: 600; text-align: right;">1–3 business days</td>
              </tr>
              ${payoutId ? `<tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Reference ID</td>
                <td style="padding: 12px 0; color: #111827; font-size: 14px; font-family: monospace; text-align: right;">${payoutId.slice(0, 12)}…</td>
              </tr>` : ''}
            </table>

            <p style="color: #374151; font-size: 14px; line-height: 1.6;">
              Keep growing your earnings by sharing your referral link with more businesses.
              Every approved merchant = more money in your PayPal!
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://ezpayamerica.com/AffiliateDashboard"
                style="background: linear-gradient(135deg, #f59e0b, #ea580c); color: white; padding: 14px 32px;
                       border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
                View My Dashboard →
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
              EzPay America Affiliate Program · (865) 316-9625 · info@ezpayamerica.com<br/>
              © 2025 EzPay America. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Payout notification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});