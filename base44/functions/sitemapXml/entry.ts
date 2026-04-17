import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BASE_URL = "https://ezpayamerica.com";

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/ApplyOnline', priority: '1.0', changefreq: 'weekly' },
  { path: '/FreeDemo', priority: '0.95', changefreq: 'weekly' },
  { path: '/Services', priority: '0.9', changefreq: 'weekly' },
  { path: '/EzPayPOSHome', priority: '0.9', changefreq: 'weekly' },
  { path: '/Shop', priority: '0.9', changefreq: 'daily' },
  { path: '/News', priority: '0.85', changefreq: 'daily' },
  { path: '/Contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/Quiz', priority: '0.75', changefreq: 'monthly' },
  { path: '/Support', priority: '0.8', changefreq: 'weekly' },
  { path: '/Helpdesk', priority: '0.7', changefreq: 'weekly' },
  { path: '/RetailMerchants', priority: '0.85', changefreq: 'weekly' },
  { path: '/RestaurantMerchants', priority: '0.85', changefreq: 'weekly' },
  { path: '/WebPaymentPages', priority: '0.8', changefreq: 'weekly' },
  { path: '/MerchantCashAdvance', priority: '0.8', changefreq: 'weekly' },
  { path: '/RetailPaymentSolutions', priority: '0.8', changefreq: 'weekly' },
  { path: '/BrandedPaymentGateway', priority: '0.85', changefreq: 'weekly' },
  { path: '/GatewayRecurringBilling', priority: '0.8', changefreq: 'weekly' },
  { path: '/GatewayFraudProtection', priority: '0.8', changefreq: 'weekly' },
  { path: '/GatewayTokenization', priority: '0.8', changefreq: 'weekly' },
  { path: '/GatewayPaymentLinks', priority: '0.8', changefreq: 'weekly' },
  { path: '/GatewayMobilePayments', priority: '0.8', changefreq: 'weekly' },
  { path: '/GatewayReporting', priority: '0.8', changefreq: 'weekly' },
  { path: '/ACHPayments', priority: '0.75', changefreq: 'monthly' },
  { path: '/MobilePayments', priority: '0.75', changefreq: 'monthly' },
  { path: '/MerchantCapital', priority: '0.75', changefreq: 'monthly' },
  { path: '/ECommerce', priority: '0.75', changefreq: 'monthly' },
  { path: '/FraudDetection', priority: '0.7', changefreq: 'monthly' },
  { path: '/RetailPOS', priority: '0.85', changefreq: 'weekly' },
  { path: '/RestaurantPOS', priority: '0.85', changefreq: 'weekly' },
  { path: '/CountertopTerminal', priority: '0.8', changefreq: 'weekly' },
  { path: '/FullServiceRestaurantPOS', priority: '0.8', changefreq: 'weekly' },
  { path: '/QuickServicePOS', priority: '0.8', changefreq: 'weekly' },
  { path: '/CoffeePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/BakeryPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/FoodTruckPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/BarTavernPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/CateringPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/IceCreamShopPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/JuiceSmoothieBarPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/GhostKitchenPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/BreweryPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/WineryPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/NightclubPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/HotelRestaurantPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/CafeteriaPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/GroceryStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/MiniMarketPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/VapeStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/GiftShopPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ClothingBoutiquePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ShoeStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/JewelryStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/SpecialtyFoodStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/FurnitureStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ElectronicsStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/SportingGoodsStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/PetStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/FloristPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ThriftStorePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/PopUpRetailPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/HairSalonPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/BarberShopPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/NailSalonPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/SpaPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/MassageTherapyPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/TanningSalonPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/TattooShopPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/BeautyClinicPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/MedSpaPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/PersonalTrainerPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/YogaStudioPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/FitnessGymPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/DanceStudioPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/CoachingBusinessPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/DentalOfficePOS', priority: '0.8', changefreq: 'weekly' },
  { path: '/ChiropractorPOS', priority: '0.8', changefreq: 'weekly' },
  { path: '/PhysicalTherapyPOS', priority: '0.8', changefreq: 'weekly' },
  { path: '/UrgentCarePOS', priority: '0.8', changefreq: 'weekly' },
  { path: '/PrivateMedicalPOS', priority: '0.8', changefreq: 'weekly' },
  { path: '/MentalHealthClinicPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/VeterinaryClinicPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/HomeHealthcarePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/MedicalLabPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/HVACCompanyPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/PlumbingServicesPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ElectricalContractorPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/RoofingCompanyPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/LandscapingPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/PestControlPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ResidentialCleaningPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/CommercialCleaningPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/RestorationCompanyPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/HandymanServicesPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/PoolMaintenancePOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/SecurityInstallerPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/MovingCompanyPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ApplianceRepairPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/DryCleanersPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/LawFirmPOS', priority: '0.8', changefreq: 'weekly' },
  { path: '/AccountingFirmPOS', priority: '0.8', changefreq: 'weekly' },
  { path: '/BookkeepingServicesPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/MarketingAgencyPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ConsultingFirmPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ITServicesPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/WebDesignAgencyPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/SoftwareDeveloperPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/ArchitectureFirmPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/EngineeringFirmPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/StaffingAgencyPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/TranslationServicesPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/PRFirmPOS', priority: '0.75', changefreq: 'weekly' },
  { path: '/AffiliateSignup', priority: '0.7', changefreq: 'monthly' },
  { path: '/BookAppointment', priority: '0.9', changefreq: 'weekly' },
];

function escapeXml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const today = new Date().toISOString().split('T')[0];

    // Fetch published news articles dynamically
    const articles = await base44.asServiceRole.entities.NewsArticle.filter({ published: true }, '-updated_date', 500);

    const staticEntries = STATIC_PAGES.map(p =>
      `  <url>\n    <loc>${BASE_URL}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
    ).join('\n');

    const newsEntries = articles.map(a => {
      const slug = a.slug || a.id;
      const lastmod = a.updated_date ? a.updated_date.split('T')[0] : today;
      return `  <url>\n    <loc>${BASE_URL}/news/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n    <news:news xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n      <news:publication>\n        <news:name>EzPay America</news:name>\n        <news:language>en</news:language>\n      </news:publication>\n      <news:publication_date>${lastmod}</news:publication_date>\n      <news:title>${escapeXml(a.title)}</news:title>\n    </news:news>\n  </url>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${staticEntries}\n${newsEntries}\n</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      }
    });

  } catch (error) {
    return new Response(`<?xml version="1.0"?><error>${error.message}</error>`, {
      status: 500,
      headers: { 'Content-Type': 'application/xml' }
    });
  }
});