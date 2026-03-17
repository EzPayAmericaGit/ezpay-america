import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Input sanitization helpers
const sanitizeString = (val, maxLen = 200) => {
  if (typeof val !== 'string') return '';
  return val.replace(/[<>"'`;\\]/g, '').trim().substring(0, maxLen);
};

const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email) && email.length <= 254;
};

const isValidAmount = (amount) => {
  const n = parseFloat(amount);
  return !isNaN(n) && n > 0 && n <= 999999.99;
};

const isValidCardNumber = (num) => {
  const cleaned = String(num || '').replace(/\s/g, '');
  return /^\d{13,19}$/.test(cleaned);
};

const isValidCVV = (cvv) => /^\d{3,4}$/.test(String(cvv || ''));
const isValidExpiry = (exp) => /^\d{2}[\/-]?\d{2,4}$/.test(String(exp || '').replace(/\s/g, ''));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, cardNumber, expirationDate, cvv, customerName, customerEmail, description } = body;

    // --- Input validation ---
    if (!amount || !cardNumber || !expirationDate || !cvv || !customerName || !customerEmail) {
      return Response.json({ error: 'Missing required payment fields' }, { status: 400 });
    }

    if (!isValidAmount(amount)) {
      return Response.json({ error: 'Invalid amount' }, { status: 400 });
    }
    if (!isValidCardNumber(cardNumber)) {
      return Response.json({ error: 'Invalid card number format' }, { status: 400 });
    }
    if (!isValidCVV(cvv)) {
      return Response.json({ error: 'Invalid CVV format' }, { status: 400 });
    }
    if (!isValidExpiry(expirationDate)) {
      return Response.json({ error: 'Invalid expiry format' }, { status: 400 });
    }
    if (!isValidEmail(customerEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Enforce: the authenticated user's email must match the order email
    if (user.email.toLowerCase() !== customerEmail.toLowerCase()) {
      return Response.json({ error: 'Forbidden: email mismatch' }, { status: 403 });
    }

    const NMI_API_KEY = Deno.env.get('NMI_API_KEY');
    if (!NMI_API_KEY) {
      return Response.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    const safeDescription = sanitizeString(description || 'Payment', 100);
    const safeName = sanitizeString(customerName, 100);

    const nmiParams = new URLSearchParams({
      security_key: NMI_API_KEY,
      type: 'sale',
      amount: parseFloat(amount).toFixed(2),
      ccnumber: cardNumber.replace(/\s/g, ''),
      ccexp: expirationDate.replace(/[\s\/]/g, ''),
      cvv: cvv,
      first_name: safeName.split(' ')[0] || '',
      last_name: safeName.split(' ').slice(1).join(' ') || '',
      email: customerEmail.toLowerCase(),
      orderid: `TXN-${Date.now()}-${crypto.randomUUID().substring(0, 8)}`,
      orderdescription: safeDescription
    });

    const nmiResponse = await fetch('https://secure.nmi.com/api/transact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: nmiParams.toString()
    });

    const responseText = await nmiResponse.text();
    const params = new URLSearchParams(responseText);

    const result = {
      response: params.get('response'),
      responsetext: params.get('responsetext'),
      transactionid: params.get('transactionid'),
      authcode: params.get('authcode'),
      avsresponse: params.get('avsresponse'),
      cvvresponse: params.get('cvvresponse'),
      orderid: params.get('orderid'),
      type: params.get('type'),
      response_code: params.get('response_code')
    };

    // Store transaction — never store full card number, only last 4
    const transactionData = {
      transactionId: result.transactionid,
      merchantId: user.id,
      merchantName: user.full_name,
      amount: parseFloat(amount),
      status: result.response === '1' ? 'approved' : 'declined',
      paymentMethod: 'credit_card',
      last4: cardNumber.replace(/\s/g, '').slice(-4),
      customerName: safeName,
      customerEmail: customerEmail.toLowerCase(),
      description: safeDescription,
      responseCode: result.response_code,
      responseText: result.responsetext,
      authCode: result.authcode,
      avsResponse: result.avsresponse,
      cvvResponse: result.cvvresponse,
      // Never store full nmiResponse which could contain card data
      nmiResponse: {
        response: result.response,
        response_code: result.response_code,
        transactionid: result.transactionid
      }
    };

    await base44.asServiceRole.entities.Transaction.create(transactionData);

    return Response.json({
      success: result.response === '1',
      transactionId: result.transactionid,
      status: transactionData.status,
      message: result.responsetext,
      authCode: result.authcode
    });

  } catch (error) {
    // Don't leak error details to client
    console.error('Payment processing error:', error);
    return Response.json({ error: 'Payment processing failed. Please try again.' }, { status: 500 });
  }
});