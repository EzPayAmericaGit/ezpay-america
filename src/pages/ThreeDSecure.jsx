import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Shield, Lock, Zap, CheckCircle2, BarChart3, RefreshCw, Eye, Code, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Shield, title: "3D Secure 2.0", description: "The latest 3DS2 standard with frictionless authentication for low-risk transactions.", color: "from-blue-600 to-blue-800" },
  { icon: Lock, title: "Liability Shift", description: "Authenticated transactions shift fraud liability to the card issuer — protect your revenue.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Frictionless Flow", description: "Low-risk transactions are authenticated silently — customers don't even know it happened.", color: "from-amber-500 to-orange-600" },
  { icon: CheckCircle2, title: "Reduced False Declines", description: "3DS2 risk-based authentication reduces false declines and improves approval rates.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Authentication Analytics", description: "Track authentication rates, challenge rates, and approval rates in real time.", color: "from-teal-500 to-teal-600" },
  { icon: RefreshCw, title: "All Card Networks", description: "Supports Visa Secure, Mastercard Identity Check, Amex SafeKey, and Discover ProtectBuy.", color: "from-yellow-500 to-amber-600" },
  { icon: Eye, title: "Risk-Based Rules", description: "Configure when to challenge vs authenticate silently based on your risk tolerance.", color: "from-pink-500 to-pink-600" },
  { icon: Code, title: "API Integration", description: "Add 3D Secure to any payment flow with a few lines of code in our developer SDK.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "3DS Expert Support", description: "Our team helps you implement and optimize 3D Secure for your specific business model.", color: "from-indigo-500 to-indigo-600" },
];

export default function ThreeDSecure() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="3D Secure Authentication for Online Payments | EzPay America"
        description="3D Secure 2.0 authentication with liability shift, frictionless flow, and reduced false declines. Protect online payments and shift fraud liability. Apply free today."
        keywords="3D secure authentication, 3DS2, 3D secure payment, Verified by Visa, Mastercard Identity Check, liability shift payments, online payment authentication, fraud liability shift, 3D secure integration, secure online checkout authentication"
        url="https://ezpayamerica.com/ThreeDSecure"
      />
      <LandingHero
        badge="3D Secure Authentication"
        headline="3D Secure 2.0 — Shift Fraud Liability to the Bank"
        subheadline="Protect online payments with 3D Secure authentication. Low-risk transactions pass silently, fraud liability shifts to the card issuer, and false declines drop significantly."
        bullets={[
          "3DS2 frictionless authentication",
          "Fraud liability shifts to issuing bank",
          "Supports all major card networks",
          "Reduces false declines, improves approvals",
          "Easy API integration"
        ]}
        service="3D Secure Authentication"
      />
      <LandingFeatures title="The Gold Standard in Online Payment Security" subtitle="3DS2 protects your business, reduces fraud, and improves the checkout experience." features={features} />
      <LandingCTA headline="Add 3D Secure to Your Payments Today" subtext="Liability shift, frictionless flow, improved approvals. The most important security layer for online payments." service="3D Secure Authentication" />
    </div>
  );
}