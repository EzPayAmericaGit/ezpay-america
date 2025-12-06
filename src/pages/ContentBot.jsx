import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Bot, Sparkles, Loader2, CheckCircle2, Facebook, FileText, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ContentBot() {
  const [idea, setIdea] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [postToFacebook, setPostToFacebook] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState(null);

  const generateContent = async () => {
    if (!idea.trim()) return;
    setGenerating(true);
    setGeneratedArticle(null);
    setResult(null);

    try {
      // Generate article content
      const articleResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional content writer for EzPay America, a payment processing company.

Create a complete blog article based on this idea: "${idea}"

The article should be:
- Professional and engaging
- Relevant to payment processing, merchant services, POS systems, or business finance
- Around 400-600 words
- Valuable to business owners
- Include actionable insights

Provide complete metadata optimized for SEO and social media sharing.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Catchy, SEO-friendly title" },
            excerpt: { type: "string", description: "2-3 sentence summary" },
            content: { type: "string", description: "Full article content, 400-600 words" },
            category: { 
              type: "string", 
              enum: ["Mobile Payments", "Restaurant Tips", "POS Systems", "Merchant Services", "Business News", "Industry Insights", "Technology", "Industry News", "Future Trends"],
              description: "Best fitting category" 
            },
            tags: { type: "array", items: { type: "string" }, description: "5-8 relevant tags" },
            slug: { type: "string", description: "URL-friendly slug" },
            meta_title: { type: "string", description: "SEO title, max 60 chars" },
            meta_description: { type: "string", description: "SEO description, max 155 chars" },
            meta_keywords: { type: "string", description: "Comma-separated keywords" },
            facebook_message: { type: "string", description: "Engaging Facebook post text with emoji, 2-3 sentences, includes call-to-action" },
            image_prompt: { type: "string", description: "Detailed prompt for generating a relevant professional image" }
          }
        }
      });

      // Generate image
      const { url: imageUrl } = await base44.integrations.Core.GenerateImage({
        prompt: `High-quality professional photograph for a business blog. ${articleResult.image_prompt}. Style: photorealistic, well-lit, corporate, modern. Clean composition, professional lighting. No text, no logos, no watermarks.`
      });

      // Calculate reading time
      const wordCount = articleResult.content?.split(/\s+/).length || 0;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      const article = {
        ...articleResult,
        image: imageUrl,
        reading_time: readingTime,
        content_score: 75,
        sentiment: "positive"
      };

      setGeneratedArticle(article);
    } catch (error) {
      console.error("Generation error:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const publishContent = async () => {
    if (!generatedArticle) return;
    setPublishing(true);

    try {
      // Save to database
      const savedArticle = await base44.entities.NewsArticle.create({
        title: generatedArticle.title,
        slug: generatedArticle.slug,
        excerpt: generatedArticle.excerpt,
        content: generatedArticle.content,
        image: generatedArticle.image,
        category: generatedArticle.category,
        tags: generatedArticle.tags || [],
        content_score: generatedArticle.content_score,
        sentiment: generatedArticle.sentiment,
        reading_time: generatedArticle.reading_time,
        published: true,
        meta_title: generatedArticle.meta_title,
        meta_description: generatedArticle.meta_description,
        meta_keywords: generatedArticle.meta_keywords
      });

      let facebookResult = null;

      // Post to Facebook if enabled
      if (postToFacebook) {
        try {
          const articleUrl = `${window.location.origin}/NewsArticle?id=${savedArticle.id}`;
          const { data } = await base44.functions.invoke('postToFacebook', {
            message: generatedArticle.facebook_message || generatedArticle.excerpt,
            image_url: generatedArticle.image,
            link: articleUrl
          });
          facebookResult = data;
        } catch (fbError) {
          console.error("Facebook posting error:", fbError);
          facebookResult = { error: fbError.message || "Failed to post to Facebook" };
        }
      }

      setResult({
        success: true,
        article: savedArticle,
        facebook: facebookResult
      });

      // Reset form
      setIdea("");
      setGeneratedArticle(null);
    } catch (error) {
      console.error("Publishing error:", error);
      alert("Failed to publish article. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Content Bot</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Automated Content Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate professional articles with images and publish to your blog and Facebook automatically
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 border-purple-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Sparkles className="w-5 h-5" />
              Describe Your Content Idea
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example: Write about the benefits of mobile payment solutions for food trucks, focusing on speed, convenience, and customer satisfaction..."
              rows={5}
              className="text-base"
              disabled={generating}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={postToFacebook}
                  onCheckedChange={setPostToFacebook}
                  disabled={generating}
                />
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Post to Facebook</span>
                </div>
              </div>

              <Button
                onClick={generateContent}
                disabled={generating || !idea.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="w-5 h-5 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Content Preview */}
        {generatedArticle && (
          <Card className="mb-8 border-green-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                Content Generated Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="relative">
                <img 
                  src={generatedArticle.image} 
                  alt={generatedArticle.title}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
                <Badge className="absolute top-3 left-3 bg-purple-600">
                  <ImageIcon className="w-3 h-3 mr-1" />
                  AI Generated
                </Badge>
              </div>

              {/* Article Details */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {generatedArticle.title}
                  </h2>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{generatedArticle.category}</Badge>
                    <Badge variant="outline">{generatedArticle.reading_time} min read</Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Excerpt:</p>
                  <p className="text-gray-600">{generatedArticle.excerpt}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Content Preview:</p>
                  <p className="text-gray-600 line-clamp-4">{generatedArticle.content}</p>
                </div>

                {generatedArticle.tags?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {generatedArticle.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {postToFacebook && generatedArticle.facebook_message && (
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <p className="text-sm font-medium text-blue-900">Facebook Post:</p>
                    </div>
                    <p className="text-gray-700">{generatedArticle.facebook_message}</p>
                  </div>
                )}

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">SEO Metadata:</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Slug:</span> {generatedArticle.slug}</p>
                    <p><span className="font-medium">Meta Title:</span> {generatedArticle.meta_title}</p>
                    <p><span className="font-medium">Meta Description:</span> {generatedArticle.meta_description}</p>
                  </div>
                </div>
              </div>

              {/* Publish Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setGeneratedArticle(null)}
                  disabled={publishing}
                >
                  Discard
                </Button>
                <Button
                  onClick={publishContent}
                  disabled={publishing}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  size="lg"
                >
                  {publishing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Publish Now
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Result */}
        {result && (
          <Card className="border-green-300 bg-green-50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Content Published Successfully!
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-800">
                      ✓ Article saved to your news section
                    </p>
                    {result.facebook?.success && (
                      <p className="text-green-800">
                        ✓ Posted to Facebook (Post ID: {result.facebook.post_id})
                      </p>
                    )}
                    {result.facebook?.error && (
                      <p className="text-amber-800">
                        ⚠ Facebook posting failed: {result.facebook.error}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setResult(null)}
                  >
                    Create Another Article
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}