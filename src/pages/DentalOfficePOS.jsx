import React, { useState } from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  HeartPulse, CreditCard, Shield, BarChart3, Clock, CheckCircle2,
  ArrowRight, ChevronDown, ChevronUp, Smartphone, Users, DollarSign, Star, AlertCircle, FileText, Zap
} from "lucide-react";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
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

const FEATURES = [
  { icon: CreditCard, title: "Zero-Fee Patient Payment Processing", description: "Process every copay, insurance overage, treatment balance, and cosmetic procedure deposit with $0 in transaction fees. EzPay America's compliant cash discount program works in dental settings just as it does in retail and restaurant environments — legally and transparently.", color: "from-blue-500 to-cyan-600" },
  { icon: DollarSign, title: "In-House Treatment Plan Financing", description: "Offer patients the ability to split large treatment balances into monthly installments, managed directly from the front desk. Increase case acceptance rates on high-value treatments — crowns, implants, Invisalign, cosmetic procedures — without involving a third-party financing provider that takes a cut of your revenue.", color: "from-green-500 to-emerald-600" },
  { icon: Shield, title: "PCI DSS Level 1 Certified — Privacy First", description: "All EzPay terminals are PCI DSS Level 1 certified with end-to-end encryption on every patient transaction. Payment workflows are designed to minimize patient data exposure — no card numbers stored, no unencrypted transmission, full EMV chip compliance. The security standard your patients expect from a healthcare provider.", color: "from-indigo-500 to-indigo-600" },
  { icon: Smartphone, title: "Virtual Terminal for Phone & Balance Collections", description: "The EzPay virtual terminal lets your front desk collect patient payments by phone — ideal for insurance co-pay collections, pre-treatment deposits, and post-visit balances. No card reader required. Fully encrypted, PCI compliant, and accessible from any browser.", color: "from-purple-500 to-purple-600" },
  { icon: Clock, title: "Recurring Billing for Orthodontic & Care Plans", description: "Set up automatic monthly billing for orthodontic treatment schedules, Invisalign payment plans, or in-house dental membership programs. Payments run automatically on the configured date. No staff time chasing overdue balances. No awkward collection calls.", color: "from-amber-500 to-orange-600" },
  { icon: BarChart3, title: "Payment Reporting That Integrates With Your PMS", description: "End-of-day settlement reports, transaction history sortable by date, payment type, and amount — designed to integrate with dental practice management software including Dentrix, Eaglesoft, and Open Dental. Reconcile your payment records against your PMS in minutes, not hours.", color: "from-teal-500 to-teal-600" },
  { icon: Users, title: "Front-Desk-Optimized Checkout Flow", description: "The checkout interface is intentionally simple — your front desk team learns the new flow in under 30 minutes. No complicated menus, no confusing steps. Patients see the pricing clearly on the terminal before they pay. Questions from patients about the service fee are minimal and our team provides talking points for your staff.", color: "from-pink-500 to-pink-600" },
  { icon: HeartPulse, title: "Multi-Provider & Multi-Location Support", description: "Run payment processing across multiple providers, treatment rooms, or satellite office locations from a single merchant account. Each location gets individual reporting while management sees consolidated numbers across the entire practice. One account, one relationship, complete visibility.", color: "from-red-500 to-red-600" },
];

const PRACTICE_TYPES = [
  { type: "General Dentistry", desc: "Copay and insurance overage collection, routine visit balance clearing, and daily batch reconciliation." },
  { type: "Orthodontic Practices", desc: "Monthly treatment plan billing, contract payment schedules, and down payment collection at consultation." },
  { type: "Cosmetic Dentistry", desc: "Large balance financing, multi-visit payment plans, consultation deposits, and elective treatment billing." },
  { type: "Oral Surgery", desc: "Pre-procedure deposits, insurance supplement billing, and post-visit balance collection for surgical cases." },
  { type: "Pediatric Dentistry", desc: "Parent billing interfaces, simplified checkout, and recurring preventive care plan management." },
  { type: "Multi-Location Practices & DSOs", desc: "Centralized merchant account with per-location reporting and individual terminal management for groups." },
];

const FAQS = [
  { q: "Is the cash discount program legal in dental offices?", a: "Yes — fully legal in all 50 states for dental practices. The cash discount program is distinct from a credit card surcharge and is permitted under Visa, Mastercard, Discover, and American Express operating rules. Dental practices, orthodontists, oral surgeons, and medical clinics across the country use this model. EzPay America provides all required signage, disclosures, and patient communication materials." },
  { q: "How do patients react to the cash discount pricing model?", a: "Patient acceptance in dental settings is generally very high. Healthcare patients are already accustomed to seeing fees, co-pays, and out-of-pocket costs itemized at checkout — adding a transparent card service fee is a smaller adjustment than in most retail environments. EzPay provides front desk training and talking points so your team handles the first few patient questions confidently. Most practices report near-zero ongoing friction after the first week." },
  { q: "How much can a dental practice save with zero-fee processing?", a: "A general practice processing $40,000/month saves $1,000–$1,400 per month compared to paying standard 2.5–3.5% rates. An orthodontic or cosmetic-heavy practice processing $80,000+/month saves $2,000–$2,800 monthly — over $24,000–$33,600 per year. These figures represent real money that stays in the practice instead of going to a payment processor." },
  { q: "Does EzPay integrate with Dentrix, Eaglesoft, or Open Dental?", a: "EzPay America generates settlement reports and transaction exports compatible with the major dental PMS platforms. Our team helps configure the reporting workflow to match your reconciliation process. Full API-level integrations are available for enterprise and DSO practices. Contact us to discuss your specific PMS setup." },
  { q: "What hardware does a dental office receive?", a: "Most dental practices use a countertop terminal at the front desk for standard patient checkout and an optional wireless terminal for multi-room or satellite checkout. All EzPay America hardware is provided free of charge, pre-programmed with your practice name, and ready for first-day use. EMV chip and NFC contactless readers are standard on all terminals." },
  { q: "Can patients pay with HSA or FSA cards?", a: "Yes. EzPay America terminals accept all major credit and debit cards including HSA (Health Savings Account) and FSA (Flexible Spending Account) cards without any special configuration. These are processed exactly like a standard card payment at the regular service fee rate." },
  { q: "Do you help with patient financing beyond in-house plans?", a: "Yes. In addition to in-house recurring billing, EzPay America can connect your practice with third-party patient financing programs. Contact our team to discuss the specific financing workflow your practice needs." },
];

export default function DentalOfficePOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Dental Office Payment Processing – Zero-Fee Merchant Services for Dentists | EzPay America"
        description="Zero-fee credit card processing for dental offices. Compliant cash discount program, virtual terminal, recurring payment plans for orthodontics, HSA/FSA card acceptance, PCI DSS Level 1 certified. Save $1,000–$2,800/month. Free terminals. Apply free."
        keywords="dental office payment processing, dental practice merchant services, zero fee dental payments, cash discount dental office, dental POS system, dental payment plans, dental credit card processing no fees, HIPAA payment processing dental, dental office virtual terminal, orthodontic payment processing, cosmetic dentistry payment, dental practice credit card fees, Dentrix payment processing, dental merchant account"
        url="https://ezpayamerica.com/DentalOfficePOS"
        pageSchema={[{
          "@type": "Product",
          "name": "EzPay America Dental Office Payment Processing",
          "description": "Zero-fee payment processing, virtual terminal, and recurring billing for dental offices, orthodontic practices, and cosmetic dentistry.",
          "brand": { "@type": "Brand", "name": "EzPay America" },
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD", "availability": "https://schema.org/InStock" },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "98", "bestRating": "5" }
        }]}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 70% 40%, #3b82f6 0%, transparent 55%)" }} />
        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-semibold text-blue-300">
              <HeartPulse className="w-4 h-4" /> Dental Office Payment Processing — $0/Month
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Stop Paying Processing<br />Fees on Patient Payments
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed">
              The average dental office pays <strong className="text-white">$800–$3,000 per month</strong> in credit card processing fees. EzPay America's compliant cash discount program eliminates those fees completely — PCI DSS Level 1 certified, accepted by all major cards, HSA/FSA compatible, and deployed in dental practices across all 50 states.
            </p>
            <ul className="space-y-3">
              {[
                "Zero transaction fees on every patient payment",
                "Compliant cash discount program — legal in all 50 states",
                "Virtual terminal for phone & pre-treatment deposits",
                "Recurring billing for orthodontic & care plans",
                "HSA, FSA, and all major cards accepted",
                "Free countertop and wireless terminals — ready day one",
              ].map(b => (
                <li key={b} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" /> {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all">
                  Apply Free for Your Practice <ArrowRight className="w-5 h-5" />
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
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=700&h=500&fit=crop"
              alt="Dental office payment processing terminal with zero transaction fees and cash discount program"
              className="rounded-3xl shadow-2xl w-full h-auto border border-white/10"
              loading="eager" width="700" height="500"
            />
          </div>
        </div>
      </section>

      {/* Cost Reality */}
      <section className="bg-blue-50 border-y border-blue-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <AlertCircle className="w-12 h-12 text-blue-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">The Hidden Cost in Every Dental Transaction</h2>
              <p className="text-gray-700 leading-relaxed">
                A dental practice collecting <strong>$50,000/month</strong> in card payments pays <strong>$1,250–$1,750 per month</strong> in credit card processing fees at standard rates. That's <strong>$15,000–$21,000 per year</strong> — money that could fund new equipment, an additional hygienist, or facility improvements. EzPay America's cash discount program brings that cost to <strong>$0</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Savings */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Dental Practice Savings Calculator</h2>
          <p className="text-gray-300 mb-10">Most dental offices pay 2.5–3.5% per credit card transaction. With EzPay America, your rate is $0.</p>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { vol: "$20k/mo", save: "$600", yr: "$7,200/yr" },
              { vol: "$40k/mo", save: "$1,200", yr: "$14,400/yr" },
              { vol: "$80k/mo", save: "$2,400", yr: "$28,800/yr" },
              { vol: "$150k/mo", save: "$4,500", yr: "$54,000/yr" },
            ].map(r => (
              <div key={r.vol} className="bg-gray-800 rounded-2xl p-5 border border-gray-700 hover:border-blue-500 transition-colors space-y-2 text-center">
                <div className="text-blue-400 font-bold text-lg">{r.vol}</div>
                <div className="text-gray-400 text-sm">Monthly Volume</div>
                <div className="border-t border-gray-700 pt-3 mt-2">
                  <div className="text-3xl font-bold text-green-400">{r.save}</div>
                  <div className="text-gray-300 text-sm">saved/month</div>
                  <div className="text-white font-bold mt-1">{r.yr}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm mt-6">Estimates based on a 3% average blended processing rate. Actual savings depend on your current rates and card mix.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Payment Solutions Built for Dental Practices</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">From routine copay collection to complex orthodontic payment plans — every scenario your front desk encounters, handled professionally and compliantly.</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Zero-Fee Payment Processing for Dental Offices — What You Need to Know</h2>
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              Credit card processing is one of the largest controllable overhead expenses in a dental practice. Unlike rent or payroll, it scales directly with your production — the more patients you see, the more you pay. A busy multi-provider general practice generating $100,000/month in collections pays $2,500–$3,500 per month at standard processing rates. An orthodontic practice with high monthly payment volume pays even more.
            </p>
            <p>
              EzPay America's cash discount program eliminates that expense entirely. The program adds a transparent service fee to card payments — typically 3–4% — which is displayed to patients on the terminal before they authorize the transaction. Patients who pay by check, cash, or ACH receive the base (discounted) price. This model is fully compliant with Visa, Mastercard, Discover, and Amex operating rules and legal in all 50 states.
            </p>
            <p>
              Patient acceptance in dental settings is higher than most practice managers expect. Dental patients are already accustomed to itemized bills, insurance coordination, and out-of-pocket costs at checkout. A visible, clearly explained card service fee is a smaller behavioral change than in most retail contexts. EzPay America provides comprehensive front desk training materials, required regulatory signage, and patient-facing messaging designed specifically for healthcare environments.
            </p>
            <p>
              The virtual terminal is particularly valuable in dental settings. Many practices collect co-pays and treatment deposits over the phone before the appointment — reducing no-shows and pre-qualifying financial conversations. EzPay's browser-based virtual terminal supports these phone payment workflows without any additional hardware and with full PCI DSS Level 1 security compliance.
            </p>
            <p>
              For orthodontic and cosmetic practices with recurring payment plans, EzPay America's automatic billing system eliminates the staff time and awkwardness associated with monthly collections. Payment runs on the configured schedule, patients are notified automatically, and failed payments are flagged for front desk follow-up. Practices report significantly reduced overdue balance rates after implementing automatic recurring billing.
            </p>
          </div>
        </div>
      </section>

      {/* Practice Types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Dental Practice Types We Serve</h2>
          <p className="text-gray-500 text-center mb-10 max-w-2xl mx-auto">Each practice specialty has different payment collection needs. EzPay America configures to yours.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRACTICE_TYPES.map(item => (
              <div key={item.type} className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Dental Payment Processing — Questions & Answers</h2>
          <p className="text-gray-500 text-center mb-10">What dental practice owners and office managers ask before switching:</p>
          <div className="space-y-3">
            {FAQS.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="flex justify-center">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-white fill-white" />)}
          </div>
          <h2 className="text-4xl font-bold">Stop Paying Processing Fees on Patient Payments</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">Free terminals. Free setup. Compliant cash discount program. Join hundreds of dental practices saving thousands per month with EzPay America.</p>
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
          <p className="text-blue-200 text-sm">Approved in 24 hours · Free equipment · No monthly fees · No transaction fees</p>
        </div>
      </section>
    </div>
  );
}