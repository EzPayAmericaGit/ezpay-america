import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, ExternalLink, Copy, Users, Share2, BarChart2, DollarSign, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const getSteps = (affiliate, referrals, referralLink) => [
  {
    id: "account_approved",
    icon: CheckCircle2,
    title: "Get Your Account Approved",
    description: "Your affiliate application has been submitted. Approval typically takes 24–48 hours.",
    done: affiliate.status === "approved",
    actionLabel: null,
    tip: "Check your email for the approval notification.",
  },
  {
    id: "copy_link",
    icon: Copy,
    title: "Copy Your Referral Link",
    description: "Share this unique link with businesses you want to refer. It tracks all referrals to your account.",
    done: affiliate.status === "approved",
    actionLabel: "Copy My Link",
    actionFn: () => { navigator.clipboard.writeText(referralLink); },
    tip: `Your link: ${referralLink}`,
  },
  {
    id: "first_referral",
    icon: Users,
    title: "Submit Your First Referral",
    description: "Use the referral portal to submit a business contact directly — no link needed.",
    done: referrals.length > 0,
    actionLabel: "Submit a Referral",
    actionLink: `${createPageUrl("AffiliateReferralPortal")}?code=${affiliate.referralCode}`,
    tip: "Have the business owner's name, email, and phone ready.",
  },
  {
    id: "share_social",
    icon: Share2,
    title: "Share on Social Media",
    description: "Post about EzPay America on LinkedIn, Facebook, or Instagram with your referral link to reach more businesses.",
    done: false, // manual check - we don't track social shares
    actionLabel: "Share on LinkedIn",
    actionLink: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
    actionExternal: true,
    tip: "Try: 'Tired of paying 2-4% in card fees? EzPay America offers zero-fee processing with free equipment. Apply here: [your link]'",
  },
  {
    id: "embed_widget",
    icon: ExternalLink,
    title: "Embed the Referral Widget",
    description: "Add a referral button or form to your website to passively capture leads.",
    done: false,
    actionLabel: "Get Embed Code",
    actionTabSwitch: "embed",
    tip: "A floating button on your site can convert visitors into referrals 24/7.",
  },
  {
    id: "first_conversion",
    icon: DollarSign,
    title: "Earn Your First Commission",
    description: "Once a referred business signs up and processes their first transaction, you'll earn a commission.",
    done: referrals.some(r => r.status === "converted"),
    actionLabel: null,
    tip: `Your current commission rate: ${affiliate.commissionRate || 10}%. Grow your tier for higher rates!`,
  },
  {
    id: "review_analytics",
    icon: BarChart2,
    title: "Review Your Analytics",
    description: "Check your referral funnel, conversion rate, and commission pipeline in the Analytics tab.",
    done: false,
    actionLabel: "View Analytics",
    actionTabSwitch: "analytics",
    tip: "Use the analytics to find which referral sources convert best.",
  },
  {
    id: "learn_tiers",
    icon: BookOpen,
    title: "Learn About Tier Benefits",
    description: "Reach 5 conversions for Silver (12%), 10 for Gold (15%), 20 for Platinum (20%) tier.",
    done: affiliate.tier !== "bronze",
    actionLabel: "View Leaderboard",
    actionLink: createPageUrl("AffiliateLeaderboard"),
    tip: `You're currently ${affiliate.tier} tier with ${affiliate.totalConversions || 0} conversions.`,
  },
];

export default function OnboardingChecklist({ affiliate, referrals, referralLink, onTabSwitch }) {
  const [expanded, setExpanded] = useState(null);
  const [manualDone, setManualDone] = useState({});
  const [linkCopied, setLinkCopied] = useState(false);

  const steps = getSteps(affiliate, referrals, referralLink);
  const doneCount = steps.filter(s => s.done || manualDone[s.id]).length;
  const progress = Math.round((doneCount / steps.length) * 100);

  const handleAction = (step) => {
    if (step.actionFn) {
      step.actionFn();
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      setManualDone(p => ({ ...p, [step.id]: true }));
    }
    if (step.actionTabSwitch) {
      onTabSwitch(step.actionTabSwitch);
      setManualDone(p => ({ ...p, [step.id]: true }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="border-none shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Welcome, {affiliate.firstName}! 👋</h2>
                <p className="text-gray-400 text-sm mt-1">Complete these steps to maximize your earnings</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-amber-400">{doneCount}/{steps.length}</p>
                <p className="text-xs text-gray-400">steps completed</p>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">{progress}% complete</p>
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isDone = step.done || manualDone[step.id];
          const isExpanded = expanded === step.id;
          return (
            <Card key={step.id}
              className={`border-2 shadow transition-all cursor-pointer ${isDone ? "border-green-200 bg-green-50/50" : "border-gray-200 bg-white hover:border-amber-200"}`}
              onClick={() => setExpanded(isExpanded ? null : step.id)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isDone ? "bg-green-500" : "bg-gray-100"}`}>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-semibold text-sm ${isDone ? "text-green-800 line-through" : "text-gray-900"}`}>{step.title}</p>
                      {isDone && <Badge className="bg-green-100 text-green-700 text-xs">Done</Badge>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>

                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                          💡 {step.tip}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {step.actionLabel && !step.actionLink && !step.actionTabSwitch && (
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleAction(step); }}
                              className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-8">
                              {step.id === "copy_link" && linkCopied ? "✓ Copied!" : step.actionLabel}
                            </Button>
                          )}
                          {step.actionLabel && step.actionLink && !step.actionExternal && (
                            <Link to={step.actionLink} onClick={e => e.stopPropagation()}>
                              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-8">{step.actionLabel}</Button>
                            </Link>
                          )}
                          {step.actionLabel && step.actionLink && step.actionExternal && (
                            <a href={step.actionLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-8 gap-1">{step.actionLabel} <ExternalLink className="w-3 h-3" /></Button>
                            </a>
                          )}
                          {step.actionLabel && step.actionTabSwitch && (
                            <Button size="sm" onClick={(e) => { e.stopPropagation(); handleAction(step); }}
                              className="bg-amber-500 hover:bg-amber-600 text-white text-xs h-8">{step.actionLabel}</Button>
                          )}
                          {!isDone && (
                            <Button size="sm" variant="outline" className="text-xs h-8"
                              onClick={(e) => { e.stopPropagation(); setManualDone(p => ({ ...p, [step.id]: true })); setExpanded(null); }}>
                              Mark as Done
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-gray-400 text-xs flex-shrink-0">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {doneCount === steps.length && (
        <Card className="border-2 border-amber-300 bg-amber-50 shadow-lg">
          <CardContent className="py-8 text-center">
            <p className="text-4xl mb-3">🏆</p>
            <h3 className="text-xl font-bold text-amber-900">You're all set!</h3>
            <p className="text-amber-700 text-sm mt-2">You've completed all onboarding steps. Keep referring businesses to climb the leaderboard!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}