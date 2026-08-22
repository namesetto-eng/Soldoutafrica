import React, { useState, useEffect } from 'react';
import { Lock, Key, ShieldCheck, DollarSign, Ticket, Activity, RefreshCw, CheckCircle2, Clock, AlertTriangle, Power, ArrowLeft, Save, Eye, EyeOff, Search } from 'lucide-react';
import { downloadTicketPDF } from '../utils/pdfGenerator';
import { IssuedTicket } from '../types';

interface AdminDashboardProps {
  onBackToEvent: () => void;
  onLogOut?: () => void;
  onEventStatusChange?: (status: 'On Sale' | 'Sold Out') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToEvent,
  onLogOut,
  onEventStatusChange,
}) => {
  // Directly authenticated when admin session exists (no secondary PIN screen)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Settings State
  const [channelId, setChannelId] = useState('854');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [eventStatus, setEventStatus] = useState<'On Sale' | 'Sold Out'>('On Sale');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Metrics State
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalTicketsIssued: 0,
    totalTransactionsCount: 0,
    paidCount: 0,
    pendingCount: 0,
  });

  const [transactionLogs, setTransactionLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Admin Data
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setChannelId(data.settings.channelId || '854');
          setApiKey(data.settings.apiKey || '');
          setEventStatus(data.settings.eventStatus || 'On Sale');
          if (onEventStatusChange) onEventStatusChange(data.settings.eventStatus || 'On Sale');
        }
        if (data.metrics) setMetrics(data.metrics);
        if (data.transactionLogs) setTransactionLogs(data.transactionLogs);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'admin' || pinInput === 'admin2026') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId, apiKey, eventStatus }),
      });
      if (res.ok) {
        setSaveSuccess(true);
        if (onEventStatusChange) onEventStatusChange(eventStatus);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Failed to update admin settings:', err);
    }
  };

  const handleSimulatePayment = async (reference: string) => {
    try {
      const res = await fetch('/api/payhero/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Failed to simulate payment:', err);
    }
  };

  const handleDownloadPDF = (tx: any) => {
    const ticket: IssuedTicket = {
      orderId: tx.reference,
      eventTitle: 'KOROM Festival 2026',
      eventDate: 'Sat, Oct 10, 2026',
      venue: 'TBA - Nairobi, Kenya',
      customerName: tx.fullName,
      customerEmail: tx.email,
      customerPhone: tx.phone,
      items: tx.items || [],
      totalAmount: tx.amount,
      purchaseDate: new Date(tx.createdAt).toLocaleDateString(),
      qrCodeValue: `TICKET:${tx.reference}:${tx.email}:${tx.amount}`,
    };
    downloadTicketPDF(ticket);
  };

  // Filtered Logs
  const filteredLogs = transactionLogs.filter(
    (tx) =>
      tx.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.phone?.includes(searchQuery) ||
      tx.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#121218] border border-purple-900/50 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-purple-950 border border-purple-700/50 flex items-center justify-center mx-auto text-purple-400">
            <Lock className="w-7 h-7 text-purple-400" />
          </div>

          <div className="space-y-1">
            <h2 className="font-syne text-2xl font-extrabold text-white">Admin Gateway Control</h2>
            <p className="text-xs text-slate-400">
              Enter Admin PIN to manage PayHero Gateway, Event Status, and View Real-Time Revenue Metrics.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                placeholder="Enter Admin PIN (Default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className={`w-full bg-[#0A0A0C] border rounded-xl px-4 py-3 text-center text-sm font-mono text-white placeholder-slate-600 focus:outline-none ${
                  pinError ? 'border-red-500 ring-1 ring-red-500' : 'border-purple-900/50 focus:border-purple-500'
                }`}
              />
              {pinError && <p className="text-[11px] text-red-400 mt-1">Invalid PIN. Please try '1234'</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onBackToEvent}
                className="flex-1 py-3 rounded-xl bg-purple-950/40 text-slate-400 border border-purple-800/40 text-xs font-semibold hover:text-white"
              >
                Back to Site
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#7C3AED] hover:bg-purple-500 text-white text-xs font-syne font-bold uppercase tracking-wider"
              >
                Unlock Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-mono font-bold uppercase">
              Authenticated Admin
            </span>
            <span className="text-xs text-slate-400 font-mono">Channel ID: {channelId}</span>
          </div>
          <h1 className="font-syne text-3xl font-extrabold text-white tracking-tight mt-1">
            SoldOutAfrica Admin Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl bg-[#121218] border border-purple-900/40 text-purple-300 hover:text-white hover:border-purple-600 transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onBackToEvent}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/60 border border-purple-800/50 text-xs font-bold text-slate-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Event Page</span>
          </button>

          {/* Low-profile Log Out text link button */}
          <button
            onClick={() => {
              if (onLogOut) {
                onLogOut();
              } else {
                localStorage.removeItem('admin_auth_session');
                sessionStorage.removeItem('admin_auth_session');
                window.location.href = '/';
              }
            }}
            className="text-xs text-red-400 hover:text-red-300 font-mono font-bold underline underline-offset-4 px-2 py-1 transition-colors"
            title="Purge session & return to homepage"
          >
            Log Out ↩
          </button>
        </div>
      </div>

      {/* 1. Metric Blocks - Aggregate Revenue & Tickets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric 1: Total Revenue */}
        <div className="bg-[#121218] rounded-3xl p-6 border border-purple-900/40 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-syne text-3xl font-extrabold text-emerald-400">
            KES {metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
            Accumulated from {metrics.paidCount} paid M-Pesa transactions
          </p>
        </div>

        {/* Metric 2: Tickets Issued */}
        <div className="bg-[#121218] rounded-3xl p-6 border border-purple-900/40 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Tickets Issued</span>
            <div className="p-2 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/40">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="font-syne text-3xl font-extrabold text-white">
            {metrics.totalTicketsIssued} <span className="text-xs text-purple-400 font-normal">Passes</span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans">
            Official entry PDF passes dispatched
          </p>
        </div>

        {/* Metric 3: Pending & Total Logs */}
        <div className="bg-[#121218] rounded-3xl p-6 border border-purple-900/40 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Total Orders</span>
            <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/40">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="font-syne text-3xl font-extrabold text-amber-300">
            {metrics.totalTransactionsCount}
          </div>
          <div className="flex gap-3 text-[11px] text-slate-400 font-mono">
            <span className="text-emerald-400">● {metrics.paidCount} Paid</span>
            <span className="text-amber-400">● {metrics.pendingCount} Pending</span>
          </div>
        </div>

      </div>

      {/* 2. Configuration Panel */}
      <section className="bg-[#121218] rounded-3xl p-6 sm:p-8 border border-purple-900/40 space-y-6">
        <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-purple-400" />
            <h2 className="font-syne text-xl font-bold text-white">PayHero & Event Configuration</h2>
          </div>
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              <CheckCircle2 className="w-4 h-4" />
              Settings Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Field 1: PayHero Channel ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              PayHero Channel ID
            </label>
            <input
              type="text"
              required
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="e.g. 854"
              className="w-full bg-[#0A0A0C] border border-purple-900/50 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">Your assigned PayHero channel ID for STK Push</p>
          </div>

          {/* Field 2: PayHero API Private Key */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              PayHero API Private Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Secret Key / Basic Auth token"
                className="w-full bg-[#0A0A0C] border border-purple-900/50 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Bearer or Basic auth token for PayHero endpoint</p>
          </div>

          {/* Field 3: Global Event Status Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
              Event Status Global Switch
            </label>
            <div className="flex items-center gap-3 bg-[#0A0A0C] p-1.5 rounded-xl border border-purple-900/50">
              <button
                type="button"
                onClick={() => setEventStatus('On Sale')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  eventStatus === 'On Sale'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                On Sale
              </button>
              <button
                type="button"
                onClick={() => setEventStatus('Sold Out')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  eventStatus === 'Sold Out'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Sold Out
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Currently: <strong className={eventStatus === 'On Sale' ? 'text-emerald-400' : 'text-red-400'}>{eventStatus}</strong>
            </p>
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#7C3AED] hover:bg-purple-500 text-white font-syne font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Admin Configuration</span>
            </button>
          </div>

        </form>
      </section>

      {/* 3. Real-Time Transaction Logs Table */}
      <section className="bg-[#121218] rounded-3xl p-6 sm:p-8 border border-purple-900/40 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-900/30 pb-4">
          <div>
            <h2 className="font-syne text-xl font-bold text-white">
              Real-Time Transaction Logs
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Live tracking of M-Pesa callbacks & ticket issuing status
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search reference, phone, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0C] border border-purple-900/40 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-900/40 text-slate-400 font-mono text-[11px] uppercase">
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Reference</th>
                <th className="pb-3 font-semibold">Buyer Info</th>
                <th className="pb-3 font-semibold">Phone Number</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/60 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No transactions found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((tx) => (
                  <tr key={tx.reference} className="hover:bg-purple-950/20 transition-colors">
                    <td className="py-3.5 font-mono text-slate-400 text-[11px]">
                      {new Date(tx.createdAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-purple-300">
                      {tx.reference}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-200">{tx.fullName}</div>
                      <div className="text-[10px] text-slate-500">{tx.email}</div>
                    </td>
                    <td className="py-3.5 font-mono text-slate-300">
                      {tx.phone}
                    </td>
                    <td className="py-3.5 text-slate-300">
                      {(tx.items || []).map((it: any, i: number) => (
                        <span key={i} className="inline-block bg-purple-950 px-2 py-0.5 rounded text-[10px] border border-purple-800/40 mr-1 mb-0.5">
                          {it.tierName} × {it.quantity}
                        </span>
                      ))}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-white">
                      KES {tx.amount?.toLocaleString()}
                    </td>
                    <td className="py-3.5">
                      {tx.status === 'PAID' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold uppercase font-mono">
                          PAID
                        </span>
                      )}
                      {tx.status === 'PENDING' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800/40 text-[10px] font-bold uppercase font-mono animate-pulse">
                          PENDING
                        </span>
                      )}
                      {tx.status === 'FAILED' && (
                        <span className="px-2.5 py-1 rounded-full bg-red-950 text-red-400 border border-red-800/40 text-[10px] font-bold uppercase font-mono">
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {tx.status === 'PENDING' && (
                        <button
                          onClick={() => handleSimulatePayment(tx.reference)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold transition-all"
                        >
                          Simulate Pay
                        </button>
                      )}
                      {tx.status === 'PAID' && (
                        <button
                          onClick={() => handleDownloadPDF(tx)}
                          className="px-2.5 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-700 text-purple-200 border border-purple-700/50 text-[11px] font-semibold transition-all"
                        >
                          Download PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </section>
    </div>
  );
};
