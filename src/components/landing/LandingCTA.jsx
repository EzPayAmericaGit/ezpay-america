import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GetStartedForm from "./GetStartedForm";

export default function LandingCTA({ headline, subtext, service }) {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{headline}</h2>
            <p className="text-white/85 text-lg mb-6">{subtext}</p>
            <ul className="space-y-2">
              {["Zero transaction fees", "No contracts ever", "Free equipment included", "Approval in 24–48 hours", "24/7 US-based support"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
            <GetStartedForm service={service} bgDark={true} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}