import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";

const newsArticles = [
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

export default function News() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="News"
        description="Stay updated with the latest payment processing news, industry insights, and tips for merchants from EzPay America."
        keywords="payment processing news, merchant services updates, POS industry news, credit card processing tips, EzPay America blog"
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
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              EzPay America Also <span className="text-amber-600">Offers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="pt-2">
                      <Button 
                        variant="ghost" 
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0 h-auto font-semibold"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <a
              href="https://hq.netevia.com/MerchantApplication/Index/68c59701-6e8c-4268-b846-ebe8fb143210?startNew=true"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                Apply Online!
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}