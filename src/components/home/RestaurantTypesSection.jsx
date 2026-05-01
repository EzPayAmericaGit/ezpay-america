import React from "react";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Coffee, Zap, Truck, ArrowRight } from "lucide-react";

const restaurantTypes = [
  {
    icon: UtensilsCrossed,
    title: "Full Service Restaurants",
    description: "When it comes to a quick-serve restaurant, fast service is important. However, slow credit card processing can be a major problem. To tackle this issue, EzPay America offers a range of features for its quick-serve restaurant credit card processing partners. These include fast connections, instant approvals, and no-signature-required approvals.",
    color: "from-red-500 to-red-600"
  },
  {
    icon: Coffee,
    title: "Casual Dining",
    description: "Fast casual restaurants, like quick-serve restaurants, require swift credit card processing. The speed of service is vital to building repeat customer traffic. EzPay America guarantees that your restaurant's credit card processing is fast enough to keep up with your customers, ensuring that they keep returning.",
    color: "from-amber-500 to-amber-600"
  },
  {
    icon: Zap,
    title: "Quick Serve Restaurants",
    description: "In the fast-paced world of quick serve restaurants, slow credit card processing just won't cut it. That's why EzPay America offers a suite of powerful features designed to help our partners stay ahead of the game. With fast connections, instant approvals, and no signature required approvals.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Truck,
    title: "Food Trucks",
    description: "Food trucks have become increasingly popular in today's society. At EzPay America, we understand the unique processing needs of these types of merchants. That's why we offer state-of-the-art wireless solutions to ensure that you can run your business without any interruption due to a lack of connection.",
    color: "from-blue-500 to-blue-600"
  }
];

export default function RestaurantTypesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Specialized Restaurant Solutions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {restaurantTypes.map((type, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mb-6`}>
                <type.icon className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {type.title}
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {type.description}
              </p>

              <a
                href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-gray-300 hover:bg-gray-900 hover:text-white">
                  Apply Online Today!
                  <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                </Button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}