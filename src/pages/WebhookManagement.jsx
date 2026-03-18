import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Webhook, CheckCircle2, XCircle, AlertCircle, RefreshCw, Copy, Eye, EyeOff } from "lucide-react";
import SEOHead from "../components/SEOHead";

const ALL_EVENTS = [
  "payment.completed", "payment.failed", "payment.refunded",
  "chargeback.created", "chargeback.resolved",
  "application.submitted", "application.approved", "application.declined",
  "demo.requested", "order.created", "order.shipped", "order.delivered",
  "subscription.created", "subscription.cancelled", "subscription.renewed",
  "fraud.flagged", "fraud.blocked"
];

function WebhookForm({ webhook, onSave, onClose }) {
  const [form, setForm] = useState({
    name: webhook?.name || "",
    url: webhook?.url || "",
    secret: webhook?.secret || Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
    events: webhook?.events || [],
    isActive: webhook?.isActive ?? true,
    retryEnabled: webhook?.retryEnabled ?? true,
    maxRetries: webhook?.maxRetries ?? 3
  });
  const [showSecret, setShowSecret] = useState(false);

  const toggleEvent = (evt) => {
    setForm(f => ({
      ...f,
      events: f.events.includes(evt) ? f.events.filter(e => e !== evt) : [...f.events, evt]
    }));
  };

  const handleSave = () => {
    if (!form.name || !form.url) return;
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Webhook Name *</label>
        <Input className="mt-1" placeholder="My Webhook" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Endpoint URL *</label>
        <Input className="mt-1" placeholder="https://your-server.com/webhook" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Signing Secret</label>
        <div className="flex gap-2 mt-1">
          <Input type={showSecret ? "text" : "password"} value={form.secret} onChange={e => setForm({ ...form, secret: e.target.value })} className="font-mono text-sm" />
          <Button type="button" variant="outline" size="icon" onClick={() => setShowSecret(!showSecret)}>
            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(form.secret)}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Used to verify webhook signatures (HMAC-SHA256)</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Subscribe to Events</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
          {ALL_EVENTS.map(evt => (
            <label key={evt} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200">
              <input type="checkbox" checked={form.events.includes(evt)} onChange={() => toggleEvent(evt)} className="w-3.5 h-3.5 accent-amber-500" />
              <span className="text-xs text-gray-700 font-mono">{evt}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between py-2 border-t">
        <div>
          <p className="text-sm font-medium text-gray-700">Active</p>
          <p className="text-xs text-gray-400">Enable or disable this endpoint</p>
        </div>
        <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
      </div>
      <div className="flex items-center justify-between py-2 border-t">
        <div>
          <p className="text-sm font-medium text-gray-700">Auto-Retry on Failure</p>
          <p className="text-xs text-gray-400">Retry failed deliveries up to {form.maxRetries} times</p>
        </div>
        <Switch checked={form.retryEnabled} onCheckedChange={v => setForm({ ...form, retryEnabled: v })} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={handleSave}>
          {webhook ? "Save Changes" : "Create Webhook"}
        </Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

export default function WebhookManagement() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') window.location.href = '/';
      setUser(u);
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: webhooks = [] } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () => base44.entities.WebhookEndpoint.list('-created_date'),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.WebhookEndpoint.create(data),
    onSuccess: () => { qc.invalidateQueries(['webhooks']); setShowForm(false); }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.WebhookEndpoint.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['webhooks']); setEditing(null); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.WebhookEndpoint.delete(id),
    onSuccess: () => qc.invalidateQueries(['webhooks'])
  });

  const toggleActive = (wh) => {
    updateMutation.mutate({ id: wh.id, data: { isActive: !wh.isActive } });
  };

  const handleSave = (form) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const openEdit = (wh) => { setEditing(wh); setShowForm(true); };

  const totalDeliveries = webhooks.reduce((s, w) => s + (w.totalDeliveries || 0), 0);
  const totalSuccess = webhooks.reduce((s, w) => s + (w.successDeliveries || 0), 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <SEOHead title="Webhook Management" description="Manage webhook endpoints and event subscriptions" />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Webhook Management</h1>
            <p className="text-gray-500 mt-1">Configure endpoints to receive real-time event notifications</p>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Webhook
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Webhooks", value: webhooks.length, color: "text-gray-900" },
            { label: "Active", value: webhooks.filter(w => w.isActive).length, color: "text-green-600" },
            { label: "Total Deliveries", value: totalDeliveries.toLocaleString(), color: "text-blue-600" },
            { label: "Success Rate", value: totalDeliveries > 0 ? `${Math.round((totalSuccess / totalDeliveries) * 100)}%` : "—", color: "text-amber-600" },
          ].map((s, i) => (
            <Card key={i} className="p-4">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Events Reference */}
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Available Event Types</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {ALL_EVENTS.map(e => (
                <Badge key={e} variant="outline" className="font-mono text-xs">{e}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Webhook List */}
        <div className="space-y-4">
          {webhooks.length === 0 ? (
            <Card className="p-12 text-center">
              <Webhook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No webhooks configured yet.</p>
              <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => { setEditing(null); setShowForm(true); }}>
                <Plus className="w-4 h-4 mr-2" /> Add Your First Webhook
              </Button>
            </Card>
          ) : webhooks.map(wh => (
            <Card key={wh.id} className={`border-l-4 ${wh.isActive ? 'border-l-green-500' : 'border-l-gray-300'}`}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{wh.name}</h3>
                      <Badge className={wh.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                        {wh.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {wh.failureCount > 0 && (
                        <Badge className="bg-red-100 text-red-600">
                          <AlertCircle className="w-3 h-3 mr-1" />{wh.failureCount} failures
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 font-mono truncate mb-3">{wh.url}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(wh.events || []).map(e => (
                        <Badge key={e} variant="outline" className="text-xs font-mono">{e}</Badge>
                      ))}
                      {(!wh.events || wh.events.length === 0) && (
                        <span className="text-xs text-gray-400">No events subscribed</span>
                      )}
                    </div>
                    <div className="flex gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" />{wh.successDeliveries || 0} delivered</span>
                      <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400" />{wh.failureCount || 0} failed</span>
                      {wh.lastTriggered && <span>Last: {new Date(wh.lastTriggered).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Switch checked={wh.isActive} onCheckedChange={() => toggleActive(wh)} />
                    <Button variant="outline" size="icon" onClick={() => openEdit(wh)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600 hover:border-red-300"
                      onClick={() => { if (confirm("Delete this webhook?")) deleteMutation.mutate(wh.id); }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Docs */}
        <Card className="mt-8 bg-gray-900 text-white">
          <CardHeader><CardTitle className="text-amber-400">Webhook Payload Format</CardTitle></CardHeader>
          <CardContent>
            <pre className="text-sm text-green-300 overflow-x-auto">{`POST https://your-endpoint.com/webhook
Content-Type: application/json
X-EzPay-Signature: sha256=<HMAC-SHA256>
X-EzPay-Event: payment.completed

{
  "id": "evt_abc123",
  "type": "payment.completed",
  "created": 1711000000,
  "data": {
    "amount": 150.00,
    "currency": "USD",
    "merchant_id": "mid_xyz789"
  }
}`}</pre>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={showForm} onOpenChange={v => { if (!v) { setShowForm(false); setEditing(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Webhook" : "Add Webhook Endpoint"}</DialogTitle>
          </DialogHeader>
          <WebhookForm webhook={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}