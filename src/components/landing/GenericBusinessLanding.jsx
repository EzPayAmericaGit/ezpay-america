import React from "react";
import SEOHead from "../SEOHead";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingCTA from "./LandingCTA";
import { DollarSign, Gift, Zap, Headphones, FileText, Shield } from "lucide-react";

const DEFAULT_FEATURES = [
  { icon: DollarSign, title: "Zero Transaction Fees", description: "Our surcharge program means you pay $0 in credit card processing fees. Customers pay a small convenience fee — you keep 100% of your revenue.", color: "from-green-500 to-emerald-600" },
  { icon: Gift, title: "Free Equipment Included", description: "Get a free terminal, POS system, or mobile reader with no upfront cost. We provide the hardware you need to accept payments from day one.", color: "from-amber-500 to-orange-600" },
  { icon: Zap, title: "Next-Day Deposits", description: "Get paid fast. Funds from your transactions are deposited into your account the next business day so you always have cash on hand.", color: "from-blue-500 to-cyan-600" },
  { icon: Headphones, title: "24/7 US-Based Support", description: "Our expert support team is available around the clock via phone, chat, or email. Real people who understand your business.", color: "from-purple-500 to-violet-600" },
  { icon: FileText, title: "No Contracts Ever", description: "Month-to-month service with zero cancellation fees. We earn your business every month — you're never locked in.", color: "from-red-500 to-rose-600" },
  { icon: Shield, title: "PCI Compliant Security", description: "Advanced fraud protection, end-to-end encryption, and full PCI DSS compliance. Your customers' data is always safe.", color: "from-teal-500 to-cyan-600" }
];

