import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return Response.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    // Store code server-side in Settings entity (upsert)
    const settingKey = `2fa_${user.email}`;
    const existing = await base44.asServiceRole.entities.Settings.filter({ settingKey });
    if (existing.length > 0) {
      await base44.asServiceRole.entities.Settings.update(existing[0].id, {
        settingValue: `${code}|${expiresAt}`,
        description: '2FA temporary code - auto-expires'
      });
    } else {
      await base44.asServiceRole.entities.Settings.create({
        settingKey,
        settingValue: `${code}|${expiresAt}`,
        description: '2FA temporary code - auto-expires'
      });
    }

    // Send SMS via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhone = Deno.env.get('TWILIO_PHONE_NUMBER');

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = btoa(`${accountSid}:${authToken}`);

    const formData = new URLSearchParams();
    formData.append('To', phoneNumber);
    formData.append('From', twilioPhone);
    formData.append('Body', `Your EzPay America verification code is: ${code}. Valid for 5 minutes. Do not share this code.`);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!twilioResponse.ok) {
      const error = await twilioResponse.text();
      console.error('Twilio error:', error);
      return Response.json({ error: 'Failed to send SMS' }, { status: 500 });
    }

    // Log audit trail
    await base44.asServiceRole.entities.AuditLog.create({
      userEmail: user.email,
      userName: user.full_name,
      action: '2FA code sent',
      entityType: 'Authentication',
      severity: 'high',
      status: 'success'
    });

    // IMPORTANT: Never return the code — verification is done server-side
    return Response.json({ success: true, expiresAt });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});