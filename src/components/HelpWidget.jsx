import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SYSTEM_PROMPT = `You are a helpful assistant for EzPay America, a payment processing company.
Help businesses with questions about:
- Zero-fee credit card processing (no transaction fees for merchants)
- POS systems for retail and restaurants
- Merchant account applications and approval
- Payment hardware and terminals
- Merchant cash advances
- Business types: retail, restaurants, cafes, bars, food trucks, grocery stores, etc.

Key facts:
- Phone: (865) 316-9625
- Email: mail@ezpayamerica.com
- Free equipment with approved merchant accounts
- No contracts, month-to-month
- 24/7 US-based support
- Quick approval

Be friendly and concise. If someone wants to apply or be contacted, suggest they use the Contact tab or call (865) 316-9625.`;

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("chat");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! 👋 I'm EzPay America's assistant. Ask me anything about our zero-fee payment processing, POS systems, or merchant services!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
      const history = messages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n");
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${SYSTEM_PROMPT}\n\nConversation:\n${history}\n\nUser: ${userMessage}\n\nAssistant:`
      });
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble responding. Please call us at (865) 316-9625 or use the Contact tab." }]);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    try {
      await base44.functions.invoke("submitHelpRequest", form);
      setSubmitted(true);
    } catch {
      alert("Failed to send. Please call (865) 316-9625.");
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden" style={{ height: "500px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">EzPay Support</p>
                <p className="text-white/80 text-xs">AI Assistant · Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-white/80 hover:text-white">
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 shrink-0">
            <button
              onClick={() => setMode("chat")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "chat" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              AI Chat
            </button>
            <button
              onClick={() => setMode("contact")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "contact" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              Contact Us
            </button>
          </div>

          {/* Chat */}
          {mode === "chat" && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-amber-500 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 border-t border-gray-200 flex gap-2 shrink-0">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value.substring(0, 500))}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 text-sm"
                  maxLength={500}
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  size="icon"
                  aria-label="Send message"
                  className="bg-amber-500 hover:bg-amber-600 shrink-0"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </>
          )}

          {/* Contact */}
          {mode === "contact" && (
            <div className="flex-1 overflow-y-auto p-4">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">Message Sent!</p>
                  <p className="text-sm text-gray-600">Our team will reach out to you shortly.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", message: "" }); }}
                    className="mt-4 text-amber-600 text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-1">Fill out the form and our team will contact you!</p>
                  <Input placeholder="Your Name *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value.substring(0, 100)})} maxLength={100} className="text-sm" />
                  <Input placeholder="Email Address *" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value.substring(0, 254)})} maxLength={254} className="text-sm" />
                  <Input placeholder="Phone Number" type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value.replace(/[^\d\s\-\+\(\)]/g, '').substring(0, 20)})} maxLength={20} className="text-sm" />
                  <Textarea placeholder="How can we help you? *" value={form.message} onChange={(e) => setForm({...form, message: e.target.value.substring(0, 2000)})} rows={3} className="text-sm resize-none" maxLength={2000} />
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !form.name || !form.email || !form.message}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                  <p className="text-xs text-center text-gray-500">Or call: <a href="tel:8653169625" className="text-amber-600 font-medium">(865) 316-9625</a></p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
        className="w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6 text-white" aria-hidden="true" /> : <MessageCircle className="w-6 h-6 text-white" aria-hidden="true" />}
      </button>
    </div>
  );
}