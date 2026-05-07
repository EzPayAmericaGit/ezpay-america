import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Copy, CheckCircle2, Pencil, Tag } from "lucide-react";

const defaultForm = {
  code: "", affiliateId: "", affiliateName: "", discountType: "flat",
  discountValue: "", description: "", maxUses: "", expiresAt: "", isActive: true
};

export default function CouponManager({ affiliates = [] }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(null);

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    setLoading(true);
    const data = await base44.entities.AffiliateCoupon.list("-created_date");
    setCoupons(data);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingCoupon(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      ...defaultForm, ...coupon,
      discountValue: String(coupon.discountValue || ""),
      maxUses: coupon.maxUses ? String(coupon.maxUses) : "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : ""
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.discountValue) return;
    setSaving(true);
    const aff = affiliates.find(a => a.id === form.affiliateId);
    const payload = {
      ...form,
      code: form.code.toUpperCase(),
      affiliateName: aff ? `${aff.firstName} ${aff.lastName}` : form.affiliateName || "",
      discountValue: parseFloat(form.discountValue),
      maxUses: form.maxUses ? parseInt(form.maxUses) : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    };
    if (editingCoupon) {
      await base44.entities.AffiliateCoupon.update(editingCoupon.id, payload);
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? { ...c, ...payload } : c));
    } else {
      const created = await base44.entities.AffiliateCoupon.create({ ...payload, currentUses: 0 });
      setCoupons(prev => [created, ...prev]);
    }
    setDialogOpen(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    await base44.entities.AffiliateCoupon.delete(id);
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const toggleActive = async (coupon) => {
    await base44.entities.AffiliateCoupon.update(coupon.id, { isActive: !coupon.isActive });
    setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date();
  const isMaxed = (c) => c.maxUses && c.currentUses >= c.maxUses;

  if (loading) return <div className="text-center py-10 text-gray-400">Loading coupons...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Coupon Codes</h2>
          <p className="text-sm text-gray-500">Create discount codes affiliates can share with prospects</p>
        </div>
        <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-1" /> New Coupon
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-3 font-medium">Code</th>
              <th className="pb-3 font-medium">Discount</th>
              <th className="pb-3 font-medium">Affiliate</th>
              <th className="pb-3 font-medium">Uses</th>
              <th className="pb-3 font-medium">Expires</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{c.code}</span>
                    <button onClick={() => copyCode(c.code)} className="text-gray-400 hover:text-gray-700">
                      {copied === c.code ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {c.description && <p className="text-xs text-gray-400 mt-1">{c.description}</p>}
                </td>
                <td className="py-3 font-semibold text-green-600">
                  {c.discountType === "flat" ? `$${c.discountValue}` : `${c.discountValue}%`} off
                </td>
                <td className="py-3 text-gray-600 text-xs">{c.affiliateName || <span className="text-gray-400">Global</span>}</td>
                <td className="py-3">
                  <span className={isMaxed(c) ? "text-red-600 font-semibold" : "text-gray-600"}>
                    {c.currentUses || 0}{c.maxUses ? ` / ${c.maxUses}` : ""}
                  </span>
                </td>
                <td className="py-3 text-xs text-gray-500">
                  {c.expiresAt ? (
                    <span className={isExpired(c) ? "text-red-500" : "text-gray-600"}>
                      {new Date(c.expiresAt).toLocaleDateString()}
                    </span>
                  ) : <span className="text-gray-400">Never</span>}
                </td>
                <td className="py-3">
                  {isExpired(c) ? <Badge className="bg-red-100 text-red-700 text-xs">Expired</Badge>
                  : isMaxed(c) ? <Badge className="bg-gray-100 text-gray-600 text-xs">Maxed</Badge>
                  : c.isActive ? <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                  : <Badge className="bg-gray-100 text-gray-500 text-xs">Inactive</Badge>}
                </td>
                <td className="py-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-gray-100 rounded"><Pencil className="w-3.5 h-3.5 text-gray-400" /></button>
                    <button onClick={() => toggleActive(c)} className="p-1.5 hover:bg-gray-100 rounded text-xs text-gray-500">{c.isActive ? "Off" : "On"}</button>
                    <button onClick={() => handleDelete(c.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No coupons yet. Create your first coupon code.</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Coupon Code *</label>
              <Input placeholder="SAVE100" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Discount Type *</label>
                <Select value={form.discountType} onValueChange={v => setForm({ ...form, discountType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat $ Off</SelectItem>
                    <SelectItem value="percentage">Percentage %</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Value * {form.discountType === "percentage" ? "(%)" : "($)"}
                </label>
                <Input type="number" placeholder={form.discountType === "percentage" ? "10" : "100"} value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Assign to Affiliate (optional)</label>
              <Select value={form.affiliateId || "global"} onValueChange={v => setForm({ ...form, affiliateId: v === "global" ? "" : v })}>
                <SelectTrigger><SelectValue placeholder="Global / No affiliate" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global (no affiliate)</SelectItem>
                  {affiliates.filter(a => a.status === "approved").map(a => (
                    <SelectItem key={a.id} value={a.id}>{a.firstName} {a.lastName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <Textarea placeholder="What does this coupon offer?" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Max Uses (blank = unlimited)</label>
                <Input type="number" placeholder="Unlimited" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Expiration Date</label>
                <Input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-amber-500" />
              <span className="text-sm">Active</span>
            </label>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button disabled={saving || !form.code || !form.discountValue} onClick={handleSave} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                {saving ? "Saving..." : editingCoupon ? "Save" : "Create Coupon"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}