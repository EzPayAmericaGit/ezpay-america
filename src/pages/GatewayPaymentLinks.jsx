import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Zap, Smartphone, Link, DollarSign, BarChart2, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    title: "Instant Link Generation",
    description: "Generate a branded, secure payment link in seconds from your EzPay dashboard — no coding, no developer, no delay."
  },
  {
    icon: Smartphone,
    color: "from-blue-500 to-blue-600",
    title: "Send via Text or Email",
    description: "Deliver payment links instantly via SMS text or email. Customers click once and pay — no app download or account creation needed."
  },
  {
    icon: DollarSign,
    color: "from-green-500 to-green-600",
    title: "Set Any Amount or Let Customers Choose",
    description: "Lock in a specific invoice amount or allow customers to enter their own — perfect for donations, tips, deposits, and variable billing."
  },
  {
    icon: Link,
    color: "from-amber-500 to-amber-600",
    title: "Branded Payment Pages",
    description: "Every payment link opens a clean, mobile-optimized checkout page with your business name and branding — not a generic third-party page."
  },
  {
    icon: BarChart2,
    color: "from-purple-500 to-purple-600",
    title: "Real-Time Payment Notifications",
    description: "Get instant alerts the moment a payment link is paid. No more waiting or following up — you know exactly when money is on its way."
  },
  {
    icon: Shield,
    color: "from-slate-500 to-slate-600",
    title: "Secure & PCI Compliant",
    description: "Every payment link uses TLS encryption and EzPay's PCI-compliant tokenization — the same security protecting millions of transactions."
  }
];

export default function GatewayPaymentLinks() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Payment Links – Get Paid by Text or Email | EzPay America"
        description="Send secure, branded payment links via text or email in seconds. Customers pay instantly from any device. Perfect for invoices, phone orders, and deposits. No terminal needed. Zero setup fees."
        keywords="payment links, send payment link via text, payment link via email, instant payment link, branded payment link, invoice payment link, no terminal payment, text to pay, virtual payment link, EzPay payment links, small business payment link"
        url="https://ezpayamerica.com/GatewayPaymentLinks"
      />
      <LandingHero
        headline="Instant Payment Links — Get Paid Anywhere"
        subheadline="No terminal? No problem. EzPay America lets you send a secure, branded payment link via text or email in seconds — and collect payment instantly from any device."
        bullets={[
          "Generate and send payment links in under 60 seconds",
          "Works via text, email, or any messaging app",
          "Branded checkout page — your business name, not ours",
          "Real-time notification the moment you're paid"
        ]}
        service="Payment Links"
      />
      <LandingFeatures
        title="The Fastest Way to Collect Payment"
        subtitle="Turn any phone call, invoice, or remote order into a completed payment — no hardware, no hassle."
        features={features}
      />
      <LandingCTA
        headline="Start Getting Paid Without a Terminal"
        subtext="EzPay America payment links are included with every gateway account — ready to use from day one, zero extra cost."
        service="Payment Links"
      />
    </div>
  );
}