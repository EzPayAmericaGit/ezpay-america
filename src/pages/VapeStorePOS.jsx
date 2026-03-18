import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Shield, CreditCard, Package, BarChart3, Zap, Lock, Star, Smartphone, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Shield, title: "Vape-Compliant Processing", description: "Merchant accounts built for vape and e-cigarette retailers — stable and compliant.", color: "from-blue-600 to-blue-800" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Stop paying processing fees on every vape sale. Keep 100% of your retail revenue.", color: "from-amber-500 to-orange-600" },
  { icon: Package, title: "Product Catalog Management", description: "Track hundreds of SKUs — e-liquids, devices, mods, coils, and accessories.", color: "from-green-500 to-green-600" },
  { icon: Lock, title: "Age Verification Prompts", description: "Built-in age verification reminders to keep your vape store compliant with regulations.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Top-Seller Analytics", description: "See which flavors, brands, and products drive the most revenue for your store.", color: "from-teal-500 to-teal-600" },
  { icon: Zap, title: "Fast Checkout", description: "Barcode scanning and quick-find search speed up checkout for every customer.", color: "from-yellow-500 to-amber-600" },
  { icon: Star, title: "Loyalty Programs", description: "Custom loyalty punch cards and rewards to keep vape customers coming back.", color: "from-pink-500 to-pink-600" },
  { icon: Smartphone, title: "Online Store Ready", description: "Sync your vape store inventory with online sales channels for omnichannel selling.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Specialized Support", description: "Support from a team that understands vape industry payment processing requirements.", color: "from-indigo-500 to-indigo-600" },
];

export default function VapeStorePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Vape Store POS System & Payment Processing | EzPay America"
        description="Vape-compliant POS and payment processing with zero transaction fees. Stable merchant accounts for vape, e-cigarette, and smoke shops. Free equipment. Apply free."
        keywords="vape store POS, vape shop payment processing, e-cigarette merchant account, vape payment processing, vape shop POS system, smoke shop POS, vape retail POS, vape store credit card processing, vape merchant services"
        url="https://ezpayamerica.com/VapeStorePOS"
      />
      <LandingHero
        badge="Vape Store POS & Payment Processing"
        headline="Vape Store Payment Processing With Zero Fees"
        subheadline="Stable vape and e-cigarette merchant accounts with zero transaction fees. Age verification, product catalog management, and free POS equipment for your vape shop."
        bullets={[
          "Vape-compliant stable merchant accounts",
          "Zero transaction fees",
          "Age verification compliance tools",
          "Track 100s of e-liquid & device SKUs",
          "Free POS equipment"
        ]}
        service="Vape Store POS"
      />
      <LandingFeatures title="Built for Vape Shops & Smoke Stores" subtitle="Reliable payment processing for vape retailers who need stable, compliant accounts." features={features} />
      <LandingCTA headline="Get Your Vape Store POS Free Today" subtext="Compliant, stable, zero-fee — the best vape store payment processing available." service="Vape Store POS" />
    </div>
  );
}