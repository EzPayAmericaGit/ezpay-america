import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { BarChart3, CreditCard, RefreshCw, Shield, Zap, DollarSign, Code, Lock, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: BarChart3, title: "Metered Usage Tracking", description: "Track API calls, seats, transactions, or any unit of consumption automatically.", color: "from-amber-500 to-orange-600" },
  { icon: DollarSign, title: "Pay-As-You-Go Billing", description: "Charge customers only for what they use — the fairest billing model for growth-stage businesses.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "No per-transaction fees — even on usage-based charges and overage billing.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Real-Time Usage Meters", description: "Monitor customer consumption in real time and bill accurately at end of each period.", color: "from-purple-500 to-purple-600" },
  { icon: RefreshCw, title: "Hybrid Billing Models", description: "Combine a base subscription with usage-based overage charges in a single invoice.", color: "from-yellow-500 to-amber-600" },
  { icon: Code, title: "Usage Reporting API", description: "Send usage data to our API and we handle all the billing calculations and invoicing.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "Spend Alerts", description: "Notify customers when they approach usage limits so there are no billing surprises.", color: "from-pink-500 to-pink-600" },
  { icon: Lock, title: "Secure Card Storage", description: "Tokenized card storage means you never store raw card data — fully PCI compliant.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Billing Expert Support", description: "Our usage billing specialists help you design the perfect billing model for your product.", color: "from-indigo-500 to-indigo-600" },
];

export default function UsageBasedBilling() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Usage-Based Billing & Metered Payments | EzPay America"
        description="Bill customers based on actual usage — API calls, seats, transactions. Metered billing with zero transaction fees. Hybrid plans and real-time usage tracking. Apply free."
        keywords="usage based billing, metered billing, pay as you go billing, consumption billing, usage billing software, metered payment processing, API usage billing, SaaS usage billing, usage based pricing, overage billing"
        url="https://ezpayamerica.com/UsageBasedBilling"
      />
      <LandingHero
        badge="Usage-Based Billing"
        headline="Charge Customers Based on What They Actually Use"
        subheadline="Metered billing that tracks usage automatically and charges accurately. Build fair, transparent pricing models with zero transaction fees and real-time consumption data."
        bullets={[
          "Track any usage metric automatically",
          "Real-time usage meters & dashboards",
          "Hybrid base + overage billing",
          "Zero transaction fees",
          "Spend alerts for customers"
        ]}
        service="Usage-Based Billing"
      />
      <LandingFeatures title="Flexible Billing for Modern Business Models" subtitle="SaaS, APIs, utilities, and any consumption-based product — we handle the billing." features={features} />
      <LandingCTA headline="Launch Usage-Based Billing Today" subtext="Fair, automated, zero-fee. The usage billing platform your customers will love." service="Usage-Based Billing" />
    </div>
  );
}