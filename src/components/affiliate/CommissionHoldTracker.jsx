import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, AlertTriangle, Lock } from "lucide-react";

const HOLD_DAYS = 30; // Commission hold period in days

function getHoldInfo(referral) {
  const created = new Date(referral.created_date);
  const releaseDate = new Date(created.getTime() + HOLD_DAYS * 24 * 60 * 60 * 1000);
  const now = new Date();
  const daysHeld = Math.floor((now - created) / (24 * 60 * 60 * 1000));
  const daysRemaining = Math.max(0, HOLD_DAYS - daysHeld);
  const isReleased = daysHeld >= HOLD_DAYS;
  const progress = Math.min(100, (daysHeld / HOLD_DAYS) * 100);
  return { releaseDate, daysHeld, daysRemaining, isReleased, progress };
}

export default function CommissionHoldTracker({ referrals = [] }) {
  // Only show referrals that have a commission and are in pending/approved status
  const tracked = referrals.filter(r => r.commissionAmount > 0 && ["lead", "applied", "approved", "processing", "converted"].includes(r.status));

  if (tracked.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="py-12 text-center">
          <Lock className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No commissions in hold period</p>
          <p className="text-gray-400 text-sm mt-1">Commissions appear here during their 30-day hold period before becoming available for payout.</p>
        </CardContent>
      </Card>
    );
  }

  const totalHeld = tracked.filter(r => !getHoldInfo(r).isReleased && r.commissionStatus === "pending")
    .reduce((s, r) => s + (r.commissionAmount || 0), 0);
  const totalReleased = tracked.filter(r => getHoldInfo(r).isReleased && r.commissionStatus !== "paid")
    .reduce((s, r) => s + (r.commissionAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">In Hold Period</p>
              <p className="text-xl font-bold text-yellow-600">${totalHeld.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Released (Eligible)</p>
              <p className="text-xl font-bold text-green-600">${totalReleased.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Commission Hold Status
            <span className="text-xs font-normal text-gray-400 ml-1">({HOLD_DAYS}-day hold period)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tracked.map(r => {
              const { releaseDate, daysHeld, daysRemaining, isReleased, progress } = getHoldInfo(r);
              const isRefunded = r.commissionStatus === "cancelled";
              return (
                <div key={r.id} className={`p-4 rounded-xl border-2 ${isRefunded ? "border-red-200 bg-red-50" : isReleased ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{r.referredBusiness || r.referredName || "–"}</p>
                      <p className="text-xs text-gray-500">{r.referredEmail} • {new Date(r.created_date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-bold text-gray-900">${r.commissionAmount}</span>
                      {isRefunded ? (
                        <Badge className="bg-red-100 text-red-700 text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Reversed
                        </Badge>
                      ) : isReleased ? (
                        <Badge className="bg-green-100 text-green-700 text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Released
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {daysRemaining}d left
                        </Badge>
                      )}
                    </div>
                  </div>
                  {!isRefunded && (
                    <>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div
                          className={`h-2 rounded-full transition-all ${isReleased ? "bg-green-500" : "bg-yellow-400"}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Day {daysHeld}</span>
                        <span>{isReleased ? "Released!" : `Releases ${releaseDate.toLocaleDateString()}`}</span>
                        <span>Day {HOLD_DAYS}</span>
                      </div>
                    </>
                  )}
                  {isRefunded && (
                    <p className="text-xs text-red-600 mt-1">⚠️ This commission was reversed due to merchant cancellation or refund.</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>💡 Hold Period Policy:</strong> All commissions are held for {HOLD_DAYS} days after the referral is submitted to protect against refunds and cancellations. Once released, commissions become eligible for your next payout cycle.
      </div>
    </div>
  );
}