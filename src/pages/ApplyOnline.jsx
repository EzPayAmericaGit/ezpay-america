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
          <div className="relative">
            {!loaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl py-20 px-6 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                <p className="text-gray-700 font-medium mb-1">Loading application form…</p>
                <p className="text-gray-500 text-sm mb-5">If the form doesn't appear, open it directly:</p>
                <a
                  href="https://www.cognitoforms.com/f/D66W5DL470GvE4vhdJGV5g/1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg shadow"
                >
                  Open Application Form
                </a>
              </div>
            )}
            <iframe
              src="https://www.cognitoforms.com/f/D66W5DL470GvE4vhdJGV5g/1"
              style={{ border: 0, width: "100%", maxWidth: "800px", margin: "0 auto", display: "block" }}
              height="3747"
              scrolling="yes"
              title="Online Merchant Application"
              className="bg-white rounded-2xl shadow-xl"
              onLoad={() => setLoaded(true)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}