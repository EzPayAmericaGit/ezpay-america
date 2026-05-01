Deno.serve(async (req) => {
  const robotsTxt = `# EzPay America - Robots.txt
# Updated: 2026-05-01

User-agent: *
Allow: /

# Internal admin dashboards - do not index
Disallow: /AdminDashboard
Disallow: /OrdersAdmin
Disallow: /ProductAdmin
Disallow: /UserManagement
Disallow: /Analytics
Disallow: /AnalyticsDashboard
Disallow: /CRM
Disallow: /CRMPage
Disallow: /Invoicing
Disallow: /AutomatedInvoicing
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
Disallow: /ApplicationsAdmin
Disallow: /BusinessDashboard
Disallow: /TransactionHistory
Disallow: /LeadsView
Disallow: /SEOMonitor
Disallow: /FraudRules
Disallow: /WebhookManagement
Disallow: /Admin
Disallow: /Helpdesk
Disallow: /Support
Disallow: /Checkout
Disallow: /VirtualTerminal
Disallow: /RecurringBilling
Disallow: /PaymentLinks
Disallow: /Integrations
Disallow: /DeveloperAPI
Disallow: /ChargebackManagement
Disallow: /InstantPayouts
Disallow: /PCICompliance
Disallow: /OnlineCheckout
Disallow: /MarketingTools
Disallow: /UsageBasedBilling
Disallow: /ThreeDSecure
Disallow: /TokenizationSecurity
Disallow: /InventoryManagement
Disallow: /TemplateManagement
Disallow: /CustomerPortal
Disallow: /AffiliateDashboard

# Crawl-delay for polite crawling
Crawl-delay: 1

# Google-specific (no crawl-delay needed)
User-agent: Googlebot
Allow: /
Disallow: /AdminDashboard
Disallow: /Admin
Disallow: /NewsAdmin
Disallow: /LeadsView
Disallow: /SEOMonitor
Disallow: /AffiliateAdmin
Disallow: /BusinessDashboard
Disallow: /Helpdesk

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