import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { CheckCircle2, ArrowRight, CreditCard, Wifi, Shield, Zap, Clock, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const features = [
  {
    icon: CreditCard,
    title: "Accept All Payment Types",
    description: "Credit cards, debit cards, contactless payments, and mobile wallets",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Wifi,
    title: "Wireless Connectivity",
    description: "WiFi and Ethernet connectivity for reliable transactions",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "PCI Compliant & Secure",
    description: "End-to-end encryption and tokenization for maximum security",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Lightning-fast transaction processing for shorter checkout times",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock technical support whenever you need it",
    color: "from-red-500 to-red-600"
  },
  {
    icon: DollarSign,
    title: "Competitive Rates",
    description: "Low processing fees with transparent pricing",
    color: "from-indigo-500 to-indigo-600"
  }
];

export default function CountertopTerminal() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Countertop Payment Terminal - Accept Payments Anywhere"
        description="Professional countertop payment terminal with support for all payment types. Fast, secure, and reliable payment processing for your business."
        keywords="countertop terminal, payment terminal, credit card terminal, POS terminal, card reader, payment processing terminal"
      />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Countertop Payment Terminal
              </h1>
              <p className="text-xl text-gray-800 mb-8">
                Professional payment terminal for your business. Accept all payment types with fast, secure processing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to={createPageUrl("FreeDemo")}>
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg shadow-xl">
                    Get a Free Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl("ApplyOnline")}>
                  <Button variant="outline" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-6 text-lg">
                    Apply Online
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mt-8"
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/53db22971_desktoppaymentterminal.jpg"
                alt="Modern countertop payment terminal processing transactions"
                className="rounded-2xl shadow-2xl"
                loading="eager"
                width="600"
                height="600"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in a Payment Terminal
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern, reliable, and secure payment processing for your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&h=400&fit=crop"
                alt="Business owner using countertop payment terminal"
                className="rounded-2xl shadow-xl"
                loading="lazy"
                width="600"
                height="400"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Countertop Terminal?
              </h2>
              <div className="space-y-4">
                {[
                  "No monthly fees or hidden charges",
                  "Free terminal with approved account",
                  "Accept EMV chip cards and contactless payments",
                  "Built-in receipt printer",
                  "Real-time reporting and analytics",
                  "Next-day funding available",
                  "PCI-compliant and secure",
                  "Easy setup and training included"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Upgrade Your Payment Processing?
            </h2>
            <p className="text-xl text-gray-300">
              Get started today with a free demo or apply online in minutes.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                  Schedule Free Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("ApplyOnline")}>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg">
                  Apply Online Now
                </Button>
              </Link>
            </div>
            <p className="text-gray-400 pt-4">
              Questions? Call us at <a href="tel:8653169625" className="text-amber-400 font-bold hover:underline">(865) 316-9625</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}