import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { ticketId } = await req.json();

    if (!ticketId || typeof ticketId !== 'string' || ticketId.length > 100) {
      return Response.json({ error: 'Valid Ticket ID is required' }, { status: 400 });
    }

    const tickets = await base44.asServiceRole.entities.Ticket.filter({ id: ticketId });
    const ticket = tickets[0];

    if (!ticket) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const agents = await base44.asServiceRole.entities.TicketAssignment.filter({ isAvailable: true });

    if (agents.length === 0) {
      return Response.json({ error: 'No available agents' }, { status: 400 });
    }

    let eligibleAgents = agents.filter(agent =>
      agent.specialization.includes(ticket.category) &&
      agent.currentActiveTickets < agent.maxActiveTickets
    );

    if (eligibleAgents.length === 0) {
      eligibleAgents = agents.filter(agent => agent.currentActiveTickets < agent.maxActiveTickets);
    }

    if (eligibleAgents.length === 0) {
      return Response.json({ error: 'All agents at capacity' }, { status: 400 });
    }

    eligibleAgents.sort((a, b) => {
      const loadA = a.currentActiveTickets / a.maxActiveTickets;
      const loadB = b.currentActiveTickets / b.maxActiveTickets;
      if (Math.abs(loadA - loadB) < 0.1) return b.priority - a.priority;
      return loadA - loadB;
    });

    const selectedAgent = eligibleAgents[0];

    await base44.asServiceRole.entities.Ticket.update(ticketId, {
      assignedTo: selectedAgent.agentEmail,
      status: 'open'
    });

    await base44.asServiceRole.entities.TicketAssignment.update(selectedAgent.id, {
      currentActiveTickets: selectedAgent.currentActiveTickets + 1
    });

    return Response.json({
      success: true,
      assignedTo: selectedAgent.agentEmail,
      agentName: selectedAgent.agentName
    });

  } catch (error) {
    console.error('Auto-assign ticket error:', error);
    return Response.json({ error: 'Failed to assign ticket' }, { status: 500 });
  }
});