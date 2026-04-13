import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import sgMail from 'npm:@sendgrid/mail@8.1.0';

sgMail.setApiKey(Deno.env.get("SENDGRID_API_KEY"));

const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL") || "noreply@ezpayamerica.com";
const FROM_NAME = "EzPay America";
const APPLY_URL = "https://ezpayamerica.com/ApplyOnline";

// Validation rules
function validateReferralData(referral) {
  const issues = [];

  if (!referral.referredEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referral.referredEmail)) {
    issues.push("Invalid or missing email address");
  }

  if (!referral.referredPhone || referral.referredPhone.replace(/\D/g, "").length < 10) {
    issues.push("Phone number appears invalid (less than 10 digits)");
  }

  if (!referral.referredBusiness || referral.referredBusiness.trim().length < 2) {
    issues.push("Business name is missing or too short");
  }

  if (!referral.affiliateId) {
    issues.push("No affiliate ID linked to referral");
  }

  if (!referral.affiliateCode) {
    issues.push("No affiliate referral code");
  }

  return issues;
}

// Interpolate template placeholders
function interpolate(str, data) {
  return str
    .replace(/{{leadName}}/g, data.leadName || "")
    .replace(/{{businessName}}/g, data.businessName || "your business")
    .replace(/{{affiliateName}}/g, data.affiliateName || "a colleague")
    .replace(/{{affiliateCode}}/g, data.affiliateCode || "")
    .replace(/{{businessType}}/g, data.businessType || "business")
    .replace(/{{applyUrl}}/g, APPLY_URL);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { referralId } = body;

    // Support bulk validation (no referralId = validate all pending leads)
    const referralsToCheck = referralId
      ? await base44.asServiceRole.entities.AffiliateReferral.filter({ id: referralId })
      : await base44.asServiceRole.entities.AffiliateReferral.filter({ status: "lead" });

    const results = [];

    for (const referral of referralsToCheck) {
      const issues = validateReferralData(referral);
      const isValid = issues.length === 0;

      // Build update
      const update = {};

      if (!isValid) {
        // Mark as having validation issues in notes
        let existingNotes = {};
        try { if (referral.notes?.startsWith("{")) existingNotes = JSON.parse(referral.notes); } catch {}
        update.notes = JSON.stringify({
          ...existingNotes,
          validation_issues: issues,
          validated_at: new Date().toISOString(),
          is_valid: false,
        });
      } else {
        // Valid referral — check for duplicate email (same email referred by different affiliate)
        const duplicates = await base44.asServiceRole.entities.AffiliateReferral.filter({
          referredEmail: referral.referredEmail
        });
        const isDuplicate = duplicates.length > 1;

        let existingNotes = {};
        try { if (referral.notes?.startsWith("{")) existingNotes = JSON.parse(referral.notes); } catch {}

        update.notes = JSON.stringify({
          ...existingNotes,
          validation_issues: [],
          validated_at: new Date().toISOString(),
          is_valid: true,
          is_duplicate: isDuplicate,
        });

        // Auto-advance: if still "lead" and valid, keep as lead (human still needs to contact)
        // But if referral has a valid email+phone, send a confirmation to the affiliate
        if (referral.status === "lead" && !existingNotes.welcome_sent) {
          const affiliate = referral.affiliateId
            ? (await base44.asServiceRole.entities.Affiliate.filter({ id: referral.affiliateId }))[0]
            : null;

          if (affiliate) {
            // Notify affiliate their referral was received and validated
            const notifyHtml = `
              <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
                <div style="background:linear-gradient(135deg,#10b981,#059669);padding:28px 32px;border-radius:12px 12px 0 0">
                  <h2 style="color:white;margin:0">✅ Your Referral Was Received!</h2>
                </div>
                <div style="background:white;padding:28px 32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
                  <p>Hi ${affiliate.firstName},</p>
                  <p>Great news — we've received and validated your referral for <strong>${referral.referredBusiness || referral.referredName}</strong>.</p>
                  <p>Our sales team will be reaching out to them shortly. You'll be notified when they convert into a merchant!</p>
                  ${isDuplicate ? `<p style="color:#f59e0b"><strong>⚠️ Note:</strong> This email has been referred before. Commission is awarded to the first affiliate who referred them.</p>` : ""}
                  <p>Keep sharing your referral link to earn more commissions!</p>
                  <p>— The EzPay America Team</p>
                </div>
              </div>
            `;

            await sgMail.send({
              to: affiliate.email,
              from: { email: FROM_EMAIL, name: FROM_NAME },
              subject: `✅ Referral received: ${referral.referredBusiness || referral.referredName}`,
              html: notifyHtml,
            });

            update.notes = JSON.stringify({
              ...existingNotes,
              ...(update.notes ? JSON.parse(update.notes) : {}),
              welcome_sent: true,
            });
          }

          // Check for custom email templates from DB (drip step 0)
          const templates = await base44.asServiceRole.entities.AffiliateEmailTemplate.filter({
            triggerEvent: "referral_submitted",
            isActive: true,
            dripStep: 0,
          });

          if (templates.length > 0) {
            const tpl = templates[0];
            const data = {
              leadName: referral.referredName || "there",
              businessName: referral.referredBusiness || "your business",
              affiliateName: affiliate ? `${affiliate.firstName} ${affiliate.lastName}` : "a colleague",
              affiliateCode: referral.affiliateCode || "",
              businessType: "",
            };
            await sgMail.send({
              to: referral.referredEmail,
              from: { email: FROM_EMAIL, name: FROM_NAME },
              subject: interpolate(tpl.subject, data),
              html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">${interpolate(tpl.bodyHtml, data)}</div>`,
            });
          }
        }
      }

      await base44.asServiceRole.entities.AffiliateReferral.update(referral.id, update);
      results.push({ id: referral.id, isValid, issues });
    }

    return Response.json({ success: true, validated: results.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});