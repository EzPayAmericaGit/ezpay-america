import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Download, Image, Mail, FileText, Video, Link, Pencil, Upload, Loader2 } from "lucide-react";

const TYPE_ICONS = {
  banner: Image,
  email_template: Mail,
  social_post: Link,
  document: FileText,
  video: Video,
  link: Link,
  landing_page: Link,
};

const TYPE_COLORS = {
  banner: "bg-blue-100 text-blue-700",
  email_template: "bg-purple-100 text-purple-700",
  social_post: "bg-pink-100 text-pink-700",
  document: "bg-gray-100 text-gray-700",
  video: "bg-red-100 text-red-700",
  link: "bg-green-100 text-green-700",
  landing_page: "bg-amber-100 text-amber-700",
};

const CATEGORIES = ["banners", "email_swipes", "social_media", "guides", "videos", "other"];

const defaultForm = {
  title: "", description: "", type: "banner", fileUrl: "",
  previewUrl: "", dimensions: "", format: "", category: "other", isActive: true
};

export default function ResourceManager({ isAffiliate = false }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const fileInputRef = useRef(null);
  const previewInputRef = useRef(null);

  useEffect(() => { loadResources(); }, []);

  const loadResources = async () => {
    setLoading(true);
    const data = await base44.entities.AffiliateResource.list("-created_date");
    setResources(data.filter(r => r.isActive || !isAffiliate));
    setLoading(false);
  };

  const openCreate = () => {
    setEditingResource(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (resource) => {
    setEditingResource(resource);
    setForm({ ...defaultForm, ...resource });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.type) return;
    setSaving(true);
    if (editingResource) {
      await base44.entities.AffiliateResource.update(editingResource.id, form);
      setResources(prev => prev.map(r => r.id === editingResource.id ? { ...r, ...form } : r));
    } else {
      const created = await base44.entities.AffiliateResource.create({ ...form, downloadCount: 0 });
      setResources(prev => [created, ...prev]);
    }
    setDialogOpen(false);
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this resource?")) return;
    await base44.entities.AffiliateResource.delete(id);
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (field === "fileUrl") setUploading(true);
    else setUploadingPreview(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(prev => ({ ...prev, [field]: file_url }));
      // Auto-detect format from file extension
      if (field === "fileUrl") {
        const ext = file.name.split(".").pop().toUpperCase();
        setForm(prev => ({ ...prev, [field]: file_url, format: ext }));
      }
    } finally {
      setUploading(false);
      setUploadingPreview(false);
    }
  };

  const handleDownload = async (resource) => {
    await base44.entities.AffiliateResource.update(resource.id, { downloadCount: (resource.downloadCount || 0) + 1 });
    setResources(prev => prev.map(r => r.id === resource.id ? { ...r, downloadCount: (r.downloadCount || 0) + 1 } : r));
    if (resource.fileUrl) window.open(resource.fileUrl, "_blank");
  };

  const filtered = categoryFilter === "all" ? resources : resources.filter(r => r.category === categoryFilter);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading resources...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Marketing Resources</h2>
          <p className="text-sm text-gray-500">{isAffiliate ? "Download materials to promote EzPay America" : "Manage assets available to affiliates"}</p>
        </div>
        {!isAffiliate && (
          <Button onClick={openCreate} className="bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="w-4 h-4 mr-1" /> Add Resource
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${categoryFilter === cat ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {cat === "all" ? "All" : cat.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(r => {
          const Icon = TYPE_ICONS[r.type] || FileText;
          return (
            <Card key={r.id} className="border-none shadow hover:shadow-md transition-all">
              <CardContent className="p-4">
                {r.previewUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 h-28 flex items-center justify-center">
                    <img src={r.previewUrl} alt={r.title} className="w-full h-full object-cover" onError={e => { e.target.style.display = "none"; }} />
                  </div>
                )}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${TYPE_COLORS[r.type] || "bg-gray-100 text-gray-700"}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <Badge className={`${TYPE_COLORS[r.type] || "bg-gray-100 text-gray-700"} text-xs capitalize`}>{r.type.replace("_", " ")}</Badge>
                  </div>
                  {!isAffiliate && (
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(r)} className="p-1 hover:bg-gray-100 rounded"><Pencil className="w-3 h-3 text-gray-400" /></button>
                      <button onClick={() => handleDelete(r.id)} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3 text-red-400" /></button>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{r.title}</h3>
                {r.description && <p className="text-xs text-gray-500 mb-2 line-clamp-2">{r.description}</p>}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  {r.dimensions && <span>{r.dimensions}</span>}
                  {r.format && <span className="uppercase font-mono">{r.format}</span>}
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" />{r.downloadCount || 0}</span>
                </div>
                {r.fileUrl ? (
                  <Button size="sm" onClick={() => handleDownload(r)} className="w-full bg-gray-900 hover:bg-gray-800 text-white text-xs">
                    <Download className="w-3.5 h-3.5 mr-1" /> Download
                  </Button>
                ) : r.fileUrl === "" && r.type === "link" ? null : (
                  <p className="text-xs text-gray-400 text-center">No file attached</p>
                )}
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No resources in this category yet.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      {!isAffiliate && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingResource ? "Edit Resource" : "Add Resource"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Resource Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Textarea placeholder="Description (optional)" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Type *</label>
                  <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["banner", "email_template", "social_post", "document", "video", "link", "landing_page"].map(t => (
                        <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Category</label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">File / Download</label>
                <div className="flex gap-2">
                  <Input placeholder="https://... or upload below" value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} className="flex-1" />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="shrink-0">
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  </Button>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={e => handleFileUpload(e, "fileUrl")} />
                </div>
                {form.fileUrl && <p className="text-xs text-green-600 mt-1 truncate">✓ {form.fileUrl.split("/").pop()}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Preview Image (optional)</label>
                <div className="flex gap-2">
                  <Input placeholder="https://... or upload below" value={form.previewUrl} onChange={e => setForm({ ...form, previewUrl: e.target.value })} className="flex-1" />
                  <Button type="button" variant="outline" size="sm" onClick={() => previewInputRef.current?.click()} disabled={uploadingPreview} className="shrink-0">
                    {uploadingPreview ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Image className="w-3.5 h-3.5" />}
                  </Button>
                  <input ref={previewInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, "previewUrl")} />
                </div>
                {form.previewUrl && <img src={form.previewUrl} alt="preview" className="mt-1 h-16 rounded object-cover border" onError={e => e.target.style.display="none"} />}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Dimensions (e.g. 728x90)" value={form.dimensions} onChange={e => setForm({ ...form, dimensions: e.target.value })} />
                <Input placeholder="Format (PNG, PDF, etc.)" value={form.format} onChange={e => setForm({ ...form, format: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-amber-500" />
                <span className="text-sm">Visible to affiliates</span>
              </label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button disabled={saving || !form.title} onClick={handleSave} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white">
                  {saving ? "Saving..." : editingResource ? "Save Changes" : "Add Resource"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}