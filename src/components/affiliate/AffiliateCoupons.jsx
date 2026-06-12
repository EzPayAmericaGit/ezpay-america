import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Copy, CheckCircle2 } from "lucide-react";

export default function AffiliateCoupons({ affiliateId }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Get coupons assigned to this affiliate OR global coupons
        const all = await base44.entities.AffiliateCoupon.filter({ isActive: true });
        const mine = all.filter(c => !c.affiliateId || c.affiliateId === affiliateId);
        setCoupons(mine);
      } catch (e) {
        setCoupons([]);
      }
      setLoading(false);
    };
    if (affiliateId) load();
  }, [affiliateId]);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date();
  const isMaxed = (c) => c.maxUses && c.currentUses >= c.maxUses;

  if (loading) return <div className="text-center py-8 text-gray-400">Loading coupons...</div>;

  if (coupons.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="py-12 text-center">
          <Tag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No coupon codes available</p>
          <p className="text-gray-400 text-sm mt-1">Check back later or contact your account manager for exclusive discount codes.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Your Discount Codes</h2>
        <p className="text-sm text-gray-500">Share these coupon codes with potential merchants to sweeten the deal</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {coupons.map(c => {
          const expired = isExpired(c);
          const maxed = isMaxed(c);
          const unavailable = expired || maxed || !c.isActive;
          return (
            <Card key={c.id} className={`border-2 ${unavailable ? "border-gray-200 opacity-60" : "border-amber-200"} shadow-sm`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-4 h-4 text-amber-600" />
                    </div>
                    {c.affiliateId === affiliateId ? (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">Your Exclusive</Badge>
                    ) : (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">Global</Badge>
                    )}
                  </div>
                  {expired ? <Badge className="bg-red-100 text-red-700 text-xs">Expired</Badge>
                    : maxed ? <Badge className="bg-gray-100 text-gray-600 text-xs">Maxed Out</Badge>
                    : <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <code className="flex-1 text-lg font-bold font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                    {c.code}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={unavailable}
                    onClick={() => copyCode(c.code)}
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    {copied === c.code ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="text-sm text-gray-700 font-semibold mb-1">
                  {c.discountType === "flat" ? `$${c.discountValue} off` : `${c.discountValue}% off`}
                  {c.description && <span className="font-normal text-gray-500"> — {c.description}</span>}
                </div>

                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{c.currentUses || 0}{c.maxUses ? ` / ${c.maxUses} uses` : " uses"}</span>
                  {c.expiresAt && <span>Expires {new Date(c.expiresAt).toLocaleDateString()}</span>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>💡 How to use:</strong> Share these coupon codes with businesses you refer to EzPay America. When they mention the code during signup, it's tracked to your account and they get the discount!
      </div>
    </div>
  );
}