import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Store, BarChart3, Package, CreditCard, Zap, Shield, Smartphone, RefreshCw, HeadphonesIcon, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, Star } from "lucide-react";

const FEATURES = [
  { icon: Store, title: "Cloud-Based Retail POS", description: "Your full retail operation runs in the cloud — access sales, inventory, and staff data from any device, anywhere. Works on iPads, tablets, and desktop terminals.", color: "from-amber-500 to-orange-600" },
  { icon: Package, title: "Advanced Inventory Management", description: "Real-time stock tracking across every SKU and variant. Auto low-stock alerts, purchase order generation, and vendor management built in. Never run out of your best sellers.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero-Fee Credit Card Processing", description: "Accept Visa, Mastercard, Amex, Discover, Apple Pay, and Google Pay with zero transaction fees. Save 2.5–3% on every sale through EzPay America's cash discount program.", color: "from-green-500 to-green-600" },
  { icon: BarChart3, title: "Sales & Performance Reports", description: "Daily close reports, hourly sales breakdowns, top-selling items, customer purchase history, and staff performance — all with one click.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "Fast Checkout — Barcode & NFC", description: "Barcode scanning, quick-key product buttons, and tap-to-pay NFC reduce checkout to seconds. Shorter lines, happier customers, faster revenue.", color: "from-yellow-500 to-amber-600" },
  { icon: Shield, title: "Employee & Permission Management", description: "Set role-based access controls, track clock-in/out, monitor individual sales by employee, and require manager approval for refunds and discounts.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Mobile POS & Line Busting", description: "Use tablets to bust lines during busy periods, accept payments anywhere on the floor, and manage pop-ups or markets with a fully mobile setup.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Loyalty Programs & Gift Cards", description: "Built-in customer loyalty rewards, points tracking, digital gift cards, and promotional discount tools to drive repeat business without third-party apps.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "US-Based 24/7 Support", description: "Our retail POS specialists are available around the clock. Whether it's a product import issue or a payment question, we pick up — not a bot.", color: "from-indigo-500 to-indigo-600" },
];

const FAQS = [
  {
    q: "How does zero-fee credit card processing work for retail stores?",
    a: "EzPay America's cash discount program adds a small service fee to card transactions while offering a discount to cash customers. This is 100% compliant with Visa, Mastercard, and Discover rules and completely legal in all 50 states. The result: you pay $0 in processing fees. A retail store processing $30,000/month saves approximately $900 every single month."
  },
  {
    q: "Can I import my existing product catalog?",
    a: "Yes. Our team imports your product catalog, including SKUs, barcodes, categories, pricing, and current inventory counts. If you're coming from Square, Clover, or another system, we handle the migration at no charge."
  },
  {
    q: "Does the retail POS support multiple locations?",
    a: "Absolutely. The EzPay America retail POS supports multi-location management with centralized inventory, consolidated reporting, and individual store controls. Each location shares a single cloud database so stock transfers and reporting are seamless."
  },
  {
    q: "What hardware do I get for free?",
    a: "Standard retail package includes a tablet POS terminal, cash drawer, receipt printer, and barcode scanner. Larger stores may qualify for additional hardware. All equipment is provisioned and programmed before it arrives."
  },
  {
    q: "Is the inventory management really included at no cost?",
    a: "Yes — full inventory management including purchase orders, vendor management, and variant tracking is included at zero cost. There are no add-on fees or module upgrades. Everything is included."
  },
  {
    q: "How does it compare to Square for Retail?",
    a: "Square charges 2.6% + 10¢ per in-person transaction and monthly fees for advanced features. EzPay America charges $0 in transaction fees and $0 in monthly software fees. For a store doing $50,000/month, that's $1,300+ saved every month compared to Square."
  },
];

const RETAIL_TYPES = [
  { type: "Clothing Boutiques", desc: "Size/color variants, customer wishlists, and layaway management." },
  { type: "Grocery & Specialty Food", desc: "Weight-based pricing, bulk items, and age verification." },
  { type: "Vape & CBD Stores", desc: "High-risk compliant processing with full inventory tracking." },
  { type: "Gift & Souvenir Shops", desc: "Seasonal inventory, gift wrapping services, and tour group discounts." },
  { type: "Liquor Stores", desc: "Age verification prompts, case discounts, and loyalty pricing." },
  { type: "Pet Stores", desc: "Food bag weight variants, grooming service tickets, and subscription food orders." },
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

export default function RetailPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Retail POS System – Free Cloud POS With Zero Transaction Fees | EzPay America"
        description="Best retail POS system with zero transaction fees. Cloud-based inventory management, loyalty programs, barcode scanning, multi-location, and free hardware. Better than Square for Retail. Apply free today."
        keywords="retail POS system, best retail POS, free retail POS system, cloud POS for retail stores, retail point of sale system, retail store POS software, inventory management POS, zero fee retail processing, retail POS vs Square, small business retail POS, boutique POS system, retail credit card processing no fees"
        url="https://ezpayamerica.com/RetailPOS"
        pageSchema={[
          {
            "@type": "Product",
            "name": "EzPay America Retail POS System",
            "description": "Cloud-based retail POS system with zero transaction fees, inventory management, loyalty programs, and free hardware.",
            "brand": { "@type": "Brand", "name": "EzPay America" },
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "284", "bestRating": "5" }
          }
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-32 pb-20 px-4 overflow-hidden">
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-indigo-700">
              <Store className="w-4 h-4" /> Retail POS System
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              The Retail POS That Costs <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">You Nothing</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              EzPay America's cloud-based retail POS gives you everything to run and grow your store — full inventory management, customer loyalty, employee tracking, and zero-fee payment processing — all included with free hardware and no monthly software fees.
            </p>
            <ul className="space-y-3">
              {[
                "Zero credit card processing fees — ever",
                "Full cloud POS + inventory management — free",
                "Free barcode scanner, receipt printer & cash drawer",
                "Customer loyalty & digital gift cards built in",
                "Multi-location & multi-register support",
                "Approved in 24 hours, live in 48"
              ].map(b => (
                <li key={b} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Get Free Retail POS <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="tel:8653169625">
                <button className="w-full sm:w-auto border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                  Call (865) 316-9625
                </button>
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&h=500&fit=crop"
              alt="Retail store POS system with cloud inventory management and zero transaction fees"
              className="rounded-3xl shadow-2xl w-full h-auto"
              loading="eager"
              width="700"
              height="500"
            />
          </div>
        </div>
      </section>

      {/* Square Comparison */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">EzPay America vs. Square for Retail</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                  <th className="text-center py-3 px-4 text-amber-400">EzPay America</th>
                  <th className="text-center py-3 px-4 text-gray-400">Square for Retail</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Monthly Software Fee", "$0", "$60+/mo"],
                  ["Transaction Fee", "$0", "2.6% + 10¢"],
                  ["Hardware", "Free", "$299–$799+"],
                  ["Inventory Management", "✓ Included", "✓ Plus plan only"],
                  ["Loyalty Programs", "✓ Free", "Add-on cost"],
                  ["Multi-Location", "✓ Free", "Extra monthly fee"],
                  ["24/7 US Support", "✓ Included", "Limited"],
                  ["Savings on $40k/mo", "$1,040+/mo", "$0"],
                ].map(([feat, ez, sq]) => (
                  <tr key={feat} className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-300">{feat}</td>
                    <td className="py-3 px-4 text-center text-green-400 font-semibold">{ez}</td>
                    <td className="py-3 px-4 text-center text-gray-400">{sq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything a Retail POS Should Do</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">A complete retail management platform — not just a card reader.</p>
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

      {/* Retail Types */}
      <section className="py-16 px-4 bg-indigo-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Retail Stores We Serve</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {RETAIL_TYPES.map(item => (
              <div key={item.type} className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm">
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
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Get Your Free Retail POS Today</h2>
          <p className="text-xl text-indigo-100">No monthly fees. No transaction fees. Free hardware. The best retail POS value in the USA.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("ApplyOnline")}>
              <button className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-colors">
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