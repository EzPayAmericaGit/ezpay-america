import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const otherBenefits = [
  {
    title: "No Monthly Fees",
    description: "You will receive a monthly statement showing your savings compared to what you would have paid with another company but with EzPay America your savings are assured."
  },
  {
    title: "No Batch Fees",
    description: "Why should you be charged for closing out at the end of the business day? Batch out as much as you like. That is just one of the advantages of using EzPay America's payment systems."
  },
  {
    title: "No Swipe Fees",
    description: "Process payments without worrying about per-swipe charges. Keep more of your hard-earned revenue with our transparent pricing structure."
  }
];

export default function OtherBenefitsSection() {
  return (
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
            The Power Of EzPay America
          </h2>
          <p className="text-xl text-gray-600">Other Benefits</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {otherBenefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
              Apply Online Now!
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}