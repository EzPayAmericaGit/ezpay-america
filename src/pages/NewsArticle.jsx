import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import SEOHead from "../components/SEOHead";

export default function NewsArticlePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id");
  const slug = urlParams.get("slug");

  const { data: article, isLoading } = useQuery({
    queryKey: ['newsArticle', articleId, slug],
    queryFn: async () => {
      if (articleId) {
        const articles = await base44.entities.NewsArticle.filter({ id: articleId });
        return articles[0];
      } else if (slug) {
        const articles = await base44.entities.NewsArticle.filter({ slug: slug });
        return articles[0];
      }
      return null;
    },
    enabled: !!(articleId || slug)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
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
      <SEOHead 
        title={article.meta_title || article.title}
        description={article.meta_description || article.excerpt}
        keywords={article.meta_keywords || `${article.category}, EzPay America, payment processing, ${article.title.split(' ').slice(0, 3).join(', ')}`}
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
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link to={createPageUrl("News")}>
                <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to All News
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

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