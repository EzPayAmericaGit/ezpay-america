import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Shield, Eye, Lock, Zap, AlertTriangle, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Shield,
    color: "from-red-500 to-red-600",
    title: "Real-Time Fraud Scoring",
    description: "Every transaction is scored in milliseconds using hundreds of risk signals — device fingerprinting, behavioral analysis, and network intelligence."
  },
  {
    icon: Eye,
    color: "from-amber-500 to-amber-600",
    title: "Velocity Filters",
    description: "Automatically block suspicious transaction patterns such as rapid-fire attempts, card testing, and unusual frequency spikes before they cost you money."
  },
  {
    icon: Lock,
    color: "from-blue-500 to-blue-600",
    title: "AVS & CVV Verification",
    description: "Address Verification System and CVV matching stop card-not-present fraud at the source, protecting every online and phone transaction."
  },
  {
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    title: "3D Secure Authentication",
    description: "Shift chargeback liability away from your business with 3DS2 authentication — frictionless for good customers, a wall for fraudsters."
  },
  {
    icon: AlertTriangle,
    color: "from-orange-500 to-orange-600",
    title: "IP & Device Screening",
    description: "Block transactions originating from flagged IP ranges, VPNs, TOR exit nodes, and known fraud hotspots worldwide."
  },
  {
    icon: CheckCircle,
    color: "from-green-500 to-green-600",
    title: "BIN & Card Type Controls",
    description: "Set custom rules to block or review specific card BINs, international cards, prepaid cards, or any card category that poses risk to your business."
  }
];

export default function GatewayFraudProtection() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Payment Fraud Protection & Chargeback Prevention | EzPay America"
        description="Enterprise-grade fraud detection built into every EzPay account: velocity filters, 3D Secure, AVS & CVV verification, IP screening, real-time scoring. Chargeback liability shifted away from you."
        keywords="payment fraud protection, fraud detection payment gateway, 3D Secure payment processing, AVS CVV verification, chargeback prevention, velocity filter payment, fraud prevention small business, EzPay fraud protection, real-time fraud scoring, BIN blocking payment"
        url="https://ezpayamerica.com/GatewayFraudProtection"
      />
      <LandingHero
        headline="Built-In Payment Fraud Protection"
        subheadline="Every EzPay transaction is protected by enterprise-grade fraud detection — velocity filters, 3D Secure, real-time scoring, and chargeback liability shifting. All included, no extra cost."
        bullets={[
          "Real-time fraud scoring on every transaction",
          "3D Secure shifts chargeback liability away from you",
          "Velocity filters block card testing and rapid-fire attacks",
          "AVS, CVV, IP, and BIN screening — all layers active"
        ]}
        service="Fraud Protection"
      />
      <LandingFeatures
        title="Multi-Layer Fraud Defense"
        subtitle="No single filter catches every threat. EzPay stacks multiple defense layers so fraudsters can't find a way through."
        features={features}
      />
      <LandingCTA
        headline="Stop Fraud Before It Hits Your Account"
        subtext="EzPay America's fraud protection tools are built into every gateway account — no add-on fees, no configuration required."
        service="Fraud Protection"
      />
    </div>
  );
}