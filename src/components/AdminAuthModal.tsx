import React, { useState, useEffect } from 'react';
import { Lock, X, AlertTriangle, User, Mail, CheckCircle2, Phone, Eye, EyeOff } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onLockout?: () => void;
  initialTab?: 'signin' | 'signup' | 'admin';
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'signin',
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(
    initialTab === 'signup' ? 'signup' : 'signin'
  );
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab === 'signup' ? 'signup' : 'signin');
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setConfirmPassword('');
      setAuthError('');
      setAuthSuccessMessage('');
      setIsLoading(false);
    }
  }, [isOpen, initialTab]);

  const handleTabChange = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setAuthError('');
    setAuthSuccessMessage('');
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setAuthError('Please provide both email and password.');
      setIsLoading(false);
      return;
    }

    // Check if the user is an Administrator
    const isAdminUser = 
      cleanEmail === 'admin@koromfestival.com' ||
      cleanEmail === 'admin@soldoutafrica.com' ||
      cleanEmail.includes('admin') ||
      cleanPass === 'KOROM50_NBO' ||
      cleanPass.toLowerCase() === 'admin' ||
      cleanPass.toLowerCase() === 'admin2026' ||
      cleanPass.toLowerCase() === 'admin123';

    if (isAdminUser) {
      setAuthSuccessMessage('Signed in as Administrator. Redirecting to Dashboard...');
      setTimeout(() => {
        setIsLoading(false);
        onSuccess();
      }, 700);
    } else {
      // Standard Client Sign In
      setAuthSuccessMessage('Successfully signed in! Welcome back.');
      localStorage.setItem('user_session', JSON.stringify({ email: cleanEmail, loggedIn: true }));
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 700);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please double check.');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    // Check if registering admin user
    const isAdminUser = 
      cleanEmail === 'admin@koromfestival.com' ||
      cleanEmail === 'admin@soldoutafrica.com' ||
      cleanEmail.includes('admin') ||
      cleanPass === 'KOROM50_NBO';

    if (isAdminUser) {
      setAuthSuccessMessage('Admin account verified. Redirecting to Dashboard...');
      setTimeout(() => {
        setIsLoading(false);
        onSuccess();
      }, 700);
    } else {
      setAuthSuccessMessage('Account created successfully! Welcome to SoldOutAfrica.');
      localStorage.setItem(
        'user_session', 
        JSON.stringify({ name, email: cleanEmail, phone, loggedIn: true })
      );
      setTimeout(() => {
        setIsLoading(false);
        onClose();
      }, 700);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#0C0C0E] border border-purple-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-purple-950/60 transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Navigation Tabs (Sign In / Sign Up ONLY) */}
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
        </div>

        {/* Header Branding & Description */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/80 border border-purple-700/50 flex items-center justify-center mx-auto text-purple-400 shadow-lg">
            <User className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="font-syne text-xl font-extrabold text-white">
            {activeTab === 'signin' ? 'Welcome Back to SoldOutAfrica' : 'Create SoldOutAfrica Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {activeTab === 'signin'
              ? 'Sign in to access your digital tickets and account features.'
              : 'Sign up for instant access to festival tickets and drops.'}
          </p>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Success Alert */}
        {authSuccessMessage ? (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-600/50 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-emerald-200 text-sm">
              {authSuccessMessage}
            </h4>
            <p className="text-xs text-emerald-300">Please wait a moment...</p>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={activeTab === 'signin' ? handleSignInSubmit : handleSignUpSubmit} className="space-y-3.5">
            
            {/* SIGN UP: Name */}
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Full Names</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Kamau"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-sans"
                  />
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-sans"
                />
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* SIGN UP: Phone Number */}
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-sans"
                  />
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-sans"
                />
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* SIGN UP: Confirm Password */}
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Double check password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#14141C] border border-purple-900/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-sans"
                  />
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-purple-600 active:scale-95 text-white font-syne font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : activeTab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
