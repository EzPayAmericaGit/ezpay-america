import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, cardNumber, expirationDate, cvv, customerName, customerEmail, description } = await req.json();

    const NMI_API_KEY = Deno.env.get('NMI_API_KEY');
    
    if (!NMI_API_KEY) {
      return Response.json({ error: 'Payment gateway not configured' }, { status: 500 });
    }

    // Process payment with NMI
    const nmiParams = new URLSearchParams({
      security_key: NMI_API_KEY,
      type: 'sale',
      amount: amount.toString(),
      ccnumber: cardNumber.replace(/\s/g, ''),
      ccexp: expirationDate.replace(/\s|\//g, ''),
      cvv: cvv,
      first_name: customerName.split(' ')[0] || '',
      last_name: customerName.split(' ').slice(1).join(' ') || '',
      email: customerEmail,
      orderid: `TXN-${Date.now()}`,
      orderdescription: description || 'Payment'
    });

    const nmiResponse = await fetch('https://secure.nmi.com/api/transact.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: nmiParams.toString()
    });

    const responseText = await nmiResponse.text();
    const params = new URLSearchParams(responseText);
    
    const response = {
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

    // Store transaction in database
    const transactionData = {
      transactionId: response.transactionid,
      merchantId: user.id,
      merchantName: user.full_name,
      amount: parseFloat(amount),
      status: response.response === '1' ? 'approved' : 'declined',
      paymentMethod: 'credit_card',
      last4: cardNumber.slice(-4),
      customerName,
      customerEmail,
      description,
      responseCode: response.response_code,
      responseText: response.responsetext,
      authCode: response.authcode,
      avsResponse: response.avsresponse,
      cvvResponse: response.cvvresponse,
      nmiResponse: response
    };

    await base44.asServiceRole.entities.Transaction.create(transactionData);

    return Response.json({
      success: response.response === '1',
      transactionId: response.transactionid,
      status: transactionData.status,
      message: response.responsetext,
      authCode: response.authcode
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});