import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Utensils, CreditCard, Clock, BarChart3, Zap, Package, Shield, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Utensils, title: "Deli Order Management", description: "Custom sandwiches, meats by the pound, and complex orders handled fast and accurately.", color: "from-amber-500 to-orange-600" },
  { icon: Package, title: "Weight-Based Pricing", description: "Price items by weight with integrated scale support for deli meats, cheeses, and bulk items.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Process every order with no credit card fees — protect your deli's thin margins.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Speed at the Counter", description: "Fast order entry keeps your lunch rush moving without sacrificing accuracy.", color: "from-purple-500 to-purple-600" },
  { icon: Clock, title: "Pre-Order & Catering", description: "Take pre-orders and manage large catering orders through your POS system.", color: "from-yellow-500 to-amber-600" },
  { icon: Star, title: "Customer Loyalty", description: "Reward your regulars with a built-in digital punch card and loyalty program.", color: "from-teal-500 to-teal-600" },
  { icon: BarChart3, title: "Inventory Control", description: "Track deli inventory, reduce waste, and know exactly what to order each week.", color: "from-pink-500 to-pink-600" },
  { icon: Shield, title: "Free POS Equipment", description: "Touchscreen terminal, receipt printer, cash drawer, and scale interface — all free.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Always-Available Support", description: "US-based support specialists available 24/7 to keep your deli running smoothly.", color: "from-indigo-500 to-indigo-600" },
];

export default function DeliShopPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Deli Shop POS System – Free Zero-Fee POS | EzPay America"
        description="Best POS for deli shops. Weight-based pricing, custom orders, catering management, zero transaction fees, free equipment. Designed for deli operations. Apply free."
        keywords="deli POS system, deli shop payment processing, deli point of sale, deli credit card processing, deli management system, weight based POS, zero fee deli POS, free deli POS equipment, deli shop POS software"
        url="https://ezpayamerica.com/DeliShopPOS"
      />
      <LandingHero
        badge="Deli Shop POS"
        headline="The Deli POS That Handles Every Order Perfectly"
        subheadline="Weight-based pricing, custom sandwich orders, catering, and zero transaction fees — EzPay America's deli POS is built for the counter."
        bullets={[
          "Weight-based pricing with scale support",
          "Fast custom order entry",
          "Catering & pre-order management",
          "Zero transaction fees",
          "Free equipment included"
        ]}
        service="Deli Shop POS"
      />
      <LandingFeatures title="Built for Deli Shop Operations" subtitle="From custom orders to bulk pricing — the perfect POS for any deli." features={features} />
      <LandingCTA headline="Get Your Free Deli POS System" subtext="Accurate, fast, and zero-fee. The best deli POS is waiting for your shop." service="Deli Shop POS" />
    </div>
  );
}