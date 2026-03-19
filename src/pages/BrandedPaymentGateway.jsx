import React from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Shield,
  Globe,
  CreditCard,
  Repeat,
  Lock,
  Smartphone,
  BarChart2,
  Zap,
  Settings,
  CheckCircle,
  ArrowRight,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Globe,
    color: "from-blue-500 to-blue-600",
    title: "Omnichannel Payment Acceptance",
    description:
      "Accept payments anywhere your customers want to pay — in-store, online, via mobile, or over the phone. Our branded gateway connects all your sales channels into one seamless experience."
  },
  {
    icon: CreditCard,
    color: "from-amber-500 to-amber-600",
    title: "All Card Types & Payment Methods",
    description:
      "Process Visa, Mastercard, Discover, Amex, ACH, eChecks, and digital wallets like Apple Pay and Google Pay — all through a single, unified EzPay gateway."
  },
  {
    icon: Repeat,
    color: "from-green-500 to-green-600",
    title: "Recurring Billing & Subscriptions",
    description:
      "Set up automated recurring billing, installment plans, and subscription payments with ease. Reduce failed payments and boost customer retention effortlessly."
  },
  {
    icon: Lock,
    color: "from-purple-500 to-purple-600",
    title: "Advanced Tokenization & Security",
    description:
      "Industry-leading tokenization replaces sensitive card data with secure tokens, ensuring PCI DSS compliance and protecting your customers' payment information at every step."
  },
  {
    icon: Smartphone,
    color: "from-pink-500 to-pink-600",
    title: "Mobile & Tap-to-Pay",
    description:
      "Enable tap-to-pay on mobile devices with no additional hardware required. Turn any smartphone into a fully certified payment terminal for on-the-go businesses."
  },
  {
    icon: BarChart2,
    color: "from-cyan-500 to-cyan-600",
    title: "Real-Time Reporting & Analytics",
    description:
      "Access detailed transaction reports, batch summaries, and analytics dashboards in real time. Make smarter business decisions with complete visibility into your payment data."
  },
  {
    icon: Zap,
    color: "from-orange-500 to-orange-600",
    title: "Instant Payment Links",
    description:
      "Send secure, branded payment links via text or email in seconds. Perfect for invoicing, phone orders, or any situation where a physical terminal isn't available."
  },
  {
    icon: Settings,
    color: "from-slate-500 to-slate-600",
    title: "Developer-Friendly API",
    description:
      "Integrate our gateway into any website, shopping cart, or software platform with our robust RESTful API. Compatible with 150+ processors and hundreds of shopping carts."
  },
  {
    icon: Shield,
    color: "from-red-500 to-red-600",
    title: "Built-In Fraud Protection",
    description:
      "Protect your business with advanced fraud detection tools including velocity filters, CVV verification, AVS matching, IP screening, and 3D Secure authentication."
  }
];

const stats = [
  { value: "150+", label: "Processor Connections" },
  { value: "1.2M+", label: "Active Merchants Powered" },
  { value: "$502B+", label: "Annual Payments Volume" },
  { value: "6.5B+", label: "Transactions Per Year" }
];

export default function BrandedPaymentGateway() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Branded Payment Gateway"
        description="EzPay America's Branded Payment Gateway delivers secure, zero-fee payment processing with tokenization, recurring billing, fraud protection, and omnichannel acceptance. Free setup, no contracts."
        keywords="branded payment gateway, white label payment gateway, EzPay America payment gateway, secure payment gateway, zero fee payment gateway, payment processing gateway, merchant payment gateway, omnichannel payment processing, tokenization payment security, recurring billing gateway, fraud protection payment processing, ACH gateway, mobile payments gateway, tap to pay, payment links, PCI compliant gateway, same day funding, no fee credit card gateway, best payment gateway small business, payment gateway no monthly fee"
        url="https://ezpayamerica.com/BrandedPaymentGateway"
      />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-amber-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block bg-amber-500 text-gray-900 text-sm font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              Powered by Enterprise-Grade Technology
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              EzPay Branded{" "}
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Payment Gateway
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Accept payments everywhere, protect every transaction, and grow your business — all through one powerful, fully branded gateway built exclusively for EzPay America merchants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("ApplyOnline")}>
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-bold px-8 py-6 text-lg">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:8653169625">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  (865) 316-9625
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-amber-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-800 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your Gateway. Your Brand. Zero Compromises.
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              EzPay America's Branded Payment Gateway gives your business a fully white-labeled, enterprise-grade payment infrastructure. Whether you're processing in-person, online, or over the phone, our gateway provides the reliability, security, and flexibility you need — with the EzPay name you trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Your Business Needs in One Gateway
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powerful features built for businesses of every size — from single-location shops to multi-location enterprises.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why EzPay Gateway */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose the EzPay Gateway?
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Unlike off-the-shelf gateways, EzPay's Branded Payment Gateway is backed by dedicated local support and zero-fee processing options that can save your business thousands every year.
              </p>
              <ul className="space-y-4">
                {[
                  "Zero transaction fees available for qualifying merchants",
                  "Free gateway setup — no hidden activation fees",
                  "150+ processor connections for maximum reliability",
                  "Dedicated local support team, not a call center",
                  "PCI DSS Level 1 compliant infrastructure",
                  "Same-day and next-day funding available",
                  "Works with your existing website and software",
                  "Scales from 1 location to hundreds seamlessly"
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-amber-900 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-8">
                Join thousands of merchants across the country who trust EzPay America for their payment gateway. Apply online in minutes or call us to speak with a local specialist.
              </p>
              <div className="space-y-4">
                <Link to={createPageUrl("ApplyOnline")} className="block">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-gray-900 font-bold py-4 text-lg">
                    Apply Online Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl("FreeDemo")} className="block">
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-gray-900 py-4 text-lg">
                    Request a Free Demo
                  </Button>
                </Link>
                <a href="tel:8653169625" className="flex items-center justify-center gap-2 text-amber-400 hover:text-amber-300 font-semibold mt-4">
                  <Phone className="w-5 h-5" />
                  (865) 316-9625
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Accepting Payments the Smarter Way
          </h2>
          <p className="text-gray-800 text-lg mb-8">
            No setup fees. No long-term contracts. Just powerful, reliable payment processing built for your business.
          </p>
          <Link to={createPageUrl("ApplyOnline")}>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-10 py-6 text-lg">
              Get Your EzPay Gateway Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}