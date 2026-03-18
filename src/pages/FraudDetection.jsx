import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Shield, Zap, BarChart3, Lock, RefreshCw, Eye, AlertTriangle, CheckCircle2, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Shield, title: "AI-Powered Fraud Detection", description: "Machine learning models analyze every transaction in real time to block fraudulent charges.", color: "from-red-500 to-red-600" },
  { icon: Eye, title: "Rules-Based Filters", description: "Set custom rules to block transactions by amount, country, card type, velocity, and more.", color: "from-amber-500 to-orange-600" },
  { icon: Zap, title: "Real-Time Screening", description: "Every transaction is screened in milliseconds — fraud is stopped before it impacts your business.", color: "from-blue-500 to-blue-600" },
  { icon: AlertTriangle, title: "Velocity Checks", description: "Detect card testing attacks and unusual velocity patterns before losses occur.", color: "from-yellow-500 to-amber-600" },
  { icon: Lock, title: "AVS & CVV Verification", description: "Address and card security code verification reduce card-not-present fraud automatically.", color: "from-green-500 to-green-600" },
  { icon: RefreshCw, title: "3D Secure 2.0", description: "Liability shift to issuing bank on authenticated transactions — protect your revenue.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Fraud Analytics Dashboard", description: "Track fraud attempts, block rates, and revenue saved in a real-time analytics view.", color: "from-teal-500 to-teal-600" },
  { icon: CheckCircle2, title: "Chargeback Prevention", description: "Proactive fraud prevention reduces chargebacks and protects your merchant account health.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "Risk Team Support", description: "Our dedicated risk team can review flagged transactions and help tune your fraud rules.", color: "from-indigo-500 to-indigo-600" },
];

export default function FraudDetection() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Fraud Detection & Prevention for Merchants | EzPay America"
        description="AI-powered fraud detection with rules-based filters. Real-time transaction screening, 3D Secure, velocity checks, and chargeback prevention. Protect your business free."
        keywords="payment fraud detection, merchant fraud prevention, AI fraud detection, rules based fraud, transaction screening, chargeback prevention, velocity checks, 3D secure authentication, AVS CVV verification, online payment fraud protection"
        url="https://ezpayamerica.com/FraudDetection"
      />
      <LandingHero
        badge="Fraud Detection & Prevention"
        headline="Stop Fraud Before It Costs Your Business"
        subheadline="AI-powered and rules-based fraud detection screens every transaction in real time. Protect your business from chargebacks, card testing, and fraudulent payments."
        bullets={[
          "AI machine learning on every transaction",
          "Custom rules — block by country, amount, velocity",
          "3D Secure 2.0 liability shift",
          "Real-time fraud analytics dashboard",
          "Chargeback prevention built in"
        ]}
        service="Fraud Detection"
      />
      <LandingFeatures title="Enterprise Fraud Protection for Every Business" subtitle="From small merchants to high-volume businesses — AI fraud detection at no extra cost." features={features} />
      <LandingCTA headline="Protect Your Business From Fraud Today" subtext="Real-time AI screening, custom rules, chargeback protection — all included free." service="Fraud Detection" />
    </div>
  );
}