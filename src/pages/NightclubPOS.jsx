import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Zap, CreditCard, Users, Shield, BarChart2, Ticket } from "lucide-react";

const features = [
  {
    icon: Zap,
    color: "from-pink-500 to-pink-600",
    title: "High-Speed Bar Operations",
    description: "Speed bar mode lets bartenders ring up drinks in one tap — no navigating menus during a rush. Move hundreds of transactions per hour."
  },
  {
    icon: Users,
    color: "from-purple-500 to-purple-600",
    title: "VIP Table & Bottle Service Management",
    description: "Assign bottle service packages to tables, track minimum spends, and manage VIP reservations — all from a single screen."
  },
  {
    icon: Ticket,
    color: "from-blue-500 to-blue-600",
    title: "Event Ticketing & Cover Charge",
    description: "Sell tickets in advance or collect cover charges at the door — integrated with your POS so everything settles into one report."
  },
  {
    icon: CreditCard,
    color: "from-amber-500 to-amber-600",
    title: "Tab Management & Card-on-File",
    description: "Open a tab with a card swipe and close at end of night — reduce walkouts and increase average spend per guest automatically."
  },
  {
    icon: Shield,
    color: "from-green-500 to-green-600",
    title: "Age Verification Integration",
    description: "ID scanner integration at the door syncs with your POS — track entry counts and keep your establishment compliant with local regulations."
  },
  {
    icon: BarChart2,
    color: "from-red-500 to-red-600",
    title: "Event Night Revenue Reports",
    description: "Break down revenue by bar, door, and bottle service — know which events are profitable, which DJs drive spend, and where to reinvest."
  }
];

export default function NightclubPOS() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Nightclub POS & Bar Payment Processing"
        description="EzPay America's nightclub POS — high-speed bar mode, VIP bottle service, event ticketing, tab management, and zero transaction fees. Built for nightclubs and entertainment venues."
        keywords="nightclub POS system, nightclub payment processing, bar POS nightclub, bottle service management POS, nightclub merchant account, club credit card processing, nightclub event ticketing POS, zero fee nightclub processing, entertainment venue POS, EzPay nightclub POS"
        url="https://ezpayamerica.com/NightclubPOS"
      />
      <LandingHero
        headline="Nightclub & Entertainment Venue POS"
        subheadline="When the music drops and the crowd surges — EzPay America keeps your bar operations running at full speed with zero transaction fees and enterprise-grade reliability."
        bullets={[
          "Speed bar mode — ring up drinks in one tap",
          "VIP bottle service & minimum spend management",
          "Event ticketing and door cover charges integrated",
          "Zero transaction fees on every drink and every ticket"
        ]}
        service="Nightclub POS"
      />
      <LandingFeatures
        title="Built for High-Volume Nightlife Operations"
        subtitle="Hundreds of transactions per hour, VIP rooms, events, and door management — EzPay handles it all without slowing down."
        features={features}
      />
      <LandingCTA
        headline="Turn Up Revenue. Turn Down Processing Fees."
        subtext="EzPay America gives nightclubs and entertainment venues a complete payment solution with zero transaction fees and 24/7 support."
        service="Nightclub POS"
      />
    </div>
  );
}