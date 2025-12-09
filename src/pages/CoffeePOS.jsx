import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Coffee, Users, Clock, TrendingUp, Zap, ShoppingCart, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const features = [
  {
    icon: Clock,
    title: "Quick Order Entry",
    description: "Speed through morning rush with intuitive interface and saved favorites.",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: Users,
    title: "Customer Loyalty",
    description: "Built-in rewards program to keep customers coming back for their daily brew.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: ShoppingCart,
    title: "Modifier Management",
    description: "Handle complex drink customizations with ease - size, milk, shots, syrups.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Analytics",
    description: "Track your best-selling drinks, peak hours, and inventory levels.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Zap,
    title: "Mobile Ordering",
    description: "Let customers order ahead and skip the line for faster service.",
    color: "from-red-500 to-rose-600"
  },
  {
    icon: CheckCircle2,
    title: "Inventory Tracking",
    description: "Monitor coffee beans, milk, syrups, and supplies in real-time.",
    color: "from-indigo-500 to-purple-600"
  }
];

export default function CoffeePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Coffee Shop & Cafe POS System"
        description="Complete POS system for coffee shops and cafes. Fast order entry, loyalty programs, modifier management, and real-time inventory tracking."
        keywords="coffee shop POS, cafe POS system, coffee shop point of sale, barista POS, coffee ordering system"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900 via-amber-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Coffee className="w-20 h-20 text-amber-400" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Coffee Shop & Cafe
              <br />
              <span className="text-amber-400">POS System</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Streamline your coffee shop operations with a POS designed for speed, customization, and customer loyalty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
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
              Built For Coffee Shops
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to serve great coffee and grow your business
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
                Perfect For Every Coffee Business
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Specialty Coffee Shops</h3>
                    <p className="text-gray-600">Handle complex espresso drinks with unlimited modifiers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Cafes with Food</h3>
                    <p className="text-gray-600">Manage both drinks and food items seamlessly</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Bakery Cafes</h3>
                    <p className="text-gray-600">Track baked goods inventory and coffee sales together</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Drive-Through Coffee</h3>
                    <p className="text-gray-600">Fast processing for quick service drive-through operations</p>
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
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop"
                alt="Barista using EzPay POS system in modern coffee shop for fast order entry and customer loyalty"
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
              Ready to Upgrade Your Coffee Shop?
            </h2>
            <p className="text-xl text-gray-300">
              Get started with EzPay POS today. Free equipment and setup included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
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