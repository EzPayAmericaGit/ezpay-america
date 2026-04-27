import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, firstName, source } = await req.json();

    if (!email || !email.includes('@')) {
      return Response.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await base44.asServiceRole.entities.NewsletterSubscriber.filter({ email });
    if (existing.length > 0) {
      if (existing[0].status === 'unsubscribed') {
        // Re-subscribe
        await base44.asServiceRole.entities.NewsletterSubscriber.update(existing[0].id, { status: 'active' });
        return Response.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
      }
      return Response.json({ success: true, message: 'You are already subscribed!' });
    }

    // Create new subscriber
    const subscriber = await base44.asServiceRole.entities.NewsletterSubscriber.create({
      email,
      firstName: firstName || '',
      status: 'active',
      source: source || 'website',
      welcomeSent: false
    });

    // Send welcome email
    const greeting = firstName ? `Hi ${firstName}` : 'Hi there';
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'EzPay America',
      to: email,
      subject: 'Welcome to the EzPay America Newsletter! 🎉',
      body: `${greeting},

Thank you for subscribing to the EzPay America newsletter!

You'll receive the latest insights on:
• Payment processing tips for your business
• POS system updates and reviews
• Industry news and trends
• Merchant services best practices

Stay ahead of the curve with practical advice delivered right to your inbox.

To unsubscribe at any time, simply reply with "unsubscribe" in the subject line.

Best regards,
The EzPay America Team
(865) 316-9625
https://ezpayamerica.com`
    });

    // Mark welcome email as sent
    await base44.asServiceRole.entities.NewsletterSubscriber.update(subscriber.id, { welcomeSent: true });

    // Notify admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'EzPay America System',
      to: 'info@ezpayamerica.com',
      subject: 'New Newsletter Subscriber',
      body: `New subscriber: ${email}${firstName ? ` (${firstName})` : ''}\nSource: ${source || 'website'}`
    });

    return Response.json({ success: true, message: 'Successfully subscribed! Check your email for a welcome message.' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});