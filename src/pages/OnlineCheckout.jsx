import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Globe, CreditCard, Shield, Zap, Lock, BarChart3, Smartphone, Code, RefreshCw } from "lucide-react";

const features = [
  { icon: Globe, title: "Hosted Checkout Pages", description: "Fully hosted, branded checkout pages live in minutes — no developer needed, no server to manage.", color: "from-amber-500 to-orange-600" },
  { icon: Code, title: "Embedded Checkout", description: "Embed our secure checkout directly into your existing website with a single line of code.", color: "from-blue-500 to-blue-600" },
  { icon: Lock, title: "PCI DSS Level 1", description: "The highest level of payment security. Your customers' card data is always protected.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "One-Click Checkout", description: "Returning customers complete purchases in seconds with saved payment methods.", color: "from-purple-500 to-purple-600" },
  { icon: CreditCard, title: "All Payment Methods", description: "Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, and ACH bank transfers.", color: "from-yellow-500 to-amber-600" },
  { icon: Smartphone, title: "Mobile-First Design", description: "Checkout pages designed for mobile — where over 60% of online purchases happen.", color: "from-teal-500 to-teal-600" },
  { icon: BarChart3, title: "Conversion Optimization", description: "A/B tested checkout flows that reduce cart abandonment and increase completed purchases.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Zero Transaction Fees", description: "No per-transaction fees on any online checkout — keep 100% of every sale.", color: "from-red-500 to-red-600" },
  { icon: Shield, title: "Fraud Protection Built-In", description: "AI-driven fraud detection on every transaction protects your business automatically.", color: "from-indigo-500 to-indigo-600" },
];

export default function OnlineCheckout() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Online Checkout – Hosted & Embedded Payment Pages | EzPay America"
        description="Accept payments online with hosted or embedded checkout. Zero transaction fees, PCI compliant, mobile-optimized. No coding needed. Get started free. (865) 316-9625."
        keywords="online checkout, hosted checkout page, embedded checkout, online payment page, accept payments online, e-commerce checkout, zero fee online checkout, secure online checkout, payment gateway checkout, best online checkout small business"
        url="https://ezpayamerica.com/OnlineCheckout"
      />
      <LandingHero
        badge="Online Checkout Solutions"
        headline="Hosted & Embedded Checkout With Zero Fees"
        subheadline="Launch a secure, branded checkout in minutes — hosted by us or embedded in your site. No coding required. Zero transaction fees. More conversions guaranteed."
        bullets={[
          "Hosted checkout live in under 10 minutes",
          "Embed directly into your existing website",
          "Mobile-optimized for higher conversions",
          "Zero transaction fees on every sale",
          "PCI DSS Level 1 — highest security standard"
        ]}
        service="Online Checkout"
      />
      <LandingFeatures title="The Smartest Way to Accept Payments Online" subtitle="Flexible, secure checkout built for businesses of every size." features={features} />
      <LandingCTA headline="Start Accepting Online Payments Today" subtext="Get your checkout page live in minutes — no developer, no contracts, no fees." service="Online Checkout" />
    </div>
  );
}