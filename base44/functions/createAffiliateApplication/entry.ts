import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { firstName, lastName, email, paypalEmail, company, website, phone, marketingStrategy, referralCode } = body;

    if (!firstName || !lastName || !email || !paypalEmail || !phone) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check for duplicate email
    const existing = await base44.asServiceRole.entities.Affiliate.filter({ email });
    if (existing.length > 0) {
      return Response.json({ error: 'An affiliate with this email already exists.' }, { status: 409 });
    }

    const created = await base44.asServiceRole.entities.Affiliate.create({
      firstName, lastName, email, paypalEmail,
      company: company || '', website: website || '', phone, marketingStrategy,
      referralCode,
      status: 'pending',
      commissionRate: 10,
      totalEarned: 0, totalPaid: 0, totalReferrals: 0, totalConversions: 0, totalClicks: 0,
      tier: 'bronze'
    });

    // Notify admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'info@ezpayamerica.com',
      subject: `New Affiliate Application: ${firstName} ${lastName}`,
      body: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#d97706;">New Affiliate Application</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Website:</strong> ${website || 'N/A'}</p>
          <p><strong>PayPal:</strong> ${paypalEmail}</p>
          <p><strong>Referral Code:</strong> ${referralCode}</p>
          <p><strong>Marketing Strategy:</strong> ${marketingStrategy}</p>
        </div>
      `,
      from_name: 'EzPay America Affiliates'
    });

    return Response.json({ success: true, affiliate: created });
  } catch (error) {
    console.error('Affiliate creation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});