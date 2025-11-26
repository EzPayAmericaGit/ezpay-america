import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, Loader2, Sparkles } from "lucide-react";

const categories = [
  "Mobile Payments",
  "Restaurant Tips", 
  "POS Systems",
  "Merchant Services",
  "Business News",
  "Industry Insights",
  "Technology",
  "Industry News",
  "Future Trends"
];

export default function NewsAdmin() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    published: false
  });

  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['newsArticles'],
    queryFn: () => base44.entities.NewsArticle.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.NewsArticle.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.NewsArticle.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.NewsArticle.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['newsArticles'] })
  });

  const resetForm = () => {
    setFormData({ title: "", excerpt: "", content: "", image: "", category: "", published: false });
    setIsEditing(false);
    setEditingArticle(null);
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title || "",
      excerpt: article.excerpt || "",
      content: article.content || "",
      image: article.image || "",
      category: article.category || "",
      published: article.published || false
    });
    setEditingArticle(article);
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const togglePublished = (article) => {
    updateMutation.mutate({ 
      id: article.id, 
      data: { ...article, published: !article.published } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">News Admin</h1>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-amber-500 hover:bg-amber-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          )}
        </div>

        {isEditing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingArticle ? "Edit Article" : "New Article"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => setFormData({...formData, category: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">Excerpt *</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={uploading || !formData.title}
                      onClick={async () => {
                        if (!formData.title) return;
                        setUploading(true);
                        const result = await base44.integrations.Core.InvokeLLM({
                          prompt: `Write a short 2-sentence excerpt/summary for a news article titled: "${formData.title}". Category: ${formData.category || "business"}. Keep it engaging and professional for a payment processing company blog.`,
                        });
                        setFormData({...formData, excerpt: result});
                        setUploading(false);
                      }}
                    >
                      <Sparkles className="w-3 h-3 mr-1" /> Generate
                    </Button>
                  </div>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={2}
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium">Full Content</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={uploading || !formData.title}
                      onClick={async () => {
                        if (!formData.title) return;
                        setUploading(true);
                        const result = await base44.integrations.Core.InvokeLLM({
                          prompt: `Write a full blog article for: "${formData.title}". Category: ${formData.category || "business"}. Write for a payment processing company (EzPay America). Make it informative, professional, and around 400-500 words. Include practical tips where relevant.`,
                        });
                        setFormData({...formData, content: result});
                        setUploading(false);
                      }}
                    >
                      <Sparkles className="w-3 h-3 mr-1" /> Generate
                    </Button>
                  </div>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Article Image</label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://... or upload"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading}
                      onClick={() => document.getElementById('image-upload').click()}
                      title="Upload image"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploading || !formData.title}
                      title="Generate image with AI"
                      onClick={async () => {
                        if (!formData.title) return;
                        setUploading(true);
                        const prompt = `Professional blog header image for an article about: "${formData.title}". Category: ${formData.category || "business"}. Style: modern, clean, corporate, related to payment processing and business technology. No text in the image.`;
                        const { url } = await base44.integrations.Core.GenerateImage({ prompt });
                        setFormData({...formData, image: url});
                        setUploading(false);
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        const { file_url } = await base44.integrations.Core.UploadFile({ file });
                        setFormData({...formData, image: file_url});
                        setUploading(false);
                      }}
                    />
                  </div>
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(v) => setFormData({...formData, published: v})}
                  />
                  <label className="text-sm font-medium">Published</label>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                    {editingArticle ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : articles.length === 0 ? (
            <p className="text-center text-gray-500">No articles yet.</p>
          ) : (
            articles.map(article => (
              <Card key={article.id} className={!article.published ? "opacity-60" : ""}>
                <CardContent className="p-4 flex items-center gap-4">
                  {article.image && (
                    <img src={article.image} alt="" className="w-20 h-14 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{article.title}</h3>
                    <p className="text-sm text-gray-500">{article.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => togglePublished(article)}
                      title={article.published ? "Unpublish" : "Publish"}
                    >
                      {article.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(article)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteMutation.mutate(article.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}