// ==========================================================================
// MOUNT2OCEAN - BRANDED PDF E-TICKET & VOUCHER DOWNLOAD ENGINE
// ==========================================================================

window.generateAndDownloadPdfVoucher = function(voucherData) {
  const vId = voucherData.id || ("M2O-VOUCHER-" + Math.floor(10000 + Math.random() * 90000));
  const name = voucherData.customerName || voucherData.passengerName || "Valued Guest";
  const tourOrFlight = voucherData.tourTitle || voucherData.itemTitle || voucherData.airline || "Exclusive Package";
  const amount = voucherData.amount || voucherData.price || "৳0";
  const date = voucherData.travelDate || voucherData.date || new Date().toISOString().split('T')[0];
  const phone = voucherData.phone || "+880 1977-477172";
  const status = voucherData.status || "CONFIRMED";

  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (!printWindow) {
    alert("Please allow popups to download your official PDF E-Ticket Voucher!");
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official E-Ticket Voucher - ${vId}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; margin: 0; padding: 2rem; background: #f8fafc; }
    .voucher-card { max-width: 750px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 2px solid #0072bc; padding: 2.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .voucher-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #00f2fe; padding-bottom: 1.5rem; margin-bottom: 1.5rem; }
    .brand-logo { max-height: 55px; }
    .voucher-title { font-size: 1.6rem; font-weight: 900; color: #0072bc; margin: 0; }
    .badge-status { background: #00a651; color: #ffffff; font-size: 0.85rem; font-weight: 900; padding: 0.35rem 0.85rem; border-radius: 9999px; text-transform: uppercase; }
    .voucher-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; background: #f1f5f9; padding: 1.5rem; border-radius: 12px; }
    .label { font-size: 0.78rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.25rem; display: block; }
    .value { font-size: 1.1rem; font-weight: 900; color: #0f172a; }
    .barcode-box { text-align: center; border-top: 2px dashed #cbd5e1; padding-top: 1.5rem; margin-top: 1.5rem; }
    .barcode-mock { letter-spacing: 6px; font-family: monospace; font-size: 1.6rem; font-weight: 900; color: #0f172a; background: #e2e8f0; padding: 0.5rem 1rem; display: inline-block; border-radius: 6px; }
    .print-btn { background: #0072bc; color: white; border: none; padding: 0.8rem 2rem; border-radius: 8px; font-size: 1rem; font-weight: 900; cursor: pointer; margin-top: 1.5rem; display: inline-block; }
    @media print { .print-btn { display: none; } body { padding: 0; background: #fff; } .voucher-card { border: none; box-shadow: none; } }
  </style>
</head>
<body>
  <div class="voucher-card">
    <div class="voucher-header">
      <div>
        <h1 class="voucher-title">MOUNT2OCEAN TRAVEL &amp; TOURS</h1>
        <p style="margin: 0.2rem 0 0; color: #64748b; font-weight: 700; font-size: 0.88rem;">Official E-Ticket &amp; Reservation Voucher</p>
      </div>
      <span class="badge-status">${status}</span>
    </div>

    <div class="voucher-grid">
      <div>
        <span class="label">Voucher Reference ID</span>
        <span class="value" style="color: #0072bc;">${vId}</span>
      </div>
      <div>
        <span class="label">Booking Date</span>
        <span class="value">${date}</span>
      </div>
      <div>
        <span class="label">Lead Guest / Passenger</span>
        <span class="value">${name}</span>
      </div>
      <div>
        <span class="label">Contact Phone</span>
        <span class="value">${phone}</span>
      </div>
      <div style="grid-column: span 2;">
        <span class="label">Reserved Package / Flight Service</span>
        <span class="value" style="font-size: 1.25rem; color: #0f172a;">${tourOrFlight}</span>
      </div>
      <div>
        <span class="label">Total Amount Paid / Agreed</span>
        <span class="value" style="color: #00a651; font-size: 1.4rem;">${amount}</span>
      </div>
      <div>
        <span class="label">Support Helpline</span>
        <span class="value">+880 1977-477172</span>
      </div>
    </div>

    <div style="background: #e0f2fe; border: 1.5px solid #00f2fe; padding: 1rem 1.2rem; border-radius: 10px; font-size: 0.88rem; color: #0369a1; font-weight: 700; line-height: 1.5;">
       IMPORTANT NOTICE: Please present this official PDF voucher along with your Passport/NID at check-in or airport counter. For assistance, contact Hotline: +880 1977-477172.
    </div>

    <div class="barcode-box">
      <div class="barcode-mock">||| ||||| |||| |||||| |||</div>
      <p style="margin: 0.5rem 0 0; font-size: 0.82rem; color: #64748b; font-weight: 700;">Verified Security Voucher • Barcode ID: ${vId}</p>
      <button class="print-btn" onclick="window.print()">️ Save as PDF / Print Voucher</button>
    </div>
  </div>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
