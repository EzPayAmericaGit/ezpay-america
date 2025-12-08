import React from "react";
import SEOHead from "../components/SEOHead";
import HeroSection from "../components/home/HeroSection";
import BenefitsSection from "../components/home/BenefitsSection";
import SolutionsSection from "../components/home/SolutionsSection";
import BusinessTypesSection from "../components/home/BusinessTypesSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import Footer from "../components/home/Footer";
import OtherBenefitsSection from "../components/home/OtherBenefitsSection";
import AdditionalOffersSection from "../components/home/AdditionalOffersSection";
import RestaurantTypesSection from "../components/home/RestaurantTypesSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Home - Zero-Fee Payment Processing & POS Systems"
        description="Transform your business with EzPay America's zero-fee payment processing, state-of-the-art POS systems, and merchant services. Free equipment, 24/7 support, no contracts. Trusted by thousands of businesses nationwide."
        keywords="payment processing, merchant services, POS system, credit card processing, zero fee processing, EzPay America, payment gateway, mobile payments, restaurant POS, retail POS, free equipment, no contracts"
      />
      
      <HeroSection />
      <BenefitsSection />
      <SolutionsSection />
      <BusinessTypesSection />
      <RestaurantTypesSection />
      <OtherBenefitsSection />
      <AdditionalOffersSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}