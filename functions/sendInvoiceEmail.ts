import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { to, invoiceNumber, total, dueDate } = await req.json();

    await base44.integrations.Core.SendEmail({
      from_name: "EzPay America",
      to,
      subject: `Invoice ${invoiceNumber} from EzPay America`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">New Invoice</h2>
          <p>You have received a new invoice from EzPay America.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p><strong>Amount:</strong> $${total.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
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
    return Response.json({ error: error.message }, { status: 500 });
  }
});