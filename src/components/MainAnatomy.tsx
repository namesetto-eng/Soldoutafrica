import React from 'react';
import { Calendar, MapPin, Ticket, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

interface MainAnatomyProps {
  onOpenCalendar: () => void;
  onOpenMap: () => void;
  onScrollToTickets: () => void;
}

export const MainAnatomy: React.FC<MainAnatomyProps> = ({
  onOpenCalendar,
  onOpenMap,
  onScrollToTickets,
}) => {

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Stacked Vertical Card Grid for Core Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* 1. Date & Time Block */}
        <div className="bg-[#121218] rounded-2xl p-6 border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs uppercase font-mono tracking-wider text-purple-400 font-semibold mb-1">
                Date & Time
              </p>
              <h3 className="font-syne text-lg font-bold text-white leading-snug">
                {EVENT_DETAILS.dateRange}
              </h3>
              <p className="text-xs font-sans text-slate-400 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400/80" />
                <span>{EVENT_DETAILS.timeRange}</span>
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-900/20">
            <button
              onClick={onOpenCalendar}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-purple-100 hover:underline transition-colors"
            >
              <span>Add to calendar</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Location Block */}
        <div className="bg-[#121218] rounded-2xl p-6 border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs uppercase font-mono tracking-wider text-purple-400 font-semibold mb-1">
                Location
              </p>
              <h3 className="font-syne text-3xl font-extrabold text-white tracking-tight">
                {EVENT_DETAILS.locationTitle}
              </h3>
              <p className="text-xs font-sans text-slate-400 mt-1">
                {EVENT_DETAILS.locationDetails}
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-900/20">
            <button
              onClick={onOpenMap}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-purple-100 hover:underline transition-colors"
            >
              <span>View on map</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Tickets Quick Summary Block */}
        <div className="bg-[#121218] rounded-2xl p-6 border border-purple-900/30 hover:border-purple-700/50 transition-all duration-300 flex flex-col justify-between group">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/50 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs uppercase font-mono tracking-wider text-purple-400 font-semibold mb-1">
                Pricing
              </p>
              <h3 className="font-syne text-2xl font-bold text-white">
                {EVENT_DETAILS.startingPriceFormatted}
              </h3>
              <p className="text-xs font-sans text-slate-400 mt-1">
                Multiple tiers available (VIBE STARS & VIP)
              </p>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-900/20">
            <button
              onClick={onScrollToTickets}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              <span>View ticket options</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