const CONFIGS = {
  // RETAIL
  "clothing-boutique": { title: "Clothing Boutiques", badge: "Boutique POS & Payments", bullets: ["Accept all payment types including buy-now-pay-later", "Zero transaction fees on every sale", "Inventory & size tracking built in", "Free countertop terminal included"] },
  "shoe-store": { title: "Shoe Stores", badge: "Shoe Store Payment Solutions", bullets: ["Process sales with zero transaction fees", "Track inventory by size & style", "Accept tap-to-pay & mobile wallets", "Free POS terminal included"] },
  "jewelry-store": { title: "Jewelry Stores", badge: "Jewelry Store POS & Payments", bullets: ["Process high-ticket sales for free", "Secure payment processing for luxury items", "Accept all card types & digital wallets", "Free terminal with your account"] },
  "specialty-food-store": { title: "Specialty Food Stores", badge: "Specialty Food Store Payments", bullets: ["Zero processing fees on every transaction", "Accept EBT, credit & debit cards", "Track specialty inventory easily", "Free POS terminal included"] },
  "furniture-store": { title: "Furniture Stores", badge: "Furniture Store Payment Solutions", bullets: ["Process large-ticket sales fee-free", "Offer flexible payment options to customers", "Virtual terminal for phone orders", "Free terminal & next-day deposits"] },
  "electronics-store": { title: "Electronics Stores", badge: "Electronics Store POS & Payments", bullets: ["Accept all payment types with zero fees", "Zero transaction fees on every sale", "Track serial numbers & warranties", "Free terminal with your account"] },
  "sporting-goods-store": { title: "Sporting Goods Stores", badge: "Sporting Goods Payment Solutions", bullets: ["Zero fees on high-volume seasonal sales", "Accept all card types & mobile wallets", "Inventory tracking across categories", "Free terminal included"] },
  "pet-store": { title: "Pet Stores", badge: "Pet Store POS & Payments", bullets: ["Zero processing fees for your store", "Track pet food & supply inventory", "Accept all payment types easily", "Free POS terminal with your account"] },
  "florist": { title: "Florists", badge: "Florist Payment Solutions", bullets: ["Accept deposits & phone orders online", "Zero transaction fees on every sale", "Mobile terminal for deliveries", "Same-day deposit options available"] },
  "thrift-store": { title: "Thrift Stores", badge: "Thrift Store POS & Payments", bullets: ["Accept all payment types including cards", "Zero fees keep more money in your mission", "Simple inventory management", "Free terminal with your account"] },
  "pop-up-retail": { title: "Pop-Up Retail Shops", badge: "Pop-Up Retail Payment Solutions", bullets: ["Accept payments anywhere with mobile POS", "Zero transaction fees on every sale", "Quick setup — be ready in minutes", "No monthly fees between events"] },
  // PERSONAL SERVICES
  "hair-salon": { title: "Hair Salons", badge: "Hair Salon Payment Solutions", bullets: ["Accept deposits & charge no-shows automatically", "Tip prompts on every transaction", "Zero processing fees for your salon", "Free salon-ready terminal included"] },
  "barber-shop": { title: "Barber Shops", badge: "Barber Shop POS & Payments", bullets: ["Built-in tip prompts for every cut", "Zero transaction fees on every service", "Fast checkout between clients", "Free terminal with your account"] },
  "nail-salon": { title: "Nail Salons", badge: "Nail Salon Payment Solutions", bullets: ["Tip prompts on every transaction", "Zero processing fees for your salon", "Accept all card types & mobile pay", "Free terminal with your account"] },
  "spa": { title: "Spas", badge: "Spa Payment Processing", bullets: ["Accept deposits & package payments", "Built-in gratuity prompts for staff", "Zero transaction fees on every service", "Free terminal & next-day deposits"] },
  "massage-therapy": { title: "Massage Therapy Businesses", badge: "Massage Therapy Payment Solutions", bullets: ["Accept deposits for appointments", "Built-in tip prompts for therapists", "Zero processing fees on every session", "Free terminal with your account"] },
  "tanning-salon": { title: "Tanning Salons", badge: "Tanning Salon POS & Payments", bullets: ["Sell packages & memberships easily", "Zero processing fees on every transaction", "Accept all payment types", "Free terminal included"] },
  "tattoo-shop": { title: "Tattoo Shops", badge: "Tattoo Shop Payment Solutions", bullets: ["Accept large deposits for custom work", "Zero transaction fees on every tattoo", "Built-in tip prompts for artists", "Free terminal with your account"] },
  "beauty-clinic": { title: "Beauty Clinics", badge: "Beauty Clinic Payment Processing", bullets: ["Accept treatment deposits & packages", "Zero processing fees on every service", "Secure & discreet payment handling", "Free terminal & next-day deposits"] },
  "med-spa": { title: "Med Spas", badge: "Med Spa Payment Solutions", bullets: ["Process high-ticket treatments fee-free", "Accept deposits & payment plans", "Zero transaction fees for your practice", "Free terminal with your account"] },
  "personal-trainer": { title: "Personal Trainers", badge: "Personal Trainer Payment Solutions", bullets: ["Sell sessions & packages with zero fees", "Accept mobile & tap-to-pay easily", "Automatic recurring session billing", "Free mobile reader included"] },
  "yoga-studio": { title: "Yoga Studios", badge: "Yoga Studio POS & Payments", bullets: ["Sell class packs & memberships easily", "Zero transaction fees on every class", "Accept all payment types at the door", "Free terminal with your account"] },
  "fitness-gym": { title: "Fitness Gyms", badge: "Gym Payment Processing", bullets: ["Sell memberships & day passes with zero fees", "Recurring billing for monthly members", "Accept all card types & digital wallets", "Free terminal & next-day deposits"] },
  "dance-studio": { title: "Dance Studios", badge: "Dance Studio Payment Solutions", bullets: ["Accept tuition & recital deposits", "Zero transaction fees for your studio", "Recurring billing for monthly students", "Free terminal with your account"] },
  "coaching-business": { title: "Coaching Businesses", badge: "Coaching Payment Solutions", bullets: ["Accept session fees & packages online", "Zero transaction fees for every client", "Virtual terminal for remote coaching", "Free mobile reader or terminal"] },
  // HEALTHCARE
  "dental-office": { title: "Dental Offices", badge: "Dental Practice Payment Solutions", bullets: ["Accept co-pays & treatment deposits", "Zero processing fees for your practice", "Patient-friendly checkout experience", "Free terminal & next-day deposits"] },
  "chiropractor": { title: "Chiropractic Clinics", badge: "Chiropractic Payment Processing", bullets: ["Accept co-pays & wellness plans", "Zero transaction fees for your clinic", "Quick checkout between patients", "Free terminal with your account"] },
  "physical-therapy": { title: "Physical Therapy Clinics", badge: "PT Clinic Payment Solutions", bullets: ["Accept insurance co-pays & balances", "Zero processing fees for your clinic", "Patient-friendly payment experience", "Free terminal & next-day deposits"] },
  "urgent-care": { title: "Urgent Care Centers", badge: "Urgent Care Payment Processing", bullets: ["Fast checkout for walk-in patients", "Zero transaction fees on every visit", "Accept all insurance co-pays", "Free terminal with your account"] },
  "private-medical": { title: "Private Medical Practices", badge: "Medical Practice Payment Solutions", bullets: ["Accept patient payments fee-free", "Virtual terminal for phone billing", "Zero processing fees for your practice", "Free terminal & next-day deposits"] },
  "mental-health-clinic": { title: "Mental Health Clinics", badge: "Mental Health Practice Payment Solutions", bullets: ["Accept session fees with zero processing costs", "Discreet & secure payment processing", "Virtual terminal for telehealth sessions", "Free terminal with your account"] },
  "veterinary-clinic": { title: "Veterinary Clinics", badge: "Vet Clinic Payment Processing", bullets: ["Accept large treatment bills fee-free", "Zero transaction fees for your clinic", "Fast checkout for pet owners", "Free terminal & next-day deposits"] },
  "home-healthcare": { title: "Home Healthcare Services", badge: "Home Healthcare Payment Solutions", bullets: ["Accept payments in the field with mobile POS", "Zero transaction fees on every visit", "Process invoices & insurance balances", "Free mobile reader included"] },
  "medical-lab": { title: "Medical Labs", badge: "Medical Lab Payment Processing", bullets: ["Accept patient payments fee-free", "Zero transaction fees for your lab", "Virtual terminal for remote billing", "Free terminal with your account"] },
  // HOME SERVICES
  "hvac-company": { title: "HVAC Companies", badge: "HVAC Payment Solutions", bullets: ["Accept payments on-site with mobile POS", "Zero transaction fees on every job", "Invoice & collect in the field", "Free mobile terminal included"] },
  "plumbing-services": { title: "Plumbing Services", badge: "Plumber Payment Processing", bullets: ["Accept payments on-site at every job", "Zero transaction fees for your business", "Mobile POS for field technicians", "Free mobile reader included"] },
  "electrical-contractor": { title: "Electrical Contractors", badge: "Electrician Payment Solutions", bullets: ["Accept job payments on-site fee-free", "Zero transaction fees for contractors", "Mobile terminal for field crews", "Free equipment with your account"] },
  "roofing-company": { title: "Roofing Companies", badge: "Roofing Payment Processing", bullets: ["Accept large deposits & final payments fee-free", "Zero transaction fees for your company", "Mobile terminal for on-site collection", "Free equipment with your account"] },
  "landscaping": { title: "Landscaping Businesses", badge: "Landscaping Payment Solutions", bullets: ["Accept recurring lawn care payments", "Zero transaction fees on every job", "Mobile POS for field crews", "Free mobile reader included"] },
  "pest-control": { title: "Pest Control Companies", badge: "Pest Control Payment Processing", bullets: ["Accept service payments on-site fee-free", "Zero transaction fees for your business", "Recurring billing for maintenance plans", "Free mobile reader included"] },
  "residential-cleaning": { title: "Residential Cleaning Services", badge: "House Cleaning Payment Solutions", bullets: ["Accept recurring cleaning payments easily", "Zero processing fees for your business", "Mobile payment collection at every job", "Free mobile reader included"] },
  "commercial-cleaning": { title: "Commercial Cleaning Services", badge: "Commercial Cleaning Payment Processing", bullets: ["Accept contract & recurring payments fee-free", "Zero transaction fees for your business", "Invoice & collect from any location", "Free terminal with your account"] },
  "restoration-company": { title: "Restoration Companies", badge: "Restoration Payment Solutions", bullets: ["Accept large insurance claim payments fee-free", "Zero transaction fees for your business", "Virtual terminal for remote billing", "Free terminal & next-day deposits"] },
  "handyman-services": { title: "Handyman Services", badge: "Handyman Payment Processing", bullets: ["Accept payments on-site with zero fees", "Mobile POS for every job site", "Zero transaction fees for your business", "Free mobile reader included"] },
  "pool-maintenance": { title: "Pool Maintenance Companies", badge: "Pool Service Payment Solutions", bullets: ["Accept recurring maintenance payments", "Zero transaction fees on every visit", "Mobile POS for field technicians", "Free mobile reader included"] },
  "security-installer": { title: "Security System Installers", badge: "Security Business Payment Solutions", bullets: ["Accept installation & monitoring fees fee-free", "Zero transaction fees for your business", "Recurring billing for monitoring plans", "Free terminal with your account"] },
  "moving-company": { title: "Moving Companies", badge: "Moving Company Payment Processing", bullets: ["Accept deposits & final payments fee-free", "Zero transaction fees for every move", "Mobile POS for on-site collection", "Free terminal & next-day deposits"] },
  "appliance-repair": { title: "Appliance Repair Services", badge: "Appliance Repair Payment Solutions", bullets: ["Accept payments on-site fee-free", "Zero transaction fees for your business", "Mobile POS for field technicians", "Free mobile reader included"] },
  "dry-cleaners": { title: "Dry Cleaners", badge: "Dry Cleaner Payment Processing", bullets: ["Accept all payment types at the counter", "Zero transaction fees for your business", "Fast checkout for busy customers", "Free terminal with your account"] },
  // PROFESSIONAL SERVICES
  "law-firm": { title: "Law Firms", badge: "Law Firm Payment Solutions", bullets: ["Accept retainers & billing fee-free", "Zero transaction fees for your firm", "Virtual terminal for remote billing", "Secure & PCI compliant transactions"] },
  "accounting-firm": { title: "Accounting Firms", badge: "Accounting Firm Payment Processing", bullets: ["Accept client invoices fee-free", "Zero transaction fees for your firm", "Virtual terminal for secure billing", "Next-day deposits for your firm"] },
  "bookkeeping-services": { title: "Bookkeeping Services", badge: "Bookkeeping Payment Solutions", bullets: ["Accept client payments fee-free", "Zero transaction fees for your business", "Virtual terminal for remote billing", "Free terminal with your account"] },
  "marketing-agency": { title: "Marketing Agencies", badge: "Agency Payment Processing", bullets: ["Accept retainers & project payments fee-free", "Zero transaction fees for your agency", "Virtual terminal for client billing", "Next-day deposits for cash flow"] },
  "consulting-firm": { title: "Consulting Firms", badge: "Consulting Payment Solutions", bullets: ["Accept engagement fees fee-free", "Zero transaction fees for your firm", "Virtual terminal for remote billing", "Free terminal with your account"] },
  "it-services": { title: "IT Services & MSPs", badge: "MSP Payment Processing", bullets: ["Accept recurring managed services fees", "Zero transaction fees for your MSP", "Virtual terminal for remote billing", "Next-day deposits for your business"] },
  "web-design-agency": { title: "Web Design Agencies", badge: "Web Agency Payment Solutions", bullets: ["Accept project deposits & milestones fee-free", "Zero transaction fees for your agency", "Virtual terminal for client billing", "Free terminal with your account"] },
  "software-developer": { title: "Software Developers", badge: "Software Business Payment Processing", bullets: ["Accept license & subscription fees fee-free", "Zero transaction fees for your business", "Virtual terminal for remote billing", "Next-day deposits for your team"] },
  "architecture-firm": { title: "Architecture Firms", badge: "Architecture Firm Payment Solutions", bullets: ["Accept large project payments fee-free", "Zero transaction fees for your firm", "Virtual terminal for client billing", "Free terminal & next-day deposits"] },
  "engineering-firm": { title: "Engineering Firms", badge: "Engineering Payment Processing", bullets: ["Accept project & consulting fees fee-free", "Zero transaction fees for your firm", "Virtual terminal for secure billing", "Next-day deposits for your business"] },
  "staffing-agency": { title: "Staffing Agencies", badge: "Staffing Agency Payment Solutions", bullets: ["Accept placement fees fee-free", "Zero transaction fees for your agency", "Virtual terminal for client billing", "Free terminal with your account"] },
  "translation-services": { title: "Translation Services", badge: "Translation Payment Processing", bullets: ["Accept project payments fee-free", "Zero transaction fees for your business", "Virtual terminal for remote billing", "Free terminal with your account"] },
  "pr-firm": { title: "PR Firms", badge: "PR Agency Payment Solutions", bullets: ["Accept retainers & campaign fees fee-free", "Zero transaction fees for your firm", "Virtual terminal for client billing", "Next-day deposits for your team"] }
};

