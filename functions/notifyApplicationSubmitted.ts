import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

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

    const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
    const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL");

    if (!SENDGRID_API_KEY || !FROM_EMAIL) {
      return Response.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // NEVER include SSN, bank account numbers, routing numbers, Tax ID, or card data in emails
    const safeLegalBusinessName = escapeHtml(String(applicationData.legalBusinessName || '').substring(0, 200));
    const safeDbaName = escapeHtml(String(applicationData.dbaName || '').substring(0, 200));
    const safeOwnerFullName = escapeHtml(String(applicationData.ownerFullName || '').substring(0, 100));
    const safeBusinessEmail = escapeHtml(String(applicationData.businessEmail || '').substring(0, 254));
    const safeBusinessPhone = escapeHtml(String(applicationData.businessPhone || '').substring(0, 30));
    const safeMonthlyVolume = escapeHtml(String(applicationData.monthlyVolume || '').substring(0, 20));
    const safeBusinessMarketType = escapeHtml(String(applicationData.businessMarketType || '').substring(0, 50));

    const emailBody = {
      personalizations: [{
        to: [{ email: "mail@ezpayamerica.com" }],
        subject: `New Merchant Application: ${safeLegalBusinessName}`
      }],
      from: { email: FROM_EMAIL },
      content: [{
        type: "text/html",
        value: `
          <h2>New Merchant Application Submitted</h2>
          <p><strong>Business Name:</strong> ${safeLegalBusinessName}</p>
          <p><strong>DBA:</strong> ${safeDbaName}</p>
          <p><strong>Owner:</strong> ${safeOwnerFullName}</p>
          <p><strong>Email:</strong> ${safeBusinessEmail}</p>
          <p><strong>Phone:</strong> ${safeBusinessPhone}</p>
          <p><strong>Monthly Volume:</strong> $${safeMonthlyVolume}</p>
          <p><strong>Business Type:</strong> ${safeBusinessMarketType}</p>
          <p><strong>Documents:</strong></p>
          <ul>
            <li>Driver's License: ${applicationData.driversLicenseUrl ? 'Uploaded' : 'Not provided'}</li>
            <li>Voided Check: ${applicationData.voidedCheckUrl ? 'Uploaded' : 'Not provided'}</li>
            <li>Additional Documents: ${parseInt(applicationData.additionalDocuments?.length) || 0}</li>
          </ul>
          <p style="color:#b91c1c;"><strong>⚠ Sensitive data (SSN, bank details, Tax ID) is NOT included in this email for security. Please review the full application securely in the admin dashboard.</strong></p>
        `
      }]
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody)
    });

    if (!response.ok) {
      console.error('SendGrid error:', await response.text());
      return Response.json({ error: 'Failed to send notification' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Application notification error:', error);
    return Response.json({ error: 'Failed to send notification' }, { status: 500 });
  }
});