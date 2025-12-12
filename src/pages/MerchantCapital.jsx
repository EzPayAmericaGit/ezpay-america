import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { DollarSign, TrendingUp, Clock, CheckCircle2, ArrowRight, Zap, Shield, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const features = [
  {
    icon: Zap,
    title: "Fast Approval",
    description: "Get approved in as little as 24 hours. Minimal paperwork and quick funding decisions based on your sales history.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: DollarSign,
    title: "Flexible Funding",
    description: "Access $5,000 to $500,000 in working capital based on your monthly credit card processing volume.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: TrendingUp,
    title: "Revenue-Based Repayment",
    description: "Repayment automatically adjusts with your sales. Pay more when business is good, less when it's slow.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Clock,
    title: "No Fixed Payments",
    description: "Unlike traditional loans, merchant cash advances have no fixed monthly payment schedule or due dates.",
    color: "from-amber-500 to-orange-600"
  }
];

const benefits = [
  "No collateral or personal guarantee required",
  "Bad credit or limited credit history acceptable",
  "Funds available in 24-48 hours after approval",
  "Use capital for any business purpose",
  "No restrictions on how you spend the money",
  "Repayment through daily credit card sales",
  "No prepayment penalties or hidden fees",
  "Doesn't affect your credit score",
  "Simple one-page application",
  "Approval based on sales, not credit"
];

const useCases = [
  {
    title: "Inventory Purchase",
    description: "Buy inventory for seasonal demand or take advantage of supplier discounts with immediate capital."
  },
  {
    title: "Equipment & Upgrades",
    description: "Purchase new equipment, upgrade technology, or renovate your business location."
  },
  {
    title: "Marketing Campaigns",
    description: "Fund advertising, promotions, and marketing initiatives to grow your customer base."
  },
  {
    title: "Cash Flow Management",
    description: "Bridge gaps between payables and receivables, cover payroll, or manage slow seasons."
  },
  {
    title: "Emergency Expenses",
    description: "Handle unexpected repairs, equipment failures, or urgent business needs quickly."
  },
  {
    title: "Business Expansion",
    description: "Open new locations, hire staff, or expand your product and service offerings."
  }
];

export default function MerchantCapital() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Merchant Cash Advance - Fast Business Funding | EzPay America"
        description="Get fast business funding with merchant cash advance from EzPay America. $5K-$500K working capital, 24-hour approval, no collateral required. Repayment based on daily sales. Bad credit OK. Call (865) 316-9625."
        keywords="merchant cash advance, business cash advance, merchant funding, small business loans, business working capital, fast business funding, merchant capital, revenue based financing, alternative business lending, quick business loans, no collateral business loans, bad credit business funding, same day business funding, restaurant funding, retail business loans, cash advance for business, business capital advance, merchant advance loan, credit card receivables financing, future receivables financing, business funding no credit check, emergency business funding, working capital advance, merchant financing, small business cash advance, daily payment business loan"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-purple-900 via-purple-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <DollarSign className="w-20 h-20 text-purple-400" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Merchant Cash Advance
              <br />
              <span className="text-purple-400">Fast Business Funding</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Get $5,000 to $500,000 in working capital with 24-hour approval. No collateral, no credit checks, and repayment automatically adjusts with your daily sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("MerchantCashAdvance")}>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-xl">
                  Apply For Funding
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-6 text-lg">
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Merchant Cash Advance?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fast, flexible funding that grows with your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-8 space-y-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
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
              How Merchant Cash Advance Works
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <Card className="border-none shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Apply Online</h3>
                <p className="text-gray-700">
                  Complete our simple one-page application. We'll review your credit card processing statements to determine funding amount.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Approved</h3>
                <p className="text-gray-700">
                  Receive approval decision within 24 hours. Approval is based on your monthly sales volume, not your credit score.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Receive Funds</h3>
                <p className="text-gray-700">
                  Funds are deposited directly into your business bank account within 24-48 hours of approval. Use them however you need.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-xl bg-gradient-to-br from-amber-50 to-orange-50">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <Calculator className="w-12 h-12 text-amber-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Automatic Repayment
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    A small percentage of your daily credit card sales is automatically applied to the advance. During slow days, you pay less. During busy days, you pay more.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    This revenue-based repayment structure means the advance is paid back naturally through your normal business operations without fixed monthly payments.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    "No fixed monthly payments",
                    "Pay only when you make sales",
                    "Adjusts with seasonal fluctuations",
                    "No stress during slow periods",
                    "Paid off faster during busy times"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-amber-600" />
                      <span className="text-gray-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Advantages Over Traditional Loans
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                A merchant cash advance converts your future credit card sales into immediate working capital. Unlike traditional bank loans, there are no lengthy applications, no collateral requirements, and approval is based on your business performance, not your personal credit.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="border-none shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-8">
                  <Shield className="w-12 h-12 text-purple-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    No Personal Guarantee
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Your personal assets are not at risk. The advance is secured by your future credit card receivables, not your home, car, or personal property.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8">
                  <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Grow Your Business Faster
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Access capital quickly to seize opportunities, purchase inventory at discount, hire staff, or expand operations without waiting for traditional loan approval.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
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
              What Can You Use Funding For?
            </h2>
            <p className="text-xl text-gray-600">
              Use merchant capital for any business purpose
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle2 className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                      <h3 className="text-xl font-bold text-gray-900">{useCase.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{useCase.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Get The Capital Your Business Needs
            </h2>
            <p className="text-xl text-gray-300">
              Fast approval, flexible repayment, and funding in 24-48 hours. Apply now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("MerchantCashAdvance")}>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-6 text-lg shadow-xl">
                  Apply For Funding Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:8653169625">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-6 text-lg">
                  Call (865) 316-9625
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}