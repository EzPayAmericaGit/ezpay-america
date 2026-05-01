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
const SEOContentSection = React.lazy(() => import("../components/home/SEOContentSection"));
const InternalLinks = React.lazy(() => import("../components/seo/InternalLinks"));


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Zero Fee Credit Card Processing for Small Business | EzPay America"
        description="Eliminate credit card fees with our cash discount program. Trusted merchant services for small businesses. Free POS equipment, no contracts, 24-hr approval. Get started today."
        keywords="zero fee credit card processing, cash discount program, credit card processing for small business, merchant services provider, payment processing solutions, best credit card processor for small business, cheapest credit card processing, how to avoid credit card fees, merchant account, no fee payment processing, free POS system, zero fee processing, restaurant POS, retail POS, EzPay America"
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
        <SEOContentSection />
        <InternalLinks />
        <ContactFormSection />
      </Suspense>
    </div>
  );
}