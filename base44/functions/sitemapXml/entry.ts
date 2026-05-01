import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BASE_URL = "https://ezpayamerica.com";

const TOP_CITIES = [
  { stateSlug: "new-york",       citySlug: "new-york" },
  { stateSlug: "california",     citySlug: "los-angeles" },
  { stateSlug: "illinois",       citySlug: "chicago" },
  { stateSlug: "texas",          citySlug: "houston" },
  { stateSlug: "arizona",        citySlug: "phoenix" },
  { stateSlug: "pennsylvania",   citySlug: "philadelphia" },
  { stateSlug: "texas",          citySlug: "san-antonio" },
  { stateSlug: "california",     citySlug: "san-diego" },
  { stateSlug: "texas",          citySlug: "dallas" },
  { stateSlug: "florida",        citySlug: "jacksonville" },
  { stateSlug: "texas",          citySlug: "austin" },
  { stateSlug: "texas",          citySlug: "fort-worth" },
  { stateSlug: "ohio",           citySlug: "columbus" },
  { stateSlug: "north-carolina", citySlug: "charlotte" },
  { stateSlug: "indiana",        citySlug: "indianapolis" },
  { stateSlug: "california",     citySlug: "san-francisco" },
  { stateSlug: "washington",     citySlug: "seattle" },
  { stateSlug: "colorado",       citySlug: "denver" },
  { stateSlug: "tennessee",      citySlug: "nashville" },
  { stateSlug: "oklahoma",       citySlug: "oklahoma-city" },
  { stateSlug: "texas",          citySlug: "el-paso" },
  { stateSlug: "dc",             citySlug: "washington" },
  { stateSlug: "nevada",         citySlug: "las-vegas" },
  { stateSlug: "kentucky",       citySlug: "louisville" },
  { stateSlug: "tennessee",      citySlug: "memphis" },
  { stateSlug: "oregon",         citySlug: "portland" },
  { stateSlug: "maryland",       citySlug: "baltimore" },
  { stateSlug: "wisconsin",      citySlug: "milwaukee" },
  { stateSlug: "new-mexico",     citySlug: "albuquerque" },
  { stateSlug: "arizona",        citySlug: "tucson" },
  { stateSlug: "california",     citySlug: "fresno" },
  { stateSlug: "california",     citySlug: "sacramento" },
  { stateSlug: "georgia",        citySlug: "atlanta" },
  { stateSlug: "missouri",       citySlug: "kansas-city" },
  { stateSlug: "arizona",        citySlug: "mesa" },
  { stateSlug: "nebraska",       citySlug: "omaha" },
  { stateSlug: "north-carolina", citySlug: "raleigh" },
  { stateSlug: "ohio",           citySlug: "cleveland" },
  { stateSlug: "virginia",       citySlug: "virginia-beach" },
  { stateSlug: "california",     citySlug: "long-beach" },
  { stateSlug: "colorado",       citySlug: "colorado-springs" },
  { stateSlug: "florida",        citySlug: "miami" },
  { stateSlug: "florida",        citySlug: "tampa" },
  { stateSlug: "florida",        citySlug: "orlando" },
  { stateSlug: "minnesota",      citySlug: "minneapolis" },
  { stateSlug: "pennsylvania",   citySlug: "pittsburgh" },
  { stateSlug: "missouri",       citySlug: "st-louis" },
  { stateSlug: "tennessee",      citySlug: "knoxville" },
  { stateSlug: "tennessee",      citySlug: "chattanooga" },
  { stateSlug: "alabama",        citySlug: "birmingham" },
];

