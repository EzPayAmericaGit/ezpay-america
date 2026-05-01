Deno.serve(async (req) => {
  const robotsTxt = `# EzPay America - Robots.txt

User-agent: *
Allow: /
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
Disallow: /CustomerOnboarding
Disallow: /ProcessPayment
Disallow: /BacklinkOutreach
Disallow: /ContentBot
Disallow: /NotificationPreferences
Disallow: /AffiliateAdmin
Disallow: /EquipmentInventory
Disallow: /AgentManagement
Disallow: /ApplicationTracker
Disallow: /BusinessDashboard
Disallow: /TransactionHistory
Disallow: /LeadsView
Disallow: /SEOMonitor
Disallow: /AffiliateAdmin
Disallow: /FraudRules
Disallow: /WebhookManagement

Sitemap: https://ezpayamerica.com/sitemap.xml
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    }
  });
});