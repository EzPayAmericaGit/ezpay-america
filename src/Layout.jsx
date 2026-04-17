import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import HelpWidget from "@/components/HelpWidget";
import Footer from "@/components/home/Footer";

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const navigationItems = React.useMemo(() => {
    const items = [
      { title: "Home", url: createPageUrl("Home") },
      { 
        title: "Services", 
        url: createPageUrl("Services"),
        submenu: [
          { title: "Services Overview", url: createPageUrl("Services") },
          { title: "── Additional Services ──", url: createPageUrl("Services") },
          { title: "Retail Merchants", url: createPageUrl("RetailMerchants") },
          { title: "Restaurant Merchants", url: createPageUrl("RestaurantMerchants") },
          { title: "Web Payment Pages", url: createPageUrl("WebPaymentPages") },
          { title: "Merchant Cash Advance", url: createPageUrl("MerchantCashAdvance") },
          { title: "Retail Payment Solutions", url: createPageUrl("RetailPaymentSolutions") },
          { title: "Branded Payment Gateway", url: createPageUrl("BrandedPaymentGateway") },
          { title: "Recurring Billing & Subscriptions", url: createPageUrl("GatewayRecurringBilling") },
          { title: "Fraud Protection", url: createPageUrl("GatewayFraudProtection") },
          { title: "Tokenization & Card Security", url: createPageUrl("GatewayTokenization") },
          { title: "Payment Links", url: createPageUrl("GatewayPaymentLinks") },
          { title: "Mobile & Tap-to-Pay", url: createPageUrl("GatewayMobilePayments") },
          { title: "Reporting & Analytics", url: createPageUrl("GatewayReporting") },
          { title: "ACH Payments", url: createPageUrl("ACHPayments") },
          { title: "Mobile Payments", url: createPageUrl("MobilePayments") },
          { title: "E-Commerce", url: createPageUrl("ECommerce") },
          { title: "Merchant Capital", url: createPageUrl("MerchantCapital") },
          { title: "Fraud Detection", url: createPageUrl("FraudDetection") },
          { title: "── Food & Hospitality ──", url: createPageUrl("FullServiceRestaurantPOS") },
          { title: "Full Service Restaurants", url: createPageUrl("FullServiceRestaurantPOS") },
          { title: "Quick Service / Fast Food", url: createPageUrl("QuickServicePOS") },
          { title: "Coffee Shops & Cafes", url: createPageUrl("CoffeePOS") },
          { title: "Food Trucks", url: createPageUrl("FoodTruckPOS") },
          { title: "Bars & Pubs", url: createPageUrl("BarTavernPOS") },
          { title: "Bakeries", url: createPageUrl("BakeryPOS") },
          { title: "Catering Companies", url: createPageUrl("CateringPOS") },
          { title: "Ice Cream Shops", url: createPageUrl("IceCreamShopPOS") },
          { title: "Juice & Smoothie Bars", url: createPageUrl("JuiceSmoothieBarPOS") },
          { title: "Ghost Kitchens", url: createPageUrl("GhostKitchenPOS") },
          { title: "Breweries", url: createPageUrl("BreweryPOS") },
          { title: "Wineries", url: createPageUrl("WineryPOS") },
          { title: "Nightclubs", url: createPageUrl("NightclubPOS") },
          { title: "Hotel Restaurants", url: createPageUrl("HotelRestaurantPOS") },
          { title: "Cafeterias", url: createPageUrl("CafeteriaPOS") },
          { title: "── Retail ──", url: createPageUrl("RetailPOS") },
          { title: "Clothing Boutiques", url: createPageUrl("ClothingBoutiquePOS") },
          { title: "Shoe Stores", url: createPageUrl("ShoeStorePOS") },
          { title: "Jewelry Stores", url: createPageUrl("JewelryStorePOS") },
          { title: "Gift Shops", url: createPageUrl("GiftShopPOS") },
          { title: "Convenience Stores", url: createPageUrl("MiniMarketPOS") },
          { title: "Vape Shops", url: createPageUrl("VapeStorePOS") },
          { title: "Grocery Stores", url: createPageUrl("GroceryStorePOS") },
          { title: "Specialty Food Stores", url: createPageUrl("SpecialtyFoodStorePOS") },
          { title: "Furniture Stores", url: createPageUrl("FurnitureStorePOS") },
          { title: "Electronics Stores", url: createPageUrl("ElectronicsStorePOS") },
          { title: "Sporting Goods Stores", url: createPageUrl("SportingGoodsStorePOS") },
          { title: "Pet Stores", url: createPageUrl("PetStorePOS") },
          { title: "Florists", url: createPageUrl("FloristPOS") },
          { title: "Thrift Stores", url: createPageUrl("ThriftStorePOS") },
          { title: "Pop-Up Retail Shops", url: createPageUrl("PopUpRetailPOS") },
          { title: "── Personal Services ──", url: createPageUrl("HairSalonPOS") },
          { title: "Hair Salons", url: createPageUrl("HairSalonPOS") },
          { title: "Barber Shops", url: createPageUrl("BarberShopPOS") },
          { title: "Nail Salons", url: createPageUrl("NailSalonPOS") },
          { title: "Spas", url: createPageUrl("SpaPOS") },
          { title: "Massage Therapy", url: createPageUrl("MassageTherapyPOS") },
          { title: "Tanning Salons", url: createPageUrl("TanningSalonPOS") },
          { title: "Tattoo Shops", url: createPageUrl("TattooShopPOS") },
          { title: "Beauty Clinics", url: createPageUrl("BeautyClinicPOS") },
          { title: "Med Spas", url: createPageUrl("MedSpaPOS") },
          { title: "Personal Trainers", url: createPageUrl("PersonalTrainerPOS") },
          { title: "Yoga Studios", url: createPageUrl("YogaStudioPOS") },
          { title: "Fitness Gyms", url: createPageUrl("FitnessGymPOS") },
          { title: "Dance Studios", url: createPageUrl("DanceStudioPOS") },
          { title: "Coaching Businesses", url: createPageUrl("CoachingBusinessPOS") },
          { title: "── Healthcare ──", url: createPageUrl("DentalOfficePOS") },
          { title: "Dental Offices", url: createPageUrl("DentalOfficePOS") },
          { title: "Chiropractic Clinics", url: createPageUrl("ChiropractorPOS") },
          { title: "Physical Therapy Clinics", url: createPageUrl("PhysicalTherapyPOS") },
          { title: "Urgent Care Centers", url: createPageUrl("UrgentCarePOS") },
          { title: "Private Medical Practices", url: createPageUrl("PrivateMedicalPOS") },
          { title: "Mental Health Clinics", url: createPageUrl("MentalHealthClinicPOS") },
          { title: "Veterinary Clinics", url: createPageUrl("VeterinaryClinicPOS") },
          { title: "Home Healthcare", url: createPageUrl("HomeHealthcarePOS") },
          { title: "Medical Labs", url: createPageUrl("MedicalLabPOS") },
          { title: "── Home Services ──", url: createPageUrl("HVACCompanyPOS") },
          { title: "HVAC Companies", url: createPageUrl("HVACCompanyPOS") },
          { title: "Plumbing Services", url: createPageUrl("PlumbingServicesPOS") },
          { title: "Electrical Contractors", url: createPageUrl("ElectricalContractorPOS") },
          { title: "Roofing Companies", url: createPageUrl("RoofingCompanyPOS") },
          { title: "Landscaping Businesses", url: createPageUrl("LandscapingPOS") },
          { title: "Pest Control", url: createPageUrl("PestControlPOS") },
          { title: "Residential Cleaning", url: createPageUrl("ResidentialCleaningPOS") },
          { title: "Commercial Cleaning", url: createPageUrl("CommercialCleaningPOS") },
          { title: "Restoration Companies", url: createPageUrl("RestorationCompanyPOS") },
          { title: "Handyman Services", url: createPageUrl("HandymanServicesPOS") },
          { title: "Pool Maintenance", url: createPageUrl("PoolMaintenancePOS") },
          { title: "Security System Installers", url: createPageUrl("SecurityInstallerPOS") },
          { title: "Moving Companies", url: createPageUrl("MovingCompanyPOS") },
          { title: "Appliance Repair", url: createPageUrl("ApplianceRepairPOS") },
          { title: "Dry Cleaners", url: createPageUrl("DryCleanersPOS") },
          { title: "── Professional Services ──", url: createPageUrl("LawFirmPOS") },
          { title: "Law Firms", url: createPageUrl("LawFirmPOS") },
          { title: "Accounting Firms", url: createPageUrl("AccountingFirmPOS") },
          { title: "Bookkeeping Services", url: createPageUrl("BookkeepingServicesPOS") },
          { title: "Marketing Agencies", url: createPageUrl("MarketingAgencyPOS") },
          { title: "Consulting Firms", url: createPageUrl("ConsultingFirmPOS") },
          { title: "IT Services & MSPs", url: createPageUrl("ITServicesPOS") },
          { title: "Web Design Agencies", url: createPageUrl("WebDesignAgencyPOS") },
          { title: "Software Developers", url: createPageUrl("SoftwareDeveloperPOS") },
          { title: "Architecture Firms", url: createPageUrl("ArchitectureFirmPOS") },
          { title: "Engineering Firms", url: createPageUrl("EngineeringFirmPOS") },
          { title: "Staffing Agencies", url: createPageUrl("StaffingAgencyPOS") },
          { title: "Translation Services", url: createPageUrl("TranslationServicesPOS") },
          { title: "PR Firms", url: createPageUrl("PRFirmPOS") }
        ]
      },
      { 
        title: "EzPay POS", 
        url: createPageUrl("EzPayPOSHome")
      },
      { title: "Quiz", url: createPageUrl("Quiz") },
      { title: "Apply Online", url: createPageUrl("ApplyOnline") },
      { title: "Book a Call", url: createPageUrl("BookAppointment") },
      { title: "Affiliates", url: createPageUrl("AffiliateSignup") },
      { title: "News", url: createPageUrl("News") },
      { title: "Helpdesk", url: createPageUrl("Helpdesk") }
    ];

    return items;
  }, []);

  // Live Chat - Opens Crisp chat or alternative
  const openLiveChat = () => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  // Make openLiveChat available globally
  React.useEffect(() => {
    window.openLiveChat = openLiveChat;
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AnalyticsTracker />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png" 
                alt="EzPay America - Zero-Fee Payment Processing Solutions"
                className="w-12 h-12 object-contain"
                style={{ filter: 'saturate(1.4) hue-rotate(-5deg) brightness(0.95)' }}
                loading="eager"
                width="48"
                height="48"
              />
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent whitespace-nowrap">
                  EzPay America
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
              {navigationItems.map((item) => (
                item.submenu ? (
                  <div 
                    key={item.title}
                    className="relative group"
                  >
                    <Link
                      to={item.url}
                      className={`flex items-center gap-1 text-xs lg:text-sm text-gray-700 hover:text-amber-600 font-medium transition-colors whitespace-nowrap ${
                        location.pathname === item.url ? "text-amber-600" : ""
                      }`}
                    >
                      {item.title}
                      <ChevronDown className="w-4 h-4" />
                    </Link>
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-96 overflow-y-auto">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.url}
                            className="block px-4 py-3 text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`text-xs lg:text-sm text-gray-700 hover:text-amber-600 font-medium transition-colors whitespace-nowrap ${
                      location.pathname === item.url ? "text-amber-600" : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                )
              ))}

              <a href="tel:8653169625">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg text-xs lg:text-sm px-2 lg:px-4">
                  <Phone className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  (865) 316-9625
                </Button>
              </a>
              </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="px-4 py-4 space-y-3">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  {item.submenu ? (
                    <>
                      <Link
                        to={item.url}
                        className={`block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors ${
                          location.pathname === item.url ? "bg-amber-50 text-amber-600" : ""
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.url}
                          className="block px-8 py-2 text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      to={item.url}
                      className={`block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors ${
                        location.pathname === item.url ? "bg-amber-50 text-amber-600" : ""
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}

              <a href="tel:8653169625" className="block pt-2">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                  <Phone className="w-4 h-4 mr-2" />
                  (865) 316-9625
                </Button>
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-0">
        {children}
      </main>

      <Footer />
      <HelpWidget />
    </div>
  );
}