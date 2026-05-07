import { useEffect, useState } from "react";
import SEOHead from "../components/SEOHead";
import { base44 } from "@/api/base44Client";

function NewsArticlesSection({ today }) {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    base44.entities.NewsArticle.filter({ published: true }, '-updated_date', 200).then(setArticles);
  }, []);
  if (!articles.length) return null;
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-lg border border-amber-200 col-span-full">
      <h2 className="text-xl font-bold mb-4 text-gray-900">News Articles ({articles.length})</h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
        {articles.map(a => (
          <li key={a.id}>
            <a href={`/news/${a.slug || a.id}`} className="text-amber-700 hover:text-amber-900 hover:underline text-sm line-clamp-1">
              {a.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Sitemap() {
  const today = new Date().toISOString().split('T')[0];
  const pages = [
    { path: '/', priority: '1.0', changefreq: 'daily', title: 'Home - EzPay America Zero-Fee Payment Processing' },
    { path: '/ApplyOnline', priority: '1.0', changefreq: 'weekly', title: 'Apply Online - Merchant Account Application' },
    { path: '/FreeDemo', priority: '0.95', changefreq: 'weekly', title: 'Free Demo - Schedule Consultation' },
    { path: '/Services', priority: '0.9', changefreq: 'weekly', title: 'Payment Processing Services' },
    { path: '/EzPayPOSHome', priority: '0.9', changefreq: 'weekly', title: 'EzPay POS - Cloud Point of Sale System' },
    { path: '/Shop', priority: '0.9', changefreq: 'daily', title: 'Shop Payment Equipment & POS Hardware' },
    { path: '/News', priority: '0.85', changefreq: 'daily', title: 'Payment Processing News & Industry Insights' },
    { path: '/Contact', priority: '0.9', changefreq: 'monthly', title: 'Contact EzPay America' },
    { path: '/RetailMerchants', priority: '0.85', changefreq: 'weekly', title: 'Retail Merchant Payment Services' },
    { path: '/RestaurantMerchants', priority: '0.85', changefreq: 'weekly', title: 'Restaurant Merchant Services' },
    { path: '/WebPaymentPages', priority: '0.8', changefreq: 'weekly', title: 'Web Payment Pages & Virtual Terminal' },
    { path: '/MerchantCashAdvance', priority: '0.8', changefreq: 'weekly', title: 'Merchant Cash Advance & Business Funding' },
    { path: '/RetailPaymentSolutions', priority: '0.8', changefreq: 'weekly', title: 'Retail Payment Solutions' },
    { path: '/BrandedPaymentGateway', priority: '0.85', changefreq: 'weekly', title: 'Branded Payment Gateway - EzPay America' },
    { path: '/GatewayRecurringBilling', priority: '0.8', changefreq: 'weekly', title: 'Recurring Billing & Subscription Payments' },
    { path: '/GatewayFraudProtection', priority: '0.8', changefreq: 'weekly', title: 'Payment Fraud Protection & Prevention' },
    { path: '/GatewayTokenization', priority: '0.8', changefreq: 'weekly', title: 'Payment Tokenization & Card Security' },
    { path: '/GatewayPaymentLinks', priority: '0.8', changefreq: 'weekly', title: 'Instant Payment Links for Businesses' },
    { path: '/GatewayMobilePayments', priority: '0.8', changefreq: 'weekly', title: 'Mobile & Tap-to-Pay Payment Processing' },
    { path: '/GatewayReporting', priority: '0.8', changefreq: 'weekly', title: 'Payment Reporting & Analytics Dashboard' },
    { path: '/RetailPOS', priority: '0.85', changefreq: 'weekly', title: 'Retail POS System - Inventory & Sales' },
    { path: '/RestaurantPOS', priority: '0.85', changefreq: 'weekly', title: 'Restaurant POS - Table & Kitchen Management' },
    { path: '/CountertopTerminal', priority: '0.8', changefreq: 'weekly', title: 'Countertop Payment Terminal' },
    { path: '/CoffeePOS', priority: '0.75', changefreq: 'weekly', title: 'Coffee Shop & Cafe POS System' },
    { path: '/BagelShopPOS', priority: '0.75', changefreq: 'weekly', title: 'Bagel Shop & Bakery POS' },
    { path: '/FoodTruckPOS', priority: '0.75', changefreq: 'weekly', title: 'Food Truck Mobile POS System' },
    { path: '/DeliShopPOS', priority: '0.75', changefreq: 'weekly', title: 'Deli & Sandwich Shop POS' },
    { path: '/BarTavernPOS', priority: '0.75', changefreq: 'weekly', title: 'Bar & Tavern POS System' },
    { path: '/FullServiceRestaurantPOS', priority: '0.8', changefreq: 'weekly', title: 'Full Service Restaurant POS & Payment Processing' },
    { path: '/QuickServicePOS', priority: '0.8', changefreq: 'weekly', title: 'Quick Service & Fast Food POS System' },
    { path: '/BakeryPOS', priority: '0.75', changefreq: 'weekly', title: 'Bakery POS System & Payment Processing' },
    { path: '/CateringPOS', priority: '0.75', changefreq: 'weekly', title: 'Catering Company POS & Payment Processing' },
    { path: '/IceCreamShopPOS', priority: '0.75', changefreq: 'weekly', title: 'Ice Cream Shop POS & Payment Processing' },
    { path: '/JuiceSmoothieBarPOS', priority: '0.75', changefreq: 'weekly', title: 'Juice Bar & Smoothie Shop POS System' },
    { path: '/GhostKitchenPOS', priority: '0.75', changefreq: 'weekly', title: 'Ghost Kitchen POS & Payment Processing' },
    { path: '/BreweryPOS', priority: '0.75', changefreq: 'weekly', title: 'Brewery & Taproom POS System' },
    { path: '/WineryPOS', priority: '0.75', changefreq: 'weekly', title: 'Winery POS & Tasting Room Payment Processing' },
    { path: '/NightclubPOS', priority: '0.75', changefreq: 'weekly', title: 'Nightclub POS & Bar Payment Processing' },
    { path: '/HotelRestaurantPOS', priority: '0.75', changefreq: 'weekly', title: 'Hotel Restaurant POS & F&B Payment Processing' },
    { path: '/CafeteriaPOS', priority: '0.75', changefreq: 'weekly', title: 'Cafeteria POS & Meal Plan Payment Processing' },
    { path: '/GroceryStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Grocery Store POS System' },
    { path: '/MiniMarketPOS', priority: '0.75', changefreq: 'weekly', title: 'Convenience Store & Mini Market POS' },
    { path: '/LiquorStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Liquor Store POS - Age Verification' },
    { path: '/CBDStorePOS', priority: '0.75', changefreq: 'weekly', title: 'CBD & Hemp Store POS System' },
    { path: '/VapeStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Vape & Smoke Shop POS' },
    { path: '/GiftShopPOS', priority: '0.75', changefreq: 'weekly', title: 'Gift Shop & Boutique POS' },
    { path: '/ACHPayments', priority: '0.75', changefreq: 'monthly', title: 'ACH Payment Processing & Bank Transfers' },
    { path: '/MobilePayments', priority: '0.75', changefreq: 'monthly', title: 'Mobile Payment Solutions' },
    { path: '/MerchantCapital', priority: '0.75', changefreq: 'monthly', title: 'Merchant Capital & Business Financing' },
    { path: '/ECommerce', priority: '0.75', changefreq: 'monthly', title: 'E-Commerce Payment Gateway Integration' },
    { path: '/FraudDetection', priority: '0.7', changefreq: 'monthly', title: 'Fraud Detection & Prevention' },
    { path: '/Quiz', priority: '0.75', changefreq: 'monthly', title: 'Business Type Quiz - Find Your Perfect POS Solution' },
    { path: '/BookAppointment', priority: '0.9', changefreq: 'weekly', title: 'Book a Call - Schedule a Consultation' },
    { path: '/FAQ', priority: '0.85', changefreq: 'monthly', title: 'Frequently Asked Questions - EzPay America' },
    { path: '/AffiliateSignup', priority: '0.8', changefreq: 'monthly', title: 'Affiliate Program - Earn Commissions' },
    { path: '/Support', priority: '0.8', changefreq: 'weekly', title: 'Customer Support & Help Center' },
    { path: '/Helpdesk', priority: '0.7', changefreq: 'weekly', title: 'Help Desk & Support Tickets' },
    { path: '/Sitemap', priority: '0.5', changefreq: 'monthly', title: 'Sitemap - All Pages' },
    { path: '/RobotsTxt', priority: '0.3', changefreq: 'monthly', title: 'Robots.txt' },
    // Retail
    { path: '/ClothingBoutiquePOS', priority: '0.75', changefreq: 'weekly', title: 'Clothing Boutique POS & Payment Processing' },
    { path: '/ShoeStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Shoe Store POS & Payment Processing' },
    { path: '/JewelryStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Jewelry Store POS & Payment Processing' },
    { path: '/SpecialtyFoodStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Specialty Food Store POS & Payment Processing' },
    { path: '/FurnitureStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Furniture Store POS & Payment Processing' },
    { path: '/ElectronicsStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Electronics Store POS & Payment Processing' },
    { path: '/SportingGoodsStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Sporting Goods Store POS & Payment Processing' },
    { path: '/PetStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Pet Store POS & Payment Processing' },
    { path: '/FloristPOS', priority: '0.75', changefreq: 'weekly', title: 'Florist POS & Payment Processing' },
    { path: '/ThriftStorePOS', priority: '0.75', changefreq: 'weekly', title: 'Thrift Store POS & Payment Processing' },
    { path: '/PopUpRetailPOS', priority: '0.75', changefreq: 'weekly', title: 'Pop-Up Retail Shop POS & Payment Processing' },
    // Personal Services
    { path: '/HairSalonPOS', priority: '0.75', changefreq: 'weekly', title: 'Hair Salon POS & Payment Processing' },
    { path: '/BarberShopPOS', priority: '0.75', changefreq: 'weekly', title: 'Barber Shop POS & Payment Processing' },
    { path: '/NailSalonPOS', priority: '0.75', changefreq: 'weekly', title: 'Nail Salon POS & Payment Processing' },
    { path: '/SpaPOS', priority: '0.75', changefreq: 'weekly', title: 'Spa POS & Payment Processing' },
    { path: '/MassageTherapyPOS', priority: '0.75', changefreq: 'weekly', title: 'Massage Therapy POS & Payment Processing' },
    { path: '/TanningSalonPOS', priority: '0.75', changefreq: 'weekly', title: 'Tanning Salon POS & Payment Processing' },
    { path: '/TattooShopPOS', priority: '0.75', changefreq: 'weekly', title: 'Tattoo Shop POS & Payment Processing' },
    { path: '/BeautyClinicPOS', priority: '0.75', changefreq: 'weekly', title: 'Beauty Clinic POS & Payment Processing' },
    { path: '/MedSpaPOS', priority: '0.75', changefreq: 'weekly', title: 'Med Spa POS & Payment Processing' },
    { path: '/PersonalTrainerPOS', priority: '0.75', changefreq: 'weekly', title: 'Personal Trainer POS & Payment Processing' },
    { path: '/YogaStudioPOS', priority: '0.75', changefreq: 'weekly', title: 'Yoga Studio POS & Payment Processing' },
    { path: '/FitnessGymPOS', priority: '0.75', changefreq: 'weekly', title: 'Fitness Gym POS & Payment Processing' },
    { path: '/DanceStudioPOS', priority: '0.75', changefreq: 'weekly', title: 'Dance Studio POS & Payment Processing' },
    { path: '/CoachingBusinessPOS', priority: '0.75', changefreq: 'weekly', title: 'Coaching Business POS & Payment Processing' },
    // Healthcare
    { path: '/DentalOfficePOS', priority: '0.8', changefreq: 'weekly', title: 'Dental Office POS & Payment Processing' },
    { path: '/ChiropractorPOS', priority: '0.8', changefreq: 'weekly', title: 'Chiropractic Clinic POS & Payment Processing' },
    { path: '/PhysicalTherapyPOS', priority: '0.8', changefreq: 'weekly', title: 'Physical Therapy Clinic POS & Payment Processing' },
    { path: '/UrgentCarePOS', priority: '0.8', changefreq: 'weekly', title: 'Urgent Care Center POS & Payment Processing' },
    { path: '/PrivateMedicalPOS', priority: '0.8', changefreq: 'weekly', title: 'Private Medical Practice POS & Payment Processing' },
    { path: '/MentalHealthClinicPOS', priority: '0.75', changefreq: 'weekly', title: 'Mental Health Clinic POS & Payment Processing' },
    { path: '/VeterinaryClinicPOS', priority: '0.75', changefreq: 'weekly', title: 'Veterinary Clinic POS & Payment Processing' },
    { path: '/HomeHealthcarePOS', priority: '0.75', changefreq: 'weekly', title: 'Home Healthcare POS & Payment Processing' },
    { path: '/MedicalLabPOS', priority: '0.75', changefreq: 'weekly', title: 'Medical Lab POS & Payment Processing' },
    // Home Services
    { path: '/HVACCompanyPOS', priority: '0.75', changefreq: 'weekly', title: 'HVAC Company POS & Payment Processing' },
    { path: '/PlumbingServicesPOS', priority: '0.75', changefreq: 'weekly', title: 'Plumbing Services POS & Payment Processing' },
    { path: '/ElectricalContractorPOS', priority: '0.75', changefreq: 'weekly', title: 'Electrical Contractor POS & Payment Processing' },
    { path: '/RoofingCompanyPOS', priority: '0.75', changefreq: 'weekly', title: 'Roofing Company POS & Payment Processing' },
    { path: '/LandscapingPOS', priority: '0.75', changefreq: 'weekly', title: 'Landscaping Business POS & Payment Processing' },
    { path: '/PestControlPOS', priority: '0.75', changefreq: 'weekly', title: 'Pest Control Company POS & Payment Processing' },
    { path: '/ResidentialCleaningPOS', priority: '0.75', changefreq: 'weekly', title: 'Residential Cleaning POS & Payment Processing' },
    { path: '/CommercialCleaningPOS', priority: '0.75', changefreq: 'weekly', title: 'Commercial Cleaning POS & Payment Processing' },
    { path: '/RestorationCompanyPOS', priority: '0.75', changefreq: 'weekly', title: 'Restoration Company POS & Payment Processing' },
    { path: '/HandymanServicesPOS', priority: '0.75', changefreq: 'weekly', title: 'Handyman Services POS & Payment Processing' },
    { path: '/PoolMaintenancePOS', priority: '0.75', changefreq: 'weekly', title: 'Pool Maintenance POS & Payment Processing' },
    { path: '/SecurityInstallerPOS', priority: '0.75', changefreq: 'weekly', title: 'Security System Installer POS & Payment Processing' },
    { path: '/MovingCompanyPOS', priority: '0.75', changefreq: 'weekly', title: 'Moving Company POS & Payment Processing' },
    { path: '/ApplianceRepairPOS', priority: '0.75', changefreq: 'weekly', title: 'Appliance Repair POS & Payment Processing' },
    { path: '/DryCleanersPOS', priority: '0.75', changefreq: 'weekly', title: 'Dry Cleaners POS & Payment Processing' },
    // Professional Services
    { path: '/LawFirmPOS', priority: '0.8', changefreq: 'weekly', title: 'Law Firm POS & Payment Processing' },
    { path: '/AccountingFirmPOS', priority: '0.8', changefreq: 'weekly', title: 'Accounting Firm POS & Payment Processing' },
    { path: '/BookkeepingServicesPOS', priority: '0.75', changefreq: 'weekly', title: 'Bookkeeping Services POS & Payment Processing' },
    { path: '/MarketingAgencyPOS', priority: '0.75', changefreq: 'weekly', title: 'Marketing Agency POS & Payment Processing' },
    { path: '/ConsultingFirmPOS', priority: '0.75', changefreq: 'weekly', title: 'Consulting Firm POS & Payment Processing' },
    { path: '/ITServicesPOS', priority: '0.75', changefreq: 'weekly', title: 'IT Services & MSP POS & Payment Processing' },
    { path: '/WebDesignAgencyPOS', priority: '0.75', changefreq: 'weekly', title: 'Web Design Agency POS & Payment Processing' },
    { path: '/SoftwareDeveloperPOS', priority: '0.75', changefreq: 'weekly', title: 'Software Developer POS & Payment Processing' },
    { path: '/ArchitectureFirmPOS', priority: '0.75', changefreq: 'weekly', title: 'Architecture Firm POS & Payment Processing' },
    { path: '/EngineeringFirmPOS', priority: '0.75', changefreq: 'weekly', title: 'Engineering Firm POS & Payment Processing' },
    { path: '/StaffingAgencyPOS', priority: '0.75', changefreq: 'weekly', title: 'Staffing Agency POS & Payment Processing' },
    { path: '/TranslationServicesPOS', priority: '0.75', changefreq: 'weekly', title: 'Translation Services POS & Payment Processing' },
    { path: '/PRFirmPOS', priority: '0.75', changefreq: 'weekly', title: 'PR Firm POS & Payment Processing' }
  ];

  useEffect(() => {
    const baseUrl = "https://ezpayamerica.com";

    base44.entities.NewsArticle.filter({ published: true }, '-updated_date', 200).then(articles => {
      const staticEntries = pages.map(page =>
        '  <url>\n' +
        '    <loc>' + baseUrl + page.path + '</loc>\n' +
        '    <lastmod>' + today + '</lastmod>\n' +
        '    <changefreq>' + page.changefreq + '</changefreq>\n' +
        '    <priority>' + page.priority + '</priority>\n' +
        '  </url>'
      ).join('\n');

      const newsEntries = articles.map(article => {
        const slug = article.slug || article.id;
        const lastmod = article.updated_date ? article.updated_date.split('T')[0] : today;
        return '  <url>\n' +
          '    <loc>' + baseUrl + '/news/' + slug + '</loc>\n' +
          '    <lastmod>' + lastmod + '</lastmod>\n' +
          '    <changefreq>weekly</changefreq>\n' +
          '    <priority>0.8</priority>\n' +
          '    <news:news xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n' +
          '      <news:publication>\n' +
          '        <news:name>EzPay America</news:name>\n' +
          '        <news:language>en</news:language>\n' +
          '      </news:publication>\n' +
          '      <news:publication_date>' + lastmod + '</news:publication_date>\n' +
          '      <news:title>' + (article.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</news:title>\n' +
          '    </news:news>\n' +
          '  </url>';
      }).join('\n');

      const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
        '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n' +
        staticEntries + (newsEntries ? '\n' + newsEntries : '') + '\n' +
        '</urlset>';

      document.body.innerHTML = '<pre style="font-family: monospace; white-space: pre-wrap; word-wrap: break-word; padding: 20px;">' + xml.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
    });
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <SEOHead noindex={true} title="Sitemap – EzPay America" />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">EzPay America Sitemap</h1>
            <p className="text-gray-600 mt-2">Complete directory of all pages and services</p>
          </div>
          <a
            href="https://ezpayamerica.com/api/sitemapXml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg text-sm transition-colors"
          >
            📄 View XML Sitemap
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Main Pages</h2>
            <ul className="space-y-2">
              <li><a href="/" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Home</a></li>
              <li><a href="/Services" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Services</a></li>
              <li><a href="/ApplyOnline" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Apply Online</a></li>
              <li><a href="/FreeDemo" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Schedule Free Demo</a></li>
              <li><a href="/Contact" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Contact Us</a></li>
              <li><a href="/Shop" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Shop Equipment</a></li>
              <li><a href="/News" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">News & Insights</a></li>
              <li><a href="/Quiz" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Business Quiz</a></li>
              <li><a href="/BookAppointment" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Book a Call</a></li>
              <li><a href="/FAQ" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">FAQ</a></li>
              <li><a href="/AffiliateSignup" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Affiliate Program</a></li>
              <li><a href="/Support" className="text-amber-700 hover:text-amber-900 hover:underline font-medium">Support Center</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Merchant Services</h2>
            <ul className="space-y-2">
              <li><a href="/RetailMerchants" className="text-blue-700 hover:text-blue-900 hover:underline">Retail Merchants</a></li>
              <li><a href="/RestaurantMerchants" className="text-blue-700 hover:text-blue-900 hover:underline">Restaurant Merchants</a></li>
              <li><a href="/WebPaymentPages" className="text-blue-700 hover:text-blue-900 hover:underline">Web Payment Pages</a></li>
              <li><a href="/MerchantCashAdvance" className="text-blue-700 hover:text-blue-900 hover:underline">Merchant Cash Advance</a></li>
              <li><a href="/MerchantCapital" className="text-blue-700 hover:text-blue-900 hover:underline">Merchant Capital</a></li>
              <li><a href="/RetailPaymentSolutions" className="text-blue-700 hover:text-blue-900 hover:underline">Retail Payment Solutions</a></li>
              <li><a href="/BrandedPaymentGateway" className="text-blue-700 hover:text-blue-900 hover:underline">Branded Payment Gateway</a></li>
              <li><a href="/GatewayRecurringBilling" className="text-blue-700 hover:text-blue-900 hover:underline">Recurring Billing</a></li>
              <li><a href="/GatewayFraudProtection" className="text-blue-700 hover:text-blue-900 hover:underline">Fraud Protection</a></li>
              <li><a href="/GatewayTokenization" className="text-blue-700 hover:text-blue-900 hover:underline">Tokenization & Security</a></li>
              <li><a href="/GatewayPaymentLinks" className="text-blue-700 hover:text-blue-900 hover:underline">Payment Links</a></li>
              <li><a href="/GatewayMobilePayments" className="text-blue-700 hover:text-blue-900 hover:underline">Mobile & Tap-to-Pay</a></li>
              <li><a href="/GatewayReporting" className="text-blue-700 hover:text-blue-900 hover:underline">Reporting & Analytics</a></li>
              <li><a href="/ACHPayments" className="text-blue-700 hover:text-blue-900 hover:underline">ACH Payments</a></li>
              <li><a href="/MobilePayments" className="text-blue-700 hover:text-blue-900 hover:underline">Mobile Payments</a></li>
              <li><a href="/ECommerce" className="text-blue-700 hover:text-blue-900 hover:underline">E-Commerce Gateway</a></li>
              <li><a href="/FraudDetection" className="text-blue-700 hover:text-blue-900 hover:underline">Fraud Detection</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">POS Systems</h2>
            <ul className="space-y-2">
              <li><a href="/EzPayPOSHome" className="text-green-700 hover:text-green-900 hover:underline font-medium">EzPay POS Overview</a></li>
              <li><a href="/RetailPOS" className="text-green-700 hover:text-green-900 hover:underline">Retail POS</a></li>
              <li><a href="/RestaurantPOS" className="text-green-700 hover:text-green-900 hover:underline">Restaurant POS</a></li>
              <li><a href="/CountertopTerminal" className="text-green-700 hover:text-green-900 hover:underline">Countertop Terminal</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Food & Beverage</h2>
            <ul className="space-y-2">
              <li><a href="/FullServiceRestaurantPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Full Service Restaurant POS</a></li>
              <li><a href="/QuickServicePOS" className="text-purple-700 hover:text-purple-900 hover:underline">Quick Service / Fast Food POS</a></li>
              <li><a href="/CoffeePOS" className="text-purple-700 hover:text-purple-900 hover:underline">Coffee Shop POS</a></li>
              <li><a href="/FoodTruckPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Food Truck POS</a></li>
              <li><a href="/BarTavernPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Bar & Tavern POS</a></li>
              <li><a href="/BakeryPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Bakery POS</a></li>
              <li><a href="/CateringPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Catering Company POS</a></li>
              <li><a href="/IceCreamShopPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Ice Cream Shop POS</a></li>
              <li><a href="/JuiceSmoothieBarPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Juice & Smoothie Bar POS</a></li>
              <li><a href="/GhostKitchenPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Ghost Kitchen POS</a></li>
              <li><a href="/BreweryPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Brewery & Taproom POS</a></li>
              <li><a href="/WineryPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Winery & Tasting Room POS</a></li>
              <li><a href="/NightclubPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Nightclub POS</a></li>
              <li><a href="/HotelRestaurantPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Hotel Restaurant POS</a></li>
              <li><a href="/CafeteriaPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Cafeteria POS</a></li>
              <li><a href="/BagelShopPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Bagel Shop POS</a></li>
              <li><a href="/DeliShopPOS" className="text-purple-700 hover:text-purple-900 hover:underline">Deli Shop POS</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-lg border border-red-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Specialty Retail</h2>
            <ul className="space-y-2">
              <li><a href="/GroceryStorePOS" className="text-red-700 hover:text-red-900 hover:underline">Grocery Store POS</a></li>
              <li><a href="/MiniMarketPOS" className="text-red-700 hover:text-red-900 hover:underline">Convenience Store POS</a></li>
              <li><a href="/LiquorStorePOS" className="text-red-700 hover:text-red-900 hover:underline">Liquor Store POS</a></li>
              <li><a href="/CBDStorePOS" className="text-red-700 hover:text-red-900 hover:underline">CBD Store POS</a></li>
              <li><a href="/VapeStorePOS" className="text-red-700 hover:text-red-900 hover:underline">Vape Shop POS</a></li>
              <li><a href="/GiftShopPOS" className="text-red-700 hover:text-red-900 hover:underline">Gift Shop POS</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Personal Services</h2>
            <ul className="space-y-2">
              <li><a href="/HairSalonPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Hair Salon</a></li>
              <li><a href="/BarberShopPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Barber Shop</a></li>
              <li><a href="/NailSalonPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Nail Salon</a></li>
              <li><a href="/SpaPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Spa</a></li>
              <li><a href="/MassageTherapyPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Massage Therapy</a></li>
              <li><a href="/TanningSalonPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Tanning Salon</a></li>
              <li><a href="/TattooShopPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Tattoo Shop</a></li>
              <li><a href="/BeautyClinicPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Beauty Clinic</a></li>
              <li><a href="/MedSpaPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Med Spa</a></li>
              <li><a href="/PersonalTrainerPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Personal Trainers</a></li>
              <li><a href="/YogaStudioPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Yoga Studios</a></li>
              <li><a href="/FitnessGymPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Fitness Gyms</a></li>
              <li><a href="/DanceStudioPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Dance Studios</a></li>
              <li><a href="/CoachingBusinessPOS" className="text-teal-700 hover:text-teal-900 hover:underline">Coaching Businesses</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Retail</h2>
            <ul className="space-y-2">
              <li><a href="/ClothingBoutiquePOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Clothing Boutiques</a></li>
              <li><a href="/ShoeStorePOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Shoe Stores</a></li>
              <li><a href="/JewelryStorePOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Jewelry Stores</a></li>
              <li><a href="/SpecialtyFoodStorePOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Specialty Food Stores</a></li>
              <li><a href="/FurnitureStorePOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Furniture Stores</a></li>
              <li><a href="/ElectronicsStorePOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Electronics Stores</a></li>
              <li><a href="/SportingGoodsStorePOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Sporting Goods Stores</a></li>
              <li><a href="/PetStorePOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Pet Stores</a></li>
              <li><a href="/FloristPOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Florists</a></li>
              <li><a href="/ThriftStorePOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Thrift Stores</a></li>
              <li><a href="/PopUpRetailPOS" className="text-indigo-700 hover:text-indigo-900 hover:underline">Pop-Up Retail</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Healthcare</h2>
            <ul className="space-y-2">
              <li><a href="/DentalOfficePOS" className="text-rose-700 hover:text-rose-900 hover:underline">Dental Offices</a></li>
              <li><a href="/ChiropractorPOS" className="text-rose-700 hover:text-rose-900 hover:underline">Chiropractic Clinics</a></li>
              <li><a href="/PhysicalTherapyPOS" className="text-rose-700 hover:text-rose-900 hover:underline">Physical Therapy</a></li>
              <li><a href="/UrgentCarePOS" className="text-rose-700 hover:text-rose-900 hover:underline">Urgent Care Centers</a></li>
              <li><a href="/PrivateMedicalPOS" className="text-rose-700 hover:text-rose-900 hover:underline">Private Medical Practices</a></li>
              <li><a href="/MentalHealthClinicPOS" className="text-rose-700 hover:text-rose-900 hover:underline">Mental Health Clinics</a></li>
              <li><a href="/VeterinaryClinicPOS" className="text-rose-700 hover:text-rose-900 hover:underline">Veterinary Clinics</a></li>
              <li><a href="/HomeHealthcarePOS" className="text-rose-700 hover:text-rose-900 hover:underline">Home Healthcare</a></li>
              <li><a href="/MedicalLabPOS" className="text-rose-700 hover:text-rose-900 hover:underline">Medical Labs</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Home Services</h2>
            <ul className="space-y-2">
              <li><a href="/HVACCompanyPOS" className="text-orange-700 hover:text-orange-900 hover:underline">HVAC Companies</a></li>
              <li><a href="/PlumbingServicesPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Plumbing Services</a></li>
              <li><a href="/ElectricalContractorPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Electrical Contractors</a></li>
              <li><a href="/RoofingCompanyPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Roofing Companies</a></li>
              <li><a href="/LandscapingPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Landscaping</a></li>
              <li><a href="/PestControlPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Pest Control</a></li>
              <li><a href="/ResidentialCleaningPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Residential Cleaning</a></li>
              <li><a href="/CommercialCleaningPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Commercial Cleaning</a></li>
              <li><a href="/RestorationCompanyPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Restoration Companies</a></li>
              <li><a href="/HandymanServicesPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Handyman Services</a></li>
              <li><a href="/PoolMaintenancePOS" className="text-orange-700 hover:text-orange-900 hover:underline">Pool Maintenance</a></li>
              <li><a href="/SecurityInstallerPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Security Installers</a></li>
              <li><a href="/MovingCompanyPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Moving Companies</a></li>
              <li><a href="/ApplianceRepairPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Appliance Repair</a></li>
              <li><a href="/DryCleanersPOS" className="text-orange-700 hover:text-orange-900 hover:underline">Dry Cleaners</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-lg border border-violet-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Professional Services</h2>
            <ul className="space-y-2">
              <li><a href="/LawFirmPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Law Firms</a></li>
              <li><a href="/AccountingFirmPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Accounting Firms</a></li>
              <li><a href="/BookkeepingServicesPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Bookkeeping Services</a></li>
              <li><a href="/MarketingAgencyPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Marketing Agencies</a></li>
              <li><a href="/ConsultingFirmPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Consulting Firms</a></li>
              <li><a href="/ITServicesPOS" className="text-violet-700 hover:text-violet-900 hover:underline">IT Services & MSPs</a></li>
              <li><a href="/WebDesignAgencyPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Web Design Agencies</a></li>
              <li><a href="/SoftwareDeveloperPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Software Developers</a></li>
              <li><a href="/ArchitectureFirmPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Architecture Firms</a></li>
              <li><a href="/EngineeringFirmPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Engineering Firms</a></li>
              <li><a href="/StaffingAgencyPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Staffing Agencies</a></li>
              <li><a href="/TranslationServicesPOS" className="text-violet-700 hover:text-violet-900 hover:underline">Translation Services</a></li>
              <li><a href="/PRFirmPOS" className="text-violet-700 hover:text-violet-900 hover:underline">PR Firms</a></li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Resources</h2>
            <ul className="space-y-2">
              <li><a href="/News" className="text-gray-700 hover:text-gray-900 hover:underline">News & Insights</a></li>
              <li><a href="/Quiz" className="text-gray-700 hover:text-gray-900 hover:underline">Business Quiz</a></li>
              <li><a href="/Support" className="text-gray-700 hover:text-gray-900 hover:underline">Support Center</a></li>
              <li><a href="/Sitemap" className="text-gray-700 hover:text-gray-900 hover:underline">Sitemap</a></li>
            </ul>
          </div>

          <NewsArticlesSection today={today} />

        </div>

        <div className="mt-12 bg-amber-50 border-l-4 border-amber-500 p-6 rounded">
          <h3 className="text-lg font-bold text-gray-900 mb-2">For Search Engines</h3>
          <p className="text-sm text-gray-700">
            This sitemap follows Google's XML sitemap protocol with priorities, change frequencies, and last modification dates.
            All pages are optimized for search engines with proper meta tags, structured data, and semantic HTML.
          </p>
          <p className="text-sm text-gray-600 mt-3">
            Static Pages: {pages.length} + dynamic news article URLs | Last Updated: {today}
          </p>
        </div>
      </div>
    </div>
  );
}