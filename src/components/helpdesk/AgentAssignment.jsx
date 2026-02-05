import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCircle, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AgentAssignment({ ticket }) {
  const queryClient = useQueryClient();

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: () => base44.entities.TicketAssignment.list()
  });

  const autoAssignMutation = useMutation({
    mutationFn: () => base44.functions.invoke('autoAssignTicket', { ticketId: ticket.id }),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['tickets']);
      queryClient.invalidateQueries(['ticket', ticket.id]);
      toast.success(`Ticket assigned to ${response.data.agentName}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Assignment failed');
    }
  });

  const manualAssignMutation = useMutation({
    mutationFn: async (agentEmail) => {
      const agent = agents.find(a => a.agentEmail === agentEmail);
      await base44.entities.Ticket.update(ticket.id, { 
        assignedTo: agentEmail,
        status: 'open'
      });
      if (agent) {
        await base44.entities.TicketAssignment.update(agent.id, {
          currentActiveTickets: agent.currentActiveTickets + 1
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      queryClient.invalidateQueries(['ticket', ticket.id]);
      toast.success('Agent assigned successfully');
    }
  });

  const availableAgents = agents.filter(a => 
    a.isAvailable && a.currentActiveTickets < a.maxActiveTickets
  );

  return (
    <div className="flex items-center gap-2">
      <UserCircle className="w-4 h-4 text-gray-400" />
      
      {ticket.assignedTo ? (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
          Assigned to: {agents.find(a => a.agentEmail === ticket.assignedTo)?.agentName || ticket.assignedTo}
        </Badge>
      ) : (
        <>
          <Select onValueChange={(value) => manualAssignMutation.mutate(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Assign to agent" />
            </SelectTrigger>
            <SelectContent>
              {availableAgents.map((agent) => (
                <SelectItem key={agent.id} value={agent.agentEmail}>
                  {agent.agentName} ({agent.currentActiveTickets}/{agent.maxActiveTickets})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => autoAssignMutation.mutate()}
            disabled={autoAssignMutation.isPending}
            className="gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${autoAssignMutation.isPending ? 'animate-spin' : ''}`} />
            Auto
          </Button>
        </>
      )}
    </div>
  );
}