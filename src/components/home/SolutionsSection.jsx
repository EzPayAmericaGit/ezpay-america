import React from "react";
import { Button } from "@/components/ui/button";
import { Monitor, Code, Cpu, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SolutionsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We Design Solutions With You. For You.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Why should you be charged for closing out at the end of the business day? Batch out as much as you like. That is just one of the advantages of using EzPay America's payment systems.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Point of Sale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Point Of Sale
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              You will receive a monthly statement showing your savings compared to what you would have paid with another company but with EzPay America your savings are assured.
            </p>
            <Link to={createPageUrl("EzPayPOSHome")}>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Payment Processing Software */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Processing Software
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              With many one-stop-shop solutions available at EzPay America, our POS offerings are unmatched by our competitors.
            </p>
            <Link to={createPageUrl("ApplyOnline")}>
              <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                Apply Online Now!
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Payment Processing Hardware */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all"
          >
            <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Processing Hardware
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              With many one-stop-shop solutions available at EzPay America, our POS offerings are unmatched by our competitors.
            </p>
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
              Explore Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}