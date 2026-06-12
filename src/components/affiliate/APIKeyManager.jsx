import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Key, Copy, Eye, EyeOff, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";

const SCOPES = ["read:affiliates", "write:affiliates", "read:referrals", "write:referrals", "read:payouts", "write:payouts", "read:analytics"];

export default function APIKeyManager() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialog, setCreateDialog] = useState(false);
  const [newKey, setNewKey] = useState({ name: "", scopes: [], expiresIn: "never" });
  const [generatedKey, setGeneratedKey] = useState(null);
  const [visible, setVisible] = useState({});
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    try {
      // Store API keys as Settings records with type="api_key"
      const all = await base44.entities.Settings.filter({ type: "api_key" });
      setKeys(all);
    } catch {
      setKeys([]);
    }
    setLoading(false);
  };

  const generateAPIKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "rq_live_";
    for (let i = 0; i < 40; i++) key += chars[Math.floor(Math.random() * chars.length)];
    return key;
  };

  const createKey = async () => {
    const raw = generateAPIKey();
    const expiry = newKey.expiresIn === "never" ? null :
      new Date(Date.now() + parseInt(newKey.expiresIn) * 24 * 60 * 60 * 1000).toISOString();
    const created = await base44.entities.Settings.create({
      type: "api_key",
      key: newKey.name,
      value: {
        keyPreview: raw.slice(0, 12) + "..." + raw.slice(-4),
        keyHash: raw, // in production you'd hash this
        scopes: newKey.scopes,
        expiresAt: expiry,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        usageCount: 0,
      }
    });
    setKeys(prev => [created, ...prev]);
    setGeneratedKey(raw);
    setCreateDialog(false);
    setNewKey({ name: "", scopes: [], expiresIn: "never" });
  };

  const revokeKey = async (id) => {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    await base44.entities.Settings.update(id, { value: { ...keys.find(k => k.id === id)?.value, isActive: false } });
    loadKeys();
  };

  const copyKey = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleScope = (scope) => {
    setNewKey(prev => ({
      ...prev,
      scopes: prev.scopes.includes(scope) ? prev.scopes.filter(s => s !== scope) : [...prev.scopes, scope]
    }));
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6">
      {generatedKey && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-green-800 mb-1">API Key Generated — Copy it now!</p>
              <p className="text-xs text-green-700 mb-2">This key will not be shown again.</p>
              <div className="flex gap-2">
                <code className="flex-1 bg-white border border-green-200 rounded px-3 py-2 text-sm font-mono text-green-900 break-all">{generatedKey}</code>
                <Button size="sm" onClick={() => copyKey(generatedKey, "new")} className="bg-green-600 text-white">
                  {copied === "new" ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          <button onClick={() => setGeneratedKey(null)} className="text-xs text-green-600 mt-2 hover:underline">Dismiss</button>
        </div>
      )}

      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Key className="w-5 h-5" />API Keys</CardTitle>
            <Button onClick={() => setCreateDialog(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-1" />New API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No API keys yet. Create one to integrate with external systems.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map(k => (
                <div key={k.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{k.key}</p>
                      <Badge className={k.value?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} >
                        {k.value?.isActive ? "Active" : "Revoked"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">{k.value?.keyPreview}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(k.value?.scopes || []).map(s => (
                        <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Created {new Date(k.created_date).toLocaleDateString()}
                      {k.value?.expiresAt && ` • Expires ${new Date(k.value.expiresAt).toLocaleDateString()}`}
                      {k.value?.usageCount > 0 && ` • Used ${k.value.usageCount} times`}
                    </p>
                  </div>
                  {k.value?.isActive && (
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => revokeKey(k.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Create New API Key</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Key Name / Label</label>
              <Input placeholder="e.g. My Integration, Zapier, CRM" value={newKey.name} onChange={e => setNewKey({ ...newKey, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Scopes</label>
              <div className="grid grid-cols-2 gap-2">
                {SCOPES.map(scope => (
                  <label key={scope} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={newKey.scopes.includes(scope)} onChange={() => toggleScope(scope)} className="rounded" />
                    <span className="text-gray-700">{scope}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Expiration</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" value={newKey.expiresIn} onChange={e => setNewKey({ ...newKey, expiresIn: e.target.value })}>
                <option value="never">Never</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setCreateDialog(false)}>Cancel</Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" disabled={!newKey.name || newKey.scopes.length === 0} onClick={createKey}>
                Generate Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}