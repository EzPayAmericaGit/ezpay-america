import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Send, User, Calendar, Tag, Loader2, Paperclip, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import AgentAssignment from "./AgentAssignment";
import TemplateSelector from "./TemplateSelector";
import TicketSummary from "./TicketSummary";

export default function TicketDetails({ ticket, user, isAdmin, onUpdate, onClose }) {
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  // Security: Non-admins can only view their own tickets
  if (!isAdmin && ticket.customerEmail !== user?.email) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You can only view your own tickets.</p>
        </CardContent>
      </Card>
    );
  }

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['ticketMessages', ticket.id],
    queryFn: async () => {
      try {
        return await base44.entities.TicketMessage.filter(
          { ticketId: ticket.id },
          'created_date'
        );
      } catch (err) {
        console.error('Messages fetch error:', err);
        return [];
      }
    },
    retry: 2,
    staleTime: 10000
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Ticket.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      onUpdate();
    }
  });

  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId) => {
      // Log deletion in audit trail
      await base44.entities.AuditLog.create({
        userEmail: user.email,
        userName: user.full_name,
        action: `Deleted ticket: ${ticket.title}`,
        entityType: 'Ticket',
        entityId: ticketId,
        changes: {
          deletedTicket: {
            ticketNumber: ticket.ticketNumber,
            title: ticket.title,
            customerEmail: ticket.customerEmail,
            status: ticket.status,
            deletedAt: new Date().toISOString()
          }
        },
        severity: 'high',
        status: 'success'
      });

      await base44.entities.Ticket.delete(ticketId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Ticket deleted successfully');
      onClose?.();
    }
  });

  const handleDeleteTicket = () => {
    if (window.confirm(`Are you sure you want to delete ticket "${ticket.title}"?\n\nThis action cannot be undone.`)) {
      deleteTicketMutation.mutate(ticket.id);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      await base44.entities.TicketMessage.create({
        ticketId: ticket.id,
        message: newMessage,
        senderEmail: user.email,
        senderName: user.full_name || user.email,
        isInternal: false
      });

      // Update ticket status to open if it's new
      if (ticket.status === 'new') {
        await updateTicketMutation.mutateAsync({
          id: ticket.id,
          data: { status: 'open' }
        });
      }

      queryClient.invalidateQueries({ queryKey: ['ticketMessages', ticket.id] });
      setNewMessage("");
    } catch (err) {
      console.error('Send message error:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    open: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-orange-100 text-orange-800',
    solved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    normal: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };

  return (
    <Card className="h-full flex flex-col max-h-[calc(100vh-12rem)]">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="text-xl">#{ticket.ticketNumber}</CardTitle>
              <Badge className={statusColors[ticket.status]}>
                {ticket.status}
              </Badge>
              <Badge className={priorityColors[ticket.priority]}>
                {ticket.priority}
              </Badge>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{ticket.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {ticket.customerName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(ticket.created_date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {ticket.category}
              </span>
              {isAdmin && <AgentAssignment ticket={ticket} />}
              {isAdmin && <TicketSummary ticket={ticket} />}
            </div>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteTicket}
                disabled={deleteTicketMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="flex gap-3 mt-4">
            <Select
              value={ticket.status}
              onValueChange={(value) => updateTicketMutation.mutate({ 
                id: ticket.id, 
                data: { status: value, resolvedDate: value === 'solved' ? new Date().toISOString() : null } 
              })}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={ticket.priority}
              onValueChange={(value) => updateTicketMutation.mutate({ id: ticket.id, data: { priority: value } })}
            >
              <SelectTrigger className="w-32">
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
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6">
        {/* Initial Description */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-500 mb-2">Initial Request</p>
          <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {messagesLoading ? (
            <div className="text-center py-6">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
            </div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.senderEmail === user?.email;
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    isCurrentUser 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-white border border-gray-200'
                  } rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {msg.senderName}
                      </span>
                      <span className={`text-xs ${isCurrentUser ? 'text-amber-100' : 'text-gray-500'}`}>
                        {new Date(msg.created_date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    {msg.attachments?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map((att, idx) => (
                          <a 
                            key={idx}
                            href={att.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs underline"
                          >
                            <Paperclip className="w-3 h-3" />
                            {att.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>

      {/* Reply Box */}
      {ticket.status !== 'closed' && (
        <div className="border-t p-4 bg-gray-50">
          {isAdmin && (
            <TemplateSelector 
              category={ticket.category}
              onSelectTemplate={(templateMessage) => setNewMessage(templateMessage)}
            />
          )}
          <div className="flex gap-3">
            <Textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 min-h-[80px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSendMessage();
                }
              }}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              className="bg-amber-600 hover:bg-amber-700 h-[80px]"
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to send</p>
        </div>
      )}
    </Card>
  );
}