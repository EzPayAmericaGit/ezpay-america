import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";

export default function CreateTicketDialog({ open, onClose, user, onCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    businessName: "",
    businessPhone: "",
    businessAddress: "",
    contactPerson: "",
    priority: "normal",
    category: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.businessName || 
        !formData.businessPhone || !formData.businessAddress || !formData.contactPerson) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`;
      
      const ticket = await base44.entities.Ticket.create({
        ticketNumber,
        title: formData.title,
        description: formData.description,
        businessName: formData.businessName,
        businessPhone: formData.businessPhone,
        businessAddress: formData.businessAddress,
        contactPerson: formData.contactPerson,
        priority: formData.priority,
        category: formData.category,
        customerEmail: user?.email || 'guest@ezpayamerica.com',
        customerName: user?.full_name || formData.contactPerson || 'Guest User',
        status: 'new'
      });

      // Send email notification
      base44.functions.invoke('notifyNewTicket', {
        ticketData: ticket
      }).catch(err => console.error('Email notification error:', err));

      onCreated(ticket);
      setFormData({
        title: "",
        description: "",
        businessName: "",
        businessPhone: "",
        businessAddress: "",
        contactPerson: "",
        priority: "normal",
        category: "general"
      });
    } catch (err) {
      console.error('Create ticket error:', err);
      alert('Failed to create ticket. Please try again or call (865) 316-9625.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Support Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              placeholder="Brief summary of your issue"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Textarea
              placeholder="Please describe your issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <Input
                placeholder="Your business name"
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <Input
                placeholder="Your name"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Phone *
              </label>
              <Input
                type="tel"
                placeholder="(555) 123-4567"
                value={formData.businessPhone}
                onChange={(e) => setFormData({...formData, businessPhone: e.target.value})}
                className="h-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Address *
              </label>
              <Input
                placeholder="123 Main St, City, State"
                value={formData.businessAddress}
                onChange={(e) => setFormData({...formData, businessAddress: e.target.value})}
                className="h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select 
                value={formData.priority}
                onValueChange={(value) => setFormData({...formData, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select 
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="general">General Inquiry</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                  <SelectItem value="bug_report">Bug Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}