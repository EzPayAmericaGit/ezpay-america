import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SEOHead from "../components/SEOHead";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle,
  Clock,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import ChatBot from "../components/support/ChatBot";

const supportOptions = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our support team for immediate assistance.",
    action: "Call (865) 316-9625",
    href: "tel:8653169625",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us your questions and we'll respond within 24 hours.",
    action: "Send Email",
    href: "mailto:contact@ezpayamerica.com",
    color: "from-green-500 to-green-600"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our AI support assistant in real-time, 24/7.",
    action: "Open Chat",
    color: "from-purple-500 to-purple-600",
    isChat: true
  }
];

const faqs = [
  {
    question: "What are your processing rates?",
    answer: "Our rates are competitive and customized based on your business type and monthly volume. Contact us for a personalized quote."
  },
  {
    question: "How long does setup take?",
    answer: "Most merchants are approved and processing within 24-48 hours of submitting a complete application."
  },
  {
    question: "Is there a contract?",
    answer: "No! We believe in earning your business every day. You're free to leave at any time with no penalties."
  },
  {
    question: "What equipment do I need?",
    answer: "We offer free equipment through our Free Equipment Program, including terminals, mobile readers, and POS systems."
  },
  {
    question: "Do you offer 24/7 support?",
    answer: "Yes! Our US-based customer support team is available 24/7 to assist you with any issues or questions."
  },
  {
    question: "Can I accept payments online?",
    answer: "Absolutely! We offer e-commerce solutions that integrate with most shopping carts and websites."
  }
];

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEOHead 
        title="Support Center - 24/7 Merchant Services Help & Customer Support"
        description="24/7 US-based support for EzPay America merchants. Phone, email, and live chat available. Get help with payment terminals, POS systems, account setup, and more. Call (865) 316-9625 anytime."
        keywords="EzPay support, merchant support, 24/7 payment processing support, credit card processing help, POS system support, merchant services customer service, payment terminal help, merchant account support, EzPay America phone number, technical support, payment processing FAQ, merchant help desk, small business payment support, live chat merchant support, US based merchant support"
        url="https://ezpayamerica.com/Support"
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Support Center</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              We're here to help you succeed. Get the support you need, when you need it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Can We Help You?
            </h2>
            <p className="text-xl text-gray-600">
              Choose the support method that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all">
                  <CardContent className="p-8 space-y-4 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-2xl flex items-center justify-center mx-auto`}>
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {option.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {option.description}
                    </p>
                    {option.isChat ? (
                      <p className="text-sm text-gray-500 italic">
                        Click the chat icon in the bottom-right corner
                      </p>
                    ) : (
                      <a href={option.href}>
                        <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white">
                          {option.action}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 24/7 Support Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-200"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">24/7 US-Based Support</h3>
                  <p className="text-gray-600">Our team is always here when you need us</p>
                </div>
              </div>
              <a href="tel:8653169625">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
}