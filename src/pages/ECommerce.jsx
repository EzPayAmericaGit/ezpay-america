import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { ShoppingCart, Globe, Lock, Zap, CheckCircle2, ArrowRight, CreditCard, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const features = [
  {
    icon: Globe,
    title: "Multi-Platform Integration",
    description: "Seamlessly integrate with Shopify, WooCommerce, Magento, BigCommerce, Shopsite, Zen Cart, and more.",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "PCI-DSS Level 1 compliant payment gateway with SSL encryption, tokenization, and fraud protection.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: CreditCard,
    title: "Accept All Payment Types",
    description: "Process Visa, Mastercard, Discover, Amex, ACH, digital wallets, and international cards.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Zap,
    title: "Fast Checkout Experience",
    description: "One-click checkout, saved payment methods, and mobile-optimized payment forms reduce cart abandonment.",
    color: "from-purple-500 to-pink-600"
  }
];

const benefits = [
  "Virtual terminal for phone and mail orders",
  "Recurring billing for subscriptions",
  "Invoicing and payment links",
  "Real-time transaction reporting",
  "Automatic fraud screening",
  "Chargeback management tools",
  "Multi-currency support",
  "Mobile responsive checkout",
  "Customer payment profiles",
  "Inventory sync capabilities",
  "Advanced analytics dashboard",
  "Same-day or next-day funding"
];

const platforms = [
  { name: "Shopify", description: "Native Shopify Payments integration" },
  { name: "WooCommerce", description: "WordPress plugin for seamless checkout" },
  { name: "Magento", description: "Enterprise-level eCommerce solution" },
  { name: "BigCommerce", description: "Built-in payment gateway integration" },
  { name: "Shopsite", description: "Complete shopping cart solution" },
  { name: "Zen Cart", description: "Open-source shopping cart system" },
  { name: "3dcart", description: "All-in-one eCommerce platform" },
  { name: "Volusion", description: "Hosted shopping cart solution" },
  { name: "PrestaShop", description: "Free open-source eCommerce" },
  { name: "OpenCart", description: "Feature-rich shopping cart" },
  { name: "Custom Sites", description: "API integration for custom builds" },
  { name: "Mobile Apps", description: "iOS and Android app integration" }
];

export default function ECommerce() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="E-Commerce Payment Gateway – Shopify, WooCommerce & More | EzPay America"
        description="Secure e-commerce payment gateway for Shopify, WooCommerce, Magento & BigCommerce. Accept all cards online, recurring billing, fraud protection, and same-day deposits. No monthly fees. Apply free."
        keywords="ecommerce payment processing, online payment gateway, accept payments online, ecommerce merchant account, online credit card processing, payment gateway integration, Shopify payments, WooCommerce payments, Magento payment processing, shopping cart integration, virtual terminal, online payment solutions, secure checkout, ecommerce payments, internet merchant account, web payment processing, hosted payment page, payment gateway API, recurring billing online, subscription payment processing, digital wallet payments, Apple Pay online, Google Pay ecommerce, mobile checkout, international payment processing, multi-currency gateway, fraud prevention ecommerce, PCI compliant gateway, tokenization, 3D secure, chargeback protection, cart abandonment recovery"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-orange-900 via-orange-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <ShoppingCart className="w-20 h-20 text-orange-400" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              E-Commerce Payment
              <br />
              <span className="text-orange-400">Processing Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Accept secure online payments with our powerful payment gateway. Seamless integration with popular eCommerce platforms, advanced fraud protection, and competitive rates for online merchants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-6 text-lg shadow-xl">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-900 px-8 py-6 text-lg">
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
              Complete E-Commerce Payment Gateway
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to accept payments online
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

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Powerful Features For Online Merchants
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                EzPay America's eCommerce payment gateway integrates seamlessly with leading shopping cart platforms including Shopify, WooCommerce, Magento, and BigCommerce. Our secure payment processing solution provides merchants with comprehensive tools to accept online payments, manage transactions, and grow their business.
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
              <Card className="border-none shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
                <CardContent className="p-8">
                  <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Increase Conversion Rates
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Fast, secure checkout experiences reduce cart abandonment and improve sales conversions. Our optimized payment forms are mobile-responsive and support one-click purchasing.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-500" />
                      Mobile-optimized checkout
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-500" />
                      Saved payment methods
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-500" />
                      Express checkout options
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-8">
                  <Lock className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Enterprise-Level Security
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    PCI-DSS Level 1 compliant with SSL encryption, tokenization, 3D Secure authentication, and advanced fraud detection. Protect your business and customers from fraud and data breaches.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Integrations */}
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
              Integrates With Your Platform
            </h2>
            <p className="text-xl text-gray-600">
              Compatible with all major eCommerce platforms
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-900">{platform.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{platform.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
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
              Advanced Features For Growing Businesses
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <Zap className="w-12 h-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Recurring Billing
                </h3>
                <p className="text-gray-600">
                  Automated subscription and recurring payment management for membership sites, SaaS products, and subscription boxes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <Globe className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  International Sales
                </h3>
                <p className="text-gray-600">
                  Accept payments in multiple currencies from customers worldwide with automatic currency conversion and international card support.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl">
              <CardContent className="p-8">
                <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Advanced Analytics
                </h3>
                <p className="text-gray-600">
                  Real-time reporting, sales analytics, customer insights, and transaction monitoring to optimize your online store performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Start Accepting Online Payments Today
            </h2>
            <p className="text-xl text-gray-300">
              Fast integration, competitive rates, and 24/7 support. Get approved in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("ApplyOnline")}>
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-6 text-lg shadow-xl">
                  Apply Online Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:8653169625">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-orange-900 px-8 py-6 text-lg">
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