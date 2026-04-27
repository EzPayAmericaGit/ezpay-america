import React from "react";
import SEOHead from "../components/SEOHead";
import { ServiceSchema } from "../components/seo/SchemaOrg";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import ServiceSEOContent from "../components/landing/ServiceSEOContent";
import { DollarSign, TrendingUp, ShieldCheck, Zap, Users, BarChart3 } from "lucide-react";

const features = [
  { icon: DollarSign, title: "Offer Buy Now, Pay Later", description: "Give customers the option to split purchases into 3–24 monthly installments directly at your checkout. Increase conversion on high-ticket items.", color: "from-green-500 to-emerald-600" },
  { icon: TrendingUp, title: "Boost Average Order Value", description: "Merchants offering financing see average ticket sizes increase by 30–60%. When customers can spread payments out, they buy more.", color: "from-blue-500 to-cyan-600" },
  { icon: ShieldCheck, title: "Merchant Gets Paid Upfront", description: "You receive 100% of the purchase price immediately — minus a small processing fee. The financing company handles collections. Zero risk to you.", color: "from-purple-500 to-violet-600" },
  { icon: Zap, title: "Instant Customer Approval", description: "Customers apply and receive a decision in seconds at the point of sale. No paper forms, no delays, no disruption to your checkout flow.", color: "from-amber-500 to-orange-600" },
  { icon: Users, title: "Works for Any Business", description: "Ideal for furniture stores, dental offices, medical practices, auto services, home improvement, jewelry, and any business selling items over $200.", color: "from-teal-500 to-cyan-600" },
  { icon: BarChart3, title: "Integrated With Your POS", description: "Financing is offered directly through your EzPay terminal or checkout page. No separate tablet, no separate login — seamlessly integrated.", color: "from-red-500 to-rose-600" },
];

const faqs = [
  { q: "Does the customer pay interest?", a: "That depends on the financing plan. EzPay America partners with financing providers who offer both interest-free promotional plans (e.g., 0% for 12 months) and standard installment plans with competitive rates." },
  { q: "What if the customer doesn't pay?", a: "The financing provider assumes all collection risk. Once you receive payment, it's yours — you are not responsible for customer default or collections." },
  { q: "What is the minimum purchase amount for financing?", a: "Most plans are available for purchases of $200 or more. Some providers offer financing starting at $100. Contact EzPay America to discuss your average ticket size." },
  { q: "Is there a fee for offering financing?", a: "A merchant discount rate applies — similar to credit card processing — typically 2–6% depending on the plan. This is offset by higher conversion rates and larger ticket sizes." },
  { q: "How do I get set up?", a: "Apply online or call (865) 316-9625. Our team will match you with the right financing partner for your industry and average ticket size. Setup typically takes 2–5 business days." },
];

export default function PointOfSaleFinancing() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Point of Sale Financing & Buy Now Pay Later for Merchants | EzPay America"
        description="Offer customers buy-now-pay-later and installment financing at your checkout with EzPay America. Get paid upfront, increase average order value, instant customer approval. Apply today."
        keywords="point of sale financing, buy now pay later for merchants, merchant financing program, customer financing at checkout, BNPL merchant, installment payment processing, merchant buy now pay later, retail customer financing, dental patient financing, medical office financing, furniture store financing"
        url="https://ezpayamerica.com/PointOfSaleFinancing"
      />
      <ServiceSchema
        name="Point of Sale Financing for Merchants"
        description="EzPay America enables merchants to offer buy-now-pay-later and installment financing at checkout. Merchants receive full payment upfront while customers split into payments."
        url="https://ezpayamerica.com/PointOfSaleFinancing"
        serviceType="Point of Sale Financing"
        offers={[
          { name: "Buy Now Pay Later at Checkout", description: "Offer BNPL options integrated with your EzPay terminal" },
          { name: "Installment Payment Plans", description: "3–24 month financing plans for customers" },
          { name: "Instant Customer Approval", description: "Seconds-fast approval decision at the point of sale" },
          { name: "Upfront Merchant Payment", description: "Merchants receive 100% of the sale immediately" },
        ]}
      />
      <LandingHero
        badge="Point of Sale Financing"
        headline="Let Customers Pay Over Time — You Get Paid Today"
        subheadline="EzPay America's POS financing lets customers split purchases into easy monthly payments. You receive 100% of the sale immediately — zero collection risk, instant approval."
        bullets={[
          "Offer 3–24 month installment plans at checkout",
          "Get paid in full upfront — no collection risk",
          "Increase average ticket size by 30–60%",
          "Instant customer approval in seconds",
          "Works for any purchase over $200",
        ]}
        service="Point of Sale Financing"
      />
      <LandingFeatures
        title="Financing That Helps You Sell More"
        subtitle="Remove price objections and close more sales with flexible payment options"
        features={features}
      />
      <ServiceSEOContent
        heading="Why Offer Financing at Your Point of Sale?"
        intro="Price is the #1 reason customers abandon a purchase or delay a buying decision. When you offer financing, that objection disappears. Studies show merchants offering installment options see 20–40% higher conversion rates on high-ticket items and 30–60% larger average orders."
        sections={[
          {
            h2: "Which Businesses Benefit Most From POS Financing?",
            body: "Any business selling items or services over $200 will benefit. The ROI is highest where individual transactions are large and customers are otherwise constrained by upfront cost.",
            bullets: [
              "Dental & medical offices: patient financing for procedures",
              "Furniture & home goods: large purchases made affordable",
              "Auto repair & HVAC: emergency repairs customers can't postpone",
              "Jewelry stores: engagement rings and high-end pieces",
              "Fitness equipment: gym memberships and personal training packages",
              "Home improvement & contractors: kitchen, bath, roofing projects",
            ],
          },
          {
            h2: "How Financing Works at the Point of Sale",
            body: "When a customer is ready to check out, your staff selects the financing option on your EzPay terminal. The customer enters their information, receives an instant decision, and approves their payment plan. You process the sale normally and receive your funds — the rest is handled by the financing partner.",
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { label: "Merchant Cash Advance", to: "/MerchantCashAdvance" },
          { label: "Apply Online", to: "/ApplyOnline" },
          { label: "Services Overview", to: "/Services" },
          { label: "Book a Free Consultation", to: "/BookAppointment" },
        ]}
      />
      <LandingCTA
        headline="Start Offering Financing at Your Checkout Today"
        subtext="No long-term contracts. Integrated with your EzPay terminal. Get paid upfront. Apply in minutes."
        service="Point of Sale Financing"
      />
    </div>
  );
}