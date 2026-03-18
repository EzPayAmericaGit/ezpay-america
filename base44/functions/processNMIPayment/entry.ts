import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

const isValidAmount = (amount) => {
  const n = parseFloat(amount);
  return !isNaN(n) && n > 0 && n <= 999999.99;
};

const isValidCardNumber = (num) => /^\d{13,19}$/.test(String(num || '').replace(/\s/g, ''));
const isValidCVV = (cvv) => /^\d{3,4}$/.test(String(cvv || ''));
const isValidExpiry = (exp) => /^\d{2}[\/-]?\d{2,4}$/.test(String(exp || '').replace(/\s/g, ''));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderData, paymentData } = await req.json();

    if (!orderData || !paymentData) {
      return Response.json({ error: 'Missing orderData or paymentData' }, { status: 400 });
    }

    // Validate card fields
    if (!isValidCardNumber(paymentData.cardNumber)) {
      return Response.json({ error: 'Invalid card number' }, { status: 400 });
    }
    if (!isValidCVV(paymentData.cvv)) {
      return Response.json({ error: 'Invalid CVV' }, { status: 400 });
    }
    if (!isValidExpiry(paymentData.expiry)) {
      return Response.json({ error: 'Invalid expiry date' }, { status: 400 });
    }
    if (!isValidAmount(orderData.total)) {
      return Response.json({ error: 'Invalid order total' }, { status: 400 });
    }
    if (!isValidEmail(orderData.customerEmail)) {
      return Response.json({ error: 'Invalid customer email' }, { status: 400 });
    }

    // Prevent order spoofing — customerEmail must match the logged-in user
    if (user.role !== 'admin' && orderData.customerEmail.toLowerCase() !== user.email.toLowerCase()) {
      return Response.json({ error: 'Forbidden: Cannot place orders for other users' }, { status: 403 });
    }

    const NMI_API_KEY = Deno.env.get("NMI_API_KEY");
    if (!NMI_API_KEY) {
      return Response.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const safeName = `${String(paymentData.firstName || '').replace(/[^a-zA-Z\s\-]/g, '').substring(0, 50)} ${String(paymentData.lastName || '').replace(/[^a-zA-Z\s\-]/g, '').substring(0, 50)}`.trim();

    const nmiParams = new URLSearchParams({
      security_key: NMI_API_KEY,
      type: 'sale',
      ccnumber: paymentData.cardNumber.replace(/\s/g, ''),
      ccexp: paymentData.expiry.replace(/\s/g, ''),
      cvv: paymentData.cvv,
      amount: parseFloat(orderData.total).toFixed(2),
      first_name: String(paymentData.firstName || '').substring(0, 50),
      last_name: String(paymentData.lastName || '').substring(0, 50),
      email: orderData.customerEmail.toLowerCase(),
      orderid: String(orderData.orderNumber || '').substring(0, 50)
    });

    const nmiResponse = await fetch('https://secure.nmi.com/api/transact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: nmiParams
    });

    const responseText = await nmiResponse.text();
    const nmiData = Object.fromEntries(new URLSearchParams(responseText));

    if (nmiData.response === '1') {
      // Store order — never persist full card number, only last 4
      const order = await base44.asServiceRole.entities.Order.create({
        ...orderData,
        paymentStatus: 'paid',
        transactionId: nmiData.transactionid,
        // Strip sensitive payment data from nmiResponse before storing
        nmiResponse: {
          response: nmiData.response,
          response_code: nmiData.response_code,
          transactionid: nmiData.transactionid,
          authcode: nmiData.authcode
        }
      });

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
        console.error('Email error (non-fatal):', emailError);
      }

      return Response.json({
        success: true,
        orderId: order.id,
        transactionId: nmiData.transactionid
      });
    } else {
      return Response.json({
        success: false,
        error: nmiData.responsetext || 'Payment declined'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('NMI payment error:', error);
    return Response.json({ success: false, error: 'Payment processing failed' }, { status: 500 });
  }
});