import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw, Copy, Check } from "lucide-react";

const PLATFORMS = [
  {
    id: "facebook",
    label: "Facebook",
    color: "bg-blue-600 hover:bg-blue-700",
    icon: "𝑓",
    maxChars: 5000,
    fn: "postToFacebook",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "bg-sky-700 hover:bg-sky-800",
    icon: "in",
    maxChars: 3000,
    fn: "postToLinkedIn",
  },
  {
    id: "x",
    label: "X / Twitter",
    color: "bg-gray-900 hover:bg-black",
    icon: "𝕏",
    maxChars: 280,
    fn: "postToX",
  },
];

const SITE_ORIGIN = "https://ezpayamerica.com";

function buildArticleUrl(article) {
  if (article.slug) return `${SITE_ORIGIN}/news/${article.slug}`;
  // Use the /news/:id route so it's always routable
  return `${SITE_ORIGIN}/news/${article.id}`;
}

function buildDefaultMessage(article, platform) {
  const link = buildArticleUrl(article);
  const base = `${article.title}\n\n${article.excerpt || ""}`;
  if (platform === "x") {
    const msg = `${article.title} ${link}`;
    return msg.length <= 280 ? msg : `${article.title.substring(0, 220)}... ${link}`;
  }
  // For LinkedIn and Facebook: link is sent separately as a preview card, don't duplicate in text
  return base;
}

