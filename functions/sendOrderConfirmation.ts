import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const escapeHtml = (str) => String(str || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Require authentication — no anonymous order confirmations
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderData } = await req.json();

    if (!orderData || !orderData.customerEmail) {
      return Response.json({ error: 'Missing order data' }, { status: 400 });
    }

    // Enforce: the authenticated user's email must match the order
    if (user.role !== 'admin' && orderData.customerEmail.toLowerCase() !== user.email.toLowerCase()) {
      return Response.json({ error: 'Forbidden: Cannot send confirmations for other users' }, { status: 403 });
    }

    if (!isValidEmail(orderData.customerEmail)) {
      return Response.json({ error: 'Invalid customer email' }, { status: 400 });
    }

    const safeName = escapeHtml(orderData.customerName);
    const safeOrderNum = escapeHtml(orderData.orderNumber);

    const itemsList = (orderData.items || [])
      .slice(0, 50) // cap items to prevent abuse
      .map(item => `• ${escapeHtml(item.name)} x${parseInt(item.quantity) || 0} - $${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}`)
      .join('\n');

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
Subtotal:        $${parseFloat(orderData.subtotal || 0).toFixed(2)}
Tax:             $${parseFloat(orderData.tax || 0).toFixed(2)}
Shipping:        $${parseFloat(orderData.shipping || 0).toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total:           $${parseFloat(orderData.total || 0).toFixed(2)}

WHAT'S NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Your order is being processed
2. You'll receive a shipping confirmation with tracking details
3. Equipment typically ships within 3-5 business days

IMPORTANT NOTE:
This purchase requires a new approved merchant application with EzPay America Inc. Our team will contact you within 24 hours to complete your merchant account setup.

Questions? Contact us:
📞 Phone: (865) 316-9625

Thank you for choosing EzPay America!

Best regards,
The EzPay America Team
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: orderData.customerEmail,
      subject: `Order Confirmation #${orderData.orderNumber} - EzPay America`,
      body: emailBody
    });

    // Admin notification — minimal info only
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: Deno.env.get("SENDGRID_FROM_EMAIL"),
      subject: `New Order: #${orderData.orderNumber}`,
      body: `New order received!\n\nCustomer: ${orderData.customerName}\nOrder Total: $${parseFloat(orderData.total || 0).toFixed(2)}\n\nLogin to admin dashboard to view details.`
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Order confirmation email error:', error);
    return Response.json({ error: 'Failed to send confirmation' }, { status: 500 });
  }
});