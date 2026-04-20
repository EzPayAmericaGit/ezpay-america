import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();

  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  const { pageName, prompt, currentContent } = await req.json();

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `You are an expert payment processing copywriter for EzPay America, a merchant services company based in Tennessee.

Page: ${pageName}
User instruction: ${prompt || 'Rewrite and improve this page content to be more compelling, SEO-optimized, and conversion-focused.'}

Current page content summary:
${currentContent}

Generate improved page content in the following JSON structure. Keep all data factual and relevant to EzPay America's ACH payment processing services.

Return ONLY valid JSON, no markdown, no explanation.`,
    response_json_schema: {
      type: "object",
      properties: {
        heroHeadline: { type: "string", description: "Main h1 headline (max 60 chars)" },
        heroSubheadline: { type: "string", description: "Hero subtitle/description (1-2 sentences)" },
        features: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" }
            }
          },
          description: "4 feature cards"
        },
        benefits: {
          type: "array",
          items: { type: "string" },
          description: "8 bullet point benefits"
        },
        faqs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              q: { type: "string" },
              a: { type: "string" }
            }
          },
          description: "4 FAQ items"
        },
        seo: {
          type: "object",
          properties: {
            title: { type: "string", description: "SEO title tag (50-60 chars)" },
            description: { type: "string", description: "Meta description (140-160 chars)" },
            keywords: { type: "string", description: "Comma-separated keywords (20-30 keywords)" }
          }
        }
      }
    }
  });

  return Response.json({ content: result });
});