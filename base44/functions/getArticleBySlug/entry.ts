import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { slug, id } = await req.json();

  let article = null;

  // 1. Try direct filter by slug (most efficient, no pagination limit)
  if (slug) {
    const bySlug = await base44.asServiceRole.entities.NewsArticle.filter({ slug }, '-created_date', 1);
    if (bySlug && bySlug[0]) {
      article = bySlug[0];
    }
  }

  // 2. Try by id field
  if (!article && id) {
    const byId = await base44.asServiceRole.entities.NewsArticle.filter({ id }, '-created_date', 1);
    if (byId && byId[0]) {
      article = byId[0];
    }
  }

  // 3. Fallback: if slug could be an id, try filtering by id using the slug value
  if (!article && slug) {
    const byIdSlug = await base44.asServiceRole.entities.NewsArticle.filter({ id: slug }, '-created_date', 1);
    if (byIdSlug && byIdSlug[0]) {
      article = byIdSlug[0];
    }
  }

  return Response.json({ article });
});