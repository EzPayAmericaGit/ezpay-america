import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-10">Last updated: May 27, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>EzPay America ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (ezpayamerica.com) or use our payment processing and related services. Please read this policy carefully. If you disagree with its terms, please discontinue use of our site and services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="font-medium text-gray-800">Personal Information You Provide:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Name, email address, phone number</li>
              <li>Business name, address, and business type</li>
              <li>Social Security Number or Employer Identification Number (for merchant applications)</li>
              <li>Bank account and routing information</li>
              <li>Government-issued identification documents</li>
              <li>Credit and financial history (for underwriting purposes)</li>
              <li>Messages, inquiries, and support communications</li>
            </ul>
            <p className="font-medium text-gray-800 mt-4">Information Collected Automatically:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>IP address and device identifiers</li>
              <li>Browser type and operating system</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring URLs and click data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Process merchant applications and provide payment services</li>
              <li>Verify your identity and conduct fraud prevention checks</li>
              <li>Communicate with you about your account, applications, and services</li>
              <li>Send transactional and promotional emails (with your consent)</li>
              <li>Improve our website, products, and services</li>
              <li>Comply with legal obligations and regulatory requirements</li>
              <li>Administer our affiliate program</li>
              <li>Analyze usage trends and enhance user experience</li>
              <li>Respond to legal requests and prevent harm</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Sharing Your Information</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li><strong>Payment processors and banks:</strong> To facilitate payment processing and merchant account services</li>
              <li><strong>Service providers:</strong> Third-party vendors who assist with operations (e.g., email delivery, analytics, cloud hosting) under confidentiality agreements</li>
              <li><strong>Card networks:</strong> Visa, Mastercard, and other card brands as required for processing</li>
              <li><strong>Legal authorities:</strong> When required by law, subpoena, or to protect our rights</li>
              <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Affiliates:</strong> Only information necessary to track and credit referrals</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us remember your preferences, understand how you use our site, and deliver relevant content.</p>
            <p className="mt-3">Types of cookies we use:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Essential cookies:</strong> Required for basic website functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site</li>
              <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
            <p className="mt-3">You may disable cookies through your browser settings; however, doing so may affect the functionality of our website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including SSL/TLS encryption, secure data storage, access controls, and regular security audits. We are committed to PCI DSS compliance for all payment card data handling. However, no method of internet transmission or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Merchant application data may be retained for up to seven (7) years as required by financial regulations. You may request deletion of your data subject to our legal retention obligations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal retention requirements)</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us at <a href="mailto:info@ezpayamerica.com" className="text-amber-600 hover:text-amber-700">info@ezpayamerica.com</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. California Privacy Rights (CCPA)</h2>
            <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete your personal information, and the right to opt out of the sale of your personal information. We do not sell personal information. To submit a CCPA request, contact us at <a href="mailto:info@ezpayamerica.com" className="text-amber-600 hover:text-amber-700">info@ezpayamerica.com</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Children's Privacy</h2>
            <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected data from a minor, we will promptly delete it. If you believe we have collected information from a child, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Third-Party Links</h2>
            <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. SMS and Text Messaging</h2>
            <p>If you opt in to receive SMS communications from EzPay America, you agree to receive text messages related to your account, appointments, and promotional offers. Message and data rates may apply. You can opt out at any time by replying STOP to any message or contacting us directly. See our <a href="mailto:info@ezpayamerica.com" className="text-amber-600 hover:text-amber-700">Texting Privacy Policy</a> for full details.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by updating the date at the top of this page. Your continued use of our services after any changes constitutes your acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">14. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
            <div className="mt-3 space-y-1">
              <p><strong>EzPay America</strong></p>
              <p>Email: <a href="mailto:info@ezpayamerica.com" className="text-amber-600 hover:text-amber-700">info@ezpayamerica.com</a></p>
              <p>Phone: <a href="tel:8653169625" className="text-amber-600 hover:text-amber-700">(865) 316-9625</a></p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}