import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, Mail } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm here to help you with payment processing, POS systems, and merchant services. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOfflineForm, setShowOfflineForm] = useState(false);
  const [offlineForm, setOfflineForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [offlineSubmitting, setOfflineSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.slice(-5).map(m => `${m.role}: ${m.content}`).join('\n');
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful customer service representative for EzPay America, a leading payment processing and POS systems provider.

Our key offerings:
- Zero-fee payment processing solutions
- Advanced POS systems for retail and restaurants
- Countertop payment terminals
- Mobile payment solutions
- Web payment pages
- Merchant cash advances
- 24/7 customer support
- Free equipment with processing

User question: ${userMessage}

Recent conversation:
${conversationHistory}

Provide a helpful, friendly, and professional response. Be concise (2-4 sentences). If asked about pricing, mention our zero-fee model. If asked about equipment, mention free equipment with processing. If they want to apply or get started, encourage them to visit our Apply Online page or call (865) 316-9625. Always be enthusiastic about helping their business grow.`
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize for the technical difficulty. Please call us at (865) 316-9625 or email contact@ezpayamerica.com for immediate assistance." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflineSubmit = async (e) => {
    e.preventDefault();
    setOfflineSubmitting(true);

    try {
      await base44.functions.invoke('sendContactEmail', {
        name: offlineForm.name,
        email: offlineForm.email,
        phone: '',
        message: `[Live Chat Message]\n\n${offlineForm.message}`
      });

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Thank you! Your message has been received. We'll get back to you within 24 hours. You can also call us at (865) 316-9625 for immediate assistance." 
      }]);
      
      setShowOfflineForm(false);
      setOfflineForm({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Failed to send message. Please try again or call (865) 316-9625.");
    } finally {
      setOfflineSubmitting(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="h-16 w-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-2xl hover:shadow-amber-500/50 transition-all duration-300"
            >
              <MessageCircle className="w-7 h-7" />
            </Button>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)]"
          >
            <Card className="shadow-2xl border-2 border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Live Chat Support</CardTitle>
                    <p className="text-xs text-amber-50 mt-1">We typically reply instantly</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {!showOfflineForm ? (
                  <>
                    {/* Messages */}
                    <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
                      {messages.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                              msg.role === "user"
                                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                                : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </motion.div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200 shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t bg-white p-4 rounded-b-lg">
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSend()}
                          placeholder="Type your message..."
                          disabled={isLoading}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSend}
                          disabled={isLoading || !input.trim()}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="link"
                        onClick={() => setShowOfflineForm(true)}
                        className="text-xs text-gray-500 hover:text-amber-600 p-0 h-auto"
                      >
                        <Mail className="w-3 h-3 mr-1" />
                        Leave a message
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Offline Form */}
                    <div className="p-4 bg-gray-50">
                      <div className="text-center mb-4">
                        <Mail className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-gray-900">Leave us a message</h3>
                        <p className="text-sm text-gray-600">We'll get back to you within 24 hours</p>
                      </div>
                      <form onSubmit={handleOfflineSubmit} className="space-y-3">
                        <Input
                          placeholder="Your Name"
                          value={offlineForm.name}
                          onChange={(e) => setOfflineForm({...offlineForm, name: e.target.value})}
                          required
                        />
                        <Input
                          type="email"
                          placeholder="Your Email"
                          value={offlineForm.email}
                          onChange={(e) => setOfflineForm({...offlineForm, email: e.target.value})}
                          required
                        />
                        <Textarea
                          placeholder="Your Message"
                          value={offlineForm.message}
                          onChange={(e) => setOfflineForm({...offlineForm, message: e.target.value})}
                          rows={4}
                          required
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowOfflineForm(false)}
                            className="flex-1"
                          >
                            Back to Chat
                          </Button>
                          <Button
                            type="submit"
                            disabled={offlineSubmitting}
                            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                          >
                            {offlineSubmitting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Send Message"
                            )}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}