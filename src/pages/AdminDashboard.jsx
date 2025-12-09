import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Eye,
  Loader2,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Newspaper,
  ShieldAlert,
  Bot,
  Users,
  Wand2,
  Package
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
  submitted: { label: "Submitted", color: "bg-blue-100 text-blue-800" },
  under_review: { label: "Under Review", color: "bg-amber-100 text-amber-800" },
  documents_needed: { label: "Documents Needed", color: "bg-orange-100 text-orange-800" },
  approved: { label: "Approved", color: "bg-green-100 text-green-800" },
  declined: { label: "Declined", color: "bg-red-100 text-red-800" }
};

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedApp, setExpandedApp] = useState(null);
  const [aiReviewing, setAiReviewing] = useState(null);
  const [authStatus, setAuthStatus] = useState({ loading: true, isAdmin: false });
  const [aiIdea, setAiIdea] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await base44.auth.me();
        if (user?.role === 'admin') {
          setAuthStatus({ loading: false, isAdmin: true });
        } else {
          setAuthStatus({ loading: false, isAdmin: false });
        }
      } catch (e) {
        setAuthStatus({ loading: false, isAdmin: false });
      }
    };
    checkAuth();
  }, []);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['adminApplications'],
    queryFn: () => base44.entities.MerchantApplication.list('-created_date')
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data, sendEmail, application, autoOnboard }) => {
      const oldStatus = application.status;
      await base44.entities.MerchantApplication.update(id, data);
      
      // Automated onboarding email sequence
      if (sendEmail && application?.businessEmail && data.status !== oldStatus) {
        const statusMessages = {
          submitted: {
            subject: "✓ Application Received - Next Steps",
            body: `Dear ${application.ownerFullName || 'Valued Merchant'},

Thank you for submitting your merchant application for ${application.legalBusinessName}!

🎯 What Happens Next:
1. Our underwriting team will review your application (1-2 business days)
2. We may request additional documentation if needed
3. Once approved, we'll schedule your onboarding call
4. Your equipment will be shipped within 3-5 business days of approval

📋 Your Application Summary:
• Business: ${application.legalBusinessName}
• DBA: ${application.dbaName || 'N/A'}
• Submitted: ${new Date().toLocaleDateString()}
• Status: Under Review

📞 Questions? Call us at (865) 316-9625
📧 Email: contact@ezpayamerica.com

Track your application status anytime in your dashboard.

Welcome to EzPay America!
The EzPay Team`
          },
          approved: {
            subject: "🎉 Approved! Welcome to EzPay America",
            body: `Dear ${application.ownerFullName || 'Valued Merchant'},

Congratulations! Your merchant application for ${application.legalBusinessName} has been APPROVED! 🎊

🚀 Your Onboarding Steps:
1. ✓ Application Approved
2. → Equipment Shipping (3-5 business days)
3. → Account Setup & Training
4. → Start Processing Payments!

📦 What to Expect:
• Our onboarding specialist will contact you within 24 hours
• Free equipment will ship to: ${application.applicationData?.businessPhysicalAddress || 'your business address'}
• We'll schedule a 30-minute training session
• You'll receive login credentials for your merchant portal

💳 Your Benefits:
✓ Zero transaction fees with our surcharge program
✓ Next-day funding
✓ 24/7 customer support
✓ Free POS equipment
✓ No long-term contracts

📞 Questions? Your dedicated rep will call soon, or reach us at (865) 316-9625

Thank you for choosing EzPay America!
The EzPay Team`
          },
          declined: {
            subject: "Application Status Update - EzPay America",
            body: `Dear ${application.ownerFullName || 'Valued Merchant'},

Thank you for your interest in EzPay America and for submitting your application for ${application.legalBusinessName}.

After careful review of your application, we regret to inform you that we are unable to approve your merchant account at this time.

📞 Want to Discuss?
Our team is happy to discuss this decision and explore alternative solutions. Please call us at (865) 316-9625.

We appreciate your interest in EzPay America.

Best regards,
The EzPay America Team`
          },
          documents_needed: {
            subject: "⚠️ Action Required: Additional Documents Needed",
            body: `Dear ${application.ownerFullName || 'Valued Merchant'},

We're reviewing your merchant application for ${application.legalBusinessName} and need additional documentation to proceed.

📋 Documents Needed:
${application.notes ? application.notes.split('\n').filter(line => line.includes('missing') || line.includes('need')).join('\n') : 'Please contact us for details'}

📤 How to Submit:
1. Log in to your application dashboard
2. Upload required documents
3. Or email them to: documents@ezpayamerica.com

⏰ Timeline:
Please submit within 5 business days to avoid application expiration.

📞 Need Help? Call (865) 316-9625

Thank you for your prompt attention!
The EzPay Team`
          },
          under_review: {
            subject: "📊 Application Under Review - EzPay America",
            body: `Dear ${application.ownerFullName || 'Valued Merchant'},

Good news! Your merchant application for ${application.legalBusinessName} is now under review by our underwriting team.

⏱️ What to Expect:
• Review typically takes 1-2 business days
• We may contact you if additional information is needed
• You'll receive an email notification with our decision

📱 Track Your Application:
Log in to your dashboard anytime to check status.

💡 In the Meantime:
• Review our merchant agreement (link will be sent upon approval)
• Prepare your business location for equipment installation
• Think about any questions for your onboarding specialist

📞 Questions? Call (865) 316-9625

Thank you for your patience!
The EzPay Team`
          }
        };

        const emailContent = statusMessages[data.status];
        if (emailContent) {
          await base44.integrations.Core.SendEmail({
            to: application.businessEmail,
            subject: emailContent.subject,
            body: emailContent.body
          });
        }
      }

      // Auto-onboarding sequence for approved applications
      if (autoOnboard && data.status === 'approved' && application?.businessEmail) {
        // Schedule follow-up emails
        setTimeout(async () => {
          await base44.integrations.Core.SendEmail({
            to: application.businessEmail,
            subject: "Day 1: Your EzPay Equipment is On The Way! 📦",
            body: `Hi ${application.ownerFullName},

Your free payment processing equipment has been shipped!

📦 Tracking Info:
We'll send tracking details within 24 hours.

📚 Prepare for Success:
• Watch our quick start video: [link]
• Download the merchant app: [link]
• Review processing best practices: [link]

Your onboarding specialist will contact you soon to schedule training.

Questions? Call (865) 316-9625

Excited to have you on board!
The EzPay Team`
          });
        }, 86400000); // 24 hours
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['adminApplications'])
  });

  const runAIReview = async (application) => {
    setAiReviewing(application.id);
    
    try {
      const appData = application.applicationData || {};
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an advanced merchant underwriting AI for EzPay America with expertise in payment processing risk analysis, fraud detection, and business credit evaluation.

Analyze this merchant application using industry best practices and provide a comprehensive risk assessment:

BUSINESS PROFILE:
- Legal Name: ${application.legalBusinessName}
- DBA: ${application.dbaName || 'N/A'}
- Owner: ${application.ownerFullName || 'N/A'}
- Business Type: ${appData.businessMarketType || 'N/A'}
- Formation: ${appData.businessFormationType || 'N/A'}
- Years Operating: ${appData.dateBusinessStarted ? Math.floor((Date.now() - new Date(appData.dateBusinessStarted).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 'Unknown'}
- Locations: ${appData.numberOfLocations || '1'}
- Current Processor: ${appData.currentlyAcceptCards === 'yes' ? appData.currentProcessorName : 'None'}

BUSINESS OPERATIONS:
- Products/Services: ${appData.productsDescription || 'N/A'}
- Order Methods: ${appData.orderMethod?.join(', ') || 'N/A'}
- Delivery: ${appData.deliveryTimeframe || 'N/A'}
- Geographic Reach: ${appData.geographicAreas || 'N/A'}
- International Cards: ${appData.internationalCardPercentage || '0'}%
- Seasonal: ${appData.isSeasonal || 'No'}
- Payment Timing: ${appData.paymentTiming || 'N/A'}
- Cancellation Policy: ${appData.cancellationPolicy || 'N/A'}

PROCESSING DETAILS:
- Avg Ticket: $${appData.averageTicket || 'N/A'}
- Max Ticket: $${appData.largestTicket || 'N/A'}
- Monthly Volume: $${appData.monthlyVolume || 'N/A'}
- Annual Volume: $${appData.annualVolume || 'N/A'}
- Card Present: ${appData.percentageSwiped || 'N/A'}%
- Keyed: ${appData.percentageKeyed || 'N/A'}%
- Internet: ${appData.percentageInternet || 'N/A'}%

COMPLIANCE & DOCUMENTATION:
- Voided Check: ${application.voidedCheckUrl ? '✓' : '✗ MISSING'}
- Driver's License: ${application.driversLicenseUrl ? '✓' : '✗ MISSING'}
- DocuSign: ${application.docusignStatus || 'Pending'}
- Additional Docs: ${application.additionalDocuments?.length || 0}

EVALUATE:
1. Chargeback risk based on industry, delivery time, and refund policy
2. Fraud indicators (high ticket amounts, international cards, etc.)
3. Business stability and legitimacy
4. Compliance with card network rules
5. Documentation completeness

Provide actionable recommendations for approval decision.`,
        response_json_schema: {
          type: "object",
          properties: {
            riskLevel: { type: "string", enum: ["Low", "Medium", "High", "Critical"] },
            riskScore: { type: "number", description: "Risk score 1-100 (lower is better)" },
            fraudScore: { type: "number", description: "Fraud likelihood 1-100" },
            chargebackRisk: { type: "string", enum: ["Low", "Medium", "High"] },
            riskFactors: { type: "array", items: { type: "string" }, description: "Specific risk concerns" },
            positiveFactors: { type: "array", items: { type: "string" }, description: "Strengths in application" },
            missingItems: { type: "array", items: { type: "string" }, description: "Required documents/info" },
            complianceIssues: { type: "array", items: { type: "string" }, description: "Regulatory concerns" },
            recommendedAction: { type: "string", enum: ["Approve", "Approve with Conditions", "Request More Info", "Decline"] },
            suggestedConditions: { type: "array", items: { type: "string" }, description: "Conditions if approved" },
            underwriterNotes: { type: "string", description: "Detailed notes for human review" },
            confidenceLevel: { type: "number", description: "AI confidence in assessment 1-100" }
          }
        }
      });

      const aiNotes = `
╔════════════════════════════════════════════════════════════╗
║           AI UNDERWRITING ANALYSIS - ${new Date().toLocaleDateString()}            ║
╚════════════════════════════════════════════════════════════╝

📊 RISK ASSESSMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Overall Risk Level: ${result.riskLevel}
Risk Score: ${result.riskScore}/100
Fraud Score: ${result.fraudScore}/100
Chargeback Risk: ${result.chargebackRisk}
AI Confidence: ${result.confidenceLevel}%

✅ POSITIVE FACTORS
${result.positiveFactors?.map(f => `  ✓ ${f}`).join('\n') || '  None identified'}

⚠️  RISK FACTORS
${result.riskFactors?.map(f => `  • ${f}`).join('\n') || '  None identified'}

📋 MISSING DOCUMENTATION
${result.missingItems?.length > 0 ? result.missingItems.map(f => `  ⚠ ${f}`).join('\n') : '  ✓ All documents present'}

⚖️  COMPLIANCE ISSUES
${result.complianceIssues?.length > 0 ? result.complianceIssues.map(f => `  ! ${f}`).join('\n') : '  ✓ No compliance issues detected'}

🎯 RECOMMENDATION: ${result.recommendedAction}

${result.suggestedConditions?.length > 0 ? `
📝 SUGGESTED CONDITIONS
${result.suggestedConditions.map(c => `  → ${c}`).join('\n')}
` : ''}

💭 UNDERWRITER NOTES
${result.underwriterNotes}

════════════════════════════════════════════════════════════
${application.notes || ''}`;

      await updateMutation.mutateAsync({
        id: application.id,
        data: { notes: aiNotes }
      });

    } catch (error) {
      console.error("AI Review error:", error);
    } finally {
      setAiReviewing(null);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.legalBusinessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.businessEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.status === 'submitted').length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    declined: applications.filter(a => a.status === 'declined').length
  };

  const generateNewsArticle = async () => {
    if (!aiIdea.trim()) return;
    setAiGenerating(true);

    try {
      const categories = [
        "Mobile Payments",
        "Restaurant Tips", 
        "POS Systems",
        "Merchant Services",
        "Business News",
        "Industry Insights",
        "Technology",
        "Industry News",
        "Future Trends"
      ];

      const articleResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional content writer for EzPay America, a payment processing company. 
        
Create a complete blog article based on this idea: "${aiIdea}"

The article should be:
- Professional and informative
- Relevant to payment processing, merchant services, POS systems, or business finance
- Around 400-600 words
- Engaging and valuable to business owners

Provide a complete article with all metadata.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Catchy, SEO-friendly title" },
            excerpt: { type: "string", description: "2-3 sentence summary" },
            content: { type: "string", description: "Full article content, 400-600 words" },
            category: { type: "string", enum: categories, description: "Best fitting category" },
            tags: { type: "array", items: { type: "string" }, description: "5-8 relevant tags" },
            slug: { type: "string", description: "URL-friendly slug" },
            meta_title: { type: "string", description: "SEO title, max 60 chars" },
            meta_description: { type: "string", description: "SEO description, max 155 chars" },
            meta_keywords: { type: "string", description: "Comma-separated keywords" },
            image_prompt: { type: "string", description: "Detailed prompt for generating a relevant professional image" }
          }
        }
      });

      const { url: imageUrl } = await base44.integrations.Core.GenerateImage({
        prompt: `High-quality professional photograph for a business blog. ${articleResult.image_prompt}. Style: photorealistic, well-lit, corporate, modern. Clean composition, professional lighting. No text, no logos, no watermarks.`
      });

      const wordCount = articleResult.content?.split(/\s+/).length || 0;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      await base44.entities.NewsArticle.create({
        title: articleResult.title || "",
        slug: articleResult.slug || "",
        excerpt: articleResult.excerpt || "",
        content: articleResult.content || "",
        image: imageUrl || "",
        category: articleResult.category || "",
        tags: articleResult.tags || [],
        content_score: 75,
        sentiment: "positive",
        reading_time: readingTime,
        published: false,
        meta_title: articleResult.meta_title || "",
        meta_description: articleResult.meta_description || "",
        meta_keywords: articleResult.meta_keywords || ""
      });

      setAiIdea("");
      alert("News article generated successfully! Check NewsAdmin to review and publish.");
    } catch (error) {
      console.error("AI generation error:", error);
      alert("Failed to generate article. Please try again.");
    } finally {
      setAiGenerating(false);
    }
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
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You must be an admin to access this page.</p>
            <Button onClick={() => base44.auth.redirectToLogin()}>
              Login as Admin
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex gap-2 flex-wrap">
              <Link to={createPageUrl("OrdersAdmin")}>
                <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                  <Package className="w-4 h-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <Link to={createPageUrl("ProductAdmin")}>
                <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                  <Package className="w-4 h-4 mr-2" />
                  Products
                </Button>
              </Link>
              <Link to={createPageUrl("SettingsAdmin")}>
                <Button variant="outline" className="border-gray-500 text-gray-600 hover:bg-gray-50">
                  <Building2 className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <Link to={createPageUrl("UserManagement")}>
                <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                  <Users className="w-4 h-4 mr-2" />
                  Users
                </Button>
              </Link>
              <Link to={createPageUrl("NewsAdmin")}>
                <Button variant="outline">
                  <Newspaper className="w-4 h-4 mr-2" />
                  News
                </Button>
              </Link>
              <Button 
                onClick={() => queryClient.invalidateQueries(['adminApplications'])}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
              <p className="text-sm text-gray-500">Submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.under_review}</p>
              <p className="text-sm text-gray-500">In Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-sm text-gray-500">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
              <p className="text-sm text-gray-500">Declined</p>
            </CardContent>
          </Card>
        </div>

        {/* AI News Generator - Always Visible */}
        <Card className="mb-8 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Wand2 className="w-5 h-5" />
              AI News Article Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Describe your article idea and AI will generate a complete article with an image.
            </p>
            <Textarea
              value={aiIdea}
              onChange={(e) => setAiIdea(e.target.value)}
              placeholder="Example: Write about the benefits of contactless payments for small restaurants, focusing on speed and hygiene..."
              rows={3}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button
                onClick={generateNewsArticle}
                disabled={aiGenerating || !aiIdea.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Article & Image...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Article
                  </>
                )}
              </Button>
              <Link to={createPageUrl("NewsAdmin")}>
                <Button variant="outline">
                  <Newspaper className="w-4 h-4 mr-2" />
                  View All Articles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by business name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="documents_needed">Docs Needed</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : filteredApps.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No applications found
              </CardContent>
            </Card>
          ) : (
            filteredApps.map(app => (
              <Card key={app.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Header Row */}
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Building2 className="w-10 h-10 text-amber-500" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.legalBusinessName}</h3>
                        <p className="text-sm text-gray-500">{app.businessEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={statusConfig[app.status]?.color}>
                        {statusConfig[app.status]?.label}
                      </Badge>
                      <div className="flex gap-2">
                        {app.voidedCheckUrl && <FileText className="w-4 h-4 text-green-500" title="Voided Check" />}
                        {app.driversLicenseUrl && <FileText className="w-4 h-4 text-green-500" title="Driver's License" />}
                      </div>
                      {expandedApp === app.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedApp === app.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t bg-gray-50"
                      >
                        <div className="p-6 grid md:grid-cols-2 gap-6">
                          {/* Left Column - Details */}
                          <div className="space-y-4">
                            <h4 className="font-semibold">Application Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div><span className="text-gray-500">DBA:</span> {app.dbaName || 'N/A'}</div>
                              <div><span className="text-gray-500">Owner:</span> {app.ownerFullName || 'N/A'}</div>
                              <div><span className="text-gray-500">Phone:</span> {app.businessPhone || 'N/A'}</div>
                              <div><span className="text-gray-500">DocuSign:</span> {app.docusignStatus || 'Pending'}</div>
                            </div>
                            
                            <div className="flex gap-2 flex-wrap">
                              {app.voidedCheckUrl && (
                                <a href={app.voidedCheckUrl} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-3 h-3 mr-1" /> Voided Check
                                  </Button>
                                </a>
                              )}
                              {app.driversLicenseUrl && (
                                <a href={app.driversLicenseUrl} target="_blank" rel="noopener noreferrer">
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-3 h-3 mr-1" /> Driver's License
                                  </Button>
                                </a>
                              )}
                            </div>

                            {/* Status Update */}
                            <div className="pt-4 border-t">
                              <label className="text-sm font-medium mb-2 block">Update Status</label>
                              <Select 
                                value={app.status} 
                                onValueChange={(value) => updateMutation.mutate({ id: app.id, data: { status: value }, sendEmail: true, application: app, autoOnboard: value === 'approved' })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="submitted">Submitted</SelectItem>
                                  <SelectItem value="under_review">Under Review</SelectItem>
                                  <SelectItem value="documents_needed">Documents Needed</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="declined">Declined</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Right Column - Notes & AI */}
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold">Notes & AI Review</h4>
                              <Button 
                                size="sm" 
                                onClick={() => runAIReview(app)}
                                disabled={aiReviewing === app.id}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                {aiReviewing === app.id ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <Sparkles className="w-4 h-4 mr-1" />
                                )}
                                AI Review
                              </Button>
                            </div>
                            <Textarea
                              value={app.notes || ''}
                              onChange={(e) => updateMutation.mutate({ id: app.id, data: { notes: e.target.value }})}
                              placeholder="Add notes..."
                              rows={8}
                              className="text-sm font-mono"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}