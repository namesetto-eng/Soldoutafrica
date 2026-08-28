import React from 'react';
import { X, Calendar, Clock, MapPin, Minus, Plus } from 'lucide-react';
import { TicketTier, TicketQuantity } from '../types';

interface SelectTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiers: TicketTier[];
  quantities: TicketQuantity;
  onQuantityChange: (tierId: string, newQuantity: number) => void;
  totalItems: number;
  totalAmount: number;
  onContinue: () => void;
}

export const SelectTicketsModal: React.FC<SelectTicketsModalProps> = ({
  isOpen,
  onClose,
  tiers,
  quantities,
  onQuantityChange,
  totalItems,
  totalAmount,
  onContinue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity">
      <div 
        className="relative w-full max-w-lg bg-[#0A0A0C] border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-5 pb-32">
          
          {/* Header Card with KOROM Artwork */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-[#121217] min-h-[140px] flex flex-col justify-end p-4">
            {/* Background Graphic Artwork */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{ backgroundImage: `url('/korom-poster.jpg')` }}
            />
            {/* Dark Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/70 to-transparent" />

            {/* Close Button Top-Right */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all cursor-pointer z-10"
              aria-label="Close ticket selector"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Event Details */}
            <div className="relative z-10 space-y-1.5 pt-6">
              <h2 className="font-syne font-black text-xl sm:text-2xl text-white tracking-tight">
                KOROM Festival
              </h2>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-300 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Sat, Oct 10, 2026</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>3:00 PM - 5:00 AM</span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>TBA</span>
              </div>
            </div>
          </div>

          {/* Section Heading: SELECT TICKETS */}
          <div className="pt-1">
            <h3 className="font-syne text-lg sm:text-xl font-black tracking-widest text-white uppercase">
              SELECT TICKETS
            </h3>
          </div>

          {/* Ticket Options Cards */}
          <div className="space-y-3.5">
            {tiers.map((tier) => {
              const qty = quantities[tier.id] || 0;
              return (
                <div
                  key={tier.id}
                  className="bg-[#121217] border border-zinc-800/90 rounded-2xl p-4 sm:p-5 space-y-3 hover:border-zinc-700 transition-all"
                >
                  {/* Tier Title */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-syne text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                      {tier.name}
                    </h4>
                  </div>

                  {/* Price */}
                  <div className="font-syne text-base sm:text-lg font-extrabold text-white">
                    {tier.price >= 1000 ? `KES ${tier.price.toFixed(2)}` : tier.formattedPrice}
                    {tier.subtext && (
                      <span className="text-zinc-400 text-xs font-normal ml-1.5 font-sans">
                        {tier.subtext}
                      </span>
                    )}
                  </div>

                  {/* Info number/status row */}
                  <div className="text-xs text-zinc-500 font-mono">
                    0
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onQuantityChange(tier.id, Math.max(0, qty - 1))}
                        disabled={qty === 0}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                          qty === 0
                            ? 'border-zinc-800 bg-zinc-900/50 text-zinc-600 cursor-not-allowed'
                            : 'border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 active:scale-95'
                        }`}
                        aria-label={`Decrease ${tier.name}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-6 text-center font-syne font-bold text-base text-white">
                        {qty}
                      </span>

                      <button
                        onClick={() => onQuantityChange(tier.id, qty + 1)}
                        className="w-9 h-9 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all active:scale-95"
                        aria-label={`Increase ${tier.name}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Sticky Bottom Action Drawer / Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-[#0A0A0C]/95 backdrop-blur-md border-t border-zinc-800/90 p-4 sm:p-5 space-y-3 shadow-2xl">
          
          {/* Summary Row */}
          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              <div className="text-xs text-zinc-400 font-sans">
                Tickets
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-syne text-xs font-black tracking-wider uppercase text-white">
                  TOTAL
                </span>
                <span className="font-syne text-base sm:text-lg font-black text-white">
                  KES {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="text-sm font-syne font-bold text-zinc-400">
              {totalItems}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl border border-zinc-800 bg-[#121217] hover:bg-zinc-800 text-zinc-200 font-syne font-bold text-sm transition-all text-center cursor-pointer active:scale-95"
            >
              Cancel
            </button>

            <button
              onClick={onContinue}
              disabled={totalItems === 0}
              className={`py-3 px-4 rounded-xl font-syne font-black text-sm tracking-wider uppercase transition-all text-center cursor-pointer active:scale-95 ${
                totalItems > 0
                  ? 'bg-white text-black hover:bg-zinc-100 shadow-lg shadow-white/10'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              CONTINUE
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
