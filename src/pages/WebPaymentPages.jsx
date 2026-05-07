import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Globe, CreditCard, Shield, Zap, Lock, BarChart3, Smartphone, RefreshCw, Code } from "lucide-react";

const features = [
  { icon: Globe, title: "Custom Payment Pages", description: "Branded online payment pages that match your business — no coding required, live in minutes.", color: "from-amber-500 to-orange-600" },
  { icon: CreditCard, title: "Accept All Cards Online", description: "Visa, Mastercard, Amex, Discover, and digital wallets like Apple Pay and Google Pay.", color: "from-blue-500 to-blue-600" },
  { icon: Lock, title: "Secure SSL Checkout", description: "PCI-DSS Level 1 compliant checkout pages with 256-bit SSL encryption on every transaction.", color: "from-green-500 to-green-600" },
  { icon: RefreshCw, title: "Recurring Billing", description: "Automate subscriptions and recurring payments for memberships, services, and retainers.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "Instant Payment Links", description: "Send payment links via text or email — customers pay instantly from any device.", color: "from-yellow-500 to-amber-600" },
  { icon: BarChart3, title: "Real-Time Transaction Data", description: "Monitor every payment, refund, and chargeback from a single cloud-based dashboard.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Mobile-Optimized", description: "Payment pages look and work perfectly on phones, tablets, and desktops.", color: "from-pink-500 to-pink-600" },
  { icon: Code, title: "API & Embed Ready", description: "Integrate our payment processing into your existing website or app with our simple API.", color: "from-red-500 to-red-600" },
  { icon: Shield, title: "Fraud Protection", description: "Advanced fraud detection and 3D Secure authentication protect you and your customers.", color: "from-indigo-500 to-indigo-600" },
];

export default function WebPaymentPages() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Online Payment Pages & Payment Links for Small Business | EzPay America"
        description="Custom branded payment pages live in minutes. Accept all credit cards online, send payment links via text/email, set up recurring billing — zero transaction fees, no coding required. Apply free."
        keywords="web payment page, online payment processing, online credit card processing, payment link, recurring billing online, e-commerce payment gateway, secure online payments, virtual payment page, hosted payment page, online merchant services, accept payments online"
        url="https://ezpayamerica.com/WebPaymentPages"
      />
      <LandingHero
        badge="Online Payment Solutions"
        headline="Accept Payments Online — No Website Required"
        subheadline="Get a branded, secure payment page live in minutes. Accept credit cards, set up recurring billing, and send payment links — all with zero transaction fees."
        bullets={[
          "Custom payment page live in minutes",
          "Zero transaction fees online",
          "Recurring billing & subscriptions",
          "Send payment links via text/email",
          "Mobile-optimized for all devices"
        ]}
        service="Web Payment Pages"
      />
      <LandingFeatures
        title="The Easiest Way to Accept Payments Online"
        subtitle="From freelancers to full e-commerce stores, EzPay America makes online payments simple."
        features={features}
      />
      <LandingCTA
        headline="Start Accepting Payments Online Today"
        subtext="Get your custom payment page set up in minutes — free, with no monthly fees and no contract."
        service="Web Payment Pages"
      />
    </div>
  );
}