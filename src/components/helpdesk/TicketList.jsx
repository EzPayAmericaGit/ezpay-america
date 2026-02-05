import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TicketList({ tickets, isLoading, selectedTicket, onSelectTicket, isAdmin }) {
  const statusIcons = {
    new: AlertCircle,
    open: Clock,
    pending: Clock,
    solved: CheckCircle2,
    closed: CheckCircle2
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>No tickets found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-4">
      {tickets.map((ticket) => {
        const StatusIcon = statusIcons[ticket.status] || Clock;
        const isSelected = selectedTicket?.id === ticket.id;
        
        return (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-amber-500 bg-amber-50' : ''
              }`}
              onClick={() => onSelectTicket(ticket)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-sm text-gray-900">
                      #{ticket.ticketNumber}
                    </span>
                  </div>
                  <Badge className={`${statusColors[ticket.status]} text-xs`}>
                    {ticket.status}
                  </Badge>
                </div>
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
                  {ticket.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${priorityColors[ticket.priority]} text-xs`}>
                    {ticket.priority}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {ticket.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(ticket.created_date).toLocaleDateString()}
                  {isAdmin && ticket.customerName && ` • ${ticket.customerName}`}
                </p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}