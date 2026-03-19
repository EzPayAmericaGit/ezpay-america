import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Lock, Shield, RefreshCw, Database, Key, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Lock,
    color: "from-purple-500 to-purple-600",
    title: "Industry-Leading Tokenization",
    description: "Sensitive card data is instantly replaced with a unique, secure token. Even if intercepted, tokens are completely useless to fraudsters."
  },
  {
    icon: Shield,
    color: "from-blue-500 to-blue-600",
    title: "PCI DSS Level 1 Compliance",
    description: "EzPay's tokenization infrastructure is certified PCI DSS Level 1 — the highest standard in the payments industry. Your customers' data is protected at every layer."
  },
  {
    icon: Database,
    color: "from-amber-500 to-amber-600",
    title: "Secure Card Vault",
    description: "Store customer payment credentials in EzPay's encrypted vault for one-click future purchases, subscriptions, and repeat billing — without ever touching raw card data."
  },
  {
    icon: Key,
    color: "from-green-500 to-green-600",
    title: "Network Tokenization",
    description: "Direct integration with Visa and Mastercard network tokenization provides an additional layer of authentication and reduces interchange costs on eligible transactions."
  },
  {
    icon: RefreshCw,
    color: "from-pink-500 to-pink-600",
    title: "Token Portability",
    description: "Tokens are processor-agnostic and portable, so you can switch processors in the future without losing stored customer credentials or recurring billing relationships."
  },
  {
    icon: CheckCircle,
    color: "from-slate-500 to-slate-600",
    title: "Reduced PCI Scope",
    description: "Because raw card data never touches your systems, your PCI compliance scope is dramatically reduced — saving thousands in annual audit and compliance costs."
  }
];

export default function GatewayTokenization() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Payment Tokenization & Card Security"
        description="EzPay America's payment tokenization replaces sensitive card data with secure tokens, ensuring PCI DSS Level 1 compliance and protecting every transaction. Zero extra fees."
        keywords="payment tokenization, card tokenization, PCI DSS compliance, secure card vault, network tokenization, payment security, credit card tokenization, PCI compliant payment processing, reduce PCI scope, token vault payment"
        url="https://ezpayamerica.com/GatewayTokenization"
      />
      <LandingHero
        headline="Payment Tokenization & Card Security"
        subheadline="EzPay America's advanced tokenization replaces raw card data with secure, meaningless tokens — keeping your customers protected and your business PCI compliant automatically."
        bullets={[
          "PCI DSS Level 1 certified — the industry's highest standard",
          "Secure card vault for subscriptions and repeat billing",
          "Network tokenization via Visa & Mastercard",
          "Dramatically reduces your PCI compliance scope and cost"
        ]}
        service="Tokenization & Security"
      />
      <LandingFeatures
        title="Next-Level Card Security for Every Merchant"
        subtitle="Tokenization isn't just for enterprise — every EzPay merchant gets bank-grade card security built in from day one."
        features={features}
      />
      <LandingCTA
        headline="Protect Your Customers. Protect Your Business."
        subtext="EzPay America's tokenization and security infrastructure is included with every gateway account — no setup fees, no extra charge."
        service="Tokenization & Security"
      />
    </div>
  );
}