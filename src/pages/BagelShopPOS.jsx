import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Utensils, CreditCard, Clock, BarChart3, Zap, Shield, Package, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Utensils, title: "Order Customization", description: "Build-your-own bagel orders with toppings, spreads, and special requests handled easily.", color: "from-amber-500 to-orange-600" },
  { icon: Zap, title: "Rush Hour Speed", description: "Process high-volume morning orders quickly — no lag, no errors, happy customers.", color: "from-yellow-500 to-amber-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Every bagel sale processed with zero credit card fees — maximize your deli margins.", color: "from-green-500 to-green-600" },
  { icon: Package, title: "Catering & Pre-Orders", description: "Accept large catering orders and morning pre-orders directly through your POS.", color: "from-blue-500 to-blue-600" },
  { icon: Star, title: "Loyalty Program", description: "Reward your regular morning customers with a built-in punch card loyalty system.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Food Cost Tracking", description: "Track ingredient usage and cost per item to keep your bagel shop profitable.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "Free Equipment", description: "Receipt printer, cash drawer, and touchscreen terminal provided at no cost.", color: "from-pink-500 to-pink-600" },
  { icon: Clock, title: "Quick-Keys Setup", description: "Pre-program your top sellers as quick-key buttons for 1-tap order entry.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Expert Support", description: "24/7 US-based support from a team that understands deli and quick-service operations.", color: "from-indigo-500 to-indigo-600" },
];

export default function BagelShopPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Bagel Shop POS System – Free Zero-Fee POS | EzPay America"
        description="Best POS system for bagel shops and delis. Zero transaction fees, custom order management, loyalty programs, free equipment. Built for busy morning rush. Apply free."
        keywords="bagel shop POS system, deli POS system, bagel shop payment processing, bakery POS, quick service POS, zero fee deli POS, free bagel shop POS, deli payment system, bagel shop credit card processing"
        url="https://ezpayamerica.com/BagelShopPOS"
      />
      <LandingHero
        badge="Bagel Shop POS"
        headline="The Bagel Shop POS Built for the Morning Rush"
        subheadline="Fast order entry, custom toppings, catering management, and zero transaction fees — EzPay America's bagel shop POS handles your busiest hours with ease."
        bullets={[
          "1-tap custom order entry",
          "Catering & pre-order management",
          "Zero fees on every transaction",
          "Built-in loyalty punch card",
          "Free equipment included"
        ]}
        service="Bagel Shop POS"
      />
      <LandingFeatures title="Everything Your Bagel Shop Needs" subtitle="Powerful POS designed for high-volume deli and bagel shop operations." features={features} />
      <LandingCTA headline="Get Your Free Bagel Shop POS System" subtext="Zero fees, free hardware, catering support — the best bagel shop POS in America." service="Bagel Shop POS" />
    </div>
  );
}