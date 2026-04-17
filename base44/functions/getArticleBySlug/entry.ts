import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { slug, id } = await req.json();

  // Fetch all articles and find by slug or id client-side (most reliable)
  const all = await base44.asServiceRole.entities.NewsArticle.list('-created_date', 500);

  let article = null;
  if (slug) {
    article = all.find(a => a.slug === slug || a.id === slug) || null;
  } else if (id) {
    article = all.find(a => a.id === id) || null;
  }

  return Response.json({ article });
});