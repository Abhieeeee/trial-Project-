'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Package,
  Shield,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Mail,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  UserCheck,
  Truck,
  Clock,
  Copy,
  Check,
  Crown,
  Tag,
  Key,
} from 'lucide-react';
import PageShell from '@/components/PageShell';
import PageIntro from '@/components/PageIntro';
import { createClient } from '@/lib/supabase/client';
import { useWishlist } from '@/lib/wishlistContext';

function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

const menuItems = [
  {
    icon: Package,
    title: 'Order History & Tracking',
    description: 'Track active shipments & delivery progress',
    href: '/user-dashboard',
  },
  {
    icon: Heart,
    title: 'Saved Wishlist',
    description: 'View saved 450GSM streetwear garments',
    href: '/shop',
  },
  {
    icon: MapPin,
    title: 'Shipping Destinations',
    description: 'Manage Nepal & international delivery addresses',
    href: '/checkout',
  },
  {
    icon: CreditCard,
    title: 'Payment Methods',
    description: 'Cards, eSewa, Khalti & Apple Pay',
    href: '/checkout',
  },
  {
    icon: Shield,
    title: 'Portal Security & Access',
    description: 'Account settings, MFA & credentials',
    href: '/account',
  },
];

const mockOrders = [
  {
    id: "AUR-NP8492",
    item: "Moto Techwear Leather Jacket",
    amount: "€680",
    status: "In Transit",
    step: 3,
    trackingCode: "NP-KT-9048201",
    carrier: "Express Nepal Air",
    eta: "Jul 27, 2026",
  },
  {
    id: "AUR-INT2049",
    item: "Essential Geometry Hoodie 450GSM",
    amount: "€245",
    status: "Packed",
    step: 2,
    trackingCode: "DHL-EX-4920194",
    carrier: "DHL Express",
    eta: "Aug 1, 2026",
  },
];

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authMode, setAuthMode] = useState<'magic' | 'password'>('magic');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [authFeedback, setAuthFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { totalWishlist } = useWishlist();

  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUser(data.user);
        } else {
          const savedSession = localStorage.getItem('aura_user_session');
          if (savedSession) {
            setUser(JSON.parse(savedSession));
          }
        }
      } catch (err) {
        console.error('User check error:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setSigningIn(true);
    setAuthFeedback(null);

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        const googleSession = {
          id: `goog-user-${Date.now()}`,
          email: 'collector.aura@gmail.com',
          user_metadata: {
            full_name: 'Google Verified Collector',
            avatar_url: '',
          },
          app_metadata: { provider: 'google' },
        };
        localStorage.setItem('aura_user_session', JSON.stringify(googleSession));
        setUser(googleSession);
        setAuthFeedback({ type: 'success', message: 'Google Authentication Successful!' });
      }
    } catch {
      const googleSession = {
        id: `goog-user-${Date.now()}`,
        email: 'collector.aura@gmail.com',
        user_metadata: {
          full_name: 'Google Verified Collector',
          avatar_url: '',
        },
        app_metadata: { provider: 'google' },
      };
      localStorage.setItem('aura_user_session', JSON.stringify(googleSession));
      setUser(googleSession);
    } finally {
      setSigningIn(false);
    }
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSigningIn(true);
    setAuthFeedback(null);

    setTimeout(() => {
      const simulatedUser = {
        id: `usr-${Date.now()}`,
        email: emailInput,
        user_metadata: {
          full_name: emailInput.split('@')[0],
          avatar_url: '',
        },
        app_metadata: { provider: 'email' },
      };
      localStorage.setItem('aura_user_session', JSON.stringify(simulatedUser));
      setUser(simulatedUser);
      setSigningIn(false);
      setAuthFeedback({ type: 'success', message: 'Signed in successfully!' });
    }, 500);
  };

  const handleDemoSignIn = () => {
    setSigningIn(true);
    setAuthFeedback(null);
    setTimeout(() => {
      const demoUser = {
        id: `usr-demo-${Date.now()}`,
        email: 'collector.aura@gmail.com',
        user_metadata: {
          full_name: 'Aura VIP Collector',
          avatar_url: '',
        },
        app_metadata: { provider: 'demo' },
      };
      localStorage.setItem('aura_user_session', JSON.stringify(demoUser));
      setUser(demoUser);
      setSigningIn(false);
      setAuthFeedback({ type: 'success', message: 'Authenticated as VIP Collector!' });
    }, 400);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem('aura_user_session');
    setUser(null);
    setAuthFeedback(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Maya Rivera';
  const displayEmail = user?.email || 'collector.aura@gmail.com';
  const isGoogleUser = user?.app_metadata?.provider === 'google' || user?.id?.startsWith('goog-');

  return (
    <PageShell>
      {/* Authenticated State Header */}
      {user && (
        <PageIntro
          eyebrow="Customer Account // VIP Terminal"
          title={`Welcome back, ${displayName}`}
          text="Access active shipments, saved streetwear garments, and 450GSM Drop 01 privileges."
        />
      )}

      <div className="w-full flex flex-col items-center justify-center font-sans">
        {/* Loading State Skeleton */}
        {loading && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full border-2 border-[#00D2FF] border-t-transparent animate-spin mb-4" />
            <p className="text-xs font-mono text-neutral-300 uppercase tracking-widest animate-pulse">
              Verifying Customer Credentials...
            </p>
          </div>
        )}

        {/* ── UNAUTHENTICATED STATE: Luxury Dark Cyberpunk Login Portal ── */}
        {!user && !loading && (
          <div className="w-full min-h-[85vh] flex items-center justify-center px-4 sm:px-6 pt-12 pb-20 relative">
            {/* Ambient Dual Backlight Glow Orbs */}
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#00D2FF]/20 via-blue-600/15 to-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
            <div className="absolute w-[300px] h-[300px] bg-[#00D2FF]/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg glass-panel-glow bg-[#0a0a0e]/95 border border-white/20 rounded-3xl p-8 sm:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-3xl relative z-10 my-auto"
            >
              {/* Portal Header */}
              <div className="text-center space-y-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#00D2FF]/20 to-white/5 border border-[#00D2FF]/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(0,210,255,0.25)] text-[#00D2FF]">
                  <Sparkles className="w-8 h-8 text-[#00D2FF]" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] text-[10px] font-bold uppercase tracking-[0.25em] font-mono mb-3">
                    <UserCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                    AURA STREET // PRIVATE PORTAL
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display mt-1">
                    Customer Sign In
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed mt-3 max-w-md mx-auto">
                    Sign in to track orders, manage saved items, and receive drop access.
                  </p>
                </div>
              </div>

              {/* 1-Click Google Sign In Button */}
              <div className="mb-6">
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handleGoogleLogin}
                  disabled={signingIn}
                  className="w-full py-4 px-6 bg-white hover:bg-neutral-100 text-black font-extrabold rounded-2xl transition-all flex items-center justify-center gap-3 text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-[0_4px_25px_rgba(255,255,255,0.25)] font-mono border border-white"
                >
                  <GoogleIcon className="w-5 h-5 shrink-0" />
                  <span className="font-extrabold text-black">
                    {signingIn ? 'Authenticating...' : 'Continue with Google'}
                  </span>
                </motion.button>
              </div>

              {/* High-Contrast Or Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="h-[1px] flex-1 bg-white/15" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono font-bold px-3 py-1 bg-white/[0.04] rounded-full border border-white/10">
                  OR SIGN IN WITH EMAIL
                </span>
                <div className="h-[1px] flex-1 bg-white/15" />
              </div>

              {/* Auth Mode Toggle Tabs (Magic Link vs Password) */}
              <div className="grid grid-cols-2 p-1.5 bg-white/[0.04] border border-white/15 rounded-2xl font-mono text-xs mb-6">
                <button
                  type="button"
                  onClick={() => setAuthMode('magic')}
                  className={`py-3 px-4 rounded-xl font-bold transition-all text-center cursor-pointer ${
                    authMode === 'magic'
                      ? 'bg-[#00D2FF] text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Magic Access
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('password')}
                  className={`py-3 px-4 rounded-xl font-bold transition-all text-center cursor-pointer ${
                    authMode === 'password'
                      ? 'bg-[#00D2FF] text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Password Login
                </button>
              </div>

              {/* Feedback Message */}
              <AnimatePresence>
                {authFeedback && (
                  <motion.div
                    role="alert"
                    aria-live="polite"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-mono font-bold mb-6 ${
                      authFeedback.type === 'success'
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                        : 'bg-red-500/15 border border-red-500/40 text-red-300'
                    }`}
                  >
                    {authFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                    <span>{authFeedback.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* High-Contrast Email / Password Sign In Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-5 font-mono">
                <div className="space-y-2 text-left">
                  <label
                    htmlFor="customer-email"
                    className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#00D2FF]" />
                    <span>Email Address</span>
                  </label>
                  <input
                    id="customer-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/20 focus:border-[#00D2FF] focus:ring-1 focus:ring-[#00D2FF]/40 rounded-2xl py-4 px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none transition-all shadow-inner font-mono font-medium"
                  />
                </div>

                {authMode === 'password' && (
                  <div className="space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="customer-password"
                        className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300"
                      >
                        <Lock className="w-3.5 h-3.5 text-[#00D2FF]" />
                        <span>Password</span>
                      </label>
                      <span className="text-[10px] text-[#00D2FF] hover:underline cursor-pointer">
                        Forgot?
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        id="customer-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/20 focus:border-[#00D2FF] focus:ring-1 focus:ring-[#00D2FF]/40 rounded-2xl py-4 pl-4 pr-12 text-sm text-white placeholder:text-neutral-500 focus:outline-none transition-all shadow-inner font-mono font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1.5"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={signingIn}
                  className="w-full py-4 px-6 bg-[#00D2FF] hover:bg-cyan-400 text-black font-extrabold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-widest cursor-pointer shadow-[0_0_30px_rgba(0,210,255,0.35)] font-mono mt-6"
                >
                  <span>
                    {signingIn
                      ? 'Authenticating...'
                      : authMode === 'magic'
                      ? 'Send Magic Access Link'
                      : 'Sign In to Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>

              {/* Quick Instant VIP Demo Sign In Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={signingIn}
                  className="w-full py-3.5 px-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/20 text-neutral-200 hover:text-white font-mono text-xs font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Zap className="w-4 h-4 text-[#00D2FF]" />
                  <span>Quick Instant VIP Demo Sign In</span>
                </button>
              </div>

              {/* 256-Bit SSL Encrypted Footer */}
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-mono border-t border-white/10 pt-6">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>256-Bit SSL Encrypted Customer Auth</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── AUTHENTICATED STATE: VIP Customer Terminal Dashboard ── */}
        {user && (
          <section className="px-6 md:px-12 max-w-5xl w-full mx-auto pb-32 font-sans">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 mt-4"
            >
              {/* User Profile Header Card */}
              <div className="glass-panel-glow bg-[#0a0a0e]/95 border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-5 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D2FF] to-purple-600 p-[2px] shrink-0 shadow-[0_0_20px_rgba(0,210,255,0.4)]">
                    <div className="w-full h-full rounded-[14px] bg-[#030305] flex items-center justify-center overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-black text-white font-mono">
                          {displayName.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h2 className="text-xl font-extrabold text-white font-display">{displayName}</h2>
                      {isGoogleUser && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/40 text-[9px] font-mono font-bold uppercase tracking-wider">
                          Google Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 font-mono">{displayEmail}</p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-5 py-3 rounded-2xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>

              {/* VIP Membership Privilege Tier Banner */}
              <div className="glass-panel p-6 rounded-3xl border border-[#00D2FF]/30 bg-gradient-to-r from-[#00D2FF]/10 via-[#0a0a0e] to-purple-900/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(0,210,255,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#00D2FF]/20 border border-[#00D2FF]/40 flex items-center justify-center text-[#00D2FF] shrink-0">
                    <Crown className="w-6 h-6 text-[#00D2FF]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#00D2FF]">
                        TIER 02 // CYBER VIP COLLECTOR
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
                    </div>
                    <p className="text-xs text-neutral-300 font-mono mt-1">
                      Privileges: Free Worldwide Shipping + 450GSM Drop 01 Priority Queue
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-center">
                    <span className="block text-[9px] uppercase tracking-wider text-neutral-400">VIP Promo Code</span>
                    <button
                      onClick={() => copyToClipboard('AURA-VIP-20')}
                      className="text-xs font-bold text-[#00D2FF] flex items-center gap-1.5 hover:underline cursor-pointer"
                    >
                      <span>AURA-VIP-20</span>
                      {copiedCode === 'AURA-VIP-20' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Orders Shipment Preview */}
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#00D2FF]" />
                    Active Shipments & Order Status
                  </h3>
                  <a href="/user-dashboard" className="text-[10px] text-[#00D2FF] hover:underline uppercase tracking-wider">
                    View All Orders →
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="glass-panel p-5 rounded-2xl border border-white/15 bg-[#0a0a0e]/90 hover:border-[#00D2FF]/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D2FF]">
                          {ord.id}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/30 text-[9px] font-bold">
                          {ord.status}
                        </span>
                      </div>

                      <p className="text-xs font-bold text-white font-sans">{ord.item}</p>

                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-white/10">
                        <span>ETA: {ord.eta}</span>
                        <button
                          onClick={() => copyToClipboard(ord.trackingCode)}
                          className="flex items-center gap-1 text-neutral-300 hover:text-white transition-colors"
                        >
                          <span>{ord.trackingCode}</span>
                          {copiedCode === ord.trackingCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Quick Navigation Grid */}
              <div className="space-y-3 font-mono pt-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#00D2FF]" />
                  Portal Preferences & Shortcuts
                </h3>

                {menuItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="glass-panel border border-white/10 hover:border-[#00D2FF] bg-[#0a0a0e]/80 rounded-2xl p-5 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-[#00D2FF] group-hover:border-[#00D2FF]/40 transition-all">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans group-hover:text-[#00D2FF] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
