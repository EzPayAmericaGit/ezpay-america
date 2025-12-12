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
const Footer = React.lazy(() => import("../components/home/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Zero-Fee Payment Processing"
        description="Leading payment processing with zero transaction fees, free POS systems for retail & restaurants. No monthly fees, no contracts. Call (865) 316-9625."
        keywords="payment processing, merchant services, zero fee processing, free POS system, credit card processing, EzPay America, retail payments, restaurant POS, mobile payment solutions, contactless payments, merchant account, credit card terminal, payment gateway, point of sale system, EMV chip reader, NFC payments, Apple Pay, Google Pay, merchant cash advance, payment terminal, card reader, wireless payment processing, countertop terminal, mobile card reader, payment processor, merchant services provider, small business payment solutions, restaurant payment system, retail POS software, online payment processing, virtual terminal, e-commerce payment solutions, ACH processing, debit card processing, secure payment processing, PCI compliant, next day funding, same day deposits, low rate processing, interchange plus pricing, cash discount program, surcharge program, dual pricing, no contract merchant services, month to month processing, free credit card machine, free terminal placement, 24/7 merchant support, USA based support, merchant underwriting, quick approval, instant approval merchant account, high risk merchant account, CBD payment processing, vape shop payments, liquor store POS, grocery store POS, convenience store payments, food truck POS, coffee shop POS, bakery POS, deli POS, bar and tavern POS, full service restaurant POS, quick service restaurant, table service POS, online ordering integration, delivery integration, inventory management, employee management, tip management, kitchen display system, customer loyalty program, gift card processing, invoice payments, recurring billing, subscription payments, payment analytics, sales reporting"
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
        <Footer />
      </Suspense>
    </div>
  );
}