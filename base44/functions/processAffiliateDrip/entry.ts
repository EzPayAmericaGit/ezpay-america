import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const APPLY_URL = "https://ezpayamerica.com/ApplyOnline";

// Drip steps 2, 3, 4 (step 1 is sent immediately in startAffiliateDrip)
const DRIP_STEPS = {
  1: {
    delay_hours: 48,
    subject: (d) => `💰 How much are you paying in processing fees, ${d.leadName.split(" ")[0]}?`,
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1f2937">
        <div style="background:#1f2937;padding:32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#f59e0b;font-size:26px;margin:0">Are You Overpaying?</h1>
          <p style="color:#9ca3af;margin-top:8px">The average merchant pays $300–$800/month in fees</p>
        </div>
        <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hi ${d.leadName.split(" ")[0]},</p>
          <p>Just following up. Did you know most ${d.businessType || "business"} owners pay <strong>2–4% on every card transaction</strong>?</p>
          <p>On <strong>$20,000/month</strong> in sales, that's up to <strong>$800/month</strong> — over <strong>$9,600/year</strong> in fees.</p>
          <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:4px;margin:20px 0">
            <p style="margin:0;font-weight:bold;color:#92400e">With EzPay America's surcharge program, that number becomes $0.</p>
          </div>
          <div style="text-align:center;margin:24px 0">
            <a href="${APPLY_URL}" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
              Start My Free Application →
            </a>
          </div>
          <p style="color:#6b7280;font-size:14px">— EzPay America | (865) 316-9625</p>
        </div>
      </div>
    `
  },
  2: {
    delay_hours: 120,
    subject: (d) => `Free equipment + zero fees — still interested, ${d.leadName.split(" ")[0]}?`,
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1f2937">
        <div style="background:linear-gradient(135deg,#059669,#047857);padding:32px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:white;font-size:26px;margin:0">🎁 Free Equipment for ${d.businessName}</h1>
        </div>
        <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hi ${d.leadName.split(" ")[0]},</p>
          <p>Approved EzPay merchants receive <strong>free POS equipment</strong> — no lease, no deposit, no catch.</p>
          <ul style="line-height:2.2;color:#374151">
            <li>🖥️ Free countertop terminal or POS system</li>
            <li>📱 Free mobile card reader</li>
            <li>💳 Free virtual terminal for phone orders</li>
            <li>⚡ Next-day funding to your bank</li>
          </ul>
          <div style="text-align:center;margin:28px 0">
            <a href="${APPLY_URL}" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block">
              Claim Your Free Equipment →
            </a>
          </div>
          <p style="color:#6b7280;font-size:14px">— EzPay America | (865) 316-9625</p>
        </div>
      </div>
    `
  },
  3: {
    delay_hours: 240,
    subject: (d) => `Last follow-up — EzPay America for ${d.businessName}`,
    html: (d) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1f2937">
        <div style="background:#1f2937;padding:32px;border-radius:12px 12px 0 0">
          <h1 style="color:white;font-size:24px;margin:0">One Last Note</h1>
        </div>
        <div style="background:white;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p>Hi ${d.leadName.split(" ")[0]},</p>
          <p>This is our last follow-up. We won't keep filling your inbox — but we want to make sure you had the chance to see what we can do for ${d.businessName}.</p>
          <ul style="line-height:2;color:#374151">
            <li><strong>Zero processing fees</strong> forever</li>
            <li><strong>Free equipment</strong> to get started</li>
            <li><strong>No long-term contracts</strong></li>
            <li><strong>Referred by ${d.affiliateName}</strong> — someone who trusts us</li>
          </ul>
          <div style="text-align:center;margin:24px 0">
            <a href="${APPLY_URL}" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
              Apply When You're Ready →
            </a>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin-top:24px">Referred by ${d.affiliateName} (${d.affiliateCode}). Reply "unsubscribe" to opt out.</p>
        </div>
      </div>
    `
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // This function is called by a scheduled automation every hour
    // It looks for referrals with pending drip steps that are due
    const now = new Date();

    // Get all referral_portal referrals that have drip state in notes
    const referrals = await base44.asServiceRole.entities.AffiliateReferral.filter({ source: "referral_portal" });

    let sent = 0;
    let errors = [];

    for (const ref of referrals) {
      let dripState = null;
      try {
        if (ref.notes && ref.notes.startsWith("{")) {
          dripState = JSON.parse(ref.notes);
        }
      } catch {
        continue;
      }

      if (!dripState || !dripState.drip_step || !dripState.next_send_at) continue;
      if (dripState.drip_step >= 4) continue; // All steps done

      const nextSend = new Date(dripState.next_send_at);
      if (now < nextSend) continue; // Not due yet

      const step = DRIP_STEPS[dripState.drip_step];
      if (!step) continue;

      const data = dripState.drip_data || {};

      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: ref.referredEmail,
          subject: step.subject(data),
          body: step.html(data),
          from_name: "EzPay America",
        });
        sent++;

        // Advance drip step
        const nextStep = dripState.drip_step + 1;
        const nextStepConfig = DRIP_STEPS[nextStep];
        const nextSendAt = nextStepConfig
          ? new Date(Date.now() + nextStepConfig.delay_hours * 60 * 60 * 1000).toISOString()
          : null;

        await base44.asServiceRole.entities.AffiliateReferral.update(ref.id, {
          notes: JSON.stringify({
            ...dripState,
            drip_step: nextStep,
            next_send_at: nextSendAt,
            last_sent_at: now.toISOString(),
          })
        });
      } catch (err) {
        errors.push({ id: ref.id, error: err.message });
      }
    }

    return Response.json({ success: true, processed: referrals.length, sent, errors });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});