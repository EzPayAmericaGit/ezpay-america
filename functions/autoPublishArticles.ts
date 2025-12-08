import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Get all unpublished articles with scheduled dates
    const articles = await base44.asServiceRole.entities.NewsArticle.filter({
      published: false
    });
    
    const now = new Date();
    let publishedCount = 0;
    
    for (const article of articles) {
      if (article.scheduled_publish_date) {
        const scheduledDate = new Date(article.scheduled_publish_date);
        
        // If scheduled time has passed, publish it
        if (scheduledDate <= now) {
          await base44.asServiceRole.entities.NewsArticle.update(article.id, {
            published: true
          });
          publishedCount++;
        }
      }
    }
    
    return Response.json({ 
      success: true, 
      publishedCount,
      message: `Auto-published ${publishedCount} articles`
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});