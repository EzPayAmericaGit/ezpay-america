import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const VALID_EVENT_TYPES = new Set([
  'page_view', 'click', 'form_submit', 'demo_request',
  'application_start', 'application_complete', 'session_start', 'session_end'
]);

const VALID_DEVICE_TYPES = new Set(['desktop', 'mobile', 'tablet']);

const sanitizeString = (val, maxLen = 500) => {
  if (!val || typeof val !== 'string') return '';
  return val.replace(/[<>"'`\\]/g, '').trim().substring(0, maxLen);
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { eventType, pagePath, pageTitle, referrer, utmParams, deviceInfo, duration, metadata } = body;

    // Validate event type against allowlist
    if (!eventType || !VALID_EVENT_TYPES.has(eventType)) {
      return Response.json({ error: 'Invalid event type' }, { status: 400 });
    }

    // Validate and sanitize pagePath (prevent injection)
    const safePath = sanitizeString(pagePath, 200);
    if (!safePath) {
      return Response.json({ error: 'pagePath required' }, { status: 400 });
    }

    const sessionId = sanitizeString(metadata?.sessionId, 100) || crypto.randomUUID();

    const userAgent = req.headers.get('user-agent') || '';
    let deviceType = 'desktop';
    if (/mobile|android|iphone|ipad|tablet/i.test(userAgent)) {
      deviceType = /tablet|ipad/i.test(userAgent) ? 'tablet' : 'mobile';
    }
    if (!VALID_DEVICE_TYPES.has(deviceType)) deviceType = 'desktop';

    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    let userId = null;
    try {
      const user = await base44.auth.me();
      userId = user?.id;
    } catch {
      // Not authenticated — fine for analytics
    }

    // Sanitize duration — must be a non-negative number
    const safeDuration = (typeof duration === 'number' && duration >= 0 && duration < 86400) ? duration : null;

    // Sanitize UTM params
    const safeUtm = {
      source: sanitizeString(utmParams?.source, 100),
      medium: sanitizeString(utmParams?.medium, 100),
      campaign: sanitizeString(utmParams?.campaign, 100)
    };

    const os = userAgent.includes('Windows') ? 'Windows' :
      userAgent.includes('Mac') ? 'macOS' :
      userAgent.includes('Linux') ? 'Linux' : 'Unknown';

    await base44.asServiceRole.entities.AnalyticsEvent.create({
      eventType,
      pagePath: safePath,
      pageTitle: sanitizeString(pageTitle, 200),
      userId,
      sessionId,
      referrer: sanitizeString(referrer, 500),
      utmSource: safeUtm.source,
      utmMedium: safeUtm.medium,
      utmCampaign: safeUtm.campaign,
      deviceType,
      browser,
      operatingSystem: os,
      screenResolution: sanitizeString(metadata?.screenResolution, 20),
      duration: safeDuration,
      metadata: null
    });

    // Send a single email per session on the first page_view (non-admin, non-bot)
    const isBot = /bot|crawl|spider|slurp|facebookexternalhit|WhatsApp|Googlebot|bingbot|YandexBot/i.test(userAgent);
    if (eventType === 'page_view' && !userId && !isBot) {
      // Check if we already notified for this session
      const existing = await base44.asServiceRole.entities.AnalyticsEvent.filter({
        sessionId,
        eventType: 'page_view'
      }, '-created_date', 50);

      const isFirstView = existing.length <= 1;

      if (isFirstView) {
        const referrerDisplay = sanitizeString(referrer, 200) || 'Direct / None';
        const utmInfo = [safeUtm.source, safeUtm.medium, safeUtm.campaign].filter(Boolean).join(' / ') || 'None';
        const pageUrl = `https://ezpayamerica.com${safePath}`;

        await base44.asServiceRole.integrations.Core.SendEmail({
          to: 'mail@ezpayamerica.com',
          from_name: 'EzPay America Analytics',
          subject: `New Visitor: ${sanitizeString(pageTitle, 80) || safePath}`,
          body: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:8px;">
  <h2 style="color:#d97706;margin-top:0;">New Website Visitor</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Page</td><td style="padding:8px 0;"><a href="${pageUrl}" style="color:#d97706;">${pageUrl}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Device</td><td style="padding:8px 0;">${deviceType} · ${browser} · ${os}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Referrer</td><td style="padding:8px 0;">${referrerDisplay}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">UTM</td><td style="padding:8px 0;">${utmInfo}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Resolution</td><td style="padding:8px 0;">${sanitizeString(metadata?.screenResolution, 20) || 'Unknown'}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Session ID</td><td style="padding:8px 0;font-size:12px;color:#9ca3af;">${sessionId}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Time</td><td style="padding:8px 0;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET</td></tr>
  </table>
</div>`
        });
      }
    }

    return Response.json({ success: true, sessionId });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return Response.json({ error: 'Tracking failed' }, { status: 500 });
  }
});