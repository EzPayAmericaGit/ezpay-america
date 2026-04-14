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

    const accessToken = Deno.env.get('LINKEDIN_ACCESS_TOKEN');
    const organizationId = Deno.env.get('LINKEDIN_ORGANIZATION_ID');

    if (!accessToken || !organizationId) {
      return Response.json({
        error: 'LinkedIn credentials not configured. Please set LINKEDIN_ACCESS_TOKEN and LINKEDIN_ORGANIZATION_ID in secrets.'
      }, { status: 500 });
    }

    // Build UGC Post payload
    const postBody = {
      author: `urn:li:organization:${organizationId}`,
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
      return Response.json({ error: 'LinkedIn API error', details: result }, { status: response.status });
    }

    return Response.json({ success: true, post_id: result.id, message: 'Posted to LinkedIn successfully' });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});