import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Smartphone, CreditCard, Wifi, MapPin, CheckCircle2, ArrowRight, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const features = [
  {
    icon: Smartphone,
    title: "iOS & Android Compatible",
    description: "Accept payments on any smartphone or tablet with our mobile payment app for iPhone, iPad, and Android devices.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: CreditCard,
    title: "All Payment Types",
    description: "Accept credit cards, debit cards, contactless payments, Apple Pay, Google Pay, and Samsung Pay on the go.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Wifi,
    title: "Works Anywhere",
    description: "Process payments with WiFi, cellular data, or offline mode. Sync transactions when connection is restored.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: MapPin,
    title: "GPS & Location Tracking",
    description: "Track sales by location, manage multiple selling points, and monitor mobile workforce transactions in real-time.",
    color: "from-amber-500 to-orange-600"
  }
];

const benefits = [
  "Free mobile card reader with account approval",
  "EMV chip card and NFC contactless payments",
  "Digital receipt delivery via email or SMS",
  "Real-time sales reporting and analytics",
  "Inventory management on your mobile device",
  "Customer database and loyalty program integration",
  "Photo capture for products and services",
  "Multi-user support for team members",
  "Same-day funding available",
  "PCI-compliant secure payment processing"
];

const useCases = [
  {
    title: "Food Trucks & Catering",
    description: "Take orders and process payments at events, festivals, and on-location catering jobs."
  },
  {
    title: "Mobile Services",
    description: "Plumbers, electricians, HVAC technicians, and contractors can collect payments at job sites."
  },
  {
    title: "Delivery & Logistics",
    description: "Accept payment on delivery with digital signature capture and instant receipt generation."
  },
  {
    title: "Events & Trade Shows",
    description: "Pop-up shops, craft fairs, farmers markets, and trade show vendors can process sales anywhere."
  },
  {
    title: "Field Sales",
    description: "Outside sales teams can close deals and collect payments while meeting clients on-site."
  },
  {
    title: "Service Professionals",
    description: "Pet groomers, personal trainers, photographers, and consultants accept payment immediately after service."
  }
];

export default function MobilePayments() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Mobile Payment Processing - Accept Payments on Phone & Tablet"
        description="Accept credit cards on your smartphone or tablet with EzPay America mobile payment processing. Free card reader, contactless payments, Apple Pay, Google Pay. Perfect for mobile businesses, food trucks, and field services. Call (865) 316-9625."
        keywords="mobile payment processing, mobile credit card processing, smartphone payment processing, tablet payment processing, mobile card reader, accept payments on phone, accept payments on tablet, mobile POS system, iPhone card reader, Android payment app, contactless mobile payments, Apple Pay processing, Google Pay processing, Samsung Pay, NFC payments mobile, mobile merchant services, on-the-go payments, field payment processing, mobile payment app, wireless payment processing, portable card reader, Bluetooth card reader, mobile swipe reader, chip reader mobile, EMV mobile reader, food truck payment processing, mobile business payments, delivery payment processing, field service payments, mobile workforce payments, pop-up shop POS, farmers market payments, craft fair payments, mobile sales processing"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-green-900 via-green-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Smartphone className="w-20 h-20 text-green-400" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Mobile Payment Processing
              <br />
              <span className="text-green-400">Accept Cards Anywhere</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Turn your smartphone or tablet into a complete point of sale system. Accept credit cards, contactless payments, and digital wallets on the go with secure mobile payment processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg shadow-xl">
                  Get Free Card Reader
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-900 px-8 py-6 text-lg">
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
              Everything You Need For Mobile Payments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete payment solution in your pocket
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
                Professional Mobile Payment Solutions
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                EzPay America's mobile payment processing allows businesses to accept secure credit card payments on smartphones and tablets. Whether you're a food truck, contractor, delivery service, or mobile professional, our mobile POS solution provides everything you need to get paid fast.
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
              <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8">
                  <Zap className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Fast & Easy Setup
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Download the app, connect your free card reader, and start accepting payments in minutes. No technical expertise required.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Download mobile app
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Pair card reader via Bluetooth
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Start accepting payments
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-8">
                  <Shield className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Bank-Level Security
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our mobile payment solution is PCI-DSS Level 1 compliant with end-to-end encryption, tokenization, and fraud protection. All card data is encrypted from swipe to settlement.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
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
              Perfect For Mobile Businesses
            </h2>
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
                      <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
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
      <section className="py-20 bg-gradient-to-br from-green-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Start Accepting Mobile Payments Today
            </h2>
            <p className="text-xl text-gray-300">
              Free card reader, no setup fees, and competitive rates. Get approved in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("ApplyOnline")}>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-6 text-lg shadow-xl">
                  Apply Online Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:8653169625">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-900 px-8 py-6 text-lg">
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