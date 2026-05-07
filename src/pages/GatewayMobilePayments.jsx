import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Smartphone, Zap, Globe, CreditCard, Shield, BarChart2 } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    color: "from-pink-500 to-pink-600",
    title: "Tap-to-Pay on Any Smartphone",
    description: "Accept contactless payments directly on your iOS or Android device using NFC — no card reader required. Certified and compliant right out of the box."
  },
  {
    icon: CreditCard,
    color: "from-amber-500 to-amber-600",
    title: "Apple Pay & Google Pay",
    description: "Accept digital wallet payments from Apple Pay, Google Pay, and Samsung Pay — the fast, secure payment methods your customers already prefer."
  },
  {
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    title: "Instant Transaction Processing",
    description: "Mobile transactions process in real time with the same speed and reliability as a countertop terminal — no lag, no dropped connections."
  },
  {
    icon: Globe,
    color: "from-blue-500 to-blue-600",
    title: "Works Anywhere with Cell or Wi-Fi",
    description: "Process payments at markets, events, delivery stops, job sites, or trade shows — anywhere you have a phone signal or internet connection."
  },
  {
    icon: Shield,
    color: "from-purple-500 to-purple-600",
    title: "End-to-End Encryption",
    description: "Every mobile transaction is encrypted and tokenized from the moment of tap to final settlement — fully PCI DSS compliant at every step."
  },
  {
    icon: BarChart2,
    color: "from-green-500 to-green-600",
    title: "Unified Reporting Across All Channels",
    description: "Mobile payments flow into the same EzPay dashboard as your in-store and online transactions — one view of all your revenue, always."
  }
];

export default function GatewayMobilePayments() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Mobile Payments & Tap-to-Pay – Accept Cards on Any Phone | EzPay America"
        description="Accept contactless tap-to-pay on any iPhone or Android — no card reader required. Supports Apple Pay, Google Pay & Samsung Pay. Works on cell or Wi-Fi. Zero setup fees."
        keywords="mobile payment processing, tap to pay smartphone, NFC payment processing, Apple Pay merchant, Google Pay merchant, contactless payment small business, mobile payment terminal, accept payments on phone, EzPay mobile payments, tap to pay no reader"
        url="https://ezpayamerica.com/GatewayMobilePayments"
      />
      <LandingHero
        headline="Mobile & Tap-to-Pay Payments"
        subheadline="Turn any smartphone into a certified payment terminal. EzPay America's tap-to-pay technology lets you accept contactless payments anywhere — no card reader, no extra hardware."
        bullets={[
          "Tap-to-pay on iOS & Android — no hardware needed",
          "Accepts Apple Pay, Google Pay & Samsung Pay",
          "Works anywhere with cell signal or Wi-Fi",
          "Same-day and next-day funding available"
        ]}
        service="Mobile Payments"
      />
      <LandingFeatures
        title="The Future of On-the-Go Payments"
        subtitle="Perfect for food trucks, delivery services, markets, events, contractors, and any business that moves."
        features={features}
      />
      <LandingCTA
        headline="Accept Payments Anywhere You Do Business"
        subtext="EzPay America mobile payments are available on every gateway account — start accepting contactless payments today with zero setup fees."
        service="Mobile Payments"
      />
    </div>
  );
}