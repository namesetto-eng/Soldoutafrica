import React from 'react';
import { X, Calendar, MapPin, Ticket, ExternalLink, ArrowRight } from 'lucide-react';
import { CrossSellEvent } from '../types';

interface CrossSellModalProps {
  event: CrossSellEvent | null;
  onClose: () => void;
  onSelectTicket: (event: CrossSellEvent) => void;
}

export const CrossSellModal: React.FC<CrossSellModalProps> = ({ event, onClose, onSelectTicket }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#121218] border border-purple-900/50 rounded-3xl overflow-hidden shadow-2xl space-y-0">
        
        {/* Banner image */}
        <div className="relative h-52 w-full">
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="absolute bottom-4 left-6 px-3 py-1 rounded-lg bg-purple-600 text-white font-syne text-xs font-bold shadow-lg">
            {event.price}
          </span>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <span className="text-[10px] font-mono uppercase text-purple-400 font-bold tracking-wider">
            {event.category}
          </span>

          <h3 className="font-syne text-xl font-bold text-white leading-snug">
            {event.title}
          </h3>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span>{event.venue}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Hosted on SoldOutAfrica platform. Guaranteed authentic e-tickets, M-Pesa automated entry verification, and mobile pass redemption at venue gates.
          </p>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => onSelectTicket(event)}
              className="w-full py-3.5 rounded-2xl bg-[#7C3AED] hover:bg-purple-500 text-white font-syne font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <span>Get Tickets for {event.price}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
