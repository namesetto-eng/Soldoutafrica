import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Twitter, Link } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://soldoutafrica.com/korom';
  const displayHost = typeof window !== 'undefined' ? window.location.host : 'soldoutafrica.com/korom';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: EVENT_DETAILS.title,
          text: `Get your official ${EVENT_DETAILS.title} tickets here!`,
          url: currentUrl,
        });
      } catch (err) {
        console.log('Share error or cancelled:', err);
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Get your official ${EVENT_DETAILS.title} tickets here: ${currentUrl}`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Attending ${EVENT_DETAILS.title}! Grab your tickets:`
  )}&url=${encodeURIComponent(currentUrl)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#121218] border border-purple-900/50 rounded-3xl p-6 shadow-2xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-purple-400" />
            <h3 className="font-syne text-lg font-bold text-white">Share Event</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-purple-950/50 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Poster Image Card Preview for Link Sharing */}
        <div className="relative rounded-2xl overflow-hidden border border-purple-800/40 bg-[#0A0A0C] group">
          <img 
            src="/korom-poster.jpg" 
            alt="KOROM Festival Poster" 
            referrerPolicy="no-referrer"
            className="w-full h-44 object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3.5 flex flex-col justify-end">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#E05A2B] bg-[#E05A2B]/20 border border-[#E05A2B]/40 px-2 py-0.5 rounded w-fit mb-1">
              Official Link Share Banner
            </span>
            <h4 className="font-syne font-extrabold text-white text-sm">KOROM FESTIVAL 5.0</h4>
            <p className="text-[11px] text-slate-300 font-medium">10 OCT 2026 • Nairobi | Where Urban Meets Culture</p>
          </div>
        </div>

        {/* Customized Short Link Display */}
        <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-purple-300 font-mono font-bold truncate">
            <Link className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="truncate">{displayHost}</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700/50 shrink-0 ml-2">
            Website Link
          </span>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-2">
          <label className="block text-xs text-slate-400 font-medium">Official Website Link</label>
          <div className="flex items-center gap-2 bg-[#0A0A0C] border border-purple-900/40 rounded-xl p-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent text-xs text-slate-300 w-full focus:outline-none px-2 font-mono truncate"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-lg bg-[#7C3AED] hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Quick Social & Native Share Buttons */}
        <div className="space-y-2 pt-1">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/50 text-purple-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Share via Device Apps</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-950/60 border border-sky-800/40 hover:bg-sky-900/60 text-sky-300 text-xs font-bold transition-colors"
            >
              <Twitter className="w-4 h-4" />
              <span>X (Twitter)</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

