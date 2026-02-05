import React from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

export default function TicketSummary({ ticket }) {
  const [summary, setSummary] = React.useState(null);

  const summarizeMutation = useMutation({
    mutationFn: () => base44.functions.invoke('summarizeTicket', { ticketId: ticket.id }),
    onSuccess: (response) => {
      setSummary(response.data.summary);
    }
  });

  if (!summary) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => summarizeMutation.mutate()}
        disabled={summarizeMutation.isPending}
        className="gap-2"
      >
        {summarizeMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        AI Summary
      </Button>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Sparkles className="w-5 h-5" />
          AI Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Overview</h4>
          <p className="text-sm text-gray-600">{summary.overview}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Points</h4>
          <ul className="list-disc list-inside space-y-1">
            {summary.key_points.map((point, idx) => (
              <li key={idx} className="text-sm text-gray-600">{point}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Status</h4>
          <p className="text-sm text-gray-600">{summary.status_summary}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Next Actions</h4>
          <ul className="list-disc list-inside space-y-1">
            {summary.next_actions.map((action, idx) => (
              <li key={idx} className="text-sm text-gray-600">{action}</li>
            ))}
          </ul>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setSummary(null)}
          className="w-full"
        >
          Hide Summary
        </Button>
      </CardContent>
    </Card>
  );
}