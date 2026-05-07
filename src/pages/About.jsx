import React from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Award, Users, Phone, MapPin, CheckCircle2, Star, Building2, CreditCard, Zap, Lock, BadgeCheck } from "lucide-react";

const TEAM = [
  {
    name: "Jeremy Carrigg",
    title: "CEO & Director of Operations",
    bio: "Over a decade of experience in merchant services and payment processing. Jeremy has personally helped thousands of small business owners eliminate credit card fees and modernize their payment infrastructure across retail, restaurant, and service industries.",
    img: "https://media.base44.com/images/public/68fffaddc76dcc9f094717fa/5d8c01863_generated_image.png",
  },
  {
    name: "Denise Sanders",
    title: "Regional Sales Manager — Eastern Region",
    bio: "Experienced Merchant Services Consultant with a demonstrated history of working in the financial services industry. Denise brings years of experience to the table and personally oversees all merchants in her region.",
    img: "https://media.base44.com/images/public/68fffaddc76dcc9f094717fa/cfaa49eab_generated_image.png",
  },
  {
    name: "Your Name Here",
    title: "Senior Account Executive",
    bio: "Add your team member's bio here. Dedicated to helping merchants transition smoothly to zero-fee processing with personalized onboarding and hands-on support.",
    img: null,
  },
  {
    name: "Your Name Here",
    title: "Technical Support Lead",
    bio: "Add your team member's bio here. Ensures every POS installation, software update, and hardware issue is resolved quickly so merchants experience zero downtime.",
    img: null,
  },
];

const CERTIFICATIONS = [
  {
    label: "PCI DSS Level 1 Compliant",
    badge: "PCI",
    color: "bg-blue-600",
    icon: Shield,
    desc: "The highest level of payment card industry data security certification — your customers' card data is always protected.",
  },
  {
    label: "Visa & Mastercard Registered ISO",
    badge: "ISO",
    color: "bg-purple-600",
    icon: BadgeCheck,
    desc: "Officially registered Independent Sales Organization with Visa and Mastercard, meeting the strictest banking standards.",
  },
  {
    label: "Cash Discount Program Compliant",
    badge: "CDP",
    color: "bg-green-600",
    icon: CheckCircle2,
    desc: "100% compliant with Visa, Mastercard, Discover, and Amex cash discount rules — legal in all 50 states.",
  },
  {
    label: "EMV & NFC Certified",
    badge: "EMV",
    color: "bg-amber-600",
    icon: CreditCard,
    desc: "All terminals are EMV chip and NFC/contactless certified for maximum fraud protection and modern payment acceptance.",
  },
  {
    label: "256-bit SSL Encryption",
    badge: "SSL",
    color: "bg-red-600",
    icon: Lock,
    desc: "Bank-grade encryption on every transaction and every data transfer — the same standard used by the largest financial institutions.",
  },
  {
    label: "NACHA ACH Member",
    badge: "ACH",
    color: "bg-teal-600",
    icon: Zap,
    desc: "Authorized ACH payment processor through NACHA, enabling fast and secure bank-to-bank transfers for merchants.",
  },
];

const PARTNER_BANKS = [
  { name: "Fiserv", category: "Processor" },
  { name: "TSYS", category: "Processor" },
  { name: "Worldpay", category: "Processor" },
  { name: "First Data", category: "Processor" },
  { name: "NMI Gateway", category: "Gateway" },
  { name: "Visa", category: "Network" },
  { name: "Mastercard", category: "Network" },
  { name: "Discover", category: "Network" },
  { name: "American Express", category: "Network" },
];

const STATS = [
  { value: "15,000+", label: "Merchants Served" },
  { value: "$0", label: "Monthly Fees" },
  { value: "24 hrs", label: "Average Approval Time" },
  { value: "50", label: "States Served" },
];

