import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ticket, MessageSquare, Clock, CheckCircle2, Plus } from "lucide-react";
import CreateTicketDialog from "../components/helpdesk/CreateTicketDialog";
import SEOHead from "../components/SEOHead";

export default function CustomerPortal() {
  const [user, setUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  const { data: tickets = [], refetch } = useQuery({
    queryKey: ['myTickets', user?.email],
    queryFn: () => base44.entities.Ticket.filter({ customerEmail: user.email }),
    enabled: !!user,
    refetchInterval: 5000
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['ticketMessages', selectedTicket?.id],
    queryFn: () => base44.entities.TicketMessage.filter({ 
      ticketId: selectedTicket.id,
      isInternal: false
    }),
    enabled: !!selectedTicket,
    refetchInterval: 3000
  });

  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    open: "bg-yellow-100 text-yellow-800",
    pending: "bg-orange-100 text-orange-800",
    solved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800"
  };

  const statusIcons = {
    new: Ticket,
    open: MessageSquare,
    pending: Clock,
    solved: CheckCircle2,
    closed: CheckCircle2
  };

  const openTickets = tickets.filter(t => ['new', 'open', 'pending'].includes(t.status));
  const closedTickets = tickets.filter(t => ['solved', 'closed'].includes(t.status));

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-24 px-4">
      <SEOHead 
        title="Customer Support Portal - Track Your Tickets"
        description="View and manage your support tickets. Get help with payment processing, POS systems, and merchant services."
        keywords="customer support portal, help desk, support tickets, track ticket status, customer service"
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Support Tickets</h1>
            <p className="text-gray-600">Welcome back, {user.full_name}</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="bg-amber-600 hover:bg-amber-700">
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tickets List */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="open">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="open">Open ({openTickets.length})</TabsTrigger>
                <TabsTrigger value="closed">Closed ({closedTickets.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="open" className="space-y-3 mt-4">
                {openTickets.map((ticket) => {
                  const StatusIcon = statusIcons[ticket.status];
                  return (
                    <Card 
                      key={ticket.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedTicket?.id === ticket.id ? 'ring-2 ring-amber-500' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-500">#{ticket.ticketNumber}</span>
                          </div>
                          <Badge className={statusColors[ticket.status]}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm mt-2">{ticket.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-gray-500">
                          {new Date(ticket.created_date).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
                {openTickets.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No open tickets</p>
                )}
              </TabsContent>

              <TabsContent value="closed" className="space-y-3 mt-4">
                {closedTickets.map((ticket) => {
                  const StatusIcon = statusIcons[ticket.status];
                  return (
                    <Card 
                      key={ticket.id}
                      className={`cursor-pointer hover:shadow-md transition-shadow ${
                        selectedTicket?.id === ticket.id ? 'ring-2 ring-amber-500' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-500">#{ticket.ticketNumber}</span>
                          </div>
                          <Badge className={statusColors[ticket.status]}>
                            {ticket.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm mt-2">{ticket.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-gray-500">
                          {new Date(ticket.created_date).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
                {closedTickets.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No closed tickets</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Ticket Details */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Ticket #{selectedTicket.ticketNumber}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{selectedTicket.title}</p>
                    </div>
                    <Badge className={statusColors[selectedTicket.status]}>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Description</h3>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                        {selectedTicket.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-3">Conversation</h3>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.senderEmail === user?.email ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-md rounded-lg p-3 ${
                                msg.senderEmail === user?.email
                                  ? 'bg-amber-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-xs font-semibold mb-1">
                                {msg.senderName || msg.senderEmail}
                              </p>
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              <p className="text-xs opacity-70 mt-2">
                                {new Date(msg.created_date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {messages.length === 0 && (
                          <p className="text-center text-gray-500">No messages yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-20">
                  <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a ticket to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <CreateTicketDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onTicketCreated={() => {
          refetch();
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
}