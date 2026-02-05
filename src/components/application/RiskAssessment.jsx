import React from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Loader2, AlertTriangle, CheckCircle } from "lucide-react";

export default function RiskAssessment({ application }) {
  const [assessment, setAssessment] = React.useState(null);

  const assessMutation = useMutation({
    mutationFn: () => base44.functions.invoke('assessApplicationRisk', { 
      applicationId: application.id 
    }),
    onSuccess: (response) => {
      setAssessment(response.data.assessment);
    }
  });

  const riskColors = {
    low: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
    high: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" }
  };

  if (!assessment) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => assessMutation.mutate()}
        disabled={assessMutation.isPending}
        className="gap-2"
      >
        {assessMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ShieldAlert className="w-4 h-4" />
        )}
        AI Risk Assessment
      </Button>
    );
  }

  const colors = riskColors[assessment.risk_level] || riskColors.medium;

  return (
    <Card className={`${colors.bg} border-2 ${colors.border}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${colors.text}`}>
          <ShieldAlert className="w-5 h-5" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Score */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Risk Score:</span>
          <Badge className={`${colors.bg} ${colors.text} text-lg px-4 py-1`}>
            {assessment.risk_score}/100
          </Badge>
        </div>

        {/* Summary */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Summary</h4>
          <p className="text-sm text-gray-700">{assessment.summary}</p>
        </div>

        {/* Red Flags */}
        {assessment.red_flags?.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-red-700 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Red Flags
            </h4>
            <ul className="space-y-1">
              {assessment.red_flags.map((flag, idx) => (
                <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Factors */}
        {assessment.risk_factors?.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Risk Factors</h4>
            <ul className="space-y-1">
              {assessment.risk_factors.map((factor, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span>•</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Positive Indicators */}
        {assessment.positive_indicators?.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Positive Indicators
            </h4>
            <ul className="space-y-1">
              {assessment.positive_indicators.map((indicator, idx) => (
                <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendation */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Recommendation</h4>
          <p className="text-sm text-gray-700 font-medium">{assessment.recommendation}</p>
        </div>

        {/* Monitoring */}
        {assessment.monitoring_requirements?.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Monitoring Requirements</h4>
            <ul className="space-y-1">
              {assessment.monitoring_requirements.map((req, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span>•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setAssessment(null)}
          className="w-full"
        >
          Hide Assessment
        </Button>
      </CardContent>
    </Card>
  );
}