import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { ticketId } = await req.json();

    if (!ticketId) {
      return Response.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    // Get ticket
    const tickets = await base44.asServiceRole.entities.Ticket.filter({ id: ticketId });
    const ticket = tickets[0];

    if (!ticket) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Get all available agents
    const agents = await base44.asServiceRole.entities.TicketAssignment.filter({ isAvailable: true });

    if (agents.length === 0) {
      return Response.json({ error: 'No available agents' }, { status: 400 });
    }

    // Filter agents by specialization
    let eligibleAgents = agents.filter(agent => 
      agent.specialization.includes(ticket.category) &&
      agent.currentActiveTickets < agent.maxActiveTickets
    );

    // If no specialized agents available, use any available agent
    if (eligibleAgents.length === 0) {
      eligibleAgents = agents.filter(agent => 
        agent.currentActiveTickets < agent.maxActiveTickets
      );
    }

    if (eligibleAgents.length === 0) {
      return Response.json({ error: 'All agents at capacity' }, { status: 400 });
    }

    // Sort by priority and current load
    eligibleAgents.sort((a, b) => {
      const loadDiffA = a.currentActiveTickets / a.maxActiveTickets;
      const loadDiffB = b.currentActiveTickets / b.maxActiveTickets;
      
      if (Math.abs(loadDiffA - loadDiffB) < 0.1) {
        return b.priority - a.priority;
      }
      
      return loadDiffA - loadDiffB;
    });

    const selectedAgent = eligibleAgents[0];

    // Update ticket
    await base44.asServiceRole.entities.Ticket.update(ticketId, {
      assignedTo: selectedAgent.agentEmail,
      status: 'open'
    });

    // Update agent's active ticket count
    await base44.asServiceRole.entities.TicketAssignment.update(selectedAgent.id, {
      currentActiveTickets: selectedAgent.currentActiveTickets + 1
    });

    return Response.json({ 
      success: true, 
      assignedTo: selectedAgent.agentEmail,
      agentName: selectedAgent.agentName
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});