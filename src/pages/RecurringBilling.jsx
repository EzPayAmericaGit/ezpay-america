import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { RefreshCw, CreditCard, BarChart3, Shield, Zap, Mail, Lock, DollarSign, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: RefreshCw, title: "Automated Recurring Billing", description: "Set it and forget it — automatic charges run on your schedule without any manual work.", color: "from-amber-500 to-orange-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Every recurring charge processed with zero transaction fees — maximizing subscription revenue.", color: "from-blue-500 to-blue-600" },
  { icon: DollarSign, title: "Flexible Billing Cycles", description: "Weekly, monthly, quarterly, annual — set any billing cycle that works for your business.", color: "from-green-500 to-green-600" },
  { icon: Lock, title: "Card Tokenization", description: "Securely store and charge cards without handling raw card data — PCI compliant by design.", color: "from-purple-500 to-purple-600" },
  { icon: Mail, title: "Automated Failed Payment Retry", description: "Smart dunning logic automatically retries failed payments and sends recovery emails.", color: "from-yellow-500 to-amber-600" },
  { icon: Zap, title: "Proration & Upgrades", description: "Handle plan upgrades, downgrades, and proration automatically mid-billing cycle.", color: "from-teal-500 to-teal-600" },
  { icon: BarChart3, title: "MRR & Churn Analytics", description: "Track monthly recurring revenue, churn rate, and lifetime value from your dashboard.", color: "from-pink-500 to-pink-600" },
  { icon: Shield, title: "Dunning Management", description: "Reduce involuntary churn with smart retry schedules and customer notification emails.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "24/7 Billing Support", description: "Our billing specialists are available around the clock for any subscription issue.", color: "from-indigo-500 to-indigo-600" },
];

export default function RecurringBilling() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Recurring Billing & Subscription Management | EzPay America"
        description="Automate recurring billing and subscription payments with zero transaction fees. Smart dunning, flexible cycles, MRR analytics. Best recurring billing for small business."
        keywords="recurring billing, subscription billing, automated billing, recurring payment processing, subscription management, recurring billing software, SaaS billing, membership billing, automatic invoice billing, zero fee recurring billing, subscription payment gateway"
        url="https://ezpayamerica.com/RecurringBilling"
      />
      <LandingHero
        badge="Recurring Billing & Subscriptions"
        headline="Automate Your Recurring Revenue — Zero Fees"
        subheadline="Set up subscription billing once and collect automatically. Weekly, monthly, or annual cycles with smart dunning, zero transaction fees, and MRR analytics."
        bullets={[
          "Fully automated recurring charges",
          "Zero transaction fees on all billing",
          "Smart failed payment retry (dunning)",
          "MRR, churn & LTV dashboard",
          "Flexible billing cycles"
        ]}
        service="Recurring Billing"
      />
      <LandingFeatures title="Build Predictable Revenue With Recurring Billing" subtitle="The complete recurring billing solution — automated, secure, and zero-fee." features={features} />
      <LandingCTA headline="Automate Your Billing — Start Free" subtext="Zero fees, smart dunning, MRR analytics. The best recurring billing platform for your business." service="Recurring Billing" />
    </div>
  );
}