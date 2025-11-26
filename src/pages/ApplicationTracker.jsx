import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SEOHead from "../components/SEOHead";
import DocumentUploader from "../components/application/DocumentUploader";
import ApplicationSupportChat from "../components/application/ApplicationSupportChat";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Search, 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  MessageCircle,
  Loader2,
  Building2,
  FileSignature
} from "lucide-react";
import { motion } from "framer-motion";

const statusConfig = {
  submitted: { label: "Submitted", icon: FileCheck, color: "text-blue-600", bg: "bg-blue-100" },
  under_review: { label: "Under Review", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  documents_needed: { label: "Documents Needed", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
  approved: { label: "Approved", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  declined: { label: "Declined", icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" }
};

const docusignStatusConfig = {
  sent: { label: "Sent", color: "text-blue-600" },
  delivered: { label: "Delivered", color: "text-amber-600" },
  signed: { label: "Signed", color: "text-green-600" },
  completed: { label: "Completed", color: "text-green-600" },
  declined: { label: "Declined", color: "text-red-600" }
};

export default function ApplicationTracker() {
  const [searchEmail, setSearchEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ['applications', searchedEmail],
    queryFn: () => base44.entities.MerchantApplication.filter({ businessEmail: searchedEmail }),
    enabled: !!searchedEmail,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.MerchantApplication.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['applications', searchedEmail])
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      setSearchedEmail(searchEmail.trim().toLowerCase());
    }
  };

  const handleDocumentUpload = (applicationId, field, url) => {
    updateMutation.mutate({ id: applicationId, data: { [field]: url } });
  };

  const application = applications?.[0];
  const status = application?.status ? statusConfig[application.status] : null;
  const StatusIcon = status?.icon;

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Application Tracker"
        description="Track your EzPay America merchant application status, upload required documents, and get AI-powered support."
        keywords="application tracker, merchant application status, document upload, EzPay support"
      />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Track Your Application
            </h1>
            <p className="text-xl text-gray-800 mb-8">
              Check your application status, upload documents, and get instant support
            </p>
            
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your business email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="h-12 bg-white"
                  required
                />
                <Button 
                  type="submit" 
                  className="bg-gray-900 hover:bg-gray-800 text-white h-12 px-6"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-[50vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          )}

          {searchedEmail && !isLoading && !application && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Application Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find an application with the email: {searchedEmail}
              </p>
              <Button 
                onClick={() => window.location.href = '/ApplyOnline'}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Start New Application
              </Button>
            </motion.div>
          )}

          {application && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Status Card */}
              <Card className="border-none shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="w-6 h-6" />
                    {application.legalBusinessName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Application Status</p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status?.bg}`}>
                        {StatusIcon && <StatusIcon className={`w-5 h-5 ${status?.color}`} />}
                        <span className={`font-semibold ${status?.color}`}>{status?.label}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">E-Signature Status</p>
                      <div className="flex items-center gap-2">
                        <FileSignature className={`w-5 h-5 ${docusignStatusConfig[application.docusignStatus]?.color || 'text-gray-400'}`} />
                        <span className={`font-semibold ${docusignStatusConfig[application.docusignStatus]?.color || 'text-gray-400'}`}>
                          {docusignStatusConfig[application.docusignStatus]?.label || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                    <div>
                      <p className="text-sm text-gray-500">DBA Name</p>
                      <p className="font-medium">{application.dbaName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Owner</p>
                      <p className="font-medium">{application.ownerFullName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{application.businessEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{application.businessPhone || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload Section */}
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DocumentUploader
                    label="Voided Check"
                    description="Upload a voided check for your business bank account"
                    currentUrl={application.voidedCheckUrl}
                    onUpload={(url) => handleDocumentUpload(application.id, 'voidedCheckUrl', url)}
                  />
                  <DocumentUploader
                    label="Driver's License"
                    description="Upload a copy of the business owner's driver's license"
                    currentUrl={application.driversLicenseUrl}
                    onUpload={(url) => handleDocumentUpload(application.id, 'driversLicenseUrl', url)}
                  />
                </CardContent>
              </Card>

              {/* Progress Timeline */}
              <Card className="border-none shadow-xl">
                <CardHeader>
                  <CardTitle>Application Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {['submitted', 'under_review', 'documents_needed', 'approved'].map((step, idx) => {
                      const stepConfig = statusConfig[step];
                      const StepIcon = stepConfig.icon;
                      const isActive = application.status === step;
                      const isPast = ['submitted', 'under_review', 'documents_needed', 'approved'].indexOf(application.status) > idx;
                      
                      return (
                        <React.Fragment key={step}>
                          <div className="flex flex-col items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isActive ? 'bg-amber-500 text-white' : 
                              isPast ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <p className={`text-xs mt-2 text-center ${isActive ? 'font-semibold text-amber-600' : 'text-gray-500'}`}>
                              {stepConfig.label}
                            </p>
                          </div>
                          {idx < 3 && (
                            <div className={`flex-1 h-1 mx-2 ${isPast ? 'bg-green-500' : 'bg-gray-200'}`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Floating Chat Button */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-4 right-4 z-40 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* AI Support Chat */}
      <ApplicationSupportChat 
        application={application}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}