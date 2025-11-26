import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, Loader2, Sparkles, RefreshCw } from "lucide-react";

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
  const [bulkOptimizing, setBulkOptimizing] = useState(false);
  const [optimizeProgress, setOptimizeProgress] = useState({ current: 0, total: 0 });
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    published: false,
    meta_title: "",
    meta_description: "",
    meta_keywords: ""
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
    setFormData({ title: "", slug: "", excerpt: "", content: "", image: "", category: "", published: false, meta_title: "", meta_description: "", meta_keywords: "" });
    setIsEditing(false);
    setEditingArticle(null);
  };

  const handleEdit = (article) => {
    setFormData({
      title: article.title || "",
      slug: article.slug || "",
      excerpt: article.excerpt || "",
      content: article.content || "",
      image: article.image || "",
      category: article.category || "",
      published: article.published || false,
      meta_title: article.meta_title || "",
      meta_description: article.meta_description || "",
      meta_keywords: article.meta_keywords || ""
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

  const bulkOptimizeSEO = async () => {
    if (articles.length === 0) return;
    setBulkOptimizing(true);
    setOptimizeProgress({ current: 0, total: articles.length });

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      setOptimizeProgress({ current: i + 1, total: articles.length });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an SEO expert. Optimize metadata for this blog article based on Google's latest search algorithm best practices (E-E-A-T, helpful content, semantic search).

Article Title: "${article.title}"
Category: ${article.category}
Current Excerpt: "${article.excerpt}"
Company: EzPay America (payment processing)

Optimize for:
- Search intent matching
- Featured snippet eligibility
- Long-tail keywords
- Natural language patterns
- Mobile-first indexing considerations`,
        response_json_schema: {
          type: "object",
          properties: {
            slug: { type: "string", description: "SEO-optimized URL slug, lowercase with hyphens, max 50 chars" },
            meta_title: { type: "string", description: "Compelling title with primary keyword near start, max 60 chars" },
            meta_description: { type: "string", description: "Action-oriented description with keywords, max 155 chars" },
            meta_keywords: { type: "string", description: "8-10 relevant long-tail keywords, comma separated" },
            optimized_excerpt: { type: "string", description: "SEO-friendly excerpt, 2-3 sentences, includes keywords naturally" }
          }
        }
      });

      await base44.entities.NewsArticle.update(article.id, {
        slug: result.slug || article.slug,
        meta_title: result.meta_title || article.meta_title,
        meta_description: result.meta_description || article.meta_description,
        meta_keywords: result.meta_keywords || article.meta_keywords,
        excerpt: result.optimized_excerpt || article.excerpt
      });
    }

    queryClient.invalidateQueries({ queryKey: ['newsArticles'] });
    setBulkOptimizing(false);
    setOptimizeProgress({ current: 0, total: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">News Admin</h1>
          <div className="flex gap-2">
            {!isEditing && articles.length > 0 && (
              <Button 
                onClick={bulkOptimizeSEO}
                disabled={bulkOptimizing}
                variant="outline"
                className="border-amber-500 text-amber-600 hover:bg-amber-50"
              >
                {bulkOptimizing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Optimizing {optimizeProgress.current}/{optimizeProgress.total}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Bulk Optimize SEO
                  </>
                )}
              </Button>
            )}
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
                        const prompt = `High-quality professional photograph for a business blog article about: "${formData.title}". Theme: ${formData.category || "business technology"}. Style: photorealistic, well-lit, corporate, modern office or business environment. Focus on payment processing, credit cards, POS terminals, or business technology. Clean composition, professional lighting, shallow depth of field. No text, no logos, no watermarks.`;
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
                {/* SEO Section */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">SEO Settings</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={uploading || !formData.title}
                      onClick={async () => {
                        if (!formData.title) return;
                        setUploading(true);
                        const result = await base44.integrations.Core.InvokeLLM({
                          prompt: `Generate SEO metadata for a blog article titled: "${formData.title}". Category: ${formData.category || "business"}. For a payment processing company (EzPay America).`,
                          response_json_schema: {
                            type: "object",
                            properties: {
                              slug: { type: "string", description: "URL-friendly slug, lowercase with hyphens" },
                              meta_title: { type: "string", description: "SEO title, max 60 chars" },
                              meta_description: { type: "string", description: "SEO description, max 160 chars" },
                              meta_keywords: { type: "string", description: "5-8 relevant keywords, comma separated" }
                            }
                          }
                        });
                        setFormData({
                          ...formData,
                          slug: result.slug || "",
                          meta_title: result.meta_title || "",
                          meta_description: result.meta_description || "",
                          meta_keywords: result.meta_keywords || ""
                        });
                        setUploading(false);
                      }}
                    >
                      <Sparkles className="w-3 h-3 mr-1" /> Auto-Generate SEO
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">URL Slug</label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        placeholder="article-url-slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Meta Title</label>
                      <Input
                        value={formData.meta_title}
                        onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                        placeholder="SEO title (max 60 chars)"
                        maxLength={60}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Meta Description</label>
                      <Textarea
                        value={formData.meta_description}
                        onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                        placeholder="SEO description (max 160 chars)"
                        rows={2}
                        maxLength={160}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Meta Keywords</label>
                      <Input
                        value={formData.meta_keywords}
                        onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                        placeholder="keyword1, keyword2, keyword3"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4">
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