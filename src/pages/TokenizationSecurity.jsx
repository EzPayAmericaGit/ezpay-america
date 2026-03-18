import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Lock, Shield, RefreshCw, CreditCard, Code, Zap, Eye, CheckCircle2, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Lock, title: "Card Tokenization", description: "Replace card numbers with unique tokens — raw card data never touches your servers.", color: "from-blue-600 to-blue-800" },
  { icon: Shield, title: "PCI Scope Reduction", description: "Tokenization removes your systems from PCI DSS scope, dramatically reducing compliance cost.", color: "from-green-500 to-green-600" },
  { icon: RefreshCw, title: "Network Tokenization", description: "Visa and Mastercard network tokens that auto-update on card reissue — fewer failed payments.", color: "from-amber-500 to-orange-600" },
  { icon: CreditCard, title: "One-Click Checkout", description: "Customers pay with saved tokens in one click — no re-entering card details ever again.", color: "from-purple-500 to-purple-600" },
  { icon: Code, title: "Token API", description: "Store and retrieve tokens via our API — build secure payment flows into any application.", color: "from-teal-500 to-teal-600" },
  { icon: Zap, title: "Cross-Platform Tokens", description: "Use the same token across in-person, online, and mobile payments for a unified experience.", color: "from-yellow-500 to-amber-600" },
  { icon: Eye, title: "Encrypted Data Vault", description: "All tokens are stored in our AES-256 encrypted vault — the most secure option available.", color: "from-pink-500 to-pink-600" },
  { icon: CheckCircle2, title: "Compliance Certifications", description: "Our tokenization solution is certified PCI DSS Level 1 by a Qualified Security Assessor.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Security Expert Support", description: "Our security team helps you implement tokenization correctly from day one.", color: "from-indigo-500 to-indigo-600" },
];

export default function TokenizationSecurity() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Card Tokenization & Payment Security | EzPay America"
        description="Protect card data with tokenization. PCI scope reduction, network tokens, one-click checkout, encrypted vault. Keep your customers' data safe. Apply free today."
        keywords="card tokenization, payment tokenization, PCI tokenization, protect card data, network tokenization, payment security, credit card vault, token payment processing, PCI compliance tokenization, secure card storage"
        url="https://ezpayamerica.com/TokenizationSecurity"
      />
      <LandingHero
        badge="Tokenization & Card Security"
        headline="Protect Card Data With Tokenization"
        subheadline="Replace card numbers with secure tokens so raw card data never touches your systems. Reduce PCI scope, enable one-click checkout, and protect every customer."
        bullets={[
          "Card data never touches your servers",
          "Dramatically reduce PCI compliance scope",
          "Network tokens auto-update on card reissue",
          "One-click checkout for returning customers",
          "AES-256 encrypted card vault"
        ]}
        service="Tokenization & Security"
      />
      <LandingFeatures title="The Most Secure Way to Store Card Data" subtitle="Tokenization protects your customers and keeps your business out of PCI scope." features={features} />
      <LandingCTA headline="Secure Your Payments With Tokenization" subtext="PCI compliant, AES-256 encrypted, network tokens included. Start protecting card data today." service="Tokenization & Security" />
    </div>
  );
}