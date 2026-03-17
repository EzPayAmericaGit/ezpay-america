import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

const escapeHtml = (str) => String(str || '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { to, invoiceNumber, total, dueDate } = await req.json();

    if (!to || !invoiceNumber || total === undefined || !dueDate) {
      return Response.json({ error: 'Missing required fields: to, invoiceNumber, total, dueDate' }, { status: 400 });
    }

    if (!isValidEmail(to)) {
      return Response.json({ error: 'Invalid recipient email address' }, { status: 400 });
    }

    const safeInvoiceNumber = escapeHtml(String(invoiceNumber).substring(0, 50));
    const safeTotal = parseFloat(total);
    if (isNaN(safeTotal) || safeTotal < 0) {
      return Response.json({ error: 'Invalid total amount' }, { status: 400 });
    }
    const safeDueDate = escapeHtml(String(dueDate).substring(0, 30));

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: "EzPay America",
      to,
      subject: `Invoice ${safeInvoiceNumber} from EzPay America`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">New Invoice</h2>
          <p>You have received a new invoice from EzPay America.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Invoice Number:</strong> ${safeInvoiceNumber}</p>
            <p><strong>Amount:</strong> $${safeTotal.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${safeDueDate}</p>
          </div>
          <p>Please process your payment by the due date to avoid late fees.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Questions? Contact us at (865) 316-9625 or mail@ezpayamerica.com
          </p>
        </div>
      `
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Invoice email error:', error);
    return Response.json({ error: 'Failed to send invoice email' }, { status: 500 });
  }
});