import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, RefreshCw, DollarSign, X } from "lucide-react";

const STATUS_COLORS = {
  converted: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  approved: "bg-purple-100 text-purple-800",
  lead: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

export default function RefundManager({ referrals, affiliates, onUpdated }) {
  const [filter, setFilter] = useState("at_risk");
  const [processing, setProcessing] = useState(null);

  // At-risk: converted referrals with approved commissions (could be clawed back)
  // Refunded: referrals where commission was cancelled
  const atRisk = referrals.filter(r => r.status === "converted" && r.commissionStatus === "approved");
  const refunded = referrals.filter(r => r.commissionStatus === "cancelled");
  const displayed = filter === "at_risk" ? atRisk : refunded;

  const processRefund = async (referral) => {
    if (!confirm(`Clawback commission for ${referral.referredBusiness || referral.referredEmail}? This will cancel their commission and mark the referral as rejected.`)) return;
    setProcessing(referral.id);
    await base44.entities.AffiliateReferral.update(referral.id, {
      status: "rejected",
      commissionStatus: "cancelled",
      notes: (referral.notes || "") + `\n[Refund/Clawback processed ${new Date().toLocaleDateString()}]`
    });
    // If the affiliate had already been credited, we'd deduct from totalEarned
    const aff = affiliates.find(a => a.id === referral.affiliateId);
    if (aff && referral.commissionAmount > 0) {
      const newEarned = Math.max(0, (aff.totalEarned || 0) - referral.commissionAmount);
      await base44.entities.Affiliate.update(aff.id, { totalEarned: newEarned });
    }
    // Notify affiliate
    if (aff) {
      base44.integrations.Core.SendEmail({
        to: aff.email,
        subject: "Commission Clawback Notice - EzPay America",
        body: `Hello ${aff.firstName},\n\nUnfortunately, a commission of $${referral.commissionAmount} for ${referral.referredBusiness || referral.referredEmail} has been reversed due to a refund or chargeback. This amount has been deducted from your account.\n\nIf you have questions, please contact us at mail@ezpayamerica.com\n\nBest regards,\nEzPay America Team`
      }).catch(() => {});
    }
    setProcessing(null);
    onUpdated();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow cursor-pointer" onClick={() => setFilter("at_risk")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">At-Risk Commissions</p>
                <p className="text-xl font-bold text-orange-600">{atRisk.length}</p>
                <p className="text-xs text-gray-400">${atRisk.reduce((s, r) => s + (r.commissionAmount || 0), 0).toFixed(2)} exposure</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow cursor-pointer" onClick={() => setFilter("refunded")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Clawbacks Processed</p>
                <p className="text-xl font-bold text-red-600">{refunded.length}</p>
                <p className="text-xs text-gray-400">${refunded.reduce((s, r) => s + (r.commissionAmount || 0), 0).toFixed(2)} recovered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              {filter === "at_risk" ? "At-Risk Commissions (Approved, Not Yet Paid)" : "Processed Clawbacks"}
            </CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="at_risk">At-Risk</SelectItem>
                <SelectItem value="refunded">Clawbacks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {displayed.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{filter === "at_risk" ? "No at-risk commissions." : "No clawbacks processed."}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Referred Business</th>
                    <th className="pb-3 font-medium">Affiliate</th>
                    <th className="pb-3 font-medium">Commission</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    {filter === "at_risk" && <th className="pb-3 font-medium">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {displayed.map(r => {
                    const aff = affiliates.find(a => a.id === r.affiliateId);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="py-3">
                          <p className="font-medium text-gray-900">{r.referredBusiness || "–"}</p>
                          <p className="text-xs text-gray-500">{r.referredEmail}</p>
                        </td>
                        <td className="py-3 text-gray-600 text-xs">{aff ? `${aff.firstName} ${aff.lastName}` : r.affiliateCode}</td>
                        <td className="py-3 font-semibold text-orange-600">${r.commissionAmount || 0}</td>
                        <td className="py-3">
                          <Badge className={`${STATUS_COLORS[r.commissionStatus] || "bg-gray-100 text-gray-700"} text-xs`}>{r.commissionStatus}</Badge>
                        </td>
                        <td className="py-3 text-xs text-gray-500">{new Date(r.created_date).toLocaleDateString()}</td>
                        {filter === "at_risk" && (
                          <td className="py-3">
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200 text-xs h-7"
                              disabled={processing === r.id}
                              onClick={() => processRefund(r)}>
                              <X className="w-3 h-3 mr-1" />Clawback
                            </Button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}