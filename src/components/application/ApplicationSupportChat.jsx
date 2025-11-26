import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, Loader2, Bot, User, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ApplicationSupportChat({ application, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I'm your EzPay America application assistant. I can help you with questions about your merchant application${application ? ` for ${application.legalBusinessName}` : ''}. How can I assist you today?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      const applicationContext = application ? `
Current Application Details:
- Business Name: ${application.legalBusinessName}
- DBA: ${application.dbaName || 'N/A'}
- Status: ${application.status?.replace('_', ' ') || 'Submitted'}
- DocuSign Status: ${application.docusignStatus || 'Pending'}
- Voided Check: ${application.voidedCheckUrl ? 'Uploaded' : 'Not uploaded'}
- Driver's License: ${application.driversLicenseUrl ? 'Uploaded' : 'Not uploaded'}
` : 'No application on file yet.';

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a helpful customer support AI for EzPay America, a payment processing company. Be friendly, professional, and concise.

${applicationContext}

Common topics you can help with:
- Application status and next steps
- Required documents (voided check, driver's license)
- DocuSign e-signature process
- Processing times (typically 24-48 hours for review)
- Contact info: (865) 316-9625

User question: ${userMessage}

Provide a helpful response. If you don't know something specific, direct them to call (865) 316-9625.`,
        response_json_schema: {
          type: "object",
          properties: {
            response: { type: "string" }
          }
        }
      });

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response.response 
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble connecting right now. Please call us at (865) 316-9625 for immediate assistance." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2 border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Application Support
            </CardTitle>
            <button onClick={onClose} className="hover:bg-white/20 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-amber-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t bg-white rounded-b-lg">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-amber-500 hover:bg-amber-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}