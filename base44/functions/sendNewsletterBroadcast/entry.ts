import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { articleId, testEmail } = await req.json();

    // Get the article
    let article;
    if (articleId) {
      const articles = await base44.asServiceRole.entities.NewsArticle.filter({ id: articleId });
      article = articles[0];
    } else {
      // Get latest published article
      const articles = await base44.asServiceRole.entities.NewsArticle.filter({ published: true });
      article = articles.sort((a, b) => new Date(b.created_date) - new Date(a.created_date))[0];
    }

    if (!article) {
      return Response.json({ error: 'No article found' }, { status: 404 });
    }

    const articleUrl = `https://ezpayamerica.com/news/${article.slug || article.id}`;
    const readingTime = article.reading_time ? `${article.reading_time} min read` : '';

    const buildEmailBody = (subscriberEmail) => {
      return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EzPay America Newsletter
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📰 ${article.title}
${article.category ? `[${article.category}]` : ''}${readingTime ? ` · ${readingTime}` : ''}

${article.excerpt || ''}

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
    };

    // If test mode, send only to testEmail
    if (testEmail) {
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'EzPay America',
        to: testEmail,
        subject: `[TEST] ${article.title}`,
        body: buildEmailBody(testEmail)
      });
      return Response.json({ success: true, message: `Test email sent to ${testEmail}`, sent: 1 });
    }

    // Get all active subscribers
    const subscribers = await base44.asServiceRole.entities.NewsletterSubscriber.filter({ status: 'active' });

    if (subscribers.length === 0) {
      return Response.json({ success: true, message: 'No active subscribers found', sent: 0 });
    }

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'EzPay America',
          to: subscriber.email,
          subject: `📰 ${article.title}`,
          body: buildEmailBody(subscriber.email)
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

    return Response.json({
      success: true,
      message: `Newsletter sent to ${sent} subscribers${failed > 0 ? `, ${failed} failed` : ''}`,
      sent,
      failed,
      article: { id: article.id, title: article.title }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});