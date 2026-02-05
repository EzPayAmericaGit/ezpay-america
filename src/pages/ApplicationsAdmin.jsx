import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, User, DollarSign, FileText, Search, Download, Eye } from "lucide-react";
import SEOHead from "../components/SEOHead";

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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Merchant Applications</h1>

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
                  <div><span className="font-semibold">Started:</span> {selectedApp.applicationData?.dateBusinessStarted}</div>
                  <div><span className="font-semibold">Phone:</span> {selectedApp.applicationData?.businessPhone}</div>
                  <div><span className="font-semibold">Email:</span> {selectedApp.applicationData?.businessEmail}</div>
                  <div className="md:col-span-2"><span className="font-semibold">Address:</span> {selectedApp.applicationData?.businessPhysicalAddress}</div>
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
                  <div><span className="font-semibold">DL:</span> {selectedApp.applicationData?.ownerDriversLicense} ({selectedApp.applicationData?.ownerDLState})</div>
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
                <CardContent className="grid md:grid-cols-2 gap-3 text-sm">
                  <div><span className="font-semibold">Monthly Volume:</span> ${selectedApp.applicationData?.monthlyVolume}</div>
                  <div><span className="font-semibold">Annual Volume:</span> ${selectedApp.applicationData?.annualVolume}</div>
                  <div><span className="font-semibold">Avg Ticket:</span> ${selectedApp.applicationData?.averageTicket}</div>
                  <div><span className="font-semibold">Max Ticket:</span> ${selectedApp.applicationData?.largestTicket}</div>
                  <div><span className="font-semibold">Swiped:</span> {selectedApp.applicationData?.percentageSwiped}%</div>
                  <div><span className="font-semibold">Keyed:</span> {selectedApp.applicationData?.percentageKeyed}%</div>
                  <div><span className="font-semibold">Internet:</span> {selectedApp.applicationData?.percentageInternet}%</div>
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
                  {selectedApp.driversLicenseUrl && (
                    <a 
                      href={selectedApp.driversLicenseUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 rounded border hover:bg-gray-100"
                    >
                      📄 Driver's License
                    </a>
                  )}
                  {selectedApp.voidedCheckUrl && (
                    <a 
                      href={selectedApp.voidedCheckUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 rounded border hover:bg-gray-100"
                    >
                      📄 Voided Check
                    </a>
                  )}
                  {selectedApp.additionalDocuments?.map((doc, idx) => (
                    <a 
                      key={idx}
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 rounded border hover:bg-gray-100"
                    >
                      📄 {doc.name}
                    </a>
                  ))}
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