import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MainAnatomy } from './components/MainAnatomy';
import { TicketingGrid } from './components/TicketingGrid';
import { StickyCheckoutCart } from './components/StickyCheckoutCart';
import { CrossSellCarousel } from './components/CrossSellCarousel';
import { CheckoutModal } from './components/CheckoutModal';
import { CalendarModal } from './components/CalendarModal';
import { MapModal } from './components/MapModal';
import { ShareModal } from './components/ShareModal';
import { CrossSellModal } from './components/CrossSellModal';
import { SelectTicketsModal } from './components/SelectTicketsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminAuthModal } from './components/AdminAuthModal';
import { Footer } from './components/Footer';

import { TICKET_TIERS } from './data/eventData';
import { TicketQuantity, CrossSellEvent } from './types';

export default function App() {
  // Current Route Path State
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname + window.location.hash
  );

  // Active Admin Auth Session State - Defaults to false for public visitors
  const [adminAuthSession, setAdminAuthSession] = useState<boolean>(false);

  // Auth Modal State & Tab
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');

  // Global Event Status ('On Sale' | 'Sold Out')
  const [eventStatus, setEventStatus] = useState<'On Sale' | 'Sold Out'>('On Sale');

  // Track route changes & terminate admin sessions on public links
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname + window.location.hash;
      setCurrentPath(path);

      if (!path.includes('/admin') && !path.includes('#admin')) {
        sessionStorage.removeItem('admin_auth_session');
        localStorage.removeItem('admin_auth_session');
        setAdminAuthSession(false);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initial check on mount: If NOT on /admin, strictly clear any admin session
    const path = window.location.pathname + window.location.hash;
    if (!path.includes('/admin') && !path.includes('#admin')) {
      sessionStorage.removeItem('admin_auth_session');
      localStorage.removeItem('admin_auth_session');
      setAdminAuthSession(false);
    } else {
      // If directly navigating to /admin, check if already authenticated in session
      const hasSession = sessionStorage.getItem('admin_auth_session') === 'true';
      if (hasSession) {
        setAdminAuthSession(true);
      } else {
        // Prompt for sign in credentials if accessing /admin without session
        setAuthModalTab('signin');
        setIsAuthModalOpen(true);
      }
    }

    // Fetch initial admin event status
    fetch('/api/admin/data')
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.eventStatus) {
          setEventStatus(data.settings.eventStatus);
        }
      })
      .catch((err) => console.log('Admin settings fetch notice:', err));

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAdminRoute = currentPath.includes('/admin') || currentPath.includes('#admin');

  // State-Driven Ticketing Quantities
  const [quantities, setQuantities] = useState<TicketQuantity>({
    'vibe-stars': 0,
    vip: 0,
    'table-of-10': 0,
  });

  // Modal Visibility States
  const [isSelectTicketsOpen, setIsSelectTicketsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedCrossSellEvent, setSelectedCrossSellEvent] = useState<CrossSellEvent | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Dynamic Computation of Totals
  const totalItems = (Object.values(quantities) as number[]).reduce((acc: number, qty: number) => acc + qty, 0);

  const totalAmount = TICKET_TIERS.reduce((acc, tier) => {
    const qty = quantities[tier.id] || 0;
    return acc + tier.price * qty;
  }, 0);

  // Quantity Change Handler
  const handleQuantityChange = (tierId: string, newQuantity: number) => {
    if (eventStatus === 'Sold Out') return;
    setQuantities((prev) => ({
      ...prev,
      [tierId]: Math.max(0, newQuantity),
    }));
  };

  const handleClearCart = () => {
    setQuantities({
      'vibe-stars': 0,
      vip: 0,
      'table-of-10': 0,
    });
  };

  // Smooth Scroll to Tickets
  const handleScrollToTickets = () => {
    const elem = document.getElementById('tickets-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCrossSellTicketSelect = (_event: CrossSellEvent) => {
    setSelectedCrossSellEvent(null);
    handleScrollToTickets();
  };

  // Honeypot double-click trigger handler (opens signin modal)
  const handleHoneypotDoubleClick = () => {
    if (!isAdminRoute) {
      window.history.pushState({}, '', '/admin');
      setCurrentPath('/admin');
    }
    setAuthModalTab('signin');
    setIsAuthModalOpen(true);
  };

  // Handle successful Admin Authentication
  const handleAdminAuthSuccess = () => {
    sessionStorage.setItem('admin_auth_session', 'true');
    setAdminAuthSession(true);
    setIsAuthModalOpen(false);
    if (!isAdminRoute) {
      window.history.pushState({}, '', '/admin');
      setCurrentPath('/admin');
    }
  };

  // Handle Lockout or Session Logout
  const handleAdminLogOut = () => {
    sessionStorage.removeItem('admin_auth_session');
    localStorage.removeItem('admin_auth_session');
    setAdminAuthSession(false);
    setIsAuthModalOpen(false);
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white w-full max-w-full overflow-x-hidden">
      
      {/* 1. Header Navigation Bar */}
      <Header
        cartItemCount={totalItems}
        totalAmount={totalAmount}
        onOpenCart={() => setIsCheckoutOpen(true)}
        onShare={() => setIsShareOpen(true)}
        isSaved={isSaved}
        onToggleSave={() => setIsSaved(!isSaved)}
        onOpenAuth={() => {
          setAuthModalTab('signin');
          setIsAuthModalOpen(true);
        }}
        isAdminLoggedIn={adminAuthSession}
        onOpenAdminDashboard={() => {
          window.history.pushState({}, '', '/admin');
          setCurrentPath('/admin');
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-full sm:max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-6 sm:space-y-10 overflow-x-hidden">
        
        {isAdminRoute && adminAuthSession ? (
          <AdminDashboard
            onBackToEvent={() => {
              window.history.pushState({}, '', '/');
              setCurrentPath('/');
            }}
            onLogOut={handleAdminLogOut}
            onEventStatusChange={(status) => setEventStatus(status)}
          />
        ) : (
          <>
            {/* Sold Out Banner Warning if Global Status is Sold Out */}
            {eventStatus === 'Sold Out' && (
              <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-center font-syne font-bold text-red-200 text-sm tracking-wider uppercase shadow-xl animate-pulse">
                🔥 KOROM FESTIVAL 2026 TICKETS ARE CURRENTLY SOLD OUT!
              </div>
            )}

            {/* 2. Hero Section Banner (KOROM Festival Theme) */}
            <HeroBanner
              onShare={() => setIsShareOpen(true)}
              isSaved={isSaved}
              onToggleSave={() => setIsSaved(!isSaved)}
              onViewTicketsClick={() => setIsSelectTicketsOpen(true)}
            />

            {/* Layout Grid: Left Content (2/3) + Right Sticky Cart Sidebar (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column Stacked Content */}
              <div className="lg:col-span-2 space-y-10 sm:space-y-12">
                
                {/* 3. Main Page Anatomy (Date&Time, Location, Pricing, About) */}
                <MainAnatomy
                  onOpenCalendar={() => setIsCalendarOpen(true)}
                  onOpenMap={() => setIsMapOpen(true)}
                  onScrollToTickets={() => setIsSelectTicketsOpen(true)}
                />

                {/* 4. Interactive Ticketing Grid (State-Driven Checkout) */}
                <TicketingGrid
                  tiers={TICKET_TIERS}
                  quantities={quantities}
                  onQuantityChange={handleQuantityChange}
                />

                {/* 5. Cross-Sell Carousel ("You may also like") */}
                <CrossSellCarousel
                  onSelectEvent={(event) => setSelectedCrossSellEvent(event)}
                />

              </div>

              {/* Right Column Reactive Sticky Sidebar Cart Panel */}
              <div className="lg:col-span-1">
                <StickyCheckoutCart
                  tiers={TICKET_TIERS}
                  quantities={quantities}
                  totalItems={totalItems}
                  totalAmount={totalAmount}
                  onCheckout={() => setIsCheckoutOpen(true)}
                />
              </div>

            </div>
          </>
        )}

      </main>

      {/* Footer with 1px Invisible Honeypot Trigger */}
      <Footer onHoneypotDoubleClick={handleHoneypotDoubleClick} />

      {/* Admin Authentication Modal (Unmasked via Honeypot) */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
        onLockout={handleAdminLogOut}
      />

      {/* Modal: Select Tickets (Matching Screenshot Flow) */}
      <SelectTicketsModal
        isOpen={isSelectTicketsOpen}
        onClose={() => setIsSelectTicketsOpen(false)}
        tiers={TICKET_TIERS}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        onContinue={() => {
          setIsSelectTicketsOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Interactive Customer Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        tiers={TICKET_TIERS}
        quantities={quantities}
        totalAmount={totalAmount}
        totalItems={totalItems}
        onClearCart={handleClearCart}
      />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      <CrossSellModal
        event={selectedCrossSellEvent}
        onClose={() => setSelectedCrossSellEvent(null)}
        onSelectTicket={handleCrossSellTicketSelect}
      />

    </div>
  );
}
