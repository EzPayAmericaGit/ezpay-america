import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";

export default function NewsletterSignup({ variant = "full" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      await base44.integrations.Core.SendEmail({
        to: "info@ezpayamerica.com",
        subject: "New Newsletter Signup",
        body: `New newsletter subscriber: ${email}`
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`flex items-center justify-center gap-3 ${variant === "inline" ? "py-2" : "py-6"}`}>
        <CheckCircle2 className="w-5 h-5 text-green-500" />
        <p className="text-green-700 font-semibold">You're subscribed! Welcome aboard.</p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          className="h-10"
          required
        />
        <Button type="submit" disabled={status === "loading"} className="bg-amber-500 hover:bg-amber-600 text-white whitespace-nowrap h-10">
          {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="py-16 bg-gradient-to-br from-amber-50 to-orange-50 border-y border-amber-100"
    >
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-100 rounded-full mb-4">
          <Mail className="w-7 h-7 text-amber-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Stay in the Loop</h2>
        <p className="text-gray-600 mb-8">
          Get the latest payment processing news, tips, and industry insights delivered to your inbox. No spam, ever.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="h-12 flex-1"
            required
          />
          <Button type="submit" disabled={status === "loading"} className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 font-semibold">
            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Subscribe Free
          </Button>
        </form>
        {status === "error" && (
          <p className="text-red-500 text-sm mt-3">Something went wrong. Please try again.</p>
        )}
        <p className="text-xs text-gray-400 mt-4">Join thousands of business owners. Unsubscribe anytime.</p>
      </div>
    </motion.section>
  );
}