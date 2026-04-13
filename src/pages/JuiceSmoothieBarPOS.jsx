import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Zap, Users, CreditCard, Package, BarChart2, Repeat } from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "from-green-500 to-green-600",
    title: "Fast Modifier-Based Ordering",
    description: "Add-ins, protein boosts, size upgrades, and dietary swaps are built into the order flow — your team rings up custom orders in seconds."
  },
  {
    icon: Repeat,
    color: "from-amber-500 to-amber-600",
    title: "Subscription & Prepaid Plans",
    description: "Sell weekly juice cleanses, monthly smoothie memberships, and prepaid punch packs — recurring revenue that keeps customers committed."
  },
  {
    icon: Users,
    color: "from-blue-500 to-blue-600",
    title: "Loyalty Rewards",
    description: "Automatic points accumulation and punch-card rewards keep health-conscious customers choosing your bar over the competition."
  },
  {
    icon: Package,
    color: "from-orange-500 to-orange-600",
    title: "Ingredient Inventory Management",
    description: "Track fruits, vegetables, supplements, and add-ins in real time — reduce waste and always know what you need to restock before opening."
  },
  {
    icon: CreditCard,
    color: "from-purple-500 to-purple-600",
    title: "Tap, Chip & Digital Wallet Ready",
    description: "Accept contactless payments including Apple Pay and Google Pay — health-focused customers appreciate the fast, hygienic checkout."
  },
  {
    icon: BarChart2,
    color: "from-pink-500 to-pink-600",
    title: "Best-Seller & Revenue Analytics",
    description: "Identify your highest-margin blends, peak hours, and top add-ins — data that helps you design a more profitable menu."
  }
];

export default function JuiceSmoothieBarPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Juice Bar & Smoothie Shop POS System"
        description="EzPay America's juice and smoothie bar POS — fast modifier ordering, subscription plans, loyalty rewards, ingredient inventory, and zero transaction fees. Free equipment."
        keywords="juice bar POS system, smoothie shop POS, juice bar payment processing, smoothie bar merchant account, juice cleanse subscription billing, smoothie shop credit card processing, zero fee juice bar, health food POS system, EzPay juice smoothie POS, smoothie loyalty program"
        url="https://ezpayamerica.com/JuiceSmoothieBarPOS"
      />
      <LandingHero
        headline="Juice Bar & Smoothie Shop POS"
        subheadline="Blend speed with simplicity. EzPay America gives juice bars and smoothie shops a fast, modifier-driven POS with subscription plans, loyalty rewards, and zero transaction fees."
        bullets={[
          "Modifier-driven order entry for custom blends in seconds",
          "Sell juice cleanse subscriptions & prepaid packs",
          "Ingredient-level inventory tracking to minimize waste",
          "Zero transaction fees with free terminal equipment"
        ]}
        service="Juice & Smoothie Bar POS"
      />
      <LandingFeatures
        title="Fresh Tech for Fresh Concepts"
        subtitle="Whether you're a grab-and-go juice bar or a full wellness café — EzPay has you covered."
        features={features}
      />
      <LandingCTA
        headline="Zero Fees. Free Equipment. Healthier Margins."
        subtext="EzPay America powers juice bars and smoothie shops with a complete payment platform — no contracts, no processing fees."
        service="Juice & Smoothie Bar POS"
      />
    </div>
  );
}