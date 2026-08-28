import React, { useState } from 'react';
import { Search, MapPin, Ticket, Heart, Share2, ShoppingBag, Menu, X, User, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  cartItemCount: number;
  totalAmount: number;
  onOpenCart: () => void;
  onShare: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenAuth: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminDashboard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  totalAmount,
  onOpenCart,
  onShare,
  isSaved,
  onToggleSave,
  onOpenAuth,
  isAdminLoggedIn,
  onOpenAdminDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md border-b border-purple-900/30 text-white w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform">
                <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-white transform -rotate-12" />
              </div>
              <div className="flex flex-col">
                <span className="font-syne text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                  SoldOut<span className="text-purple-500">Africa</span>
                </span>
                <span className="text-[10px] tracking-widest text-purple-400/80 font-mono uppercase -mt-1 hidden sm:block truncate max-w-[180px]">
                  {typeof window !== 'undefined' ? window.location.host : 'OFFICIAL TICKETS'}
                </span>
              </div>
            </a>

            {/* Location Selector */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 hover:border-purple-600 transition-colors cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>Nairobi, KE</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative mx-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search concerts, festivals, nightlife..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121218] border border-purple-900/40 rounded-full pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Action Tools & Top Right Corner Sign In / Admin */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Favorite Button */}
            <button
              onClick={onToggleSave}
              title={isSaved ? "Saved to Favorites" : "Save Event"}
              className={`p-2 sm:p-2.5 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-purple-900/50 border-purple-500 text-purple-300'
                  : 'bg-[#14141B] border-purple-900/30 text-slate-300 hover:text-white hover:border-purple-700/60'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-purple-400 text-purple-400' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={onShare}
              title="Share Event"
              className="p-2 sm:p-2.5 rounded-xl bg-[#14141B] border border-purple-900/30 text-slate-300 hover:text-white hover:border-purple-700/60 transition-all"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dynamic Ticket Cart Quick Pill */}
            <button
              onClick={onOpenCart}
              className={`relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl border transition-all ${
                cartItemCount > 0
                  ? 'bg-gradient-to-r from-purple-700 to-purple-600 border-purple-400 text-white shadow-lg shadow-purple-900/50 scale-[1.02]'
                  : 'bg-[#14141B] border-purple-900/40 text-slate-300 hover:border-purple-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-purple-300" />
              <span className="text-xs font-semibold hidden sm:inline">
                {cartItemCount > 0 ? `KES ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'Tickets'}
              </span>
              {cartItemCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-purple-900 font-bold text-[11px]">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* TOP RIGHT CORNER: Sign In / Account / Admin Access Button */}
            <button
              onClick={isAdminLoggedIn ? onOpenAdminDashboard : onOpenAuth}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 cursor-pointer shrink-0 ${
                isAdminLoggedIn
                  ? 'bg-purple-900 border border-purple-500 text-purple-100 hover:bg-purple-800 shadow-purple-950/60'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/50'
              }`}
              title={isAdminLoggedIn ? "Admin Dashboard" : "Sign In or Sign Up"}
            >
              {isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-300" />
                  <span className="font-syne tracking-wide">Admin Dashboard</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-purple-100" />
                  <span className="font-syne tracking-wide">Sign In</span>
                </>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#14141B] border border-purple-900/30 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Search & Sign In */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-purple-900/30 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search events in Nairobi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121218] border border-purple-900/40 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 px-1 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400" /> Nairobi, Kenya
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAdminLoggedIn) {
                    onOpenAdminDashboard();
                  } else {
                    onOpenAuth();
                  }
                }}
                className="text-white font-bold underline flex items-center gap-1.5"
              >
                {isAdminLoggedIn ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin Dashboard</span>
                  </>
                ) : (
                  <span>Sign In / Sign Up</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

