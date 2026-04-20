import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex justify-between items-start gap-4 py-2"
      >
        <span className="font-semibold text-gray-900">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
      </button>
      {open && <p className="text-gray-600 mt-2 leading-relaxed">{a}</p>}
    </div>
  );
}

/**
 * Props:
 *  - heading: string (main H2 keyword heading)
 *  - intro: string (150–200 word intro paragraph)
 *  - sections: [{ h2, body, bullets? }]
 *  - faqs: [{ q, a }]
 *  - relatedLinks: [{ label, to }]
 */
export default function ServiceSEOContent({ heading, intro, sections = [], faqs = [], relatedLinks = [] }) {
  return (
    <section className="bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Intro */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">{heading}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{intro}</p>
        </div>

        {/* Content Sections */}
        {sections.map((sec, i) => (
          <div key={i} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{sec.h2}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{sec.body}</p>
            {sec.bullets && (
              <ul className="space-y-2 mt-4">
                {sec.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Internal Links */}
        {relatedLinks.length > 0 && (
          <div className="mb-14 p-6 bg-amber-50 border border-amber-200 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore Related Services</h3>
            <div className="flex flex-wrap gap-3">
              {relatedLinks.map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  className="px-4 py-2 bg-white border border-amber-300 text-amber-800 rounded-full text-sm font-medium hover:bg-amber-100 transition-colors"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {faqs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            to={createPageUrl("ApplyOnline")}
            className="inline-block px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-lg shadow-lg transition-colors"
          >
            Get Started Free — No Contracts
          </Link>
          <p className="mt-3 text-sm text-gray-500">24-hour approval · Free equipment · $0 setup fee</p>
        </div>

      </div>
    </section>
  );
}