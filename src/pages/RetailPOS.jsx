import React, { useState, useEffect } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Store, BarChart3, Package, CreditCard, Zap, Shield, Smartphone,
  RefreshCw, HeadphonesIcon, CheckCircle2, ArrowRight, ChevronDown,
  ChevronUp, Star, TrendingUp, AlertCircle, DollarSign, Tag
} from "lucide-react";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-indigo-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-indigo-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 leading-relaxed bg-white">{a}</div>}
    </div>
  );
}

const FEATURES = [
  { icon: Store, title: "Cloud-Based Retail POS — Any Device", description: "Your complete retail operation lives in the cloud. Access sales dashboards, real-time inventory, staff reports, and customer data from any iPad, tablet, or desktop terminal — whether you're on the floor, in the back office, or checking numbers from home at midnight.", color: "from-indigo-500 to-purple-600" },
  { icon: Package, title: "Advanced Inventory — Down to the Variant", description: "Track every SKU, size, color, and variant in real time. Receive automatic low-stock alerts before you run out. Generate purchase orders to vendors with one click. Manage returned and damaged merchandise. The EzPay inventory system handles operations that retail businesses used to pay $300/month for separately.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero-Fee Processing — All Card Types", description: "Accept Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay, Samsung Pay, and contactless cards — all with $0 in transaction fees. EzPay America's compliant cash discount program means every dollar of every sale hits your account, not your processor's ledger.", color: "from-green-500 to-green-600" },
  { icon: BarChart3, title: "Retail Analytics That Actually Help", description: "Daily close reports, hourly sales trends, best-selling products by margin (not just volume), employee sales performance, customer lifetime value, and inventory turnover reports. Real retail intelligence — not just transaction logs — to help you make better buying and staffing decisions.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "Barcode Scanning & NFC Checkout in Seconds", description: "Barcode scan, tap card, done — in under 10 seconds per transaction. Quick-key buttons for your top movers. Built-in NFC reader for Apple Pay and Google Pay tap payments. Shorter lines mean customers buy more and come back sooner.", color: "from-amber-500 to-orange-600" },
  { icon: Shield, title: "Employee Management & Access Controls", description: "Set role-based access so cashiers can only run sales, managers can approve discounts, and admins see everything. Track individual clock-in and clock-out. Monitor sales by employee. Require manager PINs for refunds, voids, and large discounts — accountability baked in.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Mobile POS & Line Busting", description: "Add wireless tablets to your retail floor during busy seasons. Bust checkout lines, process payments anywhere in the store, or run pop-ups and markets without a fixed register. Your POS goes where your customers are.", color: "from-pink-500 to-pink-600" },
  { icon: RefreshCw, title: "Loyalty Programs & Digital Gift Cards", description: "Build real loyalty — not just a stamp card. Point-based rewards programs that track purchase history and automatically apply discounts. Digital and physical gift card programs. Promotional codes for sales events. All built into the POS at no additional cost.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "US-Based Support — Real Retail People", description: "When you call EzPay America's support line, you reach a person who understands retail — not a bot reading from a script. Hardware issue? Product import problem? Payment question? We solve it on the first call, not the third ticket.", color: "from-cyan-500 to-cyan-600" },
];

const RETAIL_TYPES = [
  { type: "Clothing & Fashion Boutiques", desc: "Size/color variant tracking, customer wishlists, layaway management, and seasonal inventory rotation." },
  { type: "Grocery & Specialty Food Stores", desc: "Weight-based pricing, bulk item discounts, age verification prompts, and EBT/SNAP card acceptance." },
  { type: "Vape, Smoke & CBD Shops", desc: "High-risk compliant processing with full inventory control, age gate, and compliance reporting." },
  { type: "Gift Shops & Souvenir Stores", desc: "Seasonal and tourism-volume inventory, consignment items, and group discount pricing for tour operators." },
  { type: "Liquor Stores & Wine Shops", desc: "Age verification at every transaction, case-break pricing, loyalty discounts, and state compliance reporting." },
  { type: "Pet Stores & Supply Shops", desc: "Food bag weight variants, grooming service tickets, subscription food programs, and vet-visit bundling." },
  { type: "Sporting Goods & Outdoor Gear", desc: "Serialized item tracking for firearms compliance, rental item management, and seasonal SKU rotation." },
  { type: "Jewelry & Accessories", desc: "High-value item tracking with serialized inventory, appraisal records, and consignment merchandise." },
];

const FAQS = [
  { q: "How does zero-fee credit card processing work for retail stores?", a: "EzPay America's cash discount program adds a transparent service fee to card transactions (typically 3–4%) and displays a cash discount for customers who pay with cash or PIN debit. This model is 100% compliant with Visa, Mastercard, Discover, and Amex operating rules and legal in all 50 states. The result: every dollar of every card sale reaches your account. A retail store processing $30,000/month saves approximately $900 per month compared to paying a 3% processing rate." },
  { q: "Can I import my existing product catalog from Square or Clover?", a: "Yes. Our onboarding team imports your complete product catalog including SKUs, barcodes, categories, pricing tiers, and current inventory quantities. We handle migrations from Square, Clover, Shopify POS, Lightspeed, and most other systems at no charge. If your catalog is in a spreadsheet, we import that too." },
  { q: "Does the retail POS support multiple store locations?", a: "Yes — multi-location management is included at no extra cost. The EzPay cloud POS gives each location its own inventory and reporting while sharing a centralized database for stock transfers, consolidated sales reports, and unified employee management. Add new locations without new software fees." },
  { q: "What hardware does a retail store get for free?", a: "Standard retail package includes a tablet POS terminal, cash drawer, thermal receipt printer, and barcode scanner — all provisioned, programmed with your products, and ready to use from day one. Larger stores with multiple checkout lanes may qualify for additional hardware. Contact our team to discuss your specific setup." },
  { q: "Is advanced inventory management really free?", a: "Yes — everything. Purchase order generation, vendor management, variant tracking (size, color, style), low-stock alerts, shrinkage tracking, and multi-location stock transfers are all included at zero cost. No add-on modules, no tiered plans, no feature unlocking fees." },
  { q: "How does EzPay America compare to Square for Retail?", a: "Square charges 2.6% + 10¢ per in-person transaction plus $60/month for advanced retail features. EzPay America charges $0 in transaction fees and $0 in monthly software fees. For a store doing $50,000/month, that's $1,300+ in monthly savings compared to Square for Retail Plus. Hardware is free with EzPay vs. $300–$800 with Square." },
  { q: "Can I accept Apple Pay and Google Pay?", a: "Yes. All EzPay America terminals include NFC contactless readers that accept Apple Pay, Google Pay, Samsung Pay, and any tap-to-pay card. Contactless payments are processed with zero fees just like any other card — no different rate for NFC payments." },
];

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "EzPay America Retail POS System",
  "description": "Cloud-based retail point of sale system with zero transaction fees, full inventory management, customer loyalty programs, multi-location support, and free hardware. No monthly software fees.",
  "url": "https://ezpayamerica.com/retailpos",
  "image": "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&h=500&fit=crop",
  "brand": {
    "@type": "Brand",
    "name": "EzPay America"
  },
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://ezpayamerica.com/ApplyOnline",
    "priceValidUntil": "2027-12-31",
    "seller": {
      "@type": "Organization",
      "name": "EzPay America",
      "url": "https://ezpayamerica.com"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "284",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "Maria S."
      },
      "datePublished": "2025-03-10",
      "reviewBody": "Switched from Square and saving over $1,000 a month in fees. The inventory system is just as powerful and the support team is outstanding."
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": "James T."
      },
      "datePublished": "2025-01-22",
      "reviewBody": "Best decision I made for my boutique. Zero fees, free hardware, and setup was done in two days. Highly recommend."
    }
  ]
};

