import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Target, TrendingUp, Star, Zap, Gift, Plus, CheckCircle2 } from "lucide-react";

// Static milestone definitions (could be made DB-driven later)
const DEFAULT_MILESTONES = [
  { id: 1, title: "First Referral", description: "Submit your first referral lead", target: 1, metric: "totalReferrals", icon: "🎯", reward: "Bronze tier unlocked", color: "amber" },
  { id: 2, title: "5 Referrals", description: "Reach 5 total referrals", target: 5, metric: "totalReferrals", icon: "🚀", reward: "Silver tier eligible", color: "gray" },
  { id: 3, title: "First Conversion", description: "Get your first merchant approved", target: 1, metric: "totalConversions", icon: "✅", reward: "+$50 bonus", color: "green" },
  { id: 4, title: "5 Conversions", description: "Convert 5 merchants", target: 5, metric: "totalConversions", icon: "🥈", reward: "Silver tier + 12% rate", color: "gray" },
  { id: 5, title: "10 Conversions", description: "Convert 10 merchants", target: 10, metric: "totalConversions", icon: "🥇", reward: "Gold tier + 15% rate", color: "yellow" },
  { id: 6, title: "20 Conversions", description: "Convert 20 merchants", target: 20, metric: "totalConversions", icon: "💎", reward: "Platinum tier + 20% rate", color: "purple" },
  { id: 7, title: "$500 Earned", description: "Earn $500 in total commissions", target: 500, metric: "totalEarned", icon: "💰", reward: "VIP partner status", color: "green" },
  { id: 8, title: "$1,000 Earned", description: "Earn $1,000 in total commissions", target: 1000, metric: "totalEarned", icon: "🏆", reward: "Elite partner bonus", color: "amber" },
  { id: 9, title: "100 Clicks", description: "Generate 100 referral link clicks", target: 100, metric: "totalClicks", icon: "👆", reward: "Marketing kit upgrade", color: "blue" },
  { id: 10, title: "500 Clicks", description: "Generate 500 referral link clicks", target: 500, metric: "totalClicks", icon: "🔥", reward: "Featured affiliate spotlight", color: "red" },
];

const COLOR_MAP = {
  amber: "from-amber-50 to-amber-100 border-amber-200",
  gray: "from-gray-50 to-gray-100 border-gray-200",
  green: "from-green-50 to-green-100 border-green-200",
  yellow: "from-yellow-50 to-yellow-100 border-yellow-200",
  purple: "from-purple-50 to-purple-100 border-purple-200",
  blue: "from-blue-50 to-blue-100 border-blue-200",
  red: "from-red-50 to-red-100 border-red-200",
};

