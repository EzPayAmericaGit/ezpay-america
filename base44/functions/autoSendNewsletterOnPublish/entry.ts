import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Triggered by entity automation when a NewsArticle is published (published=true)
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const articleData = body.data;
    if (!articleData || !articleData.published) {
      return Response.json({ skipped: true, reason: 'Article not published' });
    }

    const articleUrl = `https://ezpayamerica.com/news/${articleData.slug || articleData.id}`;
    const readingTime = articleData.reading_time ? `${articleData.reading_time} min read` : '';

    // Get all active subscribers
    const subscribers = await base44.asServiceRole.entities.NewsletterSubscriber.filter({ status: 'active' });

    if (subscribers.length === 0) {
      return Response.json({ success: true, message: 'No active subscribers', sent: 0 });
    }

    let sent = 0;
    let failed = 0;

    const emailBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EzPay America Newsletter
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📰 ${articleData.title}
${articleData.category ? `[${articleData.category}]` : ''}${readingTime ? ` · ${readingTime}` : ''}

${articleData.excerpt || ''}

Read the full article:
${articleUrl}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to upgrade your payment processing?
📞 Call us: (865) 316-9625
🌐 Apply Online: https://ezpayamerica.com/ApplyOnline
📅 Book a Call: https://ezpayamerica.com/BookAppointment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
© EzPay America | https://ezpayamerica.com
To unsubscribe, reply with "unsubscribe" in the subject line.
    `.trim();

    for (const subscriber of subscribers) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'EzPay America',
          to: subscriber.email,
          subject: `📰 ${articleData.title}`,
          body: emailBody
        });

        await base44.asServiceRole.entities.NewsletterSubscriber.update(subscriber.id, {
          lastEmailSent: new Date().toISOString()
        });

        sent++;
      } catch (e) {
        console.error(`Failed to send to ${subscriber.email}:`, e.message);
        failed++;
      }
    }

    console.log(`Newsletter broadcast: sent=${sent}, failed=${failed}, article="${articleData.title}"`);

    return Response.json({ success: true, sent, failed });

  } catch (error) {
    console.error('autoSendNewsletterOnPublish error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});