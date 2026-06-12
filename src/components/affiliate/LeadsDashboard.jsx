import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight, Clock, AlertCircle, TrendingUp, Users, CheckCircle2, PhoneCall } from "lucide-react";

const STATUS_COLORS = {
  lead: "bg-indigo-100 text-indigo-700",
  applied: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  processing: "bg-blue-100 text-blue-700",
  converted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  clicked: "bg-gray-100 text-gray-700",
};

const PIPELINE_STAGES = ["lead", "applied", "approved", "processing", "converted"];

function daysSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
}

export default function LeadsDashboard({ referrals = [], affiliates = [], onReferralUpdated }) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const affiliateMap = useMemo(() => {
    const m = {};
    affiliates.forEach(a => { m[a.id] = a; });
    return m;
  }, [affiliates]);

  const filtered = useMemo(() => {
    return referrals.filter(r => {
      const matchSearch = !search || [r.referredBusiness, r.referredName, r.referredEmail, r.affiliateCode]
        .join(" ").toLowerCase().includes(search.toLowerCase());
      const matchStage = stageFilter === "all" || r.status === stageFilter;
      return matchSearch && matchStage;
    });
  }, [referrals, search, stageFilter]);

  // Group by pipeline stage
  const grouped = useMemo(() => {
    const g = {};
    PIPELINE_STAGES.forEach(s => { g[s] = []; });
    g.rejected = [];
    filtered.forEach(r => { if (g[r.status]) g[r.status].push(r); });
    return g;
  }, [filtered]);

  const stageStats = useMemo(() => {
    return PIPELINE_STAGES.map(s => ({
      stage: s,
      count: referrals.filter(r => r.status === s).length,
      commission: referrals.filter(r => r.status === s).reduce((sum, r) => sum + (r.commissionAmount || 0), 0),
    }));
  }, [referrals]);

  const stale = filtered.filter(r => !["converted", "rejected"].includes(r.status) && daysSince(r.updated_date || r.created_date) > 14);

  const advanceStage = async (referral) => {
    const idx = PIPELINE_STAGES.indexOf(referral.status);
    if (idx < 0 || idx >= PIPELINE_STAGES.length - 1) return;
    const nextStatus = PIPELINE_STAGES[idx + 1];
    setUpdatingId(referral.id);
    await base44.entities.AffiliateReferral.update(referral.id, { status: nextStatus });
    // Fire status alert
    base44.functions.invoke("sendAffiliateStatusAlert", {
      referralId: referral.id,
      newStatus: nextStatus,
      affiliateId: referral.affiliateId,
    }).catch(() => {});
    if (onReferralUpdated) onReferralUpdated();
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stageStats.map(s => (
          <Card key={s.stage} className={`border-2 cursor-pointer transition-all ${stageFilter === s.stage ? "border-amber-400 shadow-md" : "border-transparent shadow"}`}
            onClick={() => setStageFilter(stageFilter === s.stage ? "all" : s.stage)}>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 capitalize mb-1">{s.stage}</p>
              <p className="text-2xl font-bold text-gray-900">{s.count}</p>
              {s.commission > 0 && <p className="text-xs text-green-600 font-medium">${s.commission.toFixed(0)}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stale Leads Alert */}
      {stale.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-orange-800">{stale.length} lead{stale.length > 1 ? "s" : ""} stale for 14+ days</p>
            <p className="text-xs text-orange-700">These leads haven't moved pipeline stages recently.</p>
          </div>
          <Button size="sm" variant="outline" className="ml-auto border-orange-300 text-orange-700 hover:bg-orange-100"
            onClick={() => setStageFilter("lead")}>
            View Leads
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {PIPELINE_STAGES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Kanban-style lead cards */}
      {stageFilter === "all" ? (
        <div className="space-y-6">
          {PIPELINE_STAGES.filter(s => grouped[s]?.length > 0).map(stage => (
            <div key={stage}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[stage]}`}>{stage}</span>
                <span className="text-sm text-gray-400">{grouped[stage].length} lead{grouped[stage].length !== 1 ? "s" : ""}</span>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                {grouped[stage].map(r => (
                  <LeadCard key={r.id} referral={r} affiliate={affiliateMap[r.affiliateId]}
                    onAdvance={() => advanceStage(r)} advancing={updatingId === r.id}
                    isStale={daysSince(r.updated_date || r.created_date) > 14} />
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No leads found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(r => (
            <LeadCard key={r.id} referral={r} affiliate={affiliateMap[r.affiliateId]}
              onAdvance={() => advanceStage(r)} advancing={updatingId === r.id}
              isStale={daysSince(r.updated_date || r.created_date) > 14} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400">No leads in this stage.</div>
          )}
        </div>
      )}
    </div>
  );
}

function LeadCard({ referral: r, affiliate, onAdvance, advancing, isStale }) {
  const days = daysSince(r.created_date);
  const canAdvance = PIPELINE_STAGES.includes(r.status) && PIPELINE_STAGES.indexOf(r.status) < PIPELINE_STAGES.length - 1;

  return (
    <Card className={`border-2 ${isStale ? "border-orange-200" : "border-gray-100"} shadow-sm hover:shadow-md transition-all`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{r.referredBusiness || r.referredName || "Unnamed Lead"}</p>
            <p className="text-xs text-gray-500 truncate">{r.referredEmail}</p>
          </div>
          <Badge className={`text-xs flex-shrink-0 ${STATUS_COLORS[r.status]}`}>{r.status}</Badge>
        </div>

        {r.referredPhone && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <PhoneCall className="w-3 h-3" /> {r.referredPhone}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {days}d ago
          </span>
          {affiliate && <span className="text-amber-600 font-medium truncate max-w-[120px]">{affiliate.firstName} {affiliate.lastName}</span>}
        </div>

        {r.commissionAmount > 0 && (
          <p className="text-xs font-semibold text-green-600 mb-3">${r.commissionAmount} commission</p>
        )}

        {canAdvance && (
          <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white h-7 text-xs"
            onClick={onAdvance} disabled={advancing}>
            {advancing ? "Updating..." : <>Advance to {PIPELINE_STAGES[PIPELINE_STAGES.indexOf(r.status) + 1]} <ChevronRight className="w-3 h-3 ml-1" /></>}
          </Button>
        )}
        {r.status === "converted" && (
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold justify-center">
            <CheckCircle2 className="w-3.5 h-3.5" /> Converted
          </div>
        )}
      </CardContent>
    </Card>
  );
}