import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Utensils, BarChart3, Clock, CreditCard, Zap, Shield, Smartphone, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Utensils, title: "Table Management", description: "Visual floor plan, table status, party size tracking, and server assignment all in one screen.", color: "from-amber-500 to-orange-600" },
  { icon: Star, title: "Kitchen Display System", description: "Send orders directly to the kitchen — no tickets, no mistakes, faster food delivery.", color: "from-red-500 to-red-600" },
  { icon: CreditCard, title: "Split Checks & Tip Adjust", description: "Split bills by seat or amount, and process tip adjustments at close of business easily.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Online Ordering", description: "Built-in online ordering integrates with your POS for seamless in-house and delivery management.", color: "from-blue-500 to-blue-600" },
  { icon: Clock, title: "Faster Table Turns", description: "Tableside ordering and payment speeds up service and increases revenue per hour.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Menu Engineering", description: "Identify top-selling items, track food costs, and optimize your menu for maximum profitability.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "Zero Transaction Fees", description: "Process every credit card payment with zero fees — the most affordable restaurant POS.", color: "from-yellow-500 to-amber-600" },
  { icon: Smartphone, title: "Handheld Ordering", description: "Servers take orders at the table on wireless handhelds — faster service, larger tips.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "Restaurant-Focused Support", description: "Our support team knows the restaurant business and is available 24/7 for urgent issues.", color: "from-indigo-500 to-indigo-600" },
];

export default function RestaurantPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Restaurant POS System – Free Zero-Fee POS | EzPay America"
        description="Best restaurant POS system with zero transaction fees. Table management, kitchen display, online ordering, split checks, and free equipment. Apply today."
        keywords="restaurant POS system, restaurant point of sale, free restaurant POS, best restaurant POS, restaurant POS software, table management POS, kitchen display system, restaurant payment processing, restaurant ordering system, zero fee restaurant POS"
        url="https://ezpayamerica.com/RestaurantPOS"
      />
      <LandingHero
        badge="EzPay Restaurant POS"
        headline="The Restaurant POS That Pays for Itself"
        subheadline="Zero transaction fees mean the EzPay Restaurant POS pays for itself instantly. Table management, KDS, online ordering, and faster table turns — all free."
        bullets={[
          "Table management & floor plan",
          "Kitchen display system included",
          "Online ordering integration",
          "Zero transaction fees",
          "Tableside ordering & wireless payments"
        ]}
        service="Restaurant POS System"
      />
      <LandingFeatures title="Built for Every Restaurant Type" subtitle="From food trucks to fine dining — the EzPay Restaurant POS scales with your operation." features={features} />
      <LandingCTA headline="Your Free Restaurant POS Is Waiting" subtext="Zero fees. Free equipment. Faster table turns. Apply now and be processing within 48 hours." service="Restaurant POS System" />
    </div>
  );
}