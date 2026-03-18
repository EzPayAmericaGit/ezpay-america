import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { ShoppingCart, CreditCard, Package, BarChart3, Zap, Shield, RefreshCw, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: ShoppingCart, title: "Fast Convenience Checkout", description: "Barcode scanning and quick-key products get customers out the door in seconds.", color: "from-amber-500 to-orange-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Every sale — cigarettes, beverages, snacks — processed with zero credit card fees.", color: "from-green-500 to-green-600" },
  { icon: Package, title: "Convenience Inventory", description: "Track thousands of convenience items, set reorder alerts, and reduce out-of-stocks.", color: "from-blue-500 to-blue-600" },
  { icon: Zap, title: "EBT / SNAP / WIC Ready", description: "Accept government assistance payments seamlessly alongside all credit and debit cards.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Shrink & Theft Control", description: "Identify discrepancies and reduce shrink with per-transaction and inventory reconciliation.", color: "from-teal-500 to-teal-600" },
  { icon: RefreshCw, title: "Lottery & ATM Ready", description: "Integrate lottery terminal management and ATM surcharge tracking with your POS.", color: "from-yellow-500 to-amber-600" },
  { icon: Shield, title: "Age-Restricted Item Alerts", description: "Automatic prompts for tobacco, alcohol, and other age-restricted products at checkout.", color: "from-pink-500 to-pink-600" },
  { icon: Star, title: "Loyalty Programs", description: "Simple loyalty punch cards to turn one-time buyers into daily regulars.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "24/7 US Support", description: "Always-available support from our team of convenience store POS specialists.", color: "from-indigo-500 to-indigo-600" },
];

export default function MiniMarketPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Mini Market & Convenience Store POS – Zero Fees | EzPay America"
        description="Best POS for mini markets and convenience stores. EBT/WIC/SNAP ready, inventory tracking, zero transaction fees, lottery integration. Free equipment. Apply free."
        keywords="mini market POS, convenience store POS, corner store POS, convenience store payment processing, EBT SNAP WIC POS, mini market payment system, convenience store credit card processing, zero fee convenience store POS, c-store POS system"
        url="https://ezpayamerica.com/MiniMarketPOS"
      />
      <LandingHero
        badge="Mini Market & Convenience Store POS"
        headline="The Mini Market POS With Zero Transaction Fees"
        subheadline="Fast checkout, EBT/SNAP/WIC ready, and zero processing fees — EzPay America is the #1 POS choice for mini markets and convenience stores."
        bullets={[
          "EBT, SNAP, WIC, and all cards",
          "Fast barcode checkout",
          "Full inventory for 1,000+ items",
          "Zero transaction fees",
          "Age-restricted item compliance alerts"
        ]}
        service="Mini Market POS"
      />
      <LandingFeatures title="Everything Your Mini Market Needs" subtitle="Built for the fast pace and diverse needs of convenience and mini market operators." features={features} />
      <LandingCTA headline="Get Your Free Mini Market POS Today" subtext="Zero fees, EBT-ready, free equipment — the best convenience store POS in America." service="Mini Market POS" />
    </div>
  );
}