const SLUG_TO_CATEGORY = {
  "clothing-boutique": "Retail", "shoe-store": "Retail", "jewelry-store": "Retail",
  "specialty-food-store": "Retail", "furniture-store": "Retail", "electronics-store": "Retail",
  "sporting-goods-store": "Retail", "pet-store": "Retail", "florist": "Retail",
  "thrift-store": "Retail", "pop-up-retail": "Retail",
  "hair-salon": "Personal Services", "barber-shop": "Personal Services", "nail-salon": "Personal Services",
  "spa": "Personal Services", "massage-therapy": "Personal Services", "tanning-salon": "Personal Services",
  "tattoo-shop": "Personal Services", "beauty-clinic": "Personal Services", "med-spa": "Personal Services",
  "personal-trainer": "Personal Services", "yoga-studio": "Personal Services", "fitness-gym": "Personal Services",
  "dance-studio": "Personal Services", "coaching-business": "Personal Services",
  "dental-office": "Healthcare", "chiropractor": "Healthcare", "physical-therapy": "Healthcare",
  "urgent-care": "Healthcare", "private-medical": "Healthcare", "mental-health-clinic": "Healthcare",
  "veterinary-clinic": "Healthcare", "home-healthcare": "Healthcare", "medical-lab": "Healthcare",
  "hvac-company": "Home Services", "plumbing-services": "Home Services", "electrical-contractor": "Home Services",
  "roofing-company": "Home Services", "landscaping": "Home Services", "pest-control": "Home Services",
  "residential-cleaning": "Home Services", "commercial-cleaning": "Home Services",
  "restoration-company": "Home Services", "handyman-services": "Home Services",
  "pool-maintenance": "Home Services", "security-installer": "Home Services",
  "moving-company": "Home Services", "appliance-repair": "Home Services", "dry-cleaners": "Home Services",
  "law-firm": "Professional Services", "accounting-firm": "Professional Services",
  "bookkeeping-services": "Professional Services", "marketing-agency": "Professional Services",
  "consulting-firm": "Professional Services", "it-services": "Professional Services",
  "web-design-agency": "Professional Services", "software-developer": "Professional Services",
  "architecture-firm": "Professional Services", "engineering-firm": "Professional Services",
  "staffing-agency": "Professional Services", "translation-services": "Professional Services",
  "pr-firm": "Professional Services",
};

