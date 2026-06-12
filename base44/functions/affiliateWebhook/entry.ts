import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Fires webhook events to configured endpoints for key affiliate events
// Events: affiliate.approved, affiliate.rejected, referral.converted, referral.cancelled, payout.sent

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { event, data } = await req.json();
    if (!event || !data) {
      return Response.json({ error: 'event and data are required' }, { status: 400 });
    }

    // Load active webhook endpoints
    let endpoints = [];
    try {
      endpoints = await base44.asServiceRole.entities.WebhookEndpoint.filter({ isActive: true });
    } catch (e) {
      return Response.json({ message: 'No webhooks configured', sent: 0 });
    }

    if (endpoints.length === 0) {
      return Response.json({ message: 'No active webhook endpoints', sent: 0 });
    }

    const payload = {
      event,
      timestamp: new Date().toISOString(),
      data
    };

    let sent = 0;
    const results = [];

    for (const endpoint of endpoints) {
      // Check if endpoint subscribes to this event
      if (endpoint.events && endpoint.events.length > 0 && !endpoint.events.includes(event) && !endpoint.events.includes('*')) {
        continue;
      }

      try {
        const headers = { 'Content-Type': 'application/json' };
        if (endpoint.secret) {
          // Simple HMAC-like signature using secret as header
          headers['X-EzPay-Secret'] = endpoint.secret;
          headers['X-EzPay-Event'] = event;
        }

        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000)
        });

        const success = res.ok;
        sent += success ? 1 : 0;

        // Update endpoint stats
        await base44.asServiceRole.entities.WebhookEndpoint.update(endpoint.id, {
          lastTriggered: success ? new Date().toISOString() : endpoint.lastTriggered,
          totalDeliveries: (endpoint.totalDeliveries || 0) + 1,
          successDeliveries: (endpoint.successDeliveries || 0) + (success ? 1 : 0),
          lastStatusCode: res.status,
          failureCount: success ? 0 : (endpoint.failureCount || 0) + 1,
          lastError: success ? null : `HTTP ${res.status}`
        });

        results.push({ url: endpoint.url, status: res.status, success });
      } catch (err) {
        await base44.asServiceRole.entities.WebhookEndpoint.update(endpoint.id, {
          failureCount: (endpoint.failureCount || 0) + 1,
          lastError: err.message,
          totalDeliveries: (endpoint.totalDeliveries || 0) + 1
        });
        results.push({ url: endpoint.url, error: err.message, success: false });
      }
    }

    return Response.json({ event, sent, total: endpoints.length, results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});