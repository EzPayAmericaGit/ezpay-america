import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" style={{paddingTop: '80px'}}>
      {/* Static Background Elements - no animation to reduce TBT */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-700">
                #1 Zero-Fee Payment Processor for Small Business
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Stop Paying Credit Card<br className="hidden sm:block" /> Processing Fees — Forever
              </h1>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent leading-snug">
                Zero-Fee Merchant Services · Free POS Equipment · No Contracts
              </h2>
            </div>

            <p className="text-xl text-gray-600 leading-relaxed">
              EzPay America's cash discount program eliminates 100% of your credit card processing fees. Free equipment. 24-hour approval. No monthly costs. Trusted by 15,000+ retailers and restaurants nationwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("ApplyOnline")}>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all">
                  Apply Free — Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="tel:8653169625">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-6 text-lg shadow-lg"
                >
                  Call (865) 316-9625
                </Button>
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-nowrap items-center gap-3 pt-2 overflow-x-auto">
              {["15,000+ businesses served", "Zero transaction fees", "24-hour approval", "No contracts ever"].map((item) => (
                <div key={item} className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                  <span aria-hidden="true" className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs flex-shrink-0">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/f9e2bc49c_BUSINESS.jpg"
                alt="Modern payment processing terminal and POS system for retail and restaurant businesses"
                className="w-full h-auto"
                loading="eager"
                fetchpriority="high"
                width="800"
                height="600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">$0 Processing Fees</p>
                  <p className="text-sm text-gray-500">Keep every dollar you earn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out both;
        }
      `}</style>
    </section>
  );
}