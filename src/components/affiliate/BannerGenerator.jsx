import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, Copy, Check, Image, Type, Palette, Layout, Sliders, Link, Save, CheckCircle2 } from "lucide-react";

const BANNER_SIZES = [
  { label: "Leaderboard", width: 728, height: 90, desc: "728×90" },
  { label: "Medium Rectangle", width: 300, height: 250, desc: "300×250" },
  { label: "Half Page", width: 300, height: 600, desc: "300×600" },
  { label: "Wide Skyscraper", width: 160, height: 600, desc: "160×600" },
  { label: "Large Rectangle", width: 336, height: 280, desc: "336×280" },
  { label: "Billboard", width: 970, height: 250, desc: "970×250" },
  { label: "Square", width: 250, height: 250, desc: "250×250" },
  { label: "Mobile Banner", width: 320, height: 50, desc: "320×50" },
  { label: "Social (Square)", width: 1080, height: 1080, desc: "1080×1080" },
  { label: "Social (Story)", width: 1080, height: 1920, desc: "1080×1920" },
];

const TEMPLATES = [
  {
    id: "bold-amber",
    label: "Bold Amber",
    bg: "#f59e0b",
    bgGradient: ["#f59e0b", "#d97706"],
    textColor: "#ffffff",
    accentColor: "#1f2937",
    subTextColor: "rgba(255,255,255,0.85)",
    badgeBg: "#1f2937",
    badgeText: "#ffffff",
    style: "gradient",
  },
  {
    id: "dark-pro",
    label: "Dark Pro",
    bg: "#111827",
    bgGradient: ["#111827", "#1f2937"],
    textColor: "#f9fafb",
    accentColor: "#f59e0b",
    subTextColor: "rgba(249,250,251,0.7)",
    badgeBg: "#f59e0b",
    badgeText: "#111827",
    style: "gradient",
  },
  {
    id: "clean-white",
    label: "Clean White",
    bg: "#ffffff",
    bgGradient: ["#ffffff", "#f9fafb"],
    textColor: "#111827",
    accentColor: "#f59e0b",
    subTextColor: "#6b7280",
    badgeBg: "#f59e0b",
    badgeText: "#ffffff",
    style: "flat",
  },
  {
    id: "ocean-blue",
    label: "Ocean Blue",
    bg: "#1e40af",
    bgGradient: ["#1e40af", "#1e3a8a"],
    textColor: "#ffffff",
    accentColor: "#fbbf24",
    subTextColor: "rgba(255,255,255,0.8)",
    badgeBg: "#fbbf24",
    badgeText: "#1e3a8a",
    style: "gradient",
  },
  {
    id: "emerald",
    label: "Emerald",
    bg: "#065f46",
    bgGradient: ["#059669", "#065f46"],
    textColor: "#ffffff",
    accentColor: "#d1fae5",
    subTextColor: "rgba(255,255,255,0.8)",
    badgeBg: "#d1fae5",
    badgeText: "#065f46",
    style: "gradient",
  },
  {
    id: "purple-glow",
    label: "Purple Glow",
    bg: "#5b21b6",
    bgGradient: ["#7c3aed", "#5b21b6"],
    textColor: "#ffffff",
    accentColor: "#fde68a",
    subTextColor: "rgba(255,255,255,0.8)",
    badgeBg: "#fde68a",
    badgeText: "#5b21b6",
    style: "gradient",
  },
];

