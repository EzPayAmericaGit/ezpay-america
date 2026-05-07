import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Truck, CreditCard, Smartphone, BarChart3, Zap, Shield, Wifi, Clock, HeadphonesIcon, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, MapPin } from "lucide-react";

const FEATURES = [
  { icon: Smartphone, title: "Mobile-First POS — Tablet or Phone", description: "Your entire food truck operation runs on a standard tablet or even a smartphone. No bulky countertop hardware — the POS travels wherever your truck goes.", color: "from-amber-500 to-orange-600" },
  { icon: Wifi, title: "4G LTE, WiFi & Offline Mode", description: "Process payments on cellular data at any location — no venue WiFi required. Offline mode captures transactions locally during signal drops and syncs when connected.", color: "from-blue-500 to-blue-600" },
  { icon: CreditCard, title: "Zero Transaction Fees Everywhere", description: "Whether you're at a farmers market, a festival, or a lunch rush parking lot — every card payment has zero processing fees. Keep every dollar you earn.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Speed Queue Processing", description: "Designed for high-volume walk-up service. Fast order entry, quick-key menu buttons, and tap-to-pay NFC processing keep lines moving during peak hours.", color: "from-purple-500 to-purple-600" },
  { icon: Truck, title: "Event & Catering Mode", description: "Switch to event mode for festivals and catering gigs — streamlined ordering, pre-order management, and high-volume item tracking built in.", color: "from-yellow-500 to-amber-600" },
  { icon: BarChart3, title: "Location & Revenue Analytics", description: "Track your best-performing locations, peak hours, and top-selling menu items. Use the data to plan your route for maximum revenue every week.", color: "from-teal-500 to-teal-600" },
  { icon: Shield, title: "PCI-Compliant Mobile Reader", description: "Fully encrypted, EMV-chip, and NFC-capable mobile card reader. Accepts all major cards plus Apple Pay and Google Pay — complete fraud protection on the go.", color: "from-pink-500 to-pink-600" },
  { icon: Clock, title: "Order Queue & Customer Notification", description: "Numbered order queue with optional text notifications when orders are ready. Reduce crowd congestion at the window and improve the customer experience.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Support Before Your Biggest Events", description: "24/7 support available — call before a major festival to make sure everything is dialed in. We're here on race day, not just during business hours.", color: "from-indigo-500 to-indigo-600" },
];

