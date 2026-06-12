import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const APPLY_URL = "https://ezpayamerica.com/ApplyOnline";

// Drip sequence: [{delay_hours, subject, html_fn}]
const DRIP_SEQUENCE = [
  {
    delay_hours: 0,
    subject: (data) => `${data.affiliateName} thinks you'd love EzPay America 👋`,
    html: (data) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1f2937">
        <div style="background:linear-gradient(135deg,#f59e0b,#ea580c);padding:40px 32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:white;font-size:28px;margin:0">You've Been Referred!</h1>
          <p style="color:rgba(255,255,255,0.9);margin-top:8px;font-size:16px">Zero-fee payment processing for ${data.businessName}</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="font-size:16px">Hi ${data.leadName},</p>
          <p>Your colleague <strong>${data.affiliateName}</strong> thought you'd be a great fit for <strong>EzPay America</strong> — and we think so too!</p>
          <p>We help ${data.businessType || "businesses"} like yours <strong>eliminate credit card processing fees entirely</strong> through our surcharge program. Here's what you get:</p>
          <ul style="line-height:2;color:#374151">
            <li>✅ <strong>$0 in transaction fees</strong> — ever</li>
            <li>✅ <strong>Free POS terminal</strong> or card reader</li>
            <li>✅ <strong>Next-day deposits</strong></li>
            <li>✅ <strong>No contracts</strong>, cancel anytime</li>
            <li>✅ <strong>24/7 US-based support</strong></li>
          </ul>
          <div style="text-align:center;margin:32px 0">
            <a href="${APPLY_URL}" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
              Apply Online — Takes 5 Minutes
            </a>
          </div>
          <p style="color:#6b7280;font-size:14px">Questions? Call us at <a href="tel:8653169625" style="color:#f59e0b">(865) 316-9625</a> or reply to this email.</p>
          <p>— The EzPay America Team</p>
        </div>
      </div>
    `
  },
  {
    delay_hours: 48,
    subject: (data) => `💰 How much are you paying in processing fees, ${data.leadName.split(" ")[0]}?`,
    html: (data) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1f2937">
        <div style="background:#1f2937;padding:32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#f59e0b;font-size:26px;margin:0">Are You Overpaying?</h1>
          <p style="color:#9ca3af;margin-top:8px">The average merchant pays $300–$800/month in fees</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hi ${data.leadName.split(" ")[0]},</p>
          <p>Just following up from our last email. Did you know most ${data.businessType || "business"} owners pay <strong>2–4% on every card transaction</strong>?</p>
          <p>On <strong>$20,000/month in sales</strong>, that's up to <strong>$800 per month</strong> — over <strong>$9,600 per year</strong> — going straight to the processor.</p>
          <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:4px;margin:20px 0">
            <p style="margin:0;font-weight:bold;color:#92400e">With EzPay America's surcharge program, that number becomes $0.</p>
            <p style="margin:8px 0 0;color:#78350f;font-size:14px">The small convenience fee is passed to the customer — fully legal in all 50 states.</p>
          </div>
          <p>Ready to stop paying fees? It only takes 5 minutes to apply:</p>
          <div style="text-align:center;margin:24px 0">
            <a href="${APPLY_URL}" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
              Start My Free Application →
            </a>
          </div>
          <p style="color:#6b7280;font-size:14px">— The EzPay America Team | (865) 316-9625</p>
        </div>
      </div>
    `
  },
  {
    delay_hours: 120, // 5 days
    subject: (data) => `Free equipment + zero fees — still interested, ${data.leadName.split(" ")[0]}?`,
    html: (data) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1f2937">
        <div style="background:linear-gradient(135deg,#059669,#047857);padding:32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:white;font-size:26px;margin:0">🎁 Free Equipment Offer</h1>
          <p style="color:rgba(255,255,255,0.85);margin-top:8px">For approved merchants only</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hi ${data.leadName.split(" ")[0]},</p>
          <p>We know you're busy running ${data.businessName}, so we'll keep this short.</p>
          <p>Approved EzPay merchants get:</p>
          <div style="display:grid;gap:12px;margin:20px 0">
            ${[
              ["🖥️", "Free countertop terminal or POS system (no lease, no deposit)"],
              ["📱", "Free mobile card reader for on-the-go payments"],
              ["💳", "Free virtual terminal for phone orders"],
              ["⚡", "Next-day funding to your bank account"],
            ].map(([emoji, text]) => `
              <div style="display:flex;align-items:flex-start;gap:12px;padding:12px;background:#f9fafb;border-radius:8px">
                <span style="font-size:20px">${emoji}</span>
                <span style="font-size:14px;color:#374151">${text}</span>
              </div>
            `).join("")}
          </div>
          <div style="text-align:center;margin:28px 0">
            <a href="${APPLY_URL}" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
              Claim Your Free Equipment →
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px">Limited equipment availability. Apply today to reserve yours.</p>
          <p style="color:#6b7280;font-size:14px">— The EzPay America Team | (865) 316-9625</p>
        </div>
      </div>
    `
  },
  {
    delay_hours: 240, // 10 days
    subject: (data) => `Last follow-up — EzPay America for ${data.businessName}`,
    html: (data) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1f2937">
        <div style="background:#1f2937;padding:32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;font-size:24px;margin:0">One Last Note</h1>
          <p style="color:#9ca3af;margin-top:8px;font-size:15px">We don't want to keep filling your inbox</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hi ${data.leadName.split(" ")[0]},</p>
          <p>This is our last follow-up. We don't want to be a bother — but we do want to make sure you at least had the chance to see what EzPay America can do for ${data.businessName}.</p>
          <p>In summary:</p>
          <ul style="line-height:2;color:#374151">
            <li><strong>Zero processing fees</strong> forever</li>
            <li><strong>Free equipment</strong> to get started</li>
            <li><strong>No long-term contracts</strong></li>
            <li><strong>Referred by ${data.affiliateName}</strong> — someone who trusts us</li>
          </ul>
          <p>If you're ever ready, we're here. Just click below or call us directly.</p>
          <div style="text-align:center;margin:24px 0">
            <a href="${APPLY_URL}" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
              Apply When You're Ready →
            </a>
          </div>
          <p style="color:#6b7280;font-size:14px">— The EzPay America Team<br/>(865) 316-9625 | mail@ezpayamerica.com</p>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">You were referred by ${data.affiliateName} using code ${data.affiliateCode}. To unsubscribe from future emails, reply with "unsubscribe".</p>
        </div>
      </div>
    `
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { leadEmail, leadName, businessName, businessType, affiliateName, affiliateCode } = body;

    if (!leadEmail || !leadName) {
      return Response.json({ error: "leadEmail and leadName are required" }, { status: 400 });
    }

    const data = { leadEmail, leadName, businessName: businessName || "your business", businessType, affiliateName: affiliateName || "a colleague", affiliateCode: affiliateCode || "" };

    // Send all drip emails, scheduling them with setTimeout simulation via sequential sends
    // For immediate send (delay=0) we send right away
    // For future emails we record them in a DripQueue entity or just send all now with note
    // Since we don't have a scheduler here, we'll send email 1 immediately
    // and use the scheduled automation approach for follow-ups via the AffiliateReferral record
    // For simplicity and reliability: send email 1 now, store drip state for automation pickup

    const email1 = DRIP_SEQUENCE[0];
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: leadEmail,
      subject: email1.subject(data),
      body: email1.html(data),
      from_name: "EzPay America",
    });

    // Store follow-up data in the referral notes for the scheduled drip automation to pick up
    // We store a flag in the AffiliateReferral so the drip automation knows to send follow-ups
    // The automation will query leads with source=referral_portal and drip_step<4 and fire next email
    // We'll persist drip data via a simple approach: store next send time on the referral
    const referrals = await base44.asServiceRole.entities.AffiliateReferral.filter({
      referredEmail: leadEmail,
      affiliateCode: affiliateCode
    });

    if (referrals.length > 0) {
      const ref = referrals[0];
      const nextSendAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      await base44.asServiceRole.entities.AffiliateReferral.update(ref.id, {
        notes: JSON.stringify({
          drip_step: 1,
          next_send_at: nextSendAt,
          drip_data: data,
          original_notes: ref.notes || ""
        })
      });
    }

    return Response.json({ success: true, message: "Drip sequence started, email 1 sent" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});