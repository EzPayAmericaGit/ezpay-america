Deno.serve(async (req) => {
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

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    }
  });
});