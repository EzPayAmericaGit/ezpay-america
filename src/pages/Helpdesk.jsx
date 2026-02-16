import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Headphones } from "lucide-react";
import SEOHead from "../components/SEOHead";
import TicketList from "../components/helpdesk/TicketList";
import TicketDetails from "../components/helpdesk/TicketDetails";
import CreateTicketDialog from "../components/helpdesk/CreateTicketDialog";

export default function Helpdesk() {
  const [user, setUser] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  React.useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const isAdmin = user?.role === 'admin';

  const { data: tickets = [], isLoading, refetch } = useQuery({
    queryKey: ['tickets', user?.email, isAdmin],
    queryFn: async () => {
      if (!user) return [];
      try {
        if (isAdmin) {
          return await base44.entities.Ticket.list('-created_date', 100);
        } else {
          return await base44.entities.Ticket.filter(
            { customerEmail: user.email },
            '-created_date'
          );
        }
      } catch (err) {
        console.error('Tickets fetch error:', err);
        return [];
      }
    },
    enabled: !!user,
    retry: 2,
    staleTime: 30000
  });

  const filterByStatus = (status) => {
    return tickets.filter(t => t.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <SEOHead 
        title="Helpdesk"
        description="Submit and track support tickets"
        robots="noindex, nofollow"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Headphones className="w-10 h-10 text-amber-600" />
              Helpdesk
            </h1>
            <p className="text-gray-600">Submit and manage support tickets</p>
          </div>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Ticket
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <TicketList 
                  tickets={tickets}
                  isLoading={isLoading}
                  selectedTicket={selectedTicket}
                  onSelectTicket={setSelectedTicket}
                  isAdmin={isAdmin}
                />
              </TabsContent>
              <TabsContent value="open">
                <TicketList 
                  tickets={tickets.filter(t => ['new', 'open', 'pending'].includes(t.status))}
                  isLoading={isLoading}
                  selectedTicket={selectedTicket}
                  onSelectTicket={setSelectedTicket}
                  isAdmin={isAdmin}
                />
              </TabsContent>
              <TabsContent value="closed">
                <TicketList 
                  tickets={filterByStatus('solved').concat(filterByStatus('closed'))}
                  isLoading={isLoading}
                  selectedTicket={selectedTicket}
                  onSelectTicket={setSelectedTicket}
                  isAdmin={isAdmin}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Ticket Details */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <TicketDetails 
                ticket={selectedTicket}
                user={user}
                isAdmin={isAdmin}
                onUpdate={refetch}
                onClose={() => setSelectedTicket(null)}
              />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 h-full flex items-center justify-center p-12">
                <div className="text-center text-gray-400">
                  <Headphones className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a ticket to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateTicketDialog 
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        user={user}
        onCreated={(ticket) => {
          setCreateDialogOpen(false);
          refetch();
          setSelectedTicket(ticket);
        }}
      />
    </div>
  );
}