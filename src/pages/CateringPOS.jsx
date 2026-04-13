import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Calendar, DollarSign, Smartphone, FileText, Users, CreditCard } from "lucide-react";

const features = [
  {
    icon: Calendar,
    color: "from-amber-500 to-amber-600",
    title: "Event Booking & Deposit Management",
    description: "Book events, collect deposits, and track balance-due payments — all tied to a single client record with full payment history."
  },
  {
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    title: "Quote-to-Invoice Workflow",
    description: "Build quotes, convert to invoices, and collect payment in a seamless flow — no spreadsheets, no manual tracking."
  },
  {
    icon: DollarSign,
    color: "from-green-500 to-green-600",
    title: "Partial Payments & Payment Plans",
    description: "Collect retainers, milestone payments, and final balances on schedule — automatically remind clients when payments are due."
  },
  {
    icon: Smartphone,
    color: "from-purple-500 to-purple-600",
    title: "On-Site Mobile Payments",
    description: "Collect event-day payments or add-ons on the spot with tap-to-pay on your phone — no card reader required."
  },
  {
    icon: Users,
    color: "from-red-500 to-red-600",
    title: "Client & Event CRM",
    description: "Track every client, event detail, dietary requirement, and communication in one place — never drop the ball on a big event."
  },
  {
    icon: CreditCard,
    color: "from-slate-500 to-slate-600",
    title: "Zero Transaction Fees",
    description: "EzPay's cash-discount program means you keep every dollar of your event revenue — no percentage skimmed off every booking."
  }
];

export default function CateringPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Catering Company POS & Payment Processing"
        description="EzPay America's catering payment solution — event deposits, invoicing, payment plans, mobile payments, and zero transaction fees. Built for caterers. Free equipment."
        keywords="catering payment processing, catering company POS, catering invoice software, catering deposit payment, event catering merchant account, catering credit card processing, zero fee catering payments, mobile payment catering, catering event payment system, EzPay catering POS"
        url="https://ezpayamerica.com/CateringPOS"
      />
      <LandingHero
        headline="Catering Payment Processing & POS"
        subheadline="From the first deposit to the final balance — EzPay America gives catering companies a complete payment platform with event invoicing, mobile payments, and zero transaction fees."
        bullets={[
          "Deposit, milestone & final balance payment tracking",
          "Send invoices and collect payment online or on-site",
          "Mobile tap-to-pay for event-day add-ons",
          "Zero transaction fees on every event booking"
        ]}
        service="Catering POS"
      />
      <LandingFeatures
        title="Payment Tools Built for Event-Based Businesses"
        subtitle="Manage every client, event, and dollar — from the first inquiry to the final invoice — in one place."
        features={features}
      />
      <LandingCTA
        headline="Get Paid Faster on Every Event"
        subtext="EzPay America helps catering companies collect deposits faster, eliminate processing fees, and manage every client relationship in one place."
        service="Catering POS"
      />
    </div>
  );
}