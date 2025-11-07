import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Coffee, Truck, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const restaurantTypes = [
  {
    icon: UtensilsCrossed,
    title: "Full Service Restaurants",
    description: "Complete POS solutions with tableside ordering, kitchen management, and split payment capabilities.",
    color: "from-red-500 to-red-600"
  },
  {
    icon: Coffee,
    title: "Quick Service & Cafes",
    description: "Fast processing with no-signature-required approvals to keep your lines moving quickly.",
    color: "from-amber-500 to-amber-600"
  },
  {
    icon: Truck,
    title: "Food Trucks",
    description: "Wireless mobile payment solutions that work anywhere your business takes you.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Clock,
    title: "Delivery & Online Orders",
    description: "Seamless integration with online ordering platforms and delivery services.",
    color: "from-blue-500 to-blue-600"
  }
];

export default function RestaurantMerchants() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Restaurant Merchant Solutions
            </h1>
            <p className="text-xl text-gray-800 mb-8">
              Specialized payment processing for restaurants, cafes, food trucks, and the entire food service industry. Fast, reliable, and built for hospitality.
            </p>
            <a
              href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg shadow-xl">
                Apply Online
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Restaurant Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Solutions for Every Type of Restaurant
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {restaurantTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-8 space-y-4 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <type.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
                  alt="Restaurant Payment Solutions"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-4xl font-bold mb-6">
                Built for the Restaurant Industry
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                EzPay America understands the unique needs of restaurants. From fast-paced quick service to elegant fine dining, we provide payment solutions that enhance your operation and delight your guests.
              </p>
              <ul className="space-y-3">
                {[
                  "Tableside payment processing",
                  "Tip adjustment capabilities",
                  "Split check functionality",
                  "Kitchen display integration",
                  "Online ordering integration",
                  "Gift card programs"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Serve More Customers, Faster
            </h2>
            <p className="text-xl text-gray-600">
              Get the payment processing solution your restaurant deserves. No hidden fees, no long-term contracts.
            </p>
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
    </div>
  );
}