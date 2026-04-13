import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Building2, CreditCard, Utensils, BarChart2, Smartphone, Shield } from "lucide-react";

const features = [
  {
    icon: Building2,
    color: "from-slate-500 to-slate-600",
    title: "Room Charge Integration",
    description: "Guests charge restaurant, bar, and room service orders directly to their room — seamless PMS integration keeps everything settled at checkout."
  },
  {
    icon: Utensils,
    color: "from-amber-500 to-amber-600",
    title: "Multi-Outlet Management",
    description: "Manage your restaurant, bar, room service, and pool concession from one platform — unified reporting across every food and beverage outlet."
  },
  {
    icon: Smartphone,
    color: "from-blue-500 to-blue-600",
    title: "In-Room & QR Code Ordering",
    description: "Guests scan a QR code to order room service or pool-side — orders route directly to your kitchen display with no staff interaction needed."
  },
  {
    icon: CreditCard,
    color: "from-green-500 to-green-600",
    title: "International Card & Currency Support",
    description: "Accept cards from guests worldwide — EMV chip, NFC contactless, and digital wallets — with reliable authorization for international cards."
  },
  {
    icon: BarChart2,
    color: "from-purple-500 to-purple-600",
    title: "F&B Revenue Reporting",
    description: "Track food and beverage revenue by outlet, shift, and cover — the granular data your F&B director needs to manage cost of goods and labor."
  },
  {
    icon: Shield,
    color: "from-red-500 to-red-600",
    title: "Zero Transaction Fees",
    description: "EzPay's cash-discount program eliminates processing costs across every hotel F&B outlet — improving margins at your restaurant, bar, and room service operation."
  }
];

export default function HotelRestaurantPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Hotel Restaurant POS & F&B Payment Processing"
        description="EzPay America's hotel restaurant POS — room charge integration, multi-outlet management, QR ordering, and zero transaction fees. Built for hotel food and beverage operations."
        keywords="hotel restaurant POS, hotel food beverage payment processing, hotel F&B POS system, room charge restaurant POS, hotel restaurant merchant account, hotel bar POS, room service ordering system, multi outlet hotel POS, zero fee hotel restaurant processing, EzPay hotel restaurant POS"
        url="https://ezpayamerica.com/HotelRestaurantPOS"
      />
      <LandingHero
        headline="Hotel Restaurant & F&B POS"
        subheadline="From the dining room to room service to the pool bar — EzPay America gives hotel food and beverage operations a unified payment platform with room charge integration and zero transaction fees."
        bullets={[
          "Room charge integration with your property management system",
          "Manage restaurant, bar & room service from one platform",
          "QR code ordering for in-room and pool-side guests",
          "Zero transaction fees across all F&B outlets"
        ]}
        service="Hotel Restaurant POS"
      />
      <LandingFeatures
        title="Unified F&B Payment Management for Hotels"
        subtitle="One platform for every outlet in your hotel — reduce friction for guests and complexity for your team."
        features={features}
      />
      <LandingCTA
        headline="Elevate Your Hotel F&B Operation"
        subtext="EzPay America gives hotel restaurants and bars a complete payment solution with zero fees and seamless PMS integration."
        service="Hotel Restaurant POS"
      />
    </div>
  );
}