import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Beer, Package, CreditCard, Users, BarChart2, ShoppingBag } from "lucide-react";

const features = [
  {
    icon: Beer,
    color: "from-amber-500 to-amber-600",
    title: "Tap List & Draft Management",
    description: "Manage your rotating tap list, track kegs by pour count, and update your digital menu in real time as beers kick."
  },
  {
    icon: Package,
    color: "from-orange-500 to-orange-600",
    title: "Retail & To-Go Sales",
    description: "Sell cans, crowlers, growlers, and merch from the same system as your taproom — inventory updates automatically across all sales."
  },
  {
    icon: Users,
    color: "from-green-500 to-green-600",
    title: "Taproom Tab Management",
    description: "Open tabs, run bar-style service, and close out with a card on file — smooth taproom operations from the first pint to last call."
  },
  {
    icon: ShoppingBag,
    color: "from-blue-500 to-blue-600",
    title: "Mug Club & Membership Billing",
    description: "Manage mug club memberships, beer subscriptions, and bottle club billing with automated recurring charges and member perks."
  },
  {
    icon: CreditCard,
    color: "from-red-500 to-red-600",
    title: "Zero Transaction Fees",
    description: "EzPay's cash-discount program eliminates processing fees on every taproom pint, retail sale, and event ticket — zero cost to you."
  },
  {
    icon: BarChart2,
    color: "from-purple-500 to-purple-600",
    title: "Beer Performance Analytics",
    description: "See which beers sell fastest, when your taproom peaks, and which events drive the most revenue — data to grow your brewery smarter."
  }
];

export default function BreweryPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Brewery & Taproom POS System"
        description="EzPay America's brewery POS — tap list management, keg tracking, mug club billing, retail sales, and zero transaction fees. Built for craft breweries and taprooms."
        keywords="brewery POS system, taproom point of sale, craft brewery payment processing, brewery merchant account, taproom credit card processing, keg tracking POS, mug club billing, brewery zero fee processing, growler sale POS, EzPay brewery taproom POS"
        url="https://ezpayamerica.com/BreweryPOS"
      />
      <LandingHero
        headline="Brewery & Taproom POS"
        subheadline="From the taproom to the retail shelf — EzPay America gives craft breweries a complete POS system with keg tracking, mug club billing, and zero transaction fees."
        bullets={[
          "Tap list & keg tracking updated in real time",
          "Sell cans, growlers, crowlers & merch from one system",
          "Mug club & membership recurring billing built in",
          "Zero transaction fees — more margin on every pint"
        ]}
        service="Brewery POS"
      />
      <LandingFeatures
        title="Built for Craft. Built for Scale."
        subtitle="Whether you're a nano-brewery or a regional taproom chain — EzPay has the tools to keep your operation running smoothly."
        features={features}
      />
      <LandingCTA
        headline="Raise Your Margins. Lower Your Fees."
        subtext="EzPay America gives breweries and taprooms a complete payment solution with zero transaction fees and free terminal equipment."
        service="Brewery POS"
      />
    </div>
  );
}