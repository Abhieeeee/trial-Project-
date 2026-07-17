"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, AlertCircle, ShieldAlert, Cpu, Terminal } from "lucide-react";
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
          hoverBorder: "focus:border-red-500 border-red-500/50",
          text: "text-red-500",
          btnBg: "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.3)]",
          badge: "bg-red-500/10 text-red-400 border-red-500/20",
        };
      case "admin":
        return {
          glow: "bg-sky-500/10",
          border: "border-sky-500/30",
          hoverBorder: "focus:border-sky-500 border-sky-500/50",
          text: "text-sky-400",
          btnBg: "bg-sky-500 text-black hover:bg-sky-400 shadow-[0_0_30px_rgba(125,211,252,0.35)]",
          badge: "bg-sky-500/10 text-sky-300 border-sky-500/20",
        };
      default:
        return {
          glow: "bg-white/10",
          border: "border-white/20",
          hoverBorder: "focus:border-white border-white/40",
          text: "text-white",
          btnBg: "bg-white text-black hover:bg-neutral-200 shadow-[0_0_30px_rgba(255,255,255,0.15)]",
          badge: "bg-white/5 text-neutral-300 border-white/10",
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-mono select-none">
      
      {/* 1. Tech Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1f2937 1px, transparent 1px),
            linear-gradient(to bottom, #1f2937 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-black pointer-events-none" />

      {/* 2. Adaptive Ambient Glows */}
      <AnimatePresence mode="wait">
        <motion.div
          key={role}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.8 }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[150px] pointer-events-none transition-colors duration-500 ${theme.glow}`}
        />
      </AnimatePresence>

      {/* 3. Login Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Decorative Top Bar */}
        <div className="flex items-center justify-between px-8 py-4 bg-neutral-900/60 border-t border-x border-white/5 rounded-t-3xl backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-neutral-400" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-300 font-bold">SECURE PORTAL v1.5</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
        </div>

        {/* Main Body */}
        <div className="border border-white/5 bg-neutral-950/70 rounded-b-3xl p-8 sm:p-12 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
          
          {/* Subtle Ambient Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent h-1/2 w-full pointer-events-none animate-pulse" />

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-black tracking-[0.4em] uppercase font-display text-white mb-3">
              AURA<span className={theme.text}>.</span>STREET
            </h1>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] font-bold text-neutral-400 flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4 text-neutral-500" />
              AUTHENTICATION PROTOCOL
            </p>
          </div>

          {/* Role Toggle Selector */}
          <div className="flex bg-black/60 p-2 rounded-2xl border border-white/5 mb-10">
            {(["user", "admin", "superadmin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setRole(r);
                  setError(null);
                }}
                className={`flex-1 py-3 text-[10px] sm:text-xs uppercase tracking-widest font-black rounded-xl transition-all duration-300 ${
                  role === r
                    ? r === "superadmin"
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : r === "admin"
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                      : "bg-white/10 text-white border border-white/10"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {r === "superadmin" ? "SUPER ADMIN" : r === "admin" ? "ADMIN" : "STAFF"}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-5 py-4 mb-8 overflow-hidden"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs uppercase tracking-widest font-black text-red-500">Error Encountered</h4>
                  <p className="text-[11px] sm:text-xs text-red-400 font-bold leading-normal uppercase tracking-wider">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-8">
            
            {/* Email Field */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-neutral-400">
                  SECURE EMAIL ADDRESS
                </label>
                <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 border rounded-md ${theme.badge}`}>
                  {role}
                </span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === "superadmin" ? "super@aurastreet.com"
                  : role === "admin" ? "admin@aurastreet.com"
                  : "staff@aurastreet.com"
                }
                className={`w-full bg-black/60 border border-neutral-800 rounded-2xl py-4.5 px-6 text-sm font-semibold focus:outline-none transition-colors text-white placeholder:text-neutral-700 ${theme.hoverBorder}`}
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-[10px] sm:text-xs uppercase tracking-widest font-extrabold text-neutral-400">
                  DECRYPT PASSWORD
                </label>
                <a href="#" className="text-[10px] sm:text-xs text-neutral-500 hover:text-white uppercase tracking-widest font-bold transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-black/60 border border-neutral-800 rounded-2xl py-4.5 px-6 text-sm font-semibold focus:outline-none transition-colors text-white placeholder:text-neutral-700 ${theme.hoverBorder}`}
                  required
                />
                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              </div>
            </div>

            {/* Authenticate Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-5 rounded-2xl text-[11px] sm:text-xs uppercase tracking-[0.25em] font-black flex items-center justify-center gap-3.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group ${theme.btnBg}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  INITIALIZE SESSION
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Warning */}
        <div className="text-center mt-8 flex items-center justify-center gap-2.5 text-neutral-500">
          <ShieldAlert className="w-4 h-4 shrink-0 text-neutral-600" />
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-black">
            RESTRICTED AREA // PROTOCOL ACTIVE
          </p>
        </div>
      </motion.div>
    </div>
  );
}
