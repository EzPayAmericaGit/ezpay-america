import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Mail, Star, Smartphone, BarChart3, Zap, Users, RefreshCw, Gift, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Mail, title: "Email Marketing", description: "Send professional email campaigns to your customer base with templates and automation.", color: "from-amber-500 to-orange-600" },
  { icon: Star, title: "Loyalty Programs", description: "Points-based and punch card loyalty programs that automatically reward your best customers.", color: "from-blue-500 to-blue-600" },
  { icon: Smartphone, title: "SMS Marketing", description: "Reach customers directly on their phones with targeted promotions and announcements.", color: "from-green-500 to-green-600" },
  { icon: Gift, title: "Gift Card Programs", description: "Sell digital and physical gift cards in-store and online — a powerful revenue driver.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Campaign Analytics", description: "Track open rates, click-through rates, redemptions, and revenue from every campaign.", color: "from-teal-500 to-teal-600" },
  { icon: Zap, title: "Automated Campaigns", description: "Trigger campaigns based on customer behavior — birthdays, lapsed visits, big purchases.", color: "from-yellow-500 to-amber-600" },
  { icon: Users, title: "Customer Segmentation", description: "Target the right customers with the right offers based on purchase history and spend.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Win-Back Automation", description: "Automatically re-engage customers who haven't visited in 30, 60, or 90 days.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Marketing Expert Support", description: "Our marketing specialists help you design campaigns that drive measurable ROI.", color: "from-indigo-500 to-indigo-600" },
];

export default function MarketingTools() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Marketing Tools for Small Business – Email, Loyalty & SMS | EzPay America"
        description="Built-in email marketing, loyalty programs, SMS campaigns, and gift cards for merchants. Drive repeat business automatically. Free with your EzPay merchant account."
        keywords="small business marketing tools, email marketing for merchants, loyalty program software, SMS marketing small business, gift card program, merchant marketing platform, retail email marketing, restaurant loyalty program, automated marketing small business"
        url="https://ezpayamerica.com/MarketingTools"
      />
      <LandingHero
        badge="Marketing Tools"
        headline="Built-In Marketing Tools That Drive Repeat Business"
        subheadline="Email campaigns, loyalty programs, SMS marketing, and gift cards — all built into your EzPay account. Turn first-time buyers into lifelong customers automatically."
        bullets={[
          "Email & SMS campaigns in minutes",
          "Points & punch card loyalty programs",
          "Gift card program included",
          "Automated win-back campaigns",
          "Full campaign analytics"
        ]}
        service="Marketing Tools"
      />
      <LandingFeatures title="All the Marketing Tools You Need in One Place" subtitle="From email to loyalty to SMS — everything you need to grow your customer base." features={features} />
      <LandingCTA headline="Grow Your Business With Built-In Marketing" subtext="Email, loyalty, SMS, gift cards — all free with your EzPay merchant account." service="Marketing Tools" />
    </div>
  );
}