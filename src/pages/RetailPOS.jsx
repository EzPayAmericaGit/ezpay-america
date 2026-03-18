import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Store, BarChart3, Package, CreditCard, Zap, Shield, Smartphone, RefreshCw, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Store, title: "Cloud-Based POS", description: "Run your entire retail store from a cloud system — access sales data from anywhere, anytime.", color: "from-amber-500 to-orange-600" },
  { icon: Package, title: "Inventory Management", description: "Real-time stock tracking, low-stock alerts, and purchase order management built in.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero-Fee Processing", description: "Accept all payment types with zero transaction fees — keep 100% of your retail revenue.", color: "from-green-500 to-green-600" },
  { icon: BarChart3, title: "Sales Reporting", description: "Daily, weekly, and monthly reports with customer purchase history and product performance.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "Fast Checkout", description: "Barcode scanning, quick-key items, and tap-to-pay reduce checkout time to seconds.", color: "from-yellow-500 to-amber-600" },
  { icon: Shield, title: "Employee Management", description: "Set permissions, track hours, and monitor individual staff sales performance.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Mobile POS", description: "Accept payments anywhere in your store with mobile tablets and wireless card readers.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Customer Loyalty", description: "Built-in loyalty rewards and gift card programs to bring customers back again and again.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "24/7 US Support", description: "Get help any time from our dedicated US-based retail POS support specialists.", color: "from-indigo-500 to-indigo-600" },
];

export default function RetailPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Retail POS System – Free Cloud POS for Retail Stores | EzPay America"
        description="Best retail POS system with zero transaction fees. Cloud-based, free equipment, inventory management, and loyalty programs for retail stores. Apply free today."
        keywords="retail POS system, retail point of sale, cloud POS retail, free retail POS, best retail POS, retail store POS, POS system for retail store, retail POS software, small business retail POS, retail management system"
        url="https://ezpayamerica.com/RetailPOS"
      />
      <LandingHero
        badge="EzPay Retail POS"
        headline="The #1 Retail POS System With Zero Transaction Fees"
        subheadline="EzPay America's cloud-based retail POS gives you everything to run your store — inventory, loyalty, reporting, and payments — with no processing fees and free equipment."
        bullets={[
          "Full cloud-based retail POS — free",
          "Real-time inventory management",
          "Zero transaction fees on all payments",
          "Loyalty programs & gift cards included",
          "Multi-location & multi-register support"
        ]}
        service="Retail POS System"
      />
      <LandingFeatures title="Everything Your Retail POS Should Do" subtitle="A complete retail management system — not just a payment terminal." features={features} />
      <LandingCTA headline="Get Your Free Retail POS System Today" subtext="No monthly POS fees. No transaction fees. Free hardware. The best retail POS deal in the USA." service="Retail POS System" />
    </div>
  );
}