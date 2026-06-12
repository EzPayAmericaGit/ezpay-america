import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, LineChart, Line, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend
} from "recharts";
import { TrendingUp, DollarSign, Users, Target, Clock, CheckCircle2 } from "lucide-react";

const STATUS_ORDER = ["lead", "applied", "approved", "processing", "converted"];
const STATUS_COLORS = {
  lead: "#6366f1",
  applied: "#f59e0b",
  approved: "#10b981",
  processing: "#3b82f6",
  converted: "#22c55e",
  rejected: "#ef4444",
};

const MONTH_LABELS = () => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleString("default", { month: "short", year: "2-digit" }));
  }
  return months;
};

// ── Per-affiliate grouped table ─────────────────────────────────────────────
function AffiliateGroupedTable({ referrals, affiliates = [] }) {
  const affiliateMap = useMemo(() => {
    const m = {};
    affiliates.forEach(a => { m[a.id] = a; });
    return m;
  }, [affiliates]);

  const grouped = useMemo(() => {
    const g = {};
    referrals.forEach(r => {
      const key = r.affiliateId || r.affiliateCode || "unknown";
      if (!g[key]) g[key] = { id: key, affiliate: affiliateMap[r.affiliateId], referrals: [] };
      g[key].referrals.push(r);
    });
    return Object.values(g).sort((a, b) => b.referrals.length - a.referrals.length);
  }, [referrals, affiliateMap]);

  if (grouped.length === 0) return null;

  return (
    <Card className="border-none shadow-lg">
      <CardHeader><CardTitle>Referrals Grouped by Affiliate</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">Affiliate</th>
                <th className="pb-2 font-medium text-right">Total</th>
                <th className="pb-2 font-medium text-right">Converted</th>
                <th className="pb-2 font-medium text-right">Conv. Rate</th>
                <th className="pb-2 font-medium text-right">Commission</th>
                <th className="pb-2 font-medium">Pipeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grouped.map(g => {
                const total = g.referrals.length;
                const converted = g.referrals.filter(r => r.status === "converted").length;
                const rate = total > 0 ? ((converted / total) * 100).toFixed(0) : 0;
                const commission = g.referrals.reduce((s, r) => s + (r.commissionAmount || 0), 0);
                const pipelineCounts = {};
                ["lead","applied","approved","processing","converted","rejected"].forEach(s => {
                  pipelineCounts[s] = g.referrals.filter(r => r.status === s).length;
                });
                const aff = g.affiliate;
                return (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      {aff ? (
                        <>
                          <p className="font-medium text-gray-900">{aff.firstName} {aff.lastName}</p>
                          <p className="text-xs text-gray-400">{aff.referralCode}</p>
                        </>
                      ) : (
                        <p className="font-mono text-xs text-gray-500">{g.id}</p>
                      )}
                    </td>
                    <td className="py-3 text-right font-semibold">{total}</td>
                    <td className="py-3 text-right text-emerald-600 font-semibold">{converted}</td>
                    <td className="py-3 text-right">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${Number(rate) >= 50 ? "bg-green-100 text-green-700" : Number(rate) >= 20 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {rate}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold text-green-600">${commission.toFixed(2)}</td>
                    <td className="py-3">
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(pipelineCounts).filter(([,v]) => v > 0).map(([s, v]) => (
                          <span key={s} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">{s[0].toUpperCase()}: {v}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReferralAnalytics({ referrals, payouts, affiliate, affiliates = [] }) {
  const months = useMemo(() => MONTH_LABELS(), []);

  // Monthly referrals + commissions
  const monthlyData = useMemo(() => {
    const map = {};
    months.forEach(m => { map[m] = { month: m, referrals: 0, conversions: 0, commission: 0 }; });
    referrals.forEach(r => {
      const key = new Date(r.created_date).toLocaleString("default", { month: "short", year: "2-digit" });
      if (map[key]) {
        map[key].referrals++;
        if (r.status === "converted") map[key].conversions++;
        map[key].commission += r.commissionAmount || 0;
      }
    });
    return Object.values(map);
  }, [referrals, months]);

  // Conversion funnel
  const funnelData = useMemo(() => {
    return STATUS_ORDER.map(s => ({
      name: s.charAt(0).toUpperCase() + s.slice(1),
      value: referrals.filter(r => r.status === s).length,
      fill: STATUS_COLORS[s],
    })).filter(d => d.value > 0);
  }, [referrals]);

  // Commission pipeline
  const pipeline = useMemo(() => {
    const pending = referrals.filter(r => r.commissionStatus === "pending").reduce((s, r) => s + (r.commissionAmount || 0), 0);
    const approved = referrals.filter(r => r.commissionStatus === "approved").reduce((s, r) => s + (r.commissionAmount || 0), 0);
    const paid = payouts.reduce((s, p) => s + (p.amount || 0), 0);
    return [
      { name: "Pending", value: pending, color: "#f59e0b" },
      { name: "Approved", value: approved, color: "#10b981" },
      { name: "Paid Out", value: paid, color: "#6366f1" },
    ];
  }, [referrals, payouts]);

  // Status breakdown pie
  const statusBreakdown = useMemo(() => {
    const counts = {};
    referrals.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || "#94a3b8" }));
  }, [referrals]);

  const conversionRate = referrals.length > 0
    ? ((referrals.filter(r => r.status === "converted").length / referrals.length) * 100).toFixed(1)
    : 0;

  const avgTimeToConvert = useMemo(() => {
    const converted = referrals.filter(r => r.status === "converted" && r.conversionDate);
    if (!converted.length) return null;
    const avgMs = converted.reduce((s, r) => s + (new Date(r.conversionDate) - new Date(r.created_date)), 0) / converted.length;
    return Math.round(avgMs / (1000 * 60 * 60 * 24));
  }, [referrals]);

  const totalCommissionEarned = referrals.reduce((s, r) => s + (r.commissionAmount || 0), 0);
  const totalPaid = payouts.reduce((s, p) => s + (p.amount || 0), 0);
  const bestMonth = monthlyData.reduce((best, m) => m.referrals > (best?.referrals || 0) ? m : best, null);

  if (referrals.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="py-16 text-center">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No referral data yet</p>
          <p className="text-gray-400 text-sm mt-1">Analytics will appear once you submit referrals.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Conversion Rate", value: `${conversionRate}%`, sub: `${referrals.filter(r => r.status === "converted").length} of ${referrals.length} converted`, icon: Target, color: "from-emerald-500 to-green-600" },
          { label: "Total Commission", value: `$${totalCommissionEarned.toFixed(2)}`, sub: `$${totalPaid.toFixed(2)} paid out`, icon: DollarSign, color: "from-amber-500 to-orange-500" },
          { label: "Active Pipeline", value: referrals.filter(r => !["converted", "rejected"].includes(r.status)).length, sub: "referrals in progress", icon: Users, color: "from-blue-500 to-cyan-600" },
          { label: "Avg. Time to Convert", value: avgTimeToConvert ? `${avgTimeToConvert}d` : "–", sub: "from referral to merchant", icon: Clock, color: "from-purple-500 to-violet-600" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow">
            <CardContent className="p-5">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-3`}>
                <kpi.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{kpi.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Trend */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle>Referrals & Conversions (12 Months)</CardTitle>
            {bestMonth && bestMonth.referrals > 0 && (
              <Badge className="bg-amber-100 text-amber-800 text-xs">Best month: {bestMonth.month} ({bestMonth.referrals} refs)</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="referrals" fill="#6366f1" name="Referrals" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" fill="#22c55e" name="Conversions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Commission Trend + Pipeline */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>Commission Earned / Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => `$${(v || 0).toFixed(2)}`} />
                <Line type="monotone" dataKey="commission" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} name="Commission $" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>Commission Pipeline</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              {pipeline.map(p => (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{p.name}</span>
                    <span className="font-bold" style={{ color: p.color }}>${p.value.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full transition-all"
                      style={{
                        width: `${totalCommissionEarned > 0 ? Math.max(4, (p.value / Math.max(totalCommissionEarned, totalPaid)) * 100) : 0}%`,
                        backgroundColor: p.color
                      }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">Total Outstanding</span>
                <span className="font-bold text-gray-900">
                  ${Math.max(0, totalCommissionEarned - totalPaid).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grouped by Affiliate (admin view) */}
      {!affiliate && <AffiliateGroupedTable referrals={referrals} affiliates={affiliates} />}

      {/* Status Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>Referral Status Breakdown</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusBreakdown} cx="50%" cy="50%" outerRadius={75} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {statusBreakdown.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel as horizontal bars */}
        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>Conversion Funnel</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 mt-2">
              {STATUS_ORDER.map(status => {
                const count = referrals.filter(r => r.status === status).length;
                const pct = referrals.length > 0 ? (count / referrals.length) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-600">{status}</span>
                      <span className="font-semibold text-gray-800">{count} <span className="text-gray-400 font-normal">({pct.toFixed(0)}%)</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all"
                        style={{ width: `${Math.max(pct, count > 0 ? 4 : 0)}%`, backgroundColor: STATUS_COLORS[status] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}