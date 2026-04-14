import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { message, link, image_url } = await req.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Use the authorized LinkedIn OAuth connector
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('linkedin');

    // Get the authenticated member's profile to get their URN
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const profile = await profileRes.json();
    const authorUrn = `urn:li:person:${profile.sub}`;

    // Build UGC Post payload (posting as member)
    const postBody = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: message },
          shareMediaCategory: link ? "ARTICLE" : "NONE",
          ...(link ? {
            media: [{
              status: "READY",
              originalUrl: link,
              ...(image_url ? { thumbnails: [{ url: image_url }] } : {})
            }]
          } : {})
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postBody)
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json({ success: false, error: result?.message || 'LinkedIn API error', details: result }, { status: 200 });
    }

    return Response.json({ success: true, post_id: result.id, message: 'Posted to LinkedIn successfully' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});