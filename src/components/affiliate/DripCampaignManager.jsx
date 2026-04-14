import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCw, Play, Search, Mail, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

const STEP_LABELS = { 0: "Step 1 — Welcome", 1: "Step 2 — Follow-up", 2: "Step 3 — Equipment", 3: "Step 4 — Final" };
const MAX_STEPS = 4;

function parseDripState(notes) {
  if (!notes || !notes.startsWith("{")) return null;
  try { return JSON.parse(notes); } catch { return null; }
}

function getDripStatus(state) {
  if (!state) return { label: "Not Started", color: "bg-gray-100 text-gray-600" };
  if (state.drip_step >= MAX_STEPS) return { label: "Completed", color: "bg-green-100 text-green-700" };
  if (state.next_send_at && new Date(state.next_send_at) > new Date()) return { label: "Scheduled", color: "bg-blue-100 text-blue-700" };
  return { label: `Step ${state.drip_step + 1} Due`, color: "bg-amber-100 text-amber-700" };
}

export default function DripCampaignManager({ affiliates }) {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(null);
  const [running, setRunning] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [lastRun, setLastRun] = useState(null);

  useEffect(() => { loadReferrals(); }, []);

  const loadReferrals = async () => {
    setLoading(true);
    const refs = await base44.entities.AffiliateReferral.filter({ source: "referral_portal" });
    setReferrals(refs);
    setLoading(false);
  };

  const runDrip = async () => {
    setRunning(true);
    const res = await base44.functions.invoke("processAffiliateDrip", {});
    setLastRun({ time: new Date(), sent: res?.data?.sent || 0, processed: res?.data?.processed || 0 });
    setRunning(false);
    await loadReferrals();
  };

  const triggerDrip = async (ref) => {
    const aff = affiliates.find(a => a.id === ref.affiliateId);
    setTriggering(ref.id);
    await base44.functions.invoke("startAffiliateDrip", {
      leadEmail: ref.referredEmail,
      leadName: ref.referredName || ref.referredBusiness || "Business Owner",
      businessName: ref.referredBusiness || "your business",
      affiliateName: aff ? `${aff.firstName} ${aff.lastName}` : "Your Referrer",
      affiliateCode: ref.affiliateCode,
    });
    setTriggering(null);
    await loadReferrals();
  };

  const enriched = useMemo(() => referrals.map(r => {
    const state = parseDripState(r.notes);
    const status = getDripStatus(state);
    const aff = affiliates.find(a => a.id === r.affiliateId);
    return { ...r, dripState: state, dripStatus: status, affiliateName: aff ? `${aff.firstName} ${aff.lastName}` : r.affiliateCode };
  }), [referrals, affiliates]);

  const filtered = useMemo(() => enriched.filter(r => {
    const matchSearch = !search || `${r.referredBusiness} ${r.referredEmail} ${r.affiliateName}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" ||
      (filterStatus === "active" && r.dripState && r.dripState.drip_step < MAX_STEPS) ||
      (filterStatus === "completed" && r.dripState?.drip_step >= MAX_STEPS) ||
      (filterStatus === "not_started" && !r.dripState);
    return matchSearch && matchStatus;
  }), [enriched, search, filterStatus]);

  const stats = useMemo(() => ({
    total: enriched.length,
    active: enriched.filter(r => r.dripState && r.dripState.drip_step < MAX_STEPS).length,
    completed: enriched.filter(r => r.dripState?.drip_step >= MAX_STEPS).length,
    notStarted: enriched.filter(r => !r.dripState).length,
  }), [enriched]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads", value: stats.total, icon: Mail, color: "text-blue-600" },
          { label: "Active Drips", value: stats.active, icon: Clock, color: "text-amber-600" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-600" },
          { label: "Not Started", value: stats.notStarted, icon: AlertCircle, color: "text-gray-500" },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <s.icon className={`w-6 h-6 ${s.color}`} />
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Drip Campaign Queue</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={loadReferrals} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? "animate-spin" : ""}`} />Refresh
              </Button>
              <Button onClick={runDrip} disabled={running} className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5">
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Process Due Drips
              </Button>
            </div>
          </div>
          {lastRun && (
            <p className="text-xs text-gray-500">
              Last run: {lastRun.time.toLocaleTimeString()} — processed {lastRun.processed} leads, sent {lastRun.sent} email{lastRun.sent !== 1 ? "s" : ""}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search by business, email, or affiliate..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-amber-500" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No drip campaigns found.</p>
              <p className="text-xs mt-1">Referrals submitted via the portal automatically start a drip.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Lead</th>
                    <th className="pb-3 font-medium">Affiliate</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Current Step</th>
                    <th className="pb-3 font-medium">Next Send</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <p className="font-medium text-gray-900">{r.referredBusiness || "–"}</p>
                        <p className="text-xs text-gray-500">{r.referredEmail}</p>
                      </td>
                      <td className="py-3 text-xs text-gray-600">{r.affiliateName}</td>
                      <td className="py-3">
                        <Badge className={`${r.dripStatus.color} text-xs`}>{r.dripStatus.label}</Badge>
                      </td>
                      <td className="py-3 text-xs text-gray-700">
                        {r.dripState ? STEP_LABELS[r.dripState.drip_step] || "Complete" : "–"}
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        {r.dripState?.next_send_at
                          ? new Date(r.dripState.next_send_at).toLocaleString()
                          : "–"}
                      </td>
                      <td className="py-3">
                        {(!r.dripState || r.dripState.drip_step >= MAX_STEPS) ? (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs border-amber-400 text-amber-700"
                            disabled={triggering === r.id} onClick={() => triggerDrip(r)}>
                            {triggering === r.id ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                            {r.dripState ? "Restart" : "Start Drip"}
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">Auto-running</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p><strong>💡 How automated drip works:</strong> When a lead is submitted via the referral portal, email 1 is sent immediately. A scheduled automation runs every hour to check for due follow-ups and sends them automatically (emails 2, 3, 4 over 10 days). You can also manually trigger or restart a campaign for any lead.</p>
      </div>
    </div>
  );
}