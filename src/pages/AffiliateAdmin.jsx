import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SEOHead from "../components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, Users, TrendingUp, Search, CheckCircle2, Clock, RefreshCw, ExternalLink, Loader2, Eye, BarChart2, Send, ArrowUp, Mail, ShieldCheck, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AffiliateAnalytics from "../components/affiliate/AffiliateAnalytics";
import BatchPayoutPanel from "../components/affiliate/BatchPayoutPanel";
import EmailTemplateManager from "../components/affiliate/EmailTemplateManager";
import CommissionTierManager from "../components/affiliate/CommissionTierManager";
import DripCampaignManager from "../components/affiliate/DripCampaignManager";
import ProgramManager from "../components/affiliate/ProgramManager";
import ResourceManager from "../components/affiliate/ResourceManager";
import CouponManager from "../components/affiliate/CouponManager";
import MerchantApplicationsAnalytics from "../components/affiliate/MerchantApplicationsAnalytics";
import AffiliateMilestones from "../components/affiliate/AffiliateMilestones";
import ReferralLinkGenerator from "../components/affiliate/ReferralLinkGenerator";

const STATUS_BADGE = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-gray-100 text-gray-800",
  gold: "bg-yellow-100 text-yellow-800",
  platinum: "bg-purple-100 text-purple-800",
};

