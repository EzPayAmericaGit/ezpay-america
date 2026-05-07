import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { HeartPulse, CreditCard, Shield, BarChart3, Clock, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, Smartphone, Users, DollarSign } from "lucide-react";

const FEATURES = [
  { icon: CreditCard, title: "Zero-Fee Patient Payments", description: "Process patient payments — copays, treatment balances, cosmetic procedures — with zero transaction fees using EzPay America's compliant cash discount program.", color: "from-blue-500 to-blue-600" },
  { icon: DollarSign, title: "Treatment Plan Financing", description: "Offer patients split payments and payment plans directly at the front desk. Reduce uncollected balances and increase case acceptance rates.", color: "from-green-500 to-green-600" },
  { icon: Shield, title: "HIPAA-Aware Processing", description: "Our payment processing workflows are designed with healthcare privacy in mind. PCI DSS Level 1 certified terminals with end-to-end encryption on all patient transactions.", color: "from-indigo-500 to-indigo-600" },
  { icon: Smartphone, title: "Virtual Terminal for Phone Payments", description: "Accept patient payments over the phone through a secure virtual terminal — no card present required. Ideal for deposits, balance collections, and pre-treatment payments.", color: "from-purple-500 to-purple-600" },
  { icon: Clock, title: "Recurring Payment Plans", description: "Set up automatic monthly billing for orthodontic treatment plans, Invisalign programs, or cosmetic payment schedules. Reduce staff time chasing payments.", color: "from-amber-500 to-orange-600" },
  { icon: BarChart3, title: "Payment Reporting & Reconciliation", description: "End-of-day settlement reports, transaction history by date or patient category, and batch reports that integrate with most dental practice management software.", color: "from-teal-500 to-teal-600" },
  { icon: Users, title: "Front Desk Friendly", description: "Simple checkout interface requires minimal training. Patients understand the cash discount pricing immediately — most dental practices see zero complaints after the first week.", color: "from-pink-500 to-pink-600" },
  { icon: HeartPulse, title: "Multi-Provider Support", description: "Run payments across multiple providers, treatment rooms, or satellite locations from a centralized account with individual reporting by location or provider.", color: "from-red-500 to-red-600" },
];

const FAQS = [
  {
    q: "Is the cash discount program legal in dental offices?",
    a: "Yes. The cash discount program is fully legal in all 50 states for dental offices and healthcare providers. It is distinct from a surcharge (which has different regulations) because it rewards cash-paying patients rather than penalizing card-paying patients. Thousands of dental practices across the US use cash discount processing compliantly."
  },
  {
    q: "Will patients accept the cash discount program?",
    a: "In our experience with dental practices, patient acceptance is very high. Patients are accustomed to seeing service fees in healthcare settings. The key is front desk training and clear signage — which EzPay America provides. Most practices report minimal friction within the first few days."
  },
  {
    q: "How much can a dental office save with zero-fee processing?",
    a: "A dental practice processing $40,000/month in card payments saves approximately $1,000–$1,400 per month (at 2.5–3.5% average processing costs). Orthodontic and cosmetic-heavy practices processing $80,000+ save $2,000–$2,800 monthly — over $30,000 per year."
  },
  {
    q: "Does EzPay America integrate with dental practice management software?",
    a: "EzPay America provides payment processing that produces settlement reports compatible with most dental PMS exports (Dentrix, Eaglesoft, Open Dental). Our team helps configure the reporting workflow to match your billing process. Full API integrations are available for enterprise practices."
  },
  {
    q: "What hardware does a dental office need?",
    a: "Most dental practices use a countertop terminal at the front desk and optionally a wireless terminal for multi-room checkout. EzPay America provides all hardware free of charge, pre-programmed with your practice name and pricing."
  },
  {
    q: "Can we accept Care Credit or other healthcare financing?",
    a: "Yes. EzPay America's terminals accept all major cards including HSA/FSA cards. We can also connect your practice with third-party patient financing programs. Contact our team to discuss your specific financing workflow."
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-blue-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 leading-relaxed bg-white">{a}</div>}
    </div>
  );
}

export default function DentalOfficePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Dental Office Payment Processing – Zero-Fee Merchant Services | EzPay America"
        description="Zero-fee payment processing for dental offices. Cash discount program, virtual terminal, recurring payment plans, HSA/FSA card acceptance. HIPAA-aware, PCI compliant. Save $1,000–$2,800/month. Apply free."
        keywords="dental office payment processing, dental practice merchant services, zero fee dental payments, cash discount dental office, dental POS system, dental payment plans, dental credit card processing, HIPAA payment processing, dental office POS, orthodontic payment processing, cosmetic dentistry payment system, dental practice credit card fees"
        url="https://ezpayamerica.com/DentalOfficePOS"
        pageSchema={[
          {
            "@type": "Product",
            "name": "EzPay America Dental Office Payment Processing",
            "description": "Zero-fee payment processing and virtual terminal for dental offices, orthodontic practices, and cosmetic dentistry.",
            "brand": { "@type": "Brand", "name": "EzPay America" },
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "98", "bestRating": "5" }
          }
        ]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 pt-32 pb-20 px-4 overflow-hidden">
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-blue-700">
              <HeartPulse className="w-4 h-4" /> Dental Office Payment Processing
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Zero-Fee Payment Processing <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">for Dental Offices</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              The average dental office pays $800–$3,000/month in credit card processing fees. EzPay America's cash discount program eliminates those fees completely — PCI compliant, compliant with all card network rules, and accepted by patients within days of implementation.
            </p>
            <ul className="space-y-3">
              {[
                "Zero transaction fees on all patient payments",
                "Compliant cash discount program for healthcare",
                "Virtual terminal for phone & balance payments",
                "Recurring payment plans for treatment financing",
                "HSA, FSA, and all major cards accepted",
                "Free terminals — countertop and wireless"
              ].map(b => (
                <li key={b} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Apply Free for Your Dental Practice <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="tel:8653169625">
                <button className="w-full sm:w-auto border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                  Call (865) 316-9625
                </button>
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=700&h=500&fit=crop"
              alt="Dental office payment processing terminal with zero transaction fees and cash discount program"
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
          <h2 className="text-3xl font-bold mb-3">Dental Practice Savings Calculator</h2>
          <p className="text-gray-300 mb-10">Most dental offices pay 2.5–3.5% per credit card transaction. With EzPay America, that drops to $0.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { vol: "$20k/mo", save: "$600", yr: "$7,200/yr" },
              { vol: "$40k/mo", save: "$1,200", yr: "$14,400/yr" },
              { vol: "$80k/mo", save: "$2,400", yr: "$28,800/yr" },
              { vol: "$150k/mo", save: "$4,500", yr: "$54,000/yr" },
            ].map(r => (
              <div key={r.vol} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 space-y-2 text-center">
                <div className="text-blue-400 font-bold text-lg">{r.vol}</div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Payment Solutions Built for Dental Practices</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">From the front desk to the treatment room — everything your practice needs to collect patient payments efficiently.</p>
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

      {/* Practice Types */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Dental Practice Types We Serve</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { type: "General Dentistry", desc: "Copay and balance collection, insurance overage billing, and routine visit payments." },
              { type: "Orthodontic Practices", desc: "Monthly treatment plan billing, contract payment schedules, and down payment processing." },
              { type: "Cosmetic Dentistry", desc: "Large treatment balance collection, consultation deposits, and multi-visit payment plans." },
              { type: "Oral Surgery", desc: "Pre-procedure deposits, insurance supplement billing, and post-visit balance collection." },
              { type: "Pediatric Dentistry", desc: "Parent billing, simplified checkout, and recurring care plan management." },
              { type: "Multi-Location Practices", desc: "Centralized reporting with location-by-location breakdown and unified merchant account." },
            ].map(item => (
              <div key={item.type} className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
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
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Stop Paying Processing Fees on Patient Payments</h2>
          <p className="text-xl text-blue-100">Free setup. Free terminals. Compliant cash discount program. Join hundreds of dental practices saving thousands monthly.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("ApplyOnline")}>
              <button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-colors">
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