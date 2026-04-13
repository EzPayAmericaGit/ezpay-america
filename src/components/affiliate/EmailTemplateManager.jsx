import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, Loader2, CheckCircle2, ToggleLeft, ToggleRight } from "lucide-react";

const TRIGGER_LABELS = {
  referral_submitted: "Referral Submitted",
  referral_converted: "Referral Converted",
  affiliate_approved: "Affiliate Approved",
  affiliate_tier_upgrade: "Tier Upgrade",
  payout_sent: "Payout Sent",
};

const DRIP_STEP_LABELS = {
  0: "Immediate (Step 0)",
  1: "48 hours (Step 1)",
  2: "5 days (Step 2)",
  3: "10 days (Step 3)",
};

const PLACEHOLDERS = ["{{leadName}}", "{{businessName}}", "{{affiliateName}}", "{{affiliateCode}}", "{{businessType}}", "{{applyUrl}}"];

const DEFAULT_TEMPLATES = [
  {
    name: "Referral Welcome (Drip 0)",
    dripStep: 0,
    triggerEvent: "referral_submitted",
    delayHours: 0,
    isActive: true,
    subject: "{{affiliateName}} thinks you'd love EzPay America 👋",
    bodyHtml: `<p>Hi {{leadName}},</p>
<p>Your colleague <strong>{{affiliateName}}</strong> thought you'd be a great fit for EzPay America.</p>
<p>We help {{businessType}} businesses like {{businessName}} <strong>eliminate credit card processing fees</strong> with our surcharge program.</p>
<ul>
  <li>✅ $0 in transaction fees</li>
  <li>✅ Free POS terminal or card reader</li>
  <li>✅ Next-day deposits</li>
  <li>✅ No contracts, cancel anytime</li>
</ul>
<p><a href="{{applyUrl}}">Apply Online — Takes 5 Minutes</a></p>
<p>— The EzPay America Team | (865) 316-9625</p>`
  },
  {
    name: "Fee Savings Follow-Up (Drip 1)",
    dripStep: 1,
    triggerEvent: "referral_submitted",
    delayHours: 48,
    isActive: true,
    subject: "How much are you paying in processing fees, {{leadName}}?",
    bodyHtml: `<p>Hi {{leadName}},</p>
<p>Most business owners pay 2–4% on every card transaction. On $20,000/month, that's up to $800/month in fees.</p>
<p><strong>With EzPay America's surcharge program, that number becomes $0.</strong></p>
<p><a href="{{applyUrl}}">Start My Free Application →</a></p>
<p>— EzPay America | (865) 316-9625</p>`
  },
  {
    name: "Free Equipment Offer (Drip 2)",
    dripStep: 2,
    triggerEvent: "referral_submitted",
    delayHours: 120,
    isActive: true,
    subject: "Free equipment + zero fees — still interested, {{leadName}}?",
    bodyHtml: `<p>Hi {{leadName}},</p>
<p>Approved EzPay merchants receive <strong>free POS equipment</strong> — no lease, no deposit, no catch.</p>
<ul>
  <li>🖥️ Free countertop terminal or POS system</li>
  <li>📱 Free mobile card reader</li>
  <li>💳 Free virtual terminal</li>
  <li>⚡ Next-day funding</li>
</ul>
<p><a href="{{applyUrl}}">Claim Your Free Equipment →</a></p>
<p>— EzPay America | (865) 316-9625</p>`
  },
  {
    name: "Last Follow-Up (Drip 3)",
    dripStep: 3,
    triggerEvent: "referral_submitted",
    delayHours: 240,
    isActive: true,
    subject: "Last follow-up — EzPay America for {{businessName}}",
    bodyHtml: `<p>Hi {{leadName}},</p>
<p>This is our last follow-up. We won't keep filling your inbox — but we want to make sure you had the chance to see what we can do for {{businessName}}.</p>
<ul>
  <li>Zero processing fees forever</li>
  <li>Free equipment to get started</li>
  <li>No long-term contracts</li>
  <li>Referred by {{affiliateName}} — someone who trusts us</li>
</ul>
<p><a href="{{applyUrl}}">Apply When You're Ready →</a></p>
<p>— EzPay America | (865) 316-9625</p>`
  },
];

