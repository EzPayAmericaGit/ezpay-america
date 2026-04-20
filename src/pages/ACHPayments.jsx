import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { Building2, Shield, Clock, DollarSign, CheckCircle2, ArrowRight, TrendingDown, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ServiceSEOContent from "../components/landing/ServiceSEOContent";
import AIContentGenerator from "../components/admin/AIContentGenerator";
import { base44 } from "@/api/base44Client";

const featureColors = [
  "from-green-500 to-emerald-600",
  "from-blue-500 to-cyan-600",
  "from-purple-500 to-pink-600",
  "from-amber-500 to-orange-600"
];
const featureIcons = [DollarSign, Shield, Clock, Zap];

const defaultContent = {
  heroHeadline: "ACH Payment Processing\nFor Your Business",
  heroSubheadline: "Accept bank transfers and electronic checks with lower fees than credit cards. Perfect for recurring payments, payroll, and high-value transactions.",
  features: [
    { title: "Lower Processing Costs", description: "ACH transactions typically cost $0.20-$1.50 per transaction, significantly less than credit card processing fees of 2-3%." },
    { title: "Secure & Compliant", description: "Bank-level encryption and NACHA compliance ensure your transactions are safe and meet all regulatory requirements." },
    { title: "Automated Recurring Payments", description: "Set up automatic billing for subscriptions, memberships, and recurring services to improve cash flow." },
    { title: "Fast Settlement", description: "ACH transfers typically settle in 1-2 business days, providing reliable and predictable funding." }
  ],
  benefits: [
    "Process payroll deposits directly to employee bank accounts",
    "Accept one-time and recurring payments from customer checking accounts",
    "Reduce chargebacks compared to credit card transactions",
    "No interchange fees or card network costs",
    "Ideal for high-ticket purchases and B2B transactions",
    "Lower failed payment rates with account verification",
    "Compatible with accounting software and payment platforms",
    "Support for both ACH credit and ACH debit transactions"
  ],
  faqs: [
    { q: "How long does ACH processing take to settle?", a: "Standard ACH transactions settle in 1–2 business days. Same-day ACH is available for time-sensitive payments. EzPay America provides clear settlement timelines so you can manage cash flow accurately." },
    { q: "Can I use ACH and credit card processing together?", a: "Yes. Many EzPay America merchants use both — zero-fee credit card processing for in-person sales and ACH for recurring billing or large invoices. You get a single dashboard for all transactions." },
    { q: "What happens if an ACH payment fails?", a: "Failed ACH payments generate a return code explaining the reason (insufficient funds, closed account, etc.). EzPay America's system flags these automatically so you can follow up or retry the payment." },
    { q: "Is there a minimum monthly volume for ACH processing?", a: "No. EzPay America offers ACH processing for businesses of all sizes, from small service providers to high-volume B2B companies." }
  ],
  seo: {
    title: "ACH Payment Processing - Accept Bank Transfers | EzPay America",
    description: "Accept ACH payments and bank transfers with EzPay America. Lower fees than credit cards, automated recurring billing, secure payroll deposits. Fast approval and easy integration. Call (865) 316-9625.",
    keywords: "ACH payment processing, ACH payments, bank transfer payments, electronic check processing, eCheck payments, ACH credit, ACH debit, recurring ACH payments, automated clearing house, direct deposit, payroll ACH, bank account payments, ACH merchant services, ACH processing fees, accept bank transfers, electronic funds transfer, EFT processing, ACH payment gateway, recurring billing ACH, subscription payments ACH, low cost payment processing, bank to bank transfers, check by phone, check by web, ACH payment solutions, business ACH processing"
  }
};

export default function ACHPayments() {
  const [content, setContent] = useState(defaultContent);
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    let cancelled = false;
    base44.auth.me()
      .then(u => { if (!cancelled && u?.role === 'admin') setIsAdmin(true); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handlePublish = (newContent) => {
    setContent(prev => ({ ...prev, ...newContent }));
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title={content.seo.title}
        description={content.seo.description}
        keywords={content.seo.keywords}
      />
      {isAdmin && (
        <AIContentGenerator
          pageName="ACH Payments"
          currentContent={content}
          onPublish={handlePublish}
        />
      )}

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <Building2 className="w-20 h-20 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              {content.heroHeadline.split('\n').map((line, i) => (
                <span key={i}>{i === 1 ? <><br /><span className="text-blue-400">{line}</span></> : line}</span>
              ))}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {content.heroSubheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("FreeDemo")}>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-6 text-lg shadow-xl">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button className="bg-white text-blue-900 hover:bg-gray-100 border-2 border-white px-8 py-6 text-lg font-semibold">
                  Learn More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose ACH Processing?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lower costs, improved cash flow, and better payment reliability
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.features.map((feature, index) => {
              const Icon = featureIcons[index] || DollarSign;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group">
                    <CardContent className="p-8 space-y-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${featureColors[index]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Complete ACH Payment Solutions
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                EzPay America's ACH payment processing enables businesses to accept electronic bank transfers directly from customer checking and savings accounts. Our NACHA-compliant ACH processing solutions offer lower transaction costs, reduced chargebacks, and improved cash flow management.
              </p>
              <div className="space-y-3">
                {content.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardContent className="p-8">
                  <TrendingDown className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Save Up To 70% On Processing Costs
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    ACH transactions cost a fraction of credit card fees. A $1,000 payment costs $0.50-$1.50 with ACH versus $25-$30 with credit cards. For businesses processing high-value or recurring payments, ACH processing can save thousands monthly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-8">
                  <Zap className="w-12 h-12 text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Automated Recurring Billing
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Set up automatic monthly, weekly, or custom recurring payments for subscriptions, memberships, rent, utilities, and more. Improve cash flow predictability and reduce administrative overhead with automated ACH billing.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perfect For These Industries
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Subscription Services",
              "Property Management",
              "Utilities & Telecom",
              "Insurance Companies",
              "Membership Organizations",
              "Education & Tuition",
              "Healthcare Billing",
              "B2B Transactions"
            ].map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                      <h3 className="font-semibold text-gray-900">{industry}</h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ServiceSEOContent
        heading="ACH Payment Processing for Small & Mid-Size Businesses"
        intro="ACH (Automated Clearing House) payments let businesses accept bank-to-bank transfers electronically — no card networks, no interchange fees, no percentage-based processing costs. Whether you're collecting recurring membership dues, processing B2B invoices, or handling payroll, EzPay America's ACH processing delivers lower costs and reliable settlement."
        sections={[
          {
            h2: "ACH vs Credit Card Processing: Which Is Better?",
            body: "The right answer depends on your business. Credit cards are ideal for in-person retail or restaurant transactions where customers expect tap-to-pay convenience. ACH is better for high-value invoices, subscriptions, and B2B payments where cost savings matter most.",
            bullets: [
              "ACH cost: $0.20–$1.50 flat fee per transaction",
              "Credit card cost: 2.5–3.5% per transaction (e.g. $25–$35 on a $1,000 payment)",
              "ACH is ideal for payments over $500 where the savings are significant",
              "Both can be combined — many EzPay America merchants use ACH + zero-fee card processing together"
            ]
          },
          {
            h2: "How ACH Recurring Billing Works",
            body: "EzPay America's recurring ACH billing lets you charge customers automatically on any schedule — weekly, monthly, quarterly, or custom. Once a customer authorizes the payment via a signed agreement, future charges happen automatically with no action required. This is ideal for gyms, SaaS businesses, property managers, and service contractors."
          },
          {
            h2: "Is ACH Processing Secure?",
            body: "Yes. ACH transactions are processed through the Federal Reserve's Automated Clearing House network, governed by NACHA operating rules. EzPay America's ACH processing is fully NACHA-compliant with bank-level encryption, account verification, and return code management to minimize failed payments and fraud."
          }
        ]}
        faqs={content.faqs}
        relatedLinks={[
          { label: "Services Overview", to: createPageUrl("Services") },
          { label: "Web Payment Pages", to: createPageUrl("WebPaymentPages") },
          { label: "Merchant Cash Advance", to: createPageUrl("MerchantCashAdvance") },
          { label: "E-Commerce", to: createPageUrl("ECommerce") },
          { label: "Apply Online", to: createPageUrl("ApplyOnline") }
        ]}
      />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Start Accepting ACH Payments Today
            </h2>
            <p className="text-xl text-gray-300">
              Lower fees, faster setup, and better cash flow. Get approved in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("ApplyOnline")}>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-6 text-lg shadow-xl">
                  Apply Online Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:8653169625">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-6 text-lg">
                  Call (865) 316-9625
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}