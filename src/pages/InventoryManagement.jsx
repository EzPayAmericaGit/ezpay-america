import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Package, BarChart3, RefreshCw, Zap, Shield, Smartphone, AlertTriangle, Code, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Package, title: "Real-Time Stock Tracking", description: "Every sale automatically deducts from inventory — always know your exact stock levels.", color: "from-amber-500 to-orange-600" },
  { icon: AlertTriangle, title: "Low Stock Alerts", description: "Automatic alerts when products hit your reorder threshold — never run out of top sellers.", color: "from-red-500 to-red-600" },
  { icon: RefreshCw, title: "Purchase Orders", description: "Create and send purchase orders to vendors directly from your inventory dashboard.", color: "from-blue-500 to-blue-600" },
  { icon: BarChart3, title: "Inventory Analytics", description: "Identify your best-sellers, slowest movers, and optimal reorder quantities with data.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Barcode & SKU Management", description: "Import products via CSV, scan barcodes, and manage unlimited SKUs effortlessly.", color: "from-purple-500 to-purple-600" },
  { icon: Shield, title: "Multi-Location Inventory", description: "Track and transfer inventory between multiple store locations from one dashboard.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Mobile Stock Counts", description: "Complete physical inventory counts using your phone's camera as a barcode scanner.", color: "from-yellow-500 to-amber-600" },
  { icon: Code, title: "E-Commerce Sync", description: "Sync inventory with Shopify, WooCommerce, and other platforms in real time.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "Setup Assistance", description: "Our team helps you import your product catalog and configure inventory settings quickly.", color: "from-indigo-500 to-indigo-600" },
];

export default function InventoryManagement() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Inventory Management for Retail & Restaurants | EzPay America"
        description="Real-time inventory management integrated with your POS. Low-stock alerts, purchase orders, multi-location tracking, and e-commerce sync. Free with zero-fee processing."
        keywords="inventory management system, retail inventory management, POS inventory tracking, stock management software, real-time inventory, inventory management small business, barcode inventory system, multi-location inventory, inventory analytics"
        url="https://ezpayamerica.com/InventoryManagement"
      />
      <LandingHero
        badge="Inventory Management"
        headline="Real-Time Inventory That Sells With You"
        subheadline="Every sale automatically updates your inventory. Low-stock alerts, purchase orders, multi-location tracking, and e-commerce sync — all included with your POS."
        bullets={[
          "Real-time stock tracking on every sale",
          "Automatic low-stock alerts",
          "Multi-location inventory management",
          "E-commerce platform sync",
          "Mobile stock counts with camera scanner"
        ]}
        service="Inventory Management"
      />
      <LandingFeatures title="Never Run Out of Stock Again" subtitle="Intelligent inventory management that grows with your retail or restaurant business." features={features} />
      <LandingCTA headline="Get Real-Time Inventory Management Free" subtext="Integrated with your POS, synced with e-commerce, and always accurate. Start today." service="Inventory Management" />
    </div>
  );
}