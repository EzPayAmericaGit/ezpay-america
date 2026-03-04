import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Require authentication — anonymous users cannot submit orders
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderData, paymentData } = await req.json();

    // Prevent order spoofing — customerEmail must match the logged-in user
    if (orderData?.customerEmail && orderData.customerEmail !== user.email) {
      return Response.json({ error: 'Forbidden: Cannot place orders for other users' }, { status: 403 });
    }

    // Build NMI request
    const nmiParams = new URLSearchParams({
      security_key: Deno.env.get("NMI_API_KEY"),
      type: 'sale',
      ccnumber: paymentData.cardNumber.replace(/\s/g, ''),
      ccexp: paymentData.expiry.replace(/\s/g, ''),
      cvv: paymentData.cvv,
      amount: orderData.total.toFixed(2),
      first_name: paymentData.firstName,
      last_name: paymentData.lastName,
      email: orderData.customerEmail,
      orderid: orderData.orderNumber
    });

    // Process payment with NMI
    const nmiResponse = await fetch('https://secure.nmi.com/api/transact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: nmiParams
    });

    const responseText = await nmiResponse.text();
    const nmiData = Object.fromEntries(new URLSearchParams(responseText));

    if (nmiData.response === '1') {
      // Payment successful - create order
      const order = await base44.asServiceRole.entities.Order.create({
        ...orderData,
        paymentStatus: 'paid',
        transactionId: nmiData.transactionid,
        nmiResponse: nmiData
      });

      // Send order confirmation email
      try {
        await base44.asServiceRole.functions.invoke('sendOrderConfirmation', {
          orderData: {
            ...orderData,
            orderNumber: orderData.orderNumber,
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail
          }
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }

      return Response.json({ 
        success: true, 
        orderId: order.id,
        transactionId: nmiData.transactionid
      });
    } else {
      return Response.json({ 
        success: false, 
        error: nmiData.responsetext || 'Payment failed'
      }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});