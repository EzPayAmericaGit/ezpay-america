import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Scissors, CreditCard, Shield, BarChart3, Clock, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, Smartphone, Users, Star, Gift } from "lucide-react";

const FEATURES = [
  { icon: CreditCard, title: "Zero Transaction Fees", description: "Every haircut, color, and service processed with $0 in fees. A salon doing $20,000/month saves $500–$700 every month compared to Square or Stripe.", color: "from-pink-500 to-rose-600" },
  { icon: Clock, title: "Appointment Booking Integration", description: "Sync payments with your booking software. Accept deposits at booking, charge no-show fees, and process checkout in seconds after each service.", color: "from-purple-500 to-purple-600" },
  { icon: Gift, title: "Gift Cards & Loyalty Programs", description: "Sell physical and digital gift cards. Reward loyal clients with a points program that tracks visits and automatically applies discounts.", color: "from-amber-500 to-orange-600" },
  { icon: Users, title: "Multi-Stylist Commission Tracking", description: "Split service revenue between booth renters or commission stylists automatically. Track individual performance and pay out commission from one dashboard.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Mobile & Tap-to-Pay", description: "Accept Apple Pay, Google Pay, and tap card payments anywhere in the salon — no fumbling with card readers or waiting for the checkout station.", color: "from-blue-500 to-blue-600" },
  { icon: BarChart3, title: "Service & Retail Reports", description: "Track service revenue vs. retail product sales, identify your highest-revenue stylists, and see peak booking hours to staff more effectively.", color: "from-indigo-500 to-indigo-600" },
  { icon: Shield, title: "No-Show Deposit Protection", description: "Require deposits at booking and charge configured fees for last-minute cancellations. Protect your revenue from appointment ghosting.", color: "from-green-500 to-green-600" },
  { icon: Star, title: "Client History & Notes", description: "Store client preferences, color formulas, allergy notes, and service history. Deliver a personalized experience every visit that earns loyalty.", color: "from-yellow-500 to-amber-600" },
];

const FAQS = [
  {
    q: "How does zero-fee processing work for hair salons?",
    a: "EzPay America's cash discount program adds a small service fee to card transactions (typically 3–4%) while displaying a 'cash price' for clients who pay with cash or debit. This is fully legal in all 50 states and compliant with Visa and Mastercard rules. Your clients see the pricing upfront on the terminal — most accept it without issue, especially after seeing the same model at gas stations and convenience stores for years."
  },
  {
    q: "Will my clients be upset about the service fee?",
    a: "In our experience with salons, the vast majority of clients accept the fee without complaint when it's displayed clearly and explained honestly. The key is training your front desk staff to handle the rare question. EzPay America provides signage and scripts to make the transition smooth. Most salons see 95%+ of clients continue paying by card with the service fee applied."
  },
  {
    q: "How much can my salon save?",
    a: "A salon processing $25,000/month saves approximately $625–$875/month at the typical 2.5–3.5% card rate. That's $7,500–$10,500 per year — money that stays in your business instead of going to the processor."
  },
  {
    q: "Does it work with booth renters?",
    a: "Yes. The EzPay America system can be configured for booth rental models where each stylist processes their own transactions independently, as well as commission models where the salon receives a percentage of each transaction. Our team configures the setup to match your business model."
  },
  {
    q: "Can I use it for both services and retail product sales?",
    a: "Absolutely. The POS handles service tickets and retail product sales on the same terminal. You can separate reporting between service revenue and product revenue, and track stylist retail commissions independently."
  },
  {
    q: "What if I already have a booking system like Vagaro or StyleSeat?",
    a: "EzPay America works alongside your existing booking platform. Payments are processed at checkout through the EzPay terminal while your booking software handles scheduling. Our team helps you build a workflow that doesn't disrupt your current operations."
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-pink-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-pink-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 leading-relaxed bg-white">{a}</div>}
    </div>
  );
}

export default function HairSalonPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Hair Salon POS System – Zero-Fee Payment Processing for Salons | EzPay America"
        description="Best POS and payment processing for hair salons. Zero transaction fees, tip management, gift cards, loyalty programs, booth renter support, and free hardware. Save $600–$1,000/month vs Square. Apply free."
        keywords="hair salon POS system, hair salon payment processing, salon credit card processing, zero fee salon POS, best POS for hair salon, salon merchant services, hair salon cash discount, beauty salon POS system, salon tip management, booth renter payment processing, hair salon loyalty program, salon POS software"
        url="https://ezpayamerica.com/HairSalonPOS"
        pageSchema={[
          {
            "@type": "Product",
            "name": "EzPay America Hair Salon POS System",
            "description": "Zero-fee payment processing for hair salons with tip management, gift cards, loyalty programs, and booth renter support.",
            "brand": { "@type": "Brand", "name": "EzPay America" },
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "176", "bestRating": "5" }
          }
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 pt-32 pb-20 px-4 overflow-hidden">
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-pink-700">
              <Scissors className="w-4 h-4" /> Hair Salon POS & Payments
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Hair Salon POS With <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">Zero Processing Fees</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Hair salons pay thousands of dollars per year in unnecessary credit card fees. EzPay America eliminates those fees entirely — free POS hardware, tip management, gift cards, loyalty programs, and booth renter support, all with $0 in transaction fees.
            </p>
            <ul className="space-y-3">
              {[
                "Zero credit card processing fees",
                "Tip prompts on every transaction",
                "Gift cards & loyalty points program",
                "Multi-stylist & booth renter support",
                "Service + retail sales on one terminal",
                "Free countertop & wireless terminals"
              ].map(b => (
                <li key={b} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Get Free Salon POS <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="tel:8653169625">
                <button className="w-full sm:w-auto border-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                  Call (865) 316-9625
                </button>
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&h=500&fit=crop"
              alt="Hair salon POS system with zero transaction fees, tip management, and gift card processing"
              className="rounded-3xl shadow-2xl w-full h-auto"
              loading="eager"
              width="700"
              height="500"
            />
          </div>
        </div>
      </section>

      {/* Savings */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">How Much Is Your Salon Overpaying?</h2>
          <p className="text-gray-300 mb-10">Square charges 2.6% + 10¢ per swipe. Stripe charges 2.9% + 30¢. EzPay America charges $0.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { vol: "$10k/mo", save: "$300", yr: "$3,600/yr" },
              { vol: "$20k/mo", save: "$600", yr: "$7,200/yr" },
              { vol: "$40k/mo", save: "$1,200", yr: "$14,400/yr" },
              { vol: "$70k/mo", save: "$2,100", yr: "$25,200/yr" },
            ].map(r => (
              <div key={r.vol} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 space-y-2 text-center">
                <div className="text-pink-400 font-bold text-lg">{r.vol}</div>
                <div className="text-gray-400 text-sm">Monthly Volume</div>
                <div className="border-t border-gray-700 pt-3 mt-2">
                  <div className="text-3xl font-bold text-green-400">{r.save}</div>
                  <div className="text-gray-300 text-sm">saved/month</div>
                  <div className="text-white font-semibold mt-1">{r.yr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything Your Salon Needs to Accept Payments</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Built for the realities of salon business — tips, multiple stylists, gift cards, and product sales all handled in one place.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow space-y-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salon Types */}
      <section className="py-16 px-4 bg-pink-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Salon & Beauty Businesses We Serve</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { type: "Full-Service Hair Salons", desc: "Cuts, color, highlights, keratin, and styling with tip prompts and multi-stylist tracking." },
              { type: "Booth Rental Salons", desc: "Each stylist processes independently with separate reporting and daily settlements." },
              { type: "Barber Shops", desc: "Quick checkout, tip prompts, and loyalty punch cards for return clientele." },
              { type: "Nail Salons", desc: "Multiple technicians, tip splitting, and retail product sales on one system." },
              { type: "Med Spas & Aestheticians", desc: "Higher-ticket services with deposit collection and recurring membership billing." },
              { type: "Makeup Artists & Mobile", desc: "Mobile tap-to-pay for on-location services — weddings, events, photo shoots." },
            ].map(item => (
              <div key={item.type} className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
                <div className="font-bold text-gray-900 mb-2">{item.type}</div>
                <div className="text-gray-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-500 to-rose-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Your Salon Deserves Zero-Fee Processing</h2>
          <p className="text-xl text-pink-100">Free hardware. No monthly fees. No transaction fees. Switch in 48 hours with no disruption to your clients.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("ApplyOnline")}>
              <button className="w-full sm:w-auto bg-white text-pink-600 hover:bg-pink-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-colors">
                Apply Free — No Contract
              </button>
            </Link>
            <a href="tel:8653169625">
              <button className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
                Call (865) 316-9625
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}