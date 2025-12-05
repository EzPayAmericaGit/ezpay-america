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
  ShieldAlert
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
    mutationFn: async ({ id, data, sendEmail, application }) => {
      await base44.entities.MerchantApplication.update(id, data);
      
      // Send email notification if status changed
      if (sendEmail && application?.businessEmail) {
        const statusMessages = {
          approved: {
            subject: "Your Merchant Application Has Been Approved!",
            body: `Dear ${application.ownerFullName || 'Valued Merchant'},

Congratulations! Your merchant application for ${application.legalBusinessName} has been approved.

Our team will be in contact with you shortly to complete the onboarding process and get your payment processing up and running.

If you have any questions, please call us at (865) 316-9625.

Thank you for choosing EzPay America!

Best regards,
The EzPay America Team`
          },
          declined: {
            subject: "Update on Your Merchant Application",
            body: `Dear ${application.ownerFullName || 'Valued Merchant'},

Thank you for your interest in EzPay America. After careful review of your application for ${application.legalBusinessName}, we regret to inform you that we are unable to approve your application at this time.

If you have any questions or would like to discuss this decision, please call us at (865) 316-9625.

Thank you for considering EzPay America.

Best regards,
The EzPay America Team`
          },
          documents_needed: {
            subject: "Additional Documents Required for Your Application",
            body: `Dear ${application.ownerFullName || 'Valued Merchant'},

Thank you for submitting your merchant application for ${application.legalBusinessName}.

To continue processing your application, we need additional documentation. Please log in to your account or contact us at (865) 316-9625 to discuss what documents are needed.

We appreciate your prompt attention to this matter.

Best regards,
The EzPay America Team`
          },
          under_review: {
            subject: "Your Application is Under Review",
            body: `Dear ${application.ownerFullName || 'Valued Merchant'},

Your merchant application for ${application.legalBusinessName} is now under review by our underwriting team.

We will notify you once a decision has been made. This typically takes 1-2 business days.

If you have any questions, please call us at (865) 316-9625.

Best regards,
The EzPay America Team`
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
    },
    onSuccess: () => queryClient.invalidateQueries(['adminApplications'])
  });

  const runAIReview = async (application) => {
    setAiReviewing(application.id);
    
    try {
      const appData = application.applicationData || {};
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a merchant underwriting AI assistant for EzPay America. Analyze this merchant application and provide a risk assessment.

Application Details:
- Business Name: ${application.legalBusinessName}
- DBA: ${application.dbaName || 'N/A'}
- Owner: ${application.ownerFullName || 'N/A'}
- Business Type: ${appData.businessMarketType || 'N/A'}
- Formation Type: ${appData.businessFormationType || 'N/A'}
- Years in Business: ${appData.dateBusinessStarted ? Math.floor((Date.now() - new Date(appData.dateBusinessStarted).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 'Unknown'}
- Number of Locations: ${appData.numberOfLocations || '1'}
- Currently Accepts Cards: ${appData.currentlyAcceptCards || 'No'}
- Products/Services: ${appData.productsDescription || 'N/A'}
- Order Methods: ${appData.orderMethod?.join(', ') || 'N/A'}
- Delivery Timeframe: ${appData.deliveryTimeframe || 'N/A'}
- Geographic Areas: ${appData.geographicAreas || 'N/A'}
- International Card %: ${appData.internationalCardPercentage || '0'}%
- Seasonal Business: ${appData.isSeasonal || 'No'}
- Payment Timing: ${appData.paymentTiming || 'N/A'}
- Cancellation Policy: ${appData.cancellationPolicy || 'N/A'}

Documents Uploaded:
- Voided Check: ${application.voidedCheckUrl ? 'Yes' : 'No'}
- Driver's License: ${application.driversLicenseUrl ? 'Yes' : 'No'}

DocuSign Status: ${application.docusignStatus || 'Pending'}

Provide a comprehensive risk assessment including:
1. Overall risk level (Low, Medium, High)
2. Key risk factors identified
3. Positive factors
4. Missing documents or information
5. Recommended action (Approve, Request More Info, Decline)
6. Specific notes for the underwriter`,
        response_json_schema: {
          type: "object",
          properties: {
            riskLevel: { type: "string", enum: ["Low", "Medium", "High"] },
            riskScore: { type: "number", description: "1-100 score" },
            riskFactors: { type: "array", items: { type: "string" } },
            positiveFactors: { type: "array", items: { type: "string" } },
            missingItems: { type: "array", items: { type: "string" } },
            recommendedAction: { type: "string", enum: ["Approve", "Request More Info", "Decline"] },
            underwriterNotes: { type: "string" }
          }
        }
      });

      const aiNotes = `
AI REVIEW (${new Date().toLocaleDateString()})
================================
Risk Level: ${result.riskLevel} (Score: ${result.riskScore}/100)
Recommendation: ${result.recommendedAction}

Risk Factors:
${result.riskFactors?.map(f => `• ${f}`).join('\n') || 'None identified'}

Positive Factors:
${result.positiveFactors?.map(f => `• ${f}`).join('\n') || 'None identified'}

Missing Items:
${result.missingItems?.map(f => `• ${f}`).join('\n') || 'None'}

Notes: ${result.underwriterNotes}
================================
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
          <h1 className="text-3xl font-bold text-gray-900">Application Dashboard</h1>
          <div className="flex gap-2">
            <Link to={createPageUrl("NewsAdmin")}>
              <Button variant="outline">
                <Newspaper className="w-4 h-4 mr-2" />
                News Admin
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
                                onValueChange={(value) => updateMutation.mutate({ id: app.id, data: { status: value }, sendEmail: true, application: app })}
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