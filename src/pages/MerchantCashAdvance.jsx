import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Zap, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "../components/SEOHead";

const benefits = [
  {
    icon: Zap,
    title: "Fast Approval",
    description: "Get approved in as little as 24 hours with minimal paperwork required.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: DollarSign,
    title: "Flexible Repayment",
    description: "Payments are automatically deducted from your daily credit card sales.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: FileText,
    title: "No Credit Check",
    description: "Your approval is based on your sales history, not your credit score.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Use funds for inventory, equipment, marketing, or any business need.",
    color: "from-amber-500 to-orange-600"
  }
];

export default function MerchantCashAdvance() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Merchant Cash Advance"
        description="Get fast business funding with a merchant cash advance. 24-hour approval, no credit check, flexible repayment based on your daily credit card sales."
        keywords="merchant cash advance, business funding, small business loan, working capital, business cash advance, fast business funding"
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Merchant Cash Advance
            </h1>
            <p className="text-xl text-gray-800 mb-8">
              Quick access to working capital for your business. Get funded fast based on your future credit card sales - no collateral required.
            </p>
            <a
              href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg shadow-xl">
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
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
              Fast Capital When You Need It
            </h2>
            <p className="text-xl text-gray-600">
              A merchant cash advance isn't a loan - it's an advance on your future sales
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-8 space-y-4 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <benefit.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-4xl font-bold mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                A merchant cash advance lets you convert future credit card sales into immediate working capital. It's designed specifically for businesses with consistent card transactions.
              </p>
              <div className="space-y-6">
                {[
                  {
                    step: "1",
                    title: "Apply Online",
                    description: "Complete our simple application with basic business information"
                  },
                  {
                    step: "2",
                    title: "Get Approved",
                    description: "Receive approval within 24 hours based on your credit card sales"
                  },
                  {
                    step: "3",
                    title: "Receive Funds",
                    description: "Money is deposited directly into your business bank account"
                  },
                  {
                    step: "4",
                    title: "Automatic Repayment",
                    description: "A small percentage is deducted from your daily card sales"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{item.step}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to={createPageUrl("ApplyOnline")}>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                    Apply Online
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop&q=80&auto=format"
                  alt="Business owner reviewing merchant cash advance funding options for growth and expansion with EzPay America"
                  className="w-full h-auto"
                  loading="lazy"
                  width="800"
                  height="600"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Can You Use It For?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "Purchase new inventory",
              "Upgrade equipment",
              "Marketing campaigns",
              "Seasonal expenses",
              "Hiring staff",
              "Emergency repairs",
              "Business expansion",
              "Renovations",
              "Any business need"
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-lg font-medium text-gray-900">{useCase}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Get the Capital You Need Today
            </h2>
            <p className="text-xl text-gray-600">
              Apply in minutes and get approved within 24 hours. No hidden fees, no surprises.
            </p>
            <a
              href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                Apply for Merchant Cash Advance
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}