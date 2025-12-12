import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Search, Mail, Phone, Building2, Tag, X, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function CRM() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showInteractionForm, setShowInteractionForm] = useState(null);
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list('-updated_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Customer.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      setShowForm(false);
      setEditingCustomer(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Customer.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      setShowForm(false);
      setEditingCustomer(null);
      setShowInteractionForm(null);
    }
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      status: formData.get('status'),
      source: formData.get('source'),
      address: formData.get('address'),
      notes: formData.get('notes')
    };

    if (editingCustomer) {
      updateMutation.mutate({ id: editingCustomer.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleAddInteraction = (customer, e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const interaction = {
      date: new Date().toISOString(),
      type: formData.get('type'),
      notes: formData.get('notes'),
      createdBy: 'current_user'
    };

    const interactions = customer.interactions || [];
    updateMutation.mutate({
      id: customer.id,
      data: {
        interactions: [...interactions, interaction],
        lastContactDate: new Date().toISOString()
      }
    });
  };

  const statusColors = {
    lead: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    churned: "bg-red-100 text-red-800"
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-amber-600" />
              Customer Relationship Management
            </h1>
            <p className="text-gray-600 mt-1">Manage leads and customer interactions</p>
          </div>
          <Button
            onClick={() => { setShowForm(true); setEditingCustomer(null); }}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="lead">Leads</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customer Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <CardTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input name="fullName" placeholder="Full Name *" defaultValue={editingCustomer?.fullName} required />
                    <Input name="email" type="email" placeholder="Email *" defaultValue={editingCustomer?.email} required />
                    <Input name="phone" placeholder="Phone" defaultValue={editingCustomer?.phone} />
                    <Input name="company" placeholder="Company" defaultValue={editingCustomer?.company} />
                    <Select name="status" defaultValue={editingCustomer?.status || "lead"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="churned">Churned</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input name="source" placeholder="Lead Source" defaultValue={editingCustomer?.source} />
                  </div>
                  <Input name="address" placeholder="Address" defaultValue={editingCustomer?.address} />
                  <Textarea name="notes" placeholder="Notes" defaultValue={editingCustomer?.notes} rows={3} />
                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingCustomer(null); }}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-600">
                      {editingCustomer ? 'Update' : 'Create'} Customer
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Customers List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{customer.fullName}</CardTitle>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${statusColors[customer.status]}`}>
                        {customer.status}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditingCustomer(customer); setShowForm(true); }}
                    >
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customer.company && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {customer.company}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {customer.email}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {customer.phone}
                    </div>
                  )}
                  {customer.notes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{customer.notes}</p>
                  )}
                  
                  {/* Interactions */}
                  {customer.interactions?.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Recent Interactions ({customer.interactions.length})</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {customer.interactions.slice(-3).reverse().map((interaction, idx) => (
                          <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                            <span className="font-medium">{interaction.type}</span>
                            <p className="text-gray-600 mt-1">{interaction.notes}</p>
                            <p className="text-gray-400 text-xs mt-1">{new Date(interaction.date).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => setShowInteractionForm(customer)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Log Interaction
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Interaction Form Modal */}
        {showInteractionForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-md w-full"
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Log Interaction - {showInteractionForm.fullName}</CardTitle>
                    <Button size="sm" variant="ghost" onClick={() => setShowInteractionForm(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handleAddInteraction(showInteractionForm, e)} className="space-y-4">
                    <Select name="type" defaultValue="call">
                      <SelectTrigger>
                        <SelectValue placeholder="Interaction Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Phone Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="demo">Demo</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea name="notes" placeholder="Interaction notes..." rows={4} required />
                    <div className="flex gap-3 justify-end">
                      <Button type="button" variant="outline" onClick={() => setShowInteractionForm(null)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-600">
                        Save Interaction
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}