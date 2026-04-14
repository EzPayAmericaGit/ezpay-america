import { useEffect } from "react";

export default function RobotsTxt() {
  useEffect(() => {
    const robotsTxt = `# EzPay America - Robots.txt
User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Allow: /

# Block admin-only areas
User-agent: *
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
Disallow: /BacklinkOutreach
Disallow: /ContentBot
Disallow: /NotificationPreferences
Disallow: /AffiliateAdmin
Disallow: /EquipmentInventory
Disallow: /AgentManagement

Sitemap: https://ezpayamerica.com/sitemap.xml
`;

    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; word-wrap: break-word; padding: 20px; font-size: 14px;">${robotsTxt}</pre>`;
    
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