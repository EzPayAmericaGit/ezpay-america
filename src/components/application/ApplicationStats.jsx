import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, AlertCircle, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

export default function ApplicationStats({ applications }) {
  const counts = {
    total: applications.length,
    submitted: applications.filter(a => a.status === 'submitted').length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    documents_needed: applications.filter(a => a.status === 'documents_needed').length,
    approved: applications.filter(a => a.status === 'approved').length,
    declined: applications.filter(a => a.status === 'declined').length,
  };

  const approvalRate = counts.total > 0
    ? Math.round((counts.approved / counts.total) * 100)
    : 0;

  const stats = [
    { label: "Total", value: counts.total, icon: FileText, color: "text-gray-600", bg: "bg-gray-100" },
    { label: "Submitted", value: counts.submitted, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Under Review", value: counts.under_review, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Docs Needed", value: counts.documents_needed, icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Approved", value: counts.approved, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Approval Rate", value: `${approvalRate}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className={`${stat.bg} border-0`}>
            <CardContent className="p-4 text-center">
              <Icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}