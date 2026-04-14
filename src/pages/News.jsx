import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Calendar, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import NewsletterSignup from "../components/news/NewsletterSignup";

const defaultArticles = [
  {
    title: "Which Food Truck Mobile Solution Boosts Revenue by 30%?",
    excerpt: "The mobile payment revolution has fundamentally transformed how food service businesses operate and accept payments on the go.",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=600&h=400&fit=crop",
    category: "Mobile Payments"
  },
  {
    title: "Stop Wasting Money And Cut Processing Fees: 5 Quick Hacks Every Restaurant Owner Needs",
    excerpt: "Restaurant owners face relentless pressure on profit margins, with payment processing fees eating into every transaction.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    category: "Restaurant Tips"
  },
  {
    title: "7 Mistakes Restaurant Owners Make With POS Systems",
    excerpt: "Restaurant point-of-sale systems represent one of the most critical investments for any food service business.",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=600&h=400&fit=crop",
    category: "POS Systems"
  },
  {
    title: "How to Choose the Right Merchant Services Provider",
    excerpt: "Selecting the right merchant services provider can make or break your business's payment processing experience.",
    image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&h=400&fit=crop",
    category: "Merchant Services"
  },
  {
    title: "IRS Cuts Could Slow Refunds, But Not Audits: What You Need to Know",
    excerpt: "Let's just say it: When the IRS sneezes, taxpayers tend to catch a cold. Here's what business owners need to understand.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
    category: "Business News"
  },
  {
    title: "Payment Processing In Today's Marketplace",
    excerpt: "As a business owner, navigating the complexities of payment processing has never been more important or more challenging.",
    image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=600&h=400&fit=crop",
    category: "Industry Insights"
  },
  {
    title: "Credit Card Processing Has Evolved",
    excerpt: "The Evolution of Credit Card Processing: From Traditional Pricing to modern zero-fee solutions that benefit merchants.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
    category: "Technology"
  },
  {
    title: "Politics And Payment Processing: It's Not Pretty",
    excerpt: "The current political landscape is having significant impacts on how payment processors operate and serve merchants.",
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop",
    category: "Industry News"
  },
  {
    title: "Social Media Payments – Are We Ready?",
    excerpt: "Social media platforms are rapidly integrating payment solutions. Is your business prepared for this new frontier?",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    category: "Future Trends"
  }
];

const ALL_CATEGORIES = ["Mobile Payments", "Restaurant Tips", "POS Systems", "Merchant Services", "Business News", "Industry Insights", "Technology", "Industry News", "Future Trends"];

export default function News() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: dbArticles = [] } = useQuery({
    queryKey: ['publishedNews'],
    queryFn: () => base44.entities.NewsArticle.filter({ published: true }, '-created_date')
  });

  const allArticles = dbArticles.length > 0 ? [...dbArticles, ...defaultArticles] : defaultArticles;

  const filteredArticles = useMemo(() => {
    return allArticles.filter(a => {
      const matchesCategory = activeCategory === "All" || a.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch = !q || a.title?.toLowerCase().includes(q) || a.excerpt?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [allArticles, search, activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Payment Processing News & Industry Insights"
        description="Stay updated with the latest payment processing news, industry insights, merchant tips, and business trends from EzPay America. Expert advice on POS systems, mobile payments, and merchant services."
        keywords="payment processing news, merchant services updates, POS industry news, credit card processing tips, EzPay America blog, payment industry trends, merchant services blog, payment processing articles, POS system guides, mobile payment news, contactless payment trends, digital payment innovations, fintech news, payment technology, merchant tips, restaurant payment tips, retail payment advice, business payment strategies, payment processing best practices, merchant account tips, payment security news, PCI compliance updates, fraud prevention tips, chargeback management, payment processing regulations, merchant services industry, payment processor news, credit card industry news, payment gateway updates, e-commerce payment trends, online payment news, payment integration tips, business growth tips, small business payment advice, merchant success stories, payment processing case studies, industry analysis, market trends, payment statistics, merchant resources, business tools, payment calculators, cost savings tips"
        url="https://ezpayamerica.com/News"
      />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              EzPay America News
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
              Just Got a Whole Lot Easier
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              Work smarter, automate for efficiency, and open up new revenue streams.
            </p>
            <a
              href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 text-lg shadow-xl">
                Apply Online
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* News Articles Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest <span className="text-amber-600">News & Insights</span>
            </h2>
          </motion.div>

          {/* Search + Category Filter */}
          <div className="mb-10 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="pl-9 pr-9 h-11"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {["All", ...ALL_CATEGORIES].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-amber-500 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-amber-400 hover:text-amber-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {(search || activeCategory !== "All") && (
              <p className="text-center text-sm text-gray-500">{filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link 
                  to={article.slug ? `/news/${article.slug}` : article.id ? `${createPageUrl("NewsArticle")}?id=${article.id}` : "#"}
                  className="block h-full"
                >
                  <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={article.image ? `${article.image}${article.image.includes('unsplash') ? (article.image.includes('?') ? '&' : '?') + 'w=600&h=400&fit=crop&q=80&auto=format' : ''}` : "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80&auto=format"}
                        alt={`${article.title} - EzPay America payment processing news and insights`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        width="600"
                        height="400"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-3">
                      {article.created_date && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(article.created_date), 'MMM d, yyyy')}
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="pt-2">
                        <span className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSignup />

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Request a Free Consultation Today
            </h2>
            <p className="text-xl text-gray-300">
              Ready to transform your payment processing? Get started with EzPay America.
            </p>
            <div className="pt-12">
              <Link to={createPageUrl("ApplyOnline")}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                  Apply Online!
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}