export default function SocialShareDialog({ article, open, onClose }) {
  const [messages, setMessages] = useState(() => {
    const m = {};
    PLATFORMS.forEach(p => { m[p.id] = buildDefaultMessage(article, p.id); });
    return m;
  });
  const [status, setStatus] = useState({});
  const [generating, setGenerating] = useState(null);
  const [tab, setTab] = useState("link"); // "link" | "full"
  const [copied, setCopied] = useState(false);

  const fullArticleText = `${article.title}\n\n${article.excerpt || ""}\n\n${article.content || ""}`.trim();

  const copyFullArticle = () => {
    navigator.clipboard.writeText(fullArticleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aiGenerate = async (platformId) => {
    setGenerating(platformId);
    const platform = PLATFORMS.find(p => p.id === platformId);
    const link = buildArticleUrl(article);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a compelling social media post for ${platform.label} about this article.
Article title: "${article.title}"
Article excerpt: "${article.excerpt || ""}"
Article content: "${(article.content || "").substring(0, 1000)}"
Link: ${link}
${platformId === "x" ? "CRITICAL: Must be under 280 characters including the link." : `Max ${platform.maxChars} characters.`}
${platformId === "linkedin" ? "Professional tone, add relevant hashtags." : ""}
${platformId === "facebook" ? "Engaging and conversational tone, add 2-3 relevant emojis." : ""}
${platformId === "x" ? "Punchy and concise. Include link. Add 1-2 hashtags." : ""}
Return only the post text, nothing else.`,
    });
    setMessages(prev => ({ ...prev, [platformId]: result }));
    setGenerating(null);
  };

  const post = async (platform) => {
    setStatus(prev => ({ ...prev, [platform.id]: { state: "posting" } }));
    const link = buildArticleUrl(article);
    const res = await base44.functions.invoke(platform.fn, {
      message: messages[platform.id],
      link: platform.id !== "x" ? link : undefined,
      image_url: article.image || undefined,
    });
    if (res?.data?.success) {
      setStatus(prev => ({ ...prev, [platform.id]: { state: "success", msg: res.data.message } }));
    } else {
      setStatus(prev => ({ ...prev, [platform.id]: { state: "error", msg: res?.data?.error || "Post failed" } }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Share Article to Social Media
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1 font-normal">"{article.title}"</p>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex gap-2 mt-2 border-b pb-2">
          <button
            onClick={() => setTab("link")}
            className={`text-sm font-medium px-3 py-1.5 rounded-t transition-colors ${tab === "link" ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-gray-500 hover:text-gray-800"}`}
          >
            Post Link
          </button>
          <button
            onClick={() => setTab("full")}
            className={`text-sm font-medium px-3 py-1.5 rounded-t transition-colors ${tab === "full" ? "bg-amber-50 text-amber-700 border border-amber-200" : "text-gray-500 hover:text-gray-800"}`}
          >
            Full Article Content
          </button>
        </div>

        {/* Full Article Tab */}
        {tab === "full" && (
          <div className="space-y-4 mt-2">
            {article.image && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Article Image</p>
                <img src={article.image} alt={article.title} className="w-full max-h-64 object-cover rounded-lg border" />
                <a
                  href={article.image}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-amber-600 underline"
                >
                  Download Image
                </a>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Full Article Text</p>
                <Button size="sm" variant="outline" onClick={copyFullArticle} className="h-7 text-xs gap-1">
                  {copied ? <><Check className="w-3 h-3" />Copied!</> : <><Copy className="w-3 h-3" />Copy All Text</>}
                </Button>
              </div>
              <Textarea
                value={fullArticleText}
                readOnly
                rows={14}
                className="text-sm text-gray-700 bg-gray-50 font-mono resize-none"
              />
            </div>
            <p className="text-xs text-gray-500 bg-gray-50 rounded p-3 border">
              💡 Copy the text and download the image above, then paste directly into Facebook, LinkedIn, or any platform to post without a web link.
            </p>
          </div>
        )}

        <div className={`space-y-5 mt-2 ${tab !== "link" ? "hidden" : ""}`}>
          {PLATFORMS.map(platform => {
            const s = status[platform.id];
            const msg = messages[platform.id] || "";
            const overLimit = msg.length > platform.maxChars;

            return (
              <div key={platform.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 rounded-lg ${platform.color} text-white flex items-center justify-center text-sm font-bold`}>
                      {platform.icon}
                    </span>
                    <span className="font-semibold text-gray-900">{platform.label}</span>
                    {s?.state === "success" && <Badge className="bg-green-100 text-green-700 text-xs">Posted ✓</Badge>}
                    {s?.state === "error" && <Badge className="bg-red-100 text-red-700 text-xs">Failed</Badge>}
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs text-purple-600 h-7 gap-1"
                    disabled={generating === platform.id}
                    onClick={() => aiGenerate(platform.id)}>
                    {generating === platform.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                    AI Write
                  </Button>
                </div>

                <Textarea
                  value={msg}
                  onChange={e => setMessages(prev => ({ ...prev, [platform.id]: e.target.value }))}
                  rows={platform.id === "x" ? 3 : 4}
                  className={overLimit ? "border-red-400" : ""}
                  placeholder={`Write your ${platform.label} post...`}
                />

                <div className="flex items-center justify-between">
                  <span className={`text-xs ${overLimit ? "text-red-500 font-semibold" : "text-gray-400"}`}>
                    {msg.length} / {platform.maxChars} chars {overLimit ? "— too long!" : ""}
                  </span>
                  <div className="flex items-center gap-2">
                    {s?.state === "error" && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{s.msg}
                      </span>
                    )}
                    {s?.state === "success" && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />{s.msg}
                      </span>
                    )}
                    <Button
                      size="sm"
                      className={`${platform.color} text-white h-8 px-4 text-xs`}
                      disabled={s?.state === "posting" || overLimit || !msg.trim() || s?.state === "success"}
                      onClick={() => post(platform)}
                    >
                      {s?.state === "posting" ? (
                        <><Loader2 className="w-3 h-3 animate-spin mr-1" />Posting...</>
                      ) : s?.state === "success" ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" />Posted</>
                      ) : (
                        `Post to ${platform.label}`
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tab === "link" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mt-2">
            <strong>Setup required:</strong> Facebook needs <code>FACEBOOK_PAGE_ACCESS_TOKEN</code> + <code>FACEBOOK_PAGE_ID</code>. LinkedIn needs <code>LINKEDIN_ACCESS_TOKEN</code> + <code>LINKEDIN_ORGANIZATION_ID</code>. X needs <code>X_API_KEY</code>, <code>X_API_SECRET</code>, <code>X_ACCESS_TOKEN</code>, <code>X_ACCESS_TOKEN_SECRET</code>. Set these in the app secrets.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}