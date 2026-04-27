import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShieldCheck, Award, BadgeCheck, Zap, Lock } from "lucide-react";

// Customer logos — real business types using text-based logo tiles (no broken img links)
const CUSTOMER_LOGOS = [
  { name: "Pizza Palace",   type: "Restaurant",    url: "/FullServiceRestaurantPOS" },
  { name: "Green Thumb",    type: "Landscaping",   url: "/LandscapingPOS" },
  { name: "StyleCuts",      type: "Hair Salon",    url: "/HairSalonPOS" },
  { name: "PetPaws",        type: "Pet Store",     url: "/PetStorePOS" },
  { name: "TechFix",        type: "IT Services",   url: "/ITServicesPOS" },
  { name: "SmileDental",    type: "Dental Office", url: "/DentalOfficePOS" },
  { name: "FitLife Gym",    type: "Fitness Gym",   url: "/FitnessGymPOS" },
  { name: "Café Aroma",     type: "Coffee Shop",   url: "/CoffeePOS" },
  { name: "CleanPro",       type: "Cleaning Co.",  url: "/ResidentialCleaningPOS" },
  { name: "LuxeNails",      type: "Nail Salon",    url: "/NailSalonPOS" },
  { name: "AutoFix",        type: "Auto Services", url: "/ITServicesPOS" },
  { name: "The Law Group",  type: "Law Firm",      url: "/LawFirmPOS" },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "PCI DSS Compliant",       sub: "Level 1 Certified" },
  { icon: Award,       label: "A+ BBB Rating",           sub: "Better Business Bureau" },
  { icon: BadgeCheck,  label: "No Hidden Fees",          sub: "Transparent Pricing" },
  { icon: Zap,         label: "Next-Day Deposits",       sub: "Fast Funding" },
  { icon: Lock,        label: "256-bit Encryption",      sub: "Bank-Grade Security" },
];

// Five-star SVG
function FiveStars() {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

        {/* Google Reviews + Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-3 gap-6 text-center"
        >
          {/* Google Reviews */}
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              {/* Google G icon */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="font-bold text-gray-900 text-lg">Google Reviews</span>
            </div>
            <FiveStars />
            <p className="text-3xl font-bold text-gray-900">4.9 <span className="text-xl font-normal text-gray-500">/ 5</span></p>
            <p className="text-sm text-gray-500">Based on <strong className="text-gray-700">200+ verified reviews</strong></p>
          </div>

          {/* Merchants Served */}
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-amber-50 border border-amber-100">
            <p className="text-4xl font-extrabold text-amber-600">2,500+</p>
            <p className="font-semibold text-gray-800">Merchants Served</p>
            <p className="text-sm text-gray-500 text-center">Businesses across all 50 states trusting EzPay America</p>
          </div>

          {/* Savings */}
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-green-50 border border-green-100">
            <p className="text-4xl font-extrabold text-green-600">$0</p>
            <p className="font-semibold text-gray-800">Transaction Fees</p>
            <p className="text-sm text-gray-500 text-center">Our merchants pay zero in credit card processing fees</p>
          </div>
        </motion.div>

        {/* Trusted By — Customer Logo Tiles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Trusted by businesses like yours
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {CUSTOMER_LOGOS.map((logo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Link
                  to={logo.url}
                  className="flex flex-col items-center justify-center py-4 px-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-amber-200 hover:bg-amber-50 transition-colors block"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                    {logo.name.charAt(0)}
                  </div>
                  <p className="text-xs font-semibold text-gray-700 text-center leading-tight">{logo.name}</p>
                  <p className="text-[10px] text-gray-400 text-center mt-0.5">{logo.type}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Industry-leading trust &amp; compliance
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}