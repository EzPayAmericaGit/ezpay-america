import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Globe, Smartphone, BarChart2, Zap, DollarSign, Monitor } from "lucide-react";

const features = [
  {
    icon: Globe,
    color: "from-blue-500 to-blue-600",
    title: "Online Ordering Integration",
    description: "Accept orders directly from your own branded online store — keep 100% of the revenue without paying third-party app commissions."
  },
  {
    icon: Monitor,
    color: "from-orange-500 to-orange-600",
    title: "Multi-Brand Kitchen Display",
    description: "Run multiple virtual restaurant brands from one kitchen — orders for each concept display separately and route to the right prep station."
  },
  {
    icon: Zap,
    color: "from-green-500 to-green-600",
    title: "Third-Party Delivery Aggregation",
    description: "Consolidate DoorDash, Uber Eats, and Grubhub orders into a single kitchen display — no more juggling multiple tablets."
  },
  {
    icon: DollarSign,
    color: "from-amber-500 to-amber-600",
    title: "Eliminate Delivery App Fees",
    description: "Drive customers to your direct online ordering channel and eliminate 20–30% commission fees — EzPay's zero-fee processing makes every direct order more profitable."
  },
  {
    icon: BarChart2,
    color: "from-purple-500 to-purple-600",
    title: "Brand & Revenue Analytics",
    description: "Track performance per virtual brand — see which concepts are profitable, which menu items convert, and where to double down."
  },
  {
    icon: Smartphone,
    color: "from-pink-500 to-pink-600",
    title: "Payment Links for Phone Orders",
    description: "Send instant payment links via text for phone-in orders — collect payment before the delivery driver leaves the kitchen."
  }
];

export default function GhostKitchenPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Ghost Kitchen POS & Payment Processing"
        description="EzPay America's ghost kitchen payment solution — multi-brand order management, direct online ordering, delivery aggregation, and zero transaction fees. Built for virtual restaurants."
        keywords="ghost kitchen POS, virtual restaurant payment processing, ghost kitchen online ordering, dark kitchen POS system, ghost kitchen merchant account, virtual restaurant credit card processing, ghost kitchen delivery aggregator, zero fee ghost kitchen, multi-brand kitchen POS, EzPay ghost kitchen"
        url="https://ezpayamerica.com/GhostKitchenPOS"
      />
      <LandingHero
        headline="Ghost Kitchen & Virtual Restaurant POS"
        subheadline="Maximize every square foot. EzPay America gives ghost kitchens a complete payment platform — multi-brand order management, direct online ordering, and zero transaction fees."
        bullets={[
          "Run multiple virtual brands from one kitchen dashboard",
          "Aggregate DoorDash, Uber Eats & Grubhub into one display",
          "Direct online ordering eliminates 20–30% app commissions",
          "Zero transaction fees on every direct order"
        ]}
        service="Ghost Kitchen POS"
      />
      <LandingFeatures
        title="Technology Built for the Modern Ghost Kitchen"
        subtitle="More brands, more orders, more revenue — with less chaos and zero processing fees."
        features={features}
      />
      <LandingCTA
        headline="Stop Paying Delivery App Commissions"
        subtext="EzPay America helps ghost kitchens build direct ordering channels and keep more of every sale with zero transaction fees."
        service="Ghost Kitchen POS"
      />
    </div>
  );
}