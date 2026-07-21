import React, { useEffect, useState } from "react";
import SEOHead from "../components/SEOHead";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ApplyOnline() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.cognitoforms.com/f/iframe.js";
    script.async = true;
    document.body.appendChild(script);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {!loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-white rounded-2xl shadow-xl min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
              <p className="text-sm font-medium">Loading application form…</p>
            </div>
          )}
          <iframe
            src="https://www.cognitoforms.com/f/D66W5DL470GvE4vhdJGV5g/1"
            style={{ border: 0, width: "100%", maxWidth: "800px", margin: "0 auto", display: "block" }}
            height="3747"
            scrolling="yes"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            title="Online Merchant Application"
            className="bg-white rounded-2xl shadow-xl"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </section>
    </div>
  );
}