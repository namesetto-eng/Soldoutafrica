import React from 'react';
import { Ticket, ShieldCheck, Heart, MapPin, Smartphone, CreditCard } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

interface FooterProps {
  onHoneypotDoubleClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onHoneypotDoubleClick }) => {
  return (
    <footer className="relative bg-[#0A0A0C] border-t border-purple-900/40 text-slate-400 text-xs py-12 w-full max-w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                <Ticket className="w-4 h-4 transform -rotate-12" />
              </div>
              <span className="font-syne text-lg font-extrabold text-white">
                SoldOut<span className="text-purple-500">Africa</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              East Africa's leading festival & live experience ticketing platform. Designed for seamless M-Pesa & Card transactions.
            </p>
          </div>

          {/* Event Organizer Info */}
          <div className="space-y-2">
            <h4 className="font-syne font-bold text-white text-xs uppercase tracking-wider">Organized By</h4>
            <p className="text-xs text-purple-300 font-semibold">{EVENT_DETAILS.organizer}</p>
            <p className="text-[11px] text-slate-500">
              Verified Partner #{EVENT_DETAILS.organizerEventsCount} Events Hosted
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-syne font-bold text-white text-xs uppercase tracking-wider">Customer Support</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><a href="#" className="hover:text-purple-300 transition-colors">Ticket Verification</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">M-PESA Help Guide</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Organizer Portal</a></li>
              <li><a href="#" className="hover:text-purple-300 transition-colors">Terms of Service & Refund Policy</a></li>
            </ul>
          </div>

          {/* Payments Accepted */}
          <div className="space-y-2">
            <h4 className="font-syne font-bold text-white text-xs uppercase tracking-wider">Accepted Payment Methods</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-[#121218] border border-purple-900/40 text-emerald-400 font-mono font-bold">
                M-PESA
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#121218] border border-purple-900/40 text-purple-300 font-mono font-bold">
                VISA / Mastercard
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#121218] border border-purple-900/40 text-red-400 font-mono font-bold">
                Airtel Money
              </span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-purple-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} SoldOutAfrica & KOROM Festival. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Secure 256-Bit Encrypted Ticketing Engine</span>
          </div>
        </div>

      </div>

      {/* Inconspicuous 1px invisible honeypot trigger box in far lower corner */}
      <div
        onDoubleClick={onHoneypotDoubleClick}
        className="absolute bottom-0 right-0 w-1 h-1 opacity-0 z-50 pointer-events-auto cursor-default"
        title=""
        aria-hidden="true"
      />
    </footer>
  );
};
