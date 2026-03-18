import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function GetStartedForm({ service = "General Inquiry", bgDark = false }) {
  const [form, setForm] = useState({ firstName: "", lastName: "", businessName: "", phone: "", email: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: "mail@ezpayamerica.com",
        subject: `New Lead: ${service} – ${form.businessName}`,
        body: `
          <div style="font-family:Arial,sans-serif;max-width:600px">
            <h2 style="color:#f59e0b">New Get Started Request</h2>
            <p><strong>Service Interest:</strong> ${service}</p>
            <p><strong>Name:</strong> ${form.firstName} ${form.lastName}</p>
            <p><strong>Business:</strong> ${form.businessName}</p>
            <p><strong>Phone:</strong> ${form.phone}</p>
            <p><strong>Email:</strong> ${form.email}</p>
          </div>
        `
      });

      // Also save as a demo request
      await base44.entities.DemoRequest.create({
        contactName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        status: "pending"
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const inputClass = bgDark
    ? "bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-amber-400"
    : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400";

  const labelClass = bgDark ? "text-white/90 text-sm font-medium" : "text-gray-700 text-sm font-medium";

  if (submitted) {
    return (
      <div className={`rounded-2xl p-8 text-center ${bgDark ? "bg-white/10 border border-white/20" : "bg-green-50 border border-green-200"}`}>
        <CheckCircle2 className={`w-16 h-16 mx-auto mb-4 ${bgDark ? "text-amber-400" : "text-green-500"}`} />
        <h3 className={`text-2xl font-bold mb-2 ${bgDark ? "text-white" : "text-gray-900"}`}>You're All Set!</h3>
        <p className={bgDark ? "text-white/80" : "text-gray-600"}>
          Thanks, <strong>{form.firstName}</strong>! A specialist will contact <strong>{form.businessName}</strong> within 24 hours.
        </p>
        <p className={`mt-3 text-sm ${bgDark ? "text-white/60" : "text-gray-500"}`}>Or call us now: <a href="tel:8653169625" className="text-amber-500 font-semibold">(865) 316-9625</a></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-2xl p-6 md:p-8 space-y-4 ${bgDark ? "bg-white/10 border border-white/20 backdrop-blur-sm" : "bg-white border border-gray-200 shadow-xl"}`}>
      <h3 className={`text-xl font-bold mb-1 ${bgDark ? "text-white" : "text-gray-900"}`}>Get Started Free</h3>
      <p className={`text-sm mb-4 ${bgDark ? "text-white/70" : "text-gray-500"}`}>No contracts · No setup fees · Free equipment</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>First Name *</label>
          <Input className={`mt-1 ${inputClass}`} placeholder="John" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
        </div>
        <div>
          <label className={labelClass}>Last Name *</label>
          <Input className={`mt-1 ${inputClass}`} placeholder="Smith" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Business Name *</label>
        <Input className={`mt-1 ${inputClass}`} placeholder="My Business LLC" required value={form.businessName} onChange={e => setForm({...form, businessName: e.target.value})} />
      </div>
      <div>
        <label className={labelClass}>Phone Number *</label>
        <Input className={`mt-1 ${inputClass}`} type="tel" placeholder="(555) 000-0000" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
      </div>
      <div>
        <label className={labelClass}>Email Address *</label>
        <Input className={`mt-1 ${inputClass}`} type="email" placeholder="john@mybusiness.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 text-base">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending...</> : "Get My Free Quote →"}
      </Button>
      <p className={`text-xs text-center ${bgDark ? "text-white/50" : "text-gray-400"}`}>By submitting, you agree to be contacted by EzPay America.</p>
    </form>
  );
}