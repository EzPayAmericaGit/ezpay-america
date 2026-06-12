import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Trash2, Mail, Shield, Loader2 } from "lucide-react";

const ROLES = ["admin", "manager", "support", "viewer"];
const ROLE_COLORS = {
  admin: "bg-red-100 text-red-800",
  manager: "bg-purple-100 text-purple-800",
  support: "bg-blue-100 text-blue-800",
  viewer: "bg-gray-100 text-gray-700",
};

export default function TeamManager() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "viewer" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async () => {
    try {
      const all = await base44.entities.Settings.filter({ type: "team_member" });
      setMembers(all);
    } catch {
      setMembers([]);
    }
    setLoading(false);
  };

  const addMember = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    const created = await base44.entities.Settings.create({
      type: "team_member",
      key: form.email,
      value: { name: form.name, email: form.email, role: form.role, joinedAt: new Date().toISOString(), isActive: true }
    });
    setMembers(prev => [created, ...prev]);
    // Send invite email
    base44.integrations.Core.SendEmail({
      to: form.email,
      subject: "You've been added to EzPay America Affiliate Admin",
      body: `Hello ${form.name},\n\nYou've been added as a ${form.role} to the EzPay America affiliate management platform.\n\nYou can access the admin panel at: ${window.location.origin}/AffiliateAdmin\n\nBest regards,\nEzPay America Team`
    }).catch(() => {});
    setDialog(false);
    setForm({ name: "", email: "", role: "viewer" });
    setSaving(false);
  };

  const removeMember = async (id) => {
    if (!confirm("Remove this team member?")) return;
    await base44.entities.Settings.update(id, { value: { ...members.find(m => m.id === id)?.value, isActive: false } });
    loadMembers();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>;

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Team Members</CardTitle>
            <Button onClick={() => setDialog(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-1" />Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {members.filter(m => m.value?.isActive).length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No team members yet. Invite your team to help manage the program.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Role</th>
                    <th className="pb-3 font-medium">Joined</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.filter(m => m.value?.isActive).map(m => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                            {m.value?.name?.charAt(0) || "?"}
                          </div>
                          <span className="font-medium text-gray-900">{m.value?.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600 flex items-center gap-1"><Mail className="w-3 h-3" />{m.value?.email}</td>
                      <td className="py-3">
                        <Badge className={`${ROLE_COLORS[m.value?.role] || "bg-gray-100 text-gray-700"} text-xs capitalize`}>
                          <Shield className="w-3 h-3 mr-1" />{m.value?.role}
                        </Badge>
                      </td>
                      <td className="py-3 text-gray-500 text-xs">{m.value?.joinedAt ? new Date(m.value.joinedAt).toLocaleDateString() : "–"}</td>
                      <td className="py-3">
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 h-7" onClick={() => removeMember(m.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input type="email" placeholder="Email Address *" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLES.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
              An invitation email will be sent to this address.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setDialog(false)}>Cancel</Button>
              <Button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white" disabled={!form.name || !form.email || saving} onClick={addMember}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add & Invite"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}