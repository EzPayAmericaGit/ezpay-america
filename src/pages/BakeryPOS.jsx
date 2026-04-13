import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { ShoppingBag, Calendar, BarChart2, CreditCard, Package, Users } from "lucide-react";

const features = [
  {
    icon: ShoppingBag,
    color: "from-pink-500 to-pink-600",
    title: "Fast Counter Checkout",
    description: "Quick-select bakery items, custom orders, and daily specials from a simple touchscreen — get customers in and out in seconds."
  },
  {
    icon: Calendar,
    color: "from-amber-500 to-amber-600",
    title: "Custom Order & Pre-Order Management",
    description: "Take orders for wedding cakes, custom pastries, and holiday batches in advance — with deposits, pickup dates, and notes attached."
  },
  {
    icon: Package,
    color: "from-orange-500 to-orange-600",
    title: "Inventory & Ingredient Tracking",
    description: "Track flour, butter, eggs, and finished goods automatically as items sell — reduce waste and know when to order before you run out."
  },
  {
    icon: Users,
    color: "from-green-500 to-green-600",
    title: "Loyalty & Punch Cards",
    description: "Reward your regulars with automatic punch cards or points — keep your bakery top of mind every time they crave something sweet."
  },
  {
    icon: CreditCard,
    color: "from-blue-500 to-blue-600",
    title: "Accept Every Payment Type",
    description: "Credit, debit, Apple Pay, Google Pay, and gift cards — all accepted on the same sleek terminal with zero transaction fees."
  },
  {
    icon: BarChart2,
    color: "from-purple-500 to-purple-600",
    title: "Best-Seller & Revenue Reports",
    description: "See which products drive the most revenue, track daily sales trends, and make smarter production decisions based on real data."
  }
];

export default function BakeryPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Bakery POS System & Payment Processing"
        description="EzPay America's bakery POS — custom order management, inventory tracking, loyalty programs, and zero transaction fees. Free terminal equipment for bakeries. Apply today."
        keywords="bakery POS system, bakery point of sale, bakery payment processing, custom cake order management, bakery credit card processing no fees, zero fee bakery merchant account, bakery pre-order system, pastry shop POS, EzPay bakery POS, bakery inventory tracking POS"
        url="https://ezpayamerica.com/BakeryPOS"
      />
      <LandingHero
        headline="Bakery POS & Payment Processing"
        subheadline="From croissants to custom wedding cakes — EzPay America gives bakeries a complete POS system with pre-order management, inventory tracking, and zero transaction fees."
        bullets={[
          "Pre-order & custom order management with deposits",
          "Ingredient-level inventory tracking to reduce waste",
          "Loyalty punch cards to keep regulars coming back",
          "Zero transaction fees — every sale keeps more profit"
        ]}
        service="Bakery POS"
      />
      <LandingFeatures
        title="Everything a Bakery Needs in One System"
        subtitle="Focus on baking, not bookkeeping — EzPay handles orders, inventory, payments, and reporting automatically."
        features={features}
      />
      <LandingCTA
        headline="Free Equipment. Zero Processing Fees."
        subtext="EzPay America provides bakeries with a complete payment solution — free terminal, zero transaction fees, and expert support."
        service="Bakery POS"
      />
    </div>
  );
}