const SLUG_TO_PATH = {
  "clothing-boutique": "ClothingBoutiquePOS",
  "shoe-store": "ShoeStorePOS",
  "jewelry-store": "JewelryStorePOS",
  "specialty-food-store": "SpecialtyFoodStorePOS",
  "furniture-store": "FurnitureStorePOS",
  "electronics-store": "ElectronicsStorePOS",
  "sporting-goods-store": "SportingGoodsStorePOS",
  "pet-store": "PetStorePOS",
  "florist": "FloristPOS",
  "thrift-store": "ThriftStorePOS",
  "pop-up-retail": "PopUpRetailPOS",
  "hair-salon": "HairSalonPOS",
  "barber-shop": "BarberShopPOS",
  "nail-salon": "NailSalonPOS",
  "spa": "SpaPOS",
  "massage-therapy": "MassageTherapyPOS",
  "tanning-salon": "TanningSalonPOS",
  "tattoo-shop": "TattooShopPOS",
  "beauty-clinic": "BeautyClinicPOS",
  "med-spa": "MedSpaPOS",
  "personal-trainer": "PersonalTrainerPOS",
  "yoga-studio": "YogaStudioPOS",
  "fitness-gym": "FitnessGymPOS",
  "dance-studio": "DanceStudioPOS",
  "coaching-business": "CoachingBusinessPOS",
  "dental-office": "DentalOfficePOS",
  "chiropractor": "ChiropractorPOS",
  "physical-therapy": "PhysicalTherapyPOS",
  "urgent-care": "UrgentCarePOS",
  "private-medical": "PrivateMedicalPOS",
  "mental-health-clinic": "MentalHealthClinicPOS",
  "veterinary-clinic": "VeterinaryClinicPOS",
  "home-healthcare": "HomeHealthcarePOS",
  "medical-lab": "MedicalLabPOS",
  "hvac-company": "HVACCompanyPOS",
  "plumbing-services": "PlumbingServicesPOS",
  "electrical-contractor": "ElectricalContractorPOS",
  "roofing-company": "RoofingCompanyPOS",
  "landscaping": "LandscapingPOS",
  "pest-control": "PestControlPOS",
  "residential-cleaning": "ResidentialCleaningPOS",
  "commercial-cleaning": "CommercialCleaningPOS",
  "restoration-company": "RestorationCompanyPOS",
  "handyman-services": "HandymanServicesPOS",
  "pool-maintenance": "PoolMaintenancePOS",
  "security-installer": "SecurityInstallerPOS",
  "moving-company": "MovingCompanyPOS",
  "appliance-repair": "ApplianceRepairPOS",
  "dry-cleaners": "DryCleanersPOS",
  "law-firm": "LawFirmPOS",
  "accounting-firm": "AccountingFirmPOS",
  "bookkeeping-services": "BookkeepingServicesPOS",
  "marketing-agency": "MarketingAgencyPOS",
  "consulting-firm": "ConsultingFirmPOS",
  "it-services": "ITServicesPOS",
  "web-design-agency": "WebDesignAgencyPOS",
  "software-developer": "SoftwareDeveloperPOS",
  "architecture-firm": "ArchitectureFirmPOS",
  "engineering-firm": "EngineeringFirmPOS",
  "staffing-agency": "StaffingAgencyPOS",
  "translation-services": "TranslationServicesPOS",
  "pr-firm": "PRFirmPOS",
};

