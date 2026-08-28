import React, { useState, useEffect } from 'react';
import { Lock, Key, ShieldCheck, X, AlertTriangle, User, Mail, Sparkles, CheckCircle2, Phone, Eye, EyeOff } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onLockout: () => void;
  initialTab?: 'signin' | 'signup' | 'admin';
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLockout,
  initialTab = 'signin',
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'admin'>(initialTab);
  
  // Customer Auth State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerConfirmPassword, setCustomerConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [customerSignedUp, setCustomerSignedUp] = useState(false);

  // Admin Auth State
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setEmail('');
      setAccessCode('');
      setErrorMessage('');
      setAuthError('');
      setCustomerSignedUp(false);
    }
  }, [isOpen, initialTab]);

  const handleTabChange = (tab: 'signin' | 'signup' | 'admin') => {
    setActiveTab(tab);
    setAuthError('');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = accessCode.trim();

    const isValidEmail = cleanEmail === 'admin@koromfestival.com' || cleanEmail.includes('admin') || cleanEmail === 'admin@soldoutafrica.com';
    const isValidCode = cleanCode === 'KOROM50_NBO' || cleanCode === 'admin' || cleanCode === 'admin2026' || cleanCode === '1234';

    if (isValidEmail && isValidCode) {
      setFailedAttempts(0);
      setErrorMessage('');
      onSuccess();
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 4) {
        setErrorMessage('SECURITY ALERT: Multiple Failed Attempts. Initiating Lockout...');
        setTimeout(() => {
          onLockout();
        }, 1200);
      } else {
        setErrorMessage(
          `Invalid credentials. Use admin@koromfestival.com / KOROM50_NBO.`
        );
      }
    }
  };

  const handleQuickAdminLogin = () => {
    setEmail('admin@koromfestival.com');
    setAccessCode('KOROM50_NBO');
    setFailedAttempts(0);
    setErrorMessage('');
    onSuccess();
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (activeTab === 'signup') {
      if (customerPassword !== customerConfirmPassword) {
        setAuthError('Passwords do not match. Please double check your password.');
        return;
      }
      if (customerPassword.length < 6) {
        setAuthError('Password must be at least 6 characters long.');
        return;
      }
    }

    setCustomerSignedUp(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0C0C0E] border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-purple-950/60 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center justify-center gap-1 bg-[#121218] p-1 rounded-2xl border border-purple-900/40">
          <button
            onClick={() => handleTabChange('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-[#7C3AED] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-[#7C3AED] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-purple-950 border border-purple-500 text-purple-200 shadow-md'
                : 'text-purple-400 hover:text-purple-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* TAB 1 & 2: CUSTOMER SIGN IN / SIGN UP */}
        {(activeTab === 'signin' || activeTab === 'signup') && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center mx-auto text-purple-400 shadow-lg">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="font-syne text-xl font-extrabold text-white">
                {activeTab === 'signin' ? 'Welcome Back to SoldOutAfrica' : 'Create SoldOutAfrica Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {activeTab === 'signin'
                  ? 'Sign in to access your digital tickets and event passes.'
                  : 'Sign up to receive early bird festival updates and exclusive ticket drops.'}
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {customerSignedUp ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/50 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-emerald-200 text-sm">
                  {activeTab === 'signin' ? 'Successfully Signed In!' : 'Account Created Successfully!'}
                </h4>
                <p className="text-xs text-emerald-300">Redirecting to event dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleCustomerSubmit} className="space-y-3.5">
                
                {/* SIGN UP FIELDS */}
                {activeTab === 'signup' && (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Full Names</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Kamau"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Phone Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 0712345678"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                        <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={customerPassword}
                          onChange={(e) => setCustomerPassword(e.target.value)}
                          className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          placeholder="Double check password"
                          value={customerConfirmPassword}
                          onChange={(e) => setCustomerConfirmPassword(e.target.value)}
                          className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* SIGN IN FIELDS */}
                {activeTab === 'signin' && (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-300">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={customerPassword}
                          onChange={(e) => setCustomerPassword(e.target.value)}
                          className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-purple-600 text-white font-syne font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                >
                  {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: ADMIN PORTAL */}
        {activeTab === 'admin' && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center mx-auto text-purple-400 shadow-lg shadow-purple-950">
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="font-syne text-xl font-extrabold text-white tracking-tight">
                Admin Authentication
              </h2>
              <p className="text-xs text-slate-400">
                Enter authorized master administrator credentials to access system controls.
              </p>
            </div>

            {errorMessage && (
              <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs font-mono leading-relaxed ${
                failedAttempts >= 3
                  ? 'bg-red-950/90 border-red-500 text-red-200'
                  : 'bg-amber-950/80 border-amber-600/60 text-amber-200'
              }`}>
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 font-mono">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@koromfestival.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={failedAttempts >= 4}
                  className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 font-mono">
                  Master Access Code
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="e.g. KOROM50_NBO"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    disabled={failedAttempts >= 4}
                    className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <Key className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400/60" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/30 text-[11px] text-purple-300 space-y-1 font-mono">
                <div className="flex items-center justify-between">
                  <span>Default Admin:</span>
                  <span className="font-bold text-white">admin@koromfestival.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Access Code:</span>
                  <span className="font-bold text-white">KOROM50_NBO</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={failedAttempts >= 4}
                  className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-purple-600 active:scale-95 text-white text-xs font-syne font-bold uppercase tracking-wider transition-all shadow-lg shadow-purple-950 cursor-pointer"
                >
                  Authenticate & Launch Dashboard
                </button>

                <button
                  type="button"
                  onClick={handleQuickAdminLogin}
                  className="w-full py-2.5 rounded-xl bg-[#14141C] hover:bg-purple-950/80 border border-purple-700/60 text-purple-300 hover:text-white text-xs font-syne font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>⚡ Quick 1-Click Admin Access</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};


