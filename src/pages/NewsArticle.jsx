import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Tag, ArrowRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import SEOHead from "../components/SEOHead";
import ReadingProgress from "../components/news/ReadingProgress";
import NewsletterSignup from "../components/news/NewsletterSignup";

export default function NewsArticlePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");
  const slugFromQuery = urlParams.get("slug");
  // Also support clean /news/:slug path param
  const { slug: slugFromPath } = useParams();
  const slug = slugFromPath || slugFromQuery;

  const { data: article, isLoading } = useQuery({
    queryKey: ['newsArticle', articleId, slug],
    queryFn: async () => {
      const res = await base44.functions.invoke('getArticleBySlug', { slug, id: articleId });
      return res?.data?.article || null;
    },
    enabled: !!(articleId || slug)
  });

  const { data: relatedArticles = [] } = useQuery({
    queryKey: ['relatedArticles', article?.category, article?.id],
    queryFn: async () => {
      const listRes = await base44.entities.NewsArticle.list('-created_date', 50);
      return listRes.filter(a => a.published && a.category === article.category && a.id !== article.id).slice(0, 3);
    },
    enabled: !!article?.category
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!article) {
    // If no slug/id provided at all, redirect to news listing
    if (!slug && !articleId) {
      window.location.replace('/News');
      return null;
    }
    return (
      <div className="min-h-screen bg-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-500 mb-6">This article may have been moved or is no longer available.</p>
          <Link to={createPageUrl("News")}>
            <Button className="bg-amber-500 hover:bg-amber-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />
      <SEOHead 
        title={article.meta_title || article.title}
        description={article.meta_description || article.excerpt}
        keywords={article.meta_keywords || `${article.category}, EzPay America, payment processing, ${article.title.split(' ').slice(0, 3).join(', ')}`}
        image={article.image}
        url={`https://ezpayamerica.com/news/${article.slug || article.id}`}
        articleSchema={{
          headline: article.title,
          description: article.excerpt,
          image: article.image,
          datePublished: article.created_date,
          dateModified: article.updated_date || article.created_date,
          category: article.category,
          slug: article.slug,
          id: article.id,
        }}
      />

      {/* Hero with Image */}
      <section className="relative">
        {article.image && (
          <div className="h-[400px] md:h-[500px] relative">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        )}
        <div className={`${article.image ? 'absolute bottom-0 left-0 right-0' : 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 py-20'}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-amber-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {article.category}
                </span>
                {article.created_date && (
                  <span className={`${article.image ? 'text-gray-200' : 'text-gray-700'} text-sm flex items-center gap-1`}>
                    <Calendar className="w-3 h-3" />
                    {format(new Date(article.created_date), 'MMMM d, yyyy')}
                  </span>
                )}
              </div>
              <h1 className={`text-3xl md:text-5xl font-bold ${article.image ? 'text-white' : 'text-gray-900'} leading-tight`}>
                {article.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-amber-500 pl-6">
              {article.excerpt}
            </p>

            {/* Full Content */}
            {article.content && (
              <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-amber-600 prose-strong:text-gray-900">
                <ReactMarkdown>{article.content}</ReactMarkdown>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <Link to={createPageUrl("News")}>
                <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All News
                </Button>
              </Link>
              <div>
                <p className="text-sm text-gray-500 mb-2">Enjoy this article? Get more in your inbox:</p>
                <NewsletterSignup variant="inline" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-14 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedArticles.map(rel => (
                <Link key={rel.id} to={`/news/${rel.slug || rel.id}`} className="block group">
                  <Card className="h-full border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {rel.image && (
                      <img src={rel.image} alt={rel.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    )}
                    <CardContent className="p-4">
                      <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">{rel.category}</span>
                      <h3 className="text-sm font-bold text-gray-900 mt-2 line-clamp-2 group-hover:text-amber-600 transition-colors">{rel.title}</h3>
                      <span className="text-amber-600 text-xs font-semibold mt-2 inline-flex items-center gap-1">Read More <ArrowRight className="w-3 h-3" /></span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Payment Processing?
          </h2>
          <p className="text-gray-300 mb-8">
            Get started with EzPay America today and experience zero-fee processing.
          </p>
          <a
            href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
              Apply Online
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}