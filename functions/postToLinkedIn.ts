import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, link, image_url } = await req.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get LinkedIn access token from connector
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('linkedin');

    if (!accessToken) {
      return Response.json({ 
        error: 'LinkedIn not connected. Please authorize LinkedIn integration.' 
      }, { status: 401 });
    }

    // Get LinkedIn user profile to get the URN
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!profileResponse.ok) {
      return Response.json({ 
        error: 'Failed to get LinkedIn profile' 
      }, { status: profileResponse.status });
    }

    const profile = await profileResponse.json();
    const authorUrn = `urn:li:person:${profile.sub}`;

    // Prepare post content
    const postContent = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: message
          },
          shareMediaCategory: link ? 'ARTICLE' : 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    // Add link/article if provided
    if (link) {
      postContent.specificContent['com.linkedin.ugc.ShareContent'].media = [{
        status: 'READY',
        originalUrl: link
      }];
    }

    // Post to LinkedIn
    const postResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(postContent)
    });

    const result = await postResponse.json();

    if (!postResponse.ok) {
      return Response.json({ 
        error: 'LinkedIn API error', 
        details: result 
      }, { status: postResponse.status });
    }

    return Response.json({ 
      success: true, 
      post_id: result.id,
      message: 'Posted to LinkedIn successfully' 
    });

  } catch (error) {
    console.error('Error posting to LinkedIn:', error);
    return Response.json({ 
      error: error.message || 'Failed to post to LinkedIn' 
    }, { status: 500 });
  }
});