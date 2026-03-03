import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Escape HTML entities to prevent XSS in email content
const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

    // Sanitize all user-provided fields
    const safeLegalBusinessName = escapeHtml(applicationData.legalBusinessName);
    const safeDbaName = escapeHtml(applicationData.dbaName);
    const safeOwnerFullName = escapeHtml(applicationData.ownerFullName);
    const safeBusinessEmail = escapeHtml(applicationData.businessEmail);
    const safeBusinessPhone = escapeHtml(applicationData.businessPhone);
    const safeMonthlyVolume = escapeHtml(String(applicationData.monthlyVolume || ''));
    const safeBusinessMarketType = escapeHtml(applicationData.businessMarketType);

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
          <p>Please review the application in the admin dashboard.</p>
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
      const error = await response.text();
      throw new Error(`SendGrid error: ${error}`);
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});