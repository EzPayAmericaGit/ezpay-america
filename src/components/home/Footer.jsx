import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png" alt="EzPay America" className="w-10 h-10 object-contain" />
              <h3 className="text-xl font-bold">EzPay America</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Zero-fee payment processing and POS systems for small businesses across America. No contracts, no monthly fees, free equipment.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="tel:8653169625" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Phone className="w-4 h-4 text-amber-400" />
                (865) 316-9625
              </a>
              <a href="mailto:info@ezpayamerica.com" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <Mail className="w-4 h-4 text-amber-400" />
                info@ezpayamerica.com
              </a>
              <span className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5" />
                Serving businesses nationwide, USA
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to={createPageUrl("Home")} className="hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link to={createPageUrl("Services")} className="hover:text-amber-400 transition-colors">Services</Link></li>
              <li><Link to={createPageUrl("EzPayPOSHome")} className="hover:text-amber-400 transition-colors">EzPay POS</Link></li>
              <li><Link to={createPageUrl("AffiliateSignup")} className="hover:text-amber-400 transition-colors">Affiliate Program</Link></li>
              <li><Link to={createPageUrl("News")} className="hover:text-amber-400 transition-colors">News & Insights</Link></li>
              <li><Link to={createPageUrl("Quiz")} className="hover:text-amber-400 transition-colors">Business Quiz</Link></li>
              <li><Link to={createPageUrl("ApplyOnline")} className="hover:text-amber-400 transition-colors">Apply Online</Link></li>
              <li><Link to={createPageUrl("Contact")} className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
              <li><Link to={createPageUrl("Helpdesk")} className="hover:text-amber-400 transition-colors">Support / Helpdesk</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4 text-white">Payment Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to={createPageUrl("RetailMerchants")} className="hover:text-amber-400 transition-colors">Retail Merchants</Link></li>
              <li><Link to={createPageUrl("RestaurantMerchants")} className="hover:text-amber-400 transition-colors">Restaurant Merchants</Link></li>
              <li><Link to={createPageUrl("ACHPayments")} className="hover:text-amber-400 transition-colors">ACH Payments</Link></li>
              <li><Link to={createPageUrl("MobilePayments")} className="hover:text-amber-400 transition-colors">Mobile Payments</Link></li>
              <li><Link to={createPageUrl("ECommerce")} className="hover:text-amber-400 transition-colors">E-Commerce</Link></li>
              <li><Link to={createPageUrl("GatewayRecurringBilling")} className="hover:text-amber-400 transition-colors">Recurring Billing</Link></li>
              <li><Link to={createPageUrl("GatewayPaymentLinks")} className="hover:text-amber-400 transition-colors">Payment Links</Link></li>
              <li><Link to={createPageUrl("MerchantCashAdvance")} className="hover:text-amber-400 transition-colors">Merchant Cash Advance</Link></li>
              <li><Link to={createPageUrl("GatewayFraudProtection")} className="hover:text-amber-400 transition-colors">Fraud Protection</Link></li>
              <li><Link to={createPageUrl("WebPaymentPages")} className="hover:text-amber-400 transition-colors">Web Payment Pages</Link></li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-bold mb-4 text-white">Industries</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to={createPageUrl("FullServiceRestaurantPOS")} className="hover:text-amber-400 transition-colors">Restaurants</Link></li>
              <li><Link to={createPageUrl("CoffeePOS")} className="hover:text-amber-400 transition-colors">Coffee Shops</Link></li>
              <li><Link to={createPageUrl("BarTavernPOS")} className="hover:text-amber-400 transition-colors">Bars & Pubs</Link></li>
              <li><Link to={createPageUrl("GroceryStorePOS")} className="hover:text-amber-400 transition-colors">Grocery Stores</Link></li>
              <li><Link to={createPageUrl("HairSalonPOS")} className="hover:text-amber-400 transition-colors">Hair Salons</Link></li>
              <li><Link to={createPageUrl("FitnessGymPOS")} className="hover:text-amber-400 transition-colors">Fitness Gyms</Link></li>
              <li><Link to={createPageUrl("DentalOfficePOS")} className="hover:text-amber-400 transition-colors">Dental Offices</Link></li>
              <li><Link to={createPageUrl("LawFirmPOS")} className="hover:text-amber-400 transition-colors">Law Firms</Link></li>
              <li><Link to={createPageUrl("HVACCompanyPOS")} className="hover:text-amber-400 transition-colors">HVAC Companies</Link></li>
              <li><Link to={createPageUrl("FoodTruckPOS")} className="hover:text-amber-400 transition-colors">Food Trucks</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} EzPay America. All rights reserved. | Payment processing services for small businesses across the USA.</p>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("Sitemap")} className="hover:text-amber-400 transition-colors">Sitemap</Link>
            <span>|</span>
            <a href="mailto:info@ezpayamerica.com" className="hover:text-amber-400 transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}