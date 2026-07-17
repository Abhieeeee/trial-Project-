"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, AlertCircle, ShieldAlert, Cpu, Terminal, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { getUserRole } from "@/app/actions/auth";

// ── Google Fonts configuration ────────────────────────────────
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});

type Role = "superadmin" | "admin" | "user";

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envStatus, setEnvStatus] = useState<string>("Verifying connectivity...");

  useEffect(() => {
    // Force sign out to clear any old cached sessions/cookies
    supabase.auth.signOut();
  }, [supabase]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon || url.includes("placeholder-url")) {
      setEnvStatus("BUILD ERROR: Vercel environment variables are missing! Check Vercel settings and redeploy.");
    } else {
      setEnvStatus(`DATALINK ONLINE: ${url.replace("https://", "").substring(0, 20)}...`);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Authentication failed. Please try again.");
        setLoading(false);
        return;
      }

      // Fetch role securely from server action (bypasses RLS recursion)
      const userRole = await getUserRole(data.user.id);

      if (userRole === "super_admin") {
        router.push("/super-admin/dashboard");
      } else if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/user-dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "A network error occurred. Please verify your connection.");
      setLoading(false);
    }
  };

  const getRoleTheme = () => {
    switch (role) {
      case "superadmin":
        return {
          colorClass: "text-red-500",
          glowClass: "bg-red-500/10",
          borderClass: "border-red-500/30",
          hoverBorderClass: "focus:border-red-500 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]",
          btnClass: "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.4)]",
          badgeClass: "bg-red-500/10 text-red-400 border-red-500/30",
          bgGradient: "from-red-950/20 via-black to-black",
          highlightClass: "bg-red-500/15 text-red-400 border-red-500/30",
          hudColor: "rgba(239, 68, 68, 0.15)",
        };
      case "admin":
        return {
          colorClass: "text-sky-400",
          glowClass: "bg-sky-500/10",
          borderClass: "border-sky-500/30",
          hoverBorderClass: "focus:border-sky-500 border-sky-500/60 shadow-[0_0_20px_rgba(125,211,252,0.2)]",
          btnClass: "bg-sky-500 text-black hover:bg-sky-400 shadow-[0_0_40px_rgba(125,211,252,0.45)]",
          badgeClass: "bg-sky-500/10 text-sky-300 border-sky-500/30",
          bgGradient: "from-sky-950/20 via-black to-black",
          highlightClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          hudColor: "rgba(125, 211, 252, 0.15)",
        };
      default:
        return {
          colorClass: "text-white",
          glowClass: "bg-white/10",
          borderClass: "border-white/20",
          hoverBorderClass: "focus:border-white border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
          btnClass: "bg-white text-black hover:bg-neutral-200 shadow-[0_0_40px_rgba(255,255,255,0.2)]",
          badgeClass: "bg-white/5 text-neutral-300 border-white/20",
          bgGradient: "from-neutral-900/40 via-black to-black",
          highlightClass: "bg-white/15 text-white border-white/30",
          hudColor: "rgba(255, 255, 255, 0.1)",
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className={`min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden select-none ${orbitron.variable} ${spaceGrotesk.variable} font-sans`}>
      
      {/* 1. Dynamic Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 transition-all duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient} pointer-events-none transition-colors duration-500`} />

      {/* 2. Interactive Scifi HUD Orbits & Tech Marks */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Animated HUD Radar circles */}
        <svg 
          className="w-[850px] h-[850px] opacity-25 animate-spin-slow transition-colors duration-500"
          viewBox="0 0 800 800"
          style={{ color: theme.hudColor }}
        >
          {/* Outer dashed scanner */}
          <circle cx="400" cy="400" r="380" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10,25" fill="none" />
          {/* Segmented layout rings */}
          <circle cx="400" cy="400" r="320" stroke="currentColor" strokeWidth="2" strokeDasharray="120,90,40,90" fill="none" />
          <circle cx="400" cy="400" r="260" stroke="currentColor" strokeWidth="1" strokeDasharray="15,20,40,20" fill="none" />
          {/* Radar axis crosshair */}
          <path d="M 400 120 L 400 150 M 400 650 L 400 680 M 120 400 L 150 400 M 650 400 L 680 400" stroke="currentColor" strokeWidth="2" />
        </svg>
        
        {/* Faint ambient scanlines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.005] to-transparent h-1/2 w-full animate-pulse pointer-events-none" />
      </div>

      {/* 3. Massive Adaptive Background Glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[180px] pointer-events-none transition-colors duration-500 ${theme.glowClass}`}
        />
      </AnimatePresence>

      {/* 4. Luxury Login Terminal Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Futuristic Tab Header */}
        <div className="flex items-center justify-between px-10 py-6 bg-neutral-950/90 border-t border-x border-white/10 rounded-t-[32px] backdrop-blur-3xl font-display">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-neutral-400 animate-pulse" />
            <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-200 font-black">
              SYSTEM CONTROL PANEL // ACCESS STATE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <span className="w-3.5 h-3.5 rounded-full bg-yellow-500" />
            <span className="w-3.5 h-3.5 rounded-full bg-green-500" />
          </div>
        </div>

        {/* Card Body */}
        <motion.div 
          animate={{ borderColor: theme.hudColor }}
          transition={{ duration: 0.5 }}
          className="border bg-neutral-950/85 rounded-b-[32px] p-10 sm:p-16 backdrop-blur-3xl relative overflow-hidden shadow-3xl"
        >
          {/* Cyberpunk Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent h-1/3 w-full pointer-events-none animate-pulse" />

          {/* Luxury Brand Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black tracking-[0.45em] uppercase font-display text-white mb-4 select-none">
              AURA<span className={theme.colorClass}>.</span>STREET
            </h1>
            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm uppercase tracking-[0.35em] font-extrabold text-neutral-400 font-display">
              <Terminal className="w-5 h-5 text-neutral-500" />
              <span>AUTHENTICATION DECRYPTION</span>
            </div>
          </div>

          {/* Role Toggle Selector with Smooth Sliding Indicator */}
          <div className="flex bg-black/80 p-2.5 rounded-2xl border border-white/5 mb-12 relative font-display">
            {(["user", "admin", "superadmin"] as Role[]).map((r) => {
              const isActive = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setError(null);
                  }}
                  className="flex-1 py-4 text-xs sm:text-sm uppercase tracking-[0.25em] font-black rounded-xl transition-all duration-300 relative z-10 text-neutral-400 hover:text-white"
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeRoleHighlight"
                      className={`absolute inset-0 rounded-xl border transition-colors duration-500 ${theme.highlightClass}`}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  {r === "superadmin" ? "SUPER ADMIN" : r === "admin" ? "ADMIN" : "STAFF"}
                </button>
              );
            })}
          </div>

          {/* Error Panel */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-4 bg-red-500/10 border border-red-500/30 rounded-2xl px-6 py-5 mb-10 overflow-hidden"
              >
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm uppercase tracking-widest font-black text-red-500 font-display">Security Guard Alert</h4>
                  <p className="text-xs sm:text-sm text-red-400 font-bold leading-relaxed uppercase tracking-wider">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-10">
            
            {/* Email Field */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <label className="text-xs sm:text-sm uppercase tracking-[0.3em] font-black text-neutral-400 font-display">
                  [SECURE EMAIL ADDRESS]
                </label>
                <span className={`text-[10px] sm:text-xs uppercase tracking-widest font-black px-4 py-1.5 border rounded-lg transition-colors duration-500 font-display ${theme.badgeClass}`}>
                  {role} Mode
                </span>
              </div>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "superadmin" ? "super@aurastreet.com"
                    : role === "admin" ? "admin@aurastreet.com"
                    : "staff@aurastreet.com"
                  }
                  className={`w-full bg-black/70 border border-neutral-800 rounded-2xl py-5 px-8 text-base font-medium focus:outline-none transition-all duration-300 text-white placeholder:text-neutral-700 ${theme.hoverBorderClass}`}
                  required
                />
                <KeyRound className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <label className="text-xs sm:text-sm uppercase tracking-[0.3em] font-black text-neutral-400 font-display">
                  [DECRYPT PASSWORD]
                </label>
                <a href="#" className="text-xs text-neutral-500 hover:text-white uppercase tracking-[0.2em] font-black transition-colors font-display">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-black/70 border border-neutral-800 rounded-2xl py-5 px-8 text-base font-medium focus:outline-none transition-all duration-300 text-white placeholder:text-neutral-700 ${theme.hoverBorderClass}`}
                  required
                />
                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              </div>
            </div>

            {/* Database Link Connectivity Display */}
            <div className={`text-[10px] uppercase tracking-[0.15em] font-black border py-3 px-5 rounded-xl text-center select-text transition-colors duration-500 ${
              envStatus.includes("ERROR") 
                ? "bg-red-500/10 border-red-500/30 text-red-400" 
                : "bg-black/60 border-neutral-800 text-neutral-500"
            }`}>
              {envStatus}
            </div>

            {/* Authenticate Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-8 py-6 rounded-2xl text-xs sm:text-sm uppercase tracking-[0.35em] font-black flex items-center justify-center gap-4 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group font-display ${theme.btnClass}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  INITIALIZE SYSTEM SESSION
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer Warning */}
        <div className="text-center mt-10 flex items-center justify-center gap-3 text-neutral-400 font-display">
          <ShieldAlert className="w-5 h-5 shrink-0 text-neutral-500" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-black">
            RESTRICTED AREA // MULTI-FACTOR AUTHENTICATION ACTIVE
          </p>
        </div>
      </motion.div>
    </div>
  );
}
