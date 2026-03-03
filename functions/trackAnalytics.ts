import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { eventType, pagePath, pageTitle, referrer, utmParams, deviceInfo, duration, metadata } = await req.json();

    const sessionId = metadata?.sessionId || crypto.randomUUID();

    const userAgent = req.headers.get('user-agent') || '';
    let deviceType = 'desktop';
    if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) {
      deviceType = /tablet|ipad/i.test(userAgent) ? 'tablet' : 'mobile';
    }

    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    let userId = null;
    try {
      const user = await base44.auth.me();
      userId = user?.id;
    } catch (e) {
      // Not authenticated, that's fine
    }

    await base44.asServiceRole.entities.AnalyticsEvent.create({
      eventType,
      pagePath,
      pageTitle,
      userId,
      sessionId,
      referrer: referrer || '',  // Fixed: document.referrer doesn't exist in Deno
      utmSource: utmParams?.source,
      utmMedium: utmParams?.medium,
      utmCampaign: utmParams?.campaign,
      deviceType,
      browser,
      operatingSystem: userAgent.includes('Windows') ? 'Windows' : 
                       userAgent.includes('Mac') ? 'macOS' : 
                       userAgent.includes('Linux') ? 'Linux' : 'Unknown',
      screenResolution: metadata?.screenResolution,
      duration,
      metadata
    });

    return Response.json({ success: true, sessionId });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});