import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Users, DollarSign, Star, CheckCircle2 } from "lucide-react";

const defaultForm = {
  name: "", description: "", commissionType: "flat", commissionValue: "",
  cookieDays: 30, minPayout: 50, payoutSchedule: "net30",
  isActive: true, isDefault: false, requiresApproval: true,
  maxAffiliates: "", targetAudience: "", terms: "", color: "#f59e0b"
};

export default function ProgramManager() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadPrograms(); }, []);

  const loadPrograms = async () => {
    setLoading(true);
    const data = await base44.entities.AffiliateProgram.list("-created_date");
    setPrograms(data);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingProgram(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (program) => {
    setEditingProgram(program);
    setForm({ ...defaultForm, ...program, commissionValue: String(program.commissionValue || ""), cookieDays: program.cookieDays || 30, minPayout: program.minPayout || 50, maxAffiliates: program.maxAffiliates || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.commissionValue) return;
    setSaving(true);
    const payload = {
      ...form,
      commissionValue: parseFloat(form.commissionValue),
      cookieDays: parseInt(form.cookieDays) || 30,
      minPayout: parseFloat(form.minPayout) || 50,
      maxAffiliates: form.maxAffiliates ? parseInt(form.maxAffiliates) : null,
    };
    if (editingProgram) {
      const updated = await base44.entities.AffiliateProgram.update(editingProgram.id, payload);
      setPrograms(prev => prev.map(p => p.id === editingProgram.id ? { ...p, ...payload } : p));
    } else {
      const created = await base44.entities.AffiliateProgram.create({ ...payload, totalAffiliates: 0, totalReferrals: 0, totalRevenue: 0 });
      setPrograms(prev => [created, ...prev]);
    }
    setDialogOpen(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this program?")) return;
    await base44.entities.AffiliateProgram.delete(id);
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const toggleActive = async (program) => {
    await base44.entities.AffiliateProgram.update(program.id, { isActive: !program.isActive });
    setPrograms(prev => prev.map(p => p.id === program.id ? { ...p, isActive: !p.isActive } : p));
  };

  if (loading) return <div className="text-center py-10 text-gray-400">Loading programs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Affiliate Programs</h2>
          <p className="text-sm text-gray-500">Create different program tiers with unique commission structures</p>
        </div>
        <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-1" /> New Program
        </Button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {programs.map(p => (
          <Card key={p.id} className={`border-2 transition-all ${p.isActive ? "border-transparent shadow-lg" : "border-gray-200 opacity-60"}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: p.color || "#f59e0b" }}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-1">
                      {p.name}
                      {p.isDefault && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    </h3>
                    <Badge className={p.isActive ? "bg-green-100 text-green-800 text-xs" : "bg-gray-100 text-gray-500 text-xs"}>
                      {p.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-3.5 h-3.5 text-gray-500" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                </div>
              </div>

              {p.description && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{p.description}</p>}

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-400">Commission</p>
                  <p className="font-bold text-gray-900">
                    {p.commissionType === "flat" ? `$${p.commissionValue}` : `${p.commissionValue}%`}
                    <span className="text-gray-400 font-normal ml-1">/{p.commissionType}</span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-400">Min Payout</p>
                  <p className="font-bold text-gray-900">${p.minPayout || 50}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-400">Cookie</p>
                  <p className="font-bold text-gray-900">{p.cookieDays || 30} days</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-gray-400">Schedule</p>
                  <p className="font-bold text-gray-900 capitalize">{(p.payoutSchedule || "net30").replace("net", "Net ")}</p>
                </div>
              </div>

              <div className="flex gap-2 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{p.totalAffiliates || 0} affiliates</span>
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${(p.totalRevenue || 0).toFixed(0)} revenue</span>
              </div>

              <Button size="sm" variant="outline" onClick={() => toggleActive(p)} className="w-full text-xs">
                {p.isActive ? "Deactivate" : "Activate"}
              </Button>
            </CardContent>
          </Card>
        ))}

        {programs.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No programs yet. Create your first affiliate program.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProgram ? "Edit Program" : "Create New Program"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Program Name *</label>
                <Input placeholder="e.g. Standard Partner, VIP Reseller" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <Textarea placeholder="Describe this program to affiliates..." rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Commission Type *</label>
                <Select value={form.commissionType} onValueChange={v => setForm({ ...form, commissionType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat $ Amount</SelectItem>
                    <SelectItem value="percentage">Percentage %</SelectItem>
                    <SelectItem value="tiered">Tiered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Commission Value * {form.commissionType === "percentage" ? "(%)" : "($)"}
                </label>
                <Input type="number" placeholder={form.commissionType === "percentage" ? "10" : "100"} value={form.commissionValue} onChange={e => setForm({ ...form, commissionValue: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Cookie Duration (days)</label>
                <Input type="number" value={form.cookieDays} onChange={e => setForm({ ...form, cookieDays: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Minimum Payout ($)</label>
                <Input type="number" value={form.minPayout} onChange={e => setForm({ ...form, minPayout: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Payout Schedule</label>
                <Select value={form.payoutSchedule} onValueChange={v => setForm({ ...form, payoutSchedule: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Max Affiliates (blank = unlimited)</label>
                <Input type="number" placeholder="Unlimited" value={form.maxAffiliates} onChange={e => setForm({ ...form, maxAffiliates: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Brand Color</label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-12 h-10 rounded cursor-pointer border" />
                  <Input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="font-mono" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Target Audience</label>
                <Input placeholder="e.g. Digital marketers, local business consultants" value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Program Terms</label>
                <Textarea placeholder="Specific terms for this program..." rows={3} value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })} />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm">Default Program</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.requiresApproval} onChange={e => setForm({ ...form, requiresApproval: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                  <span className="text-sm">Requires Approval</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button disabled={saving || !form.name || !form.commissionValue} onClick={handleSave} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                {saving ? "Saving..." : editingProgram ? "Save Changes" : "Create Program"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}