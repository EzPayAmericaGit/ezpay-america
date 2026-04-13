import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { ShoppingBag, Users, CreditCard, Globe, BarChart2, Repeat } from "lucide-react";

const features = [
  {
    icon: Users,
    color: "from-purple-500 to-purple-600",
    title: "Tasting Room Experience Management",
    description: "Manage seated tastings, walk-in flights, and group reservations from one dashboard — keep the tasting room flowing without friction."
  },
  {
    icon: Repeat,
    color: "from-red-500 to-red-600",
    title: "Wine Club Membership & Billing",
    description: "Automate wine club shipments, quarterly billing, and member perks — EzPay handles recurring charges and member communication seamlessly."
  },
  {
    icon: ShoppingBag,
    color: "from-amber-500 to-amber-600",
    title: "Retail Bottle & Case Sales",
    description: "Sell by the glass, bottle, or case — in the tasting room, at events, or online — with inventory that syncs across all channels automatically."
  },
  {
    icon: Globe,
    color: "from-blue-500 to-blue-600",
    title: "Direct-to-Consumer Online Store",
    description: "Sell wine online with a branded store and compliant age verification — ship directly to consumers in eligible states and grow beyond your tasting room."
  },
  {
    icon: CreditCard,
    color: "from-green-500 to-green-600",
    title: "Zero Transaction Fees",
    description: "EzPay's cash-discount program eliminates processing fees on every bottle, tasting, and club shipment — improving margins at every touchpoint."
  },
  {
    icon: BarChart2,
    color: "from-slate-500 to-slate-600",
    title: "Vintage & SKU Performance Reports",
    description: "Know which varietals sell best in your tasting room vs. online, and use data to guide your production, pricing, and inventory decisions."
  }
];

export default function WineryPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Winery POS & Tasting Room Payment Processing"
        description="EzPay America's winery POS — tasting room management, wine club billing, retail bottle sales, online store, and zero transaction fees. Built for wineries and vineyards."
        keywords="winery POS system, tasting room point of sale, winery payment processing, wine club billing software, vineyard merchant account, winery credit card processing, wine club membership POS, direct to consumer winery, zero fee winery processing, EzPay winery POS"
        url="https://ezpayamerica.com/WineryPOS"
      />
      <LandingHero
        headline="Winery & Tasting Room POS"
        subheadline="From the first pour to the wine club shipment — EzPay America gives wineries and vineyards a complete payment platform with zero transaction fees and expert support."
        bullets={[
          "Tasting room management & group reservation handling",
          "Automated wine club billing & member management",
          "Online bottle sales with age-compliant checkout",
          "Zero transaction fees on every glass and every shipment"
        ]}
        service="Winery POS"
      />
      <LandingFeatures
        title="Complete Commerce for Your Vineyard"
        subtitle="Tasting room, wine club, retail, and online — EzPay brings it all together in one seamless platform."
        features={features}
      />
      <LandingCTA
        headline="More Revenue. Better Margins. Happier Members."
        subtext="EzPay America gives wineries and tasting rooms a complete payment solution with zero fees, free equipment, and dedicated support."
        service="Winery POS"
      />
    </div>
  );
}