import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { Link2, Sparkles, Send, Loader2, CheckCircle2, XCircle, ExternalLink, Copy } from "lucide-react";
import { motion } from "framer-motion";

export default function BacklinkOutreach() {
  const [targetUrl, setTargetUrl] = useState("");
  const [contextInfo, setContextInfo] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [authStatus, setAuthStatus] = useState({ loading: true, isAdmin: false });

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        setAuthStatus({ loading: false, isAdmin: user?.role === 'admin' });
      } catch {
        setAuthStatus({ loading: false, isAdmin: false });
      }
    };
    checkAuth();
  }, []);

  const generateOutreach = async () => {
    if (!targetUrl) return;
    
    setIsGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an SEO and digital marketing expert for EzPay America (ezpayamerica.com), a payment processing company.

Create a professional, personalized outreach email to request a backlink collaboration with this website: ${targetUrl}

Additional context about the target site: ${contextInfo || "No additional context provided"}

About EzPay America:
- Zero-fee payment processing solutions
- POS systems for retail and restaurants
- Merchant cash advance services
- Based in USA, serving businesses nationwide
- Website: ezpayamerica.com

The email should:
1. Be personalized and reference their website/content
2. Explain mutual benefit (not just asking for a favor)
3. Offer value (guest post, resource sharing, partnership)
4. Be professional but friendly
5. Include a clear call to action
6. Be concise (under 200 words)

Return just the email body, no subject line.`,
        response_json_schema: {
          type: "object",
          properties: {
            email_body: { type: "string" },
            subject_line: { type: "string" },
            key_points: { type: "array", items: { type: "string" } }
          }
        }
      });

      setGeneratedEmail(result.email_body);
    } catch (error) {
      console.error("Error generating email:", error);
      alert("Failed to generate email. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!recipientEmail || !generatedEmail) return;
    
    setIsSending(true);
    try {
      await base44.functions.invoke('sendBacklinkEmail', {
        to: recipientEmail,
        subject: 'Partnership Opportunity with EzPay America',
        body: generatedEmail
      });
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setTargetUrl("");
        setContextInfo("");
        setGeneratedEmail("");
        setRecipientEmail("");
      }, 3000);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
  };

  if (authStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!authStatus.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Admin access required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Link2 className="w-8 h-8 text-amber-600" />
            AI Backlink Outreach
          </h1>
          <p className="text-gray-600 mt-2">
            Generate personalized outreach emails to build backlinks to ezpayamerica.com
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Target Website Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Website URL *
                </label>
                <Input
                  placeholder="https://example.com"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context About Target Site (Optional)
                </label>
                <Textarea
                  placeholder="e.g., They write about small business tips, have a resource page about payment processing..."
                  value={contextInfo}
                  onChange={(e) => setContextInfo(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={generateOutreach}
                disabled={!targetUrl || isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Outreach Email
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Email Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Generated Email
                {generatedEmail && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!generatedEmail ? (
                <div className="text-center py-12 text-gray-400">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>AI-generated email will appear here</p>
                </div>
              ) : (
                <>
                  <Textarea
                    value={generatedEmail}
                    onChange={(e) => setGeneratedEmail(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email
                    </label>
                    <Input
                      type="email"
                      placeholder="contact@targetwebsite.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <Button
                    onClick={sendEmail}
                    disabled={!recipientEmail || isSending || sent}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {sent ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Email Sent!
                      </>
                    ) : isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Backlink Outreach Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Target websites in related niches: business, finance, small business, retail, restaurants</li>
              <li>• Look for sites with "Resources" or "Links" pages</li>
              <li>• Offer value: guest posts, tool mentions, partnership opportunities</li>
              <li>• Personalize each email - mention specific content from their site</li>
              <li>• Follow up after 5-7 days if no response</li>
              <li>• Track your outreach in a spreadsheet for organization</li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">EzPay America Resources to Share</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: "Homepage", url: "https://ezpayamerica.com" },
                { label: "Blog/News", url: "https://ezpayamerica.com/news" },
                { label: "Services", url: "https://ezpayamerica.com/services" },
                { label: "POS Systems", url: "https://ezpayamerica.com/ezpay-pos" }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white rounded-lg border hover:border-amber-500 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">{link.label}</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}