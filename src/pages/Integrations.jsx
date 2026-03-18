import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Code, RefreshCw, BarChart3, Shield, Zap, Package, ShoppingCart, Calculator, Users, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: ShoppingCart, title: "Shopify & WooCommerce", description: "Connect EzPay to your Shopify or WooCommerce store for zero-fee payment processing online.", color: "from-green-600 to-green-700" },
  { icon: Calculator, title: "QuickBooks & Xero", description: "Automatically sync transactions, refunds, and payouts to your accounting software.", color: "from-blue-500 to-blue-600" },
  { icon: Users, title: "CRM Systems", description: "Sync customer data and transaction history with Salesforce, HubSpot, and more.", color: "from-amber-500 to-orange-600" },
  { icon: Package, title: "ERP Systems", description: "Connect with NetSuite, SAP, and other ERPs for complete back-office financial automation.", color: "from-purple-500 to-purple-600" },
  { icon: Code, title: "REST API", description: "Build custom integrations with any platform using our comprehensive REST API.", color: "from-gray-700 to-gray-900" },
  { icon: RefreshCw, title: "Real-Time Data Sync", description: "All integrations sync in real time — no manual exports, no data lag, no errors.", color: "from-teal-500 to-teal-600" },
  { icon: BarChart3, title: "Reporting & Analytics Platforms", description: "Connect to Tableau, Looker, and other BI tools for advanced payment analytics.", color: "from-yellow-500 to-amber-600" },
  { icon: Shield, title: "Secure OAuth Connections", description: "All integrations use OAuth 2.0 and encrypted data transfer — no credentials shared.", color: "from-pink-500 to-pink-600" },
  { icon: Zap, title: "One-Click Setup", description: "Most integrations connect in under 5 minutes with a guided OAuth flow — no dev needed.", color: "from-red-500 to-red-600" },
  { icon: HeadphonesIcon, title: "Integration Support", description: "Our integration specialists help you connect and configure every third-party platform.", color: "from-indigo-500 to-indigo-600" },
];

export default function Integrations() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Payment Integrations – Shopify, QuickBooks, CRM & More | EzPay America"
        description="Connect EzPay America to Shopify, WooCommerce, QuickBooks, Xero, Salesforce, and 200+ platforms. Zero-fee processing with seamless integrations. Apply free today."
        keywords="payment integrations, Shopify payment integration, WooCommerce payment gateway, QuickBooks payment sync, Xero payment integration, payment API integration, CRM payment integration, ERP payment integration, e-commerce payment integration"
        url="https://ezpayamerica.com/Integrations"
      />
      <LandingHero
        badge="Integrations & Connections"
        headline="Connect Your Payments to Every Platform You Use"
        subheadline="Shopify, WooCommerce, QuickBooks, Xero, Salesforce, and 200+ integrations. EzPay America plugs into your existing business tools with zero-fee processing."
        bullets={[
          "Shopify & WooCommerce — zero fees online",
          "QuickBooks & Xero auto-sync",
          "CRM & ERP integrations",
          "REST API for custom connections",
          "One-click OAuth setup"
        ]}
        service="Integrations"
      />
      <LandingFeatures title="Payments That Work With Every Tool You Use" subtitle="200+ integrations, REST API, and real-time sync — connect everything in minutes." features={features} />
      <LandingCTA headline="Connect EzPay to Your Business Stack Today" subtext="Shopify, QuickBooks, Salesforce and more — all connected, all zero-fee." service="Integrations" />
    </div>
  );
}