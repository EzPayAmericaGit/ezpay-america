import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h3 className="text-xl font-bold">EzPay America</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Making payment processing easier for businesses across America.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">About Us</a></li>
              <li><a href="https://ezpayamerica.com/quiz/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">Take Quiz</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Point of Sale</li>
              <li>Mobile Payments</li>
              <li>ACH Processing</li>
              <li>E-Commerce Solutions</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <a href="tel:8653169625" className="hover:text-amber-400 transition-colors">
                  (865) 316-9625
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400" />
                <a href="mailto:info@ezpayamerica.com" className="hover:text-amber-400 transition-colors">
                  info@ezpayamerica.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 mt-1" />
                <span>United States</span>
              </li>
              <li className="pt-2">
                <Link 
                  to={createPageUrl("Contact")}
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  Visit Contact Page →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} EzPay America. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}