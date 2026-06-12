import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Webhook, CheckCircle2, XCircle, RefreshCw, Zap } from "lucide-react";

const AVAILABLE_EVENTS = [
  { value: "affiliate.approved", label: "Affiliate Approved" },
  { value: "affiliate.rejected", label: "Affiliate Rejected" },
  { value: "affiliate.tier_upgrade", label: "Tier Upgrade" },
  { value: "referral.created", label: "Referral Created" },
  { value: "referral.converted", label: "Referral Converted" },
  { value: "referral.cancelled", label: "Referral Cancelled/Reversed" },
  { value: "payout.sent", label: "Payout Sent" },
  { value: "*", label: "All Events (wildcard)" },
];

export default function WebhookManager() {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", secret: "", events: [] });
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.WebhookEndpoint.list("-created_date");
    setEndpoints(data);
    setLoading(false);
  };

  const toggleEvent = (event) => {
    setForm(prev => ({
      ...prev,
      events: prev.events.includes(event)
        ? prev.events.filter(e => e !== event)
        : [...prev.events, event]
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.url) return;
    setSaving(true);
    const created = await base44.entities.WebhookEndpoint.create({
      name: form.name,
      url: form.url,
      secret: form.secret || null,
      events: form.events,
      isActive: true,
      totalDeliveries: 0,
      successDeliveries: 0,
      failureCount: 0,
    });
    setEndpoints(prev => [created, ...prev]);
    setDialogOpen(false);
    setForm({ name: "", url: "", secret: "", events: [] });
    setSaving(false);
  };

  const toggleActive = async (ep) => {
    await base44.entities.WebhookEndpoint.update(ep.id, { isActive: !ep.isActive });
    setEndpoints(prev => prev.map(e => e.id === ep.id ? { ...e, isActive: !e.isActive } : e));
  };

  const deleteEndpoint = async (id) => {
    if (!confirm("Delete this webhook endpoint?")) return;
    await base44.entities.WebhookEndpoint.delete(id);
    setEndpoints(prev => prev.filter(e => e.id !== id));
  };

  const testEndpoint = async (ep) => {
    setTesting(ep.id);
    try {
      await base44.functions.invoke("affiliateWebhook", {
        event: "test.ping",
        data: { message: "Webhook test from EzPay America", endpoint: ep.name, timestamp: new Date().toISOString() }
      });
      alert(`Test ping sent to ${ep.url}`);
    } catch (e) {
      alert("Test failed: " + e.message);
    }
    setTesting(null);
    load();
  };

  if (loading) return <div className="text-center py-10 text-gray-400">Loading webhooks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Webhook Endpoints</h2>
          <p className="text-sm text-gray-500">Receive real-time notifications when affiliate events occur</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load}><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
          <Button onClick={() => setDialogOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="w-4 h-4 mr-1" /> Add Endpoint
          </Button>
        </div>
      </div>

      {endpoints.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="py-12 text-center">
            <Webhook className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No webhooks configured</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">Add a webhook endpoint to receive real-time affiliate events in your CRM, Zapier, or custom system.</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-1" /> Add First Endpoint
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {endpoints.map(ep => {
            const successRate = ep.totalDeliveries > 0 ? Math.round((ep.successDeliveries / ep.totalDeliveries) * 100) : null;
            return (
              <Card key={ep.id} className={`border-2 ${ep.isActive ? "border-gray-100" : "border-gray-200 opacity-60"} shadow-sm`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ep.isActive ? "bg-green-100" : "bg-gray-100"}`}>
                        <Webhook className={`w-4 h-4 ${ep.isActive ? "text-green-600" : "text-gray-400"}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-900">{ep.name}</p>
                          {ep.isActive ? <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge> : <Badge className="bg-gray-100 text-gray-500 text-xs">Inactive</Badge>}
                          {ep.failureCount > 2 && <Badge className="bg-red-100 text-red-700 text-xs">⚠️ {ep.failureCount} failures</Badge>}
                        </div>
                        <p className="text-xs text-blue-600 font-mono mt-0.5 truncate">{ep.url}</p>
                        {ep.events?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {ep.events.map(e => <span key={e} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{e}</span>)}
                          </div>
                        )}
                        <div className="flex gap-4 text-xs text-gray-400 mt-1">
                          <span>{ep.totalDeliveries || 0} deliveries</span>
                          {successRate !== null && <span className={successRate >= 90 ? "text-green-600" : "text-red-500"}>{successRate}% success</span>}
                          {ep.lastTriggered && <span>Last: {new Date(ep.lastTriggered).toLocaleDateString()}</span>}
                          {ep.lastStatusCode && <span>Status: {ep.lastStatusCode}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => testEndpoint(ep)} disabled={testing === ep.id}>
                        <Zap className="w-3.5 h-3.5 mr-1" /> {testing === ep.id ? "..." : "Test"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleActive(ep)} className="text-xs">
                        {ep.isActive ? "Pause" : "Resume"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteEndpoint(ep.id)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>🔗 Webhook Payload Format:</strong> Each event sends a POST request with <code className="bg-blue-100 px-1 rounded">{"{ event, timestamp, data }"}</code>. Add a secret to verify requests via the <code className="bg-blue-100 px-1 rounded">X-EzPay-Secret</code> header. Works with Zapier, Make, n8n, and any HTTP endpoint.
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Webhook Endpoint</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
              <Input placeholder="e.g. Zapier CRM Sync" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Endpoint URL *</label>
              <Input placeholder="https://hooks.zapier.com/hooks/catch/..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Secret (optional)</label>
              <Input placeholder="Shared secret for verification" value={form.secret} onChange={e => setForm({ ...form, secret: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Subscribe to Events</label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {AVAILABLE_EVENTS.map(ev => (
                  <label key={ev.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={form.events.includes(ev.value)}
                      onCheckedChange={() => toggleEvent(ev.value)}
                    />
                    <span className="text-sm text-gray-700">{ev.label}</span>
                    <code className="text-xs text-gray-400">{ev.value}</code>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button disabled={saving || !form.name || !form.url} onClick={handleSave} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                {saving ? "Saving..." : "Add Endpoint"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}