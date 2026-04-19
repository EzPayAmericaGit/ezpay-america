import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PSI_API = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const SENDGRID_API = "https://api.sendgrid.com/v3/mail/send";
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const SENDGRID_FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL") || "noreply@ezpayamerica.com";
const REPORT_TO_EMAIL = "admin@ezpayamerica.com"; // change as needed

async function runLighthouse(url, device = "desktop") {
  const psiUrl = `${PSI_API}?url=${encodeURIComponent(url)}&strategy=${device}&category=performance&category=accessibility&category=best-practices&category=seo`;
  const res = await fetch(psiUrl);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "PSI error");

  const cats = data.lighthouseResult?.categories || {};
  const audits = data.lighthouseResult?.audits || {};

  const performance  = Math.round((cats.performance?.score || 0) * 100);
  const accessibility = Math.round((cats.accessibility?.score || 0) * 100);
  const bestPractices = Math.round((cats['best-practices']?.score || 0) * 100);
  const seo = Math.round((cats.seo?.score || 0) * 100);
  const fcp = Math.round(audits['first-contentful-paint']?.numericValue || 0);
  const lcp = Math.round(audits['largest-contentful-paint']?.numericValue || 0);
  const tbt = Math.round(audits['total-blocking-time']?.numericValue || 0);
  const cls = parseFloat((audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3));
  const si  = Math.round(audits['speed-index']?.numericValue || 0);

  const opportunities = Object.values(audits)
    .filter(a => a.score !== null && a.score < 0.9 && a.details?.type === 'opportunity')
    .slice(0, 8)
    .map(a => ({ id: a.id, title: a.title, score: a.score, savings: a.details?.overallSavingsMs || 0 }));

  const diagnostics = Object.values(audits)
    .filter(a => a.score !== null && a.score < 0.9 && a.details?.type !== 'opportunity' && a.scoreDisplayMode !== 'informative')
    .slice(0, 6)
    .map(a => ({ id: a.id, title: a.title, score: a.score, displayValue: a.displayValue || '' }));

  return { performance, accessibility, bestPractices, seo, fcp, lcp, tbt, cls, si, opportunities, diagnostics };
}

async function checkBrokenLinks(url) {
  try {
    const htmlRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const html = await htmlRes.text();
    const linkRegex = /href=["']([^"'#\s]+)["']/g;
    const found = [];
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      if (href.startsWith('http') || href.startsWith('/')) {
        found.push(href.startsWith('http') ? href : new URL(href, url).href);
      }
    }
    const unique = [...new Set(found)].slice(0, 20);
    const checks = await Promise.allSettled(
      unique.map(async (link) => {
        const r = await fetch(link, { method: 'HEAD', signal: AbortSignal.timeout(5000), redirect: 'follow' });
        return { url: link, status: r.status };
      })
    );
    return checks
      .filter(r => r.status === 'fulfilled' && (r.value.status === 404 || r.value.status === 410 || r.value.status >= 500))
      .map(r => ({ url: r.value.url, status: r.value.status }));
  } catch (_) {
    return [];
  }
}

function scoreLabel(score) {
  if (score >= 90) return `✅ ${score}`;
  if (score >= 50) return `⚠️ ${score}`;
  return `🔴 ${score}`;
}

function buildEmailHtml(results) {
  const rows = results.map(r => {
    const s = r.scores;
    const broken = r.brokenLinks;
    const brokenText = broken.length === 0
      ? '<span style="color:#16a34a">None found</span>'
      : broken.map(l => `<a href="${l.url}" style="color:#dc2626">${l.url} (${l.status})</a>`).join('<br/>');

    return `
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:20px;">
        <h3 style="margin:0 0 12px;color:#1f2937;font-size:16px;">${r.url} <small style="color:#6b7280;font-weight:400">(${r.device})</small></h3>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:12px;">
          <tr style="background:#f3f4f6;">
            <th style="padding:6px 10px;text-align:left;border-radius:6px 0 0 6px;">Performance</th>
            <th style="padding:6px 10px;text-align:left;">Accessibility</th>
            <th style="padding:6px 10px;text-align:left;">Best Practices</th>
            <th style="padding:6px 10px;text-align:left;border-radius:0 6px 6px 0;">SEO</th>
          </tr>
          <tr>
            <td style="padding:8px 10px;font-size:18px;font-weight:bold;">${scoreLabel(s.performance)}</td>
            <td style="padding:8px 10px;font-size:18px;font-weight:bold;">${scoreLabel(s.accessibility)}</td>
            <td style="padding:8px 10px;font-size:18px;font-weight:bold;">${scoreLabel(s.bestPractices)}</td>
            <td style="padding:8px 10px;font-size:18px;font-weight:bold;">${scoreLabel(s.seo)}</td>
          </tr>
        </table>
        <p style="margin:4px 0;font-size:13px;color:#374151;">
          <strong>Core Web Vitals:</strong>
          FCP ${(s.fcp/1000).toFixed(1)}s &nbsp;|&nbsp;
          LCP ${(s.lcp/1000).toFixed(1)}s &nbsp;|&nbsp;
          TBT ${s.tbt}ms &nbsp;|&nbsp;
          CLS ${s.cls}
        </p>
        <div style="margin-top:12px;">
          <strong style="font-size:13px;color:#374151;">Broken Links:</strong>
          <div style="font-size:12px;margin-top:4px;">${brokenText}</div>
        </div>
        ${r.topIssues.length > 0 ? `
        <div style="margin-top:12px;">
          <strong style="font-size:13px;color:#374151;">Top Issues:</strong>
          <ul style="margin:4px 0;padding-left:16px;font-size:12px;color:#6b7280;">
            ${r.topIssues.map(i => `<li>${i.title}${i.savings > 0 ? ` <em>(saves ~${Math.round(i.savings/1000*10)/10}s)</em>` : ''}</li>`).join('')}
          </ul>
        </div>` : ''}
      </div>`;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;padding:20px;color:#1f2937;">
      <div style="background:linear-gradient(135deg,#d97706,#92400e);padding:24px;border-radius:12px;margin-bottom:24px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;">📊 Weekly SEO Report</h1>
        <p style="margin:6px 0 0;color:#fde68a;font-size:14px;">EzPay America · ${new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
      </div>
      <p style="color:#374151;font-size:14px;">Here's your weekly Lighthouse audit summary for all tracked URLs.</p>
      ${rows}
      <div style="margin-top:24px;padding:16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;font-size:13px;color:#92400e;">
        <strong>Legend:</strong> ✅ Good (90+) &nbsp; ⚠️ Needs Work (50–89) &nbsp; 🔴 Poor (&lt;50)
      </div>
      <p style="margin-top:20px;font-size:12px;color:#9ca3af;text-align:center;">
        View the full dashboard at <a href="https://ezpayamerica.com/SEOMonitor" style="color:#d97706;">ezpayamerica.com/SEOMonitor</a>
      </p>
    </body>
    </html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow scheduled (no auth) OR admin user calls
    let isScheduled = false;
    try {
      const user = await base44.auth.me();
      if (user?.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch (_) {
      // Called by scheduler — no user token
      isScheduled = true;
    }

    // Get the unique URLs from the last 100 reports
    const allReports = await base44.asServiceRole.entities.SEOReport.list('-created_date', 100);
    const seenUrls = new Set();
    const uniqueEntries = [];
    for (const r of allReports) {
      const key = `${r.url}||${r.device || 'desktop'}`;
      if (!seenUrls.has(key) && r.url) {
        seenUrls.add(key);
        uniqueEntries.push({ url: r.url, device: r.device || 'desktop', keywords: r.keywordRankings?.map(k => k.keyword) || [] });
      }
    }

    if (uniqueEntries.length === 0) {
      return Response.json({ message: 'No URLs to audit.' });
    }

    const results = [];

    for (const entry of uniqueEntries) {
      // Create a new SEOReport record for this run
      const report = await base44.asServiceRole.entities.SEOReport.create({
        url: entry.url,
        device: entry.device,
        status: 'running',
        keywordRankings: entry.keywords.map(k => ({ keyword: k, position: null, trend: 'unknown' }))
      });

      try {
        const scores = await runLighthouse(entry.url, entry.device);
        const brokenLinks = await checkBrokenLinks(entry.url);

        await base44.asServiceRole.entities.SEOReport.update(report.id, {
          status: 'complete',
          ...scores,
          brokenLinks,
          opportunities: [...scores.opportunities, ...scores.diagnostics],
          rawAudits: { opportunitiesCount: scores.opportunities.length, diagnosticsCount: scores.diagnostics.length }
        });

        results.push({
          url: entry.url,
          device: entry.device,
          scores,
          brokenLinks,
          topIssues: [...scores.opportunities, ...scores.diagnostics].slice(0, 5)
        });
      } catch (err) {
        await base44.asServiceRole.entities.SEOReport.update(report.id, {
          status: 'error',
          errorMessage: err.message
        });
        results.push({
          url: entry.url,
          device: entry.device,
          error: err.message,
          scores: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0, fcp: 0, lcp: 0, tbt: 0, cls: 0, si: 0 },
          brokenLinks: [],
          topIssues: []
        });
      }
    }

    // Send email summary via SendGrid
    if (SENDGRID_API_KEY) {
      const html = buildEmailHtml(results);
      const totalBroken = results.reduce((sum, r) => sum + r.brokenLinks.length, 0);
      const subject = `Weekly SEO Report – ${results.length} URL(s) audited, ${totalBroken} broken link(s) found`;

      await fetch(SENDGRID_API, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: REPORT_TO_EMAIL }] }],
          from: { email: SENDGRID_FROM_EMAIL, name: 'EzPay SEO Monitor' },
          subject,
          content: [{ type: 'text/html', value: html }]
        })
      });
    }

    return Response.json({ success: true, audited: results.length, emailSent: !!SENDGRID_API_KEY });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});