import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

const escapeHtml = (str) => String(str || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, customerEmail, customerName, orderTotal, orderNumber } = await req.json();

    if (!orderId || !customerEmail) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!isValidEmail(customerEmail)) {
      return Response.json({ error: 'Invalid customer email address' }, { status: 400 });
    }

    // Verify the notification is for this user's own order (or they are admin)
    if (user.role !== 'admin' && customerEmail.toLowerCase() !== user.email.toLowerCase()) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const safeOrderTotal = parseFloat(orderTotal);
    if (isNaN(safeOrderTotal) || safeOrderTotal < 0) {
      return Response.json({ error: 'Invalid order total' }, { status: 400 });
    }

    // Check notification preferences
    const preferences = await base44.asServiceRole.entities.NotificationPreference.filter({
      userEmail: customerEmail
    });
    const shouldNotify = preferences.length === 0 || preferences[0].orderConfirmation !== false;

    if (!shouldNotify) {
      return Response.json({ message: 'User has disabled this notification type' });
    }

    const safeName = escapeHtml(String(customerName || 'valued customer').substring(0, 100));
    const safeOrderNum = escapeHtml(String(orderNumber || orderId).substring(0, 50));

    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
    const FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL');

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: customerEmail }] }],
        from: { email: FROM_EMAIL, name: 'EzPay America' },
        subject: 'Payment Successful - EzPay America',
        content: [{
          type: 'text/html',
          value: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Payment Successful!</h1>
              </div>
              <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb;">
                <h2 style="color: #111827; margin-top: 0;">Thank you for your purchase, ${safeName}!</h2>
                <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #22c55e;">
                  <p style="margin: 0; color: #166534; font-size: 14px;">
                    <strong>Order Number:</strong> ${safeOrderNum}<br>
                    <strong>Amount Paid:</strong> $${safeOrderTotal.toFixed(2)}<br>
                    <strong>Transaction Date:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                  Questions? Contact us at <a href="tel:8653169625" style="color: #f59e0b; text-decoration: none;">(865) 316-9625</a>
                </p>
                <p style="color: #9ca3af; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  Thank you for choosing EzPay America!<br>The EzPay America Team
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
      return Response.json({ error: 'Failed to send notification' }, { status: 500 });
    }

    return Response.json({ success: true, message: 'Transaction notification sent successfully' });
  } catch (error) {
    console.error('Transaction notification error:', error);
    return Response.json({ error: 'Failed to send notification' }, { status: 500 });
  }
});