export default function RetailPOS() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA) }}
      />
      <SEOHead
        title="Retail POS System – Free Cloud POS With Zero Transaction Fees | EzPay America"
        description="The best retail POS system with zero credit card transaction fees. Cloud-based inventory management, customer loyalty programs, barcode scanning, multi-location support, and free hardware. Better than Square for Retail and Clover. No monthly fees. Apply free today."
        keywords="retail POS system, best retail POS system 2025, free retail point of sale, cloud POS for retail stores, retail store POS software, inventory management POS, zero fee retail processing, retail POS vs Square, small business retail POS, boutique POS system, retail credit card processing no fees, retail store merchant services, multi-location retail POS, retail loyalty program POS"
        url="https://ezpayamerica.com/retailpos"
        suppressFaq={true}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 30%, #818cf8 0%, transparent 55%)" }} />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-sm font-semibold text-indigo-300">
              <Store className="w-4 h-4" /> Retail POS System — $0/Month
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              The Retail POS That<br />
              <span className="text-indigo-300">Pays For Itself</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              Most retail POS systems charge you twice — monthly software fees AND transaction fees. EzPay America charges you <strong className="text-white">neither</strong>. Full cloud POS, advanced inventory, customer loyalty, and free hardware. Zero monthly fees. Zero transaction fees. Approved in 24 hours.
            </p>
            <ul className="space-y-3">
              {[
                "Zero credit card processing fees — every sale, every time",
                "Full cloud inventory with variants, POs & vendor management",
                "Free barcode scanner, receipt printer & cash drawer",
                "Built-in customer loyalty & digital gift card program",
                "Multi-location & multi-register support included",
                "Free product catalog migration from Square or Clover",
              ].map(b => (
                <li key={b} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Get Free Retail POS <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="tel:8653169625">
                <button className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                  Call (865) 316-9625
                </button>
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=700&h=500&fit=crop"
              alt="Retail store point of sale system with cloud inventory management and zero transaction fees"
              className="rounded-3xl shadow-2xl w-full h-auto border border-white/10"
              loading="eager" width="700" height="500"
            />
          </div>
        </div>
      </section>

      {/* Cost Reality */}
      <section className="bg-indigo-50 border-y border-indigo-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <AlertCircle className="w-12 h-12 text-indigo-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">What Square Is Costing Your Store Right Now</h2>
              <p className="text-gray-700 leading-relaxed">
                A retail store processing <strong>$40,000/month</strong> with Square for Retail Plus pays <strong>$60/month in software fees</strong> plus <strong>$1,044/month in transaction fees</strong> (2.6% + 10¢). That's <strong>$13,248 per year</strong> — money that could be buying inventory, renovating your store, or sitting in your savings account. EzPay America's cost for the same volume: <strong>$0</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Square Comparison */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-3">EzPay America vs. Square for Retail vs. Clover</h2>
          <p className="text-gray-400 text-center mb-10">The numbers that matter to retail store owners:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                  <th className="text-center py-3 px-4 text-indigo-400 font-bold">EzPay America</th>
                  <th className="text-center py-3 px-4 text-gray-400">Square Retail+</th>
                  <th className="text-center py-3 px-4 text-gray-400">Clover Station</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Monthly Software Fee", "$0", "$60/mo", "$90+/mo"],
                  ["Transaction Fee", "$0", "2.6% + 10¢", "2.3–2.6%"],
                  ["Hardware Cost", "Free", "$299–$799+", "$1,099+"],
                  ["Inventory Management", "✓ All tiers", "✓ Plus+ only", "✓ Add-on fee"],
                  ["Loyalty Programs", "✓ Included", "Add-on", "Add-on fee"],
                  ["Multi-Location", "✓ Free", "Add-on fee", "Per-location fee"],
                  ["Product Migration", "✓ Free", "Self-service", "Self-service"],
                  ["24/7 US Support", "✓ Included", "Business hours", "Business hours"],
                  ["Savings on $40k/mo", "$1,104+/mo", "$0", "$0"],
                ].map(([feat, ez, sq, cl]) => (
                  <tr key={feat} className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-300">{feat}</td>
                    <td className="py-3 px-4 text-center text-green-400 font-semibold">{ez}</td>
                    <td className="py-3 px-4 text-center text-gray-400">{sq}</td>
                    <td className="py-3 px-4 text-center text-gray-400">{cl}</td>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">A Complete Retail Platform — Not Just a Card Reader</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Every feature a retail store needs to run, grow, and serve customers efficiently — all in one system with zero monthly cost.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all space-y-4">
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

      {/* SEO Content */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Retail Store Owners Switch to EzPay America</h2>
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              Running a retail store in 2025 is more competitive than ever. Margins are thinner, inventory costs are higher, and customer expectations have risen. The last thing a retail owner should be doing is paying their payment processor thousands of dollars per year in transaction fees and software subscriptions that deliver no additional value.
            </p>
            <p>
              EzPay America eliminates those costs entirely. The cash discount program — legal in all 50 states and approved by all major card networks — offsets processing costs through a transparent customer service fee. Your pricing is displayed clearly at the terminal. Cash customers receive a discount. Card customers pay the posted price. You pay nothing.
            </p>
            <p>
              Beyond zero fees, the EzPay retail POS delivers enterprise-level inventory management that used to require a separate subscription. Variant tracking for clothing stores (size, color, style), weight-based pricing for grocery and specialty food stores, serialized inventory for sporting goods and electronics dealers, and age verification for liquor and tobacco retailers — all built in and configured to match your specific retail category.
            </p>
            <p>
              Customer loyalty programs drive repeat business, and EzPay America includes a full points-based loyalty system at no additional charge. Digital gift cards generate upfront revenue. And the analytics dashboard gives you the merchandising intelligence — margin by SKU, turnover velocity, peak sales windows — that helps you buy better and discount smarter.
            </p>
          </div>
        </div>
      </section>

      {/* Retail Types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Retail Stores We Serve</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">The EzPay retail POS is configured specifically for your store type — not a generic system you have to rebuild from scratch.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RETAIL_TYPES.map(item => (
              <div key={item.type} className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <div className="font-bold text-gray-900 mb-2 text-sm">{item.type}</div>
                <div className="text-gray-600 text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Retail POS — Questions & Answers</h2>
          <p className="text-gray-500 text-center mb-10">What retail owners ask before making the switch:</p>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-white fill-white" />)}
          </div>
          <h2 className="text-4xl font-bold">Get Your Free Retail POS Today</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">No monthly fees. No transaction fees. Free hardware and free product migration. The most cost-effective retail POS in the United States.</p>
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
          <p className="text-indigo-200 text-sm">Approved in 24 hours · Live in 48 hours · No monthly fees · No transaction fees</p>
        </div>
      </section>
    </div>
  );
}