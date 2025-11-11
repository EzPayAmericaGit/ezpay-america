import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm the EzPay America support assistant. How can I help you today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [infoCollected, setInfoCollected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendNotification = async (userMessage, userName, userEmail, userPhone) => {
    try {
      await base44.integrations.Core.SendEmail({
        to: "contact@ezpayamerica.com",
        from_name: "EzPay Chat Bot",
        subject: `New Chat Message from ${userName || "Website Visitor"}`,
        body: `
          <h2>New Chat Support Request</h2>
          <p><strong>From:</strong> ${userName || "Not provided"}</p>
          <p><strong>Email:</strong> ${userEmail || "Not provided"}</p>
          <p><strong>Phone:</strong> ${userPhone || "Not provided"}</p>
          <p><strong>Message:</strong> ${userMessage}</p>
          <hr>
          <p>Reply to this customer at: ${userEmail || "No email provided"}</p>
          <p>Or call: ${userPhone || "No phone provided"}</p>
        `
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    // If we haven't collected user info yet, collect it first
    if (!infoCollected) {
      if (!userInfo.name) {
        setMessages(prev => [
          ...prev,
          { role: "user", content: userMessage },
          { role: "assistant", content: "Thanks! What's your email address?" }
        ]);
        setUserInfo({ ...userInfo, name: userMessage });
        return;
      } else if (!userInfo.email) {
        setMessages(prev => [
          ...prev,
          { role: "user", content: userMessage },
          { role: "assistant", content: "Great! And your phone number?" }
        ]);
        setUserInfo({ ...userInfo, email: userMessage });
        return;
      } else if (!userInfo.phone) {
        setUserInfo({ ...userInfo, phone: userMessage });
        setInfoCollected(true);
        setMessages(prev => [
          ...prev,
          { role: "user", content: userMessage },
          { role: "assistant", content: "Perfect! Now, how can I help you today?" }
        ]);
        return;
      }
    }

    // Add user message to chat
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Send notification email
    await sendNotification(userMessage, userInfo.name, userInfo.email, userInfo.phone);

    try {
      // Get AI response
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful customer support assistant for EzPay America, a payment processing company. 
        
        Company Information:
        - We offer zero transaction fees
        - Free equipment program available
        - No long-term contracts
        - 24/7 US-based support
        - Fast approval (24-48 hours)
        - Retail and restaurant POS systems
        - Mobile payment solutions
        - E-commerce integration
        - Merchant cash advance available
        - Phone: (865) 316-9625
        - Email: contact@ezpayamerica.com
        
        Be friendly, helpful, and concise. If the question is beyond your knowledge, suggest they call (865) 316-9625 or email contact@ezpayamerica.com.
        
        Customer question: ${userMessage}`,
        add_context_from_internet: false
      });

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble connecting right now. Please call us at (865) 316-9625 or email contact@ezpayamerica.com for immediate assistance."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-2xl flex items-center justify-center hover:from-amber-600 hover:to-orange-700 transition-all"
          >
            <MessageCircle className="w-8 h-8 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
          >
            <Card className="border-none shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    EzPay Support Chat
                  </CardTitle>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white"
                            : "bg-white text-gray-900 shadow-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-900 shadow-md rounded-2xl px-4 py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        !infoCollected
                          ? !userInfo.name
                            ? "Enter your name..."
                            : !userInfo.email
                            ? "Enter your email..."
                            : "Enter your phone..."
                          : "Type your message..."
                      }
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    We typically respond within minutes
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}