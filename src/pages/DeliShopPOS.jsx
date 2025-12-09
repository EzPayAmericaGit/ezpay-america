import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Sandwich, Scale, Clock, ShoppingCart, Users, Package, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const features = [
  {
    icon: Scale,
    title: "Deli Scale Integration",
    description: "Weigh and price meats, cheeses, and salads automatically at checkout.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Clock,
    title: "Order Ahead",
    description: "Accept online orders for sandwiches and deli trays, ready when customers arrive.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: ShoppingCart,
    title: "UPC Scanning",
    description: "Quick checkout for packaged goods with barcode scanning.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Users,
    title: "Loyalty Programs",
    description: "Reward frequent customers with points and special offers.",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: Sandwich,
    title: "Sandwich Builder",
    description: "Custom sandwich orders with unlimited toppings and modifications.",
    color: "from-red-500 to-rose-600"
  },
  {
    icon: Package,
    title: "Inventory Management",
    description: "Track fresh ingredients and reduce waste with smart ordering.",
    color: "from-indigo-500 to-purple-600"
  }
];

export default function DeliShopPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Deli Shop POS System"
        description="Complete POS system for delis and sandwich shops. Scale integration, order ahead, sandwich builder, and inventory management for deli businesses."
        keywords="deli POS system, sandwich shop POS, deli point of sale, deli scale integration, sandwich shop software"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-green-700 via-green-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Sandwich className="w-20 h-20 text-green-300" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Deli Shop
              <br />
              <span className="text-green-300">POS System</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
              Complete POS solution with scale integration, sandwich builder, and inventory management for delis and sandwich shops.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-white text-green-700 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl">
                  Get a Free Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("ApplyOnline")}>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Apply Online
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
              Built For Deli Operations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a successful deli business
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
                Why Delis Choose EzPay
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Catering Management</h3>
                    <p className="text-gray-600">Handle party platters and catering orders with ease</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Per-Pound Pricing</h3>
                    <p className="text-gray-600">Automatic pricing for meats, cheeses, and salads by weight</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Recipe Costing</h3>
                    <p className="text-gray-600">Track ingredient costs for sandwiches and prepared foods</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Expiration Alerts</h3>
                    <p className="text-gray-600">Get notified about perishable items before they expire</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1619740455993-557c2f88fcc3?w=800&h=600&fit=crop"
                alt="Deli counter with fresh meats and EzPay POS system for sandwich ordering and weight-based pricing"
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="lazy"
                width="800"
                height="600"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-700 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Upgrade Your Deli Today
            </h2>
            <p className="text-xl text-gray-100">
              Free equipment, zero transaction fees, and 24/7 support included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-white text-green-700 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl">
                  Get a Free Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("ApplyOnline")}>
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Apply Online Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}