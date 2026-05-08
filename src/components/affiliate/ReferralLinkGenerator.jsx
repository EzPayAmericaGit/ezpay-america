import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Link, ExternalLink, Zap } from "lucide-react";

const BASE_URL = "https://ezpayamerica.com";

const LANDING_PAGES = [
  { label: "Homepage", path: "/" },
  { label: "Apply Online", path: "/ApplyOnline" },
  { label: "Services", path: "/Services" },
  { label: "Restaurant POS", path: "/FullServiceRestaurantPOS" },
  { label: "Retail POS", path: "/RetailPOS" },
  { label: "Hair Salon POS", path: "/HairSalonPOS" },
  { label: "Dental Office POS", path: "/DentalOfficePOS" },
  { label: "HVAC POS", path: "/HVACCompanyPOS" },
  { label: "Law Firm POS", path: "/LawFirmPOS" },
  { label: "Book Appointment", path: "/BookAppointment" },
];

const UTM_SOURCES = ["email", "social", "blog", "youtube", "instagram", "facebook", "linkedin", "twitter", "website", "custom"];
const UTM_MEDIUMS = ["cpc", "organic", "social", "email", "referral", "banner", "video", "custom"];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button size="sm" variant="outline" onClick={handleCopy} className="shrink-0">
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
    </Button>
  );
}

function LinkRow({ label, url, badge }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs font-medium text-gray-700">{label}</p>
          {badge && <Badge className="text-xs bg-amber-100 text-amber-700">{badge}</Badge>}
        </div>
        <p className="text-xs text-blue-600 font-mono truncate">{url}</p>
      </div>
      <CopyButton text={url} />
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Button size="sm" variant="ghost"><ExternalLink className="w-3.5 h-3.5" /></Button>
      </a>
    </div>
  );
}

export default function ReferralLinkGenerator({ affiliates }) {
  const [selectedAffiliateId, setSelectedAffiliateId] = useState("");
  const [selectedPage, setSelectedPage] = useState("/ApplyOnline");
  const [utmSource, setUtmSource] = useState("email");
  const [customSource, setCustomSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("referral");
  const [customMedium, setCustomMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("affiliate");
  const [customContent, setCustomContent] = useState("");

  const affiliate = useMemo(() =>
    affiliates.find(a => a.id === selectedAffiliateId),
    [affiliates, selectedAffiliateId]
  );

  const buildUrl = (page, extraParams = {}) => {
    if (!affiliate) return "";
    const url = new URL(BASE_URL + page);
    url.searchParams.set("ref", affiliate.referralCode);
    const source = utmSource === "custom" ? customSource : utmSource;
    const medium = utmMedium === "custom" ? customMedium : utmMedium;
    if (source) url.searchParams.set("utm_source", source);
    if (medium) url.searchParams.set("utm_medium", medium);
    if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
    if (customContent) url.searchParams.set("utm_content", customContent);
    Object.entries(extraParams).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.toString();
  };

  const mainLink = buildUrl(selectedPage);
  const applyLink = buildUrl("/ApplyOnline");
  const bookLink = buildUrl("/BookAppointment");

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Referral Link Generator
          </CardTitle>
          <p className="text-sm text-gray-500">Generate trackable referral links with UTM parameters for any affiliate</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Affiliate selector */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Select Affiliate *</label>
            <Select value={selectedAffiliateId} onValueChange={setSelectedAffiliateId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an affiliate..." />
              </SelectTrigger>
              <SelectContent>
                {affiliates.filter(a => a.status === "approved").map(a => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.firstName} {a.lastName} — {a.referralCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {affiliate && (
              <div className="mt-2 flex items-center gap-3 p-3 bg-amber-50 rounded-lg text-sm">
                <div>
                  <span className="font-medium text-amber-800">Code: </span>
                  <span className="font-mono font-bold text-amber-700">{affiliate.referralCode}</span>
                </div>
                <div>
                  <span className="font-medium text-amber-800">Commission: </span>
                  <span className="text-amber-700">{affiliate.commissionRate || 10}%</span>
                </div>
                <Badge className="bg-amber-200 text-amber-800 capitalize">{affiliate.tier}</Badge>
              </div>
            )}
          </div>

          {/* Landing page */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Landing Page</label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANDING_PAGES.map(p => (
                  <SelectItem key={p.path} value={p.path}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* UTM parameters */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">UTM Source</label>
              <Select value={utmSource} onValueChange={setUtmSource}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UTM_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {utmSource === "custom" && (
                <Input className="mt-2 text-sm" placeholder="Custom source" value={customSource} onChange={e => setCustomSource(e.target.value)} />
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">UTM Medium</label>
              <Select value={utmMedium} onValueChange={setUtmMedium}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UTM_MEDIUMS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              {utmMedium === "custom" && (
                <Input className="mt-2 text-sm" placeholder="Custom medium" value={customMedium} onChange={e => setCustomMedium(e.target.value)} />
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">UTM Campaign</label>
              <Input placeholder="e.g. affiliate, q1-2025" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} className="text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">UTM Content (optional)</label>
              <Input placeholder="e.g. banner-top, email-footer" value={customContent} onChange={e => setCustomContent(e.target.value)} className="text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Links */}
      {affiliate && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5 text-blue-500" />
              Generated Links for {affiliate.firstName} {affiliate.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <LinkRow label="Selected Page" url={mainLink} badge="Custom" />
            <LinkRow label="Apply Online (direct conversion)" url={applyLink} />
            <LinkRow label="Book Appointment" url={bookLink} />

            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs font-semibold text-blue-800 mb-2">📋 Share Instructions for {affiliate.firstName}</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Copy and share any of the links above with {affiliate.firstName}. Each click via their link is automatically tracked using their code <strong>{affiliate.referralCode}</strong>. When a merchant applies and gets approved, their commission is automatically calculated.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All affiliate quick links */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>All Affiliate Quick Links</CardTitle>
          <p className="text-sm text-gray-500">Base apply links for all approved affiliates</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {affiliates.filter(a => a.status === "approved" && a.referralCode).map(a => {
              const url = `${BASE_URL}/ApplyOnline?ref=${a.referralCode}`;
              return (
                <div key={a.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{a.firstName} {a.lastName}</p>
                    <p className="text-xs text-blue-600 font-mono truncate">{url}</p>
                  </div>
                  <CopyButton text={url} />
                </div>
              );
            })}
            {affiliates.filter(a => a.status === "approved").length === 0 && (
              <p className="text-center text-gray-400 py-6">No approved affiliates yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}