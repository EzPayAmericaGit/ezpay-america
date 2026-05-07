import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Utensils, CreditCard, Clock, Zap, Shield, BarChart3, Smartphone, HeadphonesIcon, Star } from "lucide-react";
import { createPageUrl } from "@/utils";
import ServiceSEOContent from "../components/landing/ServiceSEOContent";

const features = [
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Restaurant owners keep 100% of every credit card payment with our zero-fee processing program.", color: "from-amber-500 to-orange-600" },
  { icon: Utensils, title: "Restaurant-Grade POS", description: "Table management, split checks, tip adjustments, kitchen display systems — all included free.", color: "from-red-500 to-red-600" },
  { icon: Zap, title: "Fast Tableside Payments", description: "Speed up table turns with wireless terminals and tap-to-pay for faster, happier guests.", color: "from-yellow-500 to-amber-600" },
  { icon: Clock, title: "Same-Day Deposits", description: "Get your money faster with next-business-day or same-day ACH deposits directly to your bank.", color: "from-green-500 to-green-600" },
  { icon: Shield, title: "PCI Compliant & Secure", description: "EMV chip, NFC, and end-to-end encryption protect every transaction and every customer.", color: "from-blue-500 to-blue-600" },
  { icon: BarChart3, title: "Sales & Menu Analytics", description: "Identify your top-selling items, track peak hours, and optimize your menu for profitability.", color: "from-purple-500 to-purple-600" },
  { icon: Smartphone, title: "Online Ordering Ready", description: "Integrate with DoorDash, Uber Eats, and your own online ordering page to grow revenue.", color: "from-teal-500 to-teal-600" },
  { icon: Star, title: "Tip Management", description: "Automatic tip prompts on every receipt increase your servers' tips and customer satisfaction.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "24/7 Restaurant Support", description: "Emergencies don't wait for business hours. Our support team is ready whenever you need us.", color: "from-indigo-500 to-indigo-600" },
];

export default function RestaurantMerchants() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Zero-Fee Payment Processing for Restaurants | Best Restaurant POS | EzPay America"
        description="Eliminate credit card processing fees at your restaurant. Free restaurant POS with table management, tip prompts & tableside payments. No contracts, 24-hour approval. Save $1,000–$2,000+/month."
        keywords="zero fee credit card processing restaurants, restaurant payment processing, restaurant merchant services, cash discount program restaurant, restaurant POS system, best payment processor restaurant, no fee restaurant credit card processing, free restaurant POS"
        url="https://ezpayamerica.com/RestaurantMerchants"
      />
      <LandingHero
        badge="Restaurant Merchant Solutions"
        headline="Zero-Fee Payment Processing for Restaurants"
        subheadline="Built for restaurants, bars, cafes, and food trucks. EzPay America delivers free POS equipment, zero transaction fees, and fast deposits so you can focus on great food."
        bullets={[
          "Zero fees on every credit card transaction",
          "Free restaurant POS with table management",
          "Tableside payments & wireless terminals",
          "Tip management built in",
          "Online ordering integration"
        ]}
        service="Restaurant Merchant Services"
      />
      <LandingFeatures
        title="The Complete Restaurant Payment Solution"
        subtitle="From fast-casual to fine dining, EzPay America powers restaurants across America."
        features={features}
      />
      <ServiceSEOContent
        heading="Zero Fee Credit Card Processing for Restaurants"
        intro="Restaurants operate on razor-thin margins — typically 3–9% net profit. Paying 2–3% on every credit card transaction eats directly into that. A restaurant doing $80,000/month in card sales loses $1,600–$2,400 per month to traditional processors. EzPay America's cash discount program for restaurants eliminates that cost entirely, giving you free POS equipment, zero transaction fees, and a system built specifically for the food service industry."
        sections={[
          {
            h2: "What Is a Restaurant Cash Discount Program?",
            body: "A restaurant cash discount program allows your business to accept credit cards with zero processing fees. Customers who pay by card see a small service fee added at checkout — clearly disclosed on your menu and terminals. Cash customers receive a discount. The result: you keep 100% of every sale, with no monthly processing bill.",
            bullets: [
              "Zero fees on every card transaction",
              "Compliant menu and terminal signage provided",
              "Works at the counter, tableside, or drive-through",
              "No monthly processing fees or statement fees",
              "Compatible with all card types and mobile wallets"
            ]
          },
          {
            h2: "Free Restaurant POS System — What's Included",
            body: "Every EzPay America restaurant merchant receives a fully-featured POS system at no cost. No lease, no rental fee, no equipment purchase. Our restaurant POS includes:",
            bullets: [
              "Table management and floor layout",
              "Split check and separate ticket capabilities",
              "Tip adjustment and tip prompts on every receipt",
              "Kitchen display system (KDS) integration",
              "Online ordering integration (DoorDash, Uber Eats, and more)",
              "Menu management and item-level reporting"
            ]
          },
          {
            h2: "Comparing Restaurant Payment Processors",
            body: "Square for Restaurants charges 2.6% + $0.10 per transaction plus $60/month for the software. Toast charges 2.49–3.09% per transaction. For a restaurant processing $60,000/month, that's $1,500–$1,850 per month in fees. EzPay America charges $0 in transaction fees with no monthly software cost — saving the average restaurant $18,000–$22,000 per year."
          },
          {
            h2: "Restaurant Types We Serve",
            body: "EzPay America provides payment processing for every type of food service business across the United States — full-service restaurants, quick-service and fast food, cafes and coffee shops, bars and pubs, food trucks, bakeries, catering companies, breweries, wineries, and more."
          }
        ]}
        faqs={[
          { q: "What is the best payment processor for restaurants?", a: "EzPay America is one of the best payment processors for restaurants because restaurant owners pay $0 in transaction fees. With a free restaurant POS system, tip management, table service features, and 24/7 support, it's a complete solution that saves the average restaurant $1,000–$2,000+ per month." },
          { q: "How does tipping work with zero fee processing?", a: "EzPay America's restaurant terminals prompt customers for a tip just like any standard system. The tip is added to the transaction normally. Tip amounts go directly to your staff — the zero-fee program only affects the base transaction processing cost, not tips." },
          { q: "Can I use EzPay America for online ordering?", a: "Yes. EzPay America supports integration with online ordering platforms including DoorDash, Uber Eats, and your own branded online ordering page. All online orders sync with your POS for streamlined operations." },
          { q: "How long does it take to get set up?", a: "Most restaurants are approved within 24 hours and receive their equipment within a few days. Our team handles full installation and staff training so your team is comfortable from day one." },
          { q: "What if I already have a POS system?", a: "We can often integrate with your existing setup, or replace it with our free restaurant POS at no cost. Our team will evaluate your current system and recommend the best path forward." }
        ]}
        relatedLinks={[
          { label: "Full Service Restaurant POS", to: createPageUrl("FullServiceRestaurantPOS") },
          { label: "Quick Service POS", to: createPageUrl("QuickServicePOS") },
          { label: "Food Truck POS", to: createPageUrl("FoodTruckPOS") },
          { label: "Services Overview", to: createPageUrl("Services") },
          { label: "Apply Online", to: createPageUrl("ApplyOnline") }
        ]}
      />
      <LandingCTA
        headline="More Revenue, Zero Processing Fees"
        subtext="Hundreds of restaurants have eliminated credit card fees and boosted profits with EzPay America."
        service="Restaurant Merchant Services"
      />
    </div>
  );
}