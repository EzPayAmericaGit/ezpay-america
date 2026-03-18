import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Monitor, CreditCard, Phone, Shield, Zap, BarChart3, RefreshCw, Lock, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Monitor, title: "Browser-Based Terminal", description: "Accept card payments from any browser — no hardware, no app, just login and charge.", color: "from-amber-500 to-orange-600" },
  { icon: Phone, title: "Accept Phone Orders", description: "Take credit card payments over the phone and process them manually in seconds.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Process every MOTO transaction with zero per-transaction fees — keep all your revenue.", color: "from-green-500 to-green-600" },
  { icon: Shield, title: "MOTO Compliant", description: "Fully compliant mail order / telephone order processing with PCI DSS Level 1 security.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "Instant Processing", description: "Real-time authorization with instant approval or decline — no waiting for batch processing.", color: "from-yellow-500 to-amber-600" },
  { icon: Lock, title: "Tokenization", description: "Store customer cards securely with tokenization — charge repeat customers without re-entering.", color: "from-teal-500 to-teal-600" },
  { icon: BarChart3, title: "Transaction History", description: "Complete searchable transaction history, refunds, and void processing from one dashboard.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Recurring Billing", description: "Set up automatic recurring charges for subscriptions and repeat customers easily.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "24/7 US Support", description: "Our virtual terminal support team is available any time you need assistance.", color: "from-indigo-500 to-indigo-600" },
];

export default function VirtualTerminal() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Virtual Terminal – Accept Payments by Phone & Browser | EzPay America"
        description="Process credit card payments from any browser. Virtual terminal for phone orders, MOTO payments, and manual entry. Zero transaction fees. No hardware needed. Apply free."
        keywords="virtual terminal, virtual payment terminal, MOTO payment processing, phone order payment, accept credit card by phone, browser payment terminal, online virtual terminal, manual card entry, virtual POS, no hardware payment processing"
        url="https://ezpayamerica.com/VirtualTerminal"
      />
      <LandingHero
        badge="Virtual Terminal"
        headline="Accept Card Payments From Any Browser — No Hardware"
        subheadline="Process phone orders, mail orders, and manual card-not-present transactions from any device. No physical terminal needed — just a browser and zero transaction fees."
        bullets={[
          "Accept payments from any browser, anywhere",
          "Perfect for phone orders & MOTO",
          "Zero transaction fees on all transactions",
          "Tokenize cards for repeat customers",
          "Recurring billing built in"
        ]}
        service="Virtual Terminal"
      />
      <LandingFeatures title="The Most Flexible Way to Accept Payments" subtitle="No hardware required. Just login and start processing from anywhere." features={features} />
      <LandingCTA headline="Get Your Virtual Terminal Free Today" subtext="No hardware, no fees, no contracts. Start accepting phone orders in minutes." service="Virtual Terminal" />
    </div>
  );
}