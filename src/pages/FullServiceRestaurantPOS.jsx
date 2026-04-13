import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Utensils, Users, CreditCard, BarChart2, Clock, Shield } from "lucide-react";

const features = [
  {
    icon: Utensils,
    color: "from-red-500 to-red-600",
    title: "Full Table Management",
    description: "Interactive floor plans, table status tracking, and server assignments — manage your dining room visually from any device."
  },
  {
    icon: Users,
    color: "from-amber-500 to-amber-600",
    title: "Multi-Course Order Routing",
    description: "Fire courses to the kitchen at the right time. Appetizers, mains, and desserts route automatically to the correct kitchen stations."
  },
  {
    icon: CreditCard,
    color: "from-green-500 to-green-600",
    title: "Split Bills & Flexible Payments",
    description: "Split checks by seat, item, or percentage. Accept credit, debit, digital wallets, and gift cards — all in one transaction."
  },
  {
    icon: Clock,
    color: "from-blue-500 to-blue-600",
    title: "Reservation & Waitlist Integration",
    description: "Connect with popular reservation platforms to sync bookings and waitlists directly to your POS floor plan in real time."
  },
  {
    icon: BarChart2,
    color: "from-purple-500 to-purple-600",
    title: "Server Performance & Sales Reports",
    description: "Track server sales, tip averages, table turn times, and top menu items — data you need to train your team and boost revenue."
  },
  {
    icon: Shield,
    color: "from-slate-500 to-slate-600",
    title: "Zero Transaction Fees",
    description: "EzPay's cash-discount program eliminates your card processing costs completely — keeping more of every sale in your restaurant."
  }
];

export default function FullServiceRestaurantPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Full Service Restaurant POS & Payment Processing"
        description="EzPay America's full service restaurant POS system — table management, course routing, split billing, and zero transaction fees. Free equipment, fast approval, no contracts."
        keywords="full service restaurant POS, restaurant point of sale system, table management POS, sit down restaurant payment processing, fine dining POS, restaurant split check, zero fee restaurant processing, restaurant credit card processing no fees, full service restaurant merchant account, EzPay restaurant POS"
        url="https://ezpayamerica.com/FullServiceRestaurantPOS"
      />
      <LandingHero
        headline="Full Service Restaurant POS & Payments"
        subheadline="From the host stand to the kitchen to the check — EzPay America gives full-service restaurants a complete POS system with zero transaction fees and free equipment."
        bullets={[
          "Interactive table management & server assignments",
          "Multi-course kitchen routing — fire dishes at the right time",
          "Split checks by seat, item, or any way guests prefer",
          "Zero transaction fees with our cash-discount program"
        ]}
        service="Full Service Restaurant POS"
      />
      <LandingFeatures
        title="Built for the Complexity of Full-Service Dining"
        subtitle="From a 10-table bistro to a 200-seat destination restaurant — EzPay scales with your operation."
        features={features}
      />
      <LandingCTA
        headline="Ready to Cut Your Processing Costs to Zero?"
        subtext="EzPay America equips full-service restaurants with everything they need — POS, payments, and support — at no monthly transaction cost."
        service="Full Service Restaurant POS"
      />
    </div>
  );
}