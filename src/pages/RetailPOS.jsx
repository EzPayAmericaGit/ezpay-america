
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Package, 
  BarChart3, 
  Users, 
  CreditCard, 
  Shield,
  Smartphone,
  ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Package,
    title: "Inventory Management",
    description: "Track stock levels, manage suppliers, and automate reordering with real-time inventory updates.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: BarChart3,
    title: "Advanced Reporting",
    description: "Get detailed insights into sales trends, employee performance, and customer behavior.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Build customer profiles, track purchase history, and create targeted loyalty programs.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: CreditCard,
    title: "Integrated Payments",
    description: "Accept all payment types including credit cards, mobile payments, and contactless transactions.",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "PCI-compliant system with advanced security features to protect your business data.",
    color: "from-red-500 to-red-600"
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Run your business from anywhere with mobile apps for iOS and Android devices.",
    color: "from-indigo-500 to-indigo-600"
  }
];

export default function RetailPOS() {
  return (
    <div className="min-h-screen bg-white">
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
              Retail POS System
            </h1>
            <p className="text-xl text-gray-800 mb-8">
              Complete point-of-sale solution designed specifically for retail businesses. Manage inventory, track sales, and grow your business with EzPay POS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg shadow-xl">
                  Get a Free Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a
                href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-6 text-lg">
                  Apply Online
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
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
              Everything Your Retail Store Needs
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you run your retail business more efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                Built for Modern Retail
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                EzPay POS for Retail offers a variety of retail-specific add-ons, including inventory management, age verification, gift card integration, UPC-based item tracking, and support for weight, length, and size-based products. Additionally, EzPay POS provides loyalty programs to enhance customer retention and engagement.
              </p>
              <ul className="space-y-4">
                {[
                  "Barcode scanning and label printing",
                  "Multi-location support",
                  "Employee time tracking",
                  "Customer loyalty programs",
                  "Gift card management",
                  "Real-time reporting and analytics"
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
                  alt="Retail POS System"
                  className="w-full h-auto"
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
              Ready to Upgrade Your Retail POS?
            </h2>
            <p className="text-xl text-gray-600">
              Start your free trial today. No credit card required.
            </p>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
