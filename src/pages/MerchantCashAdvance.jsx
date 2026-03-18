import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { DollarSign, Zap, Clock, Shield, BarChart3, RefreshCw, CheckCircle2, TrendingUp, Building2 } from "lucide-react";

const features = [
  { icon: DollarSign, title: "Up to $500K Funding", description: "Access working capital from $5,000 to $500,000 based on your monthly processing volume.", color: "from-amber-500 to-orange-600" },
  { icon: Zap, title: "Funding in 24–72 Hours", description: "Get approved and funded fast — no waiting weeks for traditional bank loan approvals.", color: "from-green-500 to-green-600" },
  { icon: BarChart3, title: "Revenue-Based Repayment", description: "Repay a small percentage of daily sales. Pay more on busy days, less on slower days.", color: "from-blue-500 to-blue-600" },
  { icon: Shield, title: "No Collateral Required", description: "Merchant cash advances are unsecured — no personal assets or property on the line.", color: "from-purple-500 to-purple-600" },
  { icon: Clock, title: "Simple Application", description: "Apply in minutes with just 3 months of bank statements. Minimal paperwork, fast decisions.", color: "from-teal-500 to-teal-600" },
  { icon: CheckCircle2, title: "All Credit Types Welcome", description: "We work with business owners of all credit backgrounds including those with past challenges.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Renew & Grow", description: "After repaying 50% of your advance, you may qualify for additional funding to keep growing.", color: "from-yellow-500 to-amber-600" },
  { icon: TrendingUp, title: "Grow Your Business", description: "Use funds for inventory, equipment, staff, marketing, renovations — no restrictions on use.", color: "from-red-500 to-red-600" },
  { icon: Building2, title: "No Bank Required", description: "Approval is based on your sales history, not bank relationships or lengthy credit reviews.", color: "from-indigo-500 to-indigo-600" },
];

export default function MerchantCashAdvance() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Merchant Cash Advance – Fast Business Funding | EzPay America"
        description="Get a merchant cash advance up to $500K in 24–72 hours. Revenue-based repayment, no collateral, all credit types. Fast small business funding. Apply free."
        keywords="merchant cash advance, small business funding, business cash advance, fast business loan, working capital advance, merchant funding, revenue based financing, no collateral business loan, merchant cash advance small business, quick business funding"
        url="https://ezpayamerica.com/MerchantCashAdvance"
      />
      <LandingHero
        badge="Merchant Cash Advance"
        headline="Fast Business Funding — Up to $500K in 72 Hours"
        subheadline="When your business needs capital fast, EzPay America delivers. Get a merchant cash advance based on your sales — no collateral, no lengthy bank process."
        bullets={[
          "Up to $500,000 in working capital",
          "Approved and funded in 24–72 hours",
          "Revenue-based repayment — flexible by design",
          "No collateral required",
          "All credit types considered"
        ]}
        service="Merchant Cash Advance"
      />
      <LandingFeatures
        title="The Fastest Way to Fund Your Business"
        subtitle="Thousands of business owners have grown with EzPay America's merchant cash advance program."
        features={features}
      />
      <LandingCTA
        headline="Get the Funding Your Business Deserves"
        subtext="Apply in minutes, get approved fast, and have capital in your account within days — not weeks."
        service="Merchant Cash Advance"
      />
    </div>
  );
}