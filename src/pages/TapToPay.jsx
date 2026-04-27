import React from "react";
import SEOHead from "../components/SEOHead";
import { ServiceSchema } from "../components/seo/SchemaOrg";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import ServiceSEOContent from "../components/landing/ServiceSEOContent";
import { Smartphone, Zap, ShieldCheck, DollarSign, Wifi, Users } from "lucide-react";

const features = [
  { icon: Smartphone, title: "Accept Tap-to-Pay on iPhone & Android", description: "Turn your smartphone into a payment terminal with Tap to Pay on iPhone and Android. No extra hardware needed — just your phone and the EzPay app.", color: "from-blue-500 to-cyan-600" },
  { icon: Zap, title: "Instant Contactless Payments", description: "Customers tap their card, Apple Pay, Google Pay, or Samsung Pay for payment in under 2 seconds. Faster checkouts mean more throughput and happier customers.", color: "from-amber-500 to-orange-600" },
  { icon: ShieldCheck, title: "NFC Encrypted & PCI Compliant", description: "All tap-to-pay transactions use NFC encryption — the same technology banks use. Every transaction is PCI DSS compliant and fraud-protected.", color: "from-green-500 to-emerald-600" },
  { icon: DollarSign, title: "Zero Transaction Fees", description: "EzPay America's cash discount program works with tap-to-pay. Process contactless payments with zero fees using our standard zero-fee program.", color: "from-purple-500 to-violet-600" },
  { icon: Wifi, title: "Works Anywhere You Have Signal", description: "Wi-Fi or cellular — accept payments anywhere. Perfect for food trucks, market vendors, tradeshows, pop-up shops, and on-site service businesses.", color: "from-teal-500 to-cyan-600" },
  { icon: Users, title: "Multiple Staff, One Account", description: "Add staff members to your EzPay account so your whole team can accept payments from their own devices. Centralized reporting for the whole team.", color: "from-red-500 to-rose-600" },
];

const faqs = [
  { q: "Do I need to buy a card reader?", a: "For Tap to Pay on iPhone or Android, no card reader is required — your phone is the terminal. For merchants who prefer a physical reader, EzPay America provides free tap-capable countertop and mobile terminals." },
  { q: "Which cards and wallets does tap-to-pay accept?", a: "Tap-to-pay accepts all major contactless credit and debit cards (Visa, Mastercard, Discover, Amex), Apple Pay, Google Pay, and Samsung Pay." },
  { q: "Is it as secure as a chip card?", a: "Yes — and in some ways more secure. Contactless NFC payments generate a unique one-time token for each transaction, making card data interception essentially impossible." },
  { q: "Can I use tap-to-pay with zero-fee processing?", a: "Yes. EzPay America's cash discount / zero-fee processing program works with all payment methods including contactless tap-to-pay, chip, swipe, and manual entry." },
  { q: "What if a customer's card doesn't support tap-to-pay?", a: "No problem. Your EzPay terminal also accepts chip (EMV) and swipe as fallback options. No customer is left unable to pay." },
];

export default function TapToPay() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Tap to Pay Contactless Payments for Merchants | EzPay America"
        description="Accept tap-to-pay, Apple Pay, Google Pay, and contactless cards with EzPay America. Use your iPhone or Android as a terminal, no extra hardware needed. Zero fees with our cash discount program."
        keywords="tap to pay merchant, contactless payments, Apple Pay merchant, Google Pay merchant, NFC payments, tap to pay iPhone, tap to pay Android, contactless card reader, mobile payment processing, zero fee contactless payments, EzPay tap to pay"
        url="https://ezpayamerica.com/TapToPay"
      />
      <ServiceSchema
        name="Tap to Pay Contactless Payment Processing"
        description="EzPay America enables merchants to accept tap-to-pay, Apple Pay, Google Pay, and contactless cards using their smartphone or free terminal."
        url="https://ezpayamerica.com/TapToPay"
        serviceType="Contactless Payment Processing"
        offers={[
          { name: "Tap to Pay on iPhone", description: "Accept NFC payments directly on iPhone — no hardware required" },
          { name: "Tap to Pay on Android", description: "Accept contactless payments using Android device" },
          { name: "Apple Pay & Google Pay Acceptance", description: "Accept all major digital wallets" },
          { name: "Contactless Card Terminal", description: "Free NFC-enabled countertop terminal for businesses" },
        ]}
      />
      <LandingHero
        badge="Tap-to-Pay & Contactless Payments"
        headline="Accept Any Payment, Anywhere — With Just Your Phone"
        subheadline="EzPay America turns your iPhone or Android into a full payment terminal. Accept tap-to-pay cards, Apple Pay, Google Pay, and all major digital wallets. Zero fees with our cash discount program."
        bullets={[
          "Tap to Pay on iPhone & Android — no card reader needed",
          "Accept Apple Pay, Google Pay, Samsung Pay",
          "2-second contactless checkout",
          "NFC encrypted & PCI compliant",
          "Zero transaction fees with our cash discount program",
        ]}
        service="Tap to Pay Contactless Payments"
      />
      <LandingFeatures
        title="Modern Payments for Modern Businesses"
        subtitle="Fast, secure, and accepted by every customer with a card or phone"
        features={features}
      />
      <ServiceSEOContent
        heading="Why Contactless Payments Matter for Your Business"
        intro="More than 75% of US consumers now prefer contactless payment options. Accepting tap-to-pay isn't just convenient — it's expected. Businesses that don't offer contactless checkout risk losing customers to competitors who do. EzPay America makes contactless acceptance simple, free, and immediately available."
        sections={[
          {
            h2: "Tap to Pay on iPhone: How It Works",
            body: "With Tap to Pay on iPhone, your iPhone becomes a payment terminal. Download the EzPay America app, enable Tap to Pay in settings, and hold the customer's card or phone near yours to collect payment instantly. No card reader, no dongle, no extra hardware.",
            bullets: [
              "Requires iPhone XS or later running iOS 16+",
              "Works with all NFC-enabled cards and digital wallets",
              "Payments appear in your EzPay dashboard in real time",
              "No separate hardware or monthly rental fees",
            ],
          },
          {
            h2: "For High-Volume Locations: Free NFC-Enabled Terminals",
            body: "For brick-and-mortar businesses, restaurants, and retailers, EzPay America provides free countertop terminals with built-in NFC chip readers. Customers can tap, chip, or swipe — whichever they prefer. The terminal integrates with your EzPay reporting and zero-fee program automatically.",
          },
          {
            h2: "Contactless Payments With Zero Transaction Fees",
            body: "EzPay America's cash discount program works seamlessly with tap-to-pay. Customers who pay by card (tap, chip, or swipe) contribute a small service fee, and you keep 100% of your sale. Apply today to get started.",
          },
        ]}
        faqs={faqs}
        relatedLinks={[
          { label: "Cash Discount Program", to: "/CashDiscountProgram" },
          { label: "Mobile Payments", to: "/MobilePayments" },
          { label: "Apply Online", to: "/ApplyOnline" },
          { label: "Services Overview", to: "/Services" },
          { label: "Book a Free Consultation", to: "/BookAppointment" },
        ]}
      />
      <LandingCTA
        headline="Start Accepting Tap-to-Pay Today — No Hardware Needed"
        subtext="Turn your phone into a payment terminal. Free equipment for high-volume locations. Zero fees with our cash discount program. Apply in minutes."
        service="Tap to Pay Contactless Payments"
      />
    </div>
  );
}