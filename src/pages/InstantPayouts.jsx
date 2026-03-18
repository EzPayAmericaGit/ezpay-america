import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Zap, DollarSign, Clock, Shield, Smartphone, BarChart3, RefreshCw, CreditCard, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Zap, title: "Instant Bank Deposits", description: "Get your money in your bank account within minutes of each sale — not days.", color: "from-amber-500 to-orange-600" },
  { icon: Clock, title: "Same-Day ACH", description: "Standard same-day ACH transfers so your funds arrive by end of business every day.", color: "from-blue-500 to-blue-600" },
  { icon: DollarSign, title: "Zero Payout Fees", description: "No fees to access your money. Instant payouts are included with your merchant account.", color: "from-green-500 to-green-600" },
  { icon: Smartphone, title: "Mobile Payout Tracking", description: "See real-time deposit status and expected payout amounts from your phone.", color: "from-purple-500 to-purple-600" },
  { icon: Shield, title: "Secure Transfers", description: "Bank-grade encryption and ACH verification on every payout to your account.", color: "from-teal-500 to-teal-600" },
  { icon: BarChart3, title: "Cash Flow Analytics", description: "Daily, weekly, and monthly payout summaries help you plan and manage cash flow.", color: "from-yellow-500 to-amber-600" },
  { icon: RefreshCw, title: "Split Deposits", description: "Automatically split deposits across multiple bank accounts or business entities.", color: "from-pink-500 to-pink-600" },
  { icon: CreditCard, title: "All Card Types Included", description: "Instant payouts apply to all Visa, Mastercard, Amex, and Discover transactions.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Banking Support", description: "Our team is available to help with any payout questions or banking setup issues.", color: "from-indigo-500 to-indigo-600" },
];

export default function InstantPayouts() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Instant Payouts & Same-Day Deposits | EzPay America"
        description="Get paid instantly with same-day ACH deposits and instant bank transfers. Zero payout fees. Access your money minutes after every sale. Apply free today."
        keywords="instant payouts, same day deposits, instant bank transfer merchant, fast merchant deposits, next day funding payment processor, instant ACH payout, same day ACH merchant, get paid instantly, fast merchant payout, instant settlement"
        url="https://ezpayamerica.com/InstantPayouts"
      />
      <LandingHero
        badge="Instant Payouts"
        headline="Get Your Money Faster — Same-Day Deposits"
        subheadline="Stop waiting 2–3 days for your money. EzPay America offers same-day ACH deposits and instant bank transfers with zero payout fees — your money, when you need it."
        bullets={[
          "Same-day ACH deposits every business day",
          "Instant bank transfers in minutes",
          "Zero payout fees — ever",
          "Real-time deposit tracking on mobile",
          "Cash flow analytics included"
        ]}
        service="Instant Payouts"
      />
      <LandingFeatures title="Access Your Money When You Earn It" subtitle="Same-day deposits, instant transfers, zero fees — the fastest payouts in the industry." features={features} />
      <LandingCTA headline="Get Same-Day Deposits Starting Today" subtext="Zero payout fees, instant transfers, mobile tracking. Stop waiting for your money." service="Instant Payouts" />
    </div>
  );
}