import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Twitter v2 OAuth 1.0a signature helper
async function buildOAuthHeader(method, url, params, credentials) {
  const oauthParams = {
    oauth_consumer_key: credentials.apiKey,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: credentials.accessToken,
    oauth_version: '1.0',
  };

  const allParams = { ...params, ...oauthParams };
  const sortedKeys = Object.keys(allParams).sort();
  const paramString = sortedKeys
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`)
    .join('&');

  const baseString = [
    method.toUpperCase(),
    encodeURIComponent(url),
    encodeURIComponent(paramString)
  ].join('&');

  const signingKey = `${encodeURIComponent(credentials.apiSecret)}&${encodeURIComponent(credentials.accessTokenSecret)}`;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(signingKey),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(baseString));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

  oauthParams['oauth_signature'] = signatureB64;

  const headerValue = 'OAuth ' + Object.keys(oauthParams)
    .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(', ');

  return headerValue;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { message } = await req.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    if (message.length > 280) {
      return Response.json({ error: 'Message exceeds 280 character limit for X/Twitter' }, { status: 400 });
    }

    const apiKey = Deno.env.get('X_API_KEY');
    const apiSecret = Deno.env.get('X_API_SECRET');
    const accessToken = Deno.env.get('X_ACCESS_TOKEN');
    const accessTokenSecret = Deno.env.get('X_ACCESS_TOKEN_SECRET');

    if (!apiKey || !apiSecret || !accessToken || !accessTokenSecret) {
      return Response.json({
        error: 'X/Twitter credentials not configured. Please set X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, and X_ACCESS_TOKEN_SECRET in secrets.'
      }, { status: 500 });
    }

    const url = 'https://api.twitter.com/2/tweets';
    const body = JSON.stringify({ text: message });

    // For Twitter v2, we use OAuth 1.0a with Bearer token approach
    // Using v2 endpoint with OAuth 1.0a user context
    const oauthHeader = await buildOAuthHeader('POST', url, {}, { apiKey, apiSecret, accessToken, accessTokenSecret });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': oauthHeader,
        'Content-Type': 'application/json',
      },
      body
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json({ error: 'X/Twitter API error', details: result }, { status: response.status });
    }

    return Response.json({ success: true, post_id: result.data?.id, message: 'Posted to X successfully' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});