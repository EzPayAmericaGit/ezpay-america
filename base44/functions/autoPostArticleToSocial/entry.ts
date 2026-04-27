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
  const paramString = sortedKeys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`).join('&');
  const baseString = [method.toUpperCase(), encodeURIComponent(url), encodeURIComponent(paramString)].join('&');
  const signingKey = `${encodeURIComponent(credentials.apiSecret)}&${encodeURIComponent(credentials.accessTokenSecret)}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(signingKey), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(baseString));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  oauthParams['oauth_signature'] = signatureB64;
  return 'OAuth ' + Object.keys(oauthParams).map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`).join(', ');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    // Called from automation: payload has event + data
    const articleData = body.data || body.article;

    if (!articleData) {
      return Response.json({ error: 'No article data provided' }, { status: 400 });
    }

    // Only auto-post published articles
    if (!articleData.published) {
      return Response.json({ skipped: true, reason: 'Article is not published' });
    }

    const articleUrl = `https://ezpayamerica.com/news/${articleData.slug || articleData.id}`;
    const results = {};

    // --- AI-generate platform-specific captions ---
    let captions = {};
    try {
      captions = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Write social media posts for a new blog article from EzPay America (payment processing company).

Article Title: "${articleData.title}"
Excerpt: "${articleData.excerpt || ''}"
Category: ${articleData.category || 'Business'}
Article URL: ${articleUrl}

Generate:
1. linkedin_post: Professional LinkedIn post (max 1200 chars), include relevant hashtags, professional tone
2. facebook_post: Engaging Facebook post (max 500 chars), conversational, 2-3 emojis, include article URL
3. x_post: Tweet (CRITICAL: max 250 chars INCLUDING the URL which is 23 chars), punchy, 1-2 hashtags

Return ONLY the text content. The URL is already counted in x_post length.`,
        response_json_schema: {
          type: "object",
          properties: {
            linkedin_post: { type: "string" },
            facebook_post: { type: "string" },
            x_post: { type: "string" }
          }
        }
      });
    } catch (e) {
      console.error('AI caption generation failed:', e.message);
      // Fallback captions
      captions = {
        linkedin_post: `${articleData.title}\n\n${articleData.excerpt || ''}\n\nRead more: ${articleUrl}\n\n#PaymentProcessing #SmallBusiness #MerchantServices`,
        facebook_post: `📰 ${articleData.title}\n\n${articleData.excerpt || ''}\n\n${articleUrl}`,
        x_post: `${articleData.title.substring(0, 200)}... ${articleUrl}`
      };
    }

    // --- Post to LinkedIn ---
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');
      const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      const profile = await profileRes.json();
      const authorUrn = `urn:li:person:${profile.sub}`;

      const postBody = {
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: captions.linkedin_post },
            shareMediaCategory: "ARTICLE",
            media: [{ status: "READY", originalUrl: articleUrl }]
          }
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
      };

      const liRes = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postBody)
      });
      const liResult = await liRes.json();
      results.linkedin = liRes.ok ? { success: true } : { success: false, error: liResult?.message };
    } catch (e) {
      results.linkedin = { success: false, error: e.message };
    }

    // --- Post to Facebook ---
    const fbToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');
    const fbPageId = Deno.env.get('FACEBOOK_PAGE_ID');
    if (fbToken && fbPageId) {
      try {
        const formData = new FormData();
        formData.append('message', captions.facebook_post);
        formData.append('link', articleUrl);
        formData.append('access_token', fbToken);
        const fbRes = await fetch(`https://graph.facebook.com/v18.0/${fbPageId}/feed`, { method: 'POST', body: formData });
        const fbResult = await fbRes.json();
        results.facebook = fbRes.ok ? { success: true } : { success: false, error: fbResult?.error?.message };
      } catch (e) {
        results.facebook = { success: false, error: e.message };
      }
    } else {
      results.facebook = { skipped: true, reason: 'Facebook credentials not configured' };
    }

    // --- Post to X/Twitter ---
    const xApiKey = Deno.env.get('X_API_KEY');
    const xApiSecret = Deno.env.get('X_API_SECRET');
    const xAccessToken = Deno.env.get('X_ACCESS_TOKEN');
    const xAccessTokenSecret = Deno.env.get('X_ACCESS_TOKEN_SECRET');
    if (xApiKey && xApiSecret && xAccessToken && xAccessTokenSecret) {
      try {
        const tweetText = captions.x_post.length > 280 ? captions.x_post.substring(0, 277) + '...' : captions.x_post;
        const xUrl = 'https://api.twitter.com/2/tweets';
        const oauthHeader = await buildOAuthHeader('POST', xUrl, {}, {
          apiKey: xApiKey, apiSecret: xApiSecret, accessToken: xAccessToken, accessTokenSecret: xAccessTokenSecret
        });
        const xRes = await fetch(xUrl, {
          method: 'POST',
          headers: { 'Authorization': oauthHeader, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: tweetText })
        });
        const xResult = await xRes.json();
        results.x = xRes.ok ? { success: true } : { success: false, error: xResult?.detail };
      } catch (e) {
        results.x = { success: false, error: e.message };
      }
    } else {
      results.x = { skipped: true, reason: 'X/Twitter credentials not configured' };
    }

    // Log summary
    const succeeded = Object.values(results).filter(r => r.success).length;
    console.log(`Auto-posted "${articleData.title}" to ${succeeded}/${Object.keys(results).length} platforms`, JSON.stringify(results));

    return Response.json({
      success: true,
      article: articleData.title,
      results
    });

  } catch (error) {
    console.error('autoPostArticleToSocial error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});