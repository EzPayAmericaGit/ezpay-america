import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { orderData } = await req.json();

    const itemsList = orderData.items?.map(item => 
      `• ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n') || '';

    const emailBody = `
Dear ${orderData.customerName},

Thank you for your order with EzPay America!

ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Number: ${orderData.orderNumber}
Order Date: ${new Date().toLocaleDateString()}

ITEMS ORDERED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${itemsList}

ORDER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Subtotal:        $${orderData.subtotal?.toFixed(2)}
Tax:             $${orderData.tax?.toFixed(2)}
Shipping:        $${orderData.shipping?.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total:           $${orderData.total?.toFixed(2)}

SHIPPING ADDRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${orderData.shippingAddress?.address}
${orderData.shippingAddress?.city}, ${orderData.shippingAddress?.state} ${orderData.shippingAddress?.zip}

WHAT'S NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Your order is being processed
2. You'll receive a shipping confirmation with tracking details
3. Equipment typically ships within 3-5 business days

IMPORTANT NOTE:
This purchase requires a new approved merchant application with EzPay America Inc. Our team will contact you within 24 hours to complete your merchant account setup.

Questions? Contact us:
📞 Phone: (865) 316-9625
📧 Email: ${orderData.customerEmail}

Thank you for choosing EzPay America!

Best regards,
The EzPay America Team
    `.trim();

    await base44.integrations.Core.SendEmail({
      to: orderData.customerEmail,
      subject: `Order Confirmation #${orderData.orderNumber} - EzPay America`,
      body: emailBody
    });

    // Send notification to admin
    await base44.integrations.Core.SendEmail({
      to: Deno.env.get("SENDGRID_FROM_EMAIL"),
      subject: `New Order: #${orderData.orderNumber}`,
      body: `
New order received!

Customer: ${orderData.customerName}
Email: ${orderData.customerEmail}
Order Total: $${orderData.total?.toFixed(2)}

Login to admin dashboard to view details.
      `.trim()
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});