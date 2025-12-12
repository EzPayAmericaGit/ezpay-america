import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import sgMail from 'npm:@sendgrid/mail@8.1.4';

sgMail.setApiKey(Deno.env.get('SENDGRID_API_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { orderId, customerEmail, customerName, orderTotal, orderNumber } = await req.json();

    if (!orderId || !customerEmail) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check user notification preferences
    const preferences = await base44.asServiceRole.entities.NotificationPreference.filter({
      userEmail: customerEmail
    });

    const shouldNotify = preferences.length === 0 || preferences[0].orderConfirmation !== false;

    if (!shouldNotify) {
      return Response.json({ message: 'User has disabled this notification type' });
    }

    const msg = {
      to: customerEmail,
      from: Deno.env.get('SENDGRID_FROM_EMAIL'),
      subject: 'Payment Successful - EzPay America',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Payment Successful!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb;">
            <h2 style="color: #111827; margin-top: 0;">Thank you for your purchase, ${customerName || 'valued customer'}!</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Your payment has been processed successfully. Here are your transaction details:
            </p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #22c55e;">
              <p style="margin: 0; color: #166534; font-size: 14px;">
                <strong>Order Number:</strong> ${orderNumber || orderId}<br>
                <strong>Amount Paid:</strong> $${orderTotal ? Number(orderTotal).toFixed(2) : '0.00'}<br>
                <strong>Transaction Date:</strong> ${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              A receipt has been sent to your email address. You can also view your order history by logging into your account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get('APP_URL') || 'https://ezpayamerica.com'}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                View Order History
              </a>
            </div>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Questions? Contact us at <a href="tel:8653169625" style="color: #f59e0b; text-decoration: none;">(865) 316-9625</a>
            </p>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Thank you for choosing EzPay America!<br>
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
      message: 'Transaction notification sent successfully' 
    });
  } catch (error) {
    console.error('Error sending transaction notification:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});