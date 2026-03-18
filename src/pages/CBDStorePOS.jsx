import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Shield, CreditCard, BarChart3, Package, Zap, Lock, Star, RefreshCw, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Shield, title: "CBD-Compliant Processing", description: "Specialized merchant accounts that actually work for CBD and hemp product retailers.", color: "from-green-600 to-green-800" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "CBD merchants pay zero transaction fees — keep more from every supplement sale.", color: "from-amber-500 to-orange-600" },
  { icon: Lock, title: "Secure & Stable Account", description: "No sudden account terminations. We specialize in CBD merchant accounts that last.", color: "from-blue-500 to-blue-600" },
  { icon: Package, title: "Inventory Management", description: "Track SKUs, product variants, and stock levels across your CBD store effortlessly.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Sales Analytics", description: "Track best-sellers, customer return rates, and category performance.", color: "from-teal-500 to-teal-600" },
  { icon: Zap, title: "Fast Approval", description: "Our CBD merchant account approval process is streamlined for faster processing setup.", color: "from-yellow-500 to-amber-600" },
  { icon: Star, title: "Customer Loyalty", description: "Built-in loyalty rewards program perfect for repeat CBD and wellness customers.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Online Sales Ready", description: "Process CBD sales in-store and online with integrated e-commerce payment support.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Industry Expert Support", description: "Work with a support team that understands CBD industry compliance and regulations.", color: "from-indigo-500 to-indigo-600" },
];

export default function CBDStorePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="CBD Store POS System & Payment Processing | EzPay America"
        description="CBD-compliant POS system and payment processing with zero transaction fees. Stable merchant accounts for hemp and CBD retailers. No sudden terminations. Apply free."
        keywords="CBD store POS, CBD payment processing, hemp payment processing, CBD merchant account, CBD credit card processing, CBD POS system, CBD retail POS, CBD store payment system, hemp store POS, CBD merchant services"
        url="https://ezpayamerica.com/CBDStorePOS"
      />
      <LandingHero
        badge="CBD Store POS & Payment Processing"
        headline="CBD Payment Processing That Actually Works"
        subheadline="Stable, CBD-compliant merchant accounts with zero transaction fees. EzPay America specializes in payment processing for CBD and hemp retailers — no sudden shutdowns."
        bullets={[
          "CBD-compliant merchant accounts",
          "Zero transaction fees on all sales",
          "Stable, no-termination accounts",
          "In-store & online CBD processing",
          "Free POS equipment included"
        ]}
        service="CBD Store POS"
      />
      <LandingFeatures title="The CBD Payment Solution You Can Rely On" subtitle="Specialized processing for CBD, hemp, and wellness retailers across the USA." features={features} />
      <LandingCTA headline="Get Reliable CBD Payment Processing Today" subtext="Stable accounts, zero fees, free equipment. The CBD POS solution built for your business." service="CBD Store POS" />
    </div>
  );
}