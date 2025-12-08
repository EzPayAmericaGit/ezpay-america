import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Phone } from "lucide-react";

import SEOHead from "../components/SEOHead";
import HeroSection from "../components/home/HeroSection";
import BenefitsSection from "../components/home/BenefitsSection";
import OtherBenefitsSection from "../components/home/OtherBenefitsSection";
import SolutionsSection from "../components/home/SolutionsSection";
import BusinessTypesSection from "../components/home/BusinessTypesSection";
import AdditionalOffersSection from "../components/home/AdditionalOffersSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import RestaurantTypesSection from "../components/home/RestaurantTypesSection";
import ContactFormSection from "../components/home/ContactFormSection";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Home"
        description="EzPay America offers zero-fee payment processing, free POS systems, and merchant services. No monthly fees, no contracts, 24/7 US-based support."
        keywords="payment processing, merchant services, zero fee processing, free POS system, credit card processing, EzPay America"
      />
      <HeroSection />
      <BenefitsSection />
      <OtherBenefitsSection />
      <SolutionsSection />
      <BusinessTypesSection />
      <AdditionalOffersSection />
      <TestimonialsSection />
      <RestaurantTypesSection />
      <ContactFormSection />
      <Footer />
    </div>
  );
}