function MilestoneCard({ milestone, affiliate }) {
  const value = affiliate?.[milestone.metric] || 0;
  const progress = Math.min((value / milestone.target) * 100, 100);
  const completed = progress >= 100;

  return (
    <div className={`relative rounded-xl border bg-gradient-to-br p-4 ${COLOR_MAP[milestone.color] || COLOR_MAP.gray} ${completed ? "opacity-100" : "opacity-80"}`}>
      {completed && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
      )}
      <div className="text-2xl mb-2">{milestone.icon}</div>
      <h4 className="font-semibold text-gray-900 text-sm">{milestone.title}</h4>
      <p className="text-xs text-gray-500 mt-0.5 mb-3">{milestone.description}</p>
      
      {/* Progress bar */}
      <div className="w-full bg-white/70 rounded-full h-1.5 mb-2">
        <div
          className={`h-1.5 rounded-full transition-all ${completed ? "bg-green-500" : "bg-amber-500"}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">
          {milestone.metric === "totalEarned"
            ? `$${value.toFixed(0)} / $${milestone.target}`
            : `${value} / ${milestone.target}`}
        </span>
        <span className={`font-medium ${completed ? "text-green-600" : "text-gray-400"}`}>
          {completed ? "Completed!" : `${Math.round(progress)}%`}
        </span>
      </div>
      <div className="mt-2 pt-2 border-t border-white/50">
        <p className="text-xs text-gray-600 flex items-center gap-1">
          <Gift className="w-3 h-3 text-amber-500" />
          {milestone.reward}
        </p>
      </div>
    </div>
  );
}

function AffiliateProgressRow({ affiliate }) {
  const completed = DEFAULT_MILESTONES.filter(m => (affiliate[m.metric] || 0) >= m.target).length;
  const pct = Math.round((completed / DEFAULT_MILESTONES.length) * 100);

  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border hover:shadow-sm transition-all">
      <div>
        <p className="font-medium text-gray-900 text-sm">{affiliate.firstName} {affiliate.lastName}</p>
        <p className="text-xs text-gray-400">{affiliate.email}</p>
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{completed} / {DEFAULT_MILESTONES.length} milestones</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="text-xs text-right shrink-0">
        <p className="font-semibold text-emerald-600">${(affiliate.totalEarned || 0).toFixed(0)}</p>
        <p className="text-gray-400">{affiliate.totalConversions || 0} conv.</p>
      </div>
    </div>
  );
}

export default function AffiliateMilestones({ affiliates }) {
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [search, setSearch] = useState("");

  const approvedAffiliates = useMemo(() =>
    affiliates.filter(a => a.status === "approved")
      .sort((a, b) => (b.totalConversions || 0) - (a.totalConversions || 0)),
    [affiliates]
  );

  const filteredAffiliates = useMemo(() =>
    approvedAffiliates.filter(a =>
      !search || `${a.firstName} ${a.lastName} ${a.email}`.toLowerCase().includes(search.toLowerCase())
    ), [approvedAffiliates, search]);

  const overallStats = useMemo(() => {
    const total = approvedAffiliates.length;
    const allCompleted = DEFAULT_MILESTONES.map(m => ({
      ...m,
      completedBy: approvedAffiliates.filter(a => (a[m.metric] || 0) >= m.target).length,
    }));
    return { total, allCompleted };
  }, [approvedAffiliates]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border-none shadow">
          <CardContent className="p-5 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-xs text-gray-500">Active Affiliates</p>
              <p className="text-2xl font-bold text-gray-900">{overallStats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow">
          <CardContent className="p-5 flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Total Milestones</p>
              <p className="text-2xl font-bold text-gray-900">{DEFAULT_MILESTONES.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow">
          <CardContent className="p-5 flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Most Completed</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {overallStats.allCompleted.sort((a, b) => b.completedBy - a.completedBy)[0]?.title || "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Milestone completion overview */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" />Milestone Completion Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {overallStats.allCompleted.map(m => (
              <div key={m.id} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl mb-1">{m.icon}</div>
                <p className="text-xs font-medium text-gray-700 leading-tight">{m.title}</p>
                <p className="text-lg font-bold text-amber-600 mt-1">{m.completedBy}</p>
                <p className="text-xs text-gray-400">affiliates</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Per-affiliate progress */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Affiliate Progress</CardTitle>
            <Input
              placeholder="Search affiliate..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs h-8 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredAffiliates.map(a => (
              <button key={a.id} className="w-full text-left" onClick={() => setSelectedAffiliate(a)}>
                <AffiliateProgressRow affiliate={a} />
              </button>
            ))}
            {filteredAffiliates.length === 0 && (
              <p className="text-center text-gray-400 py-8">No approved affiliates yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Individual milestone detail dialog */}
      <Dialog open={!!selectedAffiliate} onOpenChange={v => !v && setSelectedAffiliate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAffiliate?.firstName} {selectedAffiliate?.lastName} — Milestones
            </DialogTitle>
          </DialogHeader>
          {selectedAffiliate && (
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              {DEFAULT_MILESTONES.map(m => (
                <MilestoneCard key={m.id} milestone={m} affiliate={selectedAffiliate} />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}