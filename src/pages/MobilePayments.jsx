import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Smartphone, CreditCard, Wifi, Shield, Zap, BarChart3, RefreshCw, MapPin, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Smartphone, title: "Tap-to-Pay Anywhere", description: "Accept contactless payments from any NFC-enabled device — iPhone, Android, Apple Watch.", color: "from-amber-500 to-orange-600" },
  { icon: Wifi, title: "Works on 4G & WiFi", description: "Process mobile payments over cellular data or WiFi — never miss a sale wherever you are.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Keep every dollar from every mobile payment — zero processing fees always.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Instant Approval", description: "3-second tap-to-pay transactions keep lines moving at markets, events, and pop-ups.", color: "from-purple-500 to-purple-600" },
  { icon: Shield, title: "Secure NFC Processing", description: "End-to-end encrypted NFC transactions — as secure as any countertop terminal.", color: "from-teal-500 to-teal-600" },
  { icon: MapPin, title: "Sell Anywhere", description: "Farmers markets, trade shows, pop-ups, job sites — process mobile payments anywhere.", color: "from-yellow-500 to-amber-600" },
  { icon: BarChart3, title: "Real-Time Sales Tracking", description: "Every mobile transaction syncs instantly to your dashboard — no manual reconciliation.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Free Mobile Reader", description: "Get a free Bluetooth card reader that pairs with your phone or tablet instantly.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Mobile payment issues at an event? Our team is available around the clock to help.", color: "from-indigo-500 to-indigo-600" },
];

export default function MobilePayments() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Mobile Payment Processing & Tap-to-Pay for Small Business | EzPay America"
        description="Accept tap-to-pay, chip, and swipe payments anywhere with a free Bluetooth card reader. Zero transaction fees, works on 4G & WiFi. Best mobile payment solution for markets, events & pop-ups."
        keywords="mobile payments, tap to pay, mobile payment processing, mobile card reader, NFC payments, contactless mobile payment, accept payments on phone, mobile payment small business, Bluetooth card reader, mobile POS, tap to pay small business"
        url="https://ezpayamerica.com/MobilePayments"
      />
      <LandingHero
        badge="Mobile Payment Solutions"
        headline="Accept Tap-to-Pay Anywhere — Zero Fees"
        subheadline="Turn your phone or tablet into a full payment terminal. Accept tap-to-pay, chip, and swipe from anywhere with a free mobile card reader and zero transaction fees."
        bullets={[
          "Free Bluetooth mobile card reader",
          "Tap-to-pay, chip & swipe accepted",
          "Works on 4G LTE & WiFi",
          "Zero transaction fees",
          "Real-time sync to your dashboard"
        ]}
        service="Mobile Payments"
      />
      <LandingFeatures title="Accept Payments Anywhere on Earth" subtitle="Mobile-first payment processing for businesses that move." features={features} />
      <LandingCTA headline="Go Mobile With Zero Fees Today" subtext="Free reader, zero fees, works everywhere. The best mobile payment solution for your business." service="Mobile Payments" />
    </div>
  );
}