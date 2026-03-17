import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const VALID_STATUSES = new Set(['under_review', 'documents_needed', 'approved', 'declined', 'submitted']);

const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

const escapeHtml = (str) => String(str || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { applicationId, newStatus, applicantEmail, applicantName } = await req.json();

    if (!applicationId || !newStatus || !applicantEmail) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isValidEmail(applicantEmail)) {
      return Response.json({ error: 'Invalid applicant email address' }, { status: 400 });
    }

    if (!VALID_STATUSES.has(newStatus)) {
      return Response.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Check notification preferences
    const preferences = await base44.asServiceRole.entities.NotificationPreference.filter({
      userEmail: applicantEmail
    });
    const shouldNotify = preferences.length === 0 || preferences[0].applicationStatusChange !== false;

    if (!shouldNotify) {
      return Response.json({ message: 'User has disabled this notification type' });
    }

    const safeApplicantName = escapeHtml(String(applicantName || 'there').substring(0, 100));
    const safeApplicationId = escapeHtml(String(applicationId).substring(0, 100));
    const safeStatus = escapeHtml(newStatus.replace(/_/g, ' ').toUpperCase());

    const statusMessages = {
      under_review: {
        subject: 'Application Under Review - EzPay America',
        message: 'Your merchant application is currently under review. Our team is carefully reviewing your information and will contact you soon.'
      },
      documents_needed: {
        subject: 'Additional Documents Required - EzPay America',
        message: 'We need additional documents to process your application. Please log in to your account or contact us at (865) 316-9625 for more information.'
      },
      approved: {
        subject: 'Congratulations! Application Approved - EzPay America',
        message: 'Great news! Your merchant application has been approved. Our onboarding team will contact you within 24 hours to complete the setup process.'
      },
      declined: {
        subject: 'Application Status Update - EzPay America',
        message: 'Thank you for your interest in EzPay America. Unfortunately, we are unable to approve your application at this time. Please contact us at (865) 316-9625 to discuss alternative options.'
      }
    };

    const statusInfo = statusMessages[newStatus] || {
      subject: 'Application Status Update - EzPay America',
      message: `Your application status has been updated.`
    };

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: applicantEmail }] }],
        from: { email: FROM_EMAIL, name: 'EzPay America' },
        subject: statusInfo.subject,
        content: [{
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">EzPay America</h1>
              </div>
              <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb;">
                <h2 style="color: #111827; margin-top: 0;">Hello ${safeApplicantName},</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">${statusInfo.message}</p>
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    <strong>Application ID:</strong> ${safeApplicationId}<br>
                    <strong>Status:</strong> ${safeStatus}
                  </p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="tel:8653169625" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Call (865) 316-9625
                  </a>
                </div>
                <p style="color: #9ca3af; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  Best regards,<br>The EzPay America Team
                </p>
              </div>
              <div style="background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">© 2025 EzPay America. All rights reserved.</p>
              </div>
            </div>
          `
        }]
      })
    });

    if (!response.ok) {
      console.error('SendGrid error:', await response.text());
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ success: true, message: 'Application status update email sent successfully' });
  } catch (error) {
    console.error('Error sending application status update:', error);
    return Response.json({ error: 'Failed to send status update' }, { status: 500 });
  }
});