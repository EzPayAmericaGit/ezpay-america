import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle2, Code, Globe, ExternalLink } from "lucide-react";

const EMBED_STYLES = [
  { id: "button", label: "Floating Button", desc: "A sticky button that opens a referral form" },
  { id: "inline", label: "Inline Form", desc: "Full embedded form in your page" },
  { id: "banner", label: "Banner Strip", desc: "A top/bottom banner with a referral CTA" },
];

export default function ReferralWidgetEmbed({ affiliate }) {
  const [selectedStyle, setSelectedStyle] = useState("button");
  const [copied, setCopied] = useState(null);
  const baseUrl = window.location.origin;
  const referralPortalUrl = `${baseUrl}/AffiliateReferralPortal?code=${affiliate.referralCode}`;

  const getEmbedCode = (style) => {
    if (style === "button") {
      return `<!-- EzPay America Referral Button by ${affiliate.referralCode} -->
<script>
(function() {
  var btn = document.createElement('a');
  btn.href = '${referralPortalUrl}';
  btn.target = '_blank';
  btn.innerText = '💳 Save on Payment Fees →';
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;padding:14px 22px;border-radius:50px;font-family:sans-serif;font-weight:bold;font-size:14px;text-decoration:none;box-shadow:0 4px 20px rgba(0,0,0,0.2);z-index:9999;display:block;';
  btn.onmouseover = function(){ this.style.transform='scale(1.05)'; };
  btn.onmouseout = function(){ this.style.transform='scale(1)'; };
  document.body.appendChild(btn);
})();
</script>`;
    }
    if (style === "inline") {
      return `<!-- EzPay America Inline Referral Form by ${affiliate.referralCode} -->
<iframe
  src="${referralPortalUrl}"
  width="100%"
  height="700"
  style="border:none;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.1);"
  title="Refer a Business to EzPay America"
  loading="lazy">
</iframe>`;
    }
    if (style === "banner") {
      return `<!-- EzPay America Referral Banner by ${affiliate.referralCode} -->
<div style="background:linear-gradient(135deg,#1f2937,#374151);padding:14px 24px;text-align:center;font-family:sans-serif;">
  <span style="color:white;font-size:15px;">💳 Know a business paying too much in card fees? </span>
  <a href="${referralPortalUrl}" target="_blank"
     style="background:#f59e0b;color:white;padding:8px 18px;border-radius:6px;font-weight:bold;text-decoration:none;font-size:14px;margin-left:12px;display:inline-block;">
    Refer Them →
  </a>
</div>`;
    }
  };

  const copyCode = (style) => {
    navigator.clipboard.writeText(getEmbedCode(style));
    setCopied(style);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <p><strong>💡 How it works:</strong> Embed this widget on your website, blog, or email signature. Anyone who submits a referral through it will be automatically tracked to your account using code <strong>{affiliate.referralCode}</strong>.</p>
      </div>

      {/* Style Selector */}
      <div className="grid sm:grid-cols-3 gap-3">
        {EMBED_STYLES.map(s => (
          <button key={s.id} onClick={() => setSelectedStyle(s.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${selectedStyle === s.id ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
            <p className="font-semibold text-gray-900 text-sm">{s.label}</p>
            <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
          </button>
        ))}
      </div>

      {/* Live Preview */}
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Preview</CardTitle>
            <Badge className="bg-gray-100 text-gray-600 text-xs">Visual Preview</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-xl p-6 min-h-[120px] relative overflow-hidden">
            <div className="text-xs text-gray-400 mb-4 italic">Your website content would be here...</div>

            {selectedStyle === "button" && (
              <div className="flex justify-end">
                <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-3 rounded-full font-bold text-sm shadow-lg cursor-pointer">
                  💳 Save on Payment Fees →
                </span>
              </div>
            )}

            {selectedStyle === "inline" && (
              <div className="border-2 border-dashed border-gray-400 rounded-xl p-8 text-center bg-white">
                <Globe className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-700">EzPay America Referral Form</p>
                <p className="text-xs text-gray-500 mt-1">Full form embeds here (700px tall)</p>
                <a href={referralPortalUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 underline mt-2 inline-flex items-center gap-1">
                  Preview form <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {selectedStyle === "banner" && (
              <div className="bg-gradient-to-r from-gray-900 to-gray-700 px-5 py-3 rounded-lg flex items-center justify-between flex-wrap gap-3">
                <span className="text-white text-sm">💳 Know a business paying too much in card fees?</span>
                <span className="bg-amber-500 text-white px-4 py-1.5 rounded font-bold text-sm cursor-pointer">Refer Them →</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Embed Codes */}
      <div className="space-y-4">
        {EMBED_STYLES.filter(s => s.id === selectedStyle).map(s => (
          <Card key={s.id} className="border-none shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-gray-500" />
                  <CardTitle className="text-base">{s.label} — Embed Code</CardTitle>
                </div>
                <Button size="sm" variant="outline" onClick={() => copyCode(s.id)} className="gap-1.5">
                  {copied === s.id ? <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" />Copied!</> : <><Copy className="w-3.5 h-3.5" />Copy Code</>}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed">
                {getEmbedCode(s.id)}
              </pre>
              <p className="text-xs text-gray-500 mt-2">Paste this code into your website's HTML where you want the widget to appear.</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Direct Link */}
      <Card className="border-none shadow">
        <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-gray-700">Direct Referral Link</p>
            <p className="text-xs text-gray-500 font-mono truncate max-w-xs">{referralPortalUrl}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(referralPortalUrl); setCopied("link"); setTimeout(() => setCopied(null), 2000); }}>
              {copied === "link" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied === "link" ? "Copied!" : "Copy Link"}
            </Button>
            <a href={referralPortalUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline"><ExternalLink className="w-3.5 h-3.5 mr-1" />Preview</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}