const FAQS = [
  {
    q: "How does a food truck accept credit cards with zero fees?",
    a: "EzPay America's cash discount program displays a cash price and a card price at checkout. The card price includes a small service fee (typically 3–4%) which covers processing costs. Cash customers pay the lower price as a discount. This is 100% legal, fully compliant with Visa and Mastercard rules, and the model used at gas stations across America for decades. You pay $0 in processing fees."
  },
  {
    q: "What if I lose cell signal at an event?",
    a: "The EzPay America mobile POS has a full offline mode. Transactions are queued locally on the device during any connectivity gap — whether a tunnel, a dead zone, or a network outage. When signal is restored, all transactions sync automatically. You'll never lose a sale due to connectivity."
  },
  {
    q: "What card reader hardware do food trucks get?",
    a: "EzPay America provides a free mobile card reader that supports EMV chip, swipe, and NFC/contactless (Apple Pay, Google Pay, tap cards). The reader pairs with your tablet or smartphone via Bluetooth. Battery life covers a full day of service. Extra readers are available for multi-window trucks."
  },
  {
    q: "Can I use it at multiple locations and events?",
    a: "Yes — your merchant account and POS work anywhere you go. The system doesn't need location-specific setup. Run your Tuesday lunch spot, Wednesday farmers market, and weekend festival from the same device and see revenue broken down by date and location in your reports."
  },
  {
    q: "Does the food truck POS support multiple menu items and modifiers?",
    a: "Yes. You can build your full menu with item categories, modifiers (extra toppings, size options, dietary variations), combo deals, and daily specials. Quick-key buttons for your top items make order entry fast during rushes."
  },
  {
    q: "Do I need a data plan?",
    a: "Yes — a cellular data plan on your tablet or a mobile hotspot device is needed for full online functionality. However, offline mode means a dropped connection won't interrupt service. Most food truck operators use a tablet with a built-in SIM or a dedicated hotspot device."
  },
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

export default function FoodTruckPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Food Truck POS System – Mobile Zero-Fee Payment Processing | EzPay America"
        description="Best POS system for food trucks. 4G LTE mobile payments, offline mode, zero transaction fees, fast queue processing & free mobile card reader. Works at festivals, markets & every location. Apply free."
        keywords="food truck POS system, mobile POS for food trucks, food truck payment processing, food truck credit card reader, best POS for food truck, food truck merchant services, mobile food vendor payments, zero fee food truck processing, food truck cash discount, festival payment processing, food truck card reader offline mode, food truck point of sale"
        url="https://ezpayamerica.com/FoodTruckPOS"
        pageSchema={[
          {
            "@type": "Product",
            "name": "EzPay America Food Truck POS System",
            "description": "Mobile POS system for food trucks with 4G LTE, offline mode, zero transaction fees, and free hardware.",
            "brand": { "@type": "Brand", "name": "EzPay America" },
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "143", "bestRating": "5" }
          }
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 pt-32 pb-20 px-4 overflow-hidden">
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-amber-700">
              <Truck className="w-4 h-4" /> Food Truck POS System
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              The Mobile POS Built for <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Food Trucks</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              EzPay America's food truck POS system processes payments anywhere — festivals, markets, street corners, parking lots, and private events. Works on 4G LTE, WiFi, or offline mode with zero transaction fees and a free mobile card reader.
            </p>
            <ul className="space-y-3">
              {[
                "Works on cellular, WiFi, and offline",
                "Free mobile card reader — EMV + NFC + swipe",
                "Zero transaction fees everywhere you sell",
                "Fast walk-up queue processing for rushes",
                "Event & catering mode included",
                "Location-by-location revenue tracking"
              ].map(b => (
                <li key={b} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Get Your Free Food Truck POS <ArrowRight className="w-5 h-5" />
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
              src="https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=700&h=500&fit=crop"
              alt="Food truck mobile POS system with zero fees and 4G LTE payment processing at festivals and markets"
              className="rounded-3xl shadow-2xl w-full h-auto"
              loading="eager"
              width="700"
              height="500"
            />
          </div>
        </div>
      </section>

      {/* Anywhere You Go */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Accept Payments Anywhere You Park</h2>
          <p className="text-gray-300 mb-10">Zero fees, full functionality — everywhere your truck goes.</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { place: "Farmers Markets", icon: "🌿", desc: "Works on WiFi or cellular — no market network required." },
              { place: "Festivals & Events", icon: "🎪", desc: "Event mode for high-volume, fast-moving queues." },
              { place: "Office Lunch Spots", icon: "🏢", desc: "Fast line processing keeps the lunch rush profitable." },
              { place: "Private Catering", icon: "🍽️", desc: "Pre-order management and event totals tracking." },
              { place: "Street & Pop-Up", icon: "🌆", desc: "4G LTE means no venue WiFi dependency ever." },
              { place: "Breweries & Wineries", icon: "🍺", desc: "Tap-to-pay for fast service at outdoor events." },
            ].map(p => (
              <div key={p.place} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 text-center space-y-2">
                <div className="text-3xl">{p.icon}</div>
                <div className="font-bold text-white">{p.place}</div>
                <div className="text-gray-400 text-sm">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything Your Food Truck Needs to Take Payments</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Built specifically for mobile, outdoor, and high-volume service environments.</p>
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

      {/* Savings */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Stop Giving Your Earnings to Square</h2>
          <p className="text-gray-500 mb-10">Square charges food trucks 2.6% + 10¢ per swipe. EzPay America charges $0.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { vol: "$5k/mo", save: "$130", yr: "$1,560/yr" },
              { vol: "$10k/mo", save: "$260", yr: "$3,120/yr" },
              { vol: "$20k/mo", save: "$520", yr: "$6,240/yr" },
              { vol: "$40k/mo", save: "$1,040", yr: "$12,480/yr" },
            ].map(r => (
              <div key={r.vol} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm text-center space-y-2">
                <div className="text-amber-600 font-bold text-lg">{r.vol}</div>
                <div className="text-gray-400 text-sm">Monthly Volume</div>
                <div className="border-t border-amber-100 pt-3 mt-2">
                  <div className="text-3xl font-bold text-green-600">{r.save}</div>
                  <div className="text-gray-500 text-sm">saved/month</div>
                  <div className="text-gray-900 font-semibold mt-1">{r.yr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Food Truck POS FAQ</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Power Your Food Truck With EzPay America</h2>
          <p className="text-xl text-amber-100">Mobile. Zero-fee. Free hardware. Works offline. The best food truck POS on the market.</p>
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