import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Wind, ShieldCheck, Package, Users, TrendingUp, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "Age Verification",
    description: "Automatic ID prompts for every sale to comply with tobacco regulations.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Package,
    title: "Flavor & Nicotine Tracking",
    description: "Manage products by flavor, nicotine strength, and device type.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Users,
    title: "Customer Preferences",
    description: "Remember customer favorites for faster repeat purchases.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: TrendingUp,
    title: "Inventory Management",
    description: "Track devices, pods, liquids, and accessories with ease.",
    color: "from-amber-500 to-orange-600"
  },
  {
    icon: Zap,
    title: "Quick Add-Ons",
    description: "Suggest complementary products like coils, chargers, and cases.",
    color: "from-red-500 to-rose-600"
  },
  {
    icon: Wind,
    title: "Loyalty Programs",
    description: "Reward regular customers with points and exclusive offers.",
    color: "from-indigo-500 to-purple-600"
  }
];

export default function VapeStorePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Vape Store POS System"
        description="Complete POS system for vape and smoke shops. Age verification, flavor tracking, inventory management, and compliance tools for vape retailers."
        keywords="vape store POS, smoke shop POS system, vape shop point of sale, tobacco store POS, e-cigarette retail software"
      />

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Wind className="w-20 h-20 text-purple-300" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Vape & Smoke Shop
              <br />
              <span className="text-purple-300">POS System</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto">
              Compliant POS solution with age verification, product tracking, and inventory management for vape and smoke retailers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl">
                  Get a Free Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("ApplyOnline")}>
                <Button variant="outline" className="border-2 border-orange-500 text-orange-500 hover:bg-gray-900 hover:text-white hover:border-gray-900 px-8 py-6 text-lg">
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
              Built For Vape Shops
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay compliant and grow your vape business
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
                Why Vape Shops Choose EzPay
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Compliance Reporting</h3>
                    <p className="text-gray-600">Generate reports for FDA and state tobacco regulations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Multi-Variant Products</h3>
                    <p className="text-gray-600">Manage products with multiple flavors and nicotine strengths</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Accessory Upsells</h3>
                    <p className="text-gray-600">Automatic suggestions for coils, batteries, and cases</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Batch Tracking</h3>
                    <p className="text-gray-600">Track product batches for recalls and quality control</p>
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
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/933272163_VAPESHOPS.jpg"
                alt="Vape shop with modern POS system"
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Upgrade Your Vape Shop Today
            </h2>
            <p className="text-xl text-gray-100">
              Free equipment, zero transaction fees, and compliance support included.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 text-lg shadow-xl">
                  Get a Free Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("ApplyOnline")}>
                <Button variant="outline" className="border-2 border-orange-500 text-orange-500 hover:bg-gray-900 hover:text-white hover:border-gray-900 px-8 py-6 text-lg">
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