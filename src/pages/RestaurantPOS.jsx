import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Utensils, BarChart3, Clock, CreditCard, Zap, Shield, Smartphone,
  Star, HeadphonesIcon, CheckCircle2, ArrowRight, ChevronDown, ChevronUp,
  Wifi, Users, DollarSign, TrendingUp, AlertCircle
} from "lucide-react";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
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

const FEATURES = [
  { icon: Utensils, title: "Visual Table Management & Floor Plans", description: "Build your exact floor plan — dining room, patio, bar, private rooms. Hosts drag guests to open tables, servers see status in real time, and managers monitor the entire restaurant from a single screen. No more guessing who's waiting, who needs their check, or which server is overloaded.", color: "from-amber-500 to-orange-600" },
  { icon: Star, title: "Kitchen Display System (KDS)", description: "The moment a server submits an order, it appears on the kitchen display — no paper tickets, no relay, no shouted modifications. Items color-code by cook time, modifiers display clearly, and completed items check off automatically. Studies show KDS systems reduce order errors by up to 60% and improve ticket times by 30%.", color: "from-red-500 to-red-600" },
  { icon: CreditCard, title: "Split Checks, Tip Adjust & Full Comp Control", description: "Split bills any way a guest asks — by seat, by item, by percentage, or by custom amount. Adjust tips at close-of-night batch. Comp individual items or entire tables with manager-approval audit trails. Handle every scenario your dining room throws at you without slowing anyone down.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Online Ordering — Branded & Commission-Free", description: "Accept online orders through your own branded ordering page — not DoorDash or Grubhub. Orders route directly into your POS and kitchen display the moment they're placed. No tablet juggling, no manual entry, and no 30% commission eating into your margins.", color: "from-blue-500 to-blue-600" },
  { icon: Clock, title: "Tableside Ordering & Pay-at-Table", description: "Equip your servers with wireless handheld devices to take orders and process payments at the table — or at the bar. Research shows tableside ordering reduces average ticket time by 7 minutes, increases check averages by 15%, and raises tip percentages by 20%. The math makes it a no-brainer.", color: "from-purple-500 to-purple-600" },
  { icon: BarChart3, title: "Menu Engineering & Profitability Reports", description: "Know your stars, plowhorses, puzzles, and dogs. The EzPay analytics dashboard shows margin by menu item, volume by time of day, server performance, and waste tracking. Real operators use this data to increase margin without changing a single price on the menu.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "Zero Transaction Fees — Guaranteed", description: "EzPay America's compliant cash discount program means you pay $0 in credit card fees. Every penny of every card transaction reaches your account. A restaurant processing $80,000/month saves $2,400 to $2,800 per month — money that goes to payroll, inventory, and your bottom line instead of Visa and Stripe.", color: "from-yellow-500 to-amber-600" },
  { icon: Wifi, title: "True Offline Mode — Service Never Stops", description: "Power outage? Venue WiFi failure? Dead zone? The EzPay restaurant POS processes and stores transactions locally and syncs the moment connectivity is restored. No voided tables, no lost revenue, no embarrassed managers — just uninterrupted service no matter what happens to your internet.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "Restaurant-Industry Support — Any Hour", description: "Our support team is staffed by people who understand what a Friday night dinner rush feels like. Call us at 10pm on a Saturday before a holiday weekend — we answer. We don't close at 5pm and tell you to submit a ticket.", color: "from-indigo-500 to-indigo-600" },
];

const SAVINGS = [
  { volume: "$20,000/mo", fees: "$600", saved: "$7,200/yr" },
  { volume: "$50,000/mo", fees: "$1,500", saved: "$18,000/yr" },
  { volume: "$80,000/mo", fees: "$2,400", saved: "$28,800/yr" },
  { volume: "$120,000/mo", fees: "$3,600", saved: "$43,200/yr" },
];

const FAQS = [
  { q: "How much does the EzPay restaurant POS cost?", a: "The EzPay America restaurant POS system — including hardware, software, setup, and ongoing support — costs you $0. No monthly software fees, no setup charges, and no transaction fees. Our revenue model is built around the cash discount program service fee paid by card-using customers, not from your pocket. The equipment is yours to use from day one." },
  { q: "Is the cash discount program legal for restaurants?", a: "Yes — 100% legal in all 50 states. The cash discount program is distinct from a credit card surcharge. A surcharge penalizes card users; a cash discount rewards cash-paying customers. This distinction is explicitly permitted under Visa, Mastercard, Discover, and American Express operating rules. We provide all required signage and customer-facing disclosures." },
  { q: "How long does it take to set up and go live?", a: "Most restaurants receive approval within 24 hours and are fully operational within 48–72 hours. Our installation team remotely programs your full menu, builds your floor plan, configures the KDS, and trains your front-of-house and management team. If you have a new location opening or a specific go-live date, tell us — we can work to meet it." },
  { q: "Does it integrate with third-party online ordering?", a: "EzPay America integrates with the leading third-party ordering platforms. For restaurants who want to stop paying commissions, we provide a free branded online ordering page that connects directly to your POS and kitchen display — orders appear instantly with no manual entry required." },
  { q: "What types of restaurants use EzPay America?", a: "Full-service and fine dining, fast casual and counter service, bars and pubs, coffee shops, bakeries, delis, pizza shops, food trucks, hotel restaurants, ghost kitchens, and breweries. Our POS is configurable for any service model — whether you run traditional table service, quick-service counters, or a hybrid." },
  { q: "What if my internet goes down during dinner service?", a: "Nothing changes for your guests or your team. The EzPay POS processes transactions locally on the device during any connectivity outage and queues them for background sync when your connection returns. You'll never lose a table, void a transaction, or turn off your terminal because of a WiFi problem." },
  { q: "Can it handle large-volume restaurants with multiple terminals?", a: "Yes. The system supports unlimited terminals on a single account. Multi-terminal restaurants see all data consolidated in one dashboard — server performance, table status, kitchen queues, and sales reports all update in real time across every device on the network." },
];

const RESTAURANT_TYPES = [
  { type: "Full-Service & Fine Dining", desc: "Multi-course firing, server sections, per-table wine pairing notes, and 86-item management for high-end operations." },
  { type: "Fast Casual & Counter Service", desc: "Order number display, customer-facing screens, and rapid queue processing designed for volume." },
  { type: "Bars, Pubs & Nightclubs", desc: "Tab management, drink modifiers, happy hour auto-pricing, bar tab splitting, and last-call prompts." },
  { type: "Coffee Shops & Cafes", desc: "Modifier stacking (16 milk options? no problem), loyalty punch cards, and tip prompts optimized for counter service." },
  { type: "Bakeries & Delis", desc: "Weight-based pricing, daily specials board, prep-list printing, and counter checkout with kitchen order printing." },
  { type: "Ghost Kitchens & Delivery-Only", desc: "Multi-brand order management, third-party ordering integration, and delivery routing from a single kitchen." },
];

export default function RestaurantPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Restaurant POS System – Free Zero-Fee POS for Restaurants | EzPay America"
        description="The best restaurant POS system with zero credit card transaction fees. Table management, KDS, online ordering, split checks, tableside payments & free POS hardware. Serving full-service, fast casual, bars, food trucks & more. Apply free — approved in 24 hours."
        keywords="restaurant POS system, best restaurant POS system 2025, free restaurant POS, restaurant point of sale software, table management POS, kitchen display system KDS, restaurant payment processing, zero fee restaurant POS, restaurant credit card processing, cash discount program restaurant, tableside ordering system, online ordering POS integration, restaurant POS vs Square, restaurant POS no monthly fee"
        url="https://ezpayamerica.com/RestaurantPOS"
        pageSchema={[{
          "@type": "Product",
          "name": "EzPay America Restaurant POS System",
          "description": "Zero-fee restaurant point of sale system with table management, kitchen display, online ordering, tableside payments, and free hardware. No monthly fees, no transaction fees.",
          "url": "https://ezpayamerica.com/RestaurantPOS",
          "brand": { "@type": "Brand", "name": "EzPay America" },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": "https://ezpayamerica.com/ApplyOnline",
            "seller": { "@type": "Organization", "name": "EzPay America" }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "312",
            "bestRating": "5",
            "worstRating": "1"
          },
          "review": [{
            "@type": "Review",
            "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
            "author": { "@type": "Person", "name": "Verified Merchant" },
            "reviewBody": "Switched from Toast and we're saving over $2,000 a month in fees. The table management and KDS work perfectly together."
          }]
        }]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 40%, #f59e0b 0%, transparent 55%)" }} />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-full text-sm font-semibold text-amber-300">
              <Utensils className="w-4 h-4" /> Restaurant POS System — $0/Month
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Restaurant POS.<br />
              <span className="text-amber-400">Zero Fees. Ever.</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              Stop splitting your revenue with payment processors. EzPay America delivers a complete restaurant POS — table management, kitchen display, online ordering, tableside payments — with <strong className="text-white">$0 in monthly fees and $0 in transaction fees</strong>. Free hardware. Same-day approval. Live in 48 hours.
            </p>
            <ul className="space-y-3">
              {[
                "Free restaurant POS hardware, software & setup",
                "Zero credit card transaction fees — guaranteed",
                "Visual table management & floor plan builder",
                "Kitchen display system (KDS) — fires orders instantly",
                "Commission-free online ordering integrated to POS",
                "Tableside ordering & pay-at-table — faster turns, higher tips",
              ].map(b => (
                <li key={b} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Get Your Free Restaurant POS <ArrowRight className="w-5 h-5" />
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
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=500&fit=crop"
              alt="Restaurant POS system with table management and kitchen display system"
              className="rounded-3xl shadow-2xl w-full h-auto border border-white/10"
              loading="eager" width="700" height="500"
            />
          </div>
        </div>
      </section>

      {/* Reality Check */}
      <section className="bg-amber-50 border-y border-amber-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <AlertCircle className="w-12 h-12 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">What Most Restaurants Are Paying — And Don't Have To</h2>
              <p className="text-gray-700 leading-relaxed">
                A full-service restaurant processing <strong>$60,000/month</strong> in credit card sales pays <strong>$1,500–$2,100 per month</strong> in processing fees at standard rates. That's <strong>$18,000–$25,200 per year</strong> going to Visa, your bank, and your processor — money that could be payroll, equipment upgrades, or pure profit. With EzPay America's cash discount program, that number becomes <strong>$0</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Calculate Your Restaurant's Annual Savings</h2>
          <p className="text-gray-300 mb-10">Based on a standard 2.5–3% blended processing rate vs. $0 with EzPay America's cash discount program.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {SAVINGS.map(row => (
              <div key={row.volume} className="bg-gray-800 rounded-2xl p-6 text-center space-y-2 border border-gray-700 hover:border-amber-500 transition-colors">
                <div className="text-amber-400 font-bold text-lg">{row.volume}</div>
                <div className="text-gray-400 text-sm">Monthly volume</div>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="text-3xl font-bold text-green-400">{row.fees}</div>
                  <div className="text-gray-300 text-sm">saved each month</div>
                  <div className="text-white font-bold mt-1 text-lg">{row.saved}</div>
                  <div className="text-gray-400 text-xs">back in your pocket</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-6">Savings estimates based on a 2.5% average processing rate. Your actual savings may be higher.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything Your Restaurant Needs. Nothing You Don't.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">From the host stand to the kitchen to the bar — the EzPay POS is engineered around how restaurants actually operate, not how software engineers imagine they do.</p>
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

      {/* Deep SEO Content Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto prose prose-lg prose-gray">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 not-prose">Why Restaurant Owners Choose EzPay America Over Square, Toast & Clover</h2>
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              When restaurant owners research POS systems, they typically encounter the same names: Square for Restaurants, Toast, Clover, and Lightspeed. These are capable platforms — but they all share one thing in common: they charge you for the privilege of using them. Square charges 2.6% + 10¢ per in-person transaction plus a monthly software fee. Toast charges 2.49%+ per transaction and up to $165/month for software. Clover charges monthly service fees plus 2.3–2.6% per swipe. 
            </p>
            <p>
              EzPay America charges you <strong>$0</strong>. The processing cost is covered by a transparent customer service fee applied at the point of sale — the same model used at gas stations and grocery stores for decades. Your customers see it clearly. Most accept it without complaint. And your bank account keeps the difference.
            </p>
            <p>
              But zero fees alone don't make a great POS. That's why the EzPay America restaurant system was built from the ground up for hospitality operations. The floor plan builder works for any layout — booths, bar tops, communal seating, patios, and private dining rooms. The kitchen display system (KDS) handles complex modifier trees without visual clutter. The tableside ordering integration reduces errors that happen when servers walk orders to a stationary terminal.
            </p>
            <p>
              Online ordering is increasingly critical for restaurant revenue. Third-party platforms like DoorDash and Grubhub deliver customers but capture 25–35% commission on every order — often making delivery unprofitable. EzPay America includes a free branded online ordering page that connects directly to your POS and kitchen. No third-party commissions. No separate tablet. No manual re-entry.
            </p>
            <p>
              The cash discount program is legal in all 50 states and explicitly permitted under Visa, Mastercard, Discover, and American Express operating rules. EzPay America handles all required disclosures, signage, and customer-facing messaging. Most restaurants see zero meaningful pushback from guests after the first few days of implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Restaurant Types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Built for Every Restaurant Format</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">Whether you're running a 200-seat full-service dining room or a two-window food truck, the EzPay system adapts to your operation — not the other way around.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESTAURANT_TYPES.map(item => (
              <div key={item.type} className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                <div className="font-bold text-gray-900 mb-2">{item.type}</div>
                <div className="text-gray-600 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">EzPay America vs. Square vs. Toast</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                  <th className="text-center py-3 px-4 text-amber-400 font-bold">EzPay America</th>
                  <th className="text-center py-3 px-4 text-gray-400">Square</th>
                  <th className="text-center py-3 px-4 text-gray-400">Toast</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Monthly Software Fee", "$0", "$60+/mo", "$69–$165/mo"],
                  ["Transaction Fee", "$0", "2.6% + 10¢", "2.49%+"],
                  ["Hardware Cost", "Free", "$299–$799+", "$627–$1,024+"],
                  ["Table Management", "✓ Included", "✓ Plus plan", "✓ Paid plan"],
                  ["Kitchen Display (KDS)", "✓ Included", "Add-on cost", "Add-on cost"],
                  ["Online Ordering", "✓ Free, commission-free", "Commission-based", "2–3% or flat fee"],
                  ["Tableside Ordering", "✓ Included", "✓ Extra hardware", "✓ Extra cost"],
                  ["Offline Mode", "✓ Full offline", "Limited", "✓ Limited"],
                  ["US-Based 24/7 Support", "✓ Included", "Business hours", "✓ Premium only"],
                  ["Annual cost on $60k/mo", "$0", "$21,000+", "$18,000+"],
                ].map(([feat, ez, sq, toast]) => (
                  <tr key={feat} className="border-b border-gray-800">
                    <td className="py-3 px-4 text-gray-300">{feat}</td>
                    <td className="py-3 px-4 text-center text-green-400 font-semibold">{ez}</td>
                    <td className="py-3 px-4 text-center text-gray-400">{sq}</td>
                    <td className="py-3 px-4 text-center text-gray-400">{toast}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Restaurant POS — Your Questions Answered</h2>
          <p className="text-gray-500 text-center mb-10">Real answers to the questions restaurant owners ask before switching.</p>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-white fill-white" />)}
          </div>
          <h2 className="text-4xl font-bold">Your Free Restaurant POS Is Waiting</h2>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">Zero fees. Free hardware. 48-hour setup. No contracts. Join thousands of restaurants that stopped paying processors and started keeping what they earn.</p>
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
          <p className="text-amber-200 text-sm">Approved in 24 hours · Live in 48 hours · No monthly fees · No transaction fees</p>
        </div>
      </section>
    </div>
  );
}