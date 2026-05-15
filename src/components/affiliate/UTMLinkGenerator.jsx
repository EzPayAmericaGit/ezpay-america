import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, Link2, Plus, Trash2, ExternalLink } from "lucide-react";

const BASE_URL = "https://ezpayamerica.com";

const LANDING_PAGES = [
  { label: "Home", path: "/" },
  { label: "Apply Online", path: "/ApplyOnline" },
  { label: "Restaurant POS", path: "/RestaurantPOS" },
  { label: "Retail POS", path: "/RetailPOS" },
  { label: "Hair Salon POS", path: "/HairSalonPOS" },
  { label: "Dental Office POS", path: "/DentalOfficePOS" },
  { label: "HVAC POS", path: "/HVACCompanyPOS" },
  { label: "Law Firm POS", path: "/LawFirmPOS" },
  { label: "Cash Discount Program", path: "/CashDiscountProgram" },
  { label: "Mobile Payments", path: "/MobilePayments" },
  { label: "Merchant Cash Advance", path: "/MerchantCashAdvance" },
  { label: "Book Appointment", path: "/BookAppointment" },
];

const SOURCES = [
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Email", value: "email" },
  { label: "YouTube", value: "youtube" },
  { label: "TikTok", value: "tiktok" },
  { label: "Twitter/X", value: "twitter" },
  { label: "Blog", value: "blog" },
  { label: "Podcast", value: "podcast" },
  { label: "Text Message", value: "sms" },
  { label: "Custom", value: "custom" },
];

function buildLink(affiliateCode, path, source, medium, campaign, content) {
  const params = new URLSearchParams();
  params.set("ref", affiliateCode);
  if (source) params.set("utm_source", source);
  if (medium) params.set("utm_medium", medium);
  if (campaign) params.set("utm_campaign", campaign);
  if (content) params.set("utm_content", content);
  return `${BASE_URL}${path}?${params.toString()}`;
}

export default function UTMLinkGenerator({ affiliate }) {
  const [selectedPage, setSelectedPage] = useState("/");
  const [source, setSource] = useState("facebook");
  const [customSource, setCustomSource] = useState("");
  const [medium, setMedium] = useState("social");
  const [campaign, setCampaign] = useState("referral");
  const [content, setContent] = useState("");
  const [savedLinks, setSavedLinks] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [copiedPreview, setCopiedPreview] = useState(false);

  const effectiveSource = source === "custom" ? customSource : source;
  const previewLink = buildLink(affiliate.referralCode, selectedPage, effectiveSource, medium, campaign, content);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    if (key === "preview") {
      setCopiedPreview(true);
      setTimeout(() => setCopiedPreview(false), 2000);
    } else {
      setCopiedIdx(key);
      setTimeout(() => setCopiedIdx(null), 2000);
    }
  };

  const saveLink = () => {
    const label = LANDING_PAGES.find(p => p.path === selectedPage)?.label || selectedPage;
    const entry = {
      id: Date.now(),
      label: `${label} — ${effectiveSource}`,
      url: previewLink,
      source: effectiveSource,
      medium,
      campaign,
      content,
      page: selectedPage,
    };
    setSavedLinks(prev => [entry, ...prev]);
  };

  const deleteLink = (id) => setSavedLinks(prev => prev.filter(l => l.id !== id));

  return (
    <div className="space-y-6">
      {/* Builder */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-amber-500" />
            UTM Referral Link Builder
          </CardTitle>
          <p className="text-sm text-gray-500">Create trackable links with UTM parameters to see which channels drive the most conversions.</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Landing Page */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Landing Page</label>
            <div className="flex flex-wrap gap-2">
              {LANDING_PAGES.map(p => (
                <button
                  key={p.path}
                  onClick={() => setSelectedPage(p.path)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    selectedPage === p.path
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* UTM Params */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Traffic Source</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {SOURCES.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSource(s.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                      source === s.value
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {source === "custom" && (
                <Input placeholder="e.g. newsletter" value={customSource} onChange={e => setCustomSource(e.target.value)} className="text-sm" />
              )}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Medium <span className="text-gray-400 font-normal">(utm_medium)</span></label>
                <Input placeholder="e.g. social, email, cpc" value={medium} onChange={e => setMedium(e.target.value)} className="text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Campaign <span className="text-gray-400 font-normal">(utm_campaign)</span></label>
                <Input placeholder="e.g. referral, spring-promo" value={campaign} onChange={e => setCampaign(e.target.value)} className="text-sm" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content <span className="text-gray-400 font-normal">(utm_content, optional)</span></label>
                <Input placeholder="e.g. banner-top, story-link" value={content} onChange={e => setContent(e.target.value)} className="text-sm" />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Generated Link Preview</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 break-all">
                {previewLink}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-amber-400 text-amber-700 hover:bg-amber-50 whitespace-nowrap"
                  onClick={() => copyToClipboard(previewLink, "preview")}
                >
                  {copiedPreview ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
                <a href={previewLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="ghost" className="text-gray-500">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* UTM Breakdown */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge className="bg-blue-100 text-blue-700 text-xs">ref={affiliate.referralCode}</Badge>
              {effectiveSource && <Badge className="bg-purple-100 text-purple-700 text-xs">source={effectiveSource}</Badge>}
              {medium && <Badge className="bg-green-100 text-green-700 text-xs">medium={medium}</Badge>}
              {campaign && <Badge className="bg-orange-100 text-orange-700 text-xs">campaign={campaign}</Badge>}
              {content && <Badge className="bg-pink-100 text-pink-700 text-xs">content={content}</Badge>}
            </div>
          </div>

          <Button onClick={saveLink} className="bg-amber-500 hover:bg-amber-600 text-white gap-2">
            <Plus className="w-4 h-4" /> Save This Link
          </Button>
        </CardContent>
      </Card>

      {/* Saved Links */}
      {savedLinks.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Saved Links ({savedLinks.length})</CardTitle>
            <p className="text-sm text-gray-500">Quick access to your saved tracking links.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedLinks.map((link, i) => (
              <div key={link.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm mb-1">{link.label}</p>
                  <p className="text-xs font-mono text-gray-500 truncate">{link.url}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge className="bg-blue-100 text-blue-700 text-xs">ref={affiliate.referralCode}</Badge>
                    {link.source && <Badge className="bg-purple-100 text-purple-700 text-xs">{link.source}</Badge>}
                    {link.medium && <Badge className="bg-green-100 text-green-700 text-xs">{link.medium}</Badge>}
                    {link.campaign && <Badge className="bg-orange-100 text-orange-700 text-xs">{link.campaign}</Badge>}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 h-8 px-2"
                    onClick={() => copyToClipboard(link.url, i)}
                  >
                    {copiedIdx === i ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="h-8 px-2 text-gray-400 hover:text-gray-600">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-red-400 hover:text-red-600"
                    onClick={() => deleteLink(link.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 space-y-1">
        <p className="font-semibold">💡 Pro Tips for Tracking Performance</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
          <li>Use a different <strong>utm_source</strong> for each platform (facebook, email, etc.)</li>
          <li>Use <strong>utm_content</strong> to A/B test specific posts or creatives</li>
          <li>Keep <strong>utm_campaign</strong> consistent across a promotion to group results</li>
          <li>Your <strong>ref={affiliate.referralCode}</strong> is always included — it ensures you get credit for every conversion</li>
        </ul>
      </div>
    </div>
  );
}