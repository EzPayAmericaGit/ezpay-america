import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Helen Johns",
    text: "I signed up with EzPay America Merchant Services 3 months ago and they have been really great ever since! I was initially concerned about bad experiences with other business service companies but had no problems with EzPay!",
    rating: 5
  },
  {
    name: "Sam Shelby",
    text: "EzPay America Merchant Services has been our credit card processing provider for some time. We really enjoy working with EzPay America and can't imagine working with any other company now.",
    rating: 5
  },
  {
    name: "Steve Strone",
    text: "EzPay America gets my positive recommendations for the quality of the service and the product. We switched to EzPay America and soon discovered that it was one of the best decisions we have ever made.",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-amber-600 font-semibold mb-2">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            What Others are Saying
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white shadow-xl hover:shadow-2xl transition-all border-none">
                <CardContent className="p-8 space-y-4">
                  <Quote className="w-10 h-10 text-amber-500" />
                  
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {testimonial.text}
                  </p>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}