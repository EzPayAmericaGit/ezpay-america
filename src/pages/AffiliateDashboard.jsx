import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, Copy, CheckCircle2, Clock, ExternalLink, Link2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  suspended: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
  lead: "bg-blue-100 text-blue-800",
  applied: "bg-purple-100 text-purple-800",
  converted: "bg-green-100 text-green-800",
  processing: "bg-amber-100 text-amber-800",
};

const TIER_COLORS = {
  bronze: "from-amber-700 to-amber-600",
  silver: "from-gray-400 to-gray-500",
  gold: "from-yellow-500 to-amber-500",
  platinum: "from-purple-600 to-indigo-600",
};

export default function AffiliateDashboard() {
  const [affiliate, setAffiliate] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Check if we have a saved affiliate session
    const saved = localStorage.getItem("affiliate_email");
    if (saved) fetchAffiliate(saved);
    else setLoading(false);
  }, []);

  const fetchAffiliate = async (email) => {
    setLoading(true);
    const results = await base44.entities.Affiliate.filter({ email });
    if (results.length > 0) {
      const aff = results[0];
      setAffiliate(aff);
      localStorage.setItem("affiliate_email", email);
      const refs = await base44.entities.AffiliateReferral.filter({ affiliateId: aff.id });
      setReferrals(refs);
      const pays = await base44.entities.AffiliatePayout.filter({ affiliateId: aff.id });
      setPayouts(pays);
    } else {
      setLoginError("No affiliate account found with that email. Please check your email or apply first.");
      localStorage.removeItem("affiliate_email");
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    setLoginError("");
    setLoginLoading(true);
    await fetchAffiliate(loginEmail.toLowerCase().trim());
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("affiliate_email");
    setAffiliate(null);
    setReferrals([]);
    setPayouts([]);
  };

  const referralLink = affiliate ? `${window.location.origin}/?ref=${affiliate.referralCode}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pendingEarnings = referrals.filter(r => r.commissionStatus === "pending").reduce((s, r) => s + (r.commissionAmount || 0), 0);
  const approvedEarnings = referrals.filter(r => r.commissionStatus === "approved").reduce((s, r) => s + (r.commissionAmount || 0), 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-10 h-10 animate-spin text-amber-500" />
    </div>
  );

  if (!affiliate) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Affiliate Portal</h1>
          <p className="text-gray-400 mt-2">Enter your email to access your dashboard</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input type="email" placeholder="your@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="h-12" />
            </div>
            {loginError && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}
            <Button type="submit" disabled={loginLoading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white h-12 font-bold">
              {loginLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Loading...</> : "Access My Dashboard"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Not an affiliate yet?{" "}
            <Link to={createPageUrl("AffiliateSignup")} className="text-amber-600 font-semibold hover:underline">Apply here →</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const tabs = ["overview", "referrals", "payouts", "leaderboard", "settings"];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Affiliate Dashboard - EzPay America" description="Manage your affiliate referrals and track commissions." />

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${TIER_COLORS[affiliate.tier]} flex items-center justify-center text-xl`}>
              {affiliate.tier === "bronze" ? "🥉" : affiliate.tier === "silver" ? "🥈" : affiliate.tier === "gold" ? "🥇" : "💎"}
            </div>
            <div>
              <h1 className="text-xl font-bold">{affiliate.firstName} {affiliate.lastName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${affiliate.status === "approved" ? "bg-green-500" : affiliate.status === "pending" ? "bg-yellow-500" : "bg-red-500"} text-white border-0`}>
                  {affiliate.status?.toUpperCase()}
                </Badge>
                <span className="text-gray-400 text-sm capitalize">{affiliate.tier} Tier</span>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm transition-colors">Sign Out</button>
        </div>
      </div>

      {affiliate.status !== "approved" && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-yellow-800">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm"><strong>Your account is pending review.</strong> You'll receive an email once approved. Most applications reviewed within 24–48 hours.</p>
          </div>
        </div>
      )}

      {/* Referral Link Bar */}
      {affiliate.status === "approved" && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-4">
          <div className="max-w-7xl mx-auto space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Link2 className="w-4 h-4 text-amber-600" /> Your Unique Referral Link</p>
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="bg-white font-mono text-sm" />
                <Button onClick={copyLink} variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-100 whitespace-nowrap">
                  {copied ? <><CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />Copied!</> : <><Copy className="w-4 h-4 mr-1" />Copy Link</>}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Share this link. Anyone who applies using this link will be tracked as your referral.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to={`${createPageUrl("AffiliateReferralPortal")}?code=${affiliate.referralCode}`}>
                <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white text-xs gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Submit a Referral Directly →
                </Button>
              </Link>
              <p className="text-xs text-gray-500">Know a business? Submit their info and we'll handle the rest.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-200 rounded-xl p-1 mb-8 w-fit">
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === t ? "bg-white shadow text-gray-900" : "text-gray-600 hover:text-gray-900"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Earned", value: `$${(affiliate.totalEarned || 0).toFixed(2)}`, icon: DollarSign, color: "from-green-500 to-emerald-600" },
                { label: "Pending Earnings", value: `$${pendingEarnings.toFixed(2)}`, icon: Clock, color: "from-yellow-500 to-amber-500" },
                { label: "Total Referrals", value: affiliate.totalReferrals || 0, icon: Users, color: "from-blue-500 to-cyan-600" },
                { label: "Conversions", value: affiliate.totalConversions || 0, icon: TrendingUp, color: "from-purple-500 to-violet-600" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Tier Progress */}
            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-r ${TIER_COLORS[affiliate.tier]} p-6`}>
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <p className="text-white/80 text-sm">Your Current Tier</p>
                      <h3 className="text-2xl font-black uppercase tracking-wide mt-1">
                        {affiliate.tier === "bronze" ? "🥉" : affiliate.tier === "silver" ? "🥈" : affiliate.tier === "gold" ? "🥇" : "💎"} {affiliate.tier}
                      </h3>
                      <p className="text-white/80 text-sm mt-1">Commission Rate: <strong className="text-white">{affiliate.commissionRate || 10}%</strong></p>
                    </div>
                    <div className="text-right text-sm text-white/80">
                      {affiliate.tier === "bronze" && <><p>5 conversions → Silver</p><p className="text-white font-bold">{affiliate.totalConversions || 0} / 5</p></>}
                      {affiliate.tier === "silver" && <><p>10 conversions → Gold</p><p className="text-white font-bold">{affiliate.totalConversions || 0} / 10</p></>}
                      {affiliate.tier === "gold" && <><p>20 conversions → Platinum</p><p className="text-white font-bold">{affiliate.totalConversions || 0} / 20</p></>}
                      {affiliate.tier === "platinum" && <p className="text-white font-bold">Max Tier Reached! 💎</p>}
                    </div>
                  </div>
                  {affiliate.tier !== "platinum" && (
                    <div className="mt-4">
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full transition-all" style={{
                          width: `${Math.min(100, ((affiliate.totalConversions || 0) / (affiliate.tier === "bronze" ? 5 : affiliate.tier === "silver" ? 10 : 20)) * 100)}%`
                        }} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 divide-x divide-gray-100 bg-white">
                  {[
                    { tier: "Bronze", min: 0, rate: "10%", emoji: "🥉" },
                    { tier: "Silver", min: 5, rate: "12%", emoji: "🥈" },
                    { tier: "Gold", min: 10, rate: "15%", emoji: "🥇" },
                    { tier: "Platinum", min: 20, rate: "20%", emoji: "💎" },
                  ].map(t => (
                    <div key={t.tier} className={`p-3 text-center ${affiliate.tier === t.tier.toLowerCase() ? "bg-amber-50" : ""}`}>
                      <p className="text-lg">{t.emoji}</p>
                      <p className={`text-xs font-semibold ${affiliate.tier === t.tier.toLowerCase() ? "text-amber-700" : "text-gray-500"}`}>{t.tier}</p>
                      <p className="text-xs text-gray-400">{t.rate}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Commission info */}
            <Card className="border-none shadow-lg">
              <CardHeader><CardTitle>Your Commission Details</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Commission Rate</p>
                  <p className="text-3xl font-bold text-amber-600 mt-1">{affiliate.commissionRate || 10}%</p>
                  <p className="text-xs text-gray-400 mt-1">of referred merchant revenue</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Total Paid Out</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">${(affiliate.totalPaid || 0).toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">sent to your PayPal</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">Available for Payout</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">${approvedEarnings.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 mt-1">approved commissions</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent referrals */}
            {referrals.length > 0 && (
              <Card className="border-none shadow-lg">
                <CardHeader><CardTitle>Recent Referrals</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {referrals.slice(0, 5).map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{r.referredBusiness || r.referredName || "Unknown"}</p>
                          <p className="text-xs text-gray-500">{r.referredEmail} • {new Date(r.created_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-700"} text-xs`}>{r.status}</Badge>
                          {r.commissionAmount > 0 && <p className="text-sm font-semibold text-green-600 mt-1">${r.commissionAmount}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  {referrals.length > 5 && (
                    <button onClick={() => setActiveTab("referrals")} className="text-amber-600 text-sm mt-3 hover:underline">View all {referrals.length} referrals →</button>
                  )}
                </CardContent>
              </Card>
            )}

            {referrals.length === 0 && affiliate.status === "approved" && (
              <Card className="border-none shadow-lg border-dashed border-2 border-gray-200">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No referrals yet</h3>
                  <p className="text-gray-500 mb-4">Share your referral link to start earning commissions!</p>
                  <Button onClick={copyLink} className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Copy className="w-4 h-4 mr-2" /> Copy My Referral Link
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === "referrals" && (
          <Card className="border-none shadow-lg">
            <CardHeader><CardTitle>All Referrals ({referrals.length})</CardTitle></CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No referrals yet. Share your link to get started!</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-gray-500">
                        <th className="pb-3 font-medium">Business</th>
                        <th className="pb-3 font-medium">Contact</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Commission</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {referrals.map(r => (
                        <tr key={r.id}>
                          <td className="py-3 font-medium text-gray-900">{r.referredBusiness || "–"}</td>
                          <td className="py-3 text-gray-500">{r.referredEmail}</td>
                          <td className="py-3"><Badge className={`${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-700"} text-xs`}>{r.status}</Badge></td>
                          <td className="py-3">
                            {r.commissionAmount > 0 ? (
                              <span className="font-semibold text-green-600">${r.commissionAmount}</span>
                            ) : <span className="text-gray-400">Pending</span>}
                          </td>
                          <td className="py-3 text-gray-500">{new Date(r.created_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payouts Tab */}
        {activeTab === "payouts" && (
          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader><CardTitle>Payout History</CardTitle></CardHeader>
              <CardContent>
                {payouts.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No payouts yet. Commissions are paid out once referrals are approved.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payouts.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-semibold text-gray-900">${p.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">PayPal: {p.paypalEmail}</p>
                          {p.paypalTransactionId && <p className="text-xs text-blue-500">TX: {p.paypalTransactionId}</p>}
                        </div>
                        <div className="text-right">
                          <Badge className={`${p.status === "completed" ? "bg-green-100 text-green-800" : p.status === "processing" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"} text-xs`}>
                            {p.status}
                          </Badge>
                          {p.paidDate && <p className="text-xs text-gray-400 mt-1">{new Date(p.paidDate).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p><strong>💡 Payout Policy:</strong> Commissions are approved once referred merchants complete their first 30 days of processing. Payouts are sent to your PayPal within 30 days of approval. Minimum payout is $50.</p>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="space-y-4">
            <Card className="border-none shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white text-center">
                  <p className="text-4xl mb-2">🏆</p>
                  <h2 className="text-xl font-bold mb-1">Affiliate Leaderboard</h2>
                  <p className="text-gray-400 text-sm">See how you rank among all EzPay affiliates</p>
                </div>
              </CardContent>
            </Card>
            <div className="text-center">
              <Link to={createPageUrl("AffiliateLeaderboard")} target="_blank">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-3 text-base font-bold">
                  View Full Leaderboard →
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <Card className="border-none shadow-lg">
            <CardHeader><CardTitle>Account Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-900">{affiliate.firstName} {affiliate.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-900">{affiliate.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">PayPal Payout Email</label>
                  <p className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-900 flex items-center gap-2">
                    {affiliate.paypalEmail}
                    <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer" className="text-blue-500"><ExternalLink className="w-4 h-4" /></a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Referral Code</label>
                  <p className="mt-1 p-3 bg-amber-50 rounded-lg text-amber-700 font-bold tracking-wider">{affiliate.referralCode}</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">To update your PayPal email or other account details, please contact <a href="mailto:mail@ezpayamerica.com" className="text-amber-600 underline">mail@ezpayamerica.com</a></p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}