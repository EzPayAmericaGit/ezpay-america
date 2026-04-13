import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Users, DollarSign, MousePointerClick } from "lucide-react";

const COLORS = ["#f59e0b", "#6366f1", "#10b981", "#ef4444", "#3b82f6", "#8b5cf6"];
const TIER_COLORS = { bronze: "#b45309", silver: "#6b7280", gold: "#d97706", platinum: "#7c3aed" };

export default function AffiliateAnalytics({ affiliates, referrals, payouts }) {
  // Referrals over last 12 months
  const referralsByMonth = useMemo(() => {
    const months = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      months[key] = { month: key, referrals: 0, conversions: 0, commission: 0 };
    }
    referrals.forEach(r => {
      const d = new Date(r.created_date);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      if (months[key]) {
        months[key].referrals++;
        if (r.status === "converted") months[key].conversions++;
        months[key].commission += r.commissionAmount || 0;
      }
    });
    return Object.values(months);
  }, [referrals]);

  // Referral status breakdown (pie)
  const statusBreakdown = useMemo(() => {
    const counts = {};
    referrals.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [referrals]);

  // Tier distribution (pie)
  const tierBreakdown = useMemo(() => {
    const counts = { bronze: 0, silver: 0, gold: 0, platinum: 0 };
    affiliates.forEach(a => { if (counts[a.tier] !== undefined) counts[a.tier]++; });
    return Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [affiliates]);

  // Top affiliates by conversions
  const topAffiliates = useMemo(() => {
    return [...affiliates]
      .filter(a => a.status === "approved")
      .sort((a, b) => (b.totalConversions || 0) - (a.totalConversions || 0))
      .slice(0, 8)
      .map(a => ({
        name: `${a.firstName} ${a.lastName.charAt(0)}.`,
        conversions: a.totalConversions || 0,
        earned: a.totalEarned || 0,
        referrals: a.totalReferrals || 0,
      }));
  }, [affiliates]);

  // Payouts over time
  const payoutsByMonth = useMemo(() => {
    const months = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      months[key] = { month: key, amount: 0, count: 0 };
    }
    payouts.forEach(p => {
      const d = new Date(p.paidDate || p.created_date);
      const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
      if (months[key]) { months[key].amount += p.amount || 0; months[key].count++; }
    });
    return Object.values(months);
  }, [payouts]);

  const conversionRate = referrals.length > 0
    ? ((referrals.filter(r => r.status === "converted").length / referrals.length) * 100).toFixed(1)
    : 0;

  const avgCommission = referrals.filter(r => r.commissionAmount > 0).length > 0
    ? (referrals.reduce((s, r) => s + (r.commissionAmount || 0), 0) / referrals.filter(r => r.commissionAmount > 0).length).toFixed(2)
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Conversion Rate", value: `${conversionRate}%`, sub: "leads → merchants", icon: TrendingUp, color: "text-emerald-600" },
          { label: "Avg Commission", value: `$${avgCommission}`, sub: "per conversion", icon: DollarSign, color: "text-amber-600" },
          { label: "Active Affiliates", value: affiliates.filter(a => a.status === "approved").length, sub: "approved & active", icon: Users, color: "text-blue-600" },
          { label: "Total Clicks", value: affiliates.reduce((s, a) => s + (a.totalClicks || 0), 0).toLocaleString(), sub: "across all affiliates", icon: MousePointerClick, color: "text-purple-600" },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                </div>
                <s.icon className={`w-5 h-5 ${s.color} opacity-60 mt-1`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Referrals & Conversions Over Time */}
      <Card className="border-none shadow-lg">
        <CardHeader><CardTitle>Referrals & Conversions (12 Months)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={referralsByMonth} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="referrals" fill="#f59e0b" name="Referrals" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" fill="#10b981" name="Conversions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Commission Earned Over Time + Payout History */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>Commission Earned / Month ($)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={referralsByMonth} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => `$${v.toFixed(2)}`} />
                <Line type="monotone" dataKey="commission" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Commission $" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>Payouts Sent / Month ($)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={payoutsByMonth} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => `$${v.toFixed(2)}`} />
                <Bar dataKey="amount" fill="#10b981" name="Paid $" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Breakdowns */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>Referral Status Breakdown</CardTitle></CardHeader>
          <CardContent>
            {statusBreakdown.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No referral data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={statusBreakdown} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {statusBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>Affiliate Tier Distribution</CardTitle></CardHeader>
          <CardContent>
            {tierBreakdown.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No affiliate data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={tierBreakdown} cx="50%" cy="50%" outerRadius={75} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                    {tierBreakdown.map((entry, i) => <Cell key={i} fill={TIER_COLORS[entry.name] || COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Affiliates Leaderboard */}
      {topAffiliates.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>🏆 Top Affiliates by Conversions</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topAffiliates} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={60} />
                <Tooltip />
                <Bar dataKey="conversions" fill="#6366f1" name="Conversions" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}