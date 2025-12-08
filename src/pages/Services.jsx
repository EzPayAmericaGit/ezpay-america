import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { 
  CreditCard, 
  Smartphone, 
  Monitor, 
  ShoppingCart, 
  Building2, 
  DollarSign,
  Cpu,
  Gift,
  ArrowRight 
} from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: CreditCard,
    title: "Credit Card Processing",
    description: "Accept all major credit and debit cards with competitive rates and fast approval times.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Smartphone,
    title: "Mobile Payment Solutions",
    description: "Process payments on-the-go with our mobile payment solutions for iOS and Android devices.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Monitor,
    title: "Point of Sale Systems",
    description: "State-of-the-art POS systems that integrate seamlessly with your business operations.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Integration",
    description: "Secure online payment gateways that integrate with popular shopping cart platforms.",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: Building2,
    title: "ACH Processing",
    description: "Electronic check processing and ACH payments for B2B transactions and payroll.",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: DollarSign,
    title: "Merchant Cash Advance",
    description: "Quick access to working capital based on your future credit card sales.",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Cpu,
    title: "Payment Gateway",
    description: "Secure payment gateway with fraud protection and real-time transaction monitoring.",
    color: "from-red-500 to-red-600"
  },
  {
    icon: Gift,
    title: "Gift Card Programs",
    description: "Custom gift card and loyalty programs to increase customer retention and sales.",
    color: "from-pink-500 to-pink-600"
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEOHead 
        title="Payment Processing Services & Merchant Solutions"
        description="Comprehensive payment processing services from EzPay America: credit card processing, mobile payments, POS systems, e-commerce integration, ACH processing, and merchant cash advance. Zero fees, free equipment, 24/7 US support. Get approved in 24 hours."
        keywords="payment processing services, credit card processing, mobile payment solutions, POS systems, e-commerce payments, ACH processing, merchant cash advance, payment gateway, gift card programs, merchant services USA"
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Comprehensive payment processing solutions tailored to your business needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of businesses that trust EzPay America for their payment processing needs.
            </p>
            <a
              href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                Apply Online Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}