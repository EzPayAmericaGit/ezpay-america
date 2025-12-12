import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import sgMail from 'npm:@sendgrid/mail@8.1.4';

sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, newStatus, applicantEmail, applicantName } = await req.json();

    if (!applicationId || !newStatus || !applicantEmail) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check user notification preferences
    const preferences = await base44.asServiceRole.entities.NotificationPreference.filter({
      userEmail: applicantEmail
    });

    const shouldNotify = preferences.length === 0 || preferences[0].applicationStatusChange !== false;

    if (!shouldNotify) {
      return Response.json({ message: 'User has disabled this notification type' });
    }

    // Status-specific messaging
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
      message: `Your application status has been updated to: ${newStatus}`
    };

    const msg = {
      to: applicantEmail,
      from: Deno.env.get('SENDGRID_FROM_EMAIL'),
      subject: statusInfo.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">EzPay America</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">Hello ${applicantName || 'there'},</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ${statusInfo.message}
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <strong>Application ID:</strong> ${applicationId}<br>
                <strong>Status:</strong> ${newStatus.replace(/_/g, ' ').toUpperCase()}
              </p>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              If you have any questions, please don't hesitate to contact us:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:8653169625" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                Call (865) 316-9625
              </a>
            </div>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Best regards,<br>
              The EzPay America Team
            </p>
          </div>
          
          <div style="background: #f9fafb; padding: 20px; text-align: center; border: 1px solid #e5e7eb; border-top: none;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © 2025 EzPay America. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);

    return Response.json({ 
      success: true, 
      message: 'Application status update email sent successfully' 
    });
  } catch (error) {
    console.error('Error sending application status update:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});