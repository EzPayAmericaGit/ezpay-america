import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
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
            <div className="flex gap-4">
              <a
                href="https://ezpayamerica.com/quiz/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Take Our Quiz
              </a>
              <a
                href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white hover:bg-gray-50 text-amber-600 font-bold py-3 px-8 rounded-lg border-2 border-amber-600 transition-colors"
              >
                Apply Online
              </a>
            </div>
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
            <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">No Transaction Fees</h3>
              <p className="text-gray-600">Save on every transaction with our zero-fee model.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Free Equipment</h3>
              <p className="text-gray-600">Get state-of-the-art equipment at no cost.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">No Contracts</h3>
              <p className="text-gray-600">Month-to-month service with no long-term commitment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">Contact Us Today</h2>
          <p className="text-xl mb-8 text-gray-600">Call us at (865) 316-9625 or apply online</p>
          <a
            href="tel:8653169625"
            className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-colors"
          >
            Call Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">EzPay America</h3>
              <p className="text-gray-400">Making payment processing easier for businesses.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Services</li>
                <li>About Us</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400">(865) 316-9625</p>
              <p className="text-gray-400">contact@ezpayamerica.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EzPay America. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}