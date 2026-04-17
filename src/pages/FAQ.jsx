import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SEOHead from "../components/SEOHead";

const FAQ_CATEGORIES = [
  {
    category: "Getting Started",
    faqs: [
      {
        q: "How does zero-fee payment processing work?",
        a: "With EzPay America's zero-fee program, a small convenience fee is passed to the customer at checkout instead of being deducted from your revenue. You receive 100% of every sale — Visa and Mastercard allow this under their cash discount / surcharge programs."
      },
      {
        q: "How fast can I get approved?",
        a: "Most merchants are approved within 24 hours. Once approved, we ship your equipment within 1–2 business days so you can start accepting payments immediately."
      },
      {
        q: "Is there a contract or long-term commitment?",
        a: "No. EzPay America believes we should earn your business every day. There are no long-term contracts — you can cancel at any time without penalty fees."
      },
      {
        q: "What types of businesses do you work with?",
        a: "We work with virtually all small and medium-sized businesses — restaurants, retail stores, salons, medical offices, contractors, professional services, and more. If you accept payments, we can help."
      }
    ]
  },
  {
    category: "Equipment & Setup",
    faqs: [
      {
        q: "Do I really get free POS equipment?",
        a: "Yes. Our Free Equipment Program provides state-of-the-art payment terminals and POS systems at no cost. Equipment is yours to use as long as you're processing with us."
      },
      {
        q: "What POS systems do you offer?",
        a: "We offer countertop terminals, wireless terminals, tablet-based POS systems, and full restaurant POS solutions. During your consultation we'll recommend the best setup for your specific business type."
      },
      {
        q: "How do I set up the equipment?",
        a: "Our team handles the entire setup process including programming, testing, and training. We provide on-call support to make sure your transition is seamless."
      },
      {
        q: "What if my equipment breaks or malfunctions?",
        a: "We provide full equipment support and replacement. If your terminal malfunctions, contact our support line and we'll resolve the issue or send a replacement quickly."
      }
    ]
  },
  {
    category: "Fees & Pricing",
    faqs: [
      {
        q: "Are there any hidden fees?",
        a: "No hidden fees. Our pricing is fully transparent. With the zero-fee program, you pay nothing on transactions — the convenience fee is passed to the card user. We'll walk you through every line of your statement."
      },
      {
        q: "What if a customer refuses to pay the convenience fee?",
        a: "You can always offer a cash discount to customers who pay in cash. The system handles this automatically and keeps you compliant with card network rules."
      },
      {
        q: "Do you offer traditional payment processing too?",
        a: "Yes. If the zero-fee model isn't right for your business, we also offer competitive traditional processing rates. We'll find the best solution for your situation."
      }
    ]
  },
  {
    category: "Support & Account Management",
    faqs: [
      {
        q: "What kind of support do you provide?",
        a: "We offer dedicated account management plus phone, email, and chat support. Unlike large processors where you're just a number, our team knows your business personally."
      },
      {
        q: "How do I view my transaction history and reports?",
        a: "You'll have access to a merchant portal with detailed reporting, transaction history, batch summaries, and analytics — available 24/7 from any device."
      },
      {
        q: "Can I accept payments online as well?",
        a: "Yes. We offer e-commerce integrations, virtual terminals, payment links, and web payment pages so you can accept payments anywhere — in-store, online, or on the go."
      },
      {
        q: "Do you offer merchant cash advances?",
        a: "Yes. If your business needs working capital, our Merchant Cash Advance program provides fast funding based on your sales volume — typically funded within 24–48 hours."
      }
    ]
  }
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-gray-900 font-semibold text-base group-hover:text-amber-600 transition-colors">
          {faq.q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-amber-500 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].category);

  const currentFAQs = FAQ_CATEGORIES.find(c => c.category === activeCategory)?.faqs || [];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="FAQ - Frequently Asked Questions | EzPay America"
        description="Get answers to the most common questions about EzPay America's zero-fee payment processing, free POS equipment, setup, fees, and merchant support."
        keywords="payment processing FAQ, zero fee processing questions, merchant services FAQ, POS equipment questions, EzPay America FAQ, credit card processing questions"
        url="https://ezpayamerica.com/FAQ"
      />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/20 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <HelpCircle className="w-4 h-4" />
              Got Questions? We've Got Answers.
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-800">
              Everything you need to know about EzPay America's payment processing solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {FAQ_CATEGORIES.map(cat => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  activeCategory === cat.category
                    ? "bg-amber-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-600 border border-gray-200"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-4"
          >
            {currentFAQs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Still have questions CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Our team is happy to walk you through everything — no pressure, no obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:8653169625">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Call (865) 316-9625
              </Button>
            </a>
            <Link to={createPageUrl("Contact")}>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-lg">
                Send Us a Message
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}