const BUSINESS_SLUGS = [
  "clothing-boutique","shoe-store","jewelry-store","specialty-food-store",
  "furniture-store","electronics-store","sporting-goods-store","pet-store",
  "florist","thrift-store","pop-up-retail",
  "hair-salon","barber-shop","nail-salon","spa","massage-therapy",
  "tanning-salon","tattoo-shop","beauty-clinic","med-spa","personal-trainer",
  "yoga-studio","fitness-gym","dance-studio","coaching-business",
  "dental-office","chiropractor","physical-therapy","urgent-care",
  "private-medical","mental-health-clinic","veterinary-clinic",
  "home-healthcare","medical-lab",
  "hvac-company","plumbing-services","electrical-contractor","roofing-company",
  "landscaping","pest-control","residential-cleaning","commercial-cleaning",
  "restoration-company","handyman-services","pool-maintenance",
  "security-installer","moving-company","appliance-repair","dry-cleaners",
  "law-firm","accounting-firm","bookkeeping-services","marketing-agency",
  "consulting-firm","it-services","web-design-agency","software-developer",
  "architecture-firm","engineering-firm","staffing-agency",
  "translation-services","pr-firm",
];

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/ApplyOnline', priority: '1.0', changefreq: 'weekly' },
  { path: '/Services', priority: '0.9', changefreq: 'weekly' },
  { path: '/EzPayPOSHome', priority: '0.9', changefreq: 'weekly' },
  { path: '/News', priority: '0.85', changefreq: 'daily' },
  { path: '/Contact', priority: '0.9', changefreq: 'monthly' },
  { path: '/Quiz', priority: '0.75', changefreq: 'monthly' },
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
  { path: '/CashDiscountProgram', priority: '0.9', changefreq: 'weekly' },
  { path: '/GiftCardProgram', priority: '0.8', changefreq: 'weekly' },
  { path: '/LoyaltyProgram', priority: '0.8', changefreq: 'weekly' },
  { path: '/PointOfSaleFinancing', priority: '0.8', changefreq: 'weekly' },
  { path: '/TapToPay', priority: '0.85', changefreq: 'weekly' },
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
  { path: '/FAQ', priority: '0.85', changefreq: 'monthly' },
];

function escapeXml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function urlEntry(loc, priority, changefreq, lastmod) {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function wrapUrlset(entries, extra = '') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${extra}>
${entries.join('\n')}
</urlset>`;
}

function sitemapIndex(sitemaps) {
  const entries = sitemaps.map(({ loc, lastmod }) => `  <sitemap>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const type = url.searchParams.get('type'); // static | news | locations | cms
    const today = new Date().toISOString().split('T')[0];

    // --- Sitemap Index (no ?type param) ---
    if (!type) {
      const xml = sitemapIndex([
        { loc: `${BASE_URL}/sitemap.xml?type=static`, lastmod: today },
        { loc: `${BASE_URL}/sitemap.xml?type=news`, lastmod: today },
        { loc: `${BASE_URL}/sitemap.xml?type=locations`, lastmod: today },
        { loc: `${BASE_URL}/sitemap.xml?type=cms`, lastmod: today },
      ]);
      return new Response(xml, {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // --- Static pages sitemap ---
    if (type === 'static') {
      const entries = STATIC_PAGES.map(p => urlEntry(`${BASE_URL}${p.path}`, p.priority, p.changefreq, today));
      return new Response(wrapUrlset(entries), {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    // --- News articles sitemap ---
    if (type === 'news') {
      const articles = await base44.asServiceRole.entities.NewsArticle.filter({ published: true }, '-updated_date', 1000);
      const entries = articles.map(a => {
        const slug = a.slug || a.id;
        const lastmod = a.updated_date ? a.updated_date.split('T')[0] : today;
        const pubDate = (a.date_published || a.created_date || today).split('T')[0];
        return `  <url>
    <loc>${BASE_URL}/news/${escapeXml(slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>EzPay America</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`;
      });
      return new Response(wrapUrlset(entries, '\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"'), {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=1800' }
      });
    }

    // --- Location landing pages sitemap ---
    if (type === 'locations') {
      const entries = [];
      for (const slug of BUSINESS_SLUGS) {
        for (const loc of TOP_CITIES) {
          entries.push(urlEntry(`${BASE_URL}/${slug}/${loc.stateSlug}/${loc.citySlug}`, '0.7', 'monthly', today));
        }
      }
      return new Response(wrapUrlset(entries), {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' }
      });
    }

    // --- CMS-managed pages sitemap ---
    if (type === 'cms') {
      const staticPathSet = new Set(STATIC_PAGES.map(p => p.path));
      const cmsPages = await base44.asServiceRole.entities.SitePage.filter({ isActive: true }, 'path', 1000);
      const entries = cmsPages
        .filter(p => p.path && !staticPathSet.has(p.path))
        .map(p => urlEntry(`${BASE_URL}${p.path}`, p.priority || '0.75', p.changefreq || 'weekly', today));
      return new Response(wrapUrlset(entries), {
        status: 200,
        headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }

    return new Response('Not found', { status: 404 });

  } catch (error) {
    return new Response(`<?xml version="1.0"?><error>${escapeXml(error.message)}</error>`, {
      status: 500,
      headers: { 'Content-Type': 'application/xml' }
    });
  }
});