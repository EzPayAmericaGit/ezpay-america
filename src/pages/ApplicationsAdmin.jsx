import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, User, DollarSign, FileText, Search, Download, Eye, Landmark, Bell, Trash2 } from "lucide-react";
import SEOHead from "../components/SEOHead";
import RiskAssessment from "../components/application/RiskAssessment";
import ApplicationStats from "../components/application/ApplicationStats";
import DocumentPreview from "../components/application/DocumentPreview";

export default function ApplicationsAdmin() {
  const [user, setUser] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') {
        window.location.href = '/';
      }
      setUser(u);
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => base44.entities.MerchantApplication.list('-created_date'),
    enabled: !!user
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }) => 
      base44.entities.MerchantApplication.update(id, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
    }
  });

  const deleteApplicationMutation = useMutation({
    mutationFn: (id) => base44.entities.MerchantApplication.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['applications']);
    }
  });

  const handleDelete = (app) => {
    if (window.confirm(`Delete application for "${app.legalBusinessName}"? This cannot be undone.`)) {
      deleteApplicationMutation.mutate(app.id);
    }
  };

  const exportToCSV = () => {
    const rows = filteredApplications.length > 0 ? filteredApplications : applications;
    const headers = [
      'Submitted Date', 'Status', 'Legal Business Name', 'DBA Name',
      'Business Email', 'Business Phone', 'Owner Full Name',
      'Monthly Volume', 'Annual Volume', 'Avg Ticket',
      'Bank Name', 'Account Type', 'Routing Number',
      'Business Address', 'Market Type', 'Formation Type', 'Tax ID'
    ];
    const escape = (val) => {
      const s = String(val ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const dataRows = rows.map(app => {
      const d = app.applicationData || {};
      return [
        new Date(app.created_date).toLocaleDateString(),
        app.status,
        app.legalBusinessName,
        app.dbaName,
        app.businessEmail,
        app.businessPhone,
        app.ownerFullName,
        d.monthlyVolume,
        d.annualVolume,
        d.averageTicket,
        d.bankName,
        d.accountType,
        d.routingNumber,
        d.businessPhysicalAddress,
        d.businessMarketType,
        d.businessFormationType,
        d.taxId
      ].map(escape).join(',');
    });
    const csv = [headers.map(escape).join(','), ...dataRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchant-applications-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchQuery || 
      app.legalBusinessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.dbaName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.businessEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    documents_needed: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800'
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
      <SEOHead title="Applications Management" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Merchant Applications</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 border-green-300 text-green-700 hover:bg-green-50"
              onClick={exportToCSV}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={async () => {
                await base44.functions.invoke('sendApplicationReminders', {});
                alert('Reminders sent to eligible applicants.');
              }}
            >
              <Bell className="w-4 h-4" />
              Send Reminders Now
            </Button>
          </div>
        </div>

        <ApplicationStats applications={applications} />

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by business name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="documents_needed">Documents Needed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Loading applications...
              </CardContent>
            </Card>
          ) : filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No applications found
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((app) => (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{app.legalBusinessName}</CardTitle>
                      <p className="text-sm text-gray-500">DBA: {app.dbaName}</p>
                      <p className="text-sm text-gray-500 mt-1">{app.businessEmail}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge className={statusColors[app.status]}>
                        {app.status.replace('_', ' ')}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(app)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Owner:</span> {app.ownerFullName}
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span> {app.businessPhone}
                    </div>
                    <div>
                      <span className="font-semibold">Submitted:</span>{' '}
                      {new Date(app.created_date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Application Details</DialogTitle>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-6">
              {/* Status Update */}
              <Card className="bg-amber-50">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select
                      value={selectedApp.status}
                      onValueChange={(value) => {
                        updateStatusMutation.mutate({ 
                          id: selectedApp.id, 
                          status: value,
                          notes: selectedApp.notes 
                        });
                        setSelectedApp({ ...selectedApp, status: value });
                      }}
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
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-600" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-semibold">Legal Name:</span> {selectedApp.applicationData?.legalBusinessName}</div>
                  <div><span className="font-semibold">DBA:</span> {selectedApp.applicationData?.dbaName}</div>
                  <div><span className="font-semibold">Market Type:</span> {selectedApp.applicationData?.businessMarketType}</div>
                  <div><span className="font-semibold">Formation:</span> {selectedApp.applicationData?.businessFormationType}</div>
                  <div><span className="font-semibold">Tax ID:</span> {selectedApp.applicationData?.taxId}</div>
                  <div><span className="font-semibold">Business Name on Tax Return:</span> {selectedApp.applicationData?.businessNameOnTaxReturn}</div>
                  <div><span className="font-semibold">Started:</span> {selectedApp.applicationData?.dateBusinessStarted}</div>
                  <div><span className="font-semibold">Phone:</span> {selectedApp.applicationData?.businessPhone}</div>
                  <div><span className="font-semibold">Email:</span> {selectedApp.applicationData?.businessEmail}</div>
                  <div><span className="font-semibold">Locations:</span> {selectedApp.applicationData?.numberOfLocations}</div>
                  <div><span className="font-semibold">Location Type:</span> {selectedApp.applicationData?.businessLocationType}</div>
                  <div><span className="font-semibold">Zoning:</span> {selectedApp.applicationData?.zoningInfo}</div>
                  <div><span className="font-semibold">Permanent Signage:</span> {selectedApp.applicationData?.hasPermanentSignage}</div>
                  <div className="md:col-span-2"><span className="font-semibold">Physical Address:</span> {selectedApp.applicationData?.businessPhysicalAddress}</div>
                  {selectedApp.applicationData?.corporateAddress && (
                    <div className="md:col-span-2"><span className="font-semibold">Corporate Address:</span> {selectedApp.applicationData?.corporateAddress}</div>
                  )}
                  {selectedApp.applicationData?.currentlyAcceptCards === 'yes' && (
                    <>
                      <div><span className="font-semibold">Current Processor:</span> {selectedApp.applicationData?.currentProcessorName}</div>
                      <div><span className="font-semibold">Current Merchant ID:</span> {selectedApp.applicationData?.currentMerchantId}</div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Owner Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-600" />
                    Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-semibold">Name:</span> {selectedApp.applicationData?.ownerFullName}</div>
                  <div><span className="font-semibold">Title:</span> {selectedApp.applicationData?.ownerTitle}</div>
                  <div><span className="font-semibold">Ownership:</span> {selectedApp.applicationData?.ownerOwnershipPercent}%</div>
                  <div><span className="font-semibold">DOB:</span> {selectedApp.applicationData?.ownerDOB}</div>
                  <div><span className="font-semibold">SSN:</span> ***-**-{selectedApp.applicationData?.ownerSSN?.slice(-4)}</div>
                  <div><span className="font-semibold">Personal Phone:</span> {selectedApp.applicationData?.ownerPersonalPhone}</div>
                  <div><span className="font-semibold">Personal Email:</span> {selectedApp.applicationData?.ownerPersonalEmail}</div>
                  <div><span className="font-semibold">DL Number:</span> {selectedApp.applicationData?.ownerDriversLicense}</div>
                  <div><span className="font-semibold">DL State:</span> {selectedApp.applicationData?.ownerDLState}</div>
                  <div><span className="font-semibold">DL Expiration:</span> {selectedApp.applicationData?.ownerDLExpiration}</div>
                  <div className="md:col-span-2"><span className="font-semibold">Home Address:</span> {selectedApp.applicationData?.ownerHomeAddress}</div>
                </CardContent>
              </Card>

              {/* Processing Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                    Processing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div><span className="font-semibold">Monthly Volume:</span> ${selectedApp.applicationData?.monthlyVolume}</div>
                    <div><span className="font-semibold">Annual Volume:</span> ${selectedApp.applicationData?.annualVolume}</div>
                    <div><span className="font-semibold">Monthly Amex Volume:</span> ${selectedApp.applicationData?.amexVolume || 'N/A'}</div>
                    <div><span className="font-semibold">Avg Ticket:</span> ${selectedApp.applicationData?.averageTicket}</div>
                    <div><span className="font-semibold">Largest Ticket:</span> ${selectedApp.applicationData?.largestTicket}</div>
                    <div><span className="font-semibold">Swiped:</span> {selectedApp.applicationData?.percentageSwiped}%</div>
                    <div><span className="font-semibold">Keyed:</span> {selectedApp.applicationData?.percentageKeyed}%</div>
                    <div><span className="font-semibold">Internet:</span> {selectedApp.applicationData?.percentageInternet}%</div>
                  </div>
                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Products & Services</h4>
                    <p className="text-gray-600">{selectedApp.applicationData?.productsDescription}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div><span className="font-semibold">Order Methods:</span> {selectedApp.applicationData?.orderMethod?.join(', ') || 'N/A'}</div>
                    <div><span className="font-semibold">Delivery Timeframe:</span> {selectedApp.applicationData?.deliveryTimeframe}</div>
                    <div><span className="font-semibold">Payment Timing:</span> {selectedApp.applicationData?.paymentTiming?.replace('_', ' ')}</div>
                    <div><span className="font-semibold">Geographic Areas:</span> {selectedApp.applicationData?.geographicAreas}</div>
                    <div><span className="font-semibold">International Cards:</span> {selectedApp.applicationData?.internationalCardPercentage}%</div>
                    <div><span className="font-semibold">Seasonal:</span> {selectedApp.applicationData?.isSeasonal}</div>
                    {selectedApp.applicationData?.isSeasonal === 'yes' && (
                      <div><span className="font-semibold">Active Months:</span> {selectedApp.applicationData?.seasonalMonths}</div>
                    )}
                    <div className="md:col-span-2"><span className="font-semibold">Warranty/Guaranty:</span> {selectedApp.applicationData?.warrantyGuaranty}</div>
                    <div className="md:col-span-2"><span className="font-semibold">Return Policy:</span> {selectedApp.applicationData?.cancellationPolicy}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Banking Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-amber-600" />
                    Banking Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-semibold">Bank Name:</span> {selectedApp.applicationData?.bankName}</div>
                  <div><span className="font-semibold">Account Type:</span> {selectedApp.applicationData?.accountType?.replace('_', ' ')}</div>
                  <div><span className="font-semibold">Routing Number:</span> {selectedApp.applicationData?.routingNumber}</div>
                  <div><span className="font-semibold">Account Number:</span> ****{selectedApp.applicationData?.accountNumber?.slice(-4)}</div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <DocumentPreview url={selectedApp.driversLicenseUrl} label="Driver's License" />
                  <DocumentPreview url={selectedApp.voidedCheckUrl} label="Voided Check" />
                  {selectedApp.additionalDocuments?.map((doc, idx) => (
                    <DocumentPreview key={idx} url={doc.url} label={doc.name || `Document ${idx + 1}`} />
                  ))}
                  {!selectedApp.driversLicenseUrl && !selectedApp.voidedCheckUrl && (!selectedApp.additionalDocuments || selectedApp.additionalDocuments.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No documents uploaded</p>
                  )}
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <RiskAssessment application={selectedApp} />

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Internal Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selectedApp.notes || ""}
                    onChange={(e) => setSelectedApp({ ...selectedApp, notes: e.target.value })}
                    placeholder="Add internal notes..."
                    rows={4}
                  />
                  <Button
                    className="mt-2 bg-amber-600 hover:bg-amber-700"
                    onClick={() => updateStatusMutation.mutate({
                      id: selectedApp.id,
                      status: selectedApp.status,
                      notes: selectedApp.notes
                    })}
                  >
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}