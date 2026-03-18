import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Wine, CreditCard, Package, BarChart3, Zap, Shield, RefreshCw, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Wine, title: "Liquor Store Inventory", description: "Manage wine, spirits, beer, and mixers with SKU-level tracking and reorder alerts.", color: "from-purple-600 to-purple-800" },
  { icon: Shield, title: "Age Verification Prompts", description: "Mandatory ID check reminders at POS keep your liquor store compliant with state law.", color: "from-red-500 to-red-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Process every bottle sale with zero credit card fees — maximizing liquor store margins.", color: "from-amber-500 to-orange-600" },
  { icon: Zap, title: "Fast Checkout", description: "Barcode scanning and quick-key items make checkout fast even during the evening rush.", color: "from-green-500 to-green-600" },
  { icon: BarChart3, title: "Sales & Margin Analytics", description: "Identify your highest-margin products and optimize your store's product mix.", color: "from-blue-500 to-blue-600" },
  { icon: Package, title: "Case & Single Pricing", description: "Dual pricing for case and single-bottle sales with automatic discount calculation.", color: "from-teal-500 to-teal-600" },
  { icon: RefreshCw, title: "Vendor & Purchase Orders", description: "Manage vendor accounts and create purchase orders directly from your POS inventory.", color: "from-yellow-500 to-amber-600" },
  { icon: Star, title: "Customer Loyalty", description: "Build a loyal customer base with a built-in points and rewards program.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Expert support available all day and night for your liquor store operation.", color: "from-indigo-500 to-indigo-600" },
];

export default function LiquorStorePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Liquor Store POS System – Zero Fees & Compliance | EzPay America"
        description="Best POS for liquor stores. Age verification, wine & spirits inventory, zero transaction fees, case pricing, free equipment. Compliant and profitable. Apply free."
        keywords="liquor store POS system, wine store POS, spirits shop POS, liquor store payment processing, age verification POS, liquor store credit card processing, zero fee liquor store POS, beer wine spirits POS, liquor store inventory management"
        url="https://ezpayamerica.com/LiquorStorePOS"
      />
      <LandingHero
        badge="Liquor Store POS"
        headline="The Liquor Store POS Built for Compliance & Profit"
        subheadline="Age verification, wine & spirits inventory, case pricing, and zero transaction fees — EzPay America is purpose-built for liquor store operations."
        bullets={[
          "Built-in age verification compliance",
          "Wine, spirits, and beer inventory tracking",
          "Case & single-bottle dual pricing",
          "Zero transaction fees",
          "Free POS equipment included"
        ]}
        service="Liquor Store POS"
      />
      <LandingFeatures title="Built for Liquor Stores & Wine Shops" subtitle="Compliance, inventory, and zero-fee processing — everything your liquor store needs." features={features} />
      <LandingCTA headline="Get Your Free Liquor Store POS Today" subtext="Compliant, zero-fee, and free. The best liquor store POS system is available now." service="Liquor Store POS" />
    </div>
  );
}