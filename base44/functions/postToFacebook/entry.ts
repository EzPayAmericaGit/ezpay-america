import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { message, image_url, link } = await req.json();

    if (!message || typeof message !== 'string') {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }
    if (message.length > 5000) {
      return Response.json({ error: 'Message too long (max 5000 chars)' }, { status: 400 });
    }

    // Validate URLs to prevent SSRF
    if (link && !isValidUrl(link)) {
      return Response.json({ error: 'Invalid link URL — must be https' }, { status: 400 });
    }
    if (image_url && !isValidUrl(image_url)) {
      return Response.json({ error: 'Invalid image URL — must be https' }, { status: 400 });
    }

    const pageAccessToken = Deno.env.get('FACEBOOK_PAGE_ACCESS_TOKEN');
    const pageId = Deno.env.get('FACEBOOK_PAGE_ID');

    if (!pageAccessToken || !pageId) {
      return Response.json({
        error: 'Facebook credentials not configured. Please set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID.'
      }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('message', message);
    formData.append('access_token', pageAccessToken);
    if (link) formData.append('link', link);

    const response = await fetch(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json({ error: 'Facebook API error', details: result }, { status: response.status });
    }

    if (image_url && result.id) {
      const photoFormData = new FormData();
      photoFormData.append('url', image_url);
      photoFormData.append('message', message);
      photoFormData.append('access_token', pageAccessToken);

      await fetch(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
        method: 'POST',
        body: photoFormData
      });
    }

    return Response.json({ success: true, post_id: result.id, message: 'Posted to Facebook successfully' });

  } catch (error) {
    console.error('Facebook post error:', error);
    return Response.json({ error: 'Failed to post to Facebook' }, { status: 500 });
  }
});