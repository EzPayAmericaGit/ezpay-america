import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import SEOHead from "../components/SEOHead";
import { Search, CheckCircle2, Clock, FileText, AlertCircle, XCircle, FileSignature, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const statusConfig = {
  submitted: { label: "Submitted", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
  under_review: { label: "Under Review", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  documents_needed: { label: "Documents Needed", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
  approved: { label: "Approved", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  declined: { label: "Declined", icon: XCircle, color: "text-red-600", bg: "bg-red-100" }
};

const docusignStatusConfig = {
  sent: { label: "Sent for Signature", color: "text-blue-600" },
  delivered: { label: "Delivered", color: "text-blue-600" },
  signed: { label: "Signed", color: "text-green-600" },
  completed: { label: "Completed", color: "text-green-600" },
  declined: { label: "Declined", color: "text-red-600" }
};

export default function ApplicationTracker() {
  const [email, setEmail] = useState("");
  const [application, setApplication] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSearching(true);
    setNotFound(false);
    setApplication(null);

    try {
      const results = await base44.entities.MerchantApplication.filter({
        businessEmail: email.toLowerCase()
      }, '-created_date', 1);

      if (results && results.length > 0) {
        setApplication(results[0]);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const StatusIcon = application ? statusConfig[application.status]?.icon : null;

  return (
    <div className="min-h-screen bg-white">
      <SEOHead 
        title="Track Application"
        description="Track the status of your EzPay America merchant application."
      />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Track Your Application
          </h1>
          <p className="text-xl text-gray-800">
            Enter your business email to check your application status
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-600" />
                Find Your Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Enter your business email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={isSearching}
                  className="bg-amber-500 hover:bg-amber-600 px-8"
                >
                  {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Not Found */}
          {notFound && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Application Found</h3>
                  <p className="text-gray-600">
                    We couldn't find an application with that email address. 
                    Please check the email or <a href="/ApplyOnline" className="text-amber-600 underline">submit a new application</a>.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Application Found */}
          {application && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              {/* Status Card */}
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{application.legalBusinessName}</h3>
                      <p className="text-gray-500">{application.dbaName}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig[application.status]?.bg}`}>
                      {StatusIcon && <StatusIcon className={`w-5 h-5 ${statusConfig[application.status]?.color}`} />}
                      <span className={`font-semibold ${statusConfig[application.status]?.color}`}>
                        {statusConfig[application.status]?.label}
                      </span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Application Timeline</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Application Submitted</p>
                          <p className="text-sm text-gray-500">
                            {new Date(application.created_date).toLocaleDateString('en-US', {
                              month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {application.docusignStatus && (
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            application.docusignStatus === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <FileSignature className={`w-5 h-5 ${
                              application.docusignStatus === 'completed' ? 'text-green-600' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">E-Signature</p>
                            <p className={`text-sm ${docusignStatusConfig[application.docusignStatus]?.color}`}>
                              {docusignStatusConfig[application.docusignStatus]?.label}
                            </p>
                          </div>
                        </div>
                      )}

                      {application.status === 'under_review' && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Under Review</p>
                            <p className="text-sm text-gray-500">Our team is reviewing your application</p>
                          </div>
                        </div>
                      )}

                      {application.status === 'approved' && (
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-green-700">Application Approved!</p>
                            <p className="text-sm text-gray-500">Welcome to EzPay America</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="border-t mt-6 pt-6">
                    <p className="text-sm text-gray-600">
                      Questions about your application? Call us at{' '}
                      <a href="tel:8653169625" className="text-amber-600 font-semibold">(865) 316-9625</a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}