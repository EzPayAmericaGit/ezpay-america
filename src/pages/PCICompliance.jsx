import React from "react";
import SEOHead from "../components/SEOHead";
import LandingHero from "../components/landing/LandingHero";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCTA from "../components/landing/LandingCTA";
import { Shield, CheckCircle2, Lock, FileText, Zap, Eye, RefreshCw, BarChart3, HeadphonesIcon } from "lucide-react";

const features = [
  { icon: Shield, title: "PCI DSS Level 1 Certified", description: "EzPay America maintains the highest level of PCI DSS certification — audited annually by a QSA.", color: "from-green-600 to-green-800" },
  { icon: CheckCircle2, title: "Guided SAQ Completion", description: "We walk you through your Self-Assessment Questionnaire — most merchants qualify for SAQ A.", color: "from-amber-500 to-orange-600" },
  { icon: Lock, title: "Automatic Scope Reduction", description: "Our hosted payment tools keep card data off your servers — dramatically reducing your PCI scope.", color: "from-blue-500 to-blue-600" },
  { icon: FileText, title: "Compliance Documentation", description: "Access your compliance reports, attestations, and certificates from your merchant dashboard.", color: "from-purple-500 to-purple-600" },
  { icon: Zap, title: "Continuous Monitoring", description: "Automated security scans and vulnerability assessments run continuously on your account.", color: "from-teal-500 to-teal-600" },
  { icon: Eye, title: "Breach Notification Support", description: "In the event of a breach, our team guides you through notification requirements and remediation.", color: "from-red-500 to-red-600" },
  { icon: RefreshCw, title: "Annual Recertification", description: "Automated reminders and tools make annual PCI recertification simple and stress-free.", color: "from-yellow-500 to-amber-600" },
  { icon: BarChart3, title: "Security Scorecard", description: "Real-time security scorecard shows your compliance posture and recommended improvements.", color: "from-pink-500 to-pink-600" },
  { icon: HeadphonesIcon, title: "Dedicated Compliance Support", description: "Our PCI compliance specialists are available to answer every question and guide every step.", color: "from-indigo-500 to-indigo-600" },
];

export default function PCICompliance() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="PCI Compliance Tools for Merchants | EzPay America"
        description="PCI DSS Level 1 certified payment processing. Guided SAQ, scope reduction, continuous monitoring, and compliance documentation. Stay compliant easily. Apply free."
        keywords="PCI compliance, PCI DSS compliance, PCI compliant payment processing, merchant PCI compliance, SAQ PCI, PCI certification, payment security compliance, PCI scope reduction, PCI DSS tools, credit card compliance"
        url="https://ezpayamerica.com/PCICompliance"
      />
      <LandingHero
        badge="PCI Compliance Tools"
        headline="Stay PCI Compliant Without the Headache"
        subheadline="EzPay America is PCI DSS Level 1 certified. We guide you through compliance, reduce your scope, and handle the heavy lifting so you can focus on your business."
        bullets={[
          "PCI DSS Level 1 certified processor",
          "Guided SAQ completion — most qualify for SAQ A",
          "Automatic scope reduction with hosted tools",
          "Continuous security monitoring",
          "Annual recertification made simple"
        ]}
        service="PCI Compliance"
      />
      <LandingFeatures title="PCI Compliance Made Simple for Merchants" subtitle="Level 1 certification, guided tools, and expert support — compliance has never been easier." features={features} />
      <LandingCTA headline="Get PCI Compliant With EzPay America" subtext="Level 1 certified, guided SAQ, continuous monitoring. Start your compliance journey today." service="PCI Compliance" />
    </div>
  );
}