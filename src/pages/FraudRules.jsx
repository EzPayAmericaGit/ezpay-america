import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, Shield, AlertTriangle, CheckCircle2, XCircle, TrendingUp, BarChart3, Lock, Eye } from "lucide-react";
import SEOHead from "../components/SEOHead";

const RULE_TYPES = [
  { value: "velocity", label: "Velocity Check", desc: "Block if too many transactions in a time window" },
  { value: "amount", label: "Amount Limit", desc: "Block transactions above/below a threshold" },
  { value: "country", label: "Country Block", desc: "Block transactions from specific countries" },
  { value: "card_type", label: "Card Type Filter", desc: "Restrict by card network or type" },
  { value: "email_domain", label: "Email Domain", desc: "Block disposable or suspicious email domains" },
  { value: "ip_range", label: "IP Range Block", desc: "Block traffic from specific IP ranges" },
  { value: "bin_block", label: "BIN Block", desc: "Block specific card BIN ranges" },
  { value: "custom", label: "Custom Rule", desc: "Custom condition with manual parameters" },
];

const ACTION_COLORS = {
  block: "bg-red-100 text-red-700 border-red-200",
  review: "bg-yellow-100 text-yellow-700 border-yellow-200",
  flag: "bg-orange-100 text-orange-700 border-orange-200",
  allow: "bg-green-100 text-green-700 border-green-200",
};

const ACTION_ICONS = {
  block: XCircle,
  review: Eye,
  flag: AlertTriangle,
  allow: CheckCircle2,
};

function RuleConditionFields({ ruleType, conditions, onChange }) {
  const update = (key, val) => onChange({ ...conditions, [key]: val });

  if (ruleType === "velocity") return (
    <div className="grid grid-cols-2 gap-3">
      <div><label className="text-xs text-gray-500">Max Transactions</label>
        <Input type="number" className="mt-1" value={conditions.maxCount || ""} onChange={e => update("maxCount", e.target.value)} placeholder="5" /></div>
      <div><label className="text-xs text-gray-500">Time Window (minutes)</label>
        <Input type="number" className="mt-1" value={conditions.windowMinutes || ""} onChange={e => update("windowMinutes", e.target.value)} placeholder="60" /></div>
    </div>
  );

  if (ruleType === "amount") return (
    <div className="grid grid-cols-2 gap-3">
      <div><label className="text-xs text-gray-500">Min Amount ($)</label>
        <Input type="number" className="mt-1" value={conditions.minAmount || ""} onChange={e => update("minAmount", e.target.value)} placeholder="0" /></div>
      <div><label className="text-xs text-gray-500">Max Amount ($)</label>
        <Input type="number" className="mt-1" value={conditions.maxAmount || ""} onChange={e => update("maxAmount", e.target.value)} placeholder="10000" /></div>
    </div>
  );

  if (ruleType === "country") return (
    <div><label className="text-xs text-gray-500">Blocked Countries (comma-separated ISO codes)</label>
      <Input className="mt-1" value={conditions.countries || ""} onChange={e => update("countries", e.target.value)} placeholder="NG, RU, KP, IR" /></div>
  );

  if (ruleType === "card_type") return (
    <div><label className="text-xs text-gray-500">Blocked Card Types (comma-separated)</label>
      <Input className="mt-1" value={conditions.cardTypes || ""} onChange={e => update("cardTypes", e.target.value)} placeholder="prepaid, gift, corporate" /></div>
  );

  if (ruleType === "email_domain") return (
    <div><label className="text-xs text-gray-500">Blocked Email Domains (comma-separated)</label>
      <Input className="mt-1" value={conditions.domains || ""} onChange={e => update("domains", e.target.value)} placeholder="mailinator.com, guerrillamail.com" /></div>
  );

  if (ruleType === "ip_range") return (
    <div><label className="text-xs text-gray-500">Blocked IP Ranges (CIDR, comma-separated)</label>
      <Input className="mt-1" value={conditions.ipRanges || ""} onChange={e => update("ipRanges", e.target.value)} placeholder="192.168.1.0/24, 10.0.0.0/8" /></div>
  );

  if (ruleType === "bin_block") return (
    <div><label className="text-xs text-gray-500">Blocked BIN Prefixes (comma-separated)</label>
      <Input className="mt-1" value={conditions.bins || ""} onChange={e => update("bins", e.target.value)} placeholder="400000, 411111" /></div>
  );

  return (
    <div><label className="text-xs text-gray-500">Custom Condition (JSON)</label>
      <Input className="mt-1 font-mono text-xs" value={conditions.custom || ""} onChange={e => update("custom", e.target.value)} placeholder='{"field": "amount", "operator": "gt", "value": 500}' /></div>
  );
}

