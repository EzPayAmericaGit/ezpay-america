import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Palette, Save, Loader2, CheckCircle2 } from "lucide-react";

const DEFAULTS = {
  programName: "EzPay America Affiliate Program",
  tagline: "Earn commissions by referring merchants to EzPay America",
  primaryColor: "#f59e0b",
  logoUrl: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png",
  websiteUrl: "https://ezpayamerica.com",
  supportEmail: "mail@ezpayamerica.com",
  termsUrl: "",
  privacyUrl: "",
  minPayoutAmount: "50",
  payoutSchedule: "Net 30",
  cookieDays: "30",
  welcomeMessage: "Welcome to the EzPay America Affiliate Program! We're excited to have you on board.",
  footerText: "© 2025 EzPay America. All rights reserved.",
};

export default function BrandingManager() {
  const [branding, setBranding] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settingId, setSettingId] = useState(null);

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      const results = await base44.entities.Settings.filter({ type: "branding" });
      if (results.length > 0) {
        setSettingId(results[0].id);
        setBranding({ ...DEFAULTS, ...results[0].value });
      }
    } catch {}
    setLoading(false);
  };

  const saveBranding = async () => {
    setSaving(true);
    if (settingId) {
      await base44.entities.Settings.update(settingId, { type: "branding", key: "affiliate_branding", value: branding });
    } else {
      const created = await base44.entities.Settings.create({ type: "branding", key: "affiliate_branding", value: branding });
      setSettingId(created.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Field = ({ label, field, type = "text", placeholder }) => (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={branding[field] || ""}
        onChange={e => setBranding(prev => ({ ...prev, [field]: e.target.value }))}
      />
    </div>
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" />Program Branding & Settings</CardTitle>
            <Button onClick={saveBranding} disabled={saving} className="bg-amber-500 hover:bg-amber-600 text-white">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saved ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-300" /> : <Save className="w-4 h-4 mr-2" />}
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Program Identity</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Program Name" field="programName" placeholder="My Affiliate Program" />
              <Field label="Website URL" field="websiteUrl" placeholder="https://yoursite.com" />
              <Field label="Support Email" field="supportEmail" placeholder="affiliate@yoursite.com" />
              <Field label="Logo URL" field="logoUrl" placeholder="https://..." />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tagline</label>
              <Textarea
                placeholder="Earn by referring customers..."
                rows={2}
                value={branding.tagline || ""}
                onChange={e => setBranding(prev => ({ ...prev, tagline: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Colors & Appearance</h3>
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={branding.primaryColor || "#f59e0b"}
                    onChange={e => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                  />
                  <Input
                    value={branding.primaryColor || ""}
                    onChange={e => setBranding(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-32 font-mono"
                    placeholder="#f59e0b"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Preview</label>
                <div className="flex gap-2">
                  <button style={{ backgroundColor: branding.primaryColor }} className="px-4 py-2 rounded-lg text-white text-sm font-medium">Button Preview</button>
                  <span style={{ color: branding.primaryColor }} className="text-sm font-medium self-center">Link Preview</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Program Rules</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Minimum Payout ($)" field="minPayoutAmount" type="number" placeholder="50" />
              <Field label="Payout Schedule" field="payoutSchedule" placeholder="Net 30" />
              <Field label="Cookie Duration (days)" field="cookieDays" type="number" placeholder="30" />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Field label="Terms of Service URL" field="termsUrl" placeholder="https://yoursite.com/terms" />
              <Field label="Privacy Policy URL" field="privacyUrl" placeholder="https://yoursite.com/privacy" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">Messaging</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Welcome Message (shown after signup)</label>
                <Textarea
                  rows={3}
                  value={branding.welcomeMessage || ""}
                  onChange={e => setBranding(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                  placeholder="Welcome to our affiliate program..."
                />
              </div>
              <Field label="Footer Text" field="footerText" placeholder="© 2025 Your Company. All rights reserved." />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}