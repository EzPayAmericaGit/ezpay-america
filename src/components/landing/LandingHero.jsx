import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import GetStartedForm from "./GetStartedForm";

export default function LandingHero({ headline, subheadline, bullets, badge, service }) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden pt-20 pb-20" style={{marginTop: '80px'}}>
      {/* Background accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            {badge && (
              <span className="inline-block bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                {badge}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {headline}
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">{subheadline}</p>
            {bullets && (
              <ul className="space-y-3 mb-8">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span className="text-gray-200 text-lg">{b}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex -space-x-2">
                {["bg-amber-400","bg-orange-400","bg-yellow-400","bg-amber-600"].map((c,i) => (
                  <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-gray-800 flex items-center justify-center text-gray-900 font-bold text-xs`}>{["J","M","S","T"][i]}</div>
                ))}
              </div>
              <p className="text-gray-400 text-sm"><strong className="text-white">500+</strong> businesses switched to EzPay this month</p>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <GetStartedForm service={service} bgDark={true} />
            <p className="text-center text-gray-500 text-sm mt-4">
              Prefer to call? <a href="tel:8653169625" className="text-amber-400 font-semibold hover:underline">(865) 316-9625</a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}