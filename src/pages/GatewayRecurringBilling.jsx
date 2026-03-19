import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Repeat, Calendar, Bell, RefreshCw, CreditCard, Shield } from "lucide-react";

const features = [
  {
    icon: Repeat,
    color: "from-green-500 to-green-600",
    title: "Automated Recurring Payments",
    description: "Set up fully automated billing cycles — weekly, monthly, quarterly, or custom — with zero manual intervention required each period."
  },
  {
    icon: Calendar,
    color: "from-amber-500 to-amber-600",
    title: "Flexible Billing Schedules",
    description: "Create installment plans, subscription tiers, or custom payment intervals that match your business model and your customers' needs."
  },
  {
    icon: Bell,
    color: "from-blue-500 to-blue-600",
    title: "Smart Payment Reminders",
    description: "Automated pre-billing notifications and failed payment alerts keep your revenue flowing and reduce involuntary churn."
  },
  {
    icon: RefreshCw,
    color: "from-purple-500 to-purple-600",
    title: "Automatic Retry Logic",
    description: "Intelligent retry scheduling for failed payments dramatically reduces lost revenue from declined cards and insufficient funds."
  },
  {
    icon: CreditCard,
    color: "from-pink-500 to-pink-600",
    title: "Card Updater Service",
    description: "Automatically update expired or replaced card numbers to prevent subscription cancellations without any action from your customers."
  },
  {
    icon: Shield,
    color: "from-slate-500 to-slate-600",
    title: "Secure Tokenized Vaulting",
    description: "Customer card data is tokenized and stored securely — never on your servers — keeping every recurring transaction PCI DSS compliant."
  }
];

export default function GatewayRecurringBilling() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Recurring Billing & Subscription Payments"
        description="Automate recurring billing and subscription payments with EzPay America's gateway. Installment plans, smart retries, card updater, and PCI-compliant tokenization. Zero setup fees."
        keywords="recurring billing gateway, subscription payment processing, automated billing, installment payments, card updater service, failed payment retry, recurring payments small business, subscription billing EzPay, no fee recurring billing, PCI compliant recurring payments"
        url="https://ezpayamerica.com/GatewayRecurringBilling"
      />
      <LandingHero
        headline="Recurring Billing & Subscription Payments"
        subheadline="Set it and collect it. EzPay America's automated recurring billing eliminates manual invoicing, reduces churn, and keeps your revenue growing on autopilot."
        bullets={[
          "Fully automated billing — weekly, monthly, or custom schedules",
          "Intelligent retry logic to recover failed payments",
          "Card Updater Service prevents expired-card cancellations",
          "Zero setup fees, no contracts"
        ]}
        service="Recurring Billing"
      />
      <LandingFeatures
        title="Everything You Need for Recurring Revenue"
        subtitle="From simple monthly subscriptions to complex installment plans — EzPay handles it all automatically."
        features={features}
      />
      <LandingCTA
        headline="Start Automating Your Billing Today"
        subtext="Join thousands of EzPay merchants who've eliminated manual invoicing and boosted cash flow with automated recurring billing."
        service="Recurring Billing"
      />
    </div>
  );
}