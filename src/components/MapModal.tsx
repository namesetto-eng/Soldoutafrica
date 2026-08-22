import React from 'react';
import { X, MapPin, Navigation, Car, Shield, Info } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#121218] border border-purple-900/50 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-purple-400" />
            <h3 className="font-syne text-lg font-bold text-white">Event Location & Venue</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-purple-950/50 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Preview Canvas Graphic */}
        <div className="relative h-56 rounded-2xl overflow-hidden border border-purple-900/40 bg-[#0A0A0C] flex flex-col items-center justify-center text-center p-6 space-y-3">
          
          {/* Grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(#6D28D9_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
          
          <div className="w-12 h-12 rounded-full bg-purple-600/30 border-2 border-purple-500 flex items-center justify-center text-white relative z-10 animate-bounce">
            <MapPin className="w-6 h-6 text-purple-400" />
          </div>

          <div className="relative z-10 space-y-1">
            <h4 className="font-syne text-xl font-extrabold text-white">{EVENT_DETAILS.locationTitle}</h4>
            <p className="text-xs text-purple-300 font-mono">{EVENT_DETAILS.locationDetails}</p>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold uppercase border border-purple-800/40 mt-1">
              Exact Coordinates Released to Ticket Holders via SMS
            </span>
          </div>

        </div>

        {/* Access & Logistics Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-purple-900/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Car className="w-4 h-4 text-purple-400" />
              <span>Rideshare & Parking</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Dedicated Bolt/Uber drop-off zones & secure on-site parking with 24/7 guarded security.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0A0C] border border-purple-900/30 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Security Gates</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Double-tier wristband verification checkpoints. Search policy enforced for all guests.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-syne font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Close Map View
        </button>

      </div>
    </div>
  );
};
