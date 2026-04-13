import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, RefreshCw, CheckCircle2, Plus, Trash2 } from "lucide-react";

const DEFAULT_TIERS = [
  {
    tier: "bronze", minConversions: 0, commissionRate: 10, bonusPerConversion: 0,
    description: "Starting tier for all new affiliates",
    perks: ["10% commission on all referrals", "Access to affiliate portal", "Marketing materials"],
    isActive: true,
  },
  {
    tier: "silver", minConversions: 5, commissionRate: 12, bonusPerConversion: 0,
    description: "Achieved after 5 successful conversions",
    perks: ["12% commission on all referrals", "Priority support", "Bonus marketing assets"],
    isActive: true,
  },
  {
    tier: "gold", minConversions: 10, commissionRate: 15, bonusPerConversion: 25,
    description: "High performer with 10+ conversions",
    perks: ["15% commission on all referrals", "$25 bonus per conversion", "Dedicated account manager", "Early access to new features"],
    isActive: true,
  },
  {
    tier: "platinum", minConversions: 20, commissionRate: 20, bonusPerConversion: 50,
    description: "Elite affiliate with 20+ conversions",
    perks: ["20% commission on all referrals", "$50 bonus per conversion", "Co-marketing opportunities", "Revenue share on sub-affiliates"],
    isActive: true,
  },
];

const TIER_ICONS = { bronze: "🥉", silver: "🥈", gold: "🥇", platinum: "💎" };
const TIER_COLORS = {
  bronze: "border-amber-300 bg-amber-50",
  silver: "border-gray-300 bg-gray-50",
  gold: "border-yellow-400 bg-yellow-50",
  platinum: "border-purple-400 bg-purple-50",
};
const TIER_BADGE = {
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-gray-100 text-gray-700",
  gold: "bg-yellow-100 text-yellow-800",
  platinum: "bg-purple-100 text-purple-800",
};

export default function CommissionTierManager() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => { loadTiers(); }, []);

  const loadTiers = async () => {
    setLoading(true);
    const data = await base44.entities.CommissionTier.list("minConversions");
    setTiers(data);
    setLoading(false);
  };

  const seedDefaults = async () => {
    setSeeding(true);
    for (const t of DEFAULT_TIERS) {
      await base44.entities.CommissionTier.create(t);
    }
    await loadTiers();
    setSeeding(false);
  };

  const updateField = (id, field, value) => {
    setTiers(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const updatePerk = (tierId, idx, value) => {
    setTiers(prev => prev.map(t => {
      if (t.id !== tierId) return t;
      const perks = [...(t.perks || [])];
      perks[idx] = value;
      return { ...t, perks };
    }));
  };

  const addPerk = (tierId) => {
    setTiers(prev => prev.map(t => t.id === tierId ? { ...t, perks: [...(t.perks || []), ""] } : t));
  };

  const removePerk = (tierId, idx) => {
    setTiers(prev => prev.map(t => {
      if (t.id !== tierId) return t;
      const perks = (t.perks || []).filter((_, i) => i !== idx);
      return { ...t, perks };
    }));
  };

  const saveTier = async (tier) => {
    setSaving(tier.id);
    await base44.entities.CommissionTier.update(tier.id, {
      commissionRate: Number(tier.commissionRate),
      bonusPerConversion: Number(tier.bonusPerConversion || 0),
      minConversions: Number(tier.minConversions),
      description: tier.description,
      perks: tier.perks || [],
      isActive: tier.isActive,
    });
    setSaving(null);
    setSavedIds(prev => new Set([...prev, tier.id]));
    setTimeout(() => setSavedIds(prev => { const s = new Set(prev); s.delete(tier.id); return s; }), 2000);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Configure commission rates, thresholds, and perks for each affiliate tier. Changes take effect on the next "Run Tier Upgrades".</p>
        <div className="flex gap-2">
          {tiers.length === 0 && (
            <Button variant="outline" onClick={seedDefaults} disabled={seeding} className="border-blue-400 text-blue-700">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Load Default Tiers
            </Button>
          )}
          <Button variant="outline" onClick={loadTiers}><RefreshCw className="w-4 h-4 mr-1" />Refresh</Button>
        </div>
      </div>

      {tiers.length === 0 && (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="py-12 text-center text-gray-400">
            No tier rules configured yet. Click "Load Default Tiers" to start.
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {tiers.map(t => (
          <Card key={t.id} className={`border-2 shadow ${TIER_COLORS[t.tier]}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{TIER_ICONS[t.tier]}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 capitalize text-lg">{t.tier} Tier</h3>
                    <Badge className={`${TIER_BADGE[t.tier]} text-xs`}>{t.isActive ? "Active" : "Inactive"}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-gray-900">{t.commissionRate}%</p>
                  <p className="text-xs text-gray-500">commission</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Min. Conversions to Unlock</label>
                  <Input type="number" min={0} value={t.minConversions}
                    onChange={e => updateField(t.id, "minConversions", e.target.value)}
                    className="h-9 text-center font-bold" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Commission Rate (%)</label>
                  <Input type="number" min={0} max={100} step={0.5} value={t.commissionRate}
                    onChange={e => updateField(t.id, "commissionRate", e.target.value)}
                    className="h-9 text-center font-bold" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Flat Bonus per Conversion ($)</label>
                <Input type="number" min={0} value={t.bonusPerConversion || 0}
                  onChange={e => updateField(t.id, "bonusPerConversion", e.target.value)}
                  className="h-9" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
                <Input value={t.description || ""} onChange={e => updateField(t.id, "description", e.target.value)}
                  className="h-9" placeholder="Tier description for affiliates" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-600">Perks (shown to affiliates)</label>
                  <button onClick={() => addPerk(t.id)} className="text-xs text-blue-600 hover:underline flex items-center gap-0.5">
                    <Plus className="w-3 h-3" />Add
                  </button>
                </div>
                <div className="space-y-1.5">
                  {(t.perks || []).map((perk, idx) => (
                    <div key={idx} className="flex gap-1">
                      <Input value={perk} onChange={e => updatePerk(t.id, idx, e.target.value)}
                        className="h-8 text-xs" placeholder="e.g. Priority support" />
                      <button onClick={() => removePerk(t.id, idx)} className="text-red-400 hover:text-red-600 px-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!t.perks || t.perks.length === 0) && (
                    <p className="text-xs text-gray-400 italic">No perks added</p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => saveTier(t)}
                disabled={saving === t.id}
                className={`w-full ${savedIds.has(t.id) ? "bg-green-500 hover:bg-green-600" : "bg-gray-900 hover:bg-gray-800"} text-white`}
              >
                {saving === t.id ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> :
                 savedIds.has(t.id) ? <CheckCircle2 className="w-4 h-4 mr-1" /> :
                 <Save className="w-4 h-4 mr-1" />}
                {savedIds.has(t.id) ? "Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p><strong>💡 How tier upgrades work:</strong> Changes to thresholds take effect when you click "Run Tier Upgrades" in the admin header. Affiliates are automatically notified by email when their tier changes.</p>
      </div>
    </div>
  );
}