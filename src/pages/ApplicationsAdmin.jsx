import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  FileText, Calendar, Mail, Phone, Building, User, 
  ChevronDown, ChevronUp, Search, Download, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ApplicationsAdmin() {
  const [expandedApps, setExpandedApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const apps = await base44.entities.MerchantApplication.list('-created_date');
      return apps;
    }
  });

  const toggleExpand = (appId) => {
    if (expandedApps.includes(appId)) {
      setExpandedApps(expandedApps.filter(id => id !== appId));
    } else {
      setExpandedApps([...expandedApps, appId]);
    }
  };

  const filteredApps = applications.filter(app => {
    const search = searchTerm.toLowerCase();
    return (
      app.legalBusinessName?.toLowerCase().includes(search) ||
      app.dbaName?.toLowerCase().includes(search) ||
      app.businessEmail?.toLowerCase().includes(search) ||
      app.ownerFullName?.toLowerCase().includes(search)
    );
  });

  const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    documents_needed: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    declined: 'bg-red-100 text-red-800'
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Business Name', 'DBA', 'Owner', 'Email', 'Phone', 'Status'];
    const rows = applications.map(app => [
      new Date(app.created_date).toLocaleDateString(),
      app.legalBusinessName || '',
      app.dbaName || '',
      app.ownerFullName || '',
      app.businessEmail || '',
      app.businessPhone || '',
      app.status || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Merchant Applications</h1>
            <p className="text-gray-600">{applications.length} total applications</p>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by business name, DBA, owner, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isExpanded = expandedApps.includes(app.id);
            const data = app.applicationData || {};

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader 
                    className="bg-gradient-to-r from-gray-50 to-gray-100 border-b cursor-pointer"
                    onClick={() => toggleExpand(app.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <CardTitle className="text-lg">{app.legalBusinessName}</CardTitle>
                          <Badge className={statusColors[app.status]}>
                            {app.status?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(app.created_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {app.ownerFullName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {app.businessEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {app.businessPhone}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </Button>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <CardContent className="pt-6">
                          {/* Business Information */}
                          <div className="mb-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Business Information
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
                              <div><span className="font-medium">Legal Name:</span> {app.legalBusinessName}</div>
                              <div><span className="font-medium">DBA:</span> {app.dbaName}</div>
                              <div><span className="font-medium">Tax ID:</span> {data.taxId}</div>
                              <div><span className="font-medium">Business Type:</span> {data.businessFormationType}</div>
                              <div><span className="font-medium">Market Type:</span> {data.businessMarketType}</div>
                              <div><span className="font-medium">Started:</span> {data.dateBusinessStarted}</div>
                              <div className="md:col-span-2"><span className="font-medium">Address:</span> {data.businessPhysicalAddress}</div>
                            </div>
                          </div>

                          {/* Owner Information */}
                          <div className="mb-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Owner Information
                            </h4>
                            <div className="grid md:grid-cols-2 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
                              <div><span className="font-medium">Name:</span> {app.ownerFullName}</div>
                              <div><span className="font-medium">Title:</span> {data.ownerTitle}</div>
                              <div><span className="font-medium">DOB:</span> {data.ownerDOB}</div>
                              <div><span className="font-medium">SSN:</span> ***-**-{data.ownerSSN?.slice(-4)}</div>
                              <div><span className="font-medium">Phone:</span> {data.ownerPersonalPhone}</div>
                              <div><span className="font-medium">Email:</span> {data.ownerPersonalEmail}</div>
                              <div><span className="font-medium">DL:</span> {data.ownerDriversLicense} ({data.ownerDLState})</div>
                              <div><span className="font-medium">Ownership:</span> {data.ownerOwnershipPercent}%</div>
                              <div className="md:col-span-2"><span className="font-medium">Address:</span> {data.ownerHomeAddress}</div>
                            </div>
                          </div>

                          {/* Processing Information */}
                          <div className="mb-6">
                            <h4 className="font-semibold mb-3">Processing Information</h4>
                            <div className="grid md:grid-cols-3 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
                              <div><span className="font-medium">Swiped:</span> {data.percentageSwiped}%</div>
                              <div><span className="font-medium">Keyed:</span> {data.percentageKeyed}%</div>
                              <div><span className="font-medium">Internet:</span> {data.percentageInternet}%</div>
                              <div><span className="font-medium">Avg Ticket:</span> ${data.averageTicket}</div>
                              <div><span className="font-medium">Max Ticket:</span> ${data.largestTicket}</div>
                              <div><span className="font-medium">Monthly Volume:</span> ${data.monthlyVolume}</div>
                              <div className="md:col-span-3"><span className="font-medium">Products:</span> {data.productsDescription}</div>
                            </div>
                          </div>

                          {/* Banking Information */}
                          <div className="mb-6">
                            <h4 className="font-semibold mb-3">Banking Information</h4>
                            <div className="grid md:grid-cols-2 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
                              <div><span className="font-medium">Bank:</span> {data.bankName}</div>
                              <div><span className="font-medium">Account Type:</span> {data.accountType?.replace('_', ' ')}</div>
                              <div><span className="font-medium">Routing:</span> {data.routingNumber}</div>
                              <div><span className="font-medium">Account:</span> ****{data.accountNumber?.slice(-4)}</div>
                            </div>
                          </div>

                          {/* Documents */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Documents
                            </h4>
                            <div className="space-y-2">
                              {app.driversLicenseUrl && (
                                <a 
                                  href={app.driversLicenseUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium">Driver's License</span>
                                  <ExternalLink className="w-3 h-3 ml-auto text-blue-600" />
                                </a>
                              )}
                              {app.voidedCheckUrl && (
                                <a 
                                  href={app.voidedCheckUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium">Voided Check</span>
                                  <ExternalLink className="w-3 h-3 ml-auto text-blue-600" />
                                </a>
                              )}
                              {app.additionalDocuments?.map((doc, idx) => (
                                <a 
                                  key={idx}
                                  href={doc.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium">{doc.name}</span>
                                  <ExternalLink className="w-3 h-3 ml-auto text-blue-600" />
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Notes */}
                          {app.notes && (
                            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                              <h4 className="font-semibold mb-2">Internal Notes</h4>
                              <p className="text-sm">{app.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredApps.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No applications found matching your search' : 'No applications yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}