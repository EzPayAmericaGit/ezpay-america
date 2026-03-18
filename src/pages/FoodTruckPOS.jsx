import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Truck, CreditCard, Smartphone, BarChart3, Zap, Shield, Wifi, Clock, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Smartphone, title: "Mobile-First POS", description: "Run your entire food truck from a tablet or smartphone — no countertop setup required.", color: "from-amber-500 to-orange-600" },
  { icon: Wifi, title: "4G LTE & WiFi", description: "Process payments over cellular or WiFi — works anywhere your truck goes, even offline.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Keep all your food truck earnings. Zero fees on every credit card payment processed.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Fast Queue Processing", description: "Process walk-up customers fast at festivals, events, and busy lunch rushes.", color: "from-purple-500 to-purple-600" },
  { icon: Truck, title: "Event & Catering Mode", description: "Switch between regular service and catering/event mode to manage large order volumes.", color: "from-yellow-500 to-amber-600" },
  { icon: BarChart3, title: "Revenue Tracking", description: "See your best locations, peak hours, and top menu items to maximize every route.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "Secure Mobile Payments", description: "PCI-compliant mobile card reader with full encryption on every transaction.", color: "from-pink-500 to-pink-600" },
  { icon: Clock, title: "Order Queue Management", description: "Text or number customers when their order is ready to reduce crowd congestion.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "On-the-Road Support", description: "24/7 support that's ready when you need it — before events, during rushes, after close.", color: "from-indigo-500 to-indigo-600" },
];

export default function FoodTruckPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Food Truck POS System – Mobile Zero-Fee Processing | EzPay America"
        description="Best POS system for food trucks. Mobile payments, 4G LTE processing, zero transaction fees, offline mode. Free equipment. Wherever you go, we process. Apply free."
        keywords="food truck POS system, mobile POS food truck, food truck payment processing, food truck card reader, best POS for food truck, mobile food vendor POS, food truck credit card processing, zero fee food truck POS, food truck payment system"
        url="https://ezpayamerica.com/FoodTruckPOS"
      />
      <LandingHero
        badge="Food Truck POS"
        headline="The Mobile POS Built for Food Trucks"
        subheadline="Process payments anywhere — festivals, markets, street corners. EzPay America's food truck POS works on 4G LTE, WiFi, or offline with zero transaction fees."
        bullets={[
          "Works on cellular, WiFi, and offline",
          "Mobile tablet POS — no countertop needed",
          "Zero transaction fees everywhere",
          "Event & catering mode included",
          "Free mobile card reader"
        ]}
        service="Food Truck POS"
      />
      <LandingFeatures title="Built for Life on the Road" subtitle="Your food truck goes everywhere — so does your EzPay America POS." features={features} />
      <LandingCTA headline="Power Your Food Truck With EzPay" subtext="Mobile, zero-fee, and free. The best food truck POS system is waiting for you." service="Food Truck POS" />
    </div>
  );
}