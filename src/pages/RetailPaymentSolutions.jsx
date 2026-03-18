import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Store, CreditCard, Shield, Zap, BarChart3, Smartphone, RefreshCw, Package, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: CreditCard, title: "Omnichannel Payments", description: "Accept payments in-store, online, and on mobile — all from one unified merchant account.", color: "from-amber-500 to-orange-600" },
  { icon: Store, title: "Multi-Location Support", description: "Manage multiple retail locations from a single dashboard with centralized reporting.", color: "from-blue-500 to-blue-600" },
  { icon: Package, title: "Inventory Management", description: "Track stock levels, set reorder alerts, and manage products across all your retail locations.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Checkout in Seconds", description: "Fast EMV chip, tap-to-pay, and swipe processing keeps checkout lines moving.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Advanced Analytics", description: "Deep sales insights, customer purchase history, and trend data to optimize your retail strategy.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "Chargeback Protection", description: "Built-in tools to dispute chargebacks and protect your retail business from fraud losses.", color: "from-red-500 to-red-600" },
  { icon: RefreshCw, title: "Loyalty & Gift Cards", description: "Build customer loyalty with branded gift cards and rewards programs included at no extra cost.", color: "from-pink-500 to-pink-600" },
  { icon: Smartphone, title: "Mobile POS Option", description: "Turn any tablet or smartphone into a full-featured retail POS with our mobile app.", color: "from-yellow-500 to-amber-600" },
  { icon: HeadphonesIcon, title: "Dedicated Account Manager", description: "Every retail merchant gets a dedicated US-based account manager for personalized support.", color: "from-indigo-500 to-indigo-600" },
];

export default function RetailPaymentSolutions() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Retail Payment Solutions – Complete POS & Processing | EzPay America"
        description="Complete retail payment solutions: zero-fee processing, inventory management, loyalty programs, multi-location support. Best retail POS for small business. Apply free."
        keywords="retail payment solutions, retail payment processing, retail POS system, retail merchant services, multi-location retail payment, omnichannel retail payment, retail inventory management, retail credit card processing, best retail payment processor, retail point of sale"
        url="https://ezpayamerica.com/RetailPaymentSolutions"
      />
      <LandingHero
        badge="Complete Retail Payment Solutions"
        headline="The Complete Payment Solution for Retail Businesses"
        subheadline="From single-location boutiques to multi-store chains — EzPay America gives you everything to run a modern retail business with zero processing fees."
        bullets={[
          "In-store, online, and mobile payments unified",
          "Full inventory management included",
          "Multi-location dashboard",
          "Gift cards & loyalty programs",
          "Zero transaction fees on all sales"
        ]}
        service="Retail Payment Solutions"
      />
      <LandingFeatures
        title="Everything Retail Merchants Need in One Place"
        subtitle="A complete payment ecosystem built for modern retail businesses of all sizes."
        features={features}
      />
      <LandingCTA
        headline="Power Your Retail Business With EzPay"
        subtext="Get the complete retail payment solution with zero fees, free equipment, and dedicated support."
        service="Retail Payment Solutions"
      />
    </div>
  );
}