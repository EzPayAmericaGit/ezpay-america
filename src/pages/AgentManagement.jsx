import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCircle, Plus, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "../components/SEOHead";

export default function AgentManagement() {
  const [user, setUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    agentEmail: "",
    agentName: "",
    specialization: [],
    maxActiveTickets: 10,
    priority: 5,
    isAvailable: true
  });

  const queryClient = useQueryClient();

  React.useEffect(() => {
    base44.auth.me().then(u => {
      if (u?.role !== 'admin') {
        window.location.href = '/';
      }
      setUser(u);
    }).catch(() => window.location.href = '/');
  }, []);

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: () => base44.entities.TicketAssignment.list(),
    enabled: !!user
  });

  const createAgentMutation = useMutation({
    mutationFn: (data) => base44.entities.TicketAssignment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
      setShowCreateDialog(false);
      setFormData({
        agentEmail: "",
        agentName: "",
        specialization: [],
        maxActiveTickets: 10,
        priority: 5,
        isAvailable: true
      });
      toast.success('Agent added successfully');
    }
  });

  const updateAgentMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.TicketAssignment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
      toast.success('Agent updated');
    }
  });

  const categories = ["technical", "billing", "general", "feature_request", "bug_report"];

  const toggleSpecialization = (category) => {
    const current = formData.specialization || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    setFormData({ ...formData, specialization: updated });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
      <SEOHead title="Agent Management" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Agent</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Agent Email"
                  value={formData.agentEmail}
                  onChange={(e) => setFormData({ ...formData, agentEmail: e.target.value })}
                />
                <Input
                  placeholder="Agent Name"
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                />
                <div>
                  <label className="text-sm font-medium mb-2 block">Specialization</label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2">
                        <Checkbox
                          checked={formData.specialization?.includes(cat)}
                          onCheckedChange={() => toggleSpecialization(cat)}
                        />
                        <span className="text-sm">{cat.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="Max Active Tickets"
                  value={formData.maxActiveTickets}
                  onChange={(e) => setFormData({ ...formData, maxActiveTickets: parseInt(e.target.value) })}
                />
                <Input
                  type="number"
                  placeholder="Priority (1-10)"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                />
                <Button 
                  onClick={() => createAgentMutation.mutate(formData)}
                  disabled={!formData.agentEmail || !formData.agentName}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  Create Agent
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <UserCircle className="w-8 h-8 text-amber-600" />
                    <div>
                      <CardTitle className="text-lg">{agent.agentName}</CardTitle>
                      <p className="text-sm text-gray-500">{agent.agentEmail}</p>
                    </div>
                  </div>
                  <Badge variant={agent.isAvailable ? "default" : "secondary"}>
                    {agent.isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Tickets</span>
                  <span className="font-semibold">
                    {agent.currentActiveTickets} / {agent.maxActiveTickets}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Total Resolved
                  </span>
                  <span className="font-semibold">{agent.totalTicketsResolved || 0}</span>
                </div>

                {agent.avgResolutionTime && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Avg Resolution
                    </span>
                    <span className="font-semibold">{agent.avgResolutionTime.toFixed(1)}h</span>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-2">Specializations:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialization?.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateAgentMutation.mutate({
                      id: agent.id,
                      data: { isAvailable: !agent.isAvailable }
                    })}
                    className="flex-1"
                  >
                    {agent.isAvailable ? 'Set Unavailable' : 'Set Available'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {agents.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No agents configured yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}