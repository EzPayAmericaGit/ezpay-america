import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { ShoppingCart, CreditCard, BarChart3, Package, Zap, Shield, RefreshCw, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: ShoppingCart, title: "High-Speed Checkout", description: "Barcode scanner integration and quick-add items process groceries fast, even during peak hours.", color: "from-amber-500 to-orange-600" },
  { icon: Package, title: "Full Inventory System", description: "Manage thousands of SKUs, set reorder points, and sync with suppliers automatically.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Process every grocery sale with zero credit card fees — protect your grocery margins.", color: "from-green-500 to-green-600" },
  { icon: BarChart3, title: "Sales & Shrink Reports", description: "Track sales velocity, identify shrink, and optimize your store layout with data insights.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "EBT / SNAP Ready", description: "Accept EBT and SNAP payments seamlessly alongside all major credit and debit cards.", color: "from-yellow-500 to-amber-600" },
  { icon: RefreshCw, title: "Loyalty & Coupons", description: "Built-in loyalty points and digital coupon system to drive repeat customers.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "Multi-Lane Support", description: "Manage multiple checkout lanes from one back-office system with per-lane reporting.", color: "from-pink-500 to-pink-600" },
  { icon: Star, title: "Produce & Weight Pricing", description: "Sell produce by weight with integrated scale support and dynamic pricing tools.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "24/7 US Support", description: "Our dedicated grocery POS support team is available around the clock.", color: "from-indigo-500 to-indigo-600" },
];

export default function GroceryStorePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Grocery Store POS System – Zero Fees & Free Equipment | EzPay America"
        description="Best POS for grocery stores. EBT/SNAP ready, inventory management, barcode scanning, zero transaction fees, multi-lane support. Free equipment. Apply free today."
        keywords="grocery store POS system, grocery POS, grocery store payment processing, supermarket POS, EBT SNAP payment processing, grocery inventory management, zero fee grocery POS, free grocery store POS, small grocery store POS system"
        url="https://ezpayamerica.com/GroceryStorePOS"
      />
      <LandingHero
        badge="Grocery Store POS"
        headline="The Grocery Store POS With Zero Transaction Fees"
        subheadline="EBT/SNAP ready, full inventory management, multi-lane checkout, and zero processing fees — EzPay America powers independent grocery stores across America."
        bullets={[
          "EBT/SNAP and all cards accepted",
          "Full inventory management for 1,000s of SKUs",
          "Multi-lane checkout support",
          "Zero transaction fees",
          "Free equipment for every lane"
        ]}
        service="Grocery Store POS"
      />
      <LandingFeatures title="Built for Grocery Store Operations" subtitle="From corner stores to full-service independent grocers — EzPay handles it all." features={features} />
      <LandingCTA headline="Get the Best Grocery Store POS Free" subtext="Zero fees, free equipment, EBT-ready. The best grocery POS in America is waiting." service="Grocery Store POS" />
    </div>
  );
}