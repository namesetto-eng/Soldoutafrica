import React from 'react';
import { Calendar, MapPin, Ticket, ArrowUpRight } from 'lucide-react';
import { CROSS_SELL_EVENTS } from '../data/eventData';
import { CrossSellEvent } from '../types';

interface CrossSellCarouselProps {
  onSelectEvent: (event: CrossSellEvent) => void;
}

export const CrossSellCarousel: React.FC<CrossSellCarouselProps> = ({ onSelectEvent }) => {
  return (
    <section className="space-y-6 pt-6 border-t border-purple-900/30">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            You may also like
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Discover other trending events hosted across Kenya on SoldOutAfrica
          </p>
        </div>
      </div>

      {/* Grid Layout of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CROSS_SELL_EVENTS.map((event) => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className="group bg-[#121218] rounded-2xl overflow-hidden border border-purple-900/30 hover:border-purple-600/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/50 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Event Image Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-purple-950/40">
                <img
                  src={event.image}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono uppercase text-purple-300 font-semibold">
                  {event.category}
                </div>

                {/* Price Pill */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-purple-600 text-white font-syne text-xs font-bold shadow-md">
                  {event.price}
                </div>
              </div>

              {/* Event Information */}
              <div className="p-5 space-y-3">
                <h3 className="font-syne text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                  {event.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{event.date}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action Link */}
            <div className="px-5 pb-5 pt-2 border-t border-purple-900/20 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
              <span>View details</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
