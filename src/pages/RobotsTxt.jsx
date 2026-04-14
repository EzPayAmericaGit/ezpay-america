import { useEffect } from "react";

export default function RobotsTxt() {
  useEffect(() => {
    const baseUrl = window.location.origin;
    
    const robotsTxt = `# EzPay America - Robots.txt
# Allow all crawlers to access all content

User-agent: *
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/Sitemap

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

# Block sensitive admin areas (if any exist in future)
User-agent: *
Disallow: /admin/
Disallow: /AdminDashboard
Disallow: /OrdersAdmin
Disallow: /ProductAdmin
Disallow: /UserManagement
Disallow: /Analytics
Disallow: /CRM
Disallow: /Invoicing
Disallow: /EmailMarketing
Disallow: /NewsAdmin
Disallow: /SettingsAdmin
Disallow: /ApplicationTracker
Disallow: /CustomerOnboarding
Disallow: /BusinessDashboard
Disallow: /ProcessPayment
Disallow: /TransactionHistory
Disallow: /MyAccount
Disallow: /OrderHistory
Disallow: /BacklinkOutreach
Disallow: /ContentBot
Disallow: /NotificationPreferences

# Allow checkout and public-facing pages
Allow: /Shop
Allow: /Checkout
Allow: /ApplyOnline
Allow: /Contact
Allow: /News
Allow: /news/

# Sitemaps
Sitemap: ${baseUrl}/Sitemap
Sitemap: ${baseUrl}/news-sitemap
`;

    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; word-wrap: break-word; padding: 20px; background: #f5f5f5;">${robotsTxt}</pre>`;
    
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Robots.txt</h1>
        <p className="text-gray-600 mb-6">Loading robots.txt directives...</p>
      </div>
    </div>
  );
}