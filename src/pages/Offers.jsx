import React from "react";
import SEOHead from "../components/SEOHead";

export default function Offers() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Special Offers"
        description="Check out our latest special offers and promotions"
        keywords="special offers, promotions, cashback, payment processing deals"
      />
      
      <div className="w-full">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8bde051e1_special.jpg"
          alt="EzPay America Special Offer - Get up to 15% back each month"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}