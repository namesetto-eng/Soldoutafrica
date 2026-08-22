import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { IssuedTicket } from '../types';

/**
 * Generates an official KOROM Festival PDF E-Ticket using jsPDF and QR Code
 */
export async function generateTicketPDF(ticket: IssuedTicket): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page Dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Background & Header Colors
  // Dark slate background
  doc.setFillColor(10, 10, 12);
  doc.rect(0, 0, pageWidth, 297, 'F');

  // Decorative Header Banner Gradient/Color
  doc.setFillColor(109, 40, 217); // Royal Purple #6D28D9
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Accent Line
  doc.setFillColor(124, 58, 237); // Neon Purple #7C3AED
  doc.rect(0, 45, pageWidth, 3, 'F');

  // Main Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('KOROM FESTIVAL', 15, 22);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL ENTRY TICKET | SOLDOUTAFRICA', 15, 32);

  // Serial & Order Ref Top Right
  doc.setFontSize(9);
  doc.setFont('courier', 'bold');
  doc.text(`REF: ${ticket.orderId}`, pageWidth - 15, 22, { align: 'right' });
  doc.text(`ISSUED: ${ticket.purchaseDate}`, pageWidth - 15, 30, { align: 'right' });

  // Main Ticket Container Card Box
  doc.setFillColor(18, 18, 24);
  doc.roundedRect(15, 55, pageWidth - 30, 210, 6, 6, 'F');

  // Inner Box Border
  doc.setDrawColor(109, 40, 217);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 55, pageWidth - 30, 210, 6, 6, 'S');

  let yCursor = 70;

  // Event Header inside Card
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(ticket.eventTitle, 25, yCursor);

  yCursor += 7;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(192, 132, 252); // Light purple
  doc.text(`${ticket.eventDate} | 12:00 PM - 2:00 AM`, 25, yCursor);

  yCursor += 6;
  doc.setTextColor(156, 163, 175);
  doc.text(`Venue: ${ticket.venue}`, 25, yCursor);

  // Horizontal Divider Line
  yCursor += 10;
  doc.setDrawColor(40, 40, 50);
  doc.setLineWidth(0.3);
  doc.line(25, yCursor, pageWidth - 25, yCursor);

  // Customer Data Section
  yCursor += 12;
  doc.setFontSize(9);
  doc.setFont('courier', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text('1. ATTENDEE REGISTRATION', 25, yCursor);

  yCursor += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`Full Name: ${ticket.customerName}`, 25, yCursor);

  yCursor += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text(`Email: ${ticket.customerEmail}  |  Phone: ${ticket.customerPhone}`, 25, yCursor);

  // Ticket Tiers Summary Box
  yCursor += 12;
  doc.setFillColor(10, 10, 12);
  doc.roundedRect(25, yCursor, pageWidth - 50, 40, 4, 4, 'F');

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(124, 58, 237);
  doc.text('PASSES & TIER BREAKDOWN', 30, yCursor + 8);

  let itemY = yCursor + 16;
  ticket.items.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`• ${item.tierName} Access Pass`, 30, itemY);

    doc.setFont('courier', 'bold');
    doc.text(`QTY: ${item.quantity}  (KES ${item.price.toLocaleString()})`, pageWidth - 35, itemY, { align: 'right' });
    itemY += 7;
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(124, 58, 237);
  doc.text(`Total Amount Paid: KES ${ticket.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 30, yCursor + 34);

  // Security Verification & Dynamic QR Code Section
  yCursor += 52;
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(124, 58, 237);
  doc.text('2. GATE SECURITY & QR VERIFICATION', 25, yCursor);

  yCursor += 6;
  // Generate QR Code Data URL
  const qrString = ticket.qrCodeValue || `TICKET:${ticket.orderId}:${ticket.customerEmail}:${ticket.totalAmount}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(qrString, {
      margin: 1,
      width: 180,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Draw QR Box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(25, yCursor, 45, 45, 3, 3, 'F');
    doc.addImage(qrDataUrl, 'PNG', 27, yCursor + 2, 41, 41);

    // Instructions next to QR
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('Scan at Festival Entrance Gate', 78, yCursor + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('Present this digital PDF pass on your smartphone or printout', 78, yCursor + 20);
    doc.text('at gate control for wristband redemption.', 78, yCursor + 25);
    doc.text('Valid Government ID (18+) is required for entry.', 78, yCursor + 30);

    doc.setFont('courier', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text(`SECURITY HASH: ${ticket.orderId.replace(/[^A-Z0-9]/gi, '')}-VERIFIED`, 78, yCursor + 38);
  } catch (err) {
    console.error('Failed to render QR Code on PDF', err);
  }

  // Footer Disclaimer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('SoldOutAfrica Ticketing System • Guaranteed Authentic E-Ticket • Non-transferable without registration', pageWidth / 2, 252, { align: 'center' });

  return doc.output('blob');
}

/**
 * Download helper for the PDF
 */
export async function downloadTicketPDF(ticket: IssuedTicket) {
  const blob = await generateTicketPDF(ticket);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `KOROM_Ticket_${ticket.orderId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
