import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Scissors, CreditCard, Shield, BarChart3, Clock, CheckCircle2,
  ArrowRight, ChevronDown, ChevronUp, Smartphone, Users, Star, Gift,
  AlertCircle, DollarSign, TrendingUp
} from "lucide-react";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-rose-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-rose-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 leading-relaxed bg-white">{a}</div>}
    </div>
  );
}

const FEATURES = [
  { icon: CreditCard, title: "Zero Transaction Fees — Every Service, Every Sale", description: "A salon doing $25,000/month in card sales pays $625–$875 in fees at standard rates. With EzPay America, that becomes $0. Every haircut, color service, keratin treatment, and retail product sale is processed fee-free. Over a year, that's $7,500–$10,500 staying in your salon instead of going to your processor.", color: "from-rose-500 to-pink-600" },
  { icon: Clock, title: "Appointment & Booking Integration", description: "EzPay America works alongside your existing booking software — Vagaro, StyleSeat, Boulevard, Acuity, Booksy, or Square Appointments. Payments process at checkout through the EzPay terminal while your booking system manages scheduling. You don't need to abandon what's already working.", color: "from-purple-500 to-purple-600" },
  { icon: Gift, title: "Gift Cards & Loyalty Rewards — Built In", description: "Sell physical and digital gift cards from the same terminal that processes payments — no third-party gift card vendor, no separate system. Run a points-based loyalty program that tracks client visit history and automatically applies rewards at checkout. Salons report 30–40% higher repeat visit rates with active loyalty programs.", color: "from-amber-500 to-orange-600" },
  { icon: Users, title: "Multi-Stylist & Booth Renter Management", description: "The EzPay system handles both commission and booth rental models. Commission stylists' revenue tracks individually with automatic split calculations. Booth renters process their own transactions independently with daily settlement reports. One account, one terminal, completely separated reporting for each stylist.", color: "from-teal-500 to-teal-600" },
  { icon: Smartphone, title: "Wireless & Tap-to-Pay Anywhere in the Salon", description: "Accept Apple Pay, Google Pay, and tap card payments at the shampoo bowl, at the styling station, or at the reception desk. Wireless terminals eliminate the queue at checkout and let clients pay where they are — which also means they're less likely to walk out before settling.", color: "from-blue-500 to-blue-600" },
  { icon: BarChart3, title: "Service Revenue vs. Retail — Separated Reports", description: "Track exactly how much each stylist generates in service revenue and retail commissions. See your peak appointment windows, most popular services, and highest-margin offerings. Use the data to schedule staff smarter, promote your best services, and decide which retail lines to expand.", color: "from-indigo-500 to-indigo-600" },
  { icon: Shield, title: "No-Show Deposit Collection & Cancellation Fees", description: "Protect your revenue from appointment ghosting. Require a deposit at booking — collected through the EzPay virtual terminal — and configure automatic cancellation fees for no-shows within your window. Salons using deposit requirements report a 70–80% reduction in costly no-shows.", color: "from-green-500 to-green-600" },
  { icon: Star, title: "Client History, Notes & Preferences", description: "Store every client's color formula, allergy notes, styling preferences, and service history. Walk-in or regular client — your team sees the full picture before they pick up the scissors. The kind of personalized service that turns first-time clients into 10-year regulars.", color: "from-yellow-500 to-amber-600" },
];

const SALON_TYPES = [
  { type: "Full-Service Hair Salons", desc: "Cuts, color, highlights, keratin, extensions, and styling with per-stylist tracking and tip management." },
  { type: "Booth Rental Salons", desc: "Each stylist processes independently with their own daily settlement and separate performance reporting." },
  { type: "Barber Shops", desc: "Quick checkout, tip prompts, loyalty punch cards, and repeat client preferences stored per barber." },
  { type: "Nail Salons & Nail Bars", desc: "Multiple technicians, tip splitting by tech, retail polish sales, and service + product combo tickets." },
  { type: "Med Spas & Aesthetics", desc: "Higher-ticket cosmetic services with deposit collection, treatment plan payments, and membership billing." },
  { type: "Mobile & On-Location Stylists", desc: "Wireless tap-to-pay for weddings, photo shoots, home visits, and on-location event bookings." },
];

const FAQS = [
  { q: "How does zero-fee processing work for a hair salon?", a: "EzPay America's cash discount program displays two prices at checkout — a cash price and a card price that includes a small service fee (typically 3–4%). Cash clients pay the lower price. Card clients pay the card price. You pay $0 in processing fees. The fee is visible on the terminal before the client taps or swipes — completely transparent and legal in all 50 states." },
  { q: "Will my salon clients be upset about the service fee?", a: "Most clients accept it without any issue — especially when it's displayed clearly and your front desk staff briefly explains it. EzPay America provides salon-specific signage and a simple client explanation script. Our experience with salons is that 90–95% of clients continue paying by card with the fee, and the handful that pay cash save a few dollars which they appreciate. Within a week, it becomes completely routine." },
  { q: "How much can my salon save per year?", a: "A salon processing $25,000/month saves approximately $625–$875/month compared to Square or Stripe's standard rates. That's $7,500–$10,500 per year. A higher-volume salon doing $60,000/month saves $1,500–$2,100 every month — over $18,000 annually. These are real dollars that stay in your salon instead of going to a payment processor." },
  { q: "Does it work with booth rental models?", a: "Yes. Booth renters process their own transactions independently on a shared terminal or on their own device. Each renter has a separate reporting view, their own daily settlement, and their own transaction history. The salon owner sees all activity consolidated. We configure the exact setup to match your rental agreement." },
  { q: "Can I use it with my existing booking software like Vagaro or Booksy?", a: "EzPay America works alongside your booking platform — not as a replacement. Payments process at checkout through the EzPay terminal while your booking system continues managing appointments, client communication, and scheduling. Our team helps you build a checkout workflow that doesn't disrupt your current operations." },
  { q: "What hardware does a salon need?", a: "Most salons use a countertop terminal at the reception desk and a wireless terminal for stylists who prefer to close tickets at the station. EzPay America provides all hardware at no charge — programmed, branded with your salon name, and ready for first-day use." },
  { q: "How long does setup take?", a: "Approval typically happens within 24 hours. Hardware is shipped, programmed, and arrives ready to use. Most salons are fully operational within 48–72 hours of approval. We schedule a brief training call with your front desk staff — typically 30 minutes — to walk through the checkout flow." },
];

export default function HairSalonPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Hair Salon POS & Payment Processing – Zero Fees for Salons | EzPay America"
        description="Best POS and payment processing for hair salons. Zero transaction fees, tip management, gift cards, loyalty programs, booth renter support, and free salon POS hardware. Save $7,500–$18,000/year vs Square. No monthly fees. Apply free."
        keywords="hair salon POS system, hair salon payment processing, salon credit card processing no fees, zero fee salon POS, best POS for hair salon 2025, salon merchant services, hair salon cash discount program, beauty salon POS system, salon tip management, booth renter payment processing, hair salon loyalty program, vagaro payment alternative, salon POS software, hair salon merchant account"
        url="https://ezpayamerica.com/HairSalonPOS"
        pageSchema={[{
          "@type": "Product",
          "name": "EzPay America Hair Salon POS System",
          "description": "Zero-fee payment processing for hair salons with tip management, gift cards, loyalty programs, booth renter support, and free hardware.",
          "brand": { "@type": "Brand", "name": "EzPay America" },
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "176", "bestRating": "5" }
        }]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900 pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 75% 35%, #f43f5e 0%, transparent 55%)" }} />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-400/30 rounded-full text-sm font-semibold text-rose-300">
              <Scissors className="w-4 h-4" /> Hair Salon POS & Payments — $0/Month
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Salon Keeps<br />
              <span className="text-rose-300">Every Dollar It Earns</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              Hair salons across America are handing over <strong className="text-white">$7,500–$25,000 per year</strong> in credit card fees they don't have to pay. EzPay America eliminates those fees completely — free POS hardware, tip management, gift cards, booth renter support, and a loyalty program included. <strong className="text-white">$0 in transaction fees. $0 per month.</strong>
            </p>
            <ul className="space-y-3">
              {[
                "Zero credit card processing fees on every transaction",
                "Tip prompts on every ticket — maximize gratuity",
                "Gift cards & loyalty point program built in, free",
                "Multi-stylist & booth renter support configured to your model",
                "Service + retail product sales on one terminal",
                "Free countertop and wireless terminal hardware",
              ].map(b => (
                <li key={b} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-rose-500 hover:bg-rose-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Get Free Salon POS <ArrowRight className="w-5 h-5" />
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
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&h=500&fit=crop"
              alt="Hair salon payment processing terminal with zero transaction fees and tip management"
              className="rounded-3xl shadow-2xl w-full h-auto border border-white/10"
              loading="eager" width="700" height="500"
            />
          </div>
        </div>
      </section>

      {/* Cost Reality */}
      <section className="bg-rose-50 border-y border-rose-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <AlertCircle className="w-12 h-12 text-rose-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">What Square Is Taking From Your Salon Each Month</h2>
              <p className="text-gray-700 leading-relaxed">
                A hair salon processing <strong>$30,000/month</strong> with Square pays <strong>$780+/month</strong> in transaction fees (2.6% + 10¢). That's <strong>$9,360+ per year</strong> going to Square before your stylists see a dollar of commission. EzPay America's cost for the same volume: <strong>$0</strong>. That's a new piece of equipment, an extra payroll cycle, or simply money you keep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Savings */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">How Much Is Your Salon Losing to Processing Fees?</h2>
          <p className="text-gray-300 mb-10">EzPay America eliminates the fees entirely. See the annual impact for salons at every volume level.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { vol: "$10k/mo", save: "$300", yr: "$3,600/yr" },
              { vol: "$25k/mo", save: "$750", yr: "$9,000/yr" },
              { vol: "$50k/mo", save: "$1,500", yr: "$18,000/yr" },
              { vol: "$80k/mo", save: "$2,400", yr: "$28,800/yr" },
            ].map(r => (
              <div key={r.vol} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-rose-500 transition-colors space-y-2 text-center">
                <div className="text-rose-400 font-bold text-lg">{r.vol}</div>
                <div className="text-gray-400 text-sm">Monthly Volume</div>
                <div className="border-t border-gray-700 pt-3 mt-2">
                  <div className="text-3xl font-bold text-green-400">{r.save}</div>
                  <div className="text-gray-300 text-sm">saved/month</div>
                  <div className="text-white font-bold mt-1">{r.yr}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built for the Realities of Salon Business</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Tips, multiple stylists, gift cards, booth renters, retail products, and no-show protection — all handled in one system designed for how salons actually operate.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all space-y-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{f.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Salon Owners Switch From Square and Stripe to EzPay America</h2>
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              Hair salons have a unique payment environment. Tips are expected, multiple service providers may share a terminal, retail product sales run alongside service revenue, and clients often book in advance and pay at the end of a 2–3 hour appointment. Standard payment processors — Square, Stripe, PayPal — were designed for simple retail transactions, not salon workflows.
            </p>
            <p>
              EzPay America's salon-focused payment system handles all of it. Tip prompts appear at the right moment in the checkout flow. Booth renters get individual tracking without individual merchant accounts. Service revenue and retail product commissions are reported separately. And the virtual terminal lets you collect no-show deposits by phone before the appointment date.
            </p>
            <p>
              The financial case for switching is straightforward. The average American hair salon earns $30,000–$50,000 per month. At Square's standard 2.6% + 10¢ per swipe, that salon pays $780–$1,300 per month in processing fees — $9,360–$15,600 per year. EzPay America's cash discount program brings that to $0. The math doesn't require a calculator.
            </p>
            <p>
              Client acceptance of the cash discount model is high in salon environments. Unlike a restaurant where guests might feel surprised by a fee at the end of a dinner, salon clients are accustomed to seeing posted pricing at the front desk. Clear signage — which EzPay America provides — sets expectations before the appointment begins. Most salons report that within one to two weeks, the new pricing model becomes completely routine for clients and staff.
            </p>
          </div>
        </div>
      </section>

      {/* Salon Types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Salon & Beauty Businesses We Serve</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">Every beauty business model is a little different. EzPay configures to yours.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SALON_TYPES.map(item => (
              <div key={item.type} className="bg-rose-50 border border-rose-100 rounded-2xl p-5">
                <div className="font-bold text-gray-900 mb-2">{item.type}</div>
                <div className="text-gray-600 text-sm leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Salon Payment Processing — Your Questions Answered</h2>
          <p className="text-gray-500 text-center mb-10">What salon owners ask before making the switch to EzPay America:</p>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-rose-500 to-pink-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-white fill-white" />)}
          </div>
          <h2 className="text-4xl font-bold">Your Salon Deserves Zero-Fee Processing</h2>
          <p className="text-xl text-rose-100 max-w-2xl mx-auto">Free hardware. No monthly fees. No transaction fees. Switch in 48 hours with zero disruption to your clients or your schedule.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("ApplyOnline")}>
              <button className="w-full sm:w-auto bg-white text-rose-600 hover:bg-rose-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-colors">
                Apply Free — No Contract
              </button>
            </Link>
            <a href="tel:8653169625">
              <button className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-10 py-4 rounded-xl font-semibold text-lg transition-colors">
                Call (865) 316-9625
              </button>
            </a>
          </div>
          <p className="text-rose-200 text-sm">Approved in 24 hours · Live in 48 hours · No monthly fees · No transaction fees</p>
        </div>
      </section>
    </div>
  );
}