export default function EmailTemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => { loadTemplates(); }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const data = await base44.entities.AffiliateEmailTemplate.list("-created_date");
    setTemplates(data);
    setLoading(false);
  };

  const openNew = () => {
    setEditingTemplate({
      name: "", dripStep: 0, subject: "", bodyHtml: "", isActive: true,
      triggerEvent: "referral_submitted", delayHours: 0
    });
    setEditDialog(true);
  };

  const openEdit = (t) => {
    setEditingTemplate({ ...t });
    setEditDialog(true);
  };

  const openPreview = (t) => {
    setEditingTemplate(t);
    setPreviewDialog(true);
  };

  const saveTemplate = async () => {
    if (!editingTemplate.name || !editingTemplate.subject || !editingTemplate.bodyHtml) return;
    setSaving(true);
    if (editingTemplate.id) {
      const updated = await base44.entities.AffiliateEmailTemplate.update(editingTemplate.id, editingTemplate);
      setTemplates(prev => prev.map(t => t.id === updated.id ? updated : t));
    } else {
      const created = await base44.entities.AffiliateEmailTemplate.create(editingTemplate);
      setTemplates(prev => [created, ...prev]);
    }
    setSaving(false);
    setEditDialog(false);
  };

  const deleteTemplate = async (id) => {
    if (!confirm("Delete this template?")) return;
    await base44.entities.AffiliateEmailTemplate.delete(id);
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const toggleActive = async (t) => {
    const updated = await base44.entities.AffiliateEmailTemplate.update(t.id, { isActive: !t.isActive });
    setTemplates(prev => prev.map(x => x.id === updated.id ? updated : x));
  };

  const seedDefaults = async () => {
    setSeeding(true);
    for (const tpl of DEFAULT_TEMPLATES) {
      await base44.entities.AffiliateEmailTemplate.create(tpl);
    }
    await loadTemplates();
    setSeeding(false);
  };

  const renderPreview = (html) => {
    return html
      .replace(/{{leadName}}/g, "John Smith")
      .replace(/{{businessName}}/g, "Mike's Pizza")
      .replace(/{{affiliateName}}/g, "Jane Doe")
      .replace(/{{affiliateCode}}/g, "JAN1234")
      .replace(/{{businessType}}/g, "Restaurant")
      .replace(/{{applyUrl}}/g, "https://ezpayamerica.com/ApplyOnline");
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Customize the emails sent to referred leads. Use placeholders like <code className="bg-gray-100 px-1 rounded text-xs">{"{{leadName}}"}</code>.</p>
        </div>
        <div className="flex gap-2">
          {templates.length === 0 && (
            <Button variant="outline" onClick={seedDefaults} disabled={seeding} className="border-blue-400 text-blue-700">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              Load Default Templates
            </Button>
          )}
          <Button onClick={openNew} className="bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="w-4 h-4 mr-1" /> New Template
          </Button>
        </div>
      </div>

      {templates.length === 0 && (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="py-12 text-center text-gray-400">
            <p className="mb-2">No email templates yet.</p>
            <p className="text-sm">Click "Load Default Templates" to populate the 4-step drip sequence, or create your own.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {templates.map(t => (
          <Card key={t.id} className={`border-none shadow ${!t.isActive ? "opacity-60" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    {t.dripStep !== undefined && t.dripStep !== null && (
                      <Badge className="bg-amber-100 text-amber-800 text-xs">{DRIP_STEP_LABELS[t.dripStep] || `Step ${t.dripStep}`}</Badge>
                    )}
                    {t.triggerEvent && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">{TRIGGER_LABELS[t.triggerEvent] || t.triggerEvent}</Badge>
                    )}
                    <Badge className={t.isActive ? "bg-green-100 text-green-800 text-xs" : "bg-gray-100 text-gray-500 text-xs"}>
                      {t.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">📧 {t.subject}</p>
                  {t.delayHours > 0 && <p className="text-xs text-gray-400 mt-0.5">⏱ Sends {t.delayHours}h after trigger</p>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => openPreview(t)} title="Preview"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => toggleActive(t)} title="Toggle active">
                    {t.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEdit(t)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteTemplate(t.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder reference */}
      <Card className="border-none bg-gray-50 shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">Available Placeholders:</p>
          <div className="flex flex-wrap gap-2">
            {PLACEHOLDERS.map(p => (
              <code key={p} className="bg-white border border-gray-200 rounded px-2 py-0.5 text-xs text-amber-700">{p}</code>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate?.id ? "Edit Template" : "New Email Template"}</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Template Name *</label>
                  <Input value={editingTemplate.name} onChange={e => setEditingTemplate(t => ({ ...t, name: e.target.value }))} placeholder="e.g. Drip Email 1 - Welcome" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Trigger Event</label>
                  <Select value={editingTemplate.triggerEvent} onValueChange={v => setEditingTemplate(t => ({ ...t, triggerEvent: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TRIGGER_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Drip Step</label>
                  <Select value={String(editingTemplate.dripStep ?? 0)} onValueChange={v => setEditingTemplate(t => ({ ...t, dripStep: Number(v) }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(DRIP_STEP_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Send Delay (hours)</label>
                  <Input type="number" value={editingTemplate.delayHours ?? 0} onChange={e => setEditingTemplate(t => ({ ...t, delayHours: Number(e.target.value) }))} min={0} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Subject Line *</label>
                <Input value={editingTemplate.subject} onChange={e => setEditingTemplate(t => ({ ...t, subject: e.target.value }))} placeholder="Use {{leadName}}, {{businessName}}, etc." />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Body (HTML) *</label>
                <Textarea value={editingTemplate.bodyHtml} onChange={e => setEditingTemplate(t => ({ ...t, bodyHtml: e.target.value }))} rows={12} className="font-mono text-xs" placeholder="<p>Hi {{leadName}},</p>..." />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditDialog(false)}>Cancel</Button>
                <Button onClick={saveTemplate} disabled={saving} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <CheckCircle2 className="w-4 h-4 mr-1" />}
                  Save Template
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview: {editingTemplate?.name}</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div>
              <div className="bg-gray-50 border rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Subject:</p>
                <p className="font-semibold text-gray-900">{renderPreview(editingTemplate.subject)}</p>
              </div>
              <div className="border rounded-lg p-4 bg-white prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderPreview(editingTemplate.bodyHtml) }} />
              <p className="text-xs text-gray-400 mt-3">Preview uses sample data: John Smith / Mike's Pizza / Jane Doe</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}