import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Require admin authentication
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { ticketId, templateId } = await req.json();

    if (!ticketId) {
      return Response.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    // Get ticket
    const tickets = await base44.asServiceRole.entities.Ticket.filter({ id: ticketId });
    const ticket = tickets[0];

    if (!ticket) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    let template;
    
    if (templateId) {
      const templates = await base44.asServiceRole.entities.TicketTemplate.filter({ id: templateId });
      template = templates[0];
    } else {
      const templates = await base44.asServiceRole.entities.TicketTemplate.filter({ 
        category: ticket.category,
        isActive: true
      });
      template = templates[0];
    }

    if (!template) {
      return Response.json({ error: 'No template found' }, { status: 404 });
    }

    // Create auto-response message
    await base44.asServiceRole.entities.TicketMessage.create({
      ticketId: ticket.id,
      message: template.message,
      senderEmail: 'support@ezpayamerica.com',
      senderName: 'EzPay Support Team',
      isInternal: false
    });

    // Update template usage count
    await base44.asServiceRole.entities.TicketTemplate.update(template.id, {
      usageCount: (template.usageCount || 0) + 1
    });

    // Send email to customer
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: ticket.customerEmail,
      subject: `Re: Ticket #${ticket.ticketNumber} - ${ticket.title}`,
      body: `
        <h2>Thank you for contacting EzPay America Support</h2>
        <p>Ticket #${ticket.ticketNumber}</p>
        <hr />
        <p>${template.message.replace(/\n/g, '<br>')}</p>
        <hr />
        <p><small>This is an automated response. A support agent will follow up with you shortly.</small></p>
      `
    });

    return Response.json({ 
      success: true, 
      message: 'Auto-response sent',
      templateUsed: template.name
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});