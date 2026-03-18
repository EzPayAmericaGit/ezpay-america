import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Beer, CreditCard, Clock, BarChart3, Zap, Shield, Smartphone, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Beer, title: "Bar Tab Management", description: "Open tabs, add drinks throughout the night, and close out quickly at last call.", color: "from-amber-600 to-amber-800" },
  { icon: Zap, title: "Speed Bar Mode", description: "Quick-fire drink orders with pre-programmed buttons for your most popular items.", color: "from-amber-500 to-orange-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Keep every dollar from every round with zero credit card processing fees.", color: "from-green-500 to-green-600" },
  { icon: Smartphone, title: "Handheld Table Service", description: "Servers take orders and run cards tableside for faster service and bigger tips.", color: "from-blue-500 to-blue-600" },
  { icon: BarChart3, title: "Liquor Cost Control", description: "Track pour costs, identify waste, and optimize your liquor inventory and pricing.", color: "from-purple-500 to-purple-600" },
  { icon: Star, title: "Happy Hour Pricing", description: "Set automatic discounts and happy hour pricing that turn on and off on a schedule.", color: "from-yellow-500 to-amber-600" },
  { icon: Shield, title: "Age Verification Tools", description: "ID prompt reminders and age-gate features to help staff stay compliant.", color: "from-teal-500 to-teal-600" },
  { icon: Clock, title: "Late Night Support", description: "24/7 support that's available through last call and closing — we don't clock out.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "Free Equipment", description: "Bar terminals, wireless handhelds, receipt printers — all free with your account.", color: "from-indigo-500 to-indigo-600" },
];

export default function BarTavernPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Bar & Tavern POS System – Zero Fees | EzPay America"
        description="Best POS system for bars and taverns. Tab management, speed bar mode, zero transaction fees, handheld ordering, free equipment. Open tabs & close fast. Apply free."
        keywords="bar POS system, tavern POS, bar payment processing, bar tab management, best POS for bar, bar credit card processing, zero fee bar POS, free bar POS equipment, nightclub POS, bar point of sale system"
        url="https://ezpayamerica.com/BarTavernPOS"
      />
      <LandingHero
        badge="Bar & Tavern POS"
        headline="The Bar POS Built for Speed & Volume"
        subheadline="Open tabs, run rounds, and close the night without the hassle. EzPay America's bar POS keeps drinks flowing and processing fees at zero."
        bullets={[
          "Lightning-fast tab open & close",
          "Speed bar mode for high volume",
          "Handheld tableside ordering",
          "Zero transaction fees",
          "Happy hour automatic pricing"
        ]}
        service="Bar & Tavern POS"
      />
      <LandingFeatures title="Built for Bars, Taverns & Nightlife" subtitle="From neighborhood taverns to high-volume nightclubs — EzPay handles every round." features={features} />
      <LandingCTA headline="The Best Bar POS — Free & Zero-Fee" subtext="Tab management, speed bar mode, and zero processing fees. Get started tonight." service="Bar & Tavern POS" />
    </div>
  );
}