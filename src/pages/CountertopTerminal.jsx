import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { CreditCard, Shield, Zap, Lock, BarChart3, Smartphone, RefreshCw, Clock, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: CreditCard, title: "All Payment Types", description: "Accept chip, swipe, tap, Apple Pay, Google Pay, and all major credit & debit cards.", color: "from-amber-500 to-orange-600" },
  { icon: Shield, title: "EMV & NFC Ready", description: "Fully compliant EMV chip reader with NFC contactless payment capability built in.", color: "from-blue-500 to-blue-600" },
  { icon: Zap, title: "3-Second Transactions", description: "Ultra-fast processing speeds keep your checkout line moving and customers happy.", color: "from-green-500 to-green-600" },
  { icon: Lock, title: "PCI DSS Compliant", description: "End-to-end encryption and tokenization protect every transaction at your counter.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Built-In Reporting", description: "View daily batch totals, transaction history, and sales summaries directly on device.", color: "from-teal-500 to-teal-600" },
  { icon: Clock, title: "Free Setup", description: "We remotely program and configure your terminal — plug in and start processing.", color: "from-yellow-500 to-amber-600" },
  { icon: RefreshCw, title: "Zero Processing Fees", description: "Every terminal comes paired with our zero-fee processing program — no transaction costs.", color: "from-pink-500 to-pink-600" },
  { icon: Smartphone, title: "Tip & Signature Screen", description: "Customer-facing display for tip prompts, signatures, and receipt options.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Lifetime Support", description: "Every terminal comes with lifetime US-based technical support at no additional cost.", color: "from-indigo-500 to-indigo-600" },
];

export default function CountertopTerminal() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Countertop Payment Terminal – Free with Zero Fees | EzPay America"
        description="Get a free countertop credit card terminal with zero transaction fees. EMV, NFC, Apple Pay ready. Fast 3-second processing. Free setup. Apply today. (865) 316-9625."
        keywords="countertop payment terminal, credit card terminal, countertop card reader, payment terminal free, EMV terminal, NFC payment terminal, contactless payment terminal, best credit card terminal, free credit card machine, countertop POS terminal"
        url="https://ezpayamerica.com/CountertopTerminal"
      />
      <LandingHero
        badge="Countertop Payment Terminal"
        headline="Free Countertop Terminal + Zero Transaction Fees"
        subheadline="Get the industry's best countertop payment terminal at no cost. EMV chip, NFC contactless, and Apple Pay ready — with zero transaction fees on every sale."
        bullets={[
          "Free terminal — no purchase required",
          "EMV chip, NFC, & Apple/Google Pay",
          "Zero transaction fees",
          "3-second processing speed",
          "Free remote setup & programming"
        ]}
        service="Countertop Payment Terminal"
      />
      <LandingFeatures title="The Most Advanced Countertop Terminal — Free" subtitle="Professional-grade payment hardware with zero-fee processing included." features={features} />
      <LandingCTA headline="Get Your Free Countertop Terminal Today" subtext="Apply now and receive your pre-programmed terminal with zero transaction fees — ready to process in 48 hours." service="Countertop Payment Terminal" />
    </div>
  );
}