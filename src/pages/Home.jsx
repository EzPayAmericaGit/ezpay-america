import React from "react";
import SEOHead from "../components/SEOHead";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Home"
        description="EzPay America offers zero-fee payment processing, free POS systems, and merchant services."
        keywords="payment processing, merchant services, zero fee processing"
      />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Payment Processing Just Got a Whole Lot Easier
            </h1>
            <p className="text-xl text-gray-800 mb-8">
              Work smarter, automate for efficiency, and open up new revenue streams.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose EzPay America
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-2">No Transaction Fees</h3>
              <p className="text-gray-600">Save on every transaction with our zero-fee model.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Free Equipment</h3>
              <p className="text-gray-600">Get state-of-the-art equipment at no cost.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-bold mb-2">No Contracts</h3>
              <p className="text-gray-600">Month-to-month service with no long-term commitment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Apply online today and start saving on payment processing.</p>
          <a
            href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Apply Online Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} EzPay America. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}