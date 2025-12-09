import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Monitor, ShoppingCart, Heart, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils"; // Changed: Imported createPageUrl from utils

const features = [
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "EzPay POS e-commerce solutions meet your business needs."
  },
  {
    icon: CheckCircle2,
    title: "24/7 Support",
    description: "EzPay POS offers 24/7 support to ensure your needs are met around the clock."
  },
  {
    icon: Heart,
    title: "Loyalty Module",
    description: "Quantic loyalty feature enhances your customer engagement."
  },
  {
    icon: Calendar,
    title: "Reservation Module",
    description: "EzPay POS offers reservation solutions to streamline your booking process."
  }
];

export default function EzPayPOSHome() {
  return (
        <div className="min-h-screen bg-white">
          <SEOHead 
            title="EzPay POS System - Cloud-Based Point of Sale for Retail & Restaurants"
            description="Cloud-based POS system for retail and restaurant businesses. Free equipment, 24/7 support, e-commerce integration, loyalty programs, inventory management, and employee tracking. Free trial available."
            keywords="POS system, point of sale, cloud POS, restaurant POS, retail POS, EzPay POS, free POS system, cloud-based POS, iPad POS, tablet POS, touchscreen POS, modern POS system, POS software, restaurant management system, retail management software, inventory management, employee management, table management, kitchen display system, KDS, order management, menu management, modifier management, split checks, seat management, tip management, gratuity tracking, cash drawer integration, receipt printer, barcode scanner, customer display, pole display, kitchen printer, bar printer, online ordering integration, delivery integration, DoorDash integration, Uber Eats, GrubHub, third-party delivery, gift card integration, loyalty program, rewards program, customer engagement, marketing tools, email marketing, SMS marketing, customer database, sales reporting, real-time analytics, business intelligence, multi-location management, franchise POS, chain restaurant POS, quick service restaurant POS, QSR, full service restaurant POS, fine dining POS, cafe POS, coffee shop POS, bakery POS, pizza shop POS, food truck POS, bar POS, nightclub POS, liquor store POS, convenience store POS, grocery store POS, retail shop POS, boutique POS, gift shop POS, hardware store POS, dispensary POS, CBD store POS, vape shop POS, salon POS, spa POS, appointment scheduling, service-based POS, age verification, ID scanning, UPC scanning, SKU tracking, product variants, size matrix, color options, department tracking, category management, vendor management, purchase orders, receiving, stock alerts, low stock notifications, mobile POS, offline mode, cloud sync, data backup, secure cloud storage, PCI compliant POS, EMV certified, contactless ready, NFC payments, chip card reader, magstripe reader, PIN pad, signature capture, email receipts, SMS receipts, digital receipts, no receipt option, custom receipts, receipt logo, split tender, multiple payment types, cash back, store credit, refunds processing, exchanges, returns management, discount management, promotion engine, happy hour pricing, time-based pricing, day-part pricing, seasonal menu, menu engineering, profit margin tracking, food cost calculation, labor cost tracking, shift management, time clock, employee permissions, role-based access, manager overrides, audit trails, void tracking, discount approvals, server performance, sales per hour, average ticket size, customer lifetime value, repeat customer tracking, reservation system, waitlist management, table turn time, cover count, guest count tracking, party size, seating charts, floor plans, section assignment, server rotation, auto gratuity, tip pooling, tip reporting, payroll integration, accounting integration, QuickBooks integration, Xero integration, tax management, sales tax tracking, tax exemptions, tax reports, end of day reports, batch closing, settlement reports, Z reports, X reports, drawer management, cash management, safe drops, blind drops, tender reconciliation, variance reporting, over short tracking"
          />
          {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-amber-400 font-semibold text-lg">
                Get Your Free Trial Of EzPay POS | No Credit Card Required
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                The Best Cloud Based
                <br />
                <span className="text-amber-400">POS Solutions</span> for your Business.
              </h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto"
          >
            <div className="relative">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/3887a616c_AGoldEZPayPOS.png"
                alt="EzPay POS iPad terminal with card reader for retail and restaurant businesses"
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="eager"
                width="500"
                height="400"
              />
            </div>
            <div className="relative">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/3887a616c_AGoldEZPayPOS.png"
                alt="EzPay cloud-based point of sale system with touchscreen display"
                className="w-full h-auto rounded-2xl shadow-2xl"
                loading="eager"
                width="500"
                height="400"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
          >
            <Link to={createPageUrl("FreeDemo")}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                Get a Free Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <a
              href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                Apply Online Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              With the EzPay POS system, you can manage everything in one place with ease!
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Managing a restaurant in the fast-paced U.S. market of today entails managing orders, payments, staff management, kitchen workflows, and customer satisfaction, frequently all at once. All of these components are combined in the EzPay POS System. A robust cloud-based platform designed for eateries of all sizes. EzPay POS helps you streamline operations, cut down on errors, and serve customers more quickly, whether you're running a franchise in Texas, a food truck in Oregon, or a bistro in New York. It's the clever way to run your restaurant from a single location thanks to its user-friendly interface, smooth integration's, and real-time reporting.
            </p>
            <Link to={createPageUrl("FreeDemo")}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl mt-8">
                Get a Free Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative max-w-4xl mx-auto"
          >
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/3887a616c_AGoldEZPayPOS.png"
              alt="EzPay POS software interface showing menu and order management features"
              className="w-full h-auto rounded-3xl shadow-2xl"
              loading="lazy"
              width="800"
              height="600"
            />
          </motion.div>
        </div>
      </section>

      {/* Cross Platform Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Manage your business in-store and online
              </h2>
              <p className="text-2xl text-gray-600">
                Introducing a truly customized cross-platform point-of-sale system
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Enhance Your Operations with EzPay POS
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                EzPay POS offers a variety of retail-specific add-ons, including inventory management, age verification, gift card integration, UPC-based item tracking, and support for weight, length, and size-based products. Additionally, EzPay POS provides loyalty programs to enhance customer retention and engagement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/3887a616c_AGoldEZPayPOS.png"
                alt="EzPay POS retail features including inventory management and loyalty programs"
                className="w-full h-auto rounded-2xl shadow-xl"
                loading="lazy"
                width="800"
                height="600"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
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
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300">
              Get started with EzPay POS today. No credit card required for your free trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                  Get a Free Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a
                href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg">
                  Apply Online Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}