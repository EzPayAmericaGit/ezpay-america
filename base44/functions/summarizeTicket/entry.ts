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

    const messages = await base44.asServiceRole.entities.TicketMessage.filter({
      ticketId: ticket.id
    });

    // Sanitize ticket content before sending to LLM to prevent prompt injection
    const safeTitle = String(ticket.title || '').substring(0, 200);
    const safeCategory = String(ticket.category || '').substring(0, 50);
    const safePriority = String(ticket.priority || '').substring(0, 20);
    const safeStatus = String(ticket.status || '').substring(0, 20);
    const safeDescription = String(ticket.description || '').substring(0, 2000);

    const conversationText = messages
      .slice(0, 50) // Limit to 50 messages to prevent token abuse
      .map(m => `${String(m.senderName || 'Unknown').substring(0, 50)}: ${String(m.message || '').substring(0, 1000)}`)
      .join('\n\n');

    const prompt = `Analyze this support ticket and provide a concise summary:

Ticket: ${safeTitle}
Category: ${safeCategory}
Priority: ${safePriority}
Status: ${safeStatus}

Initial Description:
${safeDescription}

Conversation:
${conversationText}

Provide a summary with:
1. Issue Overview (1-2 sentences)
2. Key Points (bullet points)
3. Current Status
4. Recommended Next Actions`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
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

    return Response.json({ success: true, summary: response });

  } catch (error) {
    console.error('Summarize ticket error:', error);
    return Response.json({ error: 'Failed to summarize ticket' }, { status: 500 });
  }
});