export default function GenericBusinessLanding({ slug }) {
  const config = CONFIGS[slug] || { title: "Your Business", badge: "Payment Solutions", bullets: ["Zero transaction fees", "Free POS equipment", "No monthly fees", "Next-day deposits"] };
  const { title, badge, bullets } = config;
  const pagePath = SLUG_TO_PATH[slug] || slug;
  const canonicalUrl = `https://ezpayamerica.com/${pagePath}`;
  const category = SLUG_TO_CATEGORY[slug] || "Services";
  const categoryPath = category === "Retail" ? "RetailMerchants"
    : category === "Healthcare" ? "Services"
    : category === "Home Services" ? "Services"
    : category === "Personal Services" ? "Services"
    : "Services";

  const pageSchema = [
    {
      "@type": "LocalBusiness",
      "@id": `${canonicalUrl}#localbusiness`,
      "name": "EzPay America",
      "image": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png",
      "url": canonicalUrl,
      "telephone": "+1-865-316-9625",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "US"
      },
      "areaServed": { "@type": "Country", "name": "United States" },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      "sameAs": [
        "https://www.facebook.com/ezpayamerica",
        "https://www.linkedin.com/company/ezpay-america"
      ]
    },
    {
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      "serviceType": `${title} Payment Processing`,
      "provider": {
        "@type": "LocalBusiness",
        "name": "EzPay America",
        "url": "https://ezpayamerica.com"
      },
      "areaServed": { "@type": "Country", "name": "United States" },
      "description": `Zero-fee payment processing and POS systems for ${title.toLowerCase()}. No monthly fees, no contracts, free equipment.`,
      "url": canonicalUrl
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ezpayamerica.com" },
        { "@type": "ListItem", "position": 2, "name": category, "item": `https://ezpayamerica.com/${categoryPath}` },
        { "@type": "ListItem", "position": 3, "name": `${title} Payment Processing`, "item": canonicalUrl }
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title={`${title} Payment Processing & POS System`}
        description={`EzPay America: zero-fee payment processing for ${title.toLowerCase()}. Free POS equipment, no monthly fees, no contracts. Apply online today.`}
        keywords={`${title.toLowerCase()} payment processing, ${title.toLowerCase()} POS system, ${title.toLowerCase()} credit card processing, zero fee payment processing, merchant services, best payment processor for ${title.toLowerCase()}, no fee credit card processing ${title.toLowerCase()}`}
        url={canonicalUrl}
        pageSchema={pageSchema}
      />
      <LandingHero
        badge={badge}
        headline={`Payment Processing for ${title}`}
        subheadline={`EzPay America gives ${title.toLowerCase()} a smarter way to accept payments — with zero transaction fees, free equipment, and no long-term contracts.`}
        bullets={bullets}
        service={`${title} payment processing`}
      />
      <LandingFeatures
        title={`Everything ${title} Need`}
        subtitle="Complete payment processing with no hidden fees or surprises"
        features={DEFAULT_FEATURES}
      />
      <LandingCTA
        headline="Ready to Stop Paying Processing Fees?"
        subtext={`Join hundreds of ${title.toLowerCase()} across America saving thousands every year with EzPay America's zero-fee payment processing.`}
        service={`${title} payment processing`}
      />
    </>
  );
}