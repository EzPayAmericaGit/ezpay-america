import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Link2, CreditCard, Smartphone, Shield, Zap, BarChart3, RefreshCw, Mail, FileText } from "lucide-react";

const features = [
  { icon: Link2, title: "Instant Payment Links", description: "Generate a payment link in seconds and share it via text, email, or social media.", color: "from-amber-500 to-orange-600" },
  { icon: FileText, title: "Professional Invoices", description: "Create branded, itemized invoices with due dates and automatic payment reminders.", color: "from-blue-500 to-blue-600" },
  { icon: Smartphone, title: "Mobile-Optimized Payments", description: "Customers pay instantly from their phone — no app download, no account required.", color: "from-green-500 to-green-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Send unlimited payment links and invoices with zero fees on every payment collected.", color: "from-purple-500 to-purple-600" },
  { icon: Mail, title: "Automated Reminders", description: "Automatic overdue reminders via email and SMS reduce late payments without awkward calls.", color: "from-yellow-500 to-amber-600" },
  { icon: Zap, title: "Get Paid Instantly", description: "Payment links can be paid in 30 seconds — the fastest way to collect from customers.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "Secure Payments", description: "Every link-based payment is protected with PCI DSS encryption and fraud detection.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Recurring Invoice Links", description: "Send repeating invoices and links for subscriptions and ongoing service agreements.", color: "from-red-500 to-red-600" },
  { icon: BarChart3, title: "Payment Tracking", description: "See which invoices are paid, pending, or overdue — all in one real-time dashboard.", color: "from-indigo-500 to-indigo-600" },
];

export default function PaymentLinks() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Payment Links & Invoices – Get Paid Instantly | EzPay America"
        description="Create payment links and professional invoices in seconds. Share via text or email. Zero transaction fees. Automatic reminders. Get paid faster. Apply free today."
        keywords="payment links, payment link generator, online invoicing, send invoice online, get paid online, payment request link, invoice payment, zero fee invoicing, automated invoice reminders, payment link small business, send payment link text email"
        url="https://ezpayamerica.com/PaymentLinks"
      />
      <LandingHero
        badge="Payment Links & Invoices"
        headline="Get Paid in 30 Seconds With a Payment Link"
        subheadline="Create a payment link or invoice in seconds and share it anywhere. Customers pay instantly from their phone — no app, no account, zero transaction fees."
        bullets={[
          "Generate a payment link in seconds",
          "Professional branded invoices",
          "Automatic overdue reminders",
          "Zero transaction fees",
          "Track every payment in real time"
        ]}
        service="Payment Links & Invoices"
      />
      <LandingFeatures title="The Fastest Way to Collect Payments" subtitle="From freelancers to service businesses — get paid faster with payment links and invoices." features={features} />
      <LandingCTA headline="Start Getting Paid Faster Today" subtext="No more chasing payments. Create your first payment link free in under 60 seconds." service="Payment Links & Invoices" />
    </div>
  );
}