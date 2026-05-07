import React from "react";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Award, Users, Phone, MapPin, CheckCircle2, Star, Building2, CreditCard, Zap } from "lucide-react";

const TEAM = [
  {
    name: "Jeremy Carrigg",
    title: "Director of Operations",
    bio: "Jeremy has over a decade of experience in merchant services and payment processing. He has personally helped thousands of small business owners eliminate credit card fees and modernize their payment infrastructure across retail, restaurant, and service industries.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
  },
  {
    name: "EzPay America Team",
    title: "Merchant Success Specialists",
    bio: "Our US-based team of payment specialists is available 7 days a week. Every team member is trained in PCI compliance, cash discount program regulations, and POS system implementation so merchants get expert support — not a call center script.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop",
  },
];

const CERTIFICATIONS = [
  { label: "PCI DSS Level 1 Compliant", icon: Shield, desc: "The highest level of payment card industry security certification." },
  { label: "Visa & Mastercard Registered ISO", icon: CreditCard, desc: "Registered Independent Sales Organization with Visa and Mastercard." },
  { label: "Cash Discount Program Compliant", icon: CheckCircle2, desc: "100% compliant with Visa, MC, and Discover cash discount program rules in all 50 states." },
  { label: "EMV & NFC Certified", icon: Zap, desc: "All terminals are EMV chip and NFC/contactless certified for maximum fraud protection." },
];

const PARTNERS = [
  "Visa", "Mastercard", "Discover", "American Express", "NMI Gateway", "Fiserv", "First Data", "TSYS", "Worldpay"
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

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="About EzPay America | Zero-Fee Merchant Services Company"
        description="EzPay America is a US-based merchant services provider specializing in zero-fee credit card processing and free POS systems. PCI-compliant, Visa/MC registered ISO. Serving 15,000+ merchants in all 50 states."
        keywords="about EzPay America, merchant services company, payment processing company, who is EzPay America, zero fee payment processor, PCI compliant merchant services, registered ISO, cash discount program provider"
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
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md text-sm font-medium text-amber-700">
            <Building2 className="w-4 h-4" /> US-Based Merchant Services Since 2015
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            We Help Small Businesses <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Stop Paying Processing Fees</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            EzPay America is a registered Visa & Mastercard ISO and merchant services provider headquartered in the United States. We specialize in zero-fee credit card processing, free POS systems, and cash discount programs for retail stores, restaurants, and service businesses nationwide.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6">
            {STATS.map(s => (
              <div key={s.label} className="bg-white rounded-2xl shadow-md p-5 text-center">
                <div className="text-3xl font-bold text-amber-600">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-gray-700 leading-relaxed text-lg">
              <p>
                Credit card processing fees cost the average small business <strong>2.5–3.5% of every sale</strong> — a restaurant processing $50,000/month pays $1,250–$1,750 in fees before paying a single employee. We believe that's wrong.
              </p>
              <p>
                EzPay America was built around one idea: <strong>merchants should keep what they earn.</strong> Our cash discount program is 100% compliant with Visa, Mastercard, Discover, and Amex rules and legal in all 50 states, allowing business owners to eliminate processing fees entirely.
              </p>
              <p>
                We don't believe in long-term contracts, setup fees, or hidden costs. Every merchant gets free equipment, free setup, and a dedicated account specialist — not a ticket number.
              </p>
            </div>
            <div className="bg-amber-50 rounded-2xl p-8 space-y-4 border border-amber-100">
              <h3 className="font-bold text-gray-900 text-xl">What We Believe</h3>
              {[
                "Merchants deserve to keep 100% of their revenue",
                "Payment processing should have zero hidden fees",
                "Free equipment is a right, not a premium",
                "Small businesses deserve enterprise-level support",
                "Compliance and transparency are non-negotiable",
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {TEAM.map(member => (
              <div key={member.name} className="bg-white rounded-2xl shadow-md p-8 flex gap-6 items-start">
                <img
                  src={member.img}
                  alt={`${member.name} - ${member.title} at EzPay America`}
                  className="w-20 h-20 rounded-full object-cover flex-shrink-0 shadow"
                />
                <div className="space-y-2">
                  <div className="font-bold text-gray-900 text-lg">{member.name}</div>
                  <div className="text-amber-600 font-medium text-sm">{member.title}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-amber-50 rounded-2xl p-8 border border-amber-100 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-amber-600" />
              <span className="font-bold text-gray-900">Speak Directly With Our Team</span>
            </div>
            <p className="text-gray-600 mb-4">Every merchant gets a dedicated account specialist — not an automated system.</p>
            <a href="tel:8653169625" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
              <Phone className="w-4 h-4" /> (865) 316-9625
            </a>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Certifications & Compliance</h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">As a payment processor handling sensitive financial transactions, EzPay America maintains the highest levels of security and regulatory compliance.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {CERTIFICATIONS.map(cert => (
              <div key={cert.label} className="flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <cert.icon className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{cert.label}</div>
                  <div className="text-gray-500 text-sm mt-1">{cert.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processor Partners */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Processing Partners</h2>
          <p className="text-gray-500 mb-10">EzPay America works with the world's leading payment networks and processors to ensure every transaction is fast, secure, and reliable.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map(p => (
              <div key={p} className="bg-white border border-gray-200 rounded-xl px-6 py-3 font-semibold text-gray-700 shadow-sm">
                {p}
              </div>
            ))}
          </div>
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
              <span className="text-gray-600 font-medium">5.0 — Rated by 847 merchants</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-3">
                <div className="flex">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">"{r.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                  <div className="text-gray-400 text-xs">{r.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Location */}
      <section className="py-20 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Get In Touch</h2>
          <p className="text-gray-600 text-lg">Ready to eliminate your processing fees? Our team typically responds within 2 hours.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:8653169625" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg">
              <Phone className="w-5 h-5" /> (865) 316-9625
            </a>
            <Link to={createPageUrl("ApplyOnline")} className="inline-flex items-center justify-center gap-2 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
              Apply Free Online →
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" /> United States — Serving all 50 states
          </div>
        </div>
      </section>
    </div>
  );
}