import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { applicationData } = await req.json();

    if (!applicationData) {
      return Response.json({ error: 'Missing application data' }, { status: 400 });
    }

    const safeLegalBusinessName = escapeHtml(String(applicationData.legalBusinessName || '').substring(0, 200));
    const safeDbaName = escapeHtml(String(applicationData.dbaName || '').substring(0, 200));
    const safeOwnerFullName = escapeHtml(String(applicationData.ownerFullName || '').substring(0, 100));
    const safeBusinessEmail = escapeHtml(String(applicationData.businessEmail || '').substring(0, 254));
    const safeBusinessPhone = escapeHtml(String(applicationData.businessPhone || '').substring(0, 30));
    const safeMonthlyVolume = escapeHtml(String(applicationData.monthlyVolume || '').substring(0, 20));
    const safeBusinessMarketType = escapeHtml(String(applicationData.businessMarketType || '').substring(0, 50));

    const docList = [
      applicationData.driversLicenseUrl ? "Driver's License" : null,
      applicationData.voidedCheckUrl ? "Voided Check" : null,
      ...(applicationData.additionalDocuments || []).map(d => d.name)
    ].filter(Boolean).join(", ") || "None";

    // --- 1. Internal notification to EzPay America team ---
    const internalHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#d97706;">New Merchant Application Submitted</h2>
        <p><strong>Business Name:</strong> ${safeLegalBusinessName}</p>
        <p><strong>DBA:</strong> ${safeDbaName}</p>
        <p><strong>Owner:</strong> ${safeOwnerFullName}</p>
        <p><strong>Email:</strong> ${safeBusinessEmail}</p>
        <p><strong>Phone:</strong> ${safeBusinessPhone}</p>
        <p><strong>Monthly Volume:</strong> $${safeMonthlyVolume}</p>
        <p><strong>Business Type:</strong> ${safeBusinessMarketType}</p>
        <p><strong>Documents:</strong></p>
        <ul>
          <li>Driver's License: ${applicationData.driversLicenseUrl ? '✓ Uploaded' : 'Not provided'}</li>
          <li>Voided Check: ${applicationData.voidedCheckUrl ? '✓ Uploaded' : 'Not provided'}</li>
          <li>Additional Documents: ${parseInt(applicationData.additionalDocuments?.length) || 0}</li>
        </ul>
        <p style="color:#b91c1c;"><strong>⚠ Sensitive data (SSN, bank details, Tax ID) is NOT included in this email. Review the full application in the admin dashboard.</strong></p>
      </div>
    `;

    // --- 2. Merchant confirmation email ---
    const merchantHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
        <div style="background:linear-gradient(135deg,#f59e0b,#ea580c);padding:32px 24px;border-radius:8px 8px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">Application Received!</h1>
          <p style="color:#fff;margin:8px 0 0;opacity:0.9;">EzPay America Merchant Services</p>
        </div>
        <div style="background:#fff;padding:32px 24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
          <p style="font-size:16px;">Hi <strong>${safeOwnerFullName}</strong>,</p>
          <p>Thank you for applying to <strong>EzPay America</strong>! We've successfully received your merchant application and all uploaded documents.</p>
          
          <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px;border-radius:4px;margin:24px 0;">
            <p style="margin:0;font-weight:bold;color:#92400e;">Application Summary</p>
            <p style="margin:8px 0 0;color:#78350f;">
              Business: <strong>${safeLegalBusinessName}</strong><br/>
              Monthly Volume: <strong>$${safeMonthlyVolume}</strong><br/>
              Documents Uploaded: <strong>${docList}</strong>
            </p>
          </div>

          <p>Our team will review your application within <strong>24–48 business hours</strong> and reach out to you at this email or by phone at <strong>${safeBusinessPhone}</strong>.</p>

          <p>If you have any questions in the meantime, please don't hesitate to reach out:</p>
          <ul style="padding-left:20px;">
            <li>📞 <a href="tel:8653169625" style="color:#d97706;">(865) 316-9625</a></li>
            <li>📧 <a href="mailto:info@ezpayamerica.com" style="color:#d97706;">info@ezpayamerica.com</a></li>
          </ul>

          <p style="margin-top:32px;">Thank you for choosing EzPay America!</p>
          <p><strong>The EzPay America Team</strong></p>
          
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;"/>
          <p style="font-size:12px;color:#9ca3af;text-align:center;">
            EzPay America | (865) 316-9625 | info@ezpayamerica.com<br/>
            This is an automated confirmation. Please do not reply to this email.
          </p>
        </div>
      </div>
    `;

    // Use the platform's SendEmail integration which handles proper authentication
    const emailPromises = [
      base44.asServiceRole.integrations.Core.SendEmail({
        to: 'info@ezpayamerica.com',
        subject: `New Merchant Application: ${safeLegalBusinessName}`,
        body: internalHtml,
        from_name: 'EzPay America Applications'
      })
    ];

    if (applicationData.businessEmail) {
      emailPromises.push(
        base44.asServiceRole.integrations.Core.SendEmail({
          to: applicationData.businessEmail.toLowerCase(),
          subject: 'Your EzPay America Application Has Been Received',
          body: merchantHtml,
          from_name: 'EzPay America'
        })
      );
    }

    await Promise.all(emailPromises);

    return Response.json({ success: true });
  } catch (error) {
    console.error('Application notification error:', error);
    return Response.json({ error: 'Failed to send notification' }, { status: 500 });
  }
});