export default function AffiliateAdmin() {
  const [authUser, setAuthUser] = useState(undefined);
  const [affiliates, setAffiliates] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("affiliates");
  const [selectedAffiliate, setSelectedAffiliate] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [payoutDialog, setPayoutDialog] = useState(false);
  const [payoutAffiliate, setPayoutAffiliate] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutTxId, setPayoutTxId] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [addReferralDialog, setAddReferralDialog] = useState(false);
  const [newReferral, setNewReferral] = useState({ affiliateId: "", referredName: "", referredEmail: "", referredBusiness: "", referredPhone: "", commissionAmount: "" });
  const [addAffiliateDialog, setAddAffiliateDialog] = useState(false);
  const [newAffiliate, setNewAffiliate] = useState({ firstName: "", lastName: "", email: "", paypalEmail: "", phone: "", company: "", website: "", marketingStrategy: "", proposedCommission: "" });
  const [addAffiliateLoading, setAddAffiliateLoading] = useState(false);
  const [editCommissionDialog, setEditCommissionDialog] = useState(false);
  const [editCommissionAffiliate, setEditCommissionAffiliate] = useState(null);
  const [editCommissionValue, setEditCommissionValue] = useState("");

  useEffect(() => {
    base44.auth.me().then(setAuthUser).catch(() => setAuthUser(null));
  }, []);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    const [affs, refs, pays] = await Promise.all([
      base44.entities.Affiliate.list("-created_date"),
      base44.entities.AffiliateReferral.list("-created_date"),
      base44.entities.AffiliatePayout.list("-created_date"),
    ]);
    setAffiliates(affs);
    setReferrals(refs);
    setPayouts(pays);
    setLoading(false);
  };

  // Tier logic: auto-upgrade based on totalConversions
  const computeTier = (conversions) => {
    if (conversions >= 20) return "platinum";
    if (conversions >= 10) return "gold";
    if (conversions >= 5) return "silver";
    return "bronze";
  };

  const computeCommissionRate = (tier) => {
    const rates = { bronze: 10, silver: 12, gold: 15, platinum: 20 };
    return rates[tier] || 10;
  };

  const updateAffiliateStatus = async (id, status) => {
    await base44.entities.Affiliate.update(id, { status });
    setAffiliates(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selectedAffiliate?.id === id) setSelectedAffiliate(prev => ({ ...prev, status }));
  };

  // Recalculate tier & commission rate for all approved affiliates using DB-configured tiers
  const runTierUpgrades = async () => {
    // Load tier rules from DB (fall back to defaults if none configured)
    let tierRules = await base44.entities.CommissionTier.list("minConversions").catch(() => []);
    if (!tierRules.length) {
      tierRules = [
        { tier: "bronze", minConversions: 0, commissionRate: 10 },
        { tier: "silver", minConversions: 5, commissionRate: 12 },
        { tier: "gold", minConversions: 10, commissionRate: 15 },
        { tier: "platinum", minConversions: 20, commissionRate: 20 },
      ];
    }
    const getTierForConversions = (conversions) => {
      const sorted = [...tierRules].sort((a, b) => b.minConversions - a.minConversions);
      return sorted.find(r => conversions >= r.minConversions) || sorted[sorted.length - 1];
    };

    const approved = affiliates.filter(a => a.status === "approved");
    let upgrades = 0;
    for (const a of approved) {
      const rule = getTierForConversions(a.totalConversions || 0);
      const newTier = rule.tier;
      const newRate = rule.commissionRate;
      if (newTier !== a.tier || newRate !== a.commissionRate) {
        await base44.entities.Affiliate.update(a.id, { tier: newTier, commissionRate: newRate });
        if (newTier !== a.tier) {
          base44.functions.invoke("sendContactEmail", {
            name: `${a.firstName} ${a.lastName}`,
            email: a.email,
            message: `Congratulations! You've been upgraded to ${newTier.toUpperCase()} tier! Your commission rate is now ${newRate}%. Keep referring merchants to keep climbing the ranks!`,
            service: "Affiliate Tier Upgrade"
          }).catch(() => {});
          upgrades++;
        }
      }
    }
    setAffiliates(prev => prev.map(a => {
      if (a.status !== "approved") return a;
      const rule = getTierForConversions(a.totalConversions || 0);
      return { ...a, tier: rule.tier, commissionRate: rule.commissionRate };
    }));
    alert(`Tier check complete. ${upgrades} affiliate(s) upgraded.`);
  };

  const updateReferralStatus = async (id, status, commissionStatus) => {
    const update = { status };
    if (commissionStatus) update.commissionStatus = commissionStatus;
    await base44.entities.AffiliateReferral.update(id, update);
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, ...update } : r));
  };

  const processPayout = async () => {
    if (!payoutAffiliate || !payoutAmount) return;
    setPayoutLoading(true);
    const payout = await base44.entities.AffiliatePayout.create({
      affiliateId: payoutAffiliate.id,
      affiliateName: `${payoutAffiliate.firstName} ${payoutAffiliate.lastName}`,
      affiliateEmail: payoutAffiliate.email,
      paypalEmail: payoutAffiliate.paypalEmail,
      amount: parseFloat(payoutAmount),
      status: "completed",
      paypalTransactionId: payoutTxId,
      notes: payoutNotes,
      paidDate: new Date().toISOString(),
    });

    // Update affiliate totalPaid
    const newTotalPaid = (payoutAffiliate.totalPaid || 0) + parseFloat(payoutAmount);
    await base44.entities.Affiliate.update(payoutAffiliate.id, { totalPaid: newTotalPaid });

    // Notify affiliate
    base44.functions.invoke("sendContactEmail", {
      name: `${payoutAffiliate.firstName} ${payoutAffiliate.lastName}`,
      email: payoutAffiliate.email,
      message: `Great news! We've sent a PayPal payout of $${parseFloat(payoutAmount).toFixed(2)} to ${payoutAffiliate.paypalEmail}. Transaction ID: ${payoutTxId || "N/A"}. Thank you for being an EzPay America affiliate!`,
      service: "Affiliate Payout Notification"
    }).catch(() => {});

    setPayouts(prev => [payout, ...prev]);
    setAffiliates(prev => prev.map(a => a.id === payoutAffiliate.id ? { ...a, totalPaid: newTotalPaid } : a));
    setPayoutDialog(false);
    setPayoutAmount("");
    setPayoutTxId("");
    setPayoutNotes("");
    setPayoutLoading(false);
  };

  const addReferral = async () => {
    if (!newReferral.affiliateId || !newReferral.referredEmail) return;
    const aff = affiliates.find(a => a.id === newReferral.affiliateId);
    const ref = await base44.entities.AffiliateReferral.create({
      ...newReferral,
      affiliateCode: aff?.referralCode || "",
      commissionAmount: parseFloat(newReferral.commissionAmount) || 0,
      status: "lead",
      commissionStatus: "pending",
    });
    // Update affiliate referral count
    if (aff) {
      await base44.entities.Affiliate.update(aff.id, { totalReferrals: (aff.totalReferrals || 0) + 1 });
    }
    setReferrals(prev => [ref, ...prev]);
    setAddReferralDialog(false);
    setNewReferral({ affiliateId: "", referredName: "", referredEmail: "", referredBusiness: "", referredPhone: "", commissionAmount: "" });
  };

  const addAffiliate = async () => {
    if (!newAffiliate.firstName || !newAffiliate.lastName || !newAffiliate.email || !newAffiliate.paypalEmail) return;
    setAddAffiliateLoading(true);
    const referralCode = (newAffiliate.firstName.slice(0, 3) + newAffiliate.lastName.slice(0, 3)).toUpperCase().replace(/[^A-Z]/g, "") + Math.floor(1000 + Math.random() * 9000);
    const created = await base44.entities.Affiliate.create({
      ...newAffiliate,
      referralCode,
      status: "pending",
      commissionRate: newAffiliate.proposedCommission ? parseFloat(newAffiliate.proposedCommission) : 10,
      totalEarned: 0, totalPaid: 0, totalReferrals: 0, totalConversions: 0, totalClicks: 0,
      tier: "bronze"
    });
    setAffiliates(prev => [created, ...prev]);
    setAddAffiliateDialog(false);
    setNewAffiliate({ firstName: "", lastName: "", email: "", paypalEmail: "", phone: "", company: "", website: "", marketingStrategy: "", proposedCommission: "" });
    setAddAffiliateLoading(false);
  };

  const saveCommissionRate = async () => {
    if (!editCommissionAffiliate || editCommissionValue === "") return;
    const rate = parseFloat(editCommissionValue);
    await base44.entities.Affiliate.update(editCommissionAffiliate.id, { commissionRate: rate });
    setAffiliates(prev => prev.map(a => a.id === editCommissionAffiliate.id ? { ...a, commissionRate: rate } : a));
    setEditCommissionDialog(false);
    setEditCommissionAffiliate(null);
    setEditCommissionValue("");
  };

  const filteredAffiliates = affiliates.filter(a => {
    const matchSearch = !search || `${a.firstName} ${a.lastName} ${a.email} ${a.company}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalStats = {
    affiliates: affiliates.length,
    approved: affiliates.filter(a => a.status === "approved").length,
    totalEarned: affiliates.reduce((s, a) => s + (a.totalEarned || 0), 0),
    totalPaid: affiliates.reduce((s, a) => s + (a.totalPaid || 0), 0),
    totalReferrals: referrals.length,
    conversions: referrals.filter(r => r.status === "converted").length,
  };

  if (authUser === undefined || loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;
  if (!authUser || authUser.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <SEOHead title="Affiliate Admin" noindex={true} />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Affiliate Program Admin</h1>
            <p className="text-gray-500 mt-1">Manage affiliates, referrals, and PayPal payouts</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link to={createPageUrl("AffiliateLeaderboard")} target="_blank">
              <Button variant="outline" className="border-amber-400 text-amber-700"><Trophy className="w-4 h-4 mr-1" />Leaderboard</Button>
            </Link>
            <Button onClick={async () => { await base44.functions.invoke("validateReferral", {}); alert("Validation complete. Check referral notes for results."); loadAll(); }} variant="outline" className="border-green-400 text-green-700">
              <ShieldCheck className="w-4 h-4 mr-1" />Validate All Referrals
            </Button>
            <Button onClick={runTierUpgrades} variant="outline" className="border-purple-400 text-purple-700"><ArrowUp className="w-4 h-4 mr-1" />Run Tier Upgrades</Button>
            <Button onClick={() => setAddAffiliateDialog(true)} className="bg-amber-500 hover:bg-amber-600 text-white">+ Add Affiliate</Button>
            <Button onClick={() => setAddReferralDialog(true)} variant="outline" className="border-amber-400 text-amber-700">Add Referral</Button>
            <Button onClick={loadAll} variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Affiliates", value: totalStats.affiliates, icon: Users, color: "text-blue-600" },
            { label: "Approved", value: totalStats.approved, icon: CheckCircle2, color: "text-green-600" },
            { label: "Referrals", value: totalStats.totalReferrals, icon: TrendingUp, color: "text-purple-600" },
            { label: "Conversions", value: totalStats.conversions, icon: TrendingUp, color: "text-amber-600" },
            { label: "Total Earned", value: `$${totalStats.totalEarned.toFixed(0)}`, icon: DollarSign, color: "text-emerald-600" },
            { label: "Total Paid", value: `$${totalStats.totalPaid.toFixed(0)}`, icon: DollarSign, color: "text-green-700" },
          ].map((s, i) => (
            <Card key={i} className="border-none shadow">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-xl p-1 mb-6 flex-wrap">
          {["affiliates", "referrals", "payouts", "batch-payout", "analytics", "merchant-applications", "milestones", "link-generator", "programs", "coupons", "resources", "drip-campaigns", "email-templates", "tier-rules"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all flex items-center gap-1.5 ${activeTab === t ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}>
              {t === "analytics" && <BarChart2 className="w-3.5 h-3.5" />}
              {t === "batch-payout" && <Send className="w-3.5 h-3.5" />}
              {t === "email-templates" && <Mail className="w-3.5 h-3.5" />}
              {t === "tier-rules" && <ArrowUp className="w-3.5 h-3.5" />}
              {t === "drip-campaigns" && <Mail className="w-3.5 h-3.5" />}
              {t === "affiliates" ? `Affiliates (${affiliates.length})` :
               t === "referrals" ? `Referrals (${referrals.length})` :
               t === "payouts" ? `Payouts (${payouts.length})` :
               t === "batch-payout" ? "Batch Payout" :
               t === "email-templates" ? "Email Templates" :
               t === "tier-rules" ? "Tier Rules" :
               t === "drip-campaigns" ? "Drip Campaigns" :
               t === "merchant-applications" ? "Merchant Applications" :
               t === "milestones" ? "Milestones" :
               t === "link-generator" ? "Link Generator" :
               t === "programs" ? "Programs" :
               t === "resources" ? "Resources" :
               t === "coupons" ? "Coupons" : "Analytics"}
            </button>
          ))}
        </div>

        {/* Affiliates Tab */}
        {activeTab === "affiliates" && (
          <Card className="border-none shadow-lg">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search affiliates..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-3 font-medium">Affiliate</th>
                      <th className="pb-3 font-medium">PayPal</th>
                      <th className="pb-3 font-medium">Code</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Tier</th>
                      <th className="pb-3 font-medium">Commission %</th>
                      <th className="pb-3 font-medium">Earned</th>
                      <th className="pb-3 font-medium">Paid</th>
                      <th className="pb-3 font-medium">Refs</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAffiliates.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="py-3">
                          <p className="font-medium text-gray-900">{a.firstName} {a.lastName}</p>
                          <p className="text-xs text-gray-500">{a.email}</p>
                          {a.company && <p className="text-xs text-gray-400">{a.company}</p>}
                        </td>
                        <td className="py-3">
                          <span className="text-xs text-blue-600">{a.paypalEmail}</span>
                        </td>
                        <td className="py-3 font-mono text-xs text-amber-700 font-bold">{a.referralCode}</td>
                        <td className="py-3">
                          <Badge className={`${STATUS_BADGE[a.status]} text-xs`}>{a.status}</Badge>
                        </td>
                        <td className="py-3">
                          <Badge className={`${STATUS_BADGE[a.tier]} text-xs capitalize`}>{a.tier}</Badge>
                        </td>
                        <td className="py-3">
                          <button
                            className="text-sm font-semibold text-blue-600 hover:underline"
                            onClick={() => { setEditCommissionAffiliate(a); setEditCommissionValue(String(a.commissionRate || 10)); setEditCommissionDialog(true); }}
                          >
                            {a.commissionRate || 10}%
                          </button>
                        </td>
                        <td className="py-3 font-semibold text-green-600">${(a.totalEarned || 0).toFixed(2)}</td>
                        <td className="py-3 text-gray-600">${(a.totalPaid || 0).toFixed(2)}</td>
                        <td className="py-3 text-gray-600">{a.totalReferrals || 0}</td>
                        <td className="py-3">
                          <div className="flex gap-1 flex-wrap">
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedAffiliate(a); setDetailOpen(true); }}><Eye className="w-3 h-3" /></Button>
                            {a.status === "pending" && (
                              <>
                                <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white h-7 px-2 text-xs" onClick={() => updateAffiliateStatus(a.id, "approved")}>Approve</Button>
                                <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white h-7 px-2 text-xs" onClick={() => updateAffiliateStatus(a.id, "rejected")}>Reject</Button>
                              </>
                            )}
                            {a.status === "approved" && (
                              <>
                                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white h-7 px-2 text-xs" onClick={() => { setPayoutAffiliate(a); setPayoutDialog(true); }}>
                                  <DollarSign className="w-3 h-3 mr-1" />Pay
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 px-2 text-xs text-red-600" onClick={() => updateAffiliateStatus(a.id, "suspended")}>Suspend</Button>
                              </>
                            )}
                            {(a.status === "suspended" || a.status === "rejected") && (
                              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white h-7 px-2 text-xs" onClick={() => updateAffiliateStatus(a.id, "approved")}>Reinstate</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAffiliates.length === 0 && <p className="text-center text-gray-400 py-8">No affiliates found.</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Referrals Tab */}
        {activeTab === "referrals" && (
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-3 font-medium">Referred Business</th>
                      <th className="pb-3 font-medium">Affiliate</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Commission</th>
                      <th className="pb-3 font-medium">Pmt Status</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {referrals.map(r => {
                      const aff = affiliates.find(a => a.id === r.affiliateId);
                      return (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="py-3">
                            <p className="font-medium text-gray-900">{r.referredBusiness || "–"}</p>
                            <p className="text-xs text-gray-500">{r.referredEmail}</p>
                          </td>
                          <td className="py-3 text-gray-600 text-xs">{aff ? `${aff.firstName} ${aff.lastName}` : r.affiliateCode}</td>
                          <td className="py-3">
                            <Select value={r.status} onValueChange={v => updateReferralStatus(r.id, v, null)}>
                              <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["lead", "applied", "approved", "processing", "converted", "rejected"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 font-semibold text-green-600">${r.commissionAmount || 0}</td>
                          <td className="py-3">
                            <Select value={r.commissionStatus} onValueChange={v => updateReferralStatus(r.id, r.status, v)}>
                              <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {["pending", "approved", "paid", "cancelled"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 text-xs text-gray-500">{new Date(r.created_date).toLocaleDateString()}</td>
                          <td className="py-3">
                            {r.status === "converted" && r.commissionStatus === "pending" && (
                              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white h-7 px-2 text-xs"
                                onClick={() => updateReferralStatus(r.id, "converted", "approved")}>
                                Approve Commission
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {referrals.length === 0 && <p className="text-center text-gray-400 py-8">No referrals yet.</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payouts Tab */}
        {activeTab === "payouts" && (
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="pb-3 font-medium">Affiliate</th>
                      <th className="pb-3 font-medium">PayPal Email</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Transaction ID</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payouts.map(p => (
                      <tr key={p.id}>
                        <td className="py-3">
                          <p className="font-medium text-gray-900">{p.affiliateName}</p>
                          <p className="text-xs text-gray-500">{p.affiliateEmail}</p>
                        </td>
                        <td className="py-3 text-blue-600 text-xs">{p.paypalEmail}</td>
                        <td className="py-3 font-bold text-green-600">${p.amount.toFixed(2)}</td>
                        <td className="py-3">
                          <Badge className={`${p.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} text-xs`}>{p.status}</Badge>
                        </td>
                        <td className="py-3 text-xs font-mono text-gray-600">{p.paypalTransactionId || "–"}</td>
                        <td className="py-3 text-xs text-gray-500">{p.paidDate ? new Date(p.paidDate).toLocaleDateString() : new Date(p.created_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payouts.length === 0 && <p className="text-center text-gray-400 py-8">No payouts recorded yet.</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Batch Payout Tab */}
        {activeTab === "batch-payout" && (
          <BatchPayoutPanel
            affiliates={affiliates}
            referrals={referrals}
            payouts={payouts}
            onPayoutsUpdated={loadAll}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <AffiliateAnalytics
            affiliates={affiliates}
            referrals={referrals}
            payouts={payouts}
          />
        )}

        {/* Merchant Applications Tab */}
        {activeTab === "merchant-applications" && (
          <MerchantApplicationsAnalytics affiliates={affiliates} />
        )}

        {/* Milestones Tab */}
        {activeTab === "milestones" && (
          <AffiliateMilestones affiliates={affiliates} />
        )}

        {/* Link Generator Tab */}
        {activeTab === "link-generator" && (
          <ReferralLinkGenerator affiliates={affiliates} />
        )}

        {/* Email Templates Tab */}
        {activeTab === "email-templates" && (
          <EmailTemplateManager />
        )}

        {/* Tier Rules Tab */}
        {activeTab === "tier-rules" && (
          <CommissionTierManager />
        )}

        {/* Programs Tab */}
        {activeTab === "programs" && <ProgramManager />}

        {/* Resources Tab */}
        {activeTab === "resources" && <ResourceManager />}

        {/* Coupons Tab */}
        {activeTab === "coupons" && <CouponManager affiliates={affiliates} />}

        {/* Drip Campaigns Tab */}
        {activeTab === "drip-campaigns" && (
          <DripCampaignManager affiliates={affiliates} />
        )}
      </div>

      {/* Affiliate Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Affiliate Details</DialogTitle></DialogHeader>
          {selectedAffiliate && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Name", `${selectedAffiliate.firstName} ${selectedAffiliate.lastName}`],
                  ["Email", selectedAffiliate.email],
                  ["Phone", selectedAffiliate.phone || "–"],
                  ["Company", selectedAffiliate.company || "–"],
                  ["Website", selectedAffiliate.website || "–"],
                  ["PayPal", selectedAffiliate.paypalEmail],
                  ["Referral Code", selectedAffiliate.referralCode],
                  ["Tier", selectedAffiliate.tier],
                  ["Total Earned", `$${(selectedAffiliate.totalEarned || 0).toFixed(2)}`],
                  ["Total Paid", `$${(selectedAffiliate.totalPaid || 0).toFixed(2)}`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
              {selectedAffiliate.marketingStrategy && (
                <div>
                  <p className="text-gray-500 text-xs mb-1">Marketing Strategy</p>
                  <p className="bg-gray-50 p-3 rounded-lg text-gray-700">{selectedAffiliate.marketingStrategy}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {selectedAffiliate.status === "pending" && (
                  <>
                    <Button className="bg-green-500 hover:bg-green-600 text-white flex-1" onClick={() => { updateAffiliateStatus(selectedAffiliate.id, "approved"); setDetailOpen(false); }}>Approve</Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white flex-1" onClick={() => { updateAffiliateStatus(selectedAffiliate.id, "rejected"); setDetailOpen(false); }}>Reject</Button>
                  </>
                )}
                {selectedAffiliate.status === "approved" && (
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white flex-1" onClick={() => { setPayoutAffiliate(selectedAffiliate); setDetailOpen(false); setPayoutDialog(true); }}>
                    <DollarSign className="w-4 h-4 mr-2" />Send PayPal Payout
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payout Dialog */}
      <Dialog open={payoutDialog} onOpenChange={setPayoutDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Send PayPal Payout</DialogTitle></DialogHeader>
          {payoutAffiliate && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="font-semibold text-gray-900">{payoutAffiliate.firstName} {payoutAffiliate.lastName}</p>
                <p className="text-sm text-blue-700 flex items-center gap-1 mt-1">
                  <ExternalLink className="w-3 h-3" /> PayPal: {payoutAffiliate.paypalEmail}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Payout Amount ($)</label>
                <Input type="number" placeholder="0.00" value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)} className="h-12 text-lg font-bold" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">PayPal Transaction ID (after sending)</label>
                <Input placeholder="e.g. 5YE95038BA831765L" value={payoutTxId} onChange={e => setPayoutTxId(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Notes (optional)</label>
                <Textarea placeholder="Payment for Q1 referrals..." rows={2} value={payoutNotes} onChange={e => setPayoutNotes(e.target.value)} />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                ⚠️ <strong>Send the payment in PayPal first</strong>, then record the transaction ID here. This will notify the affiliate and log the payout.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setPayoutDialog(false)}>Cancel</Button>
                <a href={`https://www.paypal.com/myaccount/transfer/homepage/pay`} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full border-blue-400 text-blue-700">Open PayPal <ExternalLink className="w-3 h-3 ml-1" /></Button>
                </a>
                <Button disabled={!payoutAmount || payoutLoading} onClick={processPayout} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                  {payoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4 mr-1" />Record Payout</>}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Affiliate Dialog */}
      <Dialog open={addAffiliateDialog} onOpenChange={setAddAffiliateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add New Affiliate</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First Name *" value={newAffiliate.firstName} onChange={e => setNewAffiliate({...newAffiliate, firstName: e.target.value})} />
              <Input placeholder="Last Name *" value={newAffiliate.lastName} onChange={e => setNewAffiliate({...newAffiliate, lastName: e.target.value})} />
            </div>
            <Input type="email" placeholder="Email Address *" value={newAffiliate.email} onChange={e => setNewAffiliate({...newAffiliate, email: e.target.value})} />
            <Input type="email" placeholder="PayPal Email (for payouts) *" value={newAffiliate.paypalEmail} onChange={e => setNewAffiliate({...newAffiliate, paypalEmail: e.target.value})} />
            <Input type="tel" placeholder="Phone Number" value={newAffiliate.phone} onChange={e => setNewAffiliate({...newAffiliate, phone: e.target.value})} />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Company (optional)" value={newAffiliate.company} onChange={e => setNewAffiliate({...newAffiliate, company: e.target.value})} />
              <Input placeholder="Website (optional)" value={newAffiliate.website} onChange={e => setNewAffiliate({...newAffiliate, website: e.target.value})} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Proposed Commission Rate (%)</label>
              <Input type="number" placeholder="e.g. 10" min="1" max="100" value={newAffiliate.proposedCommission} onChange={e => setNewAffiliate({...newAffiliate, proposedCommission: e.target.value})} />
              <p className="text-xs text-gray-400 mt-1">Default is 10% if left blank</p>
            </div>
            <Textarea placeholder="Marketing strategy / notes (optional)" rows={2} value={newAffiliate.marketingStrategy} onChange={e => setNewAffiliate({...newAffiliate, marketingStrategy: e.target.value})} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setAddAffiliateDialog(false)}>Cancel</Button>
              <Button disabled={!newAffiliate.firstName || !newAffiliate.lastName || !newAffiliate.email || !newAffiliate.paypalEmail || addAffiliateLoading} onClick={addAffiliate} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                {addAffiliateLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Affiliate"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Commission Rate Dialog */}
      <Dialog open={editCommissionDialog} onOpenChange={setEditCommissionDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Edit Commission Rate</DialogTitle></DialogHeader>
          {editCommissionAffiliate && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Setting commission rate for <strong>{editCommissionAffiliate.firstName} {editCommissionAffiliate.lastName}</strong></p>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Commission Rate (%)</label>
                <Input type="number" min="1" max="100" value={editCommissionValue} onChange={e => setEditCommissionValue(e.target.value)} className="h-12 text-lg font-bold" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditCommissionDialog(false)}>Cancel</Button>
                <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={saveCommissionRate}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Referral Dialog */}
      <Dialog open={addReferralDialog} onOpenChange={setAddReferralDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Referral Manually</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Affiliate *</label>
              <Select value={newReferral.affiliateId} onValueChange={v => setNewReferral({...newReferral, affiliateId: v})}>
                <SelectTrigger><SelectValue placeholder="Select affiliate" /></SelectTrigger>
                <SelectContent>
                  {affiliates.filter(a => a.status === "approved").map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.firstName} {a.lastName} ({a.referralCode})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Contact Name" value={newReferral.referredName} onChange={e => setNewReferral({...newReferral, referredName: e.target.value})} />
              <Input placeholder="Business Name" value={newReferral.referredBusiness} onChange={e => setNewReferral({...newReferral, referredBusiness: e.target.value})} />
            </div>
            <Input type="email" placeholder="Email *" value={newReferral.referredEmail} onChange={e => setNewReferral({...newReferral, referredEmail: e.target.value})} />
            <Input placeholder="Phone" value={newReferral.referredPhone} onChange={e => setNewReferral({...newReferral, referredPhone: e.target.value})} />
            <Input type="number" placeholder="Commission Amount ($)" value={newReferral.commissionAmount} onChange={e => setNewReferral({...newReferral, commissionAmount: e.target.value})} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setAddReferralDialog(false)}>Cancel</Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={addReferral}>Add Referral</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}