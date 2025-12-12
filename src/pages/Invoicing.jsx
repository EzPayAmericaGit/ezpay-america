import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Search, Send, DollarSign, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Invoicing() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [lineItems, setLineItems] = useState([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
  const queryClient = useQueryClient();

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list('-created_date')
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list()
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Invoice.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      setShowForm(false);
      setLineItems([{ description: '', quantity: 1, rate: 0, amount: 0 }]);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Invoice.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
    }
  });

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    if (field === 'quantity' || field === 'rate') {
      updated[index].amount = parseFloat(updated[index].quantity || 0) * parseFloat(updated[index].rate || 0);
    }
    setLineItems(updated);
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subtotal = calculateSubtotal();
    const tax = parseFloat(formData.get('tax')) || 0;
    const total = subtotal + tax;

    const data = {
      invoiceNumber: `INV-${Date.now()}`,
      customerName: formData.get('customerName'),
      customerEmail: formData.get('customerEmail'),
      customerAddress: formData.get('customerAddress'),
      items: lineItems.filter(item => item.description),
      subtotal,
      tax,
      total,
      status: 'draft',
      issueDate: formData.get('issueDate'),
      dueDate: formData.get('dueDate'),
      notes: formData.get('notes'),
      terms: formData.get('terms')
    };

    createMutation.mutate(data);
  };

  const handleSendInvoice = async (invoice) => {
    await updateMutation.mutateAsync({
      id: invoice.id,
      data: { status: 'sent' }
    });

    // Send invoice email
    base44.functions.invoke('sendInvoiceEmail', {
      to: invoice.customerEmail,
      invoiceNumber: invoice.invoiceNumber,
      total: invoice.total,
      dueDate: invoice.dueDate
    }).catch(err => console.error('Invoice email error:', err));
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-600"
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-amber-600" />
              Invoicing
            </h1>
            <p className="text-gray-600 mt-1">Create and manage professional invoices</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Invoice
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search invoices..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card>
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
                <CardTitle>Create New Invoice</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Customer Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input name="customerName" placeholder="Customer Name *" required />
                    <Input name="customerEmail" type="email" placeholder="Customer Email *" required />
                  </div>
                  <Textarea name="customerAddress" placeholder="Billing Address" rows={2} />

                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Issue Date *</label>
                      <Input name="issueDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Due Date *</label>
                      <Input name="dueDate" type="date" required />
                    </div>
                  </div>

                  {/* Line Items */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Line Items</label>
                    <div className="space-y-2">
                      {lineItems.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                            className="col-span-5"
                          />
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                            className="col-span-2"
                          />
                          <Input
                            type="number"
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) => updateLineItem(index, 'rate', e.target.value)}
                            className="col-span-2"
                          />
                          <Input
                            type="number"
                            value={item.amount.toFixed(2)}
                            readOnly
                            className="col-span-2 bg-gray-50"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeLineItem(index)}
                            className="col-span-1"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" onClick={addLineItem} className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Line Item
                    </Button>
                  </div>

                  {/* Totals */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Tax:</span>
                      <Input
                        name="tax"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-32 text-right"
                      />
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>${(calculateSubtotal() + (parseFloat(document.querySelector('input[name="tax"]')?.value) || 0)).toFixed(2)}</span>
                    </div>
                  </div>

                  <Textarea name="notes" placeholder="Invoice notes..." rows={2} />
                  <Input name="terms" placeholder="Payment terms (e.g., Net 30)" />

                  <div className="flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-amber-500 to-orange-600">
                      Create Invoice
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold">{invoice.invoiceNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-1">{invoice.customerName}</p>
                      <p className="text-sm text-gray-500">{invoice.customerEmail}</p>
                      <div className="flex gap-6 mt-3 text-sm text-gray-600">
                        <div>Issue: {invoice.issueDate}</div>
                        <div>Due: {invoice.dueDate}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-4">
                        ${invoice.total?.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        {invoice.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleSendInvoice(invoice)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send
                          </Button>
                        )}
                        {invoice.status === 'sent' && (
                          <Button
                            size="sm"
                            onClick={() => updateMutation.mutate({ id: invoice.id, data: { status: 'paid', paidDate: new Date().toISOString() } })}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}