import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Ticket, Clock } from 'lucide-react';
import { TicketTier, TicketQuantity } from '../types';

interface StickyCheckoutCartProps {
  tiers: TicketTier[];
  quantities: TicketQuantity;
  totalItems: number;
  totalAmount: number;
  onCheckout: () => void;
}

export const StickyCheckoutCart: React.FC<StickyCheckoutCartProps> = ({
  tiers,
  quantities,
  totalItems,
  totalAmount,
  onCheckout,
}) => {
  // Live Countdown JS Routine targeting October 10, 2026
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const targetDate = new Date('2026-10-10T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeRemaining('Event is Live Now');
      } else {
        const computedDays = Math.floor(distance / (1000 * 60 * 60 * 24));
        setTimeRemaining(`${computedDays} days until event`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  // Find selected items
  const selectedItems = tiers
    .filter((tier) => (quantities[tier.id] || 0) > 0)
    .map((tier) => ({
      tier,
      quantity: quantities[tier.id],
      subtotal: tier.price * quantities[tier.id],
    }));

  const handlePrimaryButtonClick = () => {
    if (totalItems > 0) {
      onCheckout();
    } else {
      // Smooth scroll to tickets section if no items selected yet
      const ticketElement = document.getElementById('tickets-section');
      if (ticketElement) {
        ticketElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        onCheckout();
      }
    }
  };

  return (
    <>
      {/* 1. Desktop Embedded Sticky Sidebar Cart */}
      <div className="hidden lg:block sticky top-24 space-y-4">
        <div className="bg-[#121218] rounded-3xl p-6 border border-purple-900/40 shadow-2xl shadow-purple-950/60 space-y-6">
          
          <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              <h3 className="font-syne text-lg font-bold text-white">Order Summary</h3>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
              Items: {totalItems}
            </span>
          </div>

          {/* Dynamic Live Countdown Box (Desktop) */}
          <div className="p-3 rounded-2xl bg-[#0A0A0C] border border-purple-900/50 flex items-center justify-between gap-2 text-xs font-mono text-purple-300">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Event Countdown:</span>
            </div>
            <span className="font-bold text-white bg-purple-950/80 px-2.5 py-1 rounded-lg border border-purple-800/40">
              {timeRemaining || 'Calculated live...'}
            </span>
          </div>

          {/* Itemized List */}
          <div className="space-y-3 min-h-[100px]">
            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Ticket className="w-8 h-8 mx-auto text-purple-900/60" />
                <p className="text-xs font-sans">No tickets selected yet.</p>
                <p className="text-[11px] text-slate-600">Use the [+] buttons above to select ticket quantities.</p>
              </div>
            ) : (
              selectedItems.map(({ tier, quantity, subtotal }) => (
                <div key={tier.id} className="flex justify-between items-center text-xs py-2 border-b border-purple-950/60">
                  <div>
                    <span className="font-bold text-slate-200">{tier.name}</span>
                    <span className="text-purple-400 ml-1">× {quantity}</span>
                  </div>
                  <span className="font-mono font-semibold text-purple-300">
                    KES {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 pt-2 border-t border-purple-900/40">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Subtotal</span>
              <span className="font-mono">KES {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Service Fee</span>
              <span className="font-mono text-emerald-400">KES 0.00 (Waived)</span>
            </div>
            
            {/* Total Display */}
            <div className="flex justify-between items-baseline pt-2 border-t border-purple-900/40">
              <span className="font-syne text-sm font-bold text-white">Total:</span>
              <span className="font-syne text-2xl font-extrabold text-purple-400">
                KES {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Prominent Checkout Button */}
          <button
            onClick={handlePrimaryButtonClick}
            className="w-full py-4 rounded-2xl bg-[#7C3AED] hover:bg-purple-500 text-white font-syne font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-xl shadow-purple-900/50 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-white" />
            <span>{totalItems > 0 ? `Checkout (KES ${totalAmount.toLocaleString('en-US')})` : 'Get Tickets'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Instant M-Pesa & Card Checkout</span>
          </div>

        </div>
      </div>

      {/* 2. Mobile Floating Sticky Bottom Transaction Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-xl border-t border-purple-900/60 p-3.5 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          
          {/* Left Element: Solid Rounded Vibrant Neon Purple Button Container (#7C3AED) */}
          <button
            onClick={handlePrimaryButtonClick}
            className="flex-1 bg-[#7C3AED] hover:bg-purple-600 active:scale-95 text-white py-3.5 px-4 rounded-2xl font-syne font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-950 transition-all cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-white shrink-0" />
            <span className="whitespace-nowrap">
              {totalItems > 0 ? `Checkout (${totalItems})` : 'Get Tickets'}
            </span>
          </button>

          {/* Right Element: Dynamic Live Countdown Status Box (Dark pill layout container with transparent border) */}
          <div className="px-3.5 py-3 rounded-2xl bg-black/70 border border-white/20 backdrop-blur-md flex items-center justify-center text-center shrink-0">
            <span className="font-mono text-xs font-bold text-purple-300 tracking-tight whitespace-nowrap">
              {timeRemaining || 'Calculating...'}
            </span>
          </div>

        </div>
      </div>
    </>
  );
};
