import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function ContactFormSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Are You Ready to Get Started Today?
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Simply click the button below to complete your online merchant application and start accepting payments with EzPay America.
          </p>
          
          <Link to={createPageUrl("ApplyOnline")} className="block mt-12">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-12 py-8 text-xl shadow-xl">
              Apply Online Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>

          <p className="text-gray-400 text-sm">
            Questions? Call us at <a href="tel:8653169625" className="text-amber-500 hover:text-amber-400 font-semibold">(865) 316-9625</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}