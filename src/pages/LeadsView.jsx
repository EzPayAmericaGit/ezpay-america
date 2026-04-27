import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Download, ShieldAlert, Loader2, ChevronDown, ChevronUp,
  Building2, Phone, Mail, DollarSign, Calendar, MapPin, User, FileText, Eye, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const STATUS_CONFIG = {
  submitted:         { label: "Submitted",         color: "bg-blue-100 text-blue-800" },
  under_review:      { label: "Under Review",      color: "bg-amber-100 text-amber-800" },
  documents_needed:  { label: "Docs Needed",       color: "bg-orange-100 text-orange-800" },
  approved:          { label: "Approved",           color: "bg-green-100 text-green-800" },
  declined:          { label: "Declined",           color: "bg-red-100 text-red-800" },
};

const MARKET_TYPES = ["All Types", "Retail", "Restaurant", "E-commerce", "Professional Services", "Healthcare", "Hospitality", "Food Truck", "Salon/Spa", "Auto Services", "Other"];

function StatCard({ label, value, colorClass }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function LeadRow({ app, expanded, onToggle }) {
  const appData = app.applicationData || {};
  const submittedDate = app.created_date ? format(new Date(app.created_date), "MMM d, yyyy") : "—";
  const monthlyVol = appData.monthlyVolume ? `$${Number(appData.monthlyVolume).toLocaleString()}` : "—";
  const annualVol = appData.annualVolume ? `$${Number(appData.annualVolume).toLocaleString()}` : "—";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Summary Row */}
        <div
          className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={onToggle}
        >
          <Building2 className="w-9 h-9 text-amber-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{app.legalBusinessName}</p>
            <p className="text-sm text-gray-500 truncate">{app.dbaName ? `DBA: ${app.dbaName}` : app.businessEmail}</p>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600 shrink-0">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {submittedDate}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
              {monthlyVol}/mo
            </span>
            {appData.businessMarketType && (
              <span className="hidden lg:block text-xs bg-gray-100 rounded px-2 py-0.5">
                {appData.businessMarketType}
              </span>
            )}
          </div>

          <Badge className={`${STATUS_CONFIG[app.status]?.color || "bg-gray-100 text-gray-700"} shrink-0`}>
            {STATUS_CONFIG[app.status]?.label || app.status}
          </Badge>

          <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
            {app.driversLicenseUrl && <FileText className="w-4 h-4 text-green-500" title="DL uploaded" />}
            {app.voidedCheckUrl && <FileText className="w-4 h-4 text-green-500" title="Voided check uploaded" />}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-gray-50"
            >
              <div className="p-6 grid md:grid-cols-3 gap-6 text-sm">
                {/* Contact */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-500" /> Contact & Business
                  </h4>
                  <div className="space-y-1.5 text-gray-700">
                    <p><span className="text-gray-500">Owner:</span> {app.ownerFullName || "—"}</p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`mailto:${app.businessEmail}`} className="text-amber-600 hover:underline">{app.businessEmail || "—"}</a>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`tel:${app.businessPhone}`} className="text-amber-600 hover:underline">{app.businessPhone || "—"}</a>
                    </p>
                    {appData.businessPhysicalAddress && (
                      <p className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                        {appData.businessPhysicalAddress}
                      </p>
                    )}
                    <p><span className="text-gray-500">Formation:</span> {appData.businessFormationType || "—"}</p>
                    <p><span className="text-gray-500">Started:</span> {appData.dateBusinessStarted || "—"}</p>
                    <p><span className="text-gray-500">Locations:</span> {appData.numberOfLocations || "1"}</p>
                  </div>
                </div>

                {/* Processing */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-500" /> Processing Info
                  </h4>
                  <div className="space-y-1.5 text-gray-700">
                    <p><span className="text-gray-500">Market Type:</span> {appData.businessMarketType || "—"}</p>
                    <p><span className="text-gray-500">Monthly Volume:</span> {monthlyVol}</p>
                    <p><span className="text-gray-500">Annual Volume:</span> {annualVol}</p>
                    <p><span className="text-gray-500">Avg Ticket:</span> {appData.averageTicket ? `$${appData.averageTicket}` : "—"}</p>
                    <p><span className="text-gray-500">Largest Ticket:</span> {appData.largestTicket ? `$${appData.largestTicket}` : "—"}</p>
                    <p><span className="text-gray-500">Swiped / Keyed / Online:</span> {appData.percentageSwiped || 0}% / {appData.percentageKeyed || 0}% / {appData.percentageInternet || 0}%</p>
                    <p><span className="text-gray-500">Current Processor:</span> {appData.currentlyAcceptCards === "yes" ? (appData.currentProcessorName || "Yes") : "None"}</p>
                  </div>
                </div>

                {/* Documents & Links */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500" /> Documents & Actions
                  </h4>
                  <div className="space-y-2">
                    {app.driversLicenseUrl ? (
                      <a href={app.driversLicenseUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <Eye className="w-3.5 h-3.5 mr-2 text-green-600" /> Driver's License
                        </Button>
                      </a>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Driver's License not uploaded</p>
                    )}
                    {app.voidedCheckUrl ? (
                      <a href={app.voidedCheckUrl} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <Eye className="w-3.5 h-3.5 mr-2 text-green-600" /> Voided Check
                        </Button>
                      </a>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Voided check not uploaded</p>
                    )}
                    {(app.additionalDocuments || []).map((doc, i) => (
                      <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="w-full justify-start">
                          <Eye className="w-3.5 h-3.5 mr-2" /> {doc.name || `Doc ${i + 1}`}
                        </Button>
                      </a>
                    ))}
                  </div>
                  <div className="pt-2 border-t">
                    <Link to={createPageUrl("AdminDashboard")}>
                      <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        Open in Applications →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default function LeadsView() {
  const [authStatus, setAuthStatus] = useState({ loading: true, isAdmin: false });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("All Types");
  const [sortBy, setSortBy] = useState("newest");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    base44.auth.me()
      .then(user => setAuthStatus({ loading: false, isAdmin: user?.role === "admin" }))
      .catch(() => setAuthStatus({ loading: false, isAdmin: false }));
  }, []);

  const { data: leads = [], isLoading, refetch } = useQuery({
    queryKey: ["leadsView"],
    queryFn: () => base44.entities.MerchantApplication.list("-created_date"),
    enabled: authStatus.isAdmin,
  });

  const filtered = leads
    .filter(l => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        l.legalBusinessName?.toLowerCase().includes(q) ||
        l.businessEmail?.toLowerCase().includes(q) ||
        l.ownerFullName?.toLowerCase().includes(q) ||
        l.businessPhone?.includes(q) ||
        l.dbaName?.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      const matchMarket = marketFilter === "All Types" || (l.applicationData?.businessMarketType === marketFilter);
      return matchSearch && matchStatus && matchMarket;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_date) - new Date(a.created_date);
      if (sortBy === "oldest") return new Date(a.created_date) - new Date(b.created_date);
      if (sortBy === "volume_high") return (Number(b.applicationData?.monthlyVolume) || 0) - (Number(a.applicationData?.monthlyVolume) || 0);
      if (sortBy === "volume_low") return (Number(a.applicationData?.monthlyVolume) || 0) - (Number(b.applicationData?.monthlyVolume) || 0);
      return 0;
    });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "submitted").length,
    review: leads.filter(l => l.status === "under_review").length,
    approved: leads.filter(l => l.status === "approved").length,
    declined: leads.filter(l => l.status === "declined").length,
    totalVolume: leads.reduce((sum, l) => sum + (Number(l.applicationData?.monthlyVolume) || 0), 0),
  };

  const exportCSV = () => {
    const headers = [
      "Business Name", "DBA", "Owner", "Business Email", "Business Phone",
      "Market Type", "Formation", "Monthly Volume", "Annual Volume", "Avg Ticket",
      "Largest Ticket", "Locations", "Current Processor", "Status", "Submitted Date",
      "Business Address", "Has DL", "Has Voided Check"
    ];

    const rows = filtered.map(l => {
      const d = l.applicationData || {};
      return [
        l.legalBusinessName || "",
        l.dbaName || "",
        l.ownerFullName || "",
        l.businessEmail || "",
        l.businessPhone || "",
        d.businessMarketType || "",
        d.businessFormationType || "",
        d.monthlyVolume || "",
        d.annualVolume || "",
        d.averageTicket || "",
        d.largestTicket || "",
        d.numberOfLocations || "",
        d.currentlyAcceptCards === "yes" ? (d.currentProcessorName || "Yes") : "No",
        l.status || "",
        l.created_date ? format(new Date(l.created_date), "yyyy-MM-dd") : "",
        d.businessPhysicalAddress || "",
        l.driversLicenseUrl ? "Yes" : "No",
        l.voidedCheckUrl ? "Yes" : "No",
      ].map(v => `"${String(v).replace(/"/g, '""')}"`);
    });

    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authStatus.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!authStatus.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-sm">
          <CardContent className="p-8 text-center">
            <ShieldAlert className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-4 text-sm">Admin access required.</p>
            <Button onClick={() => base44.auth.redirectToLogin()}>Login as Admin</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-500 mt-1">Merchant application submissions from the Apply Online form</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
            <Button onClick={exportCSV} className="bg-amber-500 hover:bg-amber-600 text-white">
              <Download className="w-4 h-4 mr-2" /> Export CSV ({filtered.length})
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          <StatCard label="Total" value={stats.total} colorClass="text-gray-900" />
          <StatCard label="New" value={stats.new} colorClass="text-blue-600" />
          <StatCard label="In Review" value={stats.review} colorClass="text-amber-600" />
          <StatCard label="Approved" value={stats.approved} colorClass="text-green-600" />
          <StatCard label="Declined" value={stats.declined} colorClass="text-red-600" />
          <StatCard label="Total Mo. Vol." value={`$${(stats.totalVolume / 1000).toFixed(0)}k`} colorClass="text-purple-600" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search name, email, phone, DBA..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="documents_needed">Docs Needed</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          <Select value={marketFilter} onValueChange={setMarketFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MARKET_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="volume_high">Volume: High → Low</SelectItem>
              <SelectItem value="volume_low">Volume: Low → High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filtered.length} of {leads.length} leads
        </p>

        {/* Leads List */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-gray-400">
              No leads match your filters.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(app => (
              <LeadRow
                key={app.id}
                app={app}
                expanded={expanded === app.id}
                onToggle={() => setExpanded(expanded === app.id ? null : app.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}