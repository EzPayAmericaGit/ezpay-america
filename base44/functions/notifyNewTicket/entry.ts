import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const escapeHtml = (str) => String(str || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const VALID_PRIORITIES = new Set(['low', 'normal', 'high', 'urgent']);
const VALID_CATEGORIES = new Set(['technical', 'billing', 'general', 'feature_request', 'bug_report']);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticketData } = await req.json();

    if (!ticketData) {
      return Response.json({ error: 'Missing ticket data' }, { status: 400 });
    }

    // Validate ticket ownership
    if (user.role !== 'admin' && ticketData.customerEmail !== user.email) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Sanitize all fields before embedding in email
    const safeTicketNum = escapeHtml(String(ticketData.ticketNumber || 'N/A').substring(0, 30));
    const safeStatus = escapeHtml(String(ticketData.status || 'new').substring(0, 20));
    const safePriority = VALID_PRIORITIES.has(ticketData.priority) ? ticketData.priority : 'normal';
    const safeCategory = VALID_CATEGORIES.has(ticketData.category) ? ticketData.category : 'general';
    const safeBusinessName = escapeHtml(String(ticketData.businessName || 'N/A').substring(0, 200));
    const safeBusinessPhone = escapeHtml(String(ticketData.businessPhone || 'N/A').substring(0, 30));
    const safeBusinessAddress = escapeHtml(String(ticketData.businessAddress || 'N/A').substring(0, 300));
    const safeContactPerson = escapeHtml(String(ticketData.contactPerson || 'N/A').substring(0, 100));
    const safeTitle = escapeHtml(String(ticketData.title || 'N/A').substring(0, 200));
    const safeDescription = escapeHtml(String(ticketData.description || '').substring(0, 2000));
    const safeCustomerName = escapeHtml(String(ticketData.customerName || 'N/A').substring(0, 100));
    const safeCustomerEmail = escapeHtml(String(ticketData.customerEmail || 'N/A').substring(0, 254));

    const emailBody = `
New Support Ticket Submitted

Ticket Number: ${safeTicketNum}
Status: ${safeStatus}
Priority: ${safePriority}
Category: ${safeCategory}

BUSINESS INFORMATION:
━━━━━━━━━━━━━━━━━━━━
Business Name: ${safeBusinessName}
Business Phone: ${safeBusinessPhone}
Business Address: ${safeBusinessAddress}
Contact Person: ${safeContactPerson}

TICKET DETAILS:
━━━━━━━━━━━━━━━━━━━━
Title: ${safeTitle}

Description:
${safeDescription}

CUSTOMER INFORMATION:
━━━━━━━━━━━━━━━━━━━━
Name: ${safeCustomerName}
Email: ${safeCustomerEmail}

Submitted: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━
View and manage this ticket in your EzPay America admin dashboard.
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'mail@ezpayamerica.com',
      subject: `New Support Ticket: ${safeTicketNum} - ${safeTitle}`,
      body: emailBody
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Ticket notification error:', error);
    return Response.json({ error: 'Failed to send notification' }, { status: 500 });
  }
});