import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const CAPTIONS = {
  facebook: (url) =>
    `💳 Tired of high credit card processing fees? EzPay America helps small businesses keep more of every sale — with zero-cost processing options, next-day funding, and local support.\n\n👉 Get a FREE rate comparison here:\n${url}\n\n#SmallBusiness #PaymentProcessing #CreditCardProcessing #EzPayAmerica`,
  instagram: (url) =>
    `💳 Stop overpaying on payment processing! EzPay America gives small businesses zero-cost processing, next-day funding & real support. 🙌\n\nLink in bio 👆 or visit:\n${url}\n\n#SmallBusiness #PaymentProcessing #MerchantServices #EzPayAmerica #CashDiscount`,
  twitter: (url) =>
    `Tired of high card processing fees? EzPay America offers zero-cost processing for small businesses. Free rate comparison 👇\n${url}\n#SmallBusiness #Payments`,
};

export default function SocialPostKit({ affiliateUrl, selectedAffiliate, onDownload }) {
  const [copiedPlatform, setCopiedPlatform] = useState(null);

  const utmUrl = (platform) => {
    const base = affiliateUrl.includes("?") ? affiliateUrl + "&" : affiliateUrl + "?";
    return `${base}utm_source=${platform}&utm_medium=social&utm_campaign=affiliate`;
  };

  const copyCaption = (platform) => {
    navigator.clipboard.writeText(CAPTIONS[platform](utmUrl(platform))).then(() => {
      setCopiedPlatform(platform);
      setTimeout(() => setCopiedPlatform(null), 2500);
    });
  };

  const platforms = [
    { id: "facebook", label: "Facebook", color: "bg-blue-600 hover:bg-blue-700", icon: "📘" },
    { id: "instagram", label: "Instagram", color: "bg-pink-500 hover:bg-pink-600", icon: "📸" },
    { id: "twitter", label: "X / Twitter", color: "bg-gray-900 hover:bg-black", icon: "🐦" },
  ];

  return (
    <div className="mt-3 border border-green-200 bg-green-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-green-900">📲 Social Media Post Kit</p>
          <p className="text-xs text-green-700 mt-0.5">
            Step 1: Download the banner PNG. Step 2: Copy a ready-made caption with your tracking link already included. Paste both into your post.
          </p>
        </div>
        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white shrink-0 ml-3" onClick={onDownload}>
          <Download className="w-3.5 h-3.5 mr-1" />Download PNG
        </Button>
      </div>

      {selectedAffiliate && (
        <div className="mb-3 bg-white border border-green-100 rounded-lg px-3 py-2 text-xs text-green-800">
          <strong>Affiliate:</strong> {selectedAffiliate.firstName} {selectedAffiliate.lastName} &nbsp;·&nbsp;
          <strong>Code:</strong> {selectedAffiliate.referralCode}
        </div>
      )}

      <div className="space-y-2">
        {platforms.map((p) => (
          <div key={p.id} className="bg-white border border-green-100 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">{p.icon} {p.label} Caption</span>
              <Button
                size="sm"
                className={`${p.color} text-white text-xs h-7 px-3`}
                onClick={() => copyCaption(p.id)}
              >
                {copiedPlatform === p.id
                  ? <><Check className="w-3 h-3 mr-1" />Copied!</>
                  : <><Copy className="w-3 h-3 mr-1" />Copy Caption</>}
              </Button>
            </div>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded p-2 max-h-28 overflow-y-auto">
              {CAPTIONS[p.id](utmUrl(p.id))}
            </pre>
          </div>
        ))}
      </div>

      <p className="text-xs text-green-700 mt-3">
        💡 <strong>Tip:</strong> Each caption includes a unique UTM tracking link so you can see exactly which platform drives the most referrals.
      </p>
    </div>
  );
}