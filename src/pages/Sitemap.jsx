import { useEffect } from "react";

export default function Sitemap() {
  useEffect(() => {
    const baseUrl = window.location.origin;
    const pages = [
      // Core Pages - Highest Priority (Primary conversion paths)
      { path: '/', priority: '1.0', changefreq: 'daily', title: 'Home - EzPay America Zero-Fee Payment Processing' },
      { path: '/ApplyOnline', priority: '1.0', changefreq: 'weekly', title: 'Apply Online - Merchant Account Application' },
      { path: '/FreeDemo', priority: '0.95', changefreq: 'weekly', title: 'Free Demo - Schedule Consultation' },
      
      // Main Category Pages
      { path: '/Services', priority: '0.9', changefreq: 'weekly', title: 'Payment Processing Services' },
      { path: '/EzPayPOSHome', priority: '0.9', changefreq: 'weekly', title: 'EzPay POS - Cloud Point of Sale System' },
      { path: '/Shop', priority: '0.9', changefreq: 'daily', title: 'Shop Payment Equipment & POS Hardware' },
      { path: '/News', priority: '0.85', changefreq: 'daily', title: 'Payment Processing News & Industry Insights' },
      { path: '/Contact', priority: '0.9', changefreq: 'monthly', title: 'Contact EzPay America' },
      
      // Services Submenu - High Priority
      { path: '/RetailMerchants', priority: '0.85', changefreq: 'weekly', title: 'Retail Merchant Payment Services' },
      { path: '/RestaurantMerchants', priority: '0.85', changefreq: 'weekly', title: 'Restaurant Merchant Services' },
      { path: '/WebPaymentPages', priority: '0.8', changefreq: 'weekly', title: 'Web Payment Pages & Virtual Terminal' },
      { path: '/MerchantCashAdvance', priority: '0.8', changefreq: 'weekly', title: 'Merchant Cash Advance & Business Funding' },
      { path: '/RetailPaymentSolutions', priority: '0.8', changefreq: 'weekly', title: 'Retail Payment Solutions' },
      
      // POS Systems - Main Categories
      { path: '/RetailPOS', priority: '0.85', changefreq: 'weekly', title: 'Retail POS System - Inventory & Sales' },
      { path: '/RestaurantPOS', priority: '0.85', changefreq: 'weekly', title: 'Restaurant POS - Table & Kitchen Management' },
      { path: '/CountertopTerminal', priority: '0.8', changefreq: 'weekly', title: 'Countertop Payment Terminal' },
      
      // Food & Beverage POS - Industry Specific
      { path: '/CoffeePOS', priority: '0.75', changefreq: 'weekly', title: 'Coffee Shop & Cafe POS System' },
      { path: '/BagelShopPOS', priority: '0.75', changefreq: 'weekly', title: 'Bagel Shop & Bakery POS' },
      { path: '/FoodTruckPOS', priority: '0.75', changefreq: 'weekly', title: 'Food Truck Mobile POS System' },
      { path: '/DeliShopPOS', priority: '0.75', changefreq: 'weekly', title: 'Deli & Sandwich Shop POS' },
      { path: '/BarTavernPOS', priority: '0.75', changefreq: 'weekly', title: 'Bar & Tavern POS System' },
      
      // Specialty Retail POS
      { path: '/GroceryStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Grocery Store POS System' },
      { path: '/MiniMarketPOS', priority: '0.75', changefreq: 'weekly', title: 'Convenience Store & Mini Market POS' },
      { path: '/LiquorStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Liquor Store POS - Age Verification' },
      { path: '/CBDStorePOS', priority: '0.75', changefreq: 'weekly', title: 'CBD & Hemp Store POS System' },
      { path: '/VapeStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Vape & Smoke Shop POS' },
      { path: '/GiftShopPOS', priority: '0.75', changefreq: 'weekly', title: 'Gift Shop & Boutique POS' },
      
      // Additional Payment Services
      { path: '/ACHPayments', priority: '0.75', changefreq: 'monthly', title: 'ACH Payment Processing & Bank Transfers' },
      { path: '/MobilePayments', priority: '0.75', changefreq: 'monthly', title: 'Mobile Payment Solutions' },
      { path: '/MerchantCapital', priority: '0.75', changefreq: 'monthly', title: 'Merchant Capital & Business Financing' },
      { path: '/MerchantCashAdvance', priority: '0.75', changefreq: 'monthly', title: 'Merchant Cash Advance Program' },
      { path: '/ECommerce', priority: '0.75', changefreq: 'monthly', title: 'E-Commerce Payment Gateway Integration' },
      { path: '/FraudDetection', priority: '0.7', changefreq: 'monthly', title: 'Fraud Detection & Prevention' },

      // Tools & Resources
      { path: '/Quiz', priority: '0.75', changefreq: 'monthly', title: 'Business Type Quiz - Find Your Perfect POS Solution' },
      { path: '/FreeDemo', priority: '0.95', changefreq: 'weekly', title: 'Schedule a Free Demo - EzPay America' },
      { path: '/Support', priority: '0.8', changefreq: 'weekly', title: 'Customer Support & Help Center' },
      { path: '/Helpdesk', priority: '0.7', changefreq: 'weekly', title: 'Help Desk & Support Tickets' },
      
      // Admin & Internal Pages (not in sitemap - noindex)
      // Excluded: /Helpdesk, /Admin, /AdminDashboard, /ApplicationsAdmin, /AgentManagement, /EquipmentInventory, /SettingsAdmin, /ProductAdmin, /OrdersAdmin, /NewsAdmin, /UserManagement, /TemplateManagement, /AnalyticsDashboard, /BacklinkOutreach, /Invoicing
      
      // Utility Pages
      { path: '/Sitemap', priority: '0.5', changefreq: 'monthly', title: 'Sitemap - All Pages' },
      { path: '/RobotsTxt', priority: '0.3', changefreq: 'monthly', title: 'Robots.txt' }
    ];

    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Set content type and display XML
    const contentType = document.querySelector('meta[http-equiv="Content-Type"]');
    if (!contentType) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Type');
      meta.content = 'application/xml; charset=utf-8';
      document.head.appendChild(meta);
    }
    
    document.body.innerHTML = `<pre style="font-family: monospace; white-space: pre-wrap; word-wrap: break-word; padding: 20px;">${xml.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
    
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">EzPay America Sitemap</h1>
        <p className="text-gray-600 mb-8">Complete directory of all pages and services</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Main Pages */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Main Pages
            </h2>
            <ul className="space-y-2">
              <li><a href="/" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Home</a></li>
              <li><a href="/Services" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Services</a></li>
              <li><a href="/ApplyOnline" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Apply Online</a></li>
              <li><a href="/FreeDemo" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Schedule Free Demo</a></li>
              <li><a href="/Contact" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Contact Us</a></li>
              <li><a href="/Shop" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Shop Equipment</a></li>
            </ul>
          </div>

          {/* Merchant Services */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Merchant Services
            </h2>
            <ul className="space-y-2">
              <li><a href="/RetailMerchants" className="text-blue-700 hover:text-blue-900 hover:underline">Retail Merchants</a></li>
              <li><a href="/RestaurantMerchants" className="text-blue-700 hover:text-blue-900 hover:underline">Restaurant Merchants</a></li>
              <li><a href="/WebPaymentPages" className="text-blue-700 hover:text-blue-900 hover:underline">Web Payment Pages</a></li>
              <li><a href="/MerchantCashAdvance" className="text-blue-700 hover:text-blue-900 hover:underline">Merchant Cash Advance</a></li>
              <li><a href="/RetailPaymentSolutions" className="text-blue-700 hover:text-blue-900 hover:underline">Retail Payment Solutions</a></li>
              <li><a href="/ACHPayments" className="text-blue-700 hover:text-blue-900 hover:underline">ACH Payments</a></li>
              <li><a href="/MobilePayments" className="text-blue-700 hover:text-blue-900 hover:underline">Mobile Payments</a></li>
              <li><a href="/ECommerce" className="text-blue-700 hover:text-blue-900 hover:underline">E-Commerce Gateway</a></li>
            </ul>
          </div>

          {/* POS Systems */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              POS Systems
            </h2>
            <ul className="space-y-2">
              <li><a href="/EzPayPOSHome" className="text-green-700 hover:text-green-900 hover:underline font-medium">EzPay POS Overview</a></li>
              <li><a href="/RetailPOS" className="text-green-700 hover:text-green-900 hover:underline">Retail POS</a></li>
              <li><a href="/RestaurantPOS" className="text-green-700 hover:text-green-900 hover:underline">Restaurant POS</a></li>
              <li><a href="/CountertopTerminal" className="text-green-700 hover:text-green-900 hover:underline">Countertop Terminal</a></li>
            </ul>
          </div>

          {/* Food & Beverage */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Food & Beverage
            </h2>
            <ul className="space-y-2">
              <li><a href="/CoffeePOS" className="text-purple-700 hover:text-purple-900 hover:underline">Coffee Shop POS</a></li>
              <li><a href="/BagelShopPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Bagel Shop POS</a></li>
              <li><a href="/FoodTruckPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Food Truck POS</a></li>
              <li><a href="/DeliShopPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Deli Shop POS</a></li>
              <li><a href="/BarTavernPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Bar & Tavern POS</a></li>
            </ul>
          </div>

          {/* Specialty Retail */}
          <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Specialty Retail
            </h2>
            <ul className="space-y-2">
              <li><a href="/GroceryStorePOS" className="text-red-700 hover:text-red-900 hover:underline">Grocery Store POS</a></li>
              <li><a href="/MiniMarketPOS" className="text-red-700 hover:text-red-900 hover:underline">Convenience Store POS</a></li>
              <li><a href="/LiquorStorePOS" className="text-red-700 hover:text-red-900 hover:underline">Liquor Store POS</a></li>
              <li><a href="/CBDStorePOS" className="text-red-700 hover:text-red-900 hover:underline">CBD Store POS</a></li>
              <li><a href="/VapeStorePOS" className="text-red-700 hover:text-red-900 hover:underline">Vape Shop POS</a></li>
              <li><a href="/GiftShopPOS" className="text-red-700 hover:text-red-900 hover:underline">Gift Shop POS</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
              Resources
            </h2>
            <ul className="space-y-2">
              <li><a href="/News" className="text-gray-700 hover:text-gray-900 hover:underline">News & Insights</a></li>
              <li><a href="/Quiz" className="text-gray-700 hover:text-gray-900 hover:underline">Business Quiz</a></li>
              <li><a href="/Support" className="text-gray-700 hover:text-gray-900 hover:underline">Support Center</a></li>
              <li><a href="/Sitemap" className="text-gray-700 hover:text-gray-900 hover:underline">Sitemap</a></li>
            </ul>
          </div>
        </div>

        {/* SEO Information */}
        <div className="mt-12 bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
          <h3 className="text-lg font-bold text-gray-900 mb-2">For Search Engines</h3>
          <p className="text-sm text-gray-700">
            This sitemap follows Google's XML sitemap protocol with priorities, change frequencies, and last modification dates. 
            All pages are optimized for search engines with proper meta tags, structured data, and semantic HTML.
          </p>
          <p className="text-sm text-gray-600 mt-3">
            Total Pages: {pages.length} | Last Updated: {today}
          </p>
        </div>
      </div>
    </div>
  );
}