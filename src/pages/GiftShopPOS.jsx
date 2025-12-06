import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Gift, ShoppingBag, Tag, Users, TrendingUp, Package, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const features = [
  {
    icon: Gift,
    title: "Gift Registry",
    description: "Manage wedding registries, wishlists, and special occasion gift tracking.",
    color: "from-pink-500 to-rose-600"
  },
  {
    icon: Tag,
    title: "Custom Pricing",
    description: "Create markdowns, bundles, and seasonal promotions easily.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: ShoppingBag,
    title: "Gift Wrapping",
    description: "Add gift wrap charges and track special packaging requests.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Users,
    title: "Customer Database",
    description: "Remember customer preferences and purchase history for personalized service.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Package,
    title: "Vendor Management",
    description: "Track consignment items and manage multiple vendors.",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: TrendingUp,
    title: "Seasonal Planning",
    description: "Analytics to help you stock the right items for holidays and events.",
    color: "from-indigo-500 to-purple-600"
  }
];

export default function GiftShopPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Gift Shop POS System"
        description="Complete POS system for gift shops and boutiques. Gift registry, custom pricing, gift wrapping, customer database, and seasonal planning tools."
        keywords="gift shop POS, boutique POS system, gift store point of sale, retail gift shop software"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-400/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Gift className="w-20 h-20 text-pink-200" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Gift Shop & Boutique
              <br />
              <span className="text-pink-200">POS System</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
              Elegant POS solution with gift registry, custom pricing, and customer management for gift shops and boutiques.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl">
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
              Built For Gift Retail
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for a successful gift shop
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
                Why Gift Shops Choose EzPay
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Unique Item Tracking</h3>
                    <p className="text-gray-600">Manage one-of-a-kind items and artisan products</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Gift Card Management</h3>
                    <p className="text-gray-600">Sell, activate, and track gift cards and e-gifts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Special Orders</h3>
                    <p className="text-gray-600">Track custom orders and customer deposits</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Event Planning</h3>
                    <p className="text-gray-600">Prepare inventory for Mother's Day, Christmas, and more</p>
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
                src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=600&fit=crop"
                alt="Gift shop boutique with modern POS system"
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-600 to-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Elevate Your Gift Shop
            </h2>
            <p className="text-xl text-gray-100">
              Free equipment, zero transaction fees, and personal support included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl">
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