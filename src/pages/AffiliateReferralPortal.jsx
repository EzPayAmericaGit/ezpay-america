import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2, Users, DollarSign, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const BUSINESS_TYPES = [
  "Restaurant", "Retail Store", "Hair Salon / Barber", "Nail Salon / Spa",
  "Medical / Dental Office", "Auto Services", "Fitness / Gym", "Food Truck",
  "E-Commerce", "Professional Services", "Home Services", "Other"
];

export default function AffiliateReferralPortal() {
  const [form, setForm] = useState({
    referralCode: "",
    referredBusiness: "",
    referredName: "",
    referredEmail: "",
    referredPhone: "",
    businessType: "",
    monthlyVolume: "",
    notes: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [affiliate, setAffiliate] = useState(null);
  const [codeChecking, setCodeChecking] = useState(false);
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("ref") || params.get("code");
    if (code) {
      setForm(f => ({ ...f, referralCode: code.toUpperCase() }));
      lookupCode(code.toUpperCase());
    }
  }, []);

  const lookupCode = async (code) => {
    if (!code || code.length < 4) return;
    setCodeChecking(true);
    setCodeError("");
    setAffiliate(null);
    const results = await base44.entities.Affiliate.filter({ referralCode: code, status: "approved" });
    if (results.length > 0) {
      setAffiliate(results[0]);
    } else {
      setCodeError("Referral code not found or not active.");
    }
    setCodeChecking(false);
  };

  const validate = () => {
    const e = {};
    if (!form.referralCode) e.referralCode = "Required";
    else if (!affiliate) e.referralCode = "Invalid or inactive referral code";
    if (!form.referredBusiness) e.referredBusiness = "Required";
    if (!form.referredName) e.referredName = "Required";
    if (!form.referredEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.referredEmail)) e.referredEmail = "Valid email required";
    if (!form.referredPhone) e.referredPhone = "Required";
    if (!form.businessType) e.businessType = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Create the referral record
    await base44.entities.AffiliateReferral.create({
      affiliateId: affiliate.id,
      affiliateCode: form.referralCode,
      referredBusiness: form.referredBusiness,
      referredName: form.referredName,
      referredEmail: form.referredEmail.toLowerCase(),
      referredPhone: form.referredPhone,
      status: "lead",
      commissionAmount: 0,
      commissionStatus: "pending",
      source: "referral_portal",
      monthlyVolume: form.monthlyVolume ? parseFloat(form.monthlyVolume) : undefined,
      notes: form.notes || undefined,
    });

    // Update affiliate's referral count
    await base44.entities.Affiliate.update(affiliate.id, {
      totalReferrals: (affiliate.totalReferrals || 0) + 1
    });

    // Trigger drip emails to the referred lead
    base44.functions.invoke("startAffiliateDrip", {
      leadEmail: form.referredEmail.toLowerCase(),
      leadName: form.referredName,
      businessName: form.referredBusiness,
      businessType: form.businessType,
      affiliateName: `${affiliate.firstName} ${affiliate.lastName}`,
      affiliateCode: form.referralCode,
    }).catch(() => {});

    // Notify admin
    base44.functions.invoke("sendContactEmail", {
      name: form.referredName,
      email: form.referredEmail,
      phone: form.referredPhone,
      message: `New Affiliate Referral!\nBusiness: ${form.referredBusiness}\nType: ${form.businessType}\nMonthly Volume: ${form.monthlyVolume || "N/A"}\nReferred by: ${affiliate.firstName} ${affiliate.lastName} (${form.referralCode})\nNotes: ${form.notes || "None"}`,
      service: "Affiliate Referral Submission"
    }).catch(() => {});

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-20 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Referral Submitted!</h1>
          <p className="text-gray-300 mb-6">
            We've received your referral for <strong className="text-white">{form.referredBusiness}</strong>. Our team will reach out to them shortly. You'll be notified when they convert!
          </p>
          <div className="bg-white/10 rounded-2xl p-6 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Referred Business</span>
              <span className="text-white font-semibold">{form.referredBusiness}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Contact</span>
              <span className="text-white">{form.referredName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Referred By</span>
              <span className="text-amber-400 font-semibold">{affiliate?.firstName} {affiliate?.lastName}</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => { setSubmitted(false); setForm(f => ({ ...f, referredBusiness: "", referredName: "", referredEmail: "", referredPhone: "", businessType: "", monthlyVolume: "", notes: "" })); }}
              className="bg-amber-500 hover:bg-amber-600 text-white w-full h-12">
              Submit Another Referral <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to={createPageUrl("AffiliateDashboard")}>
              <Button variant="outline" className="w-full h-12 border-white/20 text-white hover:bg-white/10">
                Go to My Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Submit a Referral | EzPay America Affiliate Portal"
        description="Refer a business to EzPay America and earn commissions. Submit your referral through our affiliate portal."
        keywords="EzPay affiliate referral, refer a business, payment processing referral"
      />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-bold px-4 py-2 rounded-full mb-4">AFFILIATE REFERRAL PORTAL</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Refer a Business, Get Paid</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Submit your referral below. We'll reach out to them, handle everything, and send your commission once they're approved.</p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-400">
            {[
              { icon: DollarSign, text: "$100–$500 per conversion" },
              { icon: Users, text: "We handle the sales process" },
              { icon: CheckCircle2, text: "PayPal payouts within 30 days" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-amber-500" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Referral Details</h2>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Referral Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Your Referral Code *</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. JOH1234"
                    value={form.referralCode}
                    onChange={e => setForm({ ...form, referralCode: e.target.value.toUpperCase() })}
                    className={`font-mono tracking-widest ${errors.referralCode ? "border-red-500" : affiliate ? "border-green-500" : ""}`}
                  />
                  <Button type="button" variant="outline" onClick={() => lookupCode(form.referralCode)} disabled={codeChecking || !form.referralCode}>
                    {codeChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
                {affiliate && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Verified: {affiliate.firstName} {affiliate.lastName}
                  </p>
                )}
                {(errors.referralCode || codeError) && <p className="text-red-500 text-sm mt-1">{errors.referralCode || codeError}</p>}
                <p className="text-xs text-gray-500 mt-1">Don't have a code? <Link to={createPageUrl("AffiliateSignup")} className="text-amber-600 underline">Join the affiliate program →</Link></p>
              </div>

              <div className="border-t pt-5">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Business You're Referring</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                    <Input placeholder="e.g. Mike's Pizza" value={form.referredBusiness} onChange={e => setForm({ ...form, referredBusiness: e.target.value })} className={errors.referredBusiness ? "border-red-500" : ""} />
                    {errors.referredBusiness && <p className="text-red-500 text-xs mt-1">{errors.referredBusiness}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                    <Select value={form.businessType} onValueChange={v => setForm({ ...form, businessType: v })}>
                      <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Owner / Contact Name *</label>
                      <Input placeholder="John Smith" value={form.referredName} onChange={e => setForm({ ...form, referredName: e.target.value })} className={errors.referredName ? "border-red-500" : ""} />
                      {errors.referredName && <p className="text-red-500 text-xs mt-1">{errors.referredName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <Input type="tel" placeholder="(555) 000-0000" value={form.referredPhone} onChange={e => setForm({ ...form, referredPhone: e.target.value })} className={errors.referredPhone ? "border-red-500" : ""} />
                      {errors.referredPhone && <p className="text-red-500 text-xs mt-1">{errors.referredPhone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <Input type="email" placeholder="owner@business.com" value={form.referredEmail} onChange={e => setForm({ ...form, referredEmail: e.target.value })} className={errors.referredEmail ? "border-red-500" : ""} />
                    {errors.referredEmail && <p className="text-red-500 text-xs mt-1">{errors.referredEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Monthly Card Volume</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <Input type="number" placeholder="e.g. 20000" value={form.monthlyVolume} onChange={e => setForm({ ...form, monthlyVolume: e.target.value })} className="pl-7" min="0" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Helps us tailor the right solution for them</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes for Our Team (optional)</label>
                    <Textarea placeholder="Any context that might help our sales team..." rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading || !affiliate} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white h-12 text-base font-bold mt-2">
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : "Submit Referral"}
              </Button>
              <p className="text-xs text-center text-gray-400">You'll be notified when this referral converts. Commissions paid via PayPal within 30 days of approval.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}