const FONT_OPTIONS = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Arial Black", value: "'Arial Black', sans-serif" },
  { label: "Courier", value: "'Courier New', monospace" },
  { label: "Trebuchet", value: "'Trebuchet MS', sans-serif" },
];

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export default function BannerGenerator({ affiliates = [] }) {
  const canvasRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState(BANNER_SIZES[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [copied, setCopied] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [savedLink, setSavedLink] = useState({ affiliateId: "", customUrl: "", saved: false });
  const [activePanel, setActivePanel] = useState("template");

  const [config, setConfig] = useState({
    headline: "Earn Up to 20% Commission",
    subtext: "Join the EzPay America Affiliate Program",
    ctaText: "Get Started Free",
    badgeText: "FREE TO JOIN",
    showBadge: true,
    showCta: true,
    showSubtext: true,
    showLogo: true,
    logoText: "EzPay America",
    font: FONT_OPTIONS[0].value,
    headlineFontSize: 28,
    subtextFontSize: 14,
    ctaFontSize: 14,
    borderWidth: 0,
    borderColor: "#f59e0b",
    cornerRadius: 8,
    // override colors per-banner
    bgColor: "",
    textColor: "",
    accentColor: "",
  });

  const t = selectedTemplate;
  const bgColor = config.bgColor || t.bg;
  const textColor = config.textColor || t.textColor;
  const accentColor = config.accentColor || t.accentColor;

  const drawBanner = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = selectedSize;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const isWide = width > height * 1.5;
    const isTall = height > width * 1.5;
    const isSmall = width < 200 || height < 80;

    // Background
    if (t.style === "gradient") {
      const grd = ctx.createLinearGradient(0, 0, isWide ? width : 0, isWide ? 0 : height);
      grd.addColorStop(0, t.bgGradient[0]);
      grd.addColorStop(1, t.bgGradient[1]);
      ctx.fillStyle = grd;
    } else {
      ctx.fillStyle = bgColor;
    }

    if (config.cornerRadius > 0) {
      drawRoundedRect(ctx, 0, 0, width, height, config.cornerRadius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, width, height);
    }

    // Border
    if (config.borderWidth > 0) {
      ctx.strokeStyle = config.borderColor;
      ctx.lineWidth = config.borderWidth;
      if (config.cornerRadius > 0) {
        drawRoundedRect(ctx, config.borderWidth / 2, config.borderWidth / 2, width - config.borderWidth, height - config.borderWidth, config.cornerRadius);
        ctx.stroke();
      } else {
        ctx.strokeRect(config.borderWidth / 2, config.borderWidth / 2, width - config.borderWidth, height - config.borderWidth);
      }
    }

    // Decorative accent line
    ctx.fillStyle = accentColor;
    if (isWide) {
      ctx.fillRect(0, height - 4, width, 4);
    } else {
      ctx.fillRect(width - 6, 0, 6, height);
    }

    // Padding
    const pad = isSmall ? 6 : Math.min(24, width * 0.05, height * 0.1);

    if (isWide) {
      // === HORIZONTAL LAYOUT ===
      let x = pad;
      const centerY = height / 2;

      // Logo pill
      if (config.showLogo && !isSmall) {
        const logoFontSize = Math.max(8, Math.min(13, height * 0.22));
        ctx.font = `bold ${logoFontSize}px ${config.font}`;
        const logoW = ctx.measureText(config.logoText).width + 14;
        const logoH = logoFontSize + 10;
        drawRoundedRect(ctx, x, centerY - logoH / 2, logoW, logoH, 4);
        ctx.fillStyle = accentColor;
        ctx.fill();
        ctx.fillStyle = t.badgeText || textColor;
        ctx.font = `bold ${logoFontSize}px ${config.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(config.logoText, x + logoW / 2, centerY);
        x += logoW + pad;
      }

      // Headline
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      const hSize = Math.max(9, Math.min(config.headlineFontSize, height * 0.4, 36));
      ctx.font = `bold ${hSize}px ${config.font}`;
      ctx.fillStyle = textColor;
      ctx.fillText(config.headline, x, config.showSubtext && !isSmall ? centerY - hSize * 0.5 : centerY);

      if (config.showSubtext && !isSmall) {
        const sSize = Math.max(7, Math.min(config.subtextFontSize, height * 0.22, 16));
        ctx.font = `${sSize}px ${config.font}`;
        ctx.fillStyle = t.subTextColor || textColor;
        ctx.fillText(config.subtext, x, centerY + hSize * 0.6);
      }

      // CTA button (right side)
      if (config.showCta) {
        const ctaSize = Math.max(8, Math.min(config.ctaFontSize, height * 0.25, 16));
        ctx.font = `bold ${ctaSize}px ${config.font}`;
        const ctaW = ctx.measureText(config.ctaText).width + 24;
        const ctaH = Math.max(24, height * 0.55);
        const ctaX = width - ctaW - pad;
        const ctaY = centerY - ctaH / 2;
        drawRoundedRect(ctx, ctaX, ctaY, ctaW, ctaH, 6);
        ctx.fillStyle = accentColor;
        ctx.fill();
        ctx.fillStyle = t.badgeText || "#ffffff";
        ctx.font = `bold ${ctaSize}px ${config.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(config.ctaText, ctaX + ctaW / 2, centerY);
      }

    } else {
      // === VERTICAL / SQUARE LAYOUT ===
      let y = pad + (isTall ? height * 0.05 : 0);

      // Badge
      if (config.showBadge && !isSmall) {
        const badgeFontSize = Math.max(8, Math.min(11, width * 0.04));
        ctx.font = `bold ${badgeFontSize}px ${config.font}`;
        const badgeW = ctx.measureText(config.badgeText).width + 16;
        const badgeH = badgeFontSize + 10;
        drawRoundedRect(ctx, pad, y, badgeW, badgeH, 3);
        ctx.fillStyle = t.badgeBg;
        ctx.fill();
        ctx.fillStyle = t.badgeText;
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(config.badgeText, pad + 8, y + badgeH / 2);
        y += badgeH + 10;
      }

      // Logo
      if (config.showLogo && !isSmall) {
        const logoSize = Math.max(10, Math.min(16, width * 0.055));
        ctx.font = `bold ${logoSize}px ${config.font}`;
        ctx.fillStyle = accentColor;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(config.logoText, pad, y);
        y += logoSize + 10;
      }

      // Headline
      const hSize = Math.max(10, Math.min(config.headlineFontSize, width * 0.09, 48));
      ctx.font = `bold ${hSize}px ${config.font}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      // Word wrap headline
      const maxW = width - pad * 2;
      const words = config.headline.split(" ");
      let line = "";
      const lines = [];
      for (const word of words) {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      lines.push(line);
      for (const ln of lines) {
        ctx.fillText(ln, pad, y);
        y += hSize * 1.2;
      }
      y += 6;

      // Subtext
      if (config.showSubtext && !isSmall) {
        const sSize = Math.max(8, Math.min(config.subtextFontSize, width * 0.045, 18));
        ctx.font = `${sSize}px ${config.font}`;
        ctx.fillStyle = t.subTextColor || textColor;
        const subWords = config.subtext.split(" ");
        let sLine = "";
        const sLines = [];
        for (const w of subWords) {
          const test = sLine ? sLine + " " + w : w;
          if (ctx.measureText(test).width > maxW && sLine) { sLines.push(sLine); sLine = w; }
          else sLine = test;
        }
        sLines.push(sLine);
        for (const sl of sLines) {
          ctx.fillText(sl, pad, y);
          y += sSize * 1.4;
        }
        y += 8;
      }

      // CTA Button
      if (config.showCta && !isSmall) {
        const ctaSize = Math.max(9, Math.min(config.ctaFontSize, width * 0.045, 18));
        ctx.font = `bold ${ctaSize}px ${config.font}`;
        const ctaW = Math.min(maxW, ctx.measureText(config.ctaText).width + 32);
        const ctaH = ctaSize + 18;
        const ctaY = isTall ? height - ctaH - pad * 2 : y;
        drawRoundedRect(ctx, pad, ctaY, ctaW, ctaH, 6);
        ctx.fillStyle = accentColor;
        ctx.fill();
        ctx.fillStyle = t.badgeText || "#ffffff";
        ctx.font = `bold ${ctaSize}px ${config.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(config.ctaText, pad + ctaW / 2, ctaY + ctaH / 2);
      }
    }
  }, [selectedSize, selectedTemplate, config, t, bgColor, textColor, accentColor]);

  useEffect(() => {
    drawBanner();
  }, [drawBanner]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `banner-${selectedSize.label.replace(/\s+/g, "-").toLowerCase()}-${selectedTemplate.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyDataURL = () => {
    const canvas = canvasRef.current;
    navigator.clipboard.writeText(canvas.toDataURL("image/png")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const update = (key, val) => setConfig(prev => ({ ...prev, [key]: val }));

  // Scale canvas preview to fit without overflow
  const maxPreviewW = 680;
  const maxPreviewH = 400;
  const scaleX = maxPreviewW / selectedSize.width;
  const scaleY = maxPreviewH / selectedSize.height;
  const scale = Math.min(scaleX, scaleY, 1);
  const previewW = selectedSize.width * scale;
  const previewH = selectedSize.height * scale;

  const panels = [
    { id: "template", label: "Template", icon: Palette },
    { id: "size", label: "Size", icon: Layout },
    { id: "text", label: "Text", icon: Type },
    { id: "style", label: "Style", icon: Sliders },
    { id: "link", label: "Link", icon: Link },
  ];

  const selectedAffiliate = affiliates.find(a => a.id === savedLink.affiliateId);
  const affiliateUrl = savedLink.customUrl ||
    (selectedAffiliate ? `https://ezpayamerica.com/AffiliateSignup?ref=${selectedAffiliate.referralCode}` : "https://ezpayamerica.com/AffiliateSignup");

  const getHtmlSnippet = () => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    const dataUrl = canvas.toDataURL("image/png");
    return `<a href="${affiliateUrl}" target="_blank" rel="noopener noreferrer">\n  <img src="${dataUrl}" width="${selectedSize.width}" height="${selectedSize.height}" alt="${config.headline}" style="display:block;border:0;" />\n</a>`;
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(getHtmlSnippet()).then(() => {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    });
  };

  const saveLink = () => {
    setSavedLink(prev => ({ ...prev, saved: true }));
    setTimeout(() => setSavedLink(prev => ({ ...prev, saved: false })), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Banner Generator</h2>
          <p className="text-sm text-gray-500 mt-0.5">Create affiliate marketing banners in all standard ad sizes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={drawBanner}>
            <RefreshCw className="w-4 h-4 mr-1" />Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={copyHtml}>
            {copiedHtml ? <><Check className="w-4 h-4 mr-1 text-green-600" />HTML Copied!</> : <><Link className="w-4 h-4 mr-1" />Copy HTML</>}
          </Button>
          <Button variant="outline" size="sm" onClick={copyDataURL}>
            {copied ? <><Check className="w-4 h-4 mr-1 text-green-600" />Copied!</> : <><Copy className="w-4 h-4 mr-1" />Copy PNG</>}
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" size="sm" onClick={downloadPNG}>
            <Download className="w-4 h-4 mr-1" />Download PNG
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Controls */}
        <div className="xl:col-span-1 space-y-4">
          {/* Panel tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {panels.map(p => (
              <button key={p.id} onClick={() => setActivePanel(p.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium transition-all ${activePanel === p.id ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>
                <p.icon className="w-3 h-3" />{p.label}
              </button>
            ))}
          </div>

          {/* Template panel */}
          {activePanel === "template" && (
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(tmpl => (
                <button key={tmpl.id} onClick={() => setSelectedTemplate(tmpl)}
                  className={`relative rounded-lg p-3 text-left border-2 transition-all ${selectedTemplate.id === tmpl.id ? "border-amber-400 shadow-md" : "border-transparent hover:border-gray-200"}`}
                  style={{ background: `linear-gradient(135deg, ${tmpl.bgGradient[0]}, ${tmpl.bgGradient[1]})` }}>
                  <span className="text-xs font-bold" style={{ color: tmpl.textColor }}>{tmpl.label}</span>
                  <div className="mt-1 h-1 w-8 rounded-full" style={{ background: tmpl.accentColor }} />
                  {selectedTemplate.id === tmpl.id && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Size panel */}
          {activePanel === "size" && (
            <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
              {BANNER_SIZES.map(size => (
                <button key={size.label} onClick={() => setSelectedSize(size)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all border ${selectedSize.label === size.label ? "border-amber-400 bg-amber-50 text-amber-800 font-medium" : "border-transparent hover:bg-gray-50 text-gray-700"}`}>
                  <span>{size.label}</span>
                  <Badge variant="secondary" className="text-xs font-mono">{size.desc}</Badge>
                </button>
              ))}
            </div>
          )}

          {/* Text panel */}
          {activePanel === "text" && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Headline</label>
                <Input value={config.headline} onChange={e => update("headline", e.target.value)} placeholder="Your headline..." />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Subtext</label>
                <Input value={config.subtext} onChange={e => update("subtext", e.target.value)} placeholder="Supporting text..." />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">CTA Button Text</label>
                <Input value={config.ctaText} onChange={e => update("ctaText", e.target.value)} placeholder="Get Started" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Badge Text</label>
                <Input value={config.badgeText} onChange={e => update("badgeText", e.target.value)} placeholder="FREE TO JOIN" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Logo / Brand Name</label>
                <Input value={config.logoText} onChange={e => update("logoText", e.target.value)} placeholder="EzPay America" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Font Family</label>
                <select value={config.font} onChange={e => update("font", e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-400">
                  {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 block">Headline Size: {config.headlineFontSize}px</label>
                <input type="range" min="12" max="64" value={config.headlineFontSize} onChange={e => update("headlineFontSize", parseInt(e.target.value))}
                  className="w-full accent-amber-500" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600 block">Subtext Size: {config.subtextFontSize}px</label>
                <input type="range" min="8" max="24" value={config.subtextFontSize} onChange={e => update("subtextFontSize", parseInt(e.target.value))}
                  className="w-full accent-amber-500" />
              </div>
            </div>
          )}

          {/* Link panel */}
          {activePanel === "link" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Assign to Affiliate</label>
                <select
                  value={savedLink.affiliateId}
                  onChange={e => setSavedLink(prev => ({ ...prev, affiliateId: e.target.value, customUrl: "" }))}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-400">
                  <option value="">— No affiliate (generic link) —</option>
                  {affiliates.filter(a => a.status === "approved").map(a => (
                    <option key={a.id} value={a.id}>{a.firstName} {a.lastName} ({a.referralCode})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Custom Destination URL</label>
                <Input
                  placeholder="https://ezpayamerica.com/AffiliateSignup?ref=CODE"
                  value={savedLink.customUrl}
                  onChange={e => setSavedLink(prev => ({ ...prev, customUrl: e.target.value }))}
                />
                <p className="text-xs text-gray-400 mt-1">Overrides the auto-generated affiliate link.</p>
              </div>
              <div className="bg-gray-50 border rounded-lg p-3">
                <p className="text-xs font-medium text-gray-600 mb-1">Active Link</p>
                <p className="text-xs text-blue-600 break-all font-mono">{affiliateUrl}</p>
              </div>
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white" size="sm" onClick={saveLink}>
                {savedLink.saved ? <><CheckCircle2 className="w-4 h-4 mr-1" />Saved!</> : <><Save className="w-4 h-4 mr-1" />Save Link Settings</>}
              </Button>
              <div className="pt-2 border-t">
                <p className="text-xs font-medium text-gray-600 mb-2">HTML Embed Code</p>
                <p className="text-xs text-gray-500 mb-2">Copy this snippet to embed the banner with your link on any website.</p>
                <Button variant="outline" size="sm" className="w-full" onClick={copyHtml}>
                  {copiedHtml ? <><Check className="w-4 h-4 mr-1 text-green-600" />Copied HTML!</> : <><Copy className="w-4 h-4 mr-1" />Copy HTML Snippet</>}
                </Button>
              </div>
            </div>
          )}

          {/* Style panel */}
          {activePanel === "style" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">BG Color</label>
                  <input type="color" value={config.bgColor || t.bg} onChange={e => update("bgColor", e.target.value)}
                    className="w-full h-9 rounded cursor-pointer border border-gray-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Text Color</label>
                  <input type="color" value={config.textColor || t.textColor} onChange={e => update("textColor", e.target.value)}
                    className="w-full h-9 rounded cursor-pointer border border-gray-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Accent Color</label>
                  <input type="color" value={config.accentColor || t.accentColor} onChange={e => update("accentColor", e.target.value)}
                    className="w-full h-9 rounded cursor-pointer border border-gray-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Border Width: {config.borderWidth}px</label>
                  <input type="range" min="0" max="8" value={config.borderWidth} onChange={e => update("borderWidth", parseInt(e.target.value))}
                    className="w-full accent-amber-500" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Corner Radius: {config.cornerRadius}px</label>
                  <input type="range" min="0" max="24" value={config.cornerRadius} onChange={e => update("cornerRadius", parseInt(e.target.value))}
                    className="w-full accent-amber-500" />
                </div>
              </div>
              {config.borderWidth > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Border Color</label>
                  <input type="color" value={config.borderColor} onChange={e => update("borderColor", e.target.value)}
                    className="w-full h-9 rounded cursor-pointer border border-gray-200" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "showBadge", label: "Show Badge" },
                  { key: "showLogo", label: "Show Logo" },
                  { key: "showSubtext", label: "Show Subtext" },
                  { key: "showCta", label: "Show CTA Button" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={config[key]} onChange={e => update(key, e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded" />
                    {label}
                  </label>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setConfig(prev => ({ ...prev, bgColor: "", textColor: "", accentColor: "" }))}>
                Reset Colors to Template
              </Button>
            </div>
          )}
        </div>

        {/* Right: Canvas Preview */}
        <div className="xl:col-span-2">
          <Card className="border-none shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Preview — {selectedSize.label} ({selectedSize.desc})
                </CardTitle>
                <Badge variant="secondary" className="text-xs">{Math.round(scale * 100)}% zoom</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-xl flex items-center justify-center p-6 min-h-[240px]"
                style={{ backgroundImage: "repeating-conic-gradient(#d1d5db 0% 25%, transparent 0% 50%) 0 0 / 16px 16px" }}>
                <div style={{ width: previewW, height: previewH, position: "relative" }}>
                  <canvas
                    ref={canvasRef}
                    style={{
                      width: previewW,
                      height: previewH,
                      display: "block",
                      borderRadius: config.cornerRadius * scale,
                      boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
                    }}
                  />
                </div>
              </div>

              {/* Quick size switcher below preview */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {BANNER_SIZES.map(size => (
                  <button key={size.label} onClick={() => setSelectedSize(size)}
                    className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all border ${selectedSize.label === size.label ? "bg-amber-500 text-white border-amber-500" : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"}`}>
                    {size.desc}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active link display */}
          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
            <Link className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="flex-1">
              <strong>Affiliate Link:</strong>{" "}
              <span className="font-mono text-blue-700 break-all">{affiliateUrl}</span>
              {selectedAffiliate && <span className="ml-2 text-amber-700">— {selectedAffiliate.firstName} {selectedAffiliate.lastName}</span>}
            </span>
          </div>

          {/* Batch export info */}
          <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700 flex items-start gap-2">
            <Image className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              <strong>Tip:</strong> Select each size and click <strong>Download PNG</strong> to export that size. The banner renders at full resolution regardless of preview zoom.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}