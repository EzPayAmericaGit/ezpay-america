import React from "react";
import SEOHead from "../components/SEOHead";
import { ServiceSchema } from "../components/seo/SchemaOrg";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import ServiceSEOContent from "../components/landing/ServiceSEOContent";
import { DollarSign, TrendingDown, ShieldCheck, Zap, FileText, BarChart3 } from "lucide-react";

const features = [
  { icon: DollarSign, title: "Pay $0 in Processing Fees", description: "With EzPay America's cash discount program, merchants keep 100% of every sale. The small processing cost is transparently passed to card-paying customers.", color: "from-green-500 to-emerald-600" },
  { icon: TrendingDown, title: "Save Thousands Per Year", description: "The average small business pays 2.5–3.5% per transaction. On $30,000/month that's $750–$1,050 in fees. Cash discount eliminates that entirely.", color: "from-blue-500 to-cyan-600" },
  { icon: ShieldCheck, title: "100% Legal & Compliant", description: "Our cash discount program is fully compliant with Visa, Mastercard, Discover, and state regulations. Clear disclosure to customers — no surprises.", color: "from-purple-500 to-violet-600" },
  { icon: Zap, title: "Works With Any Terminal", description: "Compatible with countertop terminals, mobile readers, POS systems, and virtual terminals. Easy setup — no new hardware required for most merchants.", color: "from-amber-500 to-orange-600" },
  { icon: FileText, title: "Simple Customer Disclosure", description: "Customers see the service fee clearly at checkout. If they pay with cash, the fee is waived automatically. Transparent, fair, and customer-friendly.", color: "from-red-500 to-rose-600" },
  { icon: BarChart3, title: "Detailed Reporting", description: "Track your savings in real time. See exactly how much you've saved each month compared to traditional processing fees.", color: "from-teal-500 to-cyan-600" },
];

const faqs = [
  { q: "Is the cash discount program legal?", a: "Yes. Cash discounting is legal in all 50 US states since the Durbin Amendment and the CARD Act allow merchants to offer discounts for cash payments. EzPay America's program is fully compliant with all card network rules." },
  { q: "What does the customer see at checkout?", a: "The customer sees the product price and a small service fee (typically 3–4%) applied if paying by card. If they choose to pay with cash, the fee is waived and they pay the base price. All disclosures are clearly displayed on the terminal." },
  { q: "Will my customers be upset about the fee?", a: "Most customers are accustomed to it — gas stations, many restaurants, and retailers have used this model for years. The key is clear disclosure, which our terminal and signage handles automatically." },
  { q: "Do I need new equipment?", a: "Not usually. EzPay America can program most existing terminals for cash discounting. If new equipment is needed, we provide it free of charge." },
  { q: "How quickly will I start saving?", a: "Immediately. From your first batch of card transactions, you'll pay $0 in processing fees. Most merchants see hundreds to thousands of dollars in savings within the first month." },
];

export default function CashDiscountProgram() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Cash Discount Program — Zero-Fee Credit Card Processing"
        description="EzPay America's cash discount program lets merchants accept credit cards with zero processing fees. 100% legal, fully compliant, works on all terminals. Save thousands per year. Apply today."
        keywords="cash discount program, zero fee credit card processing, surcharge program, no fee credit card processing, cash discount merchant services, eliminate processing fees, free credit card processing for merchants, cash discount compliance, merchant cash discount program USA"
        url="https://ezpayamerica.com/CashDiscountProgram"
      />
      <ServiceSchema
        name="Cash Discount Program"
        description="EzPay America's cash discount program allows merchants to accept credit cards with zero processing fees. Fully compliant, simple setup, immediate savings."
        url="https://ezpayamerica.com/CashDiscountProgram"
        serviceType="Cash Discount Payment Processing"
        offers={[
          { name: "Zero-Fee Credit Card Processing", description: "Merchants pay $0 in transaction fees" },
          { name: "Cash Discount Compliance Setup", description: "Full compliance with Visa, Mastercard, and state regulations" },
          { name: "Free Terminal Programming", description: "Existing terminals reprogrammed for cash discount at no cost" },
          { name: "Customer Disclosure Signage", description: "Professionally printed signage included" },
        ]}
      />
      <LandingHero
        badge="Zero-Fee Processing Program"
        headline="Stop Paying Credit Card Processing Fees — Forever"
        subheadline="EzPay America's Cash Discount Program eliminates processing fees completely. Keep 100% of every sale. Fully legal, fully compliant, free setup."
        bullets={[
          "Pay $0 in credit card processing fees",
          "Fully compliant with Visa, Mastercard & Discover rules",
          "Works with your existing terminal or free new equipment",
          "Clear customer disclosure — no surprises",
          "Thousands saved per year for most merchants",
        ]}
        service="Cash Discount Program"
      />
      <LandingFeatures
        title="How the Cash Discount Program Works"
        subtitle="Simple, transparent, and immediately profitable for your business"
        features={features}
      />
      <ServiceSEOContent
        heading="What Is a Cash Discount Program?"
        intro="A cash discount program allows merchants to charge a standard service fee (typically 3–4%) to customers who pay with a credit or debit card, while waiving that fee for customers who pay with cash. The result: merchants keep 100% of every sale with zero processing fees deducted."
        sections={[
          {
            h2: "Cash Discount vs. Credit Card Surcharge: What's the Difference?",
            body: "Though similar, these are legally distinct. A surcharge adds a fee on top of the posted price for card payments. A cash discount starts with an all-inclusive price and discounts it for cash. Cash discounting is legal in all 50 states; surcharges are banned in some states. EzPay America uses the compliant cash discount model.",
            bullets: [
              "Cash discount: legal nationwide — price includes service fee, cash customers get a discount",
              "Surcharge: restricted in certain states — not available through EzPay America",
              "Both achieve the same result: $0 in fees for the merchant",
              "EzPay America handles all compliance, signage, and terminal programming",
            ],
          },
          {
            h2: "Which Businesses Benefit Most From Cash Discounting?",
            body: "Any business that accepts credit cards will benefit, but the savings are largest for high-volume businesses. Restaurants, retail stores, salons, medical offices, and service businesses processing $20,000/month or more typically save $600–$1,400 per month.",
          },
          {
            h2: "Getting Started Is Easy",
            body: "Apply online in minutes. EzPay America will review your application, program your terminal or provide a free replacement, ship compliant customer-facing signage, and have you saving money within 24–48 hours of approval.",
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { label: "Apply Online", to: "/ApplyOnline" },
          { label: "Services Overview", to: "/Services" },
          { label: "ACH Payments", to: "/ACHPayments" },
          { label: "Merchant Cash Advance", to: "/MerchantCashAdvance" },
          { label: "Book a Free Consultation", to: "/BookAppointment" },
        ]}
      />
      <LandingCTA
        headline="Ready to Keep 100% of Your Revenue?"
        subtext="Join hundreds of merchants who've eliminated processing fees entirely. Apply in minutes — no contracts, free equipment, 24-hour approval."
        service="Cash Discount Program"
      />
    </div>
  );
}