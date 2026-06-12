import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import SEOHead from "../components/SEOHead";
import { CheckCircle2, DollarSign, Users, TrendingUp, ArrowRight, Loader2, ExternalLink, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const benefits = [
  { icon: DollarSign, title: "$100–$500 Per Merchant", desc: "Earn a commission for every merchant that signs up through your unique referral link and gets approved." },
  { icon: TrendingUp, title: "Recurring Residuals", desc: "Top affiliates earn ongoing monthly residuals as long as your referred merchants keep processing." },
  { icon: Users, title: "Real-Time Dashboard", desc: "Track clicks, leads, conversions, and earnings in real-time from your personal affiliate dashboard." },
];

function generateCode(firstName, lastName) {
  const base = (firstName.slice(0, 3) + lastName.slice(0, 3)).toUpperCase().replace(/[^A-Z]/g, "");
  return base + Math.floor(1000 + Math.random() * 9000);
}

export default function AffiliateSignup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [affiliate, setAffiliate] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", paypalEmail: "",
    company: "", website: "", phone: "", marketingStrategy: ""
  });
  const [errors, setErrors] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = "Required";
    if (!form.lastName) e.lastName = "Required";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.paypalEmail)) e.paypalEmail = "Valid PayPal email required";
    if (!form.phone) e.phone = "Required";
    if (!form.marketingStrategy) e.marketingStrategy = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
      setLoginError("Please enter a valid email address.");
      return;
    }
    setLoginLoading(true);
    try {
      const results = await base44.entities.Affiliate.filter({ email: loginEmail });
      if (!results || results.length === 0) {
        setLoginError("No affiliate account found with that email. Please sign up or check your email address.");
      } else {
        const aff = results[0];
        localStorage.setItem("affiliate_email", loginEmail);
        localStorage.setItem("affiliate_id", aff.id);
        navigate(createPageUrl("AffiliateDashboard"));
      }
    } catch (err) {
      setLoginError("Unable to look up your account. Please try again.");
    }
    setLoginLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const referralCode = generateCode(form.firstName, form.lastName);
      const res = await base44.functions.invoke("createAffiliateApplication", {
        ...form,
        referralCode,
      });
      const data = res.data;
      if (data.error) throw new Error(data.error);
      setAffiliate(data.affiliate);
      setStep(2);
    } catch (err) {
      console.error("Affiliate signup error:", err);
      alert(err.message || "Unable to submit application. Please check your connection and try again.");
    }
    setLoading(false);
  };

  if (step === 2 && affiliate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-20 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Application Submitted!</h1>
          <p className="text-gray-300 mb-6">Your application is under review. You'll hear from us within 24–48 hours. Once approved, you'll receive login credentials.</p>
          <div className="bg-white/10 rounded-2xl p-6 mb-6 text-left space-y-3">
            <div className="flex justify-between"><span className="text-gray-400">Your Referral Code</span><span className="text-amber-400 font-bold text-xl">{affiliate.referralCode}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">PayPal Payout Address</span><span className="text-white">{form.paypalEmail}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-yellow-400 font-semibold">Pending Review</span></div>
          </div>
          <Link to={createPageUrl("AffiliateDashboard")}>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full h-12 text-lg">
              Go to My Dashboard <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Affiliate Program - Earn Money Referring Merchants | EzPay America"
        description="Join EzPay America's affiliate program and earn $100–$500 per merchant referral. Get paid via PayPal. Track earnings in real-time. No experience needed."
        keywords="affiliate program, merchant referral program, earn money referring businesses, payment processing affiliate, EzPay America affiliate"
      />

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="inline-block bg-gray-900 text-amber-400 text-sm font-bold px-4 py-2 rounded-full mb-4">AFFILIATE PROGRAM</span>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Earn <span className="text-gray-800">$100–$500</span> Per Referral</h1>
              <p className="text-xl text-gray-800 mb-8">Refer businesses to EzPay America and get paid via PayPal when they're approved. The most generous affiliate commissions in the payments industry.</p>
              <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-900">
                {["PayPal Payouts", "Real-Time Tracking", "No Cap on Earnings", "Free to Join"].map(f => (
                  <span key={f} className="flex items-center gap-1 bg-white/60 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-700" />{f}</span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                {/* Tab toggle */}
                <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
                  <button type="button" onClick={() => setShowLogin(false)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!showLogin ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                    Apply to Join
                  </button>
                  <button type="button" onClick={() => setShowLogin(true)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${showLogin ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                    <LogIn className="w-4 h-4" /> Affiliate Login
                  </button>
                </div>

                {showLogin ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
                      <p className="text-gray-500 text-sm mb-5">Enter your affiliate email to access your dashboard.</p>
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your affiliate email address"
                        value={loginEmail}
                        onChange={e => { setLoginEmail(e.target.value); setLoginError(""); }}
                        className={loginError ? "border-red-500" : ""}
                      />
                      {loginError && <p className="text-red-500 text-xs mt-1">{loginError}</p>}
                    </div>
                    <Button type="submit" disabled={loginLoading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-12 text-base font-bold">
                      {loginLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Looking up...</> : <><LogIn className="w-4 h-4 mr-2" />Go to My Dashboard</>}
                    </Button>
                    <p className="text-xs text-center text-gray-400">New affiliate? Switch to "Apply to Join" above.</p>
                  </form>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Apply to Join</h2>
                    <p className="text-gray-500 text-sm mb-2">Free to join. Approval within 24–48 hours.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input placeholder="First Name *" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className={errors.firstName ? "border-red-500" : ""} />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Input placeholder="Last Name *" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className={errors.lastName ? "border-red-500" : ""} />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <Input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={errors.email ? "border-red-500" : ""} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Input placeholder="Phone Number *" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={errors.phone ? "border-red-500" : ""} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Input type="email" placeholder="PayPal Email Address * (for payouts)" value={form.paypalEmail} onChange={e => setForm({...form, paypalEmail: e.target.value})} className={`${errors.paypalEmail ? "border-red-500" : ""} border-amber-300 focus:border-amber-500`} />
                    {errors.paypalEmail && <p className="text-red-500 text-xs mt-1">{errors.paypalEmail}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Don't have PayPal?{" "}
                      <a href="https://www.paypal.com/us/webapps/mpp/account-selection" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-0.5">
                        Create a free PayPal account <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Company (optional)" value={form.company} onChange={e => setForm({...form, company: e.target.value})} />
                    <Input placeholder="Website / Social (optional)" value={form.website} onChange={e => setForm({...form, website: e.target.value})} />
                  </div>
                  <div>
                    <Textarea placeholder="How do you plan to promote EzPay America? (social media, blog, networking, etc.) *" rows={3} value={form.marketingStrategy} onChange={e => setForm({...form, marketingStrategy: e.target.value})} className={errors.marketingStrategy ? "border-red-500" : ""} />
                    {errors.marketingStrategy && <p className="text-red-500 text-xs mt-1">{errors.marketingStrategy}</p>}
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-12 text-base font-bold">
                    {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Apply Now — It's Free"}
                  </Button>
                  <p className="text-xs text-center text-gray-400">By applying, you agree to our affiliate terms. Payouts sent via PayPal within 30 days of approval.</p>
                </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">Why Join Our Affiliate Program?</h2>
            <p className="text-gray-400 text-xl">The most rewarding referral program in payment processing</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:border-amber-500/50 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <b.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{b.title}</h3>
                <p className="text-gray-400">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 text-xl">Start earning in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: "1", t: "Sign Up Free", d: "Apply above, get approved within 24–48 hours, and receive your unique referral link." },
              { n: "2", t: "Share Your Link", d: "Share your referral link via social media, email, blog, website, or in-person networking." },
              { n: "3", t: "Get Paid via PayPal", d: "When your referral gets approved as a merchant, we send your commission directly to your PayPal." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">{s.n}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.t}</h3>
                <p className="text-gray-500">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission tiers */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Commission Structure</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { tier: "Bronze", referrals: "1–4", commission: "$100", color: "from-amber-700 to-amber-600", badge: "🥉" },
              { tier: "Silver", referrals: "5–9", commission: "$150", color: "from-gray-400 to-gray-500", badge: "🥈" },
              { tier: "Gold", referrals: "10–19", commission: "$250", color: "from-yellow-500 to-amber-500", badge: "🥇" },
              { tier: "Platinum", referrals: "20+", commission: "$500+", color: "from-purple-600 to-indigo-600", badge: "💎" },
            ].map((t, i) => (
              <div key={i} className={`bg-gradient-to-br ${t.color} rounded-2xl p-6 text-white text-center shadow-xl`}>
                <div className="text-4xl mb-2">{t.badge}</div>
                <h3 className="text-xl font-bold mb-1">{t.tier}</h3>
                <p className="text-white/80 text-sm mb-3">{t.referrals} referrals</p>
                <p className="text-3xl font-black">{t.commission}</p>
                <p className="text-white/70 text-xs mt-1">per conversion</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 mt-6 text-sm">* Top affiliates also earn ongoing monthly residuals. Contact us for details.</p>
        </div>
      </section>
    </div>
  );
}