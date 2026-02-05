import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SEOHead from "../components/SEOHead";

export default function TemplateManagement() {
  const [user, setUser] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "general",
    subject: "",
    message: "",
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

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.TicketTemplate.list(),
    enabled: !!user
  });

  const createTemplateMutation = useMutation({
    mutationFn: (data) => base44.entities.TicketTemplate.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      setShowCreateDialog(false);
      setFormData({
        name: "",
        category: "general",
        subject: "",
        message: "",
        isActive: true
      });
      toast.success('Template created');
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id) => base44.entities.TicketTemplate.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template deleted');
    }
  });

  const toggleTemplateMutation = useMutation({
    mutationFn: ({ id, isActive }) => base44.entities.TicketTemplate.update(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
    }
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
      <SEOHead title="Template Management" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Response Templates</h1>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="w-4 h-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Response Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Template Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="feature_request">Feature Request</SelectItem>
                    <SelectItem value="bug_report">Bug Report</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Subject (optional)"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
                <Textarea
                  placeholder="Template message..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[200px]"
                />
                <Button 
                  onClick={() => createTemplateMutation.mutate(formData)}
                  disabled={!formData.name || !formData.message}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  Create Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-amber-600" />
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-500">{template.category.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.subject && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Subject:</p>
                    <p className="text-sm font-medium">{template.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Message:</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border max-h-32 overflow-y-auto">
                    {template.message}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Used {template.usageCount || 0} times</span>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleTemplateMutation.mutate({
                      id: template.id,
                      isActive: !template.isActive
                    })}
                    className="flex-1"
                  >
                    {template.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Delete this template?')) {
                        deleteTemplateMutation.mutate(template.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No templates created yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}