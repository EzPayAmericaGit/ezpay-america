import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, ExternalLink, CheckCircle2, Loader2, AlertCircle, Send } from "lucide-react";

export default function BatchPayoutPanel({ affiliates, referrals, payouts, onPayoutsUpdated }) {
  const [selected, setSelected] = useState(new Set());
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [batchNotes, setBatchNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [overrides, setOverrides] = useState({});

  // Build payout-eligible list: approved affiliates with approved commissions that haven't been paid
  const eligible = useMemo(() => {
    return affiliates
      .filter(a => a.status === "approved")
      .map(a => {
        const unpaidRefs = referrals.filter(r =>
          r.affiliateId === a.id &&
          r.commissionStatus === "approved" &&
          r.commissionAmount > 0
        );
        const owed = unpaidRefs.reduce((s, r) => s + (r.commissionAmount || 0), 0);
        return { affiliate: a, unpaidRefs, owed };
      })
      .filter(e => e.owed > 0);
  }, [affiliates, referrals]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === eligible.length) setSelected(new Set());
    else setSelected(new Set(eligible.map(e => e.affiliate.id)));
  };

  const selectedItems = eligible.filter(e => selected.has(e.affiliate.id));
  const totalSelected = selectedItems.reduce((s, e) => s + (overrides[e.affiliate.id] !== undefined ? parseFloat(overrides[e.affiliate.id] || 0) : e.owed), 0);

  const processBatch = async () => {
    setProcessing(true);
    const results = [];
    for (const item of selectedItems) {
      const amount = overrides[item.affiliate.id] !== undefined
        ? parseFloat(overrides[item.affiliate.id] || 0)
        : item.owed;
      if (amount <= 0) continue;

      // Create payout record
      const payout = await base44.entities.AffiliatePayout.create({
        affiliateId: item.affiliate.id,
        affiliateName: `${item.affiliate.firstName} ${item.affiliate.lastName}`,
        affiliateEmail: item.affiliate.email,
        paypalEmail: item.affiliate.paypalEmail,
        amount,
        status: "processing",
        notes: batchNotes || "Batch payout",
        referralIds: item.unpaidRefs.map(r => r.id),
        paidDate: new Date().toISOString(),
      });

      // Mark those referrals as paid
      await Promise.all(item.unpaidRefs.map(r =>
        base44.entities.AffiliateReferral.update(r.id, { commissionStatus: "paid" })
      ));

      // Update affiliate totals
      const newTotalPaid = (item.affiliate.totalPaid || 0) + amount;
      await base44.entities.Affiliate.update(item.affiliate.id, { totalPaid: newTotalPaid });

      // Email the affiliate via backend function with branded template
      base44.functions.invoke("sendPayoutNotification", {
        affiliateName: `${item.affiliate.firstName} ${item.affiliate.lastName}`,
        affiliateEmail: item.affiliate.email,
        paypalEmail: item.affiliate.paypalEmail,
        amount,
        referralCount: item.unpaidRefs.length,
        payoutId: payout.id,
      }).catch(() => {});

      results.push(payout);
    }
    setProcessing(false);
    setDone(true);
    setSelected(new Set());
    setOverrides({});
    setBatchNotes("");
    setConfirmDialog(false);
    onPayoutsUpdated();
  };

  if (done) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Payouts Queued!</h3>
          <p className="text-gray-500 mb-4">All selected affiliates have been notified via email. Go to PayPal and send the payments, then update the transaction IDs in the Payouts tab.</p>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setDone(false)}>Queue More Payouts</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle>Automated Payout Queue</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Select affiliates with approved commissions to pay out via PayPal</p>
            </div>
            {selected.size > 0 && (
              <Button className="bg-green-500 hover:bg-green-600 text-white gap-2" onClick={() => setConfirmDialog(true)}>
                <Send className="w-4 h-4" />
                Pay {selected.size} Affiliate{selected.size > 1 ? "s" : ""} — ${totalSelected.toFixed(2)}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {eligible.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No payouts ready</p>
              <p className="text-gray-400 text-sm mt-1">Affiliates appear here once they have approved commissions waiting to be paid.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Select All */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg mb-3">
                <Checkbox checked={selected.size === eligible.length && eligible.length > 0} onCheckedChange={toggleAll} />
                <span className="text-sm font-medium text-gray-700">Select All ({eligible.length})</span>
                {selected.size > 0 && (
                  <span className="ml-auto text-sm font-bold text-green-600">
                    Total: ${totalSelected.toFixed(2)}
                  </span>
                )}
              </div>

              {eligible.map(({ affiliate: a, unpaidRefs, owed }) => (
                <div key={a.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${selected.has(a.id) ? "border-amber-400 bg-amber-50" : "border-gray-100 bg-white hover:border-gray-200"}`}>
                  <Checkbox
                    checked={selected.has(a.id)}
                    onCheckedChange={() => toggleSelect(a.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{a.firstName} {a.lastName}</p>
                      <Badge className="text-xs bg-purple-100 text-purple-800 capitalize">{a.tier}</Badge>
                      <span className="text-xs text-gray-400">{a.referralCode}</span>
                    </div>
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> {a.paypalEmail}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {unpaidRefs.slice(0, 3).map(r => (
                        <span key={r.id} className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                          {r.referredBusiness || r.referredEmail} • ${r.commissionAmount}
                        </span>
                      ))}
                      {unpaidRefs.length > 3 && <span className="text-xs text-gray-400">+{unpaidRefs.length - 3} more</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 text-sm">$</span>
                      <Input
                        type="number"
                        value={overrides[a.id] !== undefined ? overrides[a.id] : owed.toFixed(2)}
                        onChange={e => setOverrides(prev => ({ ...prev, [a.id]: e.target.value }))}
                        className="w-24 h-8 text-right text-sm font-bold text-green-700"
                        onClick={e => e.stopPropagation()}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{unpaidRefs.length} ref{unpaidRefs.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Confirm Batch Payout</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-semibold text-amber-900 mb-3">You are about to queue payouts for:</p>
              <div className="space-y-2">
                {selectedItems.map(({ affiliate: a }) => {
                  const amount = overrides[a.id] !== undefined ? parseFloat(overrides[a.id] || 0) : eligible.find(e => e.affiliate.id === a.id)?.owed || 0;
                  return (
                    <div key={a.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{a.firstName} {a.lastName}</span>
                      <span className="font-bold text-green-700">${amount.toFixed(2)} → {a.paypalEmail}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-amber-300 mt-3 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-green-700">${totalSelected.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Batch Notes (optional)</label>
              <Textarea placeholder="e.g. Q1 2026 commission payout" rows={2} value={batchNotes} onChange={e => setBatchNotes(e.target.value)} />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">This will mark all selected commissions as <strong>paid</strong> and email each affiliate. You will need to manually send the payments in PayPal.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDialog(false)}>Cancel</Button>
              <a href="https://www.paypal.com/myaccount/transfer/homepage/pay" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full border-blue-400 text-blue-700 text-xs">Open PayPal <ExternalLink className="w-3 h-3 ml-1" /></Button>
              </a>
              <Button disabled={processing} onClick={processBatch} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-1" />Confirm</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}