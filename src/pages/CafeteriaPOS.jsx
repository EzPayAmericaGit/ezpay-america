import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Zap, Users, CreditCard, BarChart2, Package, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "from-blue-500 to-blue-600",
    title: "High-Speed Line Processing",
    description: "Process hundreds of transactions per hour with a fast, simple interface — keep cafeteria lines moving during short lunch windows."
  },
  {
    icon: Users,
    color: "from-green-500 to-green-600",
    title: "Prepaid Account & Meal Plan Billing",
    description: "Manage employee meal plans, student lunch accounts, and prepaid balances — customers swipe or scan and funds deduct automatically."
  },
  {
    icon: Package,
    color: "from-amber-500 to-amber-600",
    title: "Menu & Inventory Management",
    description: "Update daily specials in seconds, track item quantities in real time, and reduce waste with automatic depletion tracking."
  },
  {
    icon: CreditCard,
    color: "from-purple-500 to-purple-600",
    title: "All Payment Types Accepted",
    description: "Cash, credit, debit, Apple Pay, Google Pay, and prepaid meal cards — every payment type handled at one terminal without friction."
  },
  {
    icon: BarChart2,
    color: "from-orange-500 to-orange-600",
    title: "Usage & Participation Reports",
    description: "Track meal plan usage rates, peak service hours, and top menu items — data that helps you manage staffing, prep, and food ordering efficiently."
  },
  {
    icon: Shield,
    color: "from-red-500 to-red-600",
    title: "Zero Transaction Fees",
    description: "EzPay's cash-discount program eliminates processing costs on every meal — keeping cafeteria budgets lean without sacrificing service quality."
  }
];

export default function CafeteriaPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Cafeteria POS & Meal Plan Payment Processing"
        description="EzPay America's cafeteria POS — high-speed line processing, prepaid meal plan management, inventory tracking, and zero transaction fees. For corporate, school & institutional cafeterias."
        keywords="cafeteria POS system, cafeteria payment processing, meal plan billing software, cafeteria point of sale, school cafeteria POS, corporate cafeteria payment, cafeteria merchant account, prepaid meal card system, zero fee cafeteria processing, EzPay cafeteria POS"
        url="https://ezpayamerica.com/CafeteriaPOS"
      />
      <LandingHero
        headline="Cafeteria POS & Meal Plan Billing"
        subheadline="Keep the line moving and every meal accounted for. EzPay America gives corporate, school, and institutional cafeterias a high-speed POS with prepaid meal plan management and zero fees."
        bullets={[
          "Process hundreds of transactions per hour effortlessly",
          "Prepaid meal plan & employee meal account management",
          "Real-time inventory depletion to reduce food waste",
          "Zero transaction fees on every tray served"
        ]}
        service="Cafeteria POS"
      />
      <LandingFeatures
        title="Built for High-Volume Institutional Dining"
        subtitle="From corporate headquarters to school cafeterias — EzPay handles the volume, the meal plans, and the reporting."
        features={features}
      />
      <LandingCTA
        headline="Serve More. Spend Less on Processing."
        subtext="EzPay America gives cafeterias a complete payment platform with zero transaction fees, free equipment, and reliable high-volume performance."
        service="Cafeteria POS"
      />
    </div>
  );
}