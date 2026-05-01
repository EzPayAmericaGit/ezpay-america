import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const offers = [
  "Free Equipment Program",
  "Branded Payment Gateway",
  "Point Of Sale Systems",
  "B2B ACH Payment Processing",
  "Gift And Loyalty Programs",
  "Level I, II, And III B2B Payment Processing",
  "Quickbooks Integration",
  "Online Payment Pages",
  "Ecommerce Solutions we integrate with most shopping carts",
  "API Solutions for SAAS Developers",
  "24-7 US Based Customer Support"
];

export default function AdditionalOffersSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80&auto=format"
                alt="EzPay America comprehensive payment processing solutions and POS systems for businesses"
                className="relative rounded-3xl shadow-2xl"
                loading="lazy"
                width="800"
                height="600"
              />
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                EzPay America<br />Also Offers
              </h2>
            </div>

            <div className="space-y-3">
              {offers.map((offer, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{offer}</span>
                </div>
              ))}
            </div>

            <Link to={createPageUrl("ApplyOnline")} className="block mt-12">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                Apply Online Now!
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}