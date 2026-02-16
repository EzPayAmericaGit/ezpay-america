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
import { UserCircle, Plus, TrendingUp, Clock, Wrench, BookOpen, Search, DollarSign, Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "../components/SEOHead";

export default function AgentManagement() {
  const [user, setUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showToolDialog, setShowToolDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [formData, setFormData] = useState({
    agentEmail: "",
    agentName: "",
    specialization: [],
    maxActiveTickets: 10,
    priority: 5,
    isAvailable: true
  });
  const [toolFormData, setToolFormData] = useState({
    toolName: "",
    toolType: "knowledge_base",
    description: "",
    isActive: true
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

  const { data: agentTools = [] } = useQuery({
    queryKey: ['agentTools'],
    queryFn: () => base44.entities.AgentTool.list(),
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

  const createToolMutation = useMutation({
    mutationFn: (data) => base44.entities.AgentTool.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['agentTools']);
      setShowToolDialog(false);
      setToolFormData({
        toolName: "",
        toolType: "knowledge_base",
        description: "",
        isActive: true
      });
      toast.success('Tool added successfully');
    }
  });

  const updateToolMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.AgentTool.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['agentTools']);
      toast.success('Tool updated');
    }
  });

  const deleteAgentMutation = useMutation({
    mutationFn: async ({ id, agent }) => {
      const currentUser = await base44.auth.me();
      
      // Log deletion in audit trail
      await base44.entities.AuditLog.create({
        userEmail: currentUser.email,
        userName: currentUser.full_name,
        action: `Deleted agent: ${agent.agentName}`,
        entityType: 'TicketAssignment',
        entityId: id,
        changes: {
          deletedAgent: {
            agentName: agent.agentName,
            agentEmail: agent.agentEmail,
            specialization: agent.specialization,
            deletedAt: new Date().toISOString()
          }
        },
        severity: 'high',
        status: 'success'
      });

      await base44.entities.TicketAssignment.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agents']);
      toast.success('Agent deleted successfully');
    }
  });

  const handleDeleteAgent = (agent) => {
    if (window.confirm(`Are you sure you want to delete agent "${agent.agentName}"?\n\nThis action cannot be undone.`)) {
      deleteAgentMutation.mutate({ id: agent.id, agent });
    }
  };

  const categories = ["technical", "billing", "general", "feature_request", "bug_report"];
  
  const toolTypes = [
    { value: "knowledge_base", icon: BookOpen, label: "Knowledge Base" },
    { value: "faq_lookup", icon: Search, label: "FAQ Lookup" },
    { value: "policy_search", icon: Archive, label: "Policy Search" },
    { value: "customer_history", icon: UserCircle, label: "Customer History" },
    { value: "order_lookup", icon: Search, label: "Order Lookup" },
    { value: "refund_calculator", icon: DollarSign, label: "Refund Calculator" },
    { value: "escalation_guide", icon: TrendingUp, label: "Escalation Guide" }
  ];

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
          <div className="flex gap-2">
            <Dialog open={showToolDialog} onOpenChange={setShowToolDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Wrench className="w-4 h-4 mr-2" />
                  Manage Tools
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Agent Tools</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {agentTools.map((tool) => {
                      const ToolIcon = toolTypes.find(t => t.value === tool.toolType)?.icon || Wrench;
                      return (
                        <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <ToolIcon className="w-5 h-5 text-amber-600" />
                            <div>
                              <p className="font-medium">{tool.toolName}</p>
                              <p className="text-xs text-gray-500">{tool.description}</p>
                              <Badge variant="outline" className="text-xs mt-1">
                                {tool.toolType.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={tool.isActive ? "default" : "secondary"}>
                              {tool.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateToolMutation.mutate({
                                id: tool.id,
                                data: { isActive: !tool.isActive }
                              })}
                            >
                              Toggle
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-3">Add New Tool</p>
                    <div className="space-y-3">
                      <Input
                        placeholder="Tool Name"
                        value={toolFormData.toolName}
                        onChange={(e) => setToolFormData({ ...toolFormData, toolName: e.target.value })}
                      />
                      <Select
                        value={toolFormData.toolType}
                        onValueChange={(value) => setToolFormData({ ...toolFormData, toolType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {toolTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Description"
                        value={toolFormData.description}
                        onChange={(e) => setToolFormData({ ...toolFormData, description: e.target.value })}
                      />
                      <Input
                        placeholder="Agent Email"
                        value={toolFormData.agentEmail}
                        onChange={(e) => setToolFormData({ ...toolFormData, agentEmail: e.target.value })}
                      />
                      <Button
                        onClick={() => createToolMutation.mutate(toolFormData)}
                        disabled={!toolFormData.toolName || !toolFormData.agentEmail}
                        className="w-full bg-amber-600 hover:bg-amber-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Tool
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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

                <div>
                  <p className="text-xs text-gray-500 mb-2">Assigned Tools:</p>
                  <div className="flex flex-wrap gap-1">
                    {agentTools.filter(t => t.agentEmail === agent.agentEmail && t.isActive).map((tool) => {
                      const ToolIcon = toolTypes.find(t => t.value === tool.toolType)?.icon || Wrench;
                      return (
                        <Badge key={tool.id} variant="outline" className="text-xs flex items-center gap-1">
                          <ToolIcon className="w-3 h-3" />
                          {tool.toolName}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex gap-2">
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
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedAgent(agent);
                        setShowToolDialog(true);
                      }}
                    >
                      <Wrench className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteAgent(agent)}
                    disabled={deleteAgentMutation.isPending}
                    className="w-full"
                  >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete Agent
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