function RuleForm({ rule, onSave, onClose }) {
  const [form, setForm] = useState({
    name: rule?.name || "",
    description: rule?.description || "",
    ruleType: rule?.ruleType || "velocity",
    action: rule?.action || "flag",
    conditions: rule?.conditions || {},
    isActive: rule?.isActive ?? true,
    priority: rule?.priority ?? 5,
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Rule Name *</label>
        <Input className="mt-1" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="High-Value Transaction Block" />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700">Description</label>
        <Input className="mt-1" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What this rule does" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Rule Type *</label>
          <Select value={form.ruleType} onValueChange={v => setForm({ ...form, ruleType: v, conditions: {} })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {RULE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Action *</label>
          <Select value={form.action} onValueChange={v => setForm({ ...form, action: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="review">Send to Review</SelectItem>
              <SelectItem value="flag">Flag for Monitoring</SelectItem>
              <SelectItem value="allow">Allow (Whitelist)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Conditions</label>
        <div className="p-3 bg-gray-50 rounded-lg">
          <RuleConditionFields ruleType={form.ruleType} conditions={form.conditions} onChange={c => setForm({ ...form, conditions: c })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700">Priority (1–10)</label>
          <Input type="number" min={1} max={10} className="mt-1" value={form.priority} onChange={e => setForm({ ...form, priority: parseInt(e.target.value) || 5 })} />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch checked={form.isActive} onCheckedChange={v => setForm({ ...form, isActive: v })} />
          <span className="text-sm text-gray-700">Active</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => { if (form.name && form.ruleType) onSave(form); }}>
          {rule ? "Save Changes" : "Create Rule"}
        </Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

export default function FraudRules() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterAction, setFilterAction] = useState("all");
  const qc = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') window.location.href = '/';
      setUser(u);
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: rules = [] } = useQuery({
    queryKey: ['fraud_rules'],
    queryFn: () => base44.entities.FraudRule.list('-priority'),
    enabled: !!user
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.FraudRule.create(data),
    onSuccess: () => { qc.invalidateQueries(['fraud_rules']); setShowForm(false); }
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.FraudRule.update(id, data),
    onSuccess: () => { qc.invalidateQueries(['fraud_rules']); setEditing(null); setShowForm(false); }
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FraudRule.delete(id),
    onSuccess: () => qc.invalidateQueries(['fraud_rules'])
  });

  const handleSave = (form) => {
    if (editing) updateMutation.mutate({ id: editing.id, data: form });
    else createMutation.mutate(form);
  };

  const toggleRule = (r) => updateMutation.mutate({ id: r.id, data: { isActive: !r.isActive } });

  const filtered = filterAction === "all" ? rules : rules.filter(r => r.action === filterAction);
  const totalProtected = rules.reduce((s, r) => s + (r.revenueProtected || 0), 0);
  const totalTriggers = rules.reduce((s, r) => s + (r.triggerCount || 0), 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <SEOHead title="Fraud Rules Management" description="Advanced fraud rule configuration and monitoring" />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Advanced Fraud Rules</h1>
            <p className="text-gray-500 mt-1">Configure AI + rules-based fraud detection for all transactions</p>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Rule
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-xs text-gray-500">Total Rules</p>
            <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500">Active Rules</p>
            <p className="text-2xl font-bold text-green-600">{rules.filter(r => r.isActive).length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500">Total Triggers</p>
            <p className="text-2xl font-bold text-orange-500">{totalTriggers.toLocaleString()}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-500">Revenue Protected</p>
            <p className="text-2xl font-bold text-blue-600">${totalProtected.toLocaleString()}</p>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "block", "review", "flag", "allow"].map(a => (
            <Button key={a} variant={filterAction === a ? "default" : "outline"} size="sm"
              className={filterAction === a ? "bg-amber-500 text-white hover:bg-amber-600" : ""}
              onClick={() => setFilterAction(a)}>
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </Button>
          ))}
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <Card className="p-12 text-center">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No fraud rules configured yet.</p>
              <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white" onClick={() => { setEditing(null); setShowForm(true); }}>
                <Plus className="w-4 h-4 mr-2" /> Add Your First Rule
              </Button>
            </Card>
          ) : filtered.sort((a, b) => (b.priority || 5) - (a.priority || 5)).map(rule => {
            const ActionIcon = ACTION_ICONS[rule.action] || AlertTriangle;
            const ruleTypeMeta = RULE_TYPES.find(t => t.value === rule.ruleType);
            return (
              <Card key={rule.id} className={`border-l-4 ${rule.isActive ? 'border-l-amber-500' : 'border-l-gray-200'}`}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{rule.name}</h3>
                        <Badge className={`text-xs border ${ACTION_COLORS[rule.action]}`}>
                          <ActionIcon className="w-3 h-3 mr-1" />{rule.action}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{ruleTypeMeta?.label || rule.ruleType}</Badge>
                        <Badge variant="outline" className="text-xs">Priority {rule.priority}</Badge>
                        {!rule.isActive && <Badge className="bg-gray-100 text-gray-500 text-xs">Disabled</Badge>}
                      </div>
                      {rule.description && <p className="text-sm text-gray-500 mb-2">{rule.description}</p>}
                      {rule.conditions && Object.keys(rule.conditions).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {Object.entries(rule.conditions).map(([k, v]) => (
                            <span key={k} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">{k}: {v}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 text-xs text-gray-400 mt-2">
                        <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-orange-400" />{rule.triggerCount || 0} triggers</span>
                        {rule.revenueProtected > 0 && <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-500" />${(rule.revenueProtected || 0).toLocaleString()} protected</span>}
                        {rule.lastTriggered && <span>Last: {new Date(rule.lastTriggered).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule)} />
                      <Button variant="outline" size="icon" onClick={() => { setEditing(rule); setShowForm(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600"
                        onClick={() => { if (confirm("Delete this rule?")) deleteMutation.mutate(rule.id); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pre-built Templates */}
        <Card className="mt-8">
          <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5 text-amber-500" /> Recommended Rule Templates</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: "High-Value Block", ruleType: "amount", action: "review", conditions: { maxAmount: "5000" }, description: "Send to review any transaction over $5,000", priority: 8 },
                { name: "Velocity Limiter", ruleType: "velocity", action: "block", conditions: { maxCount: "5", windowMinutes: "60" }, description: "Block card if used more than 5 times/hour", priority: 9 },
                { name: "High-Risk Countries", ruleType: "country", action: "block", conditions: { countries: "NG, KP, IR, BY" }, description: "Block transactions from high-risk countries", priority: 10 },
                { name: "Disposable Emails", ruleType: "email_domain", action: "flag", conditions: { domains: "mailinator.com, guerrillamail.com, tempmail.com" }, description: "Flag orders from disposable email providers", priority: 6 },
              ].map((t, i) => (
                <div key={i} className="border rounded-lg p-4 hover:border-amber-300 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-gray-900">{t.name}</h4>
                    <Badge className={`text-xs border ${ACTION_COLORS[t.action]}`}>{t.action}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{t.description}</p>
                  <Button size="sm" variant="outline" className="w-full text-xs hover:bg-amber-50 hover:border-amber-300"
                    onClick={() => createMutation.mutate({ ...t, isActive: true, triggerCount: 0, revenueProtected: 0 })}>
                    <Plus className="w-3 h-3 mr-1" /> Add This Rule
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={v => { if (!v) { setShowForm(false); setEditing(null); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Fraud Rule" : "Add Fraud Rule"}</DialogTitle>
          </DialogHeader>
          <RuleForm rule={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}