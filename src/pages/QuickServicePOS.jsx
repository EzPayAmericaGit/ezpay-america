import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Zap, Monitor, CreditCard, BarChart2, Clock, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    title: "Lightning-Fast Order Entry",
    description: "Large menu buttons, quick-add modifiers, and one-tap combos let your cashiers process orders in seconds — even during a lunch rush."
  },
  {
    icon: Monitor,
    color: "from-blue-500 to-blue-600",
    title: "Customer-Facing Display & Digital Menu",
    description: "Show order totals, upsell prompts, and your brand on a second screen while customers confirm items and add their tip."
  },
  {
    icon: Clock,
    color: "from-green-500 to-green-600",
    title: "Kitchen Display System (KDS)",
    description: "Ditch the paper tickets. Orders appear instantly on your kitchen screens with ticket timers — keeping your team fast and organized."
  },
  {
    icon: CreditCard,
    color: "from-amber-500 to-amber-600",
    title: "Tap, Chip & Digital Wallet Ready",
    description: "Accept every payment type in under 5 seconds — contactless, Apple Pay, Google Pay, chip, and swipe — no friction, no lines."
  },
  {
    icon: Users,
    color: "from-purple-500 to-purple-600",
    title: "Loyalty & Repeat Customer Tools",
    description: "Built-in loyalty programs, punch cards, and promotions keep quick-service customers coming back — automatically."
  },
  {
    icon: BarChart2,
    color: "from-red-500 to-red-600",
    title: "Hourly Sales & Item Velocity Reports",
    description: "Know which menu items fly and which are dead weight. Hourly sales data helps you staff smarter and prep the right quantities."
  }
];

export default function QuickServicePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Quick Service & Fast Food POS System"
        description="EzPay America's quick service restaurant POS — fast order entry, KDS, digital menus, loyalty programs, and zero transaction fees. Free equipment for fast food & QSR merchants."
        keywords="quick service restaurant POS, fast food POS system, QSR payment processing, quick service credit card processing, fast food merchant account, counter service POS, fast casual POS system, zero fee QSR processing, quick service restaurant payment terminal, EzPay fast food POS"
        url="https://ezpayamerica.com/QuickServicePOS"
      />
      <LandingHero
        headline="Quick Service & Fast Food POS"
        subheadline="Speed is everything in quick service. EzPay America delivers a blazing-fast POS system built for high-volume counter service — with zero transaction fees and free equipment."
        bullets={[
          "One-tap order entry built for speed during rush hours",
          "Kitchen Display System replaces paper tickets",
          "Accepts Apple Pay, Google Pay & contactless in under 5 sec",
          "Zero transaction fees — keep every dollar you earn"
        ]}
        service="Quick Service POS"
      />
      <LandingFeatures
        title="Designed for Speed. Built for Volume."
        subtitle="Whether you're running a single counter or a multi-lane drive-thru, EzPay handles the pace without breaking a sweat."
        features={features}
      />
      <LandingCTA
        headline="Speed Up Service. Cut Processing Costs."
        subtext="EzPay America gets quick service restaurants processing faster and paying zero transaction fees — free equipment included."
        service="Quick Service POS"
      />
    </div>
  );
}