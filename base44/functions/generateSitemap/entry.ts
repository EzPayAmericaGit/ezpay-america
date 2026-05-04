import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BASE = "https://ezpayamerica.com";

const PAGES = ["/","/ApplyOnline","/Services","/EzPayPOSHome","/News","/Contact","/Quiz","/BookAppointment","/FAQ","/AffiliateSignup","/RetailMerchants","/RestaurantMerchants","/WebPaymentPages","/MerchantCashAdvance","/RetailPaymentSolutions","/BrandedPaymentGateway","/GatewayRecurringBilling","/GatewayFraudProtection","/GatewayTokenization","/GatewayPaymentLinks","/GatewayMobilePayments","/GatewayReporting","/ACHPayments","/MobilePayments","/MerchantCapital","/ECommerce","/FraudDetection","/CashDiscountProgram","/GiftCardProgram","/LoyaltyProgram","/PointOfSaleFinancing","/TapToPay","/RetailPOS","/RestaurantPOS","/CountertopTerminal","/FullServiceRestaurantPOS","/QuickServicePOS","/CoffeePOS","/BakeryPOS","/FoodTruckPOS","/BarTavernPOS","/CateringPOS","/IceCreamShopPOS","/JuiceSmoothieBarPOS","/GhostKitchenPOS","/BreweryPOS","/WineryPOS","/NightclubPOS","/HotelRestaurantPOS","/CafeteriaPOS","/GroceryStorePOS","/MiniMarketPOS","/VapeStorePOS","/GiftShopPOS","/ClothingBoutiquePOS","/ShoeStorePOS","/JewelryStorePOS","/SpecialtyFoodStorePOS","/FurnitureStorePOS","/ElectronicsStorePOS","/SportingGoodsStorePOS","/PetStorePOS","/FloristPOS","/ThriftStorePOS","/PopUpRetailPOS","/HairSalonPOS","/BarberShopPOS","/NailSalonPOS","/SpaPOS","/MassageTherapyPOS","/TanningSalonPOS","/TattooShopPOS","/BeautyClinicPOS","/MedSpaPOS","/PersonalTrainerPOS","/YogaStudioPOS","/FitnessGymPOS","/DanceStudioPOS","/CoachingBusinessPOS","/DentalOfficePOS","/ChiropractorPOS","/PhysicalTherapyPOS","/UrgentCarePOS","/PrivateMedicalPOS","/MentalHealthClinicPOS","/VeterinaryClinicPOS","/HomeHealthcarePOS","/MedicalLabPOS","/HVACCompanyPOS","/PlumbingServicesPOS","/ElectricalContractorPOS","/RoofingCompanyPOS","/LandscapingPOS","/PestControlPOS","/ResidentialCleaningPOS","/CommercialCleaningPOS","/RestorationCompanyPOS","/HandymanServicesPOS","/PoolMaintenancePOS","/SecurityInstallerPOS","/MovingCompanyPOS","/ApplianceRepairPOS","/DryCleanersPOS","/LawFirmPOS","/AccountingFirmPOS","/BookkeepingServicesPOS","/MarketingAgencyPOS","/ConsultingFirmPOS","/ITServicesPOS","/WebDesignAgencyPOS","/SoftwareDeveloperPOS","/ArchitectureFirmPOS","/EngineeringFirmPOS","/StaffingAgencyPOS","/TranslationServicesPOS","/PRFirmPOS"];

function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const today = new Date().toISOString().split('T')[0];
  let articles = [];
  try { articles = await base44.asServiceRole.entities.NewsArticle.filter({ published: true }, '-updated_date', 500); } catch(_){}

  const urls = [
    ...PAGES.map(p => `<url><loc>${BASE}${p}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`),
    ...articles.map(a => `<url><loc>${BASE}/news/${esc(a.slug||a.id)}</loc><lastmod>${(a.updated_date||today).split('T')[0]}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`)
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

  return new Response(xml, { status: 200, headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
});