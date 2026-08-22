import React, { useState, useEffect } from 'react';
import { Heart, Share2, Ticket, Sparkles, ExternalLink, ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react';

interface HeroBannerProps {
  onShare: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onViewTicketsClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShare,
  isSaved,
  onToggleSave,
  onViewTicketsClick,
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
    const interval = setInterval(updateCountdown, 1000 * 60);

    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0C]">
      
      {/* Container holding the Hero Poster Banner */}
      <div className="relative min-h-[520px] sm:min-h-[600px] lg:min-h-[660px] w-full max-w-7xl mx-auto rounded-3xl overflow-hidden border border-purple-900/40 shadow-2xl shadow-purple-950/60 flex flex-col justify-between p-4 sm:p-8 lg:p-10 select-none">
        
        {/* 1. GEOMETRIC CHEVRON BACKDROP PATTERN (SVG) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 1000 800"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Retro Texture Filter Overlay */}
              <filter id="retro-noise" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
                <feColorMatrix type="saturate" values="0.15" result="desat" />
                <feBlend in="SourceGraphic" in2="desat" mode="multiply" />
              </filter>
            </defs>

            {/* Alternating Chevron / Zig-Zag Bands Layer */}
            <g filter="url(#retro-noise)">
              {/* Chevron Stripe 0: Orange */}
              <path
                d="M -50 -50 L 100 -10 L 250 -50 L 400 -10 L 550 -50 L 700 -10 L 850 -50 L 1050 -10 L 1050 60 L 850 20 L 700 60 L 550 20 L 400 60 L 250 20 L 100 60 L -50 20 Z"
                fill="#E05A2B"
              />
              {/* Chevron Stripe 1: Teal */}
              <path
                d="M -50 20 L 100 60 L 250 20 L 400 60 L 550 20 L 700 60 L 850 20 L 1050 60 L 1050 130 L 850 90 L 700 130 L 550 90 L 400 130 L 250 90 L 100 130 L -50 90 Z"
                fill="#2A7B88"
              />
              {/* Chevron Stripe 2: Cream */}
              <path
                d="M -50 90 L 100 130 L 250 90 L 400 130 L 550 90 L 700 130 L 850 90 L 1050 130 L 1050 200 L 850 160 L 700 200 L 550 160 L 400 200 L 250 160 L 100 200 L -50 160 Z"
                fill="#E6D7BD"
              />
              {/* Chevron Stripe 3: Dark Charcoal */}
              <path
                d="M -50 160 L 100 200 L 250 160 L 400 200 L 550 160 L 700 200 L 850 160 L 1050 200 L 1050 270 L 850 230 L 700 270 L 550 230 L 400 270 L 250 230 L 100 270 L -50 230 Z"
                fill="#1C2329"
              />
              {/* Chevron Stripe 4: Rust Orange */}
              <path
                d="M -50 230 L 100 270 L 250 230 L 400 270 L 550 230 L 700 270 L 850 230 L 1050 270 L 1050 340 L 850 300 L 700 340 L 550 300 L 400 340 L 250 300 L 100 340 L -50 300 Z"
                fill="#E05A2B"
              />
              {/* Chevron Stripe 5: Pastel Teal */}
              <path
                d="M -50 300 L 100 340 L 250 300 L 400 340 L 550 300 L 700 340 L 850 300 L 1050 340 L 1050 410 L 850 370 L 700 410 L 550 370 L 400 410 L 250 370 L 100 410 L -50 370 Z"
                fill="#2A7B88"
              />
              {/* Chevron Stripe 6: Cream */}
              <path
                d="M -50 370 L 100 410 L 250 370 L 400 410 L 550 370 L 700 410 L 850 370 L 1050 410 L 1050 480 L 850 440 L 700 480 L 550 440 L 400 480 L 250 440 L 100 480 L -50 440 Z"
                fill="#E6D7BD"
              />
              {/* Chevron Stripe 7: Dark Charcoal */}
              <path
                d="M -50 440 L 100 480 L 250 440 L 400 480 L 550 440 L 700 480 L 850 440 L 1050 480 L 1050 550 L 850 510 L 700 550 L 550 510 L 400 550 L 250 510 L 100 550 L -50 510 Z"
                fill="#1C2329"
              />
              {/* Chevron Stripe 8: Rust Orange */}
              <path
                d="M -50 510 L 100 550 L 250 510 L 400 550 L 550 510 L 700 550 L 850 510 L 1050 550 L 1050 620 L 850 580 L 700 620 L 550 580 L 400 620 L 250 580 L 100 620 L -50 580 Z"
                fill="#E05A2B"
              />
              {/* Chevron Stripe 9: Pastel Teal */}
              <path
                d="M -50 580 L 100 620 L 250 580 L 400 620 L 550 580 L 700 620 L 850 580 L 1050 620 L 1050 690 L 850 650 L 700 690 L 550 650 L 400 690 L 250 650 L 100 690 L -50 650 Z"
                fill="#2A7B88"
              />
              {/* Chevron Stripe 10: Cream */}
              <path
                d="M -50 650 L 100 690 L 250 650 L 400 690 L 550 650 L 700 690 L 850 650 L 1050 690 L 1050 760 L 850 720 L 700 760 L 550 720 L 400 760 L 250 720 L 100 760 L -50 720 Z"
                fill="#E6D7BD"
              />
              {/* Chevron Stripe 11: Dark Charcoal */}
              <path
                d="M -50 720 L 100 760 L 250 720 L 400 760 L 550 720 L 700 760 L 850 720 L 1050 760 L 1050 850 L 850 810 L 700 850 L 550 810 L 400 850 L 250 810 L 100 850 L -50 810 Z"
                fill="#1C2329"
              />
            </g>
          </svg>

          {/* Canvas Grunge Grain & Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)] pointer-events-none" />
        </div>

        {/* Mobile Floating Sticky Header Bar */}
        <div className="relative z-20 flex sm:hidden items-center justify-between gap-2 mb-2">
          {/* Circular Back Arrow Button */}
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all shadow-lg active:scale-95"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Centered Circular "SoldOutAfrica" Black Logo Badge */}
          <div className="w-10 h-10 rounded-full bg-black border border-purple-500/60 flex items-center justify-center shadow-lg p-1">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-500 flex items-center justify-center text-white text-[9px] font-black font-syne tracking-tighter shadow-inner">
              SOA
            </div>
          </div>

          {/* Circular Native Share Icon */}
          <button
            onClick={onShare}
            className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all shadow-lg active:scale-95"
            title="Share Event"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Top Control Overlay for Desktop (Share / Save buttons) */}
        <div className="relative z-20 hidden sm:flex justify-end gap-2.5">
          <button
            onClick={onToggleSave}
            className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
              isSaved
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg'
                : 'bg-black/60 text-slate-200 border-white/20 hover:bg-black/80 hover:text-white'
            }`}
            title="Save Event"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
          <button
            onClick={onShare}
            className="p-2.5 rounded-full bg-black/60 backdrop-blur-md text-slate-200 border border-white/20 hover:bg-black/80 hover:text-white transition-all"
            title="Share Event"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* 2. TOP & CENTER: TYPOGRAPHY & HERO BRANDING STYLING */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center mt-2 sm:mt-4 mb-6 sm:mb-8">
          
          {/* LOGO CONTAINER: "KOROM" Custom Geometric Block Display with Teal & Coral Dots */}
          <div className="relative inline-block drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]">
            
            {/* High-Impact Custom Vector / Canvas Typography representation for KOROM */}
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <svg
                viewBox="0 0 620 160"
                className="w-[280px] sm:w-[460px] md:w-[560px] lg:w-[620px] h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Heavy Dark Shadow Frame / Outline Path for 3D Block Effect */}
                <g filter="drop-shadow(0px 10px 0px #0F172A)">
                  
                  {/* Letter K */}
                  <path
                    d="M 10 15 H 55 V 65 L 90 15 H 135 L 85 75 L 140 145 H 90 L 55 90 V 145 H 10 Z"
                    fill="#FAF5E8"
                    stroke="#151B20"
                    strokeWidth="12"
                    strokeLinejoin="round"
                  />

                  {/* Letter O (1) with Solid Neon Teal Circle Dot */}
                  <path
                    d="M 145 15 H 255 C 275 15, 285 25, 285 45 V 115 C 285 135, 275 145, 255 145 H 145 C 125 145, 115 135, 115 115 V 45 C 115 25, 125 15, 145 15 Z"
                    fill="#FAF5E8"
                    stroke="#151B20"
                    strokeWidth="12"
                    strokeLinejoin="round"
                  />
                  {/* Inner Counter Hole for O (1) */}
                  <rect x="155" y="45" width="90" height="70" rx="15" fill="#151B20" />
                  {/* Solid Neon Teal Circular Dot */}
                  <circle cx="200" cy="80" r="22" fill="#2DD4BF" stroke="#151B20" strokeWidth="4" />

                  {/* Letter R */}
                  <path
                    d="M 295 15 H 375 C 395 15, 405 25, 405 45 V 70 C 405 85, 395 95, 375 95 H 340 V 145 H 295 Z M 340 50 V 65 H 360 V 50 Z"
                    fill="#FAF5E8"
                    stroke="#151B20"
                    strokeWidth="12"
                    strokeLinejoin="round"
                  />
                  {/* Leg for R */}
                  <path
                    d="M 350 85 L 400 145 H 355 L 320 95 Z"
                    fill="#FAF5E8"
                    stroke="#151B20"
                    strokeWidth="8"
                  />

                  {/* Letter O (2) with Solid Coral Dot */}
                  <path
                    d="M 415 15 H 525 C 545 15, 555 25, 555 45 V 115 C 555 135, 545 145, 525 145 H 415 C 395 145, 385 135, 385 115 V 45 C 385 25, 395 15, 415 15 Z"
                    fill="#FAF5E8"
                    stroke="#151B20"
                    strokeWidth="12"
                    strokeLinejoin="round"
                  />
                  {/* Inner Counter Hole for O (2) */}
                  <rect x="425" y="45" width="90" height="70" rx="15" fill="#151B20" />
                  {/* Solid Soft Coral Circular Dot */}
                  <circle cx="470" cy="80" r="22" fill="#E05A2B" stroke="#151B20" strokeWidth="4" />

                  {/* Letter M */}
                  <path
                    d="M 535 15 H 575 L 595 70 L 615 15 H 655 V 145 H 615 V 75 L 595 125 L 575 75 V 145 H 535 Z"
                    fill="#FAF5E8"
                    stroke="#151B20"
                    strokeWidth="12"
                    strokeLinejoin="round"
                  />

                </g>
              </svg>
            </div>

          </div>

          {/* SUB-BRANDING TEXT LAYOUT: "FESTIVAL" in stylized distressed block font */}
          <div className="mt-2 sm:mt-3">
            <div className="inline-block bg-[#E05A2B] text-[#FAF5E8] border-4 border-[#151B20] px-6 sm:px-10 py-1 sm:py-2 rounded-2xl shadow-[0_8px_0_#151B20] transform -rotate-1">
              <span className="font-syne text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.25em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                FESTIVAL
              </span>
            </div>
          </div>

        </div>

        {/* 3. INFORMATIONAL BADGES & TAGLINE COMPONENT LAYERING */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-4">
          
          {/* LEFT COLUMN: FLOATING METADATA BADGES STACK */}
          <div className="space-y-3.5 sm:space-y-4">
            
            {/* Badge 1: 5.0 LOADING... Status Chip */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#D9383A] text-white border-2 border-[#151B20] font-mono text-xs font-bold tracking-wider shadow-[0_4px_0_#151B20] animate-pulse">
                <span>5.0 LOADING...</span>
              </div>
            </div>

            {/* Badge 2: Date Badge "10 OCT 2026" */}
            <div>
              <div className="inline-block bg-[#151B20] text-white border-2 border-[#FAF5E8] px-5 py-2 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.6)]">
                <span className="font-syne text-lg sm:text-2xl font-extrabold tracking-wide">
                  10 OCT 2026
                </span>
              </div>
            </div>

            {/* Badge 3: Integrated Pricing Matrix Box with Solid Teal Translucent Canvas */}
            <div className="max-w-xs bg-[#2A7B88]/95 backdrop-blur-md border-2 border-[#151B20] rounded-2xl p-3.5 sm:p-4 shadow-[0_8px_0_#151B20] space-y-2.5">
              
              <div className="flex justify-between items-center text-[#151B20] border-b border-[#151B20]/30 pb-2">
                <div className="flex flex-col">
                  <span className="font-syne text-xs font-black uppercase tracking-wider">VIBE STARS</span>
                  <span className="text-[10px] font-mono text-[#151B20]/80">General Access</span>
                </div>
                <div className="font-syne text-xl sm:text-2xl font-extrabold text-[#151B20]">
                  1500 <span className="text-xs font-normal">KES</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[#151B20]">
                <div className="flex flex-col">
                  <span className="font-syne text-xs font-black uppercase tracking-wider">VIP</span>
                  <span className="text-[10px] font-mono text-[#151B20]/80">Priority & Lounge</span>
                </div>
                <div className="font-syne text-xl sm:text-2xl font-extrabold text-[#151B20]">
                  4000 <span className="text-xs font-normal">KES</span>
                </div>
              </div>

              <button
                onClick={onViewTicketsClick}
                className="w-full mt-1 py-2 rounded-xl bg-[#151B20] hover:bg-black text-[#FAF5E8] font-syne font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:translate-y-0.5"
              >
                <Ticket className="w-4 h-4 text-[#2DD4BF]" />
                <span>Buy Passes Now</span>
              </button>

            </div>

          </div>

          {/* RIGHT COLUMN: EVENT TAGLINE & FOOTER CALLOUT PLACEMENT */}
          <div className="flex flex-col items-start md:items-end text-left md:text-right space-y-4">
            
            {/* Tagline Stack: WHERE URBAN / MEETS CULTURE / NAIROBI */}
            <div className="flex flex-col space-y-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              {/* Line 1: "WHERE URBAN" in bold safety-orange */}
              <span className="font-syne text-xl sm:text-3xl font-extrabold text-[#E05A2B] tracking-tight uppercase leading-none">
                WHERE URBAN
              </span>

              {/* Line 2: "MEETS CULTURE" in deep navy / charcoal with high contrast */}
              <span className="font-syne text-xl sm:text-3xl font-extrabold text-[#151B20] bg-[#FAF5E8] px-2 py-0.5 rounded-md my-1 border border-[#151B20] tracking-tight uppercase leading-none inline-block">
                MEETS CULTURE
              </span>

              {/* Line 3: "NAIROBI" in large crisp white/cream sans-serif displaying maximum prominence */}
              <span
                className="font-syne text-4xl sm:text-6xl md:text-7xl font-black text-[#FAF5E8] tracking-tighter uppercase leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
                style={{ WebkitTextStroke: '2px #151B20' }}
              >
                NAIROBI
              </span>
            </div>

            {/* Footer Callout Placement: "TICKETS ARE LIVE ON ://soldoutafrica.com" */}
            <div
              onClick={onViewTicketsClick}
              className="inline-flex items-center gap-2 bg-[#151B20] border-2 border-[#FAF5E8]/80 text-[#FAF5E8] px-4 py-2 rounded-full shadow-[0_6px_0_rgba(0,0,0,0.7)] hover:bg-black cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#E05A2B]" />
              <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider">
                TICKETS ARE LIVE ON ://{typeof window !== 'undefined' ? window.location.host : 'THIS OFFICIAL SITE'}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-purple-300" />
            </div>

          </div>

        </div>

        {/* Floating Pill Metadata Elements with Get Tickets & Countdown for Korom Festival Image */}
        <div className="relative z-10 w-full mt-4 p-4.5 sm:p-5 rounded-2xl bg-black/75 backdrop-blur-md border border-purple-900/50 shadow-2xl space-y-3.5 text-left">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Category Badge */}
            <div className="inline-block px-3 py-0.5 rounded-full bg-purple-950/90 border border-purple-800/60 text-purple-300 text-[10px] font-mono font-bold tracking-widest uppercase">
              ENTERTAINMENT & ARTS
            </div>

            {/* Dynamic Live Countdown Box inside Image Banner */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-mono font-bold shadow-md">
              <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0 animate-pulse" />
              <span>{timeRemaining || 'Calculated live...'}</span>
            </div>
          </div>

          {/* Main Event Header text */}
          <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            KOROM Festival
          </h1>

          {/* Info Row 1 */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Sat, Oct 10, 2026</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>TBA</span>
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1.5 text-purple-300">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>By Korom festival</span>
            </span>
          </div>

          {/* Primary Action Button directly inside the Image Overlay */}
          <div className="pt-1">
            <button
              onClick={onViewTicketsClick}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-purple-500 active:scale-95 text-white font-syne font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-950/80 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-white" />
              <span>Get Tickets</span>
            </button>
          </div>

        </div>

      </div>

    </section>
  );
};
