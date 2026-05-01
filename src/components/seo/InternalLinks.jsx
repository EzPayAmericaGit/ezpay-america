import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight } from "lucide-react";

const linkGroups = [
  {
    heading: "Payment Solutions",
    links: [
      { label: "Zero-Fee Credit Card Processing", to: createPageUrl("Services") },
      { label: "Cash Discount Program", to: createPageUrl("CashDiscountProgram") },
      { label: "ACH Payment Processing", to: createPageUrl("ACHPayments") },
      { label: "Mobile Payments", to: createPageUrl("MobilePayments") },
      { label: "Tap to Pay", to: createPageUrl("TapToPay") },
      { label: "Web Payment Pages", to: createPageUrl("WebPaymentPages") },
      { label: "E-Commerce Solutions", to: createPageUrl("ECommerce") },
      { label: "Merchant Cash Advance", to: createPageUrl("MerchantCashAdvance") },
    ],
  },
  {
    heading: "Restaurant POS",
    links: [
      { label: "Full Service Restaurants", to: createPageUrl("FullServiceRestaurantPOS") },
      { label: "Quick Service / Fast Food", to: createPageUrl("QuickServicePOS") },
      { label: "Coffee Shops & Cafes", to: createPageUrl("CoffeePOS") },
      { label: "Bars & Pubs", to: createPageUrl("BarTavernPOS") },
      { label: "Food Trucks", to: createPageUrl("FoodTruckPOS") },
      { label: "Bakeries", to: createPageUrl("BakeryPOS") },
      { label: "Ghost Kitchens", to: createPageUrl("GhostKitchenPOS") },
      { label: "Breweries & Wineries", to: createPageUrl("BreweryPOS") },
    ],
  },
  {
    heading: "Retail POS",
    links: [
      { label: "Retail Payment Solutions", to: createPageUrl("RetailPaymentSolutions") },
      { label: "Grocery Stores", to: createPageUrl("GroceryStorePOS") },
      { label: "Clothing Boutiques", to: createPageUrl("ClothingBoutiquePOS") },
      { label: "Jewelry Stores", to: createPageUrl("JewelryStorePOS") },
      { label: "Pet Stores", to: createPageUrl("PetStorePOS") },
      { label: "Gift Shops", to: createPageUrl("GiftShopPOS") },
      { label: "Convenience Stores", to: createPageUrl("MiniMarketPOS") },
      { label: "Vape Shops", to: createPageUrl("VapeStorePOS") },
    ],
  },
  {
    heading: "Service Business POS",
    links: [
      { label: "Hair Salons", to: createPageUrl("HairSalonPOS") },
      { label: "Dental Offices", to: createPageUrl("DentalOfficePOS") },
      { label: "HVAC Companies", to: createPageUrl("HVACCompanyPOS") },
      { label: "Plumbing Services", to: createPageUrl("PlumbingServicesPOS") },
      { label: "Law Firms", to: createPageUrl("LawFirmPOS") },
      { label: "Gyms & Fitness", to: createPageUrl("FitnessGymPOS") },
      { label: "Spas & Med Spas", to: createPageUrl("SpaPOS") },
      { label: "Auto Repair", to: createPageUrl("Services") },
    ],
  },
  {
    heading: "Features & Programs",
    links: [
      { label: "Gift Card Program", to: createPageUrl("GiftCardProgram") },
      { label: "Loyalty Program", to: createPageUrl("LoyaltyProgram") },
      { label: "Point of Sale Financing", to: createPageUrl("PointOfSaleFinancing") },
      { label: "Fraud Detection", to: createPageUrl("FraudDetection") },
      { label: "Branded Payment Gateway", to: createPageUrl("BrandedPaymentGateway") },
      { label: "Recurring Billing", to: createPageUrl("GatewayRecurringBilling") },
      { label: "Payment Links", to: createPageUrl("GatewayPaymentLinks") },
      { label: "Reporting & Analytics", to: createPageUrl("GatewayReporting") },
    ],
  },
  {
    heading: "Get Started",
    links: [
      { label: "Apply Online", to: createPageUrl("ApplyOnline") },
      { label: "Book a Free Call", to: createPageUrl("BookAppointment") },
      { label: "Take the Quiz", to: createPageUrl("Quiz") },
      { label: "Affiliate Program", to: createPageUrl("AffiliateSignup") },
      { label: "FAQs", to: createPageUrl("FAQ") },
      { label: "News & Insights", to: createPageUrl("News") },
      { label: "Contact Us", to: createPageUrl("Contact") },
      { label: "View All Services", to: createPageUrl("Services") },
    ],
  },
];

export default function InternalLinks() {
  return (
    <section className="bg-gray-50 border-t border-gray-200 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Explore EzPay America
        </h2>
        <p className="text-gray-500 mb-10 text-sm">
          Payment solutions for every business type — browse our full range of services.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
          {linkGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-3">
                {group.heading}
              </h3>
              <ul className="space-y-1.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-600 hover:text-amber-600 hover:underline flex items-center gap-1 group"
                    >
                      <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-amber-500 flex-shrink-0" aria-hidden="true" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}