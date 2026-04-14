import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, Loader2, Sparkles, RefreshCw, Tags, BarChart3, Wand2, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SocialShareDialog from "../components/news/SocialShareDialog";

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
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiIdea, setAiIdea] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    tags: [],
    content_score: null,
    sentiment: "",
    reading_time: null,
    published: false,
    meta_title: "",
    meta_description: "",
    meta_keywords: ""
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [seoOptimizing, setSeoOptimizing] = useState(false);
  const [seoRecommendations, setSeoRecommendations] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [shareArticle, setShareArticle] = useState(null);

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
    setFormData({ title: "", slug: "", excerpt: "", content: "", image: "", category: "", tags: [], content_score: null, sentiment: "", reading_time: null, published: false, meta_title: "", meta_description: "", meta_keywords: "" });
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
      tags: article.tags || [],
      content_score: article.content_score || null,
      sentiment: article.sentiment || "",
      reading_time: article.reading_time || null,
      published: article.published || false,
      meta_title: article.meta_title || "",
      meta_description: article.meta_description || "",
      meta_keywords: article.meta_keywords || ""
    });
    setEditingArticle(article);
    setIsEditing(true);
  };

  const analyzeContent = async () => {
    if (!formData.title || !formData.excerpt) return;
    setAnalyzing(true);
    
    const contentToAnalyze = formData.content || formData.excerpt;
    const wordCount = contentToAnalyze.split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze this article for a payment processing company blog:

Title: "${formData.title}"
Category: ${formData.category || "not set"}
Content: "${contentToAnalyze}"

Provide:
1. 5-8 relevant tags for categorization and SEO
2. A content quality score (1-100) based on clarity, relevance, engagement
3. Sentiment analysis
4. Suggest the best category if current doesn't fit`,
      response_json_schema: {
        type: "object",
        properties: {
          tags: { type: "array", items: { type: "string" }, description: "5-8 relevant content tags" },
          content_score: { type: "number", description: "Quality score 1-100" },
          sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
          suggested_category: { type: "string", description: "Best fitting category" }
        }
      }
    });

    setFormData({
      ...formData,
      tags: result.tags || [],
      content_score: result.content_score || null,
      sentiment: result.sentiment || "",
      reading_time: readingTime,
      category: formData.category || result.suggested_category || ""
    });
    setAnalyzing(false);
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

  const generateFromIdea = async () => {
    if (!aiIdea.trim()) return;
    setAiGenerating(true);

    try {
      // Generate article content
      const articleResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional content writer for EzPay America, a payment processing company. 
        
Create a complete blog article based on this idea: "${aiIdea}"

The article should be:
- Professional and informative
- Relevant to payment processing, merchant services, POS systems, or business finance
- Around 400-600 words
- Engaging and valuable to business owners

Provide a complete article with all metadata.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Catchy, SEO-friendly title" },
            excerpt: { type: "string", description: "2-3 sentence summary" },
            content: { type: "string", description: "Full article content, 400-600 words" },
            category: { type: "string", enum: categories, description: "Best fitting category" },
            tags: { type: "array", items: { type: "string" }, description: "5-8 relevant tags" },
            slug: { type: "string", description: "URL-friendly slug" },
            meta_title: { type: "string", description: "SEO title, max 60 chars" },
            meta_description: { type: "string", description: "SEO description, max 155 chars" },
            meta_keywords: { type: "string", description: "Comma-separated keywords" },
            image_prompt: { type: "string", description: "Detailed prompt for generating a relevant professional image" }
          }
        }
      });

      // Generate image based on the article
      const { url: imageUrl } = await base44.integrations.Core.GenerateImage({
        prompt: `High-quality professional photograph for a business blog. ${articleResult.image_prompt}. Style: photorealistic, well-lit, corporate, modern. Clean composition, professional lighting. No text, no logos, no watermarks.`
      });

      // Calculate reading time
      const wordCount = articleResult.content?.split(/\s+/).length || 0;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      // Set form data with generated content
      setFormData({
        title: articleResult.title || "",
        slug: articleResult.slug || "",
        excerpt: articleResult.excerpt || "",
        content: articleResult.content || "",
        image: imageUrl || "",
        category: articleResult.category || "",
        tags: articleResult.tags || [],
        content_score: 75,
        sentiment: "positive",
        reading_time: readingTime,
        published: false,
        meta_title: articleResult.meta_title || "",
        meta_description: articleResult.meta_description || "",
        meta_keywords: articleResult.meta_keywords || ""
      });

      setShowAIGenerator(false);
      setAiIdea("");
      setIsEditing(true);
    } catch (error) {
      console.error("AI generation error:", error);
      alert("Failed to generate article. Please try again.");
    } finally {
      setAiGenerating(false);
    }
  };

  const optimizeSEO = async () => {
    if (!formData.title || !formData.excerpt) {
      alert("Please add a title and excerpt first");
      return;
    }
    setSeoOptimizing(true);
    
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an advanced SEO expert specializing in E-E-A-T, semantic search, and Google's helpful content update.

Analyze and optimize this article for maximum search visibility:

ARTICLE INFO:
Title: "${formData.title}"
Category: ${formData.category || "business"}
Excerpt: "${formData.excerpt}"
Content: "${formData.content ? formData.content.substring(0, 500) : formData.excerpt}..."
Company: EzPay America (payment processing, POS systems, merchant services)

PROVIDE:
1. Optimized SEO metadata (title, description, slug, keywords)
2. Primary keyword + 5-7 long-tail keyword variations
3. Specific content improvement suggestions
4. Search intent analysis
5. SEO score (1-100) with reasoning
6. Competitor keyword opportunities`,
      response_json_schema: {
        type: "object",
        properties: {
          slug: { type: "string", description: "SEO-optimized URL slug with primary keyword, lowercase with hyphens" },
          meta_title: { type: "string", description: "Click-worthy title with primary keyword near beginning, 50-60 chars" },
          meta_description: { type: "string", description: "Compelling description with CTA and keywords, 150-158 chars" },
          meta_keywords: { type: "string", description: "10-12 long-tail keywords, comma separated" },
          primary_keyword: { type: "string", description: "Main target keyword phrase" },
          keyword_variations: { type: "array", items: { type: "string" }, description: "5-7 semantic keyword variations" },
          search_intent: { type: "string", enum: ["informational", "commercial", "transactional", "navigational"], description: "Primary search intent" },
          seo_score: { type: "number", description: "Overall SEO potential score 1-100" },
          improvements: { type: "array", items: { type: "string" }, description: "3-5 specific actionable improvements" },
          readability_tips: { type: "array", items: { type: "string" }, description: "2-3 readability enhancements" },
          competitor_keywords: { type: "array", items: { type: "string" }, description: "3-5 opportunity keywords competitors rank for" }
        }
      }
    });

    setFormData({
      ...formData,
      slug: result.slug || formData.slug,
      meta_title: result.meta_title || formData.meta_title,
      meta_description: result.meta_description || formData.meta_description,
      meta_keywords: result.meta_keywords || formData.meta_keywords
    });

    setSeoRecommendations(result);
    setSeoOptimizing(false);
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

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">News Admin</h1>
          <div className="flex gap-2">
            {articles.length > 0 && (
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
            <Button 
              onClick={() => {
                setShowAIGenerator(true);
                setIsEditing(false);
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              AI Generate Article
            </Button>
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Manually
              </Button>
            )}
          </div>
        </div>

        {/* AI Generator Modal */}
        {showAIGenerator && (
          <Card className="mb-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Wand2 className="w-5 h-5" />
                AI Article Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Describe your article idea and the AI will generate a complete article with an image.
              </p>
              <Textarea
                value={aiIdea}
                onChange={(e) => setAiIdea(e.target.value)}
                placeholder="Example: Write about the benefits of contactless payments for small restaurants, focusing on speed and hygiene..."
                rows={4}
                className="mb-4"
              />
              <div className="flex gap-2">
                <Button
                  onClick={generateFromIdea}
                  disabled={aiGenerating || !aiIdea.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Article & Image...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Article
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAIGenerator(false);
                    setAiIdea("");
                  }}
                  disabled={aiGenerating}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                <div className="flex gap-4">
                  <div className="flex-1">
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
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={analyzing || (!formData.title && !formData.excerpt)}
                      onClick={analyzeContent}
                      className="border-purple-500 text-purple-600 hover:bg-purple-50"
                    >
                      {analyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                      Analyze Content
                    </Button>
                  </div>
                </div>

                {/* AI Analysis Results */}
                {(formData.tags?.length > 0 || formData.content_score) && (
                  <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-purple-700 font-medium">
                      <Tags className="w-4 h-4" />
                      AI Content Analysis
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags?.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-purple-100 text-purple-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-6 text-sm">
                      {formData.content_score && (
                        <div>
                          <span className="text-gray-500">Quality Score:</span>{" "}
                          <span className={`font-semibold ${formData.content_score >= 70 ? 'text-green-600' : formData.content_score >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                            {formData.content_score}/100
                          </span>
                        </div>
                      )}
                      {formData.sentiment && (
                        <div>
                          <span className="text-gray-500">Sentiment:</span>{" "}
                          <span className="font-semibold capitalize">{formData.sentiment}</span>
                        </div>
                      )}
                      {formData.reading_time && (
                        <div>
                          <span className="text-gray-500">Reading Time:</span>{" "}
                          <span className="font-semibold">{formData.reading_time} min</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                  <label className="block text-sm font-medium mb-1">Article Image URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://... or upload below"
                      className="flex-1"
                    />
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
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-2">Or Upload Image from Computer</label>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => document.getElementById('image-upload').click()}
                        className="w-full"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image File
                          </>
                        )}
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            alert('Please select an image file');
                            return;
                          }
                          
                          // Validate file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Image size must be less than 5MB');
                            return;
                          }
                          
                          setUploading(true);
                          try {
                            const { file_url } = await base44.integrations.Core.UploadFile({ file });
                            setFormData({...formData, image: file_url});
                          } catch (error) {
                            alert('Failed to upload image. Please try again.');
                          } finally {
                            setUploading(false);
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  {formData.image && (
                    <div className="mt-3 relative inline-block">
                      <img src={formData.image} alt={`Preview image for article: ${formData.title || 'news article'}`} className="h-32 object-cover rounded" loading="lazy" />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1"
                        onClick={() => setFormData({...formData, image: ""})}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                {/* SEO Section */}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-900">SEO Optimization</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={seoOptimizing || !formData.title || !formData.excerpt}
                      onClick={optimizeSEO}
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      {seoOptimizing ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Optimizing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 mr-1" /> AI SEO Assistant
                        </>
                      )}
                    </Button>
                  </div>

                  {/* SEO Recommendations Panel */}
                  {seoRecommendations && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-700 font-semibold">
                          <BarChart3 className="w-4 h-4" />
                          SEO Analysis Results
                        </div>
                        <Badge className={`${seoRecommendations.seo_score >= 80 ? 'bg-green-500' : seoRecommendations.seo_score >= 60 ? 'bg-amber-500' : 'bg-red-500'} text-white`}>
                          Score: {seoRecommendations.seo_score}/100
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs font-medium text-blue-600 mb-1">Primary Keyword</div>
                          <Badge variant="outline" className="bg-white">{seoRecommendations.primary_keyword}</Badge>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-blue-600 mb-1">Search Intent</div>
                          <Badge variant="outline" className="bg-white capitalize">{seoRecommendations.search_intent}</Badge>
                        </div>
                      </div>

                      {seoRecommendations.keyword_variations?.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-blue-600 mb-2">Keyword Variations</div>
                          <div className="flex flex-wrap gap-1">
                            {seoRecommendations.keyword_variations.map((kw, i) => (
                              <Badge key={i} variant="secondary" className="bg-white text-xs">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {seoRecommendations.improvements?.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-blue-600 mb-2">Content Improvements</div>
                          <ul className="space-y-1 text-sm">
                            {seoRecommendations.improvements.map((imp, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span className="text-gray-700">{imp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {seoRecommendations.readability_tips?.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-blue-600 mb-2">Readability Tips</div>
                          <ul className="space-y-1 text-sm">
                            {seoRecommendations.readability_tips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span className="text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {seoRecommendations.competitor_keywords?.length > 0 && (
                        <div>
                          <div className="text-xs font-medium text-blue-600 mb-2">Opportunity Keywords</div>
                          <div className="flex flex-wrap gap-1">
                            {seoRecommendations.competitor_keywords.map((kw, i) => (
                              <Badge key={i} className="bg-amber-100 text-amber-700 text-xs border-amber-300">
                                {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        URL Slug
                        {formData.slug && (
                          <span className="text-xs text-gray-500">({formData.slug.length} chars)</span>
                        )}
                      </label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                        placeholder="article-url-slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        Meta Title
                        <span className={`text-xs ${formData.meta_title.length > 60 ? 'text-red-500' : formData.meta_title.length > 50 ? 'text-green-500' : 'text-gray-500'}`}>
                          ({formData.meta_title.length}/60 chars)
                        </span>
                      </label>
                      <Input
                        value={formData.meta_title}
                        onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                        placeholder="SEO title (50-60 chars optimal)"
                        maxLength={60}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                        Meta Description
                        <span className={`text-xs ${formData.meta_description.length > 160 ? 'text-red-500' : formData.meta_description.length > 150 ? 'text-green-500' : 'text-gray-500'}`}>
                          ({formData.meta_description.length}/160 chars)
                        </span>
                      </label>
                      <Textarea
                        value={formData.meta_description}
                        onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                        placeholder="SEO description (150-160 chars optimal)"
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
                      <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
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

        {/* Search and Filter */}
        {!isEditing && articles.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search articles by title, content, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(searchQuery || categoryFilter !== "all") && (
                <p className="text-sm text-gray-500 mt-2">
                  Found {filteredArticles.length} of {articles.length} articles
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : articles.length === 0 ? (
            <p className="text-center text-gray-500">No articles yet.</p>
          ) : filteredArticles.length === 0 ? (
            <p className="text-center text-gray-500">No articles match your search.</p>
          ) : (
            filteredArticles.map(article => (
              <Card key={article.id} className={!article.published ? "opacity-60" : ""}>
                <CardContent className="p-4 flex items-center gap-4">
                  {article.image && (
                    <img src={article.image} alt={`Thumbnail for ${article.title}`} className="w-20 h-14 object-cover rounded" loading="lazy" width="80" height="56" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{article.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{article.category}</span>
                      {article.content_score && (
                        <Badge variant="outline" className={`text-xs ${article.content_score >= 70 ? 'border-green-500 text-green-600' : article.content_score >= 40 ? 'border-amber-500 text-amber-600' : 'border-red-500 text-red-600'}`}>
                          Score: {article.content_score}
                        </Badge>
                      )}
                      {article.reading_time && (
                        <span className="text-xs text-gray-400">{article.reading_time} min read</span>
                      )}
                    </div>
                    {article.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {article.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-gray-100">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs text-gray-400">+{article.tags.length - 3}</span>
                        )}
                      </div>
                    )}
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
                    <Button size="sm" variant="ghost" className="text-blue-500 hover:text-blue-600" title="Share to Social Media"
                      onClick={() => setShareArticle(article)}>
                      <Share2 className="w-4 h-4" />
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

    {shareArticle && (
      <SocialShareDialog
        article={shareArticle}
        open={!!shareArticle}
        onClose={() => setShareArticle(null)}
      />
    )}
    </>
  );
}