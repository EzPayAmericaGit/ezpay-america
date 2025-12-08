import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";

export default function Testimonials() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const result = await base44.entities.Testimonial.filter({ approved: true }, '-created_date');
      return result;
    }
  });

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Customer Testimonials"
        description="Read what our customers say about EzPay America's payment processing services. Real reviews from satisfied merchants across the country."
        keywords="customer testimonials, merchant reviews, payment processing reviews, EzPay America reviews, client feedback"
      />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Customer Testimonials
            </h1>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Don't just take our word for it. See what our customers have to say about their experience with EzPay America.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Google Reviews Badge */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="inline-block shadow-xl border-2 border-amber-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" 
                    alt="Google"
                    className="h-8"
                  />
                  <div className="border-l-2 border-gray-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-3xl font-bold text-gray-900">4.9</span>
                      {renderStars(5)}
                    </div>
                    <p className="text-sm text-gray-600">Based on {testimonials.length} reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading testimonials...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-amber-200">
                    <CardContent className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {testimonial.avatar_url ? (
                            <img 
                              src={testimonial.avatar_url}
                              alt={testimonial.customer_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                              {testimonial.customer_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-gray-900">{testimonial.customer_name}</h3>
                            {testimonial.business_name && (
                              <p className="text-sm text-gray-600">{testimonial.business_name}</p>
                            )}
                          </div>
                        </div>
                        {renderStars(testimonial.rating)}
                      </div>

                      {/* Testimonial Text */}
                      <p className="text-gray-700 leading-relaxed">
                        "{testimonial.testimonial_text}"
                      </p>

                      {/* Footer */}
                      <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          {testimonial.location && (
                            <>
                              <MapPin className="w-4 h-4" />
                              <span>{testimonial.location}</span>
                            </>
                          )}
                          {testimonial.business_type && !testimonial.location && (
                            <span className="text-amber-600 font-medium">{testimonial.business_type}</span>
                          )}
                        </div>
                        {testimonial.google_review_url && (
                          <a 
                            href={testimonial.google_review_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Our Happy Customers
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the same level of service and savings that our customers rave about.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to={createPageUrl("ApplyOnline")}>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-6 text-lg shadow-xl">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}