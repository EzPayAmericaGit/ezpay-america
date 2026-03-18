import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { FileText, CreditCard, Mail, Shield, Zap, BarChart3, RefreshCw, Clock, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: FileText, title: "Auto-Generated Invoices", description: "Invoices created and sent automatically on your schedule — daily, weekly, or monthly.", color: "from-amber-500 to-orange-600" },
  { icon: Mail, title: "Automatic Payment Reminders", description: "Overdue reminders sent automatically via email and SMS — no more chasing clients.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Every invoice payment processed with zero fees — keep 100% of what clients owe you.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "One-Click Payment Links", description: "Every invoice includes a payment link so clients can pay instantly from any device.", color: "from-purple-500 to-purple-600" },
  { icon: Shield, title: "Professional Branded Invoices", description: "Custom-branded PDF invoices with your logo, colors, payment terms, and business info.", color: "from-yellow-500 to-amber-600" },
  { icon: BarChart3, title: "Accounts Receivable Tracking", description: "Real-time aging report shows what's paid, pending, and overdue — all in one view.", color: "from-teal-500 to-teal-600" },
  { icon: RefreshCw, title: "Recurring Invoice Templates", description: "Save templates and send identical invoices to the same clients every billing period.", color: "from-pink-500 to-pink-600" },
  { icon: Clock, title: "Multi-Currency Support", description: "Invoice clients in USD, EUR, GBP, CAD, and other major currencies without extra tools.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "QuickBooks & Xero Sync", description: "Automatically sync paid invoices to your accounting software — no manual data entry.", color: "from-indigo-500 to-indigo-600" },
];

export default function AutomatedInvoicing() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Automated Invoicing – Get Paid Faster | EzPay America"
        description="Automate your entire invoicing process. Auto-generate, send, and collect invoices with zero transaction fees. Payment reminders, branded PDFs, QuickBooks sync. Apply free."
        keywords="automated invoicing, invoice automation, automatic invoice, online invoicing software, send invoices automatically, invoice payment reminders, zero fee invoicing, professional invoice software, recurring invoicing, accounts receivable automation"
        url="https://ezpayamerica.com/AutomatedInvoicing"
      />
      <LandingHero
        badge="Automated Invoicing"
        headline="Automate Your Invoicing — Get Paid Faster"
        subheadline="Stop manually creating and sending invoices. EzPay America automates the entire billing cycle — generate, send, remind, and collect — with zero transaction fees."
        bullets={[
          "Auto-generate and send invoices on schedule",
          "Automatic overdue payment reminders",
          "One-click payment links on every invoice",
          "Zero transaction fees on collections",
          "QuickBooks & Xero sync included"
        ]}
        service="Automated Invoicing"
      />
      <LandingFeatures title="The Complete Invoice Automation Solution" subtitle="From freelancers to agencies — automate your billing and get paid on time." features={features} />
      <LandingCTA headline="Automate Invoicing & Get Paid Faster" subtext="Zero fees, automatic reminders, branded invoices. Start automating your billing today." service="Automated Invoicing" />
    </div>
  );
}