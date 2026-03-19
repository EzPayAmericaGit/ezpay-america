import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { BarChart2, Download, Bell, Globe, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: BarChart2,
    color: "from-cyan-500 to-cyan-600",
    title: "Real-Time Transaction Dashboard",
    description: "See every payment the moment it happens — transaction amounts, card types, approval status, and funding timelines — all in one clean dashboard."
  },
  {
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
    title: "Sales Trends & Revenue Analytics",
    description: "Visualize daily, weekly, and monthly sales trends. Identify your busiest periods, best-selling items, and revenue growth patterns at a glance."
  },
  {
    icon: Download,
    color: "from-amber-500 to-amber-600",
    title: "Batch & Settlement Reports",
    description: "Download detailed batch reports and settlement summaries for reconciliation, accounting, and tax preparation — formatted for every major accounting platform."
  },
  {
    icon: Bell,
    color: "from-blue-500 to-blue-600",
    title: "Automated Report Delivery",
    description: "Schedule daily, weekly, or monthly reports to be automatically emailed to you or your accountant — never miss a reconciliation deadline again."
  },
  {
    icon: Globe,
    color: "from-purple-500 to-purple-600",
    title: "Multi-Location Reporting",
    description: "Manage and compare performance across all your locations from a single login. Roll up totals or drill into individual location data instantly."
  },
  {
    icon: Shield,
    color: "from-slate-500 to-slate-600",
    title: "Chargeback & Dispute Tracking",
    description: "Monitor all open chargebacks and disputes in real time. Access transaction evidence, respond to disputes, and track resolution status — all in one place."
  }
];

export default function GatewayReporting() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Payment Reporting & Analytics Dashboard"
        description="Get real-time payment reporting and analytics with EzPay America's gateway dashboard. Transaction reports, batch settlements, multi-location data, chargeback tracking. Zero fees."
        keywords="payment reporting dashboard, transaction analytics, real-time payment reports, batch settlement report, multi-location payment reporting, chargeback tracking, sales analytics payment, EzPay reporting, payment reconciliation, merchant analytics dashboard"
        url="https://ezpayamerica.com/GatewayReporting"
      />
      <LandingHero
        headline="Real-Time Payment Reporting & Analytics"
        subheadline="Know exactly where your money is at all times. EzPay America's reporting dashboard gives you complete visibility into every transaction, settlement, and trend — in real time."
        bullets={[
          "Live transaction dashboard — see payments as they happen",
          "Automated batch reports delivered to your inbox",
          "Multi-location roll-up reporting from one login",
          "Chargeback and dispute tracking built in"
        ]}
        service="Reporting & Analytics"
      />
      <LandingFeatures
        title="Complete Payment Visibility, Zero Guesswork"
        subtitle="Make smarter business decisions with data you can actually use — not buried in spreadsheets."
        features={features}
      />
      <LandingCTA
        headline="See Every Dollar, Every Day"
        subtext="EzPay America's full reporting suite is included with every gateway account at no extra cost — start with complete visibility from day one."
        service="Reporting & Analytics"
      />
    </div>
  );
}