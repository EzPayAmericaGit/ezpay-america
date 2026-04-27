import React from "react";
import SEOHead from "../components/SEOHead";
import { ServiceSchema } from "../components/seo/SchemaOrg";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import ServiceSEOContent from "../components/landing/ServiceSEOContent";
import { Star, Repeat, Smartphone, Users, BarChart3, Gift } from "lucide-react";

const features = [
  { icon: Star, title: "Points-Based Rewards", description: "Customers earn points with every purchase. You set the earn rate and reward thresholds. Points can be redeemed for discounts, free items, or special offers.", color: "from-amber-500 to-orange-600" },
  { icon: Repeat, title: "Increase Visit Frequency", description: "Loyalty members visit 2–3x more often than non-members. A simple points program is proven to turn one-time buyers into regulars.", color: "from-green-500 to-emerald-600" },
  { icon: Smartphone, title: "Digital Punch Cards & App", description: "No more paper punch cards that get lost. Customers track points via SMS, email receipts, or a branded mobile experience.", color: "from-blue-500 to-cyan-600" },
  { icon: Users, title: "Customer Database Built In", description: "Every loyalty signup builds your customer list. Use it for email campaigns, birthday offers, and targeted promotions.", color: "from-purple-500 to-violet-600" },
  { icon: BarChart3, title: "Engagement Analytics", description: "Track enrollment, active members, points redeemed, and ROI on your loyalty program. Know exactly what's working.", color: "from-teal-500 to-cyan-600" },
  { icon: Gift, title: "Bonus & Promo Campaigns", description: "Run double-points days, seasonal bonus campaigns, and referral bonuses to accelerate enrollment and engagement.", color: "from-pink-500 to-rose-600" },
];

const faqs = [
  { q: "How do customers enroll in the loyalty program?", a: "Customers can enroll at your POS terminal, via a QR code at your counter, or by texting a keyword to a short code. Enrollment takes under 30 seconds." },
  { q: "Do customers need an app?", a: "No app download required. Customers receive points via SMS or email receipts. An optional branded app is available for higher-tier programs." },
  { q: "Can I customize the rewards structure?", a: "Yes. You set the points-per-dollar earn rate, the reward thresholds, and what customers can redeem points for — discounts, free products, upgrades, and more." },
  { q: "Does this work with my current POS?", a: "Yes. EzPay America's loyalty program integrates directly with your terminal and POS system. No separate device needed — loyalty is tracked automatically at checkout." },
  { q: "How much does the loyalty program cost?", a: "Pricing varies by program tier. Contact EzPay America at (865) 316-9625 or apply online to receive a custom quote based on your transaction volume and business type." },
];

export default function LoyaltyProgram() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Customer Loyalty Program for Small Business | EzPay America"
        description="Launch a points-based loyalty program with EzPay America. Increase repeat visits, build your customer list, and reward loyal customers — no app required, fully integrated with your POS."
        keywords="customer loyalty program small business, points rewards program, digital punch card, loyalty program POS, merchant loyalty program, restaurant loyalty program, retail loyalty program, repeat customer program, EzPay loyalty rewards"
        url="https://ezpayamerica.com/LoyaltyProgram"
      />
      <ServiceSchema
        name="Customer Loyalty Program for Merchants"
        description="EzPay America's loyalty program lets merchants run a points-based rewards system integrated with their POS. Increase repeat visits and customer retention."
        url="https://ezpayamerica.com/LoyaltyProgram"
        serviceType="Customer Loyalty Program"
        offers={[
          { name: "Points-Based Rewards", description: "Customizable earn and redeem structure for every business" },
          { name: "Digital Punch Cards", description: "Paperless loyalty tracking via SMS and email" },
          { name: "Customer Database", description: "Builds your marketing contact list automatically" },
          { name: "Loyalty Analytics Dashboard", description: "Track enrollment, engagement, and ROI" },
        ]}
      />
      <LandingHero
        badge="Customer Loyalty Program"
        headline="Turn First-Time Buyers Into Lifelong Regulars"
        subheadline="EzPay America's points-based loyalty program keeps customers coming back. Fully integrated with your POS — no extra devices, no paper cards, no extra work."
        bullets={[
          "Points earned automatically at every purchase",
          "No app required — works via SMS & email",
          "Builds your customer list with every signup",
          "Proven to increase visit frequency 2–3x",
          "Customizable rewards, bonus campaigns & more",
        ]}
        service="Customer Loyalty Program"
      />
      <LandingFeatures
        title="A Loyalty Program Your Customers Will Actually Use"
        subtitle="Simple for you to run, effortless for customers to enjoy"
        features={features}
      />
      <ServiceSEOContent
        heading="Why Loyalty Programs Work for Small Businesses"
        intro="Acquiring a new customer costs 5–7x more than retaining an existing one. A loyalty program rewards customers for repeat visits and creates a habit of choosing your business over competitors. EzPay America makes it easy to launch without complex software or extra hardware."
        sections={[
          {
            h2: "Loyalty Programs by Business Type",
            body: "Every business type benefits from a loyalty program, but the structure varies. Restaurants often use visit-based punch systems. Retail stores prefer points-per-dollar. Service businesses like salons benefit from package-based rewards. EzPay America configures your program to fit your business model.",
            bullets: [
              "Restaurants & cafes: visit-based stamps or points per $1 spent",
              "Retail stores: points on every purchase, redeemable for discounts",
              "Salons & spas: service-based points with VIP tier rewards",
              "Fitness & wellness: class pack rewards and referral bonuses",
            ],
          },
          {
            h2: "Loyalty + Gift Cards: The Ultimate Retention Combo",
            body: "Many EzPay merchants pair their loyalty program with a branded gift card program. Together they create two powerful reasons for customers to return and to introduce their friends to your business. Ask about our bundled loyalty + gift card packages.",
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { label: "Gift Card Program", to: "/GiftCardProgram" },
          { label: "Apply Online", to: "/ApplyOnline" },
          { label: "Services Overview", to: "/Services" },
          { label: "Book a Free Consultation", to: "/BookAppointment" },
        ]}
      />
      <LandingCTA
        headline="Start Rewarding Your Best Customers Today"
        subtext="Easy setup, no extra hardware, integrated with your EzPay terminal. Apply in minutes and launch your loyalty program within days."
        service="Customer Loyalty Program"
      />
    </div>
  );
}