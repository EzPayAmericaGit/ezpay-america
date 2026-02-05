import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, image_url, link } = await req.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const pageAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');
    const pageId = Deno.env.get('FACEBOOK_PAGE_ID');

    if (!pageAccessToken || !pageId) {
      return Response.json({ 
        error: 'Facebook credentials not configured. Please set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID in environment variables.' 
      }, { status: 500 });
    }

    // Prepare Facebook Graph API request
    let apiUrl = `https://graph.facebook.com/v18.0/${pageId}/feed`;
    const formData = new FormData();
    formData.append('message', message);
    formData.append('access_token', pageAccessToken);

    if (link) {
      formData.append('link', link);
    }

    // Post to Facebook
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json({ 
        error: 'Facebook API error', 
        details: result 
      }, { status: response.status });
    }

    // If there's an image and we got a post ID, try to add the photo
    if (image_url && result.id) {
      const photoUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      const photoFormData = new FormData();
      photoFormData.append('url', image_url);
      photoFormData.append('message', message);
      photoFormData.append('access_token', pageAccessToken);

      await fetch(photoUrl, {
        method: 'POST',
        body: photoFormData
      });
    }

    return Response.json({ 
      success: true, 
      post_id: result.id,
      message: 'Posted to Facebook successfully' 
    });

  } catch (error) {
    console.error('Error posting to Facebook:', error);
    return Response.json({ 
      error: error.message || 'Failed to post to Facebook' 
    }, { status: 500 });
  }
});