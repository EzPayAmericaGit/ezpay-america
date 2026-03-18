import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Gift, CreditCard, Package, BarChart3, Zap, Shield, Star, Smartphone, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Gift, title: "Gift Card Program", description: "Sell branded gift cards in-store and online — a proven top revenue driver for gift shops.", color: "from-pink-500 to-pink-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Keep every dollar from every sale — no per-transaction fees on any payment type.", color: "from-amber-500 to-orange-600" },
  { icon: Package, title: "Unique SKU Management", description: "Manage one-of-a-kind and limited inventory items with unique SKU and variant tracking.", color: "from-blue-500 to-blue-600" },
  { icon: Zap, title: "Seasonal Sale Pricing", description: "Set automatic holiday and seasonal discounts that turn on and off on a schedule.", color: "from-green-500 to-green-600" },
  { icon: BarChart3, title: "Best-Seller Reports", description: "Identify your most popular items and plan inventory orders around real sales data.", color: "from-purple-500 to-purple-600" },
  { icon: Shield, title: "Free POS Equipment", description: "Touchscreen terminal, receipt printer, and barcode scanner all included at no cost.", color: "from-teal-500 to-teal-600" },
  { icon: Star, title: "Customer Loyalty Program", description: "Built-in loyalty rewards and punch cards encourage repeat visits and word-of-mouth.", color: "from-yellow-500 to-amber-600" },
  { icon: Smartphone, title: "Online Store Integration", description: "Sync your gift shop inventory with an online store to reach customers beyond your walls.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Friendly Expert Support", description: "Our retail specialists are available 24/7 to help your gift shop thrive.", color: "from-indigo-500 to-indigo-600" },
];

export default function GiftShopPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Gift Shop POS System – Zero Fees & Free Equipment | EzPay America"
        description="Best POS for gift shops. Gift card programs, loyalty rewards, unique inventory tracking, zero transaction fees, free equipment. Grow your gift shop. Apply free today."
        keywords="gift shop POS system, gift store POS, souvenir shop POS, gift shop payment processing, gift card program POS, retail gift shop POS, zero fee gift shop POS, free gift shop POS equipment, boutique gift shop payment system"
        url="https://ezpayamerica.com/GiftShopPOS"
      />
      <LandingHero
        badge="Gift Shop POS"
        headline="The Gift Shop POS That Grows Your Business"
        subheadline="Branded gift cards, loyalty programs, unique inventory management, and zero transaction fees — EzPay America makes your gift shop more profitable every day."
        bullets={[
          "Branded gift card program included",
          "Built-in customer loyalty rewards",
          "Unique SKU & variant management",
          "Zero transaction fees",
          "Free POS equipment"
        ]}
        service="Gift Shop POS"
      />
      <LandingFeatures title="Built for Gift Shops & Specialty Boutiques" subtitle="Gift cards, loyalty, and zero-fee processing — everything your gift shop deserves." features={features} />
      <LandingCTA headline="Get Your Free Gift Shop POS System" subtext="Gift cards, loyalty, zero fees, free hardware. The best gift shop POS in America." service="Gift Shop POS" />
    </div>
  );
}