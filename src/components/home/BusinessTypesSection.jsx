import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Smartphone, DollarSign, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const businessTypes = [
  {
    icon: Building2,
    title: "ACH Payments",
    description: "Learn how the ACH credit process allows employers to securely and efficiently deposit payroll directly into employees' bank accounts. Discover the benefits of ACH payments for fast, paperless payroll processing.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Smartphone,
    title: "Mobile Payments",
    description: "Accept secure credit card payments on phones and tablets using your EzPay America account. Enjoy fast, reliable mobile payment processing for businesses on the go.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: DollarSign,
    title: "Merchant Capital",
    description: "A merchant cash advance lets businesses convert future credit card sales into immediate working capital. This financing option is ideal for companies seeking quick access to funds without the hassle of traditional loans or credit checks.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce",
    description: "EzPay America integrates with popular eCommerce platforms like Shopsite, SEO Cart, Zen Cart, and OS Commerce to provide secure, seamless payment processing that boosts online sales and improves checkout efficiency.",
    color: "from-orange-500 to-orange-600"
  }
];

export default function BusinessTypesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            We Can Handle Any Business Type
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {businessTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center`}>
                    <type.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-orange-500">
                    {type.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}