import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Utensils, BarChart3, Clock, CreditCard, Zap, Shield, Smartphone, Star, HeadphonesIcon, CheckCircle2, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const FEATURES = [
  { icon: Utensils, title: "Table Management & Floor Plans", description: "Drag-and-drop visual floor plan lets hosts seat guests, track table status, manage party sizes, and assign servers in real time. No more sticky notes or whiteboard chaos.", color: "from-amber-500 to-orange-600" },
  { icon: Star, title: "Kitchen Display System (KDS)", description: "Orders fire directly to the kitchen screen the moment they're entered — no paper tickets, no shouting across the kitchen. Reduce ticket errors by up to 60%.", color: "from-red-500 to-red-600" },
  { icon: CreditCard, title: "Split Checks, Tip Adjust & Comps", description: "Split bills by seat, item, or percentage. Adjust tips at end of night. Comp items with manager approval. Every scenario handled in seconds.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Online Ordering Integration", description: "Accept online orders through your branded ordering page. Orders flow directly into the POS and kitchen display — no manual entry, no missed tickets.", color: "from-blue-500 to-blue-600" },
  { icon: Clock, title: "Tableside Ordering & Payment", description: "Servers use wireless handhelds to take orders and process payments at the table. Faster table turns, fewer errors, and on average 20% higher tip amounts.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Menu Engineering & Sales Reports", description: "Identify your top-selling items, slowest movers, and highest-margin dishes. Make data-driven menu decisions that increase profitability without raising prices.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "Zero Transaction Fees", description: "EzPay America's cash discount program means you pay $0 in credit card fees. A restaurant processing $80,000/month saves over $2,400 every single month.", color: "from-yellow-500 to-amber-600" },
  { icon: Smartphone, title: "Offline Mode & Reliability", description: "Power outage? WiFi down? The EzPay POS continues processing locally and syncs automatically when reconnected — your service never stops.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "24/7 Restaurant-Focused Support", description: "Our support team understands the restaurant business — peak-hour rushes, late-night closings, pre-event prep. Available any time you need us.", color: "from-indigo-500 to-indigo-600" },
];

const FAQS = [
  {
    q: "How much does the EzPay restaurant POS cost?",
    a: "The EzPay America restaurant POS is completely free — no monthly software fees, no setup fees, and no per-transaction fees. Equipment is provided at no cost. Our revenue comes from the small customer service fee built into the cash discount program, not from your pocket."
  },
  {
    q: "Is the cash discount program legal for restaurants?",
    a: "Yes. The cash discount program is 100% legal in all 50 states and fully compliant with Visa, Mastercard, Discover, and Amex network rules. Unlike a surcharge (which has legal restrictions), a cash discount rewards cash customers rather than penalizing card customers — a critical legal distinction."
  },
  {
    q: "How long does it take to set up?",
    a: "Most restaurants are fully operational within 48–72 hours of approval. Our installation team programs your menu, sets up your floor plan, configures the KDS, and trains your staff. Same-day approvals are available for most applicants."
  },
  {
    q: "Does it work with my existing online ordering platform?",
    a: "EzPay America integrates with the leading third-party online ordering platforms. For restaurants who want a branded ordering page, we provide one free of charge that connects directly to your POS."
  },
  {
    q: "What types of restaurants use EzPay America?",
    a: "Full-service restaurants, fast casual, bars and pubs, cafes, food trucks, bakeries, delis, pizza shops, and fine dining. Our POS adapts to your service model — whether you're using table service, counter service, or a hybrid."
  },
  {
    q: "What if my internet goes down during service?",
    a: "The EzPay POS has full offline mode. It processes transactions locally and queues them for sync when connection is restored. You'll never lose a table during a busy Friday dinner service."
  },
];

const SAVINGS = [
  { volume: "$20,000/mo", fees: "$600", saved: "$7,200/yr" },
  { volume: "$50,000/mo", fees: "$1,500", saved: "$18,000/yr" },
  { volume: "$80,000/mo", fees: "$2,400", saved: "$28,800/yr" },
  { volume: "$120,000/mo", fees: "$3,600", saved: "$43,200/yr" },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-amber-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-amber-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 leading-relaxed bg-white">{a}</div>}
    </div>
  );
}

export default function RestaurantPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Restaurant POS System – Free Zero-Fee POS for Restaurants | EzPay America"
        description="Best restaurant POS system with zero transaction fees. Table management, kitchen display system, online ordering, split checks, tableside payments & free equipment. Full-service, fast casual & food truck. Apply free today."
        keywords="restaurant POS system, best restaurant POS, free restaurant POS system, restaurant point of sale, table management POS, kitchen display system, restaurant payment processing, zero fee restaurant POS, restaurant credit card processing, restaurant cash discount, tableside ordering system, restaurant POS software 2024"
        url="https://ezpayamerica.com/RestaurantPOS"
        pageSchema={[
          {
            "@type": "Product",
            "name": "EzPay America Restaurant POS System",
            "description": "Zero-fee restaurant point of sale system with table management, kitchen display, online ordering, and free hardware.",
            "brand": { "@type": "Brand", "name": "EzPay America" },
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "312", "bestRating": "5" }
          }
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 right-10 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
        </div>
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-amber-700">
              <Utensils className="w-4 h-4" /> Restaurant POS System
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Restaurant POS System With <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Zero Transaction Fees</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              The most complete restaurant POS available — and it costs you nothing. Table management, kitchen display system, online ordering, split checks, and tableside payments, all with $0 in processing fees. EzPay America serves full-service restaurants, fast casual, bars, cafes, delis, and food trucks nationwide.
            </p>
            <ul className="space-y-3">
              {["Free restaurant POS hardware & software", "Zero credit card transaction fees", "Table management & visual floor plan", "Kitchen display system included", "Online ordering & tableside payments", "24-hour approval, setup in 48 hours"].map(b => (
                <li key={b} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Get Your Free Restaurant POS <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="tel:8653169625">
                <button className="w-full sm:w-auto border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                  Call (865) 316-9625
                </button>
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=500&fit=crop"
              alt="Restaurant POS system with table management and kitchen display for full-service restaurants"
              className="rounded-3xl shadow-2xl w-full h-auto"
              loading="eager"
              width="700"
              height="500"
            />
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">How Much Could Your Restaurant Save?</h2>
          <p className="text-gray-300 mb-10">The average restaurant pays 2.5–3% per transaction. With EzPay America, those fees go to $0.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {SAVINGS.map(row => (
              <div key={row.volume} className="bg-gray-800 rounded-2xl p-6 text-center space-y-2 border border-gray-700">
                <div className="text-amber-400 font-bold text-lg">{row.volume}</div>
                <div className="text-gray-400 text-sm">Monthly Volume</div>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="text-3xl font-bold text-green-400">{row.fees}</div>
                  <div className="text-gray-300 text-sm">saved each month</div>
                  <div className="text-white font-semibold mt-1">{row.saved}/year</div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything Your Restaurant Needs in One POS</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">From the host stand to the kitchen to the bar — the EzPay America restaurant POS is built for the way restaurants actually work.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow space-y-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Built for Every Type of Restaurant</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { type: "Full-Service Restaurants", desc: "Multi-course dining with table management, course firing, server sections, and tip pooling." },
              { type: "Fast Casual & Counter Service", desc: "Quick queue processing, order numbering, and customer display screens." },
              { type: "Bars & Pubs", desc: "Tab management, drink modifiers, happy hour pricing, and bar tab splitting." },
              { type: "Cafes & Coffee Shops", desc: "Modifier stacking (milk types, extras), loyalty punch cards, and tip prompts." },
              { type: "Food Trucks", desc: "Mobile 4G LTE processing, offline mode, and fast walk-up queue management." },
              { type: "Bakeries & Delis", desc: "Weight-based pricing, daily specials, and counter service with kitchen printing." },
            ].map(item => (
              <div key={item.type} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
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
      <section className="py-20 px-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Your Free Restaurant POS Is Ready</h2>
          <p className="text-xl text-amber-100">Zero fees. Free equipment. 48-hour setup. No contracts. Join thousands of restaurants saving thousands per year with EzPay America.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("ApplyOnline")}>
              <button className="w-full sm:w-auto bg-white text-amber-600 hover:bg-amber-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-colors">
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