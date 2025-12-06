import { useEffect } from "react";

export default function Sitemap() {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const pages = [
      { path: '/', priority: '1.0', changefreq: 'daily' },
      { path: '/Services', priority: '0.9', changefreq: 'weekly' },
      { path: '/RetailMerchants', priority: '0.8', changefreq: 'weekly' },
      { path: '/RestaurantMerchants', priority: '0.8', changefreq: 'weekly' },
      { path: '/WebPaymentPages', priority: '0.8', changefreq: 'weekly' },
      { path: '/MerchantCashAdvance', priority: '0.8', changefreq: 'weekly' },
      { path: '/RetailPaymentSolutions', priority: '0.8', changefreq: 'weekly' },
      { path: '/EzPayPOSHome', priority: '0.9', changefreq: 'weekly' },
      { path: '/RetailPOS', priority: '0.8', changefreq: 'weekly' },
      { path: '/RestaurantPOS', priority: '0.8', changefreq: 'weekly' },
      { path: '/Quiz', priority: '0.7', changefreq: 'monthly' },
      { path: '/ApplyOnline', priority: '1.0', changefreq: 'monthly' },
      { path: '/Contact', priority: '0.9', changefreq: 'monthly' },
      { path: '/Support', priority: '0.9', changefreq: 'monthly' },
      { path: '/News', priority: '0.8', changefreq: 'daily' },
      { path: '/FreeDemo', priority: '0.9', changefreq: 'monthly' }
    ];

    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Set content type and display XML
    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; word-wrap: break-word;">${xml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sitemap</h1>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Available Pages:</h2>
          <ul className="space-y-2">
            <li><a href="/" className="text-amber-600 hover:underline">Home</a></li>
            <li><a href="/Services" className="text-amber-600 hover:underline">Services</a></li>
            <li><a href="/RetailMerchants" className="text-amber-600 hover:underline">Retail Merchants</a></li>
            <li><a href="/RestaurantMerchants" className="text-amber-600 hover:underline">Restaurant Merchants</a></li>
            <li><a href="/WebPaymentPages" className="text-amber-600 hover:underline">Web Payment Pages</a></li>
            <li><a href="/MerchantCashAdvance" className="text-amber-600 hover:underline">Merchant Cash Advance</a></li>
            <li><a href="/RetailPaymentSolutions" className="text-amber-600 hover:underline">Retail Payment Solutions</a></li>
            <li><a href="/EzPayPOSHome" className="text-amber-600 hover:underline">EzPay POS</a></li>
            <li><a href="/RetailPOS" className="text-amber-600 hover:underline">Retail POS</a></li>
            <li><a href="/RestaurantPOS" className="text-amber-600 hover:underline">Restaurant POS</a></li>
            <li><a href="/Quiz" className="text-amber-600 hover:underline">Quiz</a></li>
            <li><a href="/ApplyOnline" className="text-amber-600 hover:underline">Apply Online</a></li>
            <li><a href="/Contact" className="text-amber-600 hover:underline">Contact</a></li>
            <li><a href="/Support" className="text-amber-600 hover:underline">Support</a></li>
            <li><a href="/News" className="text-amber-600 hover:underline">News</a></li>
            <li><a href="/FreeDemo" className="text-amber-600 hover:underline">Free Demo</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}