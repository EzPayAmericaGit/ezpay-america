import React, { useEffect } from "react";
import SEOHead from "../components/SEOHead";
import { motion } from "framer-motion";

export default function ApplyOnline() {
  useEffect(() => {
    const container = document.getElementById("cognito-form-container");
    if (!container) return;
    const script = document.createElement("script");
    script.src = "https://www.cognitoforms.com/f/seamless.js";
    script.setAttribute("data-key", "6RMqTZmF685375nR6XRvTvQmBgx8FjWa");
    script.setAttribute("data-form", "1");
    container.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Apply for a Zero-Fee Merchant Account | EzPay America"
        description="Apply online in minutes for zero-fee credit card processing. 24-hour approval, free POS equipment, no contracts, no setup fees."
        keywords="apply for merchant account, merchant account application online, zero fee credit card processing application"
        url="https://ezpayamerica.com/ApplyOnline"
      />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Online Merchant Application
            </h1>
            <p className="text-xl text-gray-800">
              Please complete the form below to get started
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cognito Form */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="cognito-form-container" className="bg-white rounded-2xl shadow-xl p-6 md:p-10 min-h-[400px]" />
        </div>
      </section>
    </div>
  );
}