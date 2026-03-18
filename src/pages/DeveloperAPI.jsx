import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Code, Shield, Zap, BarChart3, RefreshCw, Lock, Globe, Webhook, FileText } from "lucide-react";

const features = [
  { icon: Code, title: "RESTful API", description: "Clean, well-documented REST API to integrate payments into any application or platform.", color: "from-gray-700 to-gray-900" },
  { icon: Globe, title: "SDKs for Every Language", description: "Official SDKs for JavaScript, Python, PHP, Ruby, Java, and more — get to production faster.", color: "from-blue-500 to-blue-600" },
  { icon: Zap, title: "Sandbox Testing", description: "Full sandbox environment to test every payment scenario before going live.", color: "from-amber-500 to-orange-600" },
  { icon: Webhook, title: "Webhooks", description: "Real-time event notifications for payments, refunds, disputes, and subscription events.", color: "from-green-500 to-green-600" },
  { icon: Shield, title: "PCI Compliant by Design", description: "Our tokenization API keeps your servers out of scope for PCI compliance automatically.", color: "from-purple-500 to-purple-600" },
  { icon: Lock, title: "OAuth & API Key Auth", description: "Flexible authentication with OAuth 2.0 and API key support for all integration types.", color: "from-teal-500 to-teal-600" },
  { icon: RefreshCw, title: "Subscriptions API", description: "Full subscription management API for SaaS billing, memberships, and recurring revenue.", color: "from-yellow-500 to-amber-600" },
  { icon: FileText, title: "Comprehensive Docs", description: "Step-by-step guides, code samples, and Postman collections for every endpoint.", color: "from-pink-500 to-pink-600" },
  { icon: BarChart3, title: "99.99% Uptime SLA", description: "Enterprise-grade infrastructure with 99.99% uptime — your payment API is always available.", color: "from-red-500 to-red-600" },
];

export default function DeveloperAPI() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Payment API & SDKs for Developers | EzPay America"
        description="Powerful payment API and SDKs for developers. RESTful API, webhooks, sandbox testing, zero transaction fees. Integrate payments into any app. Get started free."
        keywords="payment API, payment SDK, developer payment integration, REST payment API, payment gateway API, JavaScript payment SDK, Python payment API, payment API documentation, webhook payments, payment developer tools, embed payments app"
        url="https://ezpayamerica.com/DeveloperAPI"
      />
      <LandingHero
        badge="APIs & SDKs for Developers"
        headline="The Payment API Built for Developers"
        subheadline="Integrate payments into any application with our clean REST API, official SDKs, and sandbox testing. Zero transaction fees. Production-ready in hours, not weeks."
        bullets={[
          "RESTful API with comprehensive documentation",
          "SDKs for JS, Python, PHP, Ruby, Java",
          "Full sandbox for testing all scenarios",
          "Real-time webhooks for all events",
          "Zero transaction fees in production"
        ]}
        service="Developer API & SDKs"
      />
      <LandingFeatures title="Payments Infrastructure Built for Scale" subtitle="From indie developers to enterprise engineering teams — our API handles it all." features={features} />
      <LandingCTA headline="Start Building With Our Payment API" subtext="Free sandbox access, zero fees, comprehensive docs. Build your first integration today." service="Developer API & SDKs" />
    </div>
  );
}