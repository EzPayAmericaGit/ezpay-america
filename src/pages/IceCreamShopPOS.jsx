import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Zap, Users, CreditCard, Gift, BarChart2, Package } from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "from-pink-500 to-pink-600",
    title: "Fast Touchscreen Ordering",
    description: "Large item buttons, topping modifiers, and size selectors make order entry instant — perfect for keeping the line moving on a hot summer day."
  },
  {
    icon: Users,
    color: "from-amber-500 to-amber-600",
    title: "Loyalty & Rewards Programs",
    description: "Built-in punch cards and points systems turn one-time visitors into loyal regulars — automatically track and reward your best customers."
  },
  {
    icon: Gift,
    color: "from-purple-500 to-purple-600",
    title: "Gift Cards & Store Credit",
    description: "Sell branded gift cards in-store and online — perfect for birthday gifts, holiday shopping, and driving new customer traffic."
  },
  {
    icon: Package,
    color: "from-green-500 to-green-600",
    title: "Inventory & Flavor Tracking",
    description: "Track scoops, tubs, and toppings in real time so you always know what's running low and when to reorder before you run out."
  },
  {
    icon: CreditCard,
    color: "from-blue-500 to-blue-600",
    title: "Contactless & Digital Wallet Payments",
    description: "Accept Apple Pay, Google Pay, tap cards, and chip in seconds — even families with kids pay fast and get back to enjoying their cone."
  },
  {
    icon: BarChart2,
    color: "from-orange-500 to-orange-600",
    title: "Seasonal Sales Reporting",
    description: "Understand your peak seasons, top-selling flavors, and busiest hours — make smarter staffing and production decisions all year long."
  }
];

export default function IceCreamShopPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Ice Cream Shop POS & Payment Processing"
        description="EzPay America's ice cream shop POS — fast checkout, loyalty rewards, gift cards, flavor inventory tracking, and zero transaction fees. Free terminal for ice cream shops."
        keywords="ice cream shop POS, ice cream parlor point of sale, ice cream shop payment processing, scoop shop POS system, ice cream merchant account, zero fee ice cream processing, gelato shop POS, frozen yogurt POS, ice cream loyalty program, EzPay ice cream shop"
        url="https://ezpayamerica.com/IceCreamShopPOS"
      />
      <LandingHero
        headline="Ice Cream Shop POS & Payment Processing"
        subheadline="Keep the line moving and the smiles coming. EzPay America gives ice cream shops a fast, fun POS with loyalty rewards, gift cards, and zero transaction fees."
        bullets={[
          "Fast touchscreen ordering with topping & size modifiers",
          "Built-in loyalty punch cards and rewards programs",
          "Gift card sales in-store and online",
          "Zero transaction fees — keep more of every scoop"
        ]}
        service="Ice Cream Shop POS"
      />
      <LandingFeatures
        title="Sweet Solutions for Ice Cream Shops"
        subtitle="From a single scoop shop to a multi-location chain — EzPay grows with your cone business."
        features={features}
      />
      <LandingCTA
        headline="Scoop Up More Savings with Zero Processing Fees"
        subtext="EzPay America gives ice cream shops free equipment, zero transaction fees, and a POS built for fast, friendly service."
        service="Ice Cream Shop POS"
      />
    </div>
  );
}