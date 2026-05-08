import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2, CheckCircle2, FileText, Trophy } from "lucide-react";

const STATUS_COLORS = {
  submitted: "bg-blue-100 text-blue-800",
  under_review: "bg-yellow-100 text-yellow-800",
  documents_needed: "bg-orange-100 text-orange-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

export default function MerchantApplicationsAnalytics({ affiliates }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.MerchantApplication.list("-created_date", 500)
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  // Build a map of referralCode -> affiliate
  const codeToAffiliate = useMemo(() => {
    const map = {};
    affiliates.forEach(a => {
      if (a.referralCode) map[a.referralCode.toUpperCase()] = a;
    });
    return map;
  }, [affiliates]);

  // For each application, find the affiliate via applicationData.ref or referral code in email/notes
  const perAffiliateStats = useMemo(() => {
    const stats = {};

    applications.forEach(app => {
      // Try to find referral code in applicationData
      const refCode = app.applicationData?.refCode
        || app.applicationData?.referralCode
        || app.applicationData?.ref;

      const aff = refCode ? codeToAffiliate[String(refCode).toUpperCase()] : null;
      const key = aff ? aff.id : "__untracked__";

      if (!stats[key]) {
        stats[key] = {
          affiliateId: aff?.id || null,
          name: aff ? `${aff.firstName} ${aff.lastName}` : "Direct / Untracked",
          email: aff?.email || "—",
          referralCode: aff?.referralCode || "—",
          tier: aff?.tier || null,
          total: 0,
          approved: 0,
          submitted: 0,
          under_review: 0,
          documents_needed: 0,
          declined: 0,
        };
      }

      stats[key].total++;
      const s = app.status || "submitted";
      if (stats[key][s] !== undefined) stats[key][s]++;
    });

    // Also include affiliates with zero applications
    affiliates.forEach(a => {
      if (!stats[a.id]) {
        stats[a.id] = {
          affiliateId: a.id,
          name: `${a.firstName} ${a.lastName}`,
          email: a.email,
          referralCode: a.referralCode,
          tier: a.tier,
          total: 0,
          approved: 0,
          submitted: 0,
          under_review: 0,
          documents_needed: 0,
          declined: 0,
        };
      }
    });

    return Object.values(stats)
      .filter(s => s.affiliateId !== null) // exclude untracked in table but keep for chart
      .sort((a, b) => b.approved - a.approved || b.total - a.total);
  }, [applications, codeToAffiliate, affiliates]);

  const chartData = useMemo(() => {
    return perAffiliateStats
      .filter(s => s.total > 0)
      .slice(0, 15)
      .map(s => ({
        name: s.name.split(" ")[0] + " " + (s.name.split(" ")[1]?.charAt(0) || "") + ".",
        approved: s.approved,
        total: s.total,
      }));
  }, [perAffiliateStats]);

  const totalApproved = applications.filter(a => a.status === "approved").length;
  const totalApplications = applications.length;
  const trackedApplications = applications.filter(a => {
    const refCode = a.applicationData?.refCode || a.applicationData?.referralCode || a.applicationData?.ref;
    return !!refCode;
  }).length;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: totalApplications, color: "text-blue-600" },
          { label: "Approved Merchants", value: totalApproved, color: "text-green-600" },
          { label: "Affiliate-Referred", value: trackedApplications, color: "text-amber-600" },
          { label: "Approval Rate", value: totalApplications > 0 ? `${((totalApproved / totalApplications) * 100).toFixed(1)}%` : "0%", color: "text-purple-600" },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart: Approved Applications per Affiliate */}
      {chartData.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader><CardTitle>Approved Merchant Applications by Affiliate</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="approved" fill="#10b981" name="Approved" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="#f59e0b" name="Total Submitted" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Per-Affiliate Table */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Merchant Applications Per Affiliate Partner
          </CardTitle>
        </CardHeader>
        <CardContent>
          {perAffiliateStats.filter(s => s.total > 0).length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No affiliate-tracked applications found.</p>
              <p className="text-xs text-gray-400 mt-1">Applications are tracked when merchants apply via an affiliate referral link.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">#</th>
                    <th className="pb-3 font-medium">Affiliate</th>
                    <th className="pb-3 font-medium">Code</th>
                    <th className="pb-3 font-medium">Tier</th>
                    <th className="pb-3 font-medium text-center">Total</th>
                    <th className="pb-3 font-medium text-center text-green-700">✓ Approved</th>
                    <th className="pb-3 font-medium text-center">In Review</th>
                    <th className="pb-3 font-medium text-center">Declined</th>
                    <th className="pb-3 font-medium text-center">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {perAffiliateStats.filter(s => s.total > 0).map((s, idx) => (
                    <tr key={s.affiliateId || idx} className="hover:bg-gray-50">
                      <td className="py-3 text-gray-400 text-xs">{idx + 1}</td>
                      <td className="py-3">
                        <p className="font-medium text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </td>
                      <td className="py-3 font-mono text-xs text-amber-700 font-bold">{s.referralCode}</td>
                      <td className="py-3">
                        {s.tier && (
                          <span className="text-xs capitalize text-gray-600">{s.tier === "bronze" ? "🥉" : s.tier === "silver" ? "🥈" : s.tier === "gold" ? "🥇" : "💎"} {s.tier}</span>
                        )}
                      </td>
                      <td className="py-3 text-center font-semibold text-gray-700">{s.total}</td>
                      <td className="py-3 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-green-700">
                          {s.approved > 0 && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {s.approved}
                        </span>
                      </td>
                      <td className="py-3 text-center text-yellow-600">{s.submitted + s.under_review + s.documents_needed}</td>
                      <td className="py-3 text-center text-red-500">{s.declined}</td>
                      <td className="py-3 text-center">
                        <Badge className={s.total > 0 && (s.approved / s.total) >= 0.5 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                          {s.total > 0 ? `${((s.approved / s.total) * 100).toFixed(0)}%` : "—"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-gray-400 text-center">
        Applications are attributed to affiliates when merchants apply via a referral link containing an affiliate code.
      </p>
    </div>
  );
}