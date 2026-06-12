import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Printer } from "lucide-react";

function generateInvoiceHTML(payout, affiliate) {
  const date = payout.paidDate ? new Date(payout.paidDate) : new Date(payout.created_date);
  const invoiceNum = `INV-${payout.id.slice(-8).toUpperCase()}`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Invoice ${invoiceNum}</title>
<style>
  body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #1a1a1a; }
  .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; }
  .logo { font-size: 22px; font-weight: 900; color: #d97706; }
  .invoice-label { font-size: 32px; font-weight: 900; color: #111; }
  .invoice-num { color: #6b7280; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; margin: 24px 0; }
  th { background: #f3f4f6; padding: 10px 14px; text-align: left; font-size: 13px; color: #6b7280; }
  td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  .total-row td { font-weight: bold; font-size: 16px; background: #fef3c7; }
  .section { margin-bottom: 24px; }
  .label { font-size: 12px; color: #9ca3af; margin-bottom: 2px; }
  .value { font-size: 14px; font-weight: 600; }
  .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
  .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">EzPay America</div>
    <div style="font-size:13px;color:#6b7280;margin-top:4px;">Affiliate Commission Invoice</div>
  </div>
  <div style="text-align:right">
    <div class="invoice-label">INVOICE</div>
    <div class="invoice-num">${invoiceNum}</div>
    <div style="font-size:13px;color:#6b7280;margin-top:4px;">${date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  </div>
</div>

<div style="display:flex;gap:60px;margin-bottom:32px;">
  <div class="section">
    <div class="label">FROM</div>
    <div class="value">EzPay America</div>
    <div style="font-size:13px;color:#6b7280;">mail@ezpayamerica.com</div>
    <div style="font-size:13px;color:#6b7280;">ezpayamerica.com</div>
  </div>
  <div class="section">
    <div class="label">TO (AFFILIATE)</div>
    <div class="value">${affiliate?.firstName || ""} ${affiliate?.lastName || ""}</div>
    <div style="font-size:13px;color:#6b7280;">${affiliate?.email || payout.affiliateEmail || ""}</div>
    <div style="font-size:13px;color:#6b7280;">PayPal: ${payout.paypalEmail}</div>
    <div style="font-size:13px;color:#6b7280;">Code: ${affiliate?.referralCode || ""}</div>
  </div>
</div>

<table>
  <thead>
    <tr>
      <th>Description</th>
      <th>Type</th>
      <th>Status</th>
      <th style="text-align:right">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Affiliate Commission Payout${payout.notes ? ` — ${payout.notes}` : ""}</td>
      <td>PayPal Transfer</td>
      <td><span class="badge">${payout.status?.toUpperCase() || "COMPLETED"}</span></td>
      <td style="text-align:right;font-weight:600;color:#059669;">$${Number(payout.amount).toFixed(2)}</td>
    </tr>
    <tr class="total-row">
      <td colspan="3" style="text-align:right;font-weight:bold;">Total Paid</td>
      <td style="text-align:right;color:#059669;">$${Number(payout.amount).toFixed(2)}</td>
    </tr>
  </tbody>
</table>

${payout.paypalTransactionId ? `<div style="margin-top:8px;font-size:13px;color:#6b7280;">PayPal Transaction ID: <strong>${payout.paypalTransactionId}</strong></div>` : ""}

<div class="footer">
  Thank you for being an EzPay America affiliate partner!<br>
  Questions? Contact mail@ezpayamerica.com • (865) 316-9625
</div>
</body>
</html>`;
}

export default function AffiliateInvoices({ payouts = [], affiliate = null }) {
  const [printing, setPrinting] = useState(null);

  const printInvoice = (payout) => {
    setPrinting(payout.id);
    const html = generateInvoiceHTML(payout, affiliate);
    const win = window.open("", "_blank");
    win.document.write(html);
    win.document.close();
    win.onload = () => { win.print(); setPrinting(null); };
  };

  const downloadInvoice = (payout) => {
    const html = generateInvoiceHTML(payout, affiliate);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `EzPay-Invoice-${payout.id.slice(-8).toUpperCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedPayouts = payouts.filter(p => p.status === "completed" || p.status === "processing");

  if (completedPayouts.length === 0) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No invoices yet</p>
          <p className="text-gray-400 text-sm mt-1">Invoices are generated automatically for each completed payout.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Payout Invoices</h2>
        <p className="text-sm text-gray-500">Download or print invoices for your commission payouts</p>
      </div>

      <div className="grid gap-3">
        {completedPayouts.map(p => {
          const date = p.paidDate ? new Date(p.paidDate) : new Date(p.created_date);
          const invoiceNum = `INV-${p.id.slice(-8).toUpperCase()}`;
          return (
            <Card key={p.id} className="border shadow-sm">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{invoiceNum}</p>
                    <p className="text-xs text-gray-500">{date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                    {p.notes && <p className="text-xs text-gray-400">{p.notes}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">${Number(p.amount).toFixed(2)}</p>
                    <Badge className={`text-xs ${p.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>{p.status}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => printInvoice(p)} disabled={printing === p.id}>
                      <Printer className="w-3.5 h-3.5 mr-1" /> Print
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadInvoice(p)}>
                      <Download className="w-3.5 h-3.5 mr-1" /> Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}