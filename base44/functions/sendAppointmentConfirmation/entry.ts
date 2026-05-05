import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL") || "info@ezpayamerica.com";
const ADMIN_EMAIL = "info@ezpayamerica.com";

async function sendEmail(to, subject, html) {
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL, name: "EzPay America" },
      subject,
      content: [{ type: "text/html", value: html }]
    })
  });
  return res;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Require admin authentication
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { appointmentId } = await req.json();

  const appt = await base44.asServiceRole.entities.Appointment.get(appointmentId);
  if (!appt) return Response.json({ error: "Appointment not found" }, { status: 404 });

  const meetingLabels = { phone_call: "Phone Call", video_call: "Video Call", in_person: "In-Person Meeting" };
  const meetingType = meetingLabels[appt.meetingType] || "Phone Call";

  // Confirmation to customer
  const customerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#f59e0b,#ea580c);padding:32px;text-align:center;border-radius:12px 12px 0 0;">
        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68fffaddc76dcc9f094717fa/8eb2dd274_EZSMALL.png" alt="EzPay America" style="width:60px;height:60px;object-fit:contain;margin-bottom:12px;" />
        <h1 style="color:white;margin:0;font-size:24px;">Appointment Confirmed!</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">EzPay America</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;">
        <p style="color:#374151;font-size:16px;">Hi <strong>${appt.firstName}</strong>,</p>
        <p style="color:#6b7280;">Your consultation is booked! Here are your appointment details:</p>
        <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:20px;margin:20px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="color:#92400e;font-weight:bold;padding:6px 0;width:40%;">📅 Date:</td><td style="color:#78350f;">${appt.date}</td></tr>
            <tr><td style="color:#92400e;font-weight:bold;padding:6px 0;">🕐 Time:</td><td style="color:#78350f;">${appt.time} (${appt.timezone || 'ET'})</td></tr>
            <tr><td style="color:#92400e;font-weight:bold;padding:6px 0;">📞 Meeting Type:</td><td style="color:#78350f;">${meetingType}</td></tr>
            <tr><td style="color:#92400e;font-weight:bold;padding:6px 0;">🏢 Business:</td><td style="color:#78350f;">${appt.businessName || 'N/A'}</td></tr>
          </table>
        </div>
        <p style="color:#6b7280;">A specialist will reach out to you at <strong>${appt.phone}</strong> at the scheduled time. If you need to reschedule or have questions, please call us:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="tel:8653169625" style="background:linear-gradient(135deg,#f59e0b,#ea580c);color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:18px;">(865) 316-9625</a>
        </div>
        <p style="color:#9ca3af;font-size:13px;text-align:center;">EzPay America · Zero-Fee Payment Processing · <a href="https://ezpayamerica.com" style="color:#f59e0b;">ezpayamerica.com</a></p>
      </div>
    </div>`;

  // Notification to admin
  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1f2937;padding:24px;border-radius:12px 12px 0 0;">
        <h2 style="color:#f59e0b;margin:0;">📅 New Appointment Booked</h2>
      </div>
      <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:none;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;width:35%;">Name</td><td style="padding:8px;">${appt.firstName} ${appt.lastName}</td></tr>
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;">Email</td><td style="padding:8px;">${appt.email}</td></tr>
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;">Phone</td><td style="padding:8px;">${appt.phone}</td></tr>
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;">Business</td><td style="padding:8px;">${appt.businessName || 'N/A'}</td></tr>
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;">Business Type</td><td style="padding:8px;">${appt.businessType || 'N/A'}</td></tr>
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;">Monthly Volume</td><td style="padding:8px;">${appt.monthlyVolume || 'N/A'}</td></tr>
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;">Date</td><td style="padding:8px;">${appt.date}</td></tr>
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;">Time</td><td style="padding:8px;">${appt.time} (${appt.timezone || 'ET'})</td></tr>
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;">Meeting Type</td><td style="padding:8px;">${meetingType}</td></tr>
          <tr><td style="font-weight:bold;padding:8px;background:#f9fafb;">Notes</td><td style="padding:8px;">${appt.notes || 'None'}</td></tr>
        </table>
      </div>
    </div>`;

  await Promise.all([
    sendEmail(appt.email, `✅ Appointment Confirmed — ${appt.date} at ${appt.time}`, customerHtml),
    sendEmail(ADMIN_EMAIL, `📅 New Booking: ${appt.firstName} ${appt.lastName} — ${appt.date} at ${appt.time}`, adminHtml)
  ]);

  await base44.asServiceRole.entities.Appointment.update(appointmentId, { confirmationSent: true });

  return Response.json({ success: true });
});