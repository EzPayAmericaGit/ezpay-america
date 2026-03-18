import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Coffee, CreditCard, Clock, BarChart3, Zap, Shield, Smartphone, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Coffee, title: "Cafe-Optimized Layout", description: "Quick-add buttons for your top drinks, customizable modifiers for milk, shots, and sizes.", color: "from-amber-600 to-amber-800" },
  { icon: Zap, title: "Lightning-Fast Checkout", description: "Serve more customers faster — morning rush lines disappear with 3-second transaction times.", color: "from-amber-500 to-orange-600" },
  { icon: Star, title: "Loyalty & Rewards", description: "Built-in punch card loyalty program keeps regulars coming back every single morning.", color: "from-yellow-500 to-amber-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Stop giving away cents on every latte. Keep 100% of every sale with zero-fee processing.", color: "from-green-500 to-green-600" },
  { icon: Clock, title: "Pre-Orders & Mobile Pay", description: "Let customers order ahead via mobile to reduce wait times and increase throughput.", color: "from-blue-500 to-blue-600" },
  { icon: BarChart3, title: "Menu Performance", description: "Identify your best-sellers and profit margins to optimize your drink menu daily.", color: "from-purple-500 to-purple-600" },
  { icon: Shield, title: "Free Equipment", description: "Tablet POS, receipt printer, and cash drawer all included at no cost to your cafe.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Contactless Payments", description: "Tap-to-pay speed keeps the morning line moving with Apple Pay and Google Pay support.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Morning rush issues? Our US-based team is ready to help before the doors even open.", color: "from-red-500 to-red-600" },
];

export default function CoffeePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Cafe & Coffee Shop POS System – Zero Fees | EzPay America"
        description="Best POS system for coffee shops and cafes. Zero transaction fees, loyalty programs, fast checkout, free equipment. Crush the morning rush. Apply free today."
        keywords="coffee shop POS system, cafe POS system, coffee POS, best POS for coffee shop, cafe payment processing, coffee shop payment system, cafe credit card processing, free cafe POS, loyalty program coffee shop, zero fee coffee shop POS"
        url="https://ezpayamerica.com/CoffeePOS"
      />
      <LandingHero
        badge="Cafe & Coffee Shop POS"
        headline="The POS That Keeps Up With Your Morning Rush"
        subheadline="Designed for coffee shops and cafes — fast checkout, built-in loyalty, zero transaction fees, and free equipment to fuel your cafe's growth."
        bullets={[
          "Lightning-fast checkout for busy mornings",
          "Built-in loyalty punch card program",
          "Zero fees on every transaction",
          "Free tablet POS & receipt printer",
          "Mobile ordering & pre-pay support"
        ]}
        service="Cafe & Coffee Shop POS"
      />
      <LandingFeatures title="Built for Coffee Shops & Cafes" subtitle="Everything you need to serve more customers, build loyalty, and grow your cafe." features={features} />
      <LandingCTA headline="Upgrade Your Cafe With a Free POS Today" subtext="Zero fees, free hardware, built-in loyalty — the best coffee shop POS in America." service="Cafe & Coffee Shop POS" />
    </div>
  );
}