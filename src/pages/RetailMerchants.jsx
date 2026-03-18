import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Store, CreditCard, Shield, Clock, Zap, BarChart3, Smartphone, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Keep 100% of every sale. No per-transaction fees, no monthly processing fees, no surprises.", color: "from-amber-500 to-orange-600" },
  { icon: Store, title: "Free POS Equipment", description: "State-of-the-art terminals, barcode scanners, and receipt printers at absolutely no cost to you.", color: "from-blue-500 to-blue-600" },
  { icon: Shield, title: "PCI-Compliant Security", description: "Bank-grade encryption and fraud protection keep every transaction secure and your customers safe.", color: "from-green-500 to-green-600" },
  { icon: Clock, title: "Approved in 24–48 Hours", description: "Our streamlined onboarding gets your retail store accepting payments fast — no lengthy paperwork.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "All Payment Types", description: "Accept Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, and contactless tap-to-pay.", color: "from-yellow-500 to-amber-600" },
  { icon: BarChart3, title: "Real-Time Reporting", description: "Track sales, inventory, and trends from any device with our cloud-based analytics dashboard.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Mobile Management", description: "Manage your retail store and view transactions from your phone anytime, anywhere.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "24/7 US-Based Support", description: "Real humans, not bots. Our support team is available around the clock to help your business.", color: "from-red-500 to-red-600" },
  { icon: Shield, title: "No Long-Term Contracts", description: "Month-to-month flexibility with no cancellation fees. We earn your business every single month.", color: "from-indigo-500 to-indigo-600" },
];

export default function RetailMerchants() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Retail Payment Processing – Zero Fees | EzPay America"
        description="Best payment processor for retail stores. Zero transaction fees, free POS equipment, no contracts. Accept all payments. Apply in minutes. (865) 316-9625."
        keywords="retail payment processing, retail merchant services, store credit card processing, retail POS system, boutique payment solutions, zero fee retail processing, free POS equipment retail, best payment processor retail store, no fee credit card processing retail, retail merchant account"
        url="https://ezpayamerica.com/RetailMerchants"
      />
      <LandingHero
        badge="Retail Merchant Solutions"
        headline="Zero-Fee Payment Processing for Retail Stores"
        subheadline="Stop paying transaction fees on every sale. EzPay America gives retail merchants free equipment, zero fees, and same-day deposits — with no contracts."
        bullets={[
          "$0 transaction fees — keep every dollar you earn",
          "Free terminals, scanners & receipt printers",
          "Accept Apple Pay, Google Pay & all major cards",
          "No contracts, cancel anytime",
          "Approved & processing in 24–48 hours"
        ]}
        service="Retail Merchant Services"
      />
      <LandingFeatures
        title="Everything Your Retail Store Needs"
        subtitle="From boutiques to grocery stores, EzPay America powers retail businesses across the USA."
        features={features}
      />
      <LandingCTA
        headline="Ready to Stop Paying Credit Card Fees?"
        subtext="Join hundreds of retail merchants who eliminated processing fees and grew their bottom line with EzPay America."
        service="Retail Merchant Services"
      />
    </div>
  );
}