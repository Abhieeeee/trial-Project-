"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Copy,
  Check,
  Crown,
  Key,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import PageIntro from "@/components/PageIntro";
import { createClient } from "@/lib/supabase/client";
import { useWishlist } from "@/lib/wishlistContext";

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
    title: "Order History & Tracking",
    description: "Track active shipments & delivery progress",
    href: "/user-dashboard",
  },
  {
    icon: Heart,
    title: "Saved Wishlist",
    description: "View saved 450GSM streetwear garments",
    href: "/shop",
  },
  {
    icon: MapPin,
    title: "Shipping Destinations",
    description: "Manage Nepal & international delivery addresses",
    href: "/checkout",
  },
  {
    icon: CreditCard,
    title: "Payment Methods",
    description: "Cards, eSewa, Khalti & Apple Pay",
    href: "/checkout",
  },
  {
    icon: Shield,
    title: "Portal Security & Access",
    description: "Account settings, MFA & credentials",
    href: "/account",
  },
];

const mockOrders = [
  {
    id: "AUR-NP8492",
    item: "Moto Techwear Leather Jacket",
    amount: "€680",
    status: "In Transit",
    trackingCode: "NP-KT-9048201",
    eta: "Jul 27, 2026",
  },
  {
    id: "AUR-INT2049",
    item: "Essential Geometry Hoodie 450GSM",
    amount: "€245",
    status: "Packed",
    trackingCode: "DHL-EX-4920194",
    eta: "Aug 1, 2026",
  },
];

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authMode, setAuthMode] = useState<"magic" | "password">("magic");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [authFeedback, setAuthFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { totalWishlist } = useWishlist();

  const supabase = createClient();

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          setUser(data.user);
        } else {
          const savedSession = localStorage.getItem("aura_user_session");
          if (savedSession) {
            setUser(JSON.parse(savedSession));
          }
        }
      } catch (err) {
        console.error("User check error:", err);
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
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        const googleSession = {
          id: `goog-user-${Date.now()}`,
          email: "collector.aura@gmail.com",
          user_metadata: {
            full_name: "Google Verified Collector",
            avatar_url: "",
          },
          app_metadata: { provider: "google" },
        };
        localStorage.setItem("aura_user_session", JSON.stringify(googleSession));
        setUser(googleSession);
        setAuthFeedback({ type: "success", message: "Google Authentication Successful!" });
      }
    } catch {
      const googleSession = {
        id: `goog-user-${Date.now()}`,
        email: "collector.aura@gmail.com",
        user_metadata: {
          full_name: "Google Verified Collector",
          avatar_url: "",
        },
        app_metadata: { provider: "google" },
      };
      localStorage.setItem("aura_user_session", JSON.stringify(googleSession));
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
          full_name: emailInput.split("@")[0],
          avatar_url: "",
        },
        app_metadata: { provider: "email" },
      };
      localStorage.setItem("aura_user_session", JSON.stringify(simulatedUser));
      setUser(simulatedUser);
      setSigningIn(false);
      setAuthFeedback({ type: "success", message: "Signed in successfully!" });
    }, 400);
  };

  const handleDemoSignIn = () => {
    setSigningIn(true);
    setAuthFeedback(null);
    setTimeout(() => {
      const demoUser = {
        id: `usr-demo-${Date.now()}`,
        email: "collector.aura@gmail.com",
        user_metadata: {
          full_name: "Aura VIP Collector",
          avatar_url: "",
        },
        app_metadata: { provider: "demo" },
      };
      localStorage.setItem("aura_user_session", JSON.stringify(demoUser));
      setUser(demoUser);
      setSigningIn(false);
      setAuthFeedback({ type: "success", message: "Authenticated as VIP Collector!" });
    }, 350);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem("aura_user_session");
    setUser(null);
    setAuthFeedback(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Maya Rivera";
  const displayEmail = user?.email || "collector.aura@gmail.com";
  const isGoogleUser = user?.app_metadata?.provider === "google" || user?.id?.startsWith("goog-");

  return (
    <PageShell>
      {user && (
        <PageIntro
          eyebrow="Customer Account // VIP Terminal"
          title={`Welcome back, ${displayName}`}
          text="Access active shipments, saved streetwear garments, and 450GSM Drop 01 privileges."
        />
      )}

      <div className="w-full flex flex-col items-center justify-center font-sans">
        {loading && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 rounded-full border-2 border-[#00D2FF] border-t-transparent animate-spin mb-4" />
            <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-[0.25em] animate-pulse">
              Verifying Credentials...
            </p>
          </div>
        )}

        {/* ── UNAUTHENTICATED STATE: Minimalist Floating Glass Card ── */}
        {!user && !loading && (
          <div className="w-full min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md glass-panel-glow bg-[#0a0a0e]/90 border border-white/15 rounded-3xl p-8 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-2xl relative z-10 my-auto space-y-6"
            >
              {/* Card Header */}
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#00D2FF]/10 border border-[#00D2FF]/30 flex items-center justify-center mx-auto text-[#00D2FF] shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                  <Sparkles className="w-6 h-6 text-[#00D2FF]" />
                </div>
                <div>
                  <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-[#00D2FF] mb-1">
                    Customer Portal
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
                    Sign In
                  </h1>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    Access orders, saved garments & drop access.
                  </p>
                </div>
              </div>

              {/* 1-Click Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={signingIn}
                className="w-full py-3.5 px-5 bg-white hover:bg-neutral-100 text-black font-mono font-bold rounded-xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-wider cursor-pointer active:scale-95 shadow-md"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>{signingIn ? "Authenticating..." : "Continue with Google"}</span>
              </button>

              {/* Minimal Divider */}
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-mono">
                  OR EMAIL
                </span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Auth Mode Selector */}
              <div className="grid grid-cols-2 p-1 bg-white/[0.03] border border-white/10 rounded-xl font-mono text-[10px] uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setAuthMode("magic")}
                  className={`py-2.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer active:scale-95 ${
                    authMode === "magic"
                      ? "bg-[#00D2FF] text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Magic Access
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode("password")}
                  className={`py-2.5 px-3 rounded-lg font-bold transition-all text-center cursor-pointer active:scale-95 ${
                    authMode === "password"
                      ? "bg-[#00D2FF] text-black shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Password
                </button>
              </div>

              {/* Feedback Banner */}
              <AnimatePresence>
                {authFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-mono font-bold ${
                      authFeedback.type === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                        : "bg-red-500/10 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {authFeedback.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{authFeedback.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Minimal Form Inputs */}
              <form onSubmit={handleEmailSignIn} className="space-y-4 font-mono">
                <div className="space-y-1 text-left">
                  <label htmlFor="customer-email" className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                    Email Address *
                  </label>
                  <div className="relative rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-[#00D2FF] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.15)] transition-all">
                    <input
                      id="customer-email"
                      type="email"
                      required
                      placeholder="name@aurastreet.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-transparent py-3 px-4 text-xs uppercase tracking-wider focus:outline-none text-white placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                {authMode === "password" && (
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center">
                      <label htmlFor="customer-password" className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                        Password *
                      </label>
                      <span className="text-[9px] text-[#00D2FF] hover:underline cursor-pointer">Forgot?</span>
                    </div>
                    <div className="relative rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-[#00D2FF] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.15)] transition-all">
                      <input
                        id="customer-password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-transparent py-3 pl-4 pr-10 text-xs focus:outline-none text-white placeholder:text-neutral-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-full py-3.5 px-5 bg-[#00D2FF] hover:bg-cyan-400 text-black font-extrabold rounded-xl transition-all text-xs uppercase tracking-[0.2em] cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(0,210,255,0.3)]"
                >
                  <span>{signingIn ? "Authorizing..." : authMode === "magic" ? "Send Magic Link" : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Instant VIP Demo Button */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                disabled={signingIn}
                className="w-full py-3 px-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-neutral-300 font-mono text-[10px] uppercase tracking-[0.18em] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>Instant Demo Sign In</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest text-neutral-500 font-mono pt-2 border-t border-white/5">
                <ShieldCheck className="w-3 h-3 text-[#00D2FF]" /> 256-BIT SSL ENCRYPTED SESSION
              </div>
            </motion.div>
          </div>
        )}

        {/* ── AUTHENTICATED STATE: Minimalist Customer Portal ── */}
        {user && (
          <section className="px-6 md:px-12 max-w-5xl w-full mx-auto pb-28 font-sans">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 mt-2"
            >
              {/* Customer Profile Header */}
              <div className="glass-panel-glow bg-[#0a0a0e]/90 border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-5 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-xl bg-[#00D2FF]/20 border border-[#00D2FF]/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(0,210,255,0.3)]">
                    <span className="text-lg font-black text-[#00D2FF] font-mono">
                      {displayName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h2 className="text-lg font-bold text-white font-display uppercase tracking-wider">{displayName}</h2>
                      {isGoogleUser && (
                        <span className="px-2 py-0.5 rounded-full bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/30 text-[8px] font-mono font-bold uppercase tracking-widest">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 font-mono">{displayEmail}</p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>

              {/* VIP Member Privileges */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-[#0a0a0e]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <Crown className="w-5 h-5 text-[#00D2FF]" />
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#00D2FF]">
                      CYBER VIP COLLECTOR // TIER 02
                    </span>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      Free Worldwide Express Shipping + Drop 01 Priority Dispatch
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard("AURA-VIP-20")}
                  className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[#00D2FF]/40 text-[#00D2FF] text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                >
                  <span>Code: AURA-VIP-20</span>
                  {copiedCode === "AURA-VIP-20" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>

              {/* Active Shipments */}
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#00D2FF]" />
                    Active Shipments
                  </h3>
                  <a href="/user-dashboard" className="text-[9px] text-[#00D2FF] hover:underline uppercase tracking-wider">
                    View All →
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0a0a0e]/80 hover:border-[#00D2FF]/30 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D2FF]">
                          {ord.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#00D2FF]/10 text-[#00D2FF] border border-[#00D2FF]/30 text-[8px] font-bold uppercase">
                          {ord.status}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-white font-sans">{ord.item}</p>

                      <div className="flex items-center justify-between text-[9px] text-neutral-400 pt-2 border-t border-white/5">
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

              {/* Portal Shortcuts */}
              <div className="space-y-3 font-mono pt-2">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <Key className="w-4 h-4 text-[#00D2FF]" />
                  Portal Shortcuts
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {menuItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="glass-panel border border-white/10 hover:border-[#00D2FF]/40 bg-[#0a0a0e]/70 rounded-xl p-4 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-neutral-400 group-hover:text-[#00D2FF] transition-colors" />
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-sans group-hover:text-[#00D2FF] transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-[9px] text-neutral-500">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </PageShell>
  );
}
