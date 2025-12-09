import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, CreditCard, Shield, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";

const features = [
  {
    icon: CreditCard,
    title: "Accept All Payment Types",
    description: "Process credit cards, debit cards, mobile payments, and contactless payments seamlessly.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Shield,
    title: "Secure Processing",
    description: "PCI-compliant payment processing with advanced fraud protection and data security.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Clock,
    title: "Fast Setup",
    description: "Get approved and start processing within 24-48 hours with our streamlined onboarding.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Store,
    title: "Free Equipment",
    description: "State-of-the-art terminals and POS systems at no cost through our Free Equipment Program.",
    color: "from-amber-500 to-orange-600"
  }
];

export default function RetailMerchants() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Retail Merchant Solutions"
        description="Payment processing solutions for retail businesses. Accept all payment types, PCI compliant, fast setup, and free equipment through our Free Equipment Program."
        keywords="retail payment processing, retail merchant services, store credit card processing, retail POS, boutique payment solutions"
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
              Retail Merchant Solutions
            </h1>
            <p className="text-xl text-gray-800 mb-8">
              Tailored payment processing solutions designed specifically for retail businesses. Accept payments quickly, securely, and affordably.
            </p>
            <a
              href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg shadow-xl">
                Apply Online
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
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
              Everything Your Retail Business Needs
            </h2>
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
                  <CardContent className="p-8 space-y-4 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
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

      {/* Image and Content Section */}
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
                Built for Retail Success
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                Whether you run a boutique, grocery store, or large retail chain, EzPay America has the perfect payment solution for your business. Our retail merchant services are designed to help you process transactions faster, reduce costs, and improve customer satisfaction.
              </p>
              <ul className="space-y-3">
                {[
                  "Zero transaction fees",
                  "No monthly or batch fees",
                  "24/7 US-based support",
                  "Free equipment program",
                  "No long-term contracts"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
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
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/3887a616c_AGoldEZPayPOS.png"
                  alt="EzPay POS system for retail stores with zero transaction fees and free equipment"
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Ready to Transform Your Retail Business?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of retail merchants who trust EzPay America for their payment processing needs.
            </p>
            <a
              href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                Apply Online Now!
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}