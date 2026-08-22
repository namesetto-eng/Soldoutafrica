import React from 'react';
import { Minus, Plus, Ticket, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { TicketTier, TicketQuantity } from '../types';

interface TicketingGridProps {
  tiers: TicketTier[];
  quantities: TicketQuantity;
  onQuantityChange: (tierId: string, newQuantity: number) => void;
}

export const TicketingGrid: React.FC<TicketingGridProps> = ({
  tiers,
  quantities,
  onQuantityChange,
}) => {
  return (
    <section id="tickets-section" className="scroll-mt-24 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-900/40 pb-4">
        <div>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Tickets</span>
            <span className="text-xs font-mono font-medium text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800/40">
              Select Tier
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official E-Tickets issued instantly with M-Pesa or Card payment
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/40 px-3 py-1.5 rounded-xl border border-purple-800/30">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>100% Guaranteed Official Tickets</span>
        </div>
      </div>

      {/* Ticket Tiers List */}
      <div className="space-y-4">
        {tiers.map((tier) => {
          const currentQty = quantities[tier.id] || 0;

          return (
            <div
              key={tier.id}
              className={`relative bg-[#121218] rounded-2xl p-5 sm:p-6 border transition-all duration-300 ${
                currentQty > 0
                  ? 'border-purple-500 bg-purple-950/20 shadow-xl shadow-purple-950/40 ring-1 ring-purple-500/50'
                  : 'border-purple-900/30 hover:border-purple-700/50'
              }`}
            >
              {/* Badge Overlay if popular */}
              {tier.popular && (
                <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-md">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left Side: Tier Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-syne text-xl sm:text-2xl font-bold text-white">
                      {tier.name}
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800/50 uppercase">
                      {tier.badge || 'GENERAL'}
                    </span>
                  </div>

                  {/* Fixed Price Label */}
                  <div className="text-xl sm:text-2xl font-extrabold text-purple-400 font-syne">
                    {tier.formattedPrice}
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                    {tier.description}
                  </p>

                  {/* Feature Bullets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {tier.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-1.5 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Quantity Selector Component */}
                <div className="flex flex-col items-start md:items-end justify-between gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-purple-900/30">
                  <span className="text-[11px] font-mono uppercase text-slate-400">
                    Quantity
                  </span>

                  {/* Row containing [-] digit [+] */}
                  <div className="flex items-center gap-3 bg-[#0A0A0C] p-1.5 rounded-2xl border border-purple-900/50 shadow-inner">
                    <button
                      onClick={() => onQuantityChange(tier.id, Math.max(0, currentQty - 1))}
                      disabled={currentQty === 0}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                        currentQty === 0
                          ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                          : 'bg-purple-900/60 hover:bg-purple-700 text-white border border-purple-700/50 active:scale-95'
                      }`}
                      aria-label={`Decrease ${tier.name} quantity`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    {/* Quantitative State Indicator initialized at 0 */}
                    <span className="w-8 sm:w-10 text-center font-mono font-bold text-lg sm:text-xl text-white">
                      {currentQty}
                    </span>

                    <button
                      onClick={() => onQuantityChange(tier.id, currentQty + 1)}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#7C3AED] hover:bg-purple-600 active:scale-95 text-white flex items-center justify-center font-bold text-lg transition-all shadow-md shadow-purple-900/40"
                      aria-label={`Increase ${tier.name} quantity`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal preview for this tier if > 0 */}
                  {currentQty > 0 && (
                    <div className="text-xs font-mono text-purple-300">
                      Subtotal: KES {(tier.price * currentQty).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
