import React from "react";
import SEOHead from "../components/SEOHead";
import { ServiceSchema } from "../components/seo/SchemaOrg";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import ServiceSEOContent from "../components/landing/ServiceSEOContent";
import { Gift, TrendingUp, Repeat, Smartphone, ShieldCheck, BarChart3 } from "lucide-react";

const features = [
  { icon: Gift, title: "Branded Physical & Digital Cards", description: "Custom-branded gift cards with your logo and colors. Available as plastic cards, eGift cards, and mobile wallet-compatible digital cards.", color: "from-pink-500 to-rose-600" },
  { icon: TrendingUp, title: "Increase Average Sale Size", description: "Gift card holders spend an average of 20–40% more than the card value. They're one of the most powerful tools for boosting revenue.", color: "from-green-500 to-emerald-600" },
  { icon: Repeat, title: "Bring Customers Back", description: "Gift cards create return visits. When customers redeem cards — and their friends receive them — you build a loyal, growing customer base.", color: "from-blue-500 to-cyan-600" },
  { icon: Smartphone, title: "Sell Online & In-Store", description: "Sell gift cards at your register, on your website, or via a shareable link. Redeem them anywhere you accept EzPay America payments.", color: "from-amber-500 to-orange-600" },
  { icon: ShieldCheck, title: "Fraud Protection Built In", description: "Every card is encrypted and tracked in real time. Balance checks, usage history, and automatic expiration management included.", color: "from-purple-500 to-violet-600" },
  { icon: BarChart3, title: "Real-Time Balance Tracking", description: "Your dashboard shows every card issued, balance remaining, and redemption history. Full visibility into your gift card program performance.", color: "from-teal-500 to-cyan-600" },
];

const faqs = [
  { q: "Can I customize the gift cards with my logo?", a: "Yes. EzPay America provides fully branded physical and digital gift cards with your business name, logo, and colors." },
  { q: "How do customers check their gift card balance?", a: "Customers can check balances at your register, via a balance check link you provide, or by calling our support line. Balance is always accurate in real time." },
  { q: "Can I sell gift cards online?", a: "Yes. You'll receive a shareable purchase link and an embeddable widget for your website so customers can buy digital gift cards 24/7." },
  { q: "Do gift cards work with my EzPay POS?", a: "Yes. Gift card redemption is fully integrated with your EzPay America terminal and POS system. No separate card reader or device needed." },
  { q: "Is there a fee to set up the program?", a: "EzPay America offers gift card programs with no setup fees for qualifying merchants. Contact us for program details and card printing costs." },
];

export default function GiftCardProgram() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Gift Card Program for Small Businesses | EzPay America"
        description="Launch a branded gift card program with EzPay America. Physical and digital gift cards, zero setup fees, online and in-store sales, real-time balance tracking. Boost revenue and repeat visits."
        keywords="gift card program for small business, merchant gift cards, branded gift cards, digital gift cards, eGift cards, gift card processing, sell gift cards online, gift card POS integration, restaurant gift cards, retail gift cards, EzPay gift cards"
        url="https://ezpayamerica.com/GiftCardProgram"
      />
      <ServiceSchema
        name="Gift Card Program for Merchants"
        description="EzPay America's gift card program lets merchants sell branded physical and digital gift cards in-store and online. Boost revenue and customer retention."
        url="https://ezpayamerica.com/GiftCardProgram"
        serviceType="Gift Card Program"
        offers={[
          { name: "Branded Physical Gift Cards", description: "Custom printed plastic gift cards with merchant branding" },
          { name: "Digital eGift Cards", description: "Mobile wallet-compatible digital gift cards sold online" },
          { name: "Gift Card POS Integration", description: "Seamless redemption at your EzPay terminal or POS" },
          { name: "Real-Time Balance Tracking", description: "Dashboard with full gift card program analytics" },
        ]}
      />
      <LandingHero
        badge="Gift Card Program"
        headline="Give Customers the Gift of Coming Back"
        subheadline="Launch a fully branded gift card program — physical cards, digital eGift cards, and online sales — all integrated with your EzPay America account. No setup fees."
        bullets={[
          "Branded physical & digital gift cards",
          "Sell in-store, online, or via shareable link",
          "Customers spend 20–40% more than card value",
          "Real-time balance tracking dashboard",
          "Fully integrated with your EzPay POS or terminal",
        ]}
        service="Gift Card Program"
      />
      <LandingFeatures
        title="Everything You Need to Run a Gift Card Program"
        subtitle="Increase revenue, boost repeat business, and build brand loyalty"
        features={features}
      />
      <ServiceSEOContent
        heading="Gift Card Programs That Drive Real Revenue"
        intro="Gift cards are one of the most profitable tools a small business can offer. On average, 10–19% of gift card value goes unredeemed (breakage), customers spend more than the card's face value, and recipients often become new regular customers. EzPay America makes it simple to launch and manage a complete gift card program."
        sections={[
          {
            h2: "Physical vs. Digital Gift Cards: Which Is Right for You?",
            body: "Many merchants offer both. Physical cards work great for in-store gifting, impulse purchases at the register, and seasonal promotions. Digital eGift cards are perfect for online shoppers, last-minute gifting, and businesses with an online presence.",
            bullets: [
              "Physical cards: ideal for retail stores, restaurants, and salons",
              "Digital cards: perfect for e-commerce, online booking, and remote customers",
              "Many EzPay merchants use both to maximize reach",
              "Both types integrate with your existing EzPay terminal",
            ],
          },
          {
            h2: "How Gift Cards Fit Into Your Payment Processing",
            body: "EzPay America gift cards are processed through the same system as your regular card payments. Your staff uses the same terminal to issue and redeem cards. There's no separate login, no separate device, and no extra complexity.",
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { label: "Apply Online", to: "/ApplyOnline" },
          { label: "Loyalty Program", to: "/LoyaltyProgram" },
          { label: "Services Overview", to: "/Services" },
          { label: "Book a Consultation", to: "/BookAppointment" },
        ]}
      />
      <LandingCTA
        headline="Start Selling Gift Cards Today"
        subtext="No setup fees. Branded to your business. Integrated with your existing EzPay terminal. Apply in minutes."
        service="Gift Card Program"
      />
    </div>
  );
}