const REVIEWS = [
  { name: "Maria T.", business: "Maria's Mexican Restaurant, TN", rating: 5, text: "EzPay America saved us over $1,200 a month in processing fees. The setup was fast and the support team knows restaurants inside and out." },
  { name: "David K.", business: "Main Street Boutique, GA", rating: 5, text: "Switched from Square and couldn't be happier. Zero fees, free equipment, and they answered my calls on a Sunday. Highly recommend." },
  { name: "Dr. Lisa M.", business: "Smile Dental, NC", rating: 5, text: "The team helped us implement cash discount in our dental office seamlessly. Patients understand the fee and our monthly savings are substantial." },
  { name: "Carlos R.", business: "El Fuego Food Truck, TX", rating: 5, text: "The mobile POS works everywhere — festivals, parking lots, you name it. Zero fees means I keep way more money from every sale." },
  { name: "Sarah B.", business: "Shear Perfection Salon, FL", rating: 5, text: "We were paying 3% per transaction to Square. EzPay put that money back in our pocket. Free POS, fast setup, great team." },
  { name: "James W.", business: "Hardware Plus, OH", rating: 5, text: "Retail inventory management plus zero-fee processing — it's the best combo we've found. Their team migrated all our product data for us." },
];

function Stars({ count = 5 }) {
  return (
    <div className="flex">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
      ))}
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="About EzPay America | Zero-Fee Merchant Services Company"
        description="EzPay America is a US-based merchant services provider specializing in zero-fee credit card processing and free POS systems. PCI-compliant, Visa/MC registered ISO. Serving 15,000+ merchants in all 50 states."
        keywords="about EzPay America, merchant services company, payment processing company, zero fee payment processor, PCI compliant merchant services, registered ISO, cash discount program provider"
        url="https://ezpayamerica.com/About"
        pageSchema={[
          {
            "@type": "AboutPage",
            "@id": "https://ezpayamerica.com/About#webpage",
            "name": "About EzPay America",
            "url": "https://ezpayamerica.com/About",
            "description": "About EzPay America — zero-fee merchant services and POS systems for small businesses across the USA.",
            "isPartOf": { "@id": "https://ezpayamerica.com/#website" }
          },
          {
            "@type": "AggregateRating",
            "itemReviewed": { "@type": "Organization", "name": "EzPay America", "@id": "https://ezpayamerica.com/#organization" },
            "ratingValue": "5.0",
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": "15000",
            "reviewCount": "847"
          }
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 60%), radial-gradient(circle at 80% 20%, #f97316 0%, transparent 50%)" }} />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-full text-sm font-medium text-amber-300">
            <Building2 className="w-4 h-4" /> US-Based Merchant Services — Est. 2015
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
            Built to Put<br />
            <span className="text-amber-400">Money Back in Your Pocket</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            EzPay America is a registered Visa & Mastercard ISO and PCI DSS Level 1 certified payment processor. We specialize in zero-fee credit card processing, free POS systems, and cash discount programs — serving 15,000+ merchants across all 50 states.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
                <div className="text-3xl font-bold text-amber-400">{s.value}</div>
                <div className="text-sm text-slate-300 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-amber-50 border-y border-amber-100 py-5 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 text-sm font-semibold text-amber-800">
          {["PCI DSS Level 1 Certified", "Visa & Mastercard Registered ISO", "No Contracts · No Hidden Fees", "US-Based Support 7 Days/Week", "Free Equipment Included"].map(item => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5 text-gray-700 leading-relaxed text-lg">
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p>
                Credit card processing fees cost the average small business <strong>2.5–3.5% of every sale.</strong> A restaurant processing $50,000/month pays up to $1,750 in fees before paying a single employee. We believe that's wrong.
              </p>
              <p>
                EzPay America was built around one idea: <strong>merchants should keep what they earn.</strong> Our cash discount program is 100% compliant and legal in all 50 states, allowing business owners to eliminate processing fees entirely.
              </p>
              <p>
                No long-term contracts. No setup fees. No hidden costs. Every merchant gets free equipment, free setup, and a dedicated account specialist — not a ticket number.
              </p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 space-y-4">
              <h3 className="font-bold text-gray-900 text-xl">What We Stand For</h3>
              {[
                "Merchants keep 100% of their revenue",
                "Zero hidden fees — ever",
                "Free equipment for every merchant",
                "Small businesses deserve enterprise-level support",
                "Full compliance & transparency, always",
                "US-based team, real people, real answers",
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet Our Team</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Real people, not a call center. Every merchant is assigned a dedicated specialist who knows your industry.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                {/* Photo Slot */}
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 h-52 flex items-center justify-center relative">
                  {member.img ? (
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="w-20 h-20 bg-amber-200 rounded-full mx-auto flex items-center justify-center">
                        <Users className="w-10 h-10 text-amber-600" />
                      </div>
                      <div className="text-xs text-amber-700 font-medium px-3">Add Team Photo</div>
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-1.5 flex-1">
                  <div className="font-bold text-gray-900">{member.name}</div>
                  <div className="text-amber-600 font-medium text-sm">{member.title}</div>
                  <p className="text-gray-500 text-sm leading-relaxed pt-1">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          {/* CTA */}
          <div className="mt-10 bg-amber-500 rounded-2xl p-8 text-center text-white">
            <div className="font-bold text-xl mb-2">Speak Directly With Our Team</div>
            <p className="text-amber-100 mb-5">Every merchant gets a dedicated account specialist — not an automated system.</p>
            <a href="tel:8653169625" className="inline-flex items-center gap-2 bg-white text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-xl font-bold transition-colors shadow-lg">
              <Phone className="w-4 h-4" /> (865) 316-9625
            </a>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Certifications & Compliance</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              As a payment processor handling sensitive financial transactions, EzPay America maintains the highest levels of security certification and regulatory compliance in the industry.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CERTIFICATIONS.map(cert => (
              <div key={cert.label} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow flex gap-4 items-start">
                <div className={`${cert.color} text-white rounded-xl w-14 h-14 flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <span className="text-xs font-bold">{cert.badge}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 mb-1">{cert.label}</div>
                  <div className="text-gray-500 text-sm leading-relaxed">{cert.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Banks & Networks */}
      <section className="py-20 px-4 bg-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Our Processing Partners & Networks</h2>
          <p className="text-slate-400 mb-12 max-w-2xl mx-auto">
            EzPay America works exclusively with the world's most trusted payment processors, bank networks, and gateways — ensuring every transaction is fast, secure, and reliable.
          </p>

          {/* Processors */}
          <div className="mb-8">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Processors & Acquirers</div>
            <div className="flex flex-wrap justify-center gap-3">
              {PARTNER_BANKS.filter(p => p.category === "Processor").map(p => (
                <div key={p.name} className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-3 font-bold text-white text-sm hover:border-amber-500 transition-colors">
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          {/* Networks */}
          <div className="mb-8">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Card Networks</div>
            <div className="flex flex-wrap justify-center gap-3">
              {PARTNER_BANKS.filter(p => p.category === "Network").map(p => (
                <div key={p.name} className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-3 font-bold text-white text-sm hover:border-amber-500 transition-colors">
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          {/* Gateways */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Payment Gateway</div>
            <div className="flex flex-wrap justify-center gap-3">
              {PARTNER_BANKS.filter(p => p.category === "Gateway").map(p => (
                <div key={p.name} className="bg-slate-800 border border-slate-700 rounded-xl px-6 py-3 font-bold text-white text-sm hover:border-amber-500 transition-colors">
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-500 text-sm mt-10">All partnerships are verified and maintained under current processing agreements.</p>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What Our Merchants Say</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-gray-600 font-semibold">5.0 — Rated by 847 merchants</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3 flex flex-col">
                <Stars />
                <p className="text-gray-700 text-sm leading-relaxed italic flex-1">"{r.text}"</p>
                <div className="border-t border-slate-200 pt-3">
                  <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                  <div className="text-gray-400 text-xs">{r.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-500 to-orange-500">
        <div className="max-w-3xl mx-auto text-center space-y-6 text-white">
          <h2 className="text-3xl font-bold">Ready to Eliminate Your Processing Fees?</h2>
          <p className="text-amber-100 text-lg">Our team typically responds within 2 hours. No contracts, no setup fees, free equipment included.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:8653169625" className="inline-flex items-center justify-center gap-2 bg-white text-amber-600 hover:bg-amber-50 px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg">
              <Phone className="w-5 h-5" /> (865) 316-9625
            </a>
            <Link to={createPageUrl("ApplyOnline")} className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Apply Free Online →
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-amber-200 text-sm">
            <MapPin className="w-4 h-4" /> United States — Serving all 50 states
          </div>
        </div>
      </section>
    </div>
  );
}