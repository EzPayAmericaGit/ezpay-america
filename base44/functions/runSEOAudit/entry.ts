import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PSI_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reportId, url, device = 'desktop', keywords = [] } = await req.json();

    // Mark as running
    await base44.asServiceRole.entities.SEOReport.update(reportId, { status: 'running' });

    // 1. Call PageSpeed Insights (Google Lighthouse API)
    const psiUrl = `${PSI_API}?url=${encodeURIComponent(url)}&strategy=${device}&category=performance&category=accessibility&category=best-practices&category=seo`;
    const psiRes = await fetch(psiUrl);
    const psiData = await psiRes.json();

    if (psiData.error) {
      await base44.asServiceRole.entities.SEOReport.update(reportId, {
        status: 'error',
        errorMessage: psiData.error.message || 'PageSpeed API error'
      });
      return Response.json({ error: psiData.error.message }, { status: 500 });
    }

    const cats = psiData.lighthouseResult?.categories || {};
    const audits = psiData.lighthouseResult?.audits || {};

    const performance = Math.round((cats.performance?.score || 0) * 100);
    const accessibility = Math.round((cats.accessibility?.score || 0) * 100);
    const bestPractices = Math.round((cats['best-practices']?.score || 0) * 100);
    const seo = Math.round((cats.seo?.score || 0) * 100);

    const fcp = audits['first-contentful-paint']?.numericValue || 0;
    const lcp = audits['largest-contentful-paint']?.numericValue || 0;
    const tbt = audits['total-blocking-time']?.numericValue || 0;
    const cls = audits['cumulative-layout-shift']?.numericValue || 0;
    const si = audits['speed-index']?.numericValue || 0;

    // Extract top opportunities (failed audits with savings)
    const opportunities = Object.values(audits)
      .filter(a => a.score !== null && a.score < 0.9 && a.details?.type === 'opportunity')
      .slice(0, 10)
      .map(a => ({
        id: a.id,
        title: a.title,
        description: a.description,
        score: a.score,
        savings: a.details?.overallSavingsMs || 0
      }));

    // Failed diagnostics
    const diagnostics = Object.values(audits)
      .filter(a => a.score !== null && a.score < 0.9 && a.details?.type !== 'opportunity' && a.scoreDisplayMode !== 'informative')
      .slice(0, 8)
      .map(a => ({ id: a.id, title: a.title, score: a.score, displayValue: a.displayValue || '' }));

    // 2. Check for broken links by fetching page HTML
    let brokenLinks = [];
    try {
      const htmlRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const html = await htmlRes.text();
      const linkRegex = /href=["']([^"'#\s]+)["']/g;
      const foundLinks = [];
      let match;
      while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1];
        if (href.startsWith('http') || href.startsWith('/')) {
          const absolute = href.startsWith('http') ? href : new URL(href, url).href;
          foundLinks.push(absolute);
        }
      }
      // Check up to 20 unique links
      const uniqueLinks = [...new Set(foundLinks)].slice(0, 20);
      const linkChecks = await Promise.allSettled(
        uniqueLinks.map(async (link) => {
          const r = await fetch(link, { method: 'HEAD', signal: AbortSignal.timeout(5000), redirect: 'follow' });
          return { url: link, status: r.status };
        })
      );
      brokenLinks = linkChecks
        .filter(r => r.status === 'fulfilled' && (r.value.status === 404 || r.value.status === 410 || r.value.status >= 500))
        .map(r => ({ url: r.value.url, status: r.value.status, text: '' }));
    } catch (_) {
      // Link check failed silently
    }

    // 3. LLM recommendations
    const auditSummary = [...opportunities, ...diagnostics]
      .map(a => `- ${a.title}${a.savings ? ` (saves ~${Math.round(a.savings)}ms)` : ''}`)
      .join('\n');

    const llmResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are an expert SEO and web performance consultant. Given the following Lighthouse audit results for ${url}, provide 6-8 specific, actionable recommendations ordered by impact. Be concrete — mention specific techniques, file types, or tools.

Scores:
- Performance: ${performance}/100
- Accessibility: ${accessibility}/100
- Best Practices: ${bestPractices}/100
- SEO: ${seo}/100

Core Web Vitals:
- FCP: ${(fcp / 1000).toFixed(1)}s
- LCP: ${(lcp / 1000).toFixed(1)}s
- TBT: ${Math.round(tbt)}ms
- CLS: ${cls.toFixed(3)}

Failed Audits:
${auditSummary || 'None found'}

Broken Links Found: ${brokenLinks.length}
${keywords.length ? `Tracked Keywords: ${keywords.join(', ')}` : ''}

Format each recommendation as a single clear actionable sentence starting with an action verb. Focus on the highest-impact items first.`,
      response_json_schema: {
        type: 'object',
        properties: {
          recommendations: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    // 4. Keyword ranking placeholders (real rankings require Search Console API)
    const keywordRankings = keywords.map((kw, i) => ({
      keyword: kw,
      position: null,
      trend: 'unknown'
    }));

    await base44.asServiceRole.entities.SEOReport.update(reportId, {
      status: 'complete',
      performance,
      accessibility,
      bestPractices,
      seo,
      fcp: Math.round(fcp),
      lcp: Math.round(lcp),
      tbt: Math.round(tbt),
      cls: parseFloat(cls.toFixed(3)),
      si: Math.round(si),
      brokenLinks,
      keywordRankings,
      opportunities: [...opportunities, ...diagnostics],
      recommendations: llmResult?.recommendations || [],
      rawAudits: { opportunitiesCount: opportunities.length, diagnosticsCount: diagnostics.length }
    });

    return Response.json({ success: true });
  } catch (error) {
    const base44 = createClientFromRequest(req);
    try {
      const { reportId } = await req.json().catch(() => ({}));
      if (reportId) {
        await base44.asServiceRole.entities.SEOReport.update(reportId, {
          status: 'error',
          errorMessage: error.message
        });
      }
    } catch (_) {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});