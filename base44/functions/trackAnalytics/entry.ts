import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

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
      operatingSystem: userAgent.includes('Windows') ? 'Windows' :
        userAgent.includes('Mac') ? 'macOS' :
        userAgent.includes('Linux') ? 'Linux' : 'Unknown',
      screenResolution: sanitizeString(metadata?.screenResolution, 20),
      duration: safeDuration,
      // Don't store raw metadata to avoid storing sensitive user data
      metadata: null
    });

    return Response.json({ success: true, sessionId });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return Response.json({ error: 'Tracking failed' }, { status: 500 });
  }
});