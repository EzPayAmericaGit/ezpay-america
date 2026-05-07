import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Store, CreditCard, Shield, Clock, Zap, BarChart3, Smartphone, HeadphonesIcon } from "lucide-react";
import { createPageUrl } from "@/utils";
import ServiceSEOContent from "../components/landing/ServiceSEOContent";

const features = [
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Keep 100% of every sale. No per-transaction fees, no monthly processing fees, no surprises.", color: "from-amber-500 to-orange-600" },
  { icon: Store, title: "Free POS Equipment", description: "State-of-the-art terminals, barcode scanners, and receipt printers at absolutely no cost to you.", color: "from-blue-500 to-blue-600" },
  { icon: Shield, title: "PCI-Compliant Security", description: "Bank-grade encryption and fraud protection keep every transaction secure and your customers safe.", color: "from-green-500 to-green-600" },
  { icon: Clock, title: "Approved in 24–48 Hours", description: "Our streamlined onboarding gets your retail store accepting payments fast — no lengthy paperwork.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "All Payment Types", description: "Accept Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, and contactless tap-to-pay.", color: "from-yellow-500 to-amber-600" },
  { icon: BarChart3, title: "Real-Time Reporting", description: "Track sales, inventory, and trends from any device with our cloud-based analytics dashboard.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Mobile Management", description: "Manage your retail store and view transactions from your phone anytime, anywhere.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "24/7 US-Based Support", description: "Real humans, not bots. Our support team is available around the clock to help your business.", color: "from-red-500 to-red-600" },
  { icon: Shield, title: "No Long-Term Contracts", description: "Month-to-month flexibility with no cancellation fees. We earn your business every single month.", color: "from-indigo-500 to-indigo-600" },
];

export default function RetailMerchants() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Zero-Fee Credit Card Processing for Retail Stores | EzPay America"
        description="Best payment processor for retail stores. $0 transaction fees, free POS equipment, no contracts. Our cash discount program eliminates processing costs entirely. Apply in minutes & get approved in 24 hours."
        keywords="zero fee credit card processing retail, retail payment processing, cash discount program retail, retail merchant services, retail POS system, best payment processor for retail store, no fee credit card processing, free POS equipment"
        url="https://ezpayamerica.com/RetailMerchants"
      />
      <LandingHero
        badge="Retail Merchant Solutions"
        headline="Zero-Fee Payment Processing for Retail Stores"
        subheadline="Stop paying transaction fees on every sale. EzPay America gives retail merchants free equipment, zero fees, and same-day deposits — with no contracts."
        bullets={[
          "$0 transaction fees — keep every dollar you earn",
          "Free terminals, scanners & receipt printers",
          "Accept Apple Pay, Google Pay & all major cards",
          "No contracts, cancel anytime",
          "Approved & processing in 24–48 hours"
        ]}
        service="Retail Merchant Services"
      />
      <LandingFeatures
        title="Everything Your Retail Store Needs"
        subtitle="From boutiques to grocery stores, EzPay America powers retail businesses across the USA."
        features={features}
      />
      <ServiceSEOContent
        heading="Zero Fee Credit Card Processing for Retail Stores"
        intro="Every time a customer swipes their card, traditional processors take 2–3% off the top. For a retail store doing $30,000/month, that's $600–$900 gone every single month. EzPay America's cash discount program for retail merchants eliminates that cost entirely. You keep 100% of every sale — with no monthly fees, no contracts, and free POS equipment included."
        sections={[
          {
            h2: "How Credit Card Processing Works for Retail",
            body: "Retail stores face some of the highest payment processing costs in any industry. Between interchange fees, monthly fees, and equipment costs, traditional processors nickel-and-dime merchants constantly. EzPay America takes a different approach: our cash discount program passes the small processing cost to card-paying customers as a transparent service fee, while cash customers receive a discount.",
            bullets: [
              "No per-transaction fees — ever",
              "No monthly statement or service fees",
              "Free countertop terminals and card readers",
              "Works with all card types: Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay",
              "Real-time sales reporting and inventory tracking included"
            ]
          },
          {
            h2: "Best Payment Processor for Retail: How to Choose",
            body: "When comparing payment processors for your retail store, look beyond the advertised rate. Square charges 2.6% + $0.10 per swipe. Stripe charges 2.7%. PayPal charges up to 3.49%. Over a year, those fees add up to thousands of dollars. EzPay America's zero-fee model means you pay $0 in processing costs — making us the most affordable payment processor for retail businesses of any size."
          },
          {
            h2: "Retail POS System — Included Free",
            body: "EzPay America provides free, fully-programmed POS equipment for every approved retail merchant. No lease, no rental, no equipment purchase required. Our retail POS systems include:",
            bullets: [
              "Countertop terminals with EMV chip and NFC tap-to-pay",
              "Barcode scanners and receipt printers",
              "Cloud-based inventory management",
              "Real-time sales reports accessible from any device",
              "Gift card and loyalty program capabilities"
            ]
          },
          {
            h2: "Who Uses EzPay America for Retail Payments?",
            body: "We serve hundreds of retail business types across the United States, from small boutiques to multi-location stores — clothing stores, shoe shops, jewelry stores, grocery stores, pet stores, gift shops, sporting goods stores, electronics shops, and more.",
          }
        ]}
        faqs={[
          { q: "What is the best payment processor for a small retail store?", a: "EzPay America is widely considered one of the best payment processors for small retail stores because merchants pay $0 in transaction fees through our cash discount program. Combined with free POS equipment, no contracts, and 24-hour approval, it's the most cost-effective option for retailers." },
          { q: "How much does credit card processing cost for retail?", a: "Traditional processors charge retail stores 2.5–3.5% per transaction. With EzPay America's zero-fee program, retail merchants pay $0 in processing fees. A store doing $40,000/month saves $1,000–$1,400 per month compared to Square or Stripe." },
          { q: "Does EzPay America work for online retail stores?", a: "Yes. In addition to in-store POS, EzPay America offers e-commerce payment gateways for online retail stores, virtual terminals for phone orders, and payment links for invoicing." },
          { q: "Can I switch from Square to EzPay America?", a: "Absolutely. Switching is simple and EzPay America handles the setup. Most retail merchants switch in a few days with no disruption to their business. You'll receive new terminals pre-programmed and ready to use." }
        ]}
        relatedLinks={[
          { label: "Restaurant Merchants", to: createPageUrl("RestaurantMerchants") },
          { label: "Services Overview", to: createPageUrl("Services") },
          { label: "Web Payment Pages", to: createPageUrl("WebPaymentPages") },
          { label: "Retail Payment Solutions", to: createPageUrl("RetailPaymentSolutions") },
          { label: "Apply Online", to: createPageUrl("ApplyOnline") }
        ]}
      />
      <LandingCTA
        headline="Ready to Stop Paying Credit Card Fees?"
        subtext="Join hundreds of retail merchants who eliminated processing fees and grew their bottom line with EzPay America."
        service="Retail Merchant Services"
      />
    </div>
  );
}