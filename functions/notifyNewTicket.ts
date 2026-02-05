import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { ticketData } = await req.json();

        if (!ticketData) {
            return Response.json({ error: 'Missing ticket data' }, { status: 400 });
        }

        const emailBody = `
New Support Ticket Submitted

Ticket Number: ${ticketData.ticketNumber}
Status: ${ticketData.status}
Priority: ${ticketData.priority}
Category: ${ticketData.category}

BUSINESS INFORMATION:
━━━━━━━━━━━━━━━━━━━━
Business Name: ${ticketData.businessName || 'N/A'}
Business Phone: ${ticketData.businessPhone || 'N/A'}
Business Address: ${ticketData.businessAddress || 'N/A'}
Contact Person: ${ticketData.contactPerson || 'N/A'}

TICKET DETAILS:
━━━━━━━━━━━━━━━━━━━━
Title: ${ticketData.title}

Description:
${ticketData.description}

CUSTOMER INFORMATION:
━━━━━━━━━━━━━━━━━━━━
Name: ${ticketData.customerName || 'N/A'}
Email: ${ticketData.customerEmail || 'N/A'}

Submitted: ${new Date(ticketData.created_date || Date.now()).toLocaleString()}

━━━━━━━━━━━━━━━━━━━━
View and manage this ticket in your EzPay America admin dashboard.
        `;

        await base44.integrations.Core.SendEmail({
            to: 'mail@ezpayamerica.com',
            subject: `New Support Ticket: ${ticketData.ticketNumber} - ${ticketData.title}`,
            body: emailBody
        });

        return Response.json({ success: true });
    } catch (error) {
        console.error('Ticket notification error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});