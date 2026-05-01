import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Package, FileText } from "lucide-react";

const benefits = [
  {
    icon: CreditCard,
    title: "No Transaction Fees",
    description: "Visa and MasterCard rates continue to increase year after year however, your cost will never change.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Package,
    title: "Free Equipment",
    description: "Our Free Equipment Program allows you to have state of the art payment processing equipment without the high cost.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: FileText,
    title: "No Long Term Contract",
    description: "EzPay America believes that we should earn your business each and every day. If we don't, you should not be bound by contract.",
    color: "from-amber-500 to-orange-600"
  }
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index}>
              <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}