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
        title="Zero-Fee Payment Processing & Merchant Services"
        description="EzPay America - Leading payment processing solutions with zero transaction fees, free POS systems, and merchant services for retail and restaurants. No monthly fees, no contracts, 24/7 US support. Accept credit cards, mobile payments, and contactless transactions."
        keywords="payment processing, merchant services, zero fee processing, free POS system, credit card processing, EzPay America, retail payments, restaurant POS"
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