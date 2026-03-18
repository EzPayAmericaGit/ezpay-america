import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Users, BarChart3, Mail, Smartphone, Shield, Zap, RefreshCw, Star, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Users, title: "Customer Profiles", description: "Automatically build rich customer profiles from every transaction — purchase history, spend, frequency.", color: "from-amber-500 to-orange-600" },
  { icon: BarChart3, title: "Customer Analytics", description: "Segment by spend, visit frequency, product preference, and lifetime value to target marketing.", color: "from-blue-500 to-blue-600" },
  { icon: Mail, title: "Automated Email Marketing", description: "Send targeted emails to lapsed customers, top spenders, and segment-based lists automatically.", color: "from-green-500 to-green-600" },
  { icon: Star, title: "Loyalty & Rewards", description: "Built-in points and punch card system that turns first-time buyers into loyal regulars.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "Real-Time Customer Feed", description: "See who just walked in, what they bought, and how long since their last visit in real time.", color: "from-yellow-500 to-amber-600" },
  { icon: Smartphone, title: "SMS & Push Campaigns", description: "Send promotional SMS messages and push notifications directly from your CRM dashboard.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "GDPR & CAN-SPAM Compliant", description: "All customer data management and email marketing is fully compliant with privacy laws.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Win-Back Campaigns", description: "Automatically contact customers who haven't visited in 30/60/90 days with personalized offers.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Marketing Expert Support", description: "Our CRM specialists help you set up campaigns that drive real revenue for your business.", color: "from-indigo-500 to-indigo-600" },
];

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="CRM & Customer Tracking for Merchants | EzPay America"
        description="Built-in CRM that builds customer profiles from every transaction. Loyalty programs, email marketing, SMS campaigns, and win-back automation. Free with your POS."
        keywords="merchant CRM, customer tracking POS, retail CRM, restaurant CRM, customer loyalty CRM, POS customer management, customer relationship management small business, email marketing CRM, customer analytics POS"
        url="https://ezpayamerica.com/CRMPage"
      />
      <LandingHero
        badge="CRM & Customer Tracking"
        headline="Know Your Customers — Grow Your Revenue"
        subheadline="Every transaction automatically builds a customer profile. Loyalty programs, email campaigns, win-back automation, and real-time analytics — all included free."
        bullets={[
          "Auto-built customer profiles from transactions",
          "Loyalty & rewards programs included",
          "Automated email & SMS marketing",
          "Win-back campaigns for lapsed customers",
          "Customer lifetime value analytics"
        ]}
        service="CRM & Customer Tracking"
      />
      <LandingFeatures title="The CRM That Grows With Every Sale" subtitle="From first purchase to loyal regular — EzPay's built-in CRM drives more revenue automatically." features={features} />
      <LandingCTA headline="Turn Customers Into Regulars With EzPay CRM" subtext="Loyalty, email marketing, win-back campaigns — all built into your free POS." service="CRM & Customer Tracking" />
    </div>
  );
}