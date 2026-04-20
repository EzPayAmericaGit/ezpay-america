import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle2 } from "lucide-react";

const faqs = [
  {
    q: "What is zero fee credit card processing?",
    a: "Zero fee credit card processing lets merchants accept credit cards without paying any transaction fees. Through a cash discount or dual pricing program, a small service fee is transparently shown to customers who pay by card — meaning the business owner pays $0 in processing costs."
  },
  {
    q: "Is the cash discount program legal?",
    a: "Yes. Cash discount programs are 100% legal across the United States when disclosed correctly at the point of sale. EzPay America provides compliant signage and terminal programming to ensure your business meets all card network requirements."
  },
  {
    q: "Who should use zero fee credit card processing?",
    a: "Any small business paying more than $100/month in card fees can benefit — restaurants, retail shops, salons, healthcare offices, food trucks, and service businesses. The higher your monthly volume, the more you save."
  },
  {
    q: "How is EzPay America different from Square or PayPal?",
    a: "Square and PayPal charge 2.6–3.5% per transaction. EzPay America's zero fee program means merchants pay $0 in transaction fees, include free POS equipment, no monthly fees, and no long-term contracts — making us the most affordable payment processor for small businesses."
  },
  {
    q: "How quickly can I get approved?",
    a: "Most merchants are approved within 24 hours. Simply apply online, and our team will contact you to set up your equipment and get you processing payments fast."
  }
];

export default function SEOContentSection() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Main SEO Content Block */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What Is Zero Fee Credit Card Processing?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-4">
            <p>
              Zero fee credit card processing — also called a <strong>cash discount program</strong> — is a merchant services model that eliminates credit card processing fees for the business owner. Instead of paying 2–3% per swipe, you pay <strong>$0 in transaction fees</strong>. A small, transparent service fee is presented to customers who choose to pay by card, while cash-paying customers receive a discount.
            </p>
            <p>
              EzPay America has helped thousands of small businesses across the United States stop paying unnecessary credit card fees. Whether you run a restaurant, retail store, salon, medical office, or service business — our cash discount program is designed to put money back in your pocket.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            How the Cash Discount Program Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Display the Price", desc: "Your regular price is shown — this is the cash price. Card customers see a small service fee added at checkout, fully disclosed on required signage." },
              { step: "2", title: "Customer Chooses", desc: "Customers who pay cash get the lower cash price. Customers who pay by card pay the standard amount inclusive of the service fee." },
              { step: "3", title: "You Keep More", desc: "The service fee covers all processing costs. You receive the full sale amount with zero fees deducted — month after month." }
            ].map(item => (
              <div key={item.step} className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Benefits of Choosing EzPay America
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Zero transaction fees — merchants pay $0 per swipe",
              "No monthly fees, no setup fees, no hidden costs",
              "No long-term contracts — cancel anytime",
              "Free POS equipment included with approval",
              "24-hour merchant account approval",
              "Works for retail, restaurant, salon, healthcare, and more",
              "Compliant signage and terminal setup included",
              "US-based customer support 7 days a week",
              "Next-day funding available",
              "Accept all major cards: Visa, Mastercard, Amex, Discover"
            ].map(benefit => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Who It's For */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Who Should Use Zero Fee Processing?
          </h2>
          <p className="text-gray-600 mb-6">
            Any small business accepting credit cards can benefit. EzPay America serves hundreds of business types across the US, including:
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Restaurants", to: createPageUrl("FullServiceRestaurantPOS") },
              { label: "Retail Stores", to: createPageUrl("RetailMerchants") },
              { label: "Hair Salons", to: createPageUrl("HairSalonPOS") },
              { label: "Food Trucks", to: createPageUrl("FoodTruckPOS") },
              { label: "Medical Offices", to: createPageUrl("DentalOfficePOS") },
              { label: "Coffee Shops", to: createPageUrl("CoffeePOS") },
              { label: "Bars & Pubs", to: createPageUrl("BarTavernPOS") },
              { label: "Grocery Stores", to: createPageUrl("GroceryStorePOS") },
              { label: "Gyms & Fitness", to: createPageUrl("FitnessGymPOS") },
              { label: "Law Firms", to: createPageUrl("LawFirmPOS") },
            ].map(item => (
              <Link
                key={item.label}
                to={item.to}
                className="px-4 py-2 bg-gray-100 hover:bg-amber-100 hover:text-amber-800 text-gray-700 rounded-full text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link to={createPageUrl("Services")} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-sm font-medium transition-colors">
              + View All Business Types →
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-200 text-center">
            <p className="text-gray-700 mb-4">Have more questions? Our team is here to help.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={createPageUrl("FAQ")} className="inline-block px-6 py-3 bg-white border border-amber-500 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition-colors">
                View Full FAQ
              </Link>
              <Link to={createPageUrl("ApplyOnline")} className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors">
                Apply Online — Free
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}