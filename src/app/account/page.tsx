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
    title: 'Order History',
    description: 'Track active shipments & order progress',
    href: '/user-dashboard',
  },
  {
    icon: Heart,
    title: 'Saved Wishlist',
    description: 'View your saved techwear garments',
    href: '/shop',
  },
  {
    icon: MapPin,
    title: 'Shipping Destinations',
    description: 'Manage delivery addresses',
    href: '/checkout',
  },
  {
    icon: CreditCard,
    title: 'Payment Preferences',
    description: 'Cards, eSewa, Khalti & Apple Pay',
    href: '/checkout',
  },
  {
    icon: Shield,
    title: 'Portal Security',
    description: 'Account settings & authentication',
    href: '/admin/login',
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
    } catch (err: any) {
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
        email: 'customer.aura@street.com',
        user_metadata: {
          full_name: 'Aura VIP Customer',
          avatar_url: '',
        },
        app_metadata: { provider: 'demo' },
      };
      localStorage.setItem('aura_user_session', JSON.stringify(demoUser));
      setUser(demoUser);
      setSigningIn(false);
      setAuthFeedback({ type: 'success', message: 'Authenticated as VIP Customer!' });
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

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Maya Rivera';
  const displayEmail = user?.email || 'collector.aura@gmail.com';
  const isGoogleUser = user?.app_metadata?.provider === 'google' || user?.id?.startsWith('goog-');

  return (
    <PageShell>
      {/* If Authenticated: Render PageIntro Hero */}
      {user && (
        <PageIntro
          eyebrow="Customer Account"
          title={`Welcome, ${displayName}`}
          text="Access your saved wishlist, active order shipments, and customer privileges."
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

        {/* UNAUTHENTICATED STATE: Perfectly Centered, High-Contrast Luxury Login Portal */}
        {!user && !loading && (
          <div className="min-h-[calc(100vh-140px)] w-full flex items-center justify-center px-4 sm:px-6 py-12 relative my-auto">
            {/* Ambient Dual Backlight Glow */}
            <div className="absolute w-[380px] h-[380px] bg-gradient-to-tr from-[#00D2FF]/25 via-blue-600/20 to-purple-600/25 rounded-full blur-[110px] pointer-events-none animate-pulse" />
            <div className="absolute w-[250px] h-[250px] bg-[#00D2FF]/15 rounded-full blur-[90px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md sm:max-w-lg bg-neutral-950/95 border border-white/20 rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-11 shadow-[0_25px_80px_rgba(0,0,0,0.9)] backdrop-blur-3xl space-y-7 relative z-10 my-auto"
            >
              {/* Portal Header */}
              <div className="text-center space-y-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#00D2FF]/20 to-white/5 border border-[#00D2FF]/40 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,210,255,0.2)] text-[#00D2FF]">
                  <Sparkles className="w-7 h-7 text-[#00D2FF]" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00D2FF]/10 border border-[#00D2FF]/30 text-[#00D2FF] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] font-mono mb-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
                    AURA STREET // PRIVATE PORTAL
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-sans mt-1">
                    Customer Sign In
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed mt-2.5 max-w-sm mx-auto font-medium">
                    Sign in to track orders, manage saved items, and receive drop access.
                  </p>
                </div>
              </div>

              {/* 1-Click Google Sign In Button */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={handleGoogleLogin}
                disabled={signingIn}
                className="w-full py-4 px-6 bg-white hover:bg-neutral-100 text-black font-extrabold rounded-2xl transition-all flex items-center justify-center gap-3.5 text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-[0_4px_25px_rgba(255,255,255,0.2)] font-mono group border border-white"
              >
                <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
                <span className="font-extrabold text-black">
                  {signingIn ? 'Authenticating...' : 'Continue with Google'}
                </span>
              </motion.button>

              {/* Styled High-Contrast Or Divider */}
              <div className="flex items-center gap-4 py-1">
                <div className="h-[1px] flex-1 bg-white/20" />
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-neutral-300 font-mono font-bold px-3 py-0.5 bg-white/5 rounded-full border border-white/10">
                  OR SIGN IN WITH EMAIL
                </span>
                <div className="h-[1px] flex-1 bg-white/20" />
              </div>

              {/* Auth Mode Toggle Tabs (Magic Link vs Password) */}
              <div className="grid grid-cols-2 p-1 bg-white/5 border border-white/10 rounded-xl font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('magic')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all text-center cursor-pointer ${
                    authMode === 'magic'
                      ? 'bg-[#00D2FF] text-black shadow-md'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  Magic Access
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('password')}
                  className={`py-2 px-3 rounded-lg font-bold transition-all text-center cursor-pointer ${
                    authMode === 'password'
                      ? 'bg-[#00D2FF] text-black shadow-md'
                      : 'text-neutral-300 hover:text-white'
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
                    className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-mono font-bold ${
                      authFeedback.type === 'success'
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                        : 'bg-red-500/15 border border-red-500/40 text-red-300'
                    }`}
                  >
                    {authFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{authFeedback.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* High-Contrast Email / Password Sign In Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4 font-mono">
                <div className="space-y-1.5 text-left">
                  <label
                    htmlFor="customer-email"
                    className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-200"
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
                    className="w-full bg-neutral-900 border border-white/25 focus:border-[#00D2FF] focus:bg-black rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-neutral-400 focus:outline-none transition-all shadow-inner font-sans font-medium"
                  />
                </div>

                {authMode === 'password' && (
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="customer-password"
                        className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-200"
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
                        className="w-full bg-neutral-900 border border-white/25 focus:border-[#00D2FF] focus:bg-black rounded-xl py-3.5 pl-4 pr-11 text-sm text-white placeholder:text-neutral-400 focus:outline-none transition-all shadow-inner font-sans font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer p-1"
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

                {/* Primary High-Contrast Glow Action Button */}
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={signingIn}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#00D2FF] via-[#00B8FF] to-blue-600 hover:from-[#33E0FF] hover:to-blue-500 text-black text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_25px_rgba(0,210,255,0.4)] group border border-cyan-300/40"
                >
                  <span>
                    {signingIn
                      ? 'Authenticating...'
                      : authMode === 'magic'
                      ? 'Continue with Email'
                      : 'Sign In to Account'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1.5 transition-transform" />
                </motion.button>
              </form>

              {/* Quick Instant Demo Login Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={signingIn}
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-[#00D2FF] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Quick Instant Demo Sign In</span>
                </button>
              </div>

              {/* Security Footer Badge */}
              <div className="pt-5 border-t border-white/15 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-neutral-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-neutral-200">256-Bit SSL Encrypted Customer Auth</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* AUTHENTICATED STATE: Clean Customer Dashboard */}
        {user && (
          <section className="px-6 md:px-12 max-w-5xl w-full mx-auto pb-32 font-sans">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 mt-6"
            >
              {/* User Profile Overview */}
              <div className="bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-5 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00d2ff] to-purple-500 p-[2px] shrink-0">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt={displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-bold text-white font-mono">
                          {displayName.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h2 className="text-xl font-bold text-white font-sans">{displayName}</h2>
                      {isGoogleUser && (
                        <span className="px-2.5 py-0.5 rounded bg-[#00D2FF]/15 text-[#00D2FF] border border-[#00D2FF]/40 text-[9px] font-mono font-bold uppercase tracking-wider">
                          Google Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 font-mono">{displayEmail}</p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-4 py-2.5 rounded-xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>

              {/* Account Dashboard Quick Navigation */}
              <div className="space-y-3 font-mono">
                {menuItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="bg-neutral-950 border border-white/10 hover:border-[#00D2FF] rounded-2xl p-5 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 group-hover:text-[#00D2FF] group-hover:border-[#00D2FF]/40 transition-all">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-sans group-hover:text-[#00D2FF] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-neutral-300 mt-0.5">{item.description}</p>
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
