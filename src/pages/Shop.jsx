import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { ShoppingCart, CreditCard, Shield, Zap, Package, Star, Smartphone, RefreshCw, HeadphonesIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

const features = [
  { icon: CreditCard, title: "Zero-Fee Processing", description: "Every product you sell comes with zero-fee payment processing included — keep all your profits.", color: "from-amber-500 to-orange-600" },
  { icon: Package, title: "Free Equipment Included", description: "All hardware includes free activation and free shipping directly to your business address.", color: "from-blue-500 to-blue-600" },
  { icon: Shield, title: "Warranty & Support", description: "Every terminal includes manufacturer warranty and 24/7 technical support from our US team.", color: "from-green-500 to-green-600" },
  { icon: Zap, title: "Same-Day Shipping", description: "Order before 2pm EST and your equipment ships the same business day.", color: "from-purple-500 to-purple-600" },
  { icon: Star, title: "Top Brands Available", description: "Clover, PAX, Ingenico, Verifone — industry-leading payment hardware at unbeatable prices.", color: "from-yellow-500 to-amber-600" },
  { icon: Smartphone, title: "Mobile & Wireless Options", description: "Choose from countertop, wireless, mobile, and tablet POS solutions for any business type.", color: "from-teal-500 to-teal-600" },
  { icon: RefreshCw, title: "Equipment Upgrades", description: "Existing merchants can upgrade their hardware anytime with our free equipment upgrade program.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "Setup Assistance", description: "Our team will remotely set up and configure your new hardware so you're ready to process fast.", color: "from-red-500 to-red-600" },
  { icon: ShoppingCart, title: "Bundle Deals", description: "Get complete hardware bundles for your business type at significant savings over individual items.", color: "from-indigo-500 to-indigo-600" },
];

export default function Shop() {
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => base44.entities.Product.filter({ active: true }),
  });

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Payment Processing Hardware & POS Equipment Shop | EzPay America"
        description="Shop payment processing hardware: credit card terminals, POS systems, wireless readers, and more. Free shipping, free setup, zero-fee processing included. Order today."
        keywords="payment processing hardware, credit card terminal, POS equipment, card reader, wireless payment terminal, payment terminal shop, buy credit card terminal, POS system for sale, payment hardware free shipping, Clover terminal, PAX terminal"
        url="https://ezpayamerica.com/Shop"
        noindex={true}
      />
      <LandingHero
        badge="Payment Hardware Store"
        headline="Top Payment Hardware — Free Shipping & Setup"
        subheadline="Shop the latest credit card terminals, POS systems, and mobile readers. Every purchase includes free shipping, free setup, and zero-fee processing for your business."
        bullets={[
          "Industry-leading terminals & POS systems",
          "Free shipping on all orders",
          "Free remote setup & configuration",
          "Zero-fee processing included",
          "Same-day shipping on orders before 2pm EST"
        ]}
        service="Payment Hardware"
      />

      {/* Products grid */}
      {products.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Shop Payment Hardware</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {product.image && <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-amber-600">${product.price}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">Free Shipping</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <LandingFeatures
        title="Why Shop With EzPay America"
        subtitle="Get the best payment hardware with everything you need to start processing included."
        features={features}
      />
      <LandingCTA
        headline="Ready to Upgrade Your Payment Hardware?"
        subtext="Get started with free equipment when you sign up for EzPay America's zero-fee processing program."
        service="Payment Hardware"
      />
    </div>
  );
}