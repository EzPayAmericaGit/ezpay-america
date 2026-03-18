import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Utensils, CreditCard, Clock, Zap, Shield, BarChart3, Smartphone, HeadphonesIcon, Star } from "lucide-react";

const features = [
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Restaurant owners keep 100% of every credit card payment with our zero-fee processing program.", color: "from-amber-500 to-orange-600" },
  { icon: Utensils, title: "Restaurant-Grade POS", description: "Table management, split checks, tip adjustments, kitchen display systems — all included free.", color: "from-red-500 to-red-600" },
  { icon: Zap, title: "Fast Tableside Payments", description: "Speed up table turns with wireless terminals and tap-to-pay for faster, happier guests.", color: "from-yellow-500 to-amber-600" },
  { icon: Clock, title: "Same-Day Deposits", description: "Get your money faster with next-business-day or same-day ACH deposits directly to your bank.", color: "from-green-500 to-green-600" },
  { icon: Shield, title: "PCI Compliant & Secure", description: "EMV chip, NFC, and end-to-end encryption protect every transaction and every customer.", color: "from-blue-500 to-blue-600" },
  { icon: BarChart3, title: "Sales & Menu Analytics", description: "Identify your top-selling items, track peak hours, and optimize your menu for profitability.", color: "from-purple-500 to-purple-600" },
  { icon: Smartphone, title: "Online Ordering Ready", description: "Integrate with DoorDash, Uber Eats, and your own online ordering page to grow revenue.", color: "from-teal-500 to-teal-600" },
  { icon: Star, title: "Tip Management", description: "Automatic tip prompts on every receipt increase your servers' tips and customer satisfaction.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "24/7 Restaurant Support", description: "Emergencies don't wait for business hours. Our support team is ready whenever you need us.", color: "from-indigo-500 to-indigo-600" },
];

export default function RestaurantMerchants() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Restaurant Payment Processing – Zero Fees | EzPay America"
        description="Best payment processor for restaurants. Zero transaction fees, free restaurant POS, tableside payments, tip management. No contracts. Apply today. (865) 316-9625."
        keywords="restaurant payment processing, restaurant merchant services, restaurant POS system, tableside payment, restaurant credit card processing, zero fee restaurant processing, free restaurant POS, best payment processor restaurant, no fee credit card processing restaurant, food service merchant account"
        url="https://ezpayamerica.com/RestaurantMerchants"
      />
      <LandingHero
        badge="Restaurant Merchant Solutions"
        headline="Zero-Fee Payment Processing for Restaurants"
        subheadline="Built for restaurants, bars, cafes, and food trucks. EzPay America delivers free POS equipment, zero transaction fees, and fast deposits so you can focus on great food."
        bullets={[
          "Zero fees on every credit card transaction",
          "Free restaurant POS with table management",
          "Tableside payments & wireless terminals",
          "Tip management built in",
          "Online ordering integration"
        ]}
        service="Restaurant Merchant Services"
      />
      <LandingFeatures
        title="The Complete Restaurant Payment Solution"
        subtitle="From fast-casual to fine dining, EzPay America powers restaurants across America."
        features={features}
      />
      <LandingCTA
        headline="More Revenue, Zero Processing Fees"
        subtext="Hundreds of restaurants have eliminated credit card fees and boosted profits with EzPay America."
        service="Restaurant Merchant Services"
      />
    </div>
  );
}