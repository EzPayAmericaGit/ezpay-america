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

    const results = {
      facebook: { success: false, error: null },
      linkedin: { success: false, error: null }
    };

    // Post to Facebook
    try {
      const fbResponse = await base44.asServiceRole.functions.invoke('postToFacebook', {
        message,
        image_url,
        link
      });
      if (fbResponse.data?.success) {
        results.facebook = { success: true, data: fbResponse.data };
      } else {
        results.facebook = { success: false, error: fbResponse.data?.error || 'Unknown error' };
      }
    } catch (error) {
      results.facebook = { success: false, error: error.message || String(error) };
    }

    // Post to LinkedIn
    try {
      const liResponse = await base44.asServiceRole.functions.invoke('postToLinkedIn', {
        message,
        link,
        image_url
      });
      if (liResponse.data?.success) {
        results.linkedin = { success: true, data: liResponse.data };
      } else {
        results.linkedin = { success: false, error: liResponse.data?.error || 'Unknown error' };
      }
    } catch (error) {
      results.linkedin = { success: false, error: error.message || String(error) };
    }

    const allSuccessful = results.facebook.success && results.linkedin.success;
    const someSuccessful = results.facebook.success || results.linkedin.success;

    return Response.json({ 
      success: allSuccessful,
      partial_success: someSuccessful && !allSuccessful,
      results,
      message: allSuccessful 
        ? 'Posted to Facebook and LinkedIn successfully' 
        : someSuccessful
        ? 'Posted to some platforms (check results for details)'
        : 'Failed to post to social media'
    });

  } catch (error) {
    console.error('Error posting to social media:', error);
    return Response.json({ 
      error: error.message || 'Failed to post to social media' 
    }, { status: 500 });
  }
});