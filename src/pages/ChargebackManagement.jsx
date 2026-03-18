import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Shield, AlertTriangle, FileText, Zap, BarChart3, RefreshCw, CheckCircle2, Eye, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: AlertTriangle, title: "Chargeback Alerts", description: "Get real-time alerts the moment a chargeback is filed so you can respond immediately.", color: "from-red-500 to-red-600" },
  { icon: FileText, title: "Automated Dispute Evidence", description: "Automatically compile transaction data, receipts, and delivery evidence for dispute submissions.", color: "from-amber-500 to-orange-600" },
  { icon: Shield, title: "Pre-Dispute Resolution", description: "Resolve disputes directly with card issuers before they escalate to formal chargebacks.", color: "from-blue-500 to-blue-600" },
  { icon: Zap, title: "Fast Response Workflow", description: "Guided dispute response workflow ensures you submit compelling evidence before deadlines.", color: "from-green-500 to-green-600" },
  { icon: BarChart3, title: "Chargeback Analytics", description: "Track dispute win rates, reasons, and trends to identify and fix root causes.", color: "from-purple-500 to-purple-600" },
  { icon: Eye, title: "Order Insight", description: "Correlate dispute patterns with specific products, channels, or customer segments.", color: "from-teal-500 to-teal-600" },
  { icon: RefreshCw, title: "Representment Service", description: "Our chargeback specialists represent your case to maximize win rates on disputes.", color: "from-yellow-500 to-amber-600" },
  { icon: CheckCircle2, title: "Ratio Monitoring", description: "Monitor your chargeback ratio and receive alerts before you approach card network thresholds.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "Dedicated Dispute Team", description: "Work with our dedicated chargeback specialists for complex or high-value disputes.", color: "from-indigo-500 to-indigo-600" },
];

export default function ChargebackManagement() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Chargeback Management & Dispute Resolution | EzPay America"
        description="Fight and win chargebacks with automated evidence, real-time alerts, and expert dispute representation. Protect your merchant account and revenue. Apply free today."
        keywords="chargeback management, dispute resolution, chargeback protection, fight chargebacks, chargeback prevention, merchant dispute service, chargeback alerts, chargeback representment, reduce chargebacks, payment dispute management"
        url="https://ezpayamerica.com/ChargebackManagement"
      />
      <LandingHero
        badge="Chargeback Management"
        headline="Win More Chargebacks & Protect Your Revenue"
        subheadline="Real-time chargeback alerts, automated evidence compilation, and expert dispute representation. Protect your merchant account and recover revenue you deserve."
        bullets={[
          "Real-time chargeback alerts",
          "Automated evidence compilation",
          "Pre-dispute resolution before escalation",
          "Expert representment service",
          "Chargeback ratio monitoring"
        ]}
        service="Chargeback Management"
      />
      <LandingFeatures title="Complete Chargeback Protection for Merchants" subtitle="From alert to resolution — we handle every stage of the dispute process." features={features} />
      <LandingCTA headline="Stop Losing Revenue to Chargebacks" subtext="Real-time alerts, automated evidence, expert representation. Start protecting your revenue today." service="Chargeback Management" />
    </div>
  );
}