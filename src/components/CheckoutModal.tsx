import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Smartphone, CreditCard, Ticket, Download, QrCode, ArrowRight, RefreshCw, Copy, Check, AlertCircle, Sparkles } from 'lucide-react';
import { TicketTier, TicketQuantity, CustomerDetails, IssuedTicket } from '../types';
import { EVENT_DETAILS } from '../data/eventData';
import { downloadTicketPDF } from '../utils/pdfGenerator';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: TicketTier[];
  quantities: TicketQuantity;
  totalAmount: number;
  totalItems: number;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  tiers,
  quantities,
  totalAmount,
  totalItems,
  onClearCart,
}) => {
  const [step, setStep] = useState<'details' | 'processing' | 'ticket'>('details');
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeReference, setActiveReference] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);

  const [form, setForm] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '2547',
    paymentMethod: 'mpesa',
    mpesaNumber: '2547',
  });

  const [issuedTicket, setIssuedTicket] = useState<IssuedTicket | null>(null);

  const selectedItems = tiers
    .filter((t) => (quantities[t.id] || 0) > 0)
    .map((t) => ({
      tierName: t.name,
      quantity: quantities[t.id],
      price: t.price,
    }));

  // Poll order status & 60s Countdown Timer when processing PayHero payment
  useEffect(() => {
    let pollInterval: any = null;
    let timerInterval: any = null;

    if (step === 'processing' && activeReference) {
      setTimeLeft(60);

      timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/payhero/status/${activeReference}`);
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'PAID') {
              clearInterval(pollInterval);
              clearInterval(timerInterval);
              const newTicket: IssuedTicket = {
                orderId: data.reference,
                eventTitle: EVENT_DETAILS.title,
                eventDate: EVENT_DETAILS.dateRange,
                venue: EVENT_DETAILS.locationTitle + ' - ' + EVENT_DETAILS.locationDetails,
                customerName: data.fullName,
                customerEmail: data.email,
                customerPhone: data.phone,
                items: data.items || selectedItems,
                totalAmount: data.amount,
                purchaseDate: new Date(data.paidAt || Date.now()).toLocaleDateString('en-KE', { dateStyle: 'medium' }),
                qrCodeValue: `TICKET:${data.reference}:${data.email}:${data.amount}`,
              };
              setIssuedTicket(newTicket);
              setStep('ticket');
              onClearCart();
            } else if (data.status === 'FAILED') {
              clearInterval(pollInterval);
              clearInterval(timerInterval);
              setErrorMessage('Payment failed or cancelled on M-Pesa. Please try again.');
              setStep('details');
            }
          }
        } catch (err) {
          console.error('Error polling status:', err);
        }
      }, 1500);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [step, activeReference]);

  // Fail payment if 60s countdown reaches zero without PayHero receipt
  useEffect(() => {
    if (step === 'processing' && timeLeft === 0) {
      setErrorMessage('Payment window expired (60s limit). No payment callback received from PayHero. Please enter your M-PESA PIN promptly when STK push appears on your phone.');
      setStep('details');
    }
  }, [timeLeft, step]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!form.fullName || !form.email || !form.phone) {
      setErrorMessage('Please fill in all contact information fields.');
      return;
    }

    // Phone format validation (Kenyan 07xx..., 01xx..., 2547xx..., 2541xx...)
    const cleanPhone = form.phone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setErrorMessage('Please provide a valid M-Pesa phone number (e.g. 0712345678 or 254712345678).');
      return;
    }

    setStep('processing');

    try {
      const response = await fetch('/api/payhero/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          amount: totalAmount,
          items: selectedItems,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to dispatch PayHero payment prompt.');
        setStep('details');
        return;
      }

      if (data.reference) {
        setActiveReference(data.reference);
      }
    } catch (err: any) {
      console.error('STK Push submission error:', err);
      setErrorMessage('Network error connecting to PayHero Gateway. Please try again.');
      setStep('details');
    }
  };

  const handleCopyOrderId = () => {
    if (issuedTicket) {
      navigator.clipboard.writeText(issuedTicket.orderId);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
  };

  const handleDownloadPDF = async () => {
    if (issuedTicket) {
      await downloadTicketPDF(issuedTicket);
    }
  };

  const handleSimulatePayment = async () => {
    if (!activeReference) return;
    try {
      const res = await fetch('/api/payhero/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: activeReference }),
      });
      if (res.ok) {
        // Status poll loop will pick up PAID status within 1.5s
      }
    } catch (err) {
      console.error('Simulation error:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#121218] border border-purple-900/50 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-purple-900/30 bg-[#0A0A0C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-700/50 flex items-center justify-center text-purple-300">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne text-lg font-bold text-white">
                {step === 'ticket' ? 'E-Ticket Issued' : 'PayHero Checkout & Payment'}
              </h3>
              <p className="text-xs text-purple-300/80 font-mono">
                {EVENT_DETAILS.title} ({totalItems} {totalItems === 1 ? 'pass' : 'passes'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-purple-950/40 text-slate-400 hover:text-white border border-purple-800/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* STEP 1: Customer Details & Payment Options */}
          {step === 'details' && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-950/60 border border-red-500/50 flex items-center gap-3 text-red-200 text-xs">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Ticket Summary Box */}
              <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-purple-900/40 space-y-2">
                <div className="text-xs font-mono uppercase text-purple-400 font-bold flex justify-between">
                  <span>Selected Passes</span>
                  <span>KES {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {selectedItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-300">
                    <span>{item.tierName} × {item.quantity}</span>
                    <span className="font-mono">KES {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Form Input Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">
                  1. Contact & Ticket Registration
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-semibold">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kiprono Ngetich"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full bg-[#0A0A0C] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-semibold">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. kiprono@example.co.ke"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#0A0A0C] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">M-Pesa Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0712345678 or 254712345678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#0A0A0C] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Enter valid Kenyan M-Pesa line (07xx, 01xx, or 2547xx) for STK prompt.
                  </p>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 font-mono">
                  2. Payment Gateway
                </h4>

                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-600/50 text-emerald-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                    <Smartphone className="w-5 h-5 text-emerald-400" />
                    <span>PayHero M-PESA STK Push</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                    Clicking checkout will initiate an automated PayHero STK push request directly to your phone. Enter your M-Pesa PIN when prompted.
                  </p>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#7C3AED] hover:bg-purple-500 text-white font-syne font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-900/50 active:scale-95 transition-all"
              >
                <span>Checkout KES {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} via M-Pesa</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-500 font-mono">
                🔒 256-bit Encrypted PayHero Gateway Integration • SoldOutAfrica Platform
              </p>

            </form>
          )}

          {/* STEP 2: Processing Payment Verification & 60s STK Push Window */}
          {step === 'processing' && (
            <div className="py-8 text-center space-y-6">
              
              {/* Circular 60s Countdown Graphic */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full border-4 ${
                  timeLeft <= 10 ? 'border-red-500 animate-pulse' : 'border-purple-500'
                } border-t-transparent animate-spin`} />
                <div className="flex flex-col items-center justify-center">
                  <span className={`font-syne text-2xl font-black ${
                    timeLeft <= 10 ? 'text-red-400' : 'text-purple-300'
                  }`}>
                    {timeLeft}s
                  </span>
                  <span className="text-[9px] uppercase font-mono text-slate-400">Timer</span>
                </div>
              </div>

              <div className="space-y-2 max-w-md mx-auto px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold mb-1">
                  <Smartphone className="w-4 h-4 text-emerald-400 animate-bounce" />
                  <span>M-PESA STK Push Sent!</span>
                </div>

                <h4 className="font-syne text-xl font-bold text-white">
                  Check Your Safaricom Mobile Screen
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  An M-PESA STK prompt has been dispatched to <strong className="text-emerald-400 font-mono text-sm">{form.phone}</strong>. Please enter your 4-digit M-PESA PIN to complete payment of <strong className="text-white">KES {totalAmount.toLocaleString()}</strong>.
                </p>

                {activeReference && (
                  <p className="text-[11px] font-mono text-purple-400 pt-1">
                    Order Ref: {activeReference}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#0A0A0C] border border-purple-900/40 text-xs text-slate-400 max-w-md mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2 text-purple-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>PayHero Live Verification Active</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Waiting for verified PayHero M-Pesa receipt callback. Once you confirm your PIN, your ticket will generate automatically.
                </p>

                {/* Simulated PIN Bypass for Sandbox Testing */}
                <div className="pt-2 border-t border-purple-900/30">
                  <button
                    type="button"
                    onClick={handleSimulatePayment}
                    className="w-full py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/50 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Testing? Simulate Instant M-Pesa PIN Success</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Issued E-Ticket with Automated PDF Generator */}
          {step === 'ticket' && issuedTicket && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">M-Pesa Payment Verified!</p>
                  <p className="text-[11px] text-emerald-200/80">
                    Official PDF ticket generated and dispatched to {issuedTicket.customerEmail}.
                  </p>
                </div>
              </div>

              {/* Printable E-Ticket Preview Card */}
              <div className="bg-[#0A0A0C] border border-purple-800/60 rounded-3xl p-6 relative overflow-hidden space-y-6 shadow-2xl">
                
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-900/40 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">KOROM FESTIVAL OFFICIAL TICKET</span>
                    <h3 className="font-syne text-2xl font-extrabold text-white">{issuedTicket.eventTitle}</h3>
                    <p className="text-xs text-slate-400">{issuedTicket.eventDate}</p>
                  </div>

                  <div className="flex items-center gap-2 bg-purple-950/80 px-3 py-1.5 rounded-xl border border-purple-700/50">
                    <span className="text-xs font-mono font-bold text-purple-200">{issuedTicket.orderId}</span>
                    <button
                      onClick={handleCopyOrderId}
                      className="text-purple-400 hover:text-white"
                      title="Copy Reference"
                    >
                      {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500">Attendee Name</span>
                    <p className="font-bold text-slate-100 text-sm">{issuedTicket.customerName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500">Venue</span>
                    <p className="font-bold text-slate-100 text-sm">{issuedTicket.venue}</p>
                  </div>
                </div>

                {/* Ticket Items List */}
                <div className="bg-[#121218] p-4 rounded-2xl border border-purple-900/30 space-y-2">
                  <span className="text-[10px] uppercase font-mono text-purple-400 font-bold">Pass Summary</span>
                  {issuedTicket.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-200">
                      <span>{it.tierName} Access Pass</span>
                      <span className="font-bold font-mono">Qty: {it.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-purple-900/40 flex justify-between text-xs font-bold text-white">
                    <span>Total Amount Paid:</span>
                    <span className="text-emerald-400 font-mono">KES {issuedTicket.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-950/20 border border-purple-800/30">
                  <div className="w-20 h-20 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                      <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,0 h20 v10 h-20 z M40,20 h10 v20 h-10 z M60,40 h20 v10 h-20 z M40,60 h10 v30 h-10 z M60,70 h30 v10 h-30 z M80,90 h20 v10 h-20 z M0,40 h20 v10 h-20 z M20,60 h10 v10 h-10 z" />
                    </svg>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-200 flex items-center gap-1">
                      <QrCode className="w-4 h-4 text-purple-400" />
                      <span>Security QR Verification Hash</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Scan at gate for wristband redemption. PDF document contains full high-resolution QR pass.
                    </p>
                  </div>
                </div>

              </div>

              {/* Actions: Download PDF / Done */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-syne font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Ticket</span>
                </button>

                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl bg-[#0A0A0C] border border-purple-700/60 hover:bg-purple-950/50 text-slate-300 hover:text-white font-syne font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Close Window</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
