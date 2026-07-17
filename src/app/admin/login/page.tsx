"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, AlertCircle, ShieldAlert, Cpu, Terminal, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Role = "superadmin" | "admin" | "user";

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();

  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Force sign out to clear any old cached sessions/cookies
    supabase.auth.signOut();
  }, [supabase]);

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

      // Fetch role from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        setError(`Failed to read database profile: ${profileError.message}`);
        setLoading(false);
        return;
      }

      const userRole = profile?.role ?? "user";

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
          glow: "bg-red-500/10",
          border: "border-red-500/30",
          hoverBorder: "focus:border-red-500 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]",
          text: "text-red-500",
          btnBg: "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.4)]",
          badge: "bg-red-500/10 text-red-400 border-red-500/30",
          bgOverlay: "from-red-950/20 via-black to-black",
        };
      case "admin":
        return {
          glow: "bg-sky-500/10",
          border: "border-sky-500/30",
          hoverBorder: "focus:border-sky-500 border-sky-500/60 shadow-[0_0_20px_rgba(125,211,252,0.2)]",
          text: "text-sky-400",
          btnBg: "bg-sky-500 text-black hover:bg-sky-400 shadow-[0_0_40px_rgba(125,211,252,0.45)]",
          badge: "bg-sky-500/10 text-sky-300 border-sky-500/30",
          bgOverlay: "from-sky-950/20 via-black to-black",
        };
      default:
        return {
          glow: "bg-white/10",
          border: "border-white/20",
          hoverBorder: "focus:border-white border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
          text: "text-white",
          btnBg: "bg-white text-black hover:bg-neutral-200 shadow-[0_0_40px_rgba(255,255,255,0.2)]",
          badge: "bg-white/5 text-neutral-300 border-white/20",
          bgOverlay: "from-neutral-900/40 via-black to-black",
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-mono select-none">
      
      {/* 1. Futuristic Grid Background */}
      <div 
        className="absolute inset-0 opacity-25 transition-all duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgOverlay} pointer-events-none transition-colors duration-500`} />

      {/* 2. Massive Adaptive Aura Halo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full blur-[170px] pointer-events-none transition-colors duration-500 ${theme.glow}`}
        />
      </AnimatePresence>

      {/* 3. Luxury Login Terminal Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Futuristic Tab Header */}
        <div className="flex items-center justify-between px-10 py-5 bg-neutral-950/80 border-t border-x border-white/10 rounded-t-[32px] backdrop-blur-3xl">
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
        <div className="border border-white/10 bg-neutral-950/85 rounded-b-[32px] p-10 sm:p-16 backdrop-blur-3xl relative overflow-hidden shadow-3xl">
          
          {/* Cyberpunk Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.015] to-transparent h-1/3 w-full pointer-events-none animate-pulse" />

          {/* Luxury Brand Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black tracking-[0.45em] uppercase font-display text-white mb-4 select-none">
              AURA<span className={theme.text}>.</span>STREET
            </h1>
            <div className="flex items-center justify-center gap-3 text-xs sm:text-sm uppercase tracking-[0.4em] font-extrabold text-neutral-400">
              <Terminal className="w-5 h-5 text-neutral-500" />
              <span>AUTHENTICATION DECRYPTION</span>
            </div>
          </div>

          {/* Large High-Contrast Selector */}
          <div className="flex bg-black/80 p-2.5 rounded-2xl border border-white/5 mb-12">
            {(["user", "admin", "superadmin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setError(null);
                }}
                className={`flex-1 py-4 text-xs sm:text-sm uppercase tracking-[0.25em] font-black rounded-xl transition-all duration-300 ${
                  role === r
                    ? r === "superadmin"
                      ? "bg-red-500/10 text-red-500 border border-red-500/30"
                      : r === "admin"
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                      : "bg-white/10 text-white border border-white/20"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {r === "superadmin" ? "SUPER ADMIN" : r === "admin" ? "ADMIN" : "STAFF"}
              </button>
            ))}
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
                  <h4 className="text-sm uppercase tracking-widest font-black text-red-500">Security Guard Alert</h4>
                  <p className="text-xs sm:text-sm text-red-400 font-bold leading-relaxed uppercase tracking-wider">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-10">
            
            {/* Email Field */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <label className="text-xs sm:text-sm uppercase tracking-[0.3em] font-black text-neutral-400">
                  [SECURE EMAIL ADDRESS]
                </label>
                <span className={`text-[10px] sm:text-xs uppercase tracking-widest font-black px-4 py-1.5 border rounded-lg ${theme.badge}`}>
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
                  className={`w-full bg-black/70 border border-neutral-800 rounded-2xl py-5 px-8 text-base font-semibold focus:outline-none transition-all duration-300 text-white placeholder:text-neutral-700 ${theme.hoverBorder}`}
                  required
                />
                <KeyRound className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <label className="text-xs sm:text-sm uppercase tracking-[0.3em] font-black text-neutral-400">
                  [DECRYPT PASSWORD]
                </label>
                <a href="#" className="text-xs text-neutral-500 hover:text-white uppercase tracking-[0.2em] font-black transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-black/70 border border-neutral-800 rounded-2xl py-5 px-8 text-base font-semibold focus:outline-none transition-all duration-300 text-white placeholder:text-neutral-700 ${theme.hoverBorder}`}
                  required
                />
                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
              </div>
            </div>

            {/* Authenticate Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-8 py-6 rounded-2xl text-xs sm:text-sm uppercase tracking-[0.35em] font-black flex items-center justify-center gap-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group ${theme.btnBg}`}
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
        </div>

        {/* Footer Warning */}
        <div className="text-center mt-10 flex items-center justify-center gap-3 text-neutral-400">
          <ShieldAlert className="w-5 h-5 shrink-0 text-neutral-500" />
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-black">
            RESTRICTED AREA // MULTI-FACTOR AUTHENTICATION ACTIVE
          </p>
        </div>
      </motion.div>
    </div>
  );
}
