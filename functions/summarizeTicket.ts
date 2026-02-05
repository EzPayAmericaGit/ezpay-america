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

    const tickets = await base44.asServiceRole.entities.Ticket.filter({ id: ticketId });
    const ticket = tickets[0];

    if (!ticket) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const messages = await base44.asServiceRole.entities.TicketMessage.filter({ 
      ticketId: ticket.id 
    });

    const conversationText = messages
      .map(m => `${m.senderName}: ${m.message}`)
      .join('\n\n');

    const prompt = `Analyze this support ticket and provide a concise summary:

Ticket: ${ticket.title}
Category: ${ticket.category}
Priority: ${ticket.priority}
Status: ${ticket.status}

Initial Description:
${ticket.description}

Conversation:
${conversationText}

Provide a summary with:
1. Issue Overview (1-2 sentences)
2. Key Points (bullet points)
3. Current Status
4. Recommended Next Actions`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          overview: { type: "string" },
          key_points: { type: "array", items: { type: "string" } },
          status_summary: { type: "string" },
          next_actions: { type: "array", items: { type: "string" } }
        }
      }
    });

    return Response.json({ 
      success: true, 
      summary: response
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});