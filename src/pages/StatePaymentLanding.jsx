import React from "react";
import { useParams, Navigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { DollarSign, Gift, Zap, Headphones, FileText, Shield } from "lucide-react";

// Slug → display name + abbreviation
const STATES = {
  "alabama": { name: "Alabama", abbr: "AL" },
  "alaska": { name: "Alaska", abbr: "AK" },
  "arizona": { name: "Arizona", abbr: "AZ" },
  "arkansas": { name: "Arkansas", abbr: "AR" },
  "california": { name: "California", abbr: "CA" },
  "colorado": { name: "Colorado", abbr: "CO" },
  "connecticut": { name: "Connecticut", abbr: "CT" },
  "delaware": { name: "Delaware", abbr: "DE" },
  "florida": { name: "Florida", abbr: "FL" },
  "georgia": { name: "Georgia", abbr: "GA" },
  "hawaii": { name: "Hawaii", abbr: "HI" },
  "idaho": { name: "Idaho", abbr: "ID" },
  "illinois": { name: "Illinois", abbr: "IL" },
  "indiana": { name: "Indiana", abbr: "IN" },
  "iowa": { name: "Iowa", abbr: "IA" },
  "kansas": { name: "Kansas", abbr: "KS" },
  "kentucky": { name: "Kentucky", abbr: "KY" },
  "louisiana": { name: "Louisiana", abbr: "LA" },
  "maine": { name: "Maine", abbr: "ME" },
  "maryland": { name: "Maryland", abbr: "MD" },
  "massachusetts": { name: "Massachusetts", abbr: "MA" },
  "michigan": { name: "Michigan", abbr: "MI" },
  "minnesota": { name: "Minnesota", abbr: "MN" },
  "mississippi": { name: "Mississippi", abbr: "MS" },
  "missouri": { name: "Missouri", abbr: "MO" },
  "montana": { name: "Montana", abbr: "MT" },
  "nebraska": { name: "Nebraska", abbr: "NE" },
  "nevada": { name: "Nevada", abbr: "NV" },
  "new-hampshire": { name: "New Hampshire", abbr: "NH" },
  "new-jersey": { name: "New Jersey", abbr: "NJ" },
  "new-mexico": { name: "New Mexico", abbr: "NM" },
  "new-york": { name: "New York", abbr: "NY" },
  "north-carolina": { name: "North Carolina", abbr: "NC" },
  "north-dakota": { name: "North Dakota", abbr: "ND" },
  "ohio": { name: "Ohio", abbr: "OH" },
  "oklahoma": { name: "Oklahoma", abbr: "OK" },
  "oregon": { name: "Oregon", abbr: "OR" },
  "pennsylvania": { name: "Pennsylvania", abbr: "PA" },
  "rhode-island": { name: "Rhode Island", abbr: "RI" },
  "south-carolina": { name: "South Carolina", abbr: "SC" },
  "south-dakota": { name: "South Dakota", abbr: "SD" },
  "tennessee": { name: "Tennessee", abbr: "TN" },
  "texas": { name: "Texas", abbr: "TX" },
  "utah": { name: "Utah", abbr: "UT" },
  "vermont": { name: "Vermont", abbr: "VT" },
  "virginia": { name: "Virginia", abbr: "VA" },
  "washington": { name: "Washington", abbr: "WA" },
  "west-virginia": { name: "West Virginia", abbr: "WV" },
  "wisconsin": { name: "Wisconsin", abbr: "WI" },
  "wyoming": { name: "Wyoming", abbr: "WY" },
};

const FEATURES = [
  { icon: DollarSign, title: "Zero Transaction Fees", description: "Our surcharge program means you pay $0 in credit card processing fees. Customers pay a small convenience fee — you keep 100% of your revenue.", color: "from-green-500 to-emerald-600" },
  { icon: Gift, title: "Free Equipment Included", description: "Get a free terminal, POS system, or mobile reader with no upfront cost. We provide the hardware you need to accept payments from day one.", color: "from-amber-500 to-orange-600" },
  { icon: Zap, title: "Next-Day Deposits", description: "Get paid fast. Funds from your transactions are deposited into your account the next business day so you always have cash on hand.", color: "from-blue-500 to-cyan-600" },
  { icon: Headphones, title: "24/7 US-Based Support", description: "Our expert support team is available around the clock via phone, chat, or email. Real people who understand your business.", color: "from-purple-500 to-violet-600" },
  { icon: FileText, title: "No Contracts Ever", description: "Month-to-month service with zero cancellation fees. We earn your business every month — you're never locked in.", color: "from-red-500 to-rose-600" },
  { icon: Shield, title: "PCI Compliant Security", description: "Advanced fraud protection, end-to-end encryption, and full PCI DSS compliance. Your customers' data is always safe.", color: "from-teal-500 to-cyan-600" },
];

export default function StatePaymentLanding() {
  const { state } = useParams();
  const stateData = STATES[state];

  // 404 for unknown state slugs
  if (!stateData) return <Navigate to="/" replace />;

  const { name, abbr } = stateData;
  const canonicalUrl = `https://ezpayamerica.com/payment-processing/${state}`;

  const pageSchema = [
    {
      "@type": "LocalBusiness",
      "@id": `${canonicalUrl}#localbusiness`,
      "name": "EzPay America",
      "image": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png",
      "url": canonicalUrl,
      "telephone": "+1-865-316-9625",
      "address": { "@type": "PostalAddress", "addressRegion": abbr, "addressCountry": "US" },
      "areaServed": { "@type": "State", "name": name },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00", "closes": "17:00"
      },
      "sameAs": ["https://www.facebook.com/ezpayamerica", "https://www.linkedin.com/company/ezpay-america"]
    },
    {
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      "serviceType": `Payment Processing in ${name}`,
      "provider": { "@type": "LocalBusiness", "name": "EzPay America", "url": "https://ezpayamerica.com" },
      "areaServed": { "@type": "State", "name": name },
      "description": `Zero-fee payment processing and POS systems for businesses in ${name}. No monthly fees, no contracts, free equipment.`,
      "url": canonicalUrl
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ezpayamerica.com" },
        { "@type": "ListItem", "position": 2, "name": "Payment Processing", "item": "https://ezpayamerica.com/Services" },
        { "@type": "ListItem", "position": 3, "name": `Payment Processing in ${name}`, "item": canonicalUrl }
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title={`Payment Processing in ${name} | Zero-Fee Merchant Services | EzPay America`}
        description={`EzPay America offers zero-fee credit card processing for businesses in ${name}. Free POS equipment, no monthly fees, no contracts, next-day deposits. Apply online today.`}
        keywords={`payment processing ${name}, merchant services ${name}, credit card processing ${abbr}, zero fee payment processing ${name}, best payment processor ${name}, POS system ${name}, merchant account ${name}, small business payment processing ${name}, ${name} payment solutions, EzPay America ${name}`}
        url={canonicalUrl}
        pageSchema={pageSchema}
      />
      <LandingHero
        badge={`Merchant Services — ${name}`}
        headline={`Payment Processing in ${name}`}
        subheadline={`EzPay America serves businesses across ${name} with zero transaction fees, free POS equipment, and no long-term contracts. Join thousands of ${abbr} merchants saving every month.`}
        bullets={[
          `Zero processing fees for ${name} businesses`,
          "Free terminal or POS system included",
          "Approval in 24–48 hours",
          "Next-day deposits to your bank",
        ]}
        service={`payment processing in ${name}`}
      />
      <LandingFeatures
        title={`Everything ${name} Businesses Need`}
        subtitle={`Serving merchants across ${name} with transparent pricing and no hidden fees`}
        features={FEATURES}
      />
      <LandingCTA
        headline={`Ready to Cut Payment Fees in ${name}?`}
        subtext={`Join hundreds of businesses in ${name} saving thousands every year with EzPay America's zero-fee payment processing. Get approved in as little as 24 hours.`}
        service={`payment processing in ${name}`}
      />
    </>
  );
}