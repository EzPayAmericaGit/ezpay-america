import React, { Suspense } from "react";

import SEOHead from "../components/SEOHead";
import HeroSection from "../components/home/HeroSection";

const BenefitsSection = React.lazy(() => import("../components/home/BenefitsSection"));
const OtherBenefitsSection = React.lazy(() => import("../components/home/OtherBenefitsSection"));
const SolutionsSection = React.lazy(() => import("../components/home/SolutionsSection"));
const BusinessTypesSection = React.lazy(() => import("../components/home/BusinessTypesSection"));
const AdditionalOffersSection = React.lazy(() => import("../components/home/AdditionalOffersSection"));
const TestimonialsSection = React.lazy(() => import("../components/home/TestimonialsSection"));
const RestaurantTypesSection = React.lazy(() => import("../components/home/RestaurantTypesSection"));
const ContactFormSection = React.lazy(() => import("../components/home/ContactFormSection"));


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Payment Processing for Small Businesses | Low Fees, Fast Approval"
        description="Accept credit cards with transparent pricing. No contracts, 24-hour approval, zero transaction fees. Free POS equipment included. Trusted by 500+ small businesses nationwide. Call (865) 316-9625."
        keywords="credit card processing, merchant services, payment processing, payment gateway, merchant account, online payment solutions, point of sale system, POS system, mobile payments, contactless payments, credit card terminal, zero fee processing, free POS system, retail POS, restaurant POS, small business payment solutions, payment processor, merchant services provider, EMV chip reader, NFC payments, Apple Pay, Google Pay, card reader, wireless payment processing, payment terminal, countertop terminal, mobile card reader, e-commerce payment solutions, virtual terminal, online payment processing, secure payment processing, PCI compliant processing, ACH processing, debit card processing, next day funding, same day deposits, low rate credit card processing, interchange plus pricing, cash discount program, surcharge program, dual pricing, no contract merchant services, month to month processing, free credit card machine, free terminal placement, 24/7 merchant support, USA based support, quick approval merchant account, instant approval, high risk merchant account, CBD payment processing, vape shop merchant services, liquor store POS, grocery store POS system, convenience store payments, food truck POS, coffee shop point of sale, bakery POS system, deli POS, bar and tavern POS, full service restaurant POS, quick service restaurant system, table service POS, online ordering integration, delivery payment integration, inventory management system, employee management, tip management system, kitchen display system, customer loyalty program, gift card processing, invoice payments, recurring billing, subscription payment processing, payment analytics, sales reporting dashboard, EzPay America, best merchant services, affordable payment processing, cheap credit card processing, payment processing for small business, restaurant payment system, retail payment solutions"
        pageSchema={[
          {
            "@type": "Organization",
            "@id": "https://ezpayamerica.com/#organization",
            "name": "EzPay America",
            "url": "https://ezpayamerica.com",
            "logo": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-865-316-9625",
              "contactType": "customer service",
              "areaServed": "US"
            },
            "sameAs": [
              "https://www.facebook.com/ezpayamerica",
              "https://www.linkedin.com/company/ezpay-america"
            ]
          },
          {
            "@type": "WebSite",
            "@id": "https://ezpayamerica.com/#website",
            "url": "https://ezpayamerica.com",
            "name": "EzPay America",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://ezpayamerica.com/?s={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        ]}
      />
      <HeroSection />
      <Suspense fallback={<div className="h-screen" />}>
        <BenefitsSection />
        <OtherBenefitsSection />
        <SolutionsSection />
        <BusinessTypesSection />
        <AdditionalOffersSection />
        <TestimonialsSection />
        <RestaurantTypesSection />
        <ContactFormSection />
      </Suspense>
    </div>
  );
}