import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
import ServiceSEOContent from "../components/landing/ServiceSEOContent";

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
        title="Cash Discount Program & Merchant Services for Small Business | EzPay America"
        description="Zero fee credit card processing, free POS systems, and complete merchant services for small businesses. No contracts, 24-hr approval. Serving retail, restaurants & more."
        keywords="cash discount program, zero fee credit card processing, merchant services for small business, payment processing solutions, credit card processing, free POS system, no fee payment processing, merchant account, retail payment processing, restaurant payment processing"
        url="https://ezpayamerica.com/Services"
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Cash Discount Program &amp; Merchant Services for Small Business</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Zero fee credit card processing, free POS equipment, and complete payment solutions — no contracts, no hidden fees
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

      <ServiceSEOContent
        heading="What Is the Cash Discount Program?"
        intro="The cash discount program is a legal, compliant merchant services model that eliminates credit card processing fees for business owners. Instead of paying 2–3% on every transaction, merchants display their regular price as the 'cash price.' Customers who pay by card see a small service fee added at checkout — covering the cost of processing. The result: you keep 100% of every sale, and your bottom line grows every single month."
        sections={[
          {
            h2: "How It Works",
            body: "EzPay America sets up your terminals, provides compliant in-store signage, and handles everything. Customers choose to pay cash and save, or pay by card with a transparent service fee. There's nothing hidden, nothing complicated — and you pay zero in processing fees.",
            bullets: [
              "Free terminal programming — we handle all the setup",
              "Compliant signage provided at no cost",
              "Works with Visa, Mastercard, Amex, Discover, Apple Pay & Google Pay",
              "No monthly fees, no setup fees, no cancellation fees",
              "Next-day or same-day funding available"
            ]
          },
          {
            h2: "Pros and Cons of the Cash Discount Program",
            body: "Like any business decision, it's important to understand both sides. Here's an honest breakdown:",
            bullets: [
              "✅ Pro: Eliminate 100% of your credit card processing costs",
              "✅ Pro: Completely legal and compliant when properly disclosed",
              "✅ Pro: Free POS equipment and setup included",
              "✅ Pro: Works for retail, restaurants, salons, healthcare, and more",
              "⚠️ Note: Requires proper in-store signage per card network rules",
              "⚠️ Note: Some customers may prefer cash — but most pay by card regardless"
            ]
          },
          {
            h2: "Is Zero Fee Credit Card Processing Legal?",
            body: "Yes — 100%. Cash discount and dual pricing programs are fully legal across all 50 states when implemented correctly. Card networks (Visa, Mastercard) explicitly allow merchants to offer a discount to cash-paying customers. EzPay America ensures your program is fully compliant with all required disclosures and terminal programming so you never have to worry."
          },
          {
            h2: "Who Should Use the Cash Discount Program?",
            body: "Any small business paying more than $100/month in processing fees stands to benefit. The more you process, the more you save. Our merchants typically save $300–$2,000+ per month after switching.",
            bullets: [
              "Retail stores, boutiques, and specialty shops",
              "Restaurants, cafes, bars, and food trucks",
              "Salons, spas, barber shops, and beauty businesses",
              "Medical, dental, and healthcare offices",
              "Service businesses, contractors, and home services",
              "Any business processing $5,000+/month in card payments"
            ]
          }
        ]}
        faqs={[
          { q: "How much can I save with the cash discount program?", a: "Most merchants save between $300 and $2,000+ per month depending on their processing volume. A business processing $50,000/month in cards at 2.5% was paying $1,250/month — with EzPay America's cash discount program, that cost drops to $0." },
          { q: "Does the cash discount program hurt my sales?", a: "Most merchants see no meaningful drop in sales. The vast majority of customers pay by card regardless of the small service fee, especially when it's properly disclosed and signage is clear. Many of our merchants report no change in customer behavior after switching." },
          { q: "What equipment do I need?", a: "EzPay America provides free terminals, card readers, and POS systems pre-programmed for your cash discount program. There's no equipment cost and no setup fee." },
          { q: "How long does approval take?", a: "Most merchants are approved within 24 hours. Once approved, equipment arrives and you can be processing within a few days." },
          { q: "Are there any hidden fees?", a: "No. EzPay America charges $0 in transaction fees under the cash discount program. There are no monthly fees, no annual fees, and no cancellation fees. You can leave at any time with no penalty." }
        ]}
        relatedLinks={[
          { label: "Retail Merchants", to: createPageUrl("RetailMerchants") },
          { label: "Restaurant Merchants", to: createPageUrl("RestaurantMerchants") },
          { label: "ACH Payments", to: createPageUrl("ACHPayments") },
          { label: "Merchant Cash Advance", to: createPageUrl("MerchantCashAdvance") },
          { label: "Web Payment Pages", to: createPageUrl("WebPaymentPages") },
          { label: "FAQ", to: createPageUrl("FAQ") }
        ]}
      />

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
            <Link to={createPageUrl("ApplyOnline")}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                Apply Online Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}