"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, AlertCircle, ShieldAlert, Cpu, Terminal, KeyRound, Monitor, HardDrive, Wifi, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { getUserRole } from "@/app/actions/auth";
import Image from "next/image";
import Link from "next/link";

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envStatus, setEnvStatus] = useState<string>("Verifying connectivity...");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "SYSINIT // SYSTEM DEPLOYMENT DETECTED",
    "SECURE ROUTING // PARALLAX RENDER ACTIVATED",
    "DATALINK NODE // CONNECTING GATEWAY...",
    "AWAITING SECURITY DECRYPTION KEY..."
  ]);

  // Mouse Coordinates for Interactive Parallax
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize position values between -0.5 and 0.5
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    // Clear cookies/cache
    supabase.auth.signOut();
  }, [supabase]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon || url.includes("placeholder-url")) {
      setEnvStatus("BUILD ERROR: Gateway credentials missing!");
      addLog("GATEWAY STATUS // ERROR: MISSING ENV KEYS");
    } else {
      setEnvStatus(`DATALINK ONLINE: ${url.replace("https://", "").substring(0, 20)}...`);
      addLog("GATEWAY STATUS // DB SHIELD FULLY CONNECTED");
    }
  }, []);

  const addLog = (logText: string) => {
    setTerminalLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} // ${logText}`].slice(-8));
  };

  useEffect(() => {
    addLog(`SECURITY MODE COMPILING // MODE: [${role.toUpperCase()}]`);
  }, [role]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.length > 0 && val.length % 4 === 0) {
      addLog(`DECRYPTING BUFFER // STREAM INPUT RECEIVED`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    addLog("TRANSMITTING ENCRYPTED AUTH SHIELD...");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        addLog(`DECRYPT ERROR // STATUS: ${authError.message.toUpperCase()}`);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Authentication failed. Please try again.");
        addLog("DECRYPT ERROR // STATUS: DB RETURNED INVALID DESCRIPTOR");
        setLoading(false);
        return;
      }

      addLog("GATEWAY HANDSHAKE GRANTED // PARSING ROLES...");
      const userRole = await getUserRole(data.user.id);
      addLog(`USER PERMISSION ACCESSED // ROLE: ${userRole.toUpperCase()}`);

      if (userRole === "super_admin") {
        addLog("SYSTEM AUTHORIZED // ROUTING TO SUPER ADMIN DASHBOARD...");
        setTimeout(() => router.push("/super-admin/dashboard"), 800);
      } else if (userRole === "admin") {
        addLog("SYSTEM AUTHORIZED // ROUTING TO ADMIN PORTAL...");
        setTimeout(() => router.push("/admin/dashboard"), 800);
      } else {
        addLog("USER AUTHORIZED // REDIRECTING TO PORTAL...");
        setTimeout(() => router.push("/user-dashboard"), 800);
      }
    } catch (err: any) {
      const errMsg = err?.message || "A network error occurred.";
      setError(errMsg);
      addLog(`GATEWAY CRITICAL TIMEOUT // STATE: ${errMsg.toUpperCase()}`);
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
          hoverBorderClass: "focus:border-red-500 border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
          btnClass: "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.45)]",
          badgeClass: "bg-red-500/10 text-red-400 border-red-500/30",
          bgGradient: "from-red-950/20 via-black to-black",
          highlightClass: "bg-red-500/15 text-red-400 border-red-500/30",
          hudColor: "rgba(239, 68, 68, 0.2)",
          modelAccent: "rgba(239, 68, 68, 0.3)",
        };
      case "admin":
        return {
          colorClass: "text-sky-400",
          glowClass: "bg-sky-500/10",
          borderClass: "border-sky-500/30",
          hoverBorderClass: "focus:border-sky-500 border-sky-500/60 shadow-[0_0_20px_rgba(125,211,252,0.25)]",
          btnClass: "bg-sky-500 text-black hover:bg-sky-400 shadow-[0_0_40px_rgba(125,211,252,0.55)]",
          badgeClass: "bg-sky-500/10 text-sky-300 border-sky-500/30",
          bgGradient: "from-sky-950/20 via-black to-black",
          highlightClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          hudColor: "rgba(125, 211, 252, 0.2)",
          modelAccent: "rgba(125, 211, 252, 0.3)",
        };
      default:
        return {
          colorClass: "text-white",
          glowClass: "bg-white/10",
          borderClass: "border-white/20",
          hoverBorderClass: "focus:border-white border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.15)]",
          btnClass: "bg-white text-black hover:bg-neutral-200 shadow-[0_0_40px_rgba(255,255,255,0.25)]",
          badgeClass: "bg-white/5 text-neutral-300 border-white/20",
          bgGradient: "from-neutral-900/40 via-black to-black",
          highlightClass: "bg-white/15 text-white border-white/30",
          hudColor: "rgba(255, 255, 255, 0.15)",
          modelAccent: "rgba(255, 255, 255, 0.2)",
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className={`min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden select-none ${orbitron.variable} ${spaceGrotesk.variable} font-sans`}>
      
      {/* 1. Dotted Background Parallax Pattern */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)",
          backgroundSize: "35px 35px",
          transform: `translate(${mousePos.x * -35}px, ${mousePos.y * -35}px)`,
          transition: "transform 0.2s cubic-bezier(0.1, 0.8, 0.2, 1)",
        }}
      />
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.bgGradient} pointer-events-none transition-colors duration-500`} />

      {/* 2. Brand-Focused Split Screen Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        
        {/* LEFT COLUMN: Holographic High-Fashion Model & Brand Panel */}
        <div className="hidden lg:col-span-6 h-[720px] flex flex-col justify-center items-center relative overflow-hidden bg-neutral-950/20 border border-white/5 rounded-[32px]">
          
          {/* Subtle Ambient Scanlines */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.003] to-transparent h-1/2 w-full animate-pulse pointer-events-none" />

          {/* Background Digital Matrix Circle */}
          <div 
            className="absolute w-[450px] h-[450px] rounded-full border border-dashed pointer-events-none transition-colors duration-500"
            style={{ 
              borderColor: theme.hudColor,
              transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` 
            }}
          />

          {/* Interactive Dynamic Rotating Character Frame */}
          <motion.div
            animate={{
              rotateY: mousePos.x * 20, // 3D Tilt Y
              rotateX: -mousePos.y * 20, // 3D Tilt X
              x: mousePos.x * 12,
              y: mousePos.y * 12,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative w-[340px] h-[450px] border border-white/10 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
          >
            {/* Ambient image outline overlay */}
            <div 
              className="absolute inset-0 border-2 z-10 pointer-events-none transition-colors duration-500"
              style={{ borderColor: theme.modelAccent }}
            />

            {/* Corner L-accents on picture */}
            <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t border-l border-white/40 z-10" />
            <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t border-r border-white/40 z-10" />
            <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l border-white/40 z-10" />
            <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b border-r border-white/40 z-10" />

            <Image
              src="/hero-editorial.png"
              alt="Aura Street Futuristic Outerwear"
              fill
              className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[2.5s]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            {/* Floating parameter overlay */}
            <div className="absolute bottom-4 left-4 z-10 text-[9px] uppercase tracking-[0.25em] font-mono text-neutral-400">
              <span className="block font-black text-white">DRAPING CONFIG 01</span>
              <span>450GSM COTTON OS</span>
            </div>
          </motion.div>

          {/* Interactive overlay HUD Crosshair */}
          <div 
            className="absolute z-20 pointer-events-none text-brand-sky"
            style={{
              transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`
            }}
          >
            <div className="w-12 h-12 relative flex items-center justify-center">
              <div className="w-4 h-[1px] bg-current opacity-80" />
              <div className="h-4 w-[1px] bg-current opacity-80 absolute" />
              <div className="w-8 h-8 rounded-full border border-current opacity-30 absolute animate-pulse" />
            </div>
          </div>

          {/* Digital Brand Stats Info Panel */}
          <div className="mt-8 grid grid-cols-3 gap-8 text-center text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold font-mono">
            <div>
              <span className="block text-white mb-0.5">HEAVY WEAVE</span>
              <span>JAPAN FLEECE</span>
            </div>
            <div>
              <span className="block text-white mb-0.5">EST. CODE</span>
              <span>PARIS / R&D</span>
            </div>
            <div>
              <span className="block text-white mb-0.5">HARDWARE</span>
              <span>ITALIAN BRASS</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Minimal Obsidian Portal Card & Interactive Log Console */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-between h-full">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between px-8 py-5 bg-neutral-950/95 border border-white/10 rounded-t-[24px] backdrop-blur-3xl font-display">
            <Link href="/" className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-all font-black">
              &lt; BACK TO HOME
            </Link>
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-neutral-500">
              <Cpu className="w-3.5 h-3.5 text-brand-sky text-glow-sky animate-spin-slow" />
              <span>GATEWAY NODE v4</span>
            </div>
          </div>

          {/* Central Secure Form Card */}
          <motion.div
            animate={{ borderColor: theme.hudColor }}
            className="border-x border-b bg-neutral-950/70 p-6 sm:p-10 backdrop-blur-3xl relative overflow-hidden"
          >
            {/* Luxury Brand Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-black tracking-[0.4em] uppercase font-display text-white mb-2 select-none">
                AURA<span className={theme.colorClass}>.</span>STREET
              </h2>
              <div className="flex items-center justify-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-extrabold text-neutral-500 font-display">
                <Terminal className="w-4 h-4 text-neutral-600" />
                <span>DEC SYSTEM ACCESS PORTAL</span>
              </div>
            </div>

            {/* Role Toggle Grid Selector */}
            <div className="flex bg-black/80 p-1.5 rounded-xl border border-white/5 mb-8 relative font-display">
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
                    className="flex-1 py-3 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black rounded-lg transition-all duration-300 relative z-10 text-neutral-500 hover:text-white"
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeRoleHighlight"
                        className={`absolute inset-0 rounded-lg border transition-colors duration-500 ${theme.highlightClass}`}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    {r === "superadmin" ? "SUPER ADMIN" : r === "admin" ? "ADMIN" : "STAFF"}
                  </button>
                );
              })}
            </div>

            {/* Error Notification Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3.5 mb-6 overflow-hidden"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-[10px] uppercase tracking-widest font-black text-red-500 font-display">Security Alert</h4>
                    <p className="text-[9px] sm:text-[10px] text-red-400 font-bold leading-normal uppercase tracking-wider">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Secure Inputs Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email Secure Input */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[9px] uppercase tracking-[0.25em] font-black text-neutral-500 font-display">
                    [SECURE ID EMAIL]
                  </label>
                  <span className={`text-[8px] uppercase tracking-widest font-black px-2.5 py-1 border rounded transition-colors duration-500 font-display ${theme.badgeClass}`}>
                    {role} Mode
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder={
                      role === "superadmin" ? "super@aurastreet.com"
                      : role === "admin" ? "admin@aurastreet.com"
                      : "staff@aurastreet.com"
                    }
                    className={`w-full bg-black/60 border border-neutral-900 focus:border-white rounded-xl py-4 px-5 text-xs font-semibold focus:outline-none transition-all duration-300 text-white placeholder:text-neutral-700 ${theme.hoverBorderClass}`}
                    required
                  />
                  <KeyRound className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                </div>
              </div>

              {/* Password Secure Input */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[9px] uppercase tracking-[0.25em] font-black text-neutral-500 font-display">
                    [DECRYPT PASSWORD]
                  </label>
                  <a href="#" className="text-[8px] text-neutral-600 hover:text-white uppercase tracking-[0.2em] font-black transition-colors font-display">Forgot?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-black/60 border border-neutral-900 focus:border-white rounded-xl py-4 px-5 text-xs font-semibold focus:outline-none transition-all duration-300 text-white placeholder:text-neutral-700 ${theme.hoverBorderClass}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Secure Link Status Indicator */}
              <div className={`text-[8px] uppercase tracking-[0.15em] font-black border py-2.5 px-4 rounded-lg text-center select-text transition-colors duration-500 ${
                envStatus.includes("ERROR") 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : "bg-black/60 border-neutral-900 text-neutral-500"
              }`}>
                {envStatus}
              </div>

              {/* Initialize Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-4 py-4.5 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group font-display ${theme.btnClass}`}
              >
                {loading ? (
                  <div className="w-4.5 h-4.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    INITIALIZE SYSTEM SESSION
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Integrated Real-time Terminal Log Console Panel (Borders attached to form) */}
          <div className="border-x border-b border-white/10 rounded-b-[24px] bg-neutral-950/80 p-5 font-mono flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
              <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-neutral-400">
                <Monitor className="w-3.5 h-3.5 text-neutral-500" />
                <span>ACTIVE DECRYPT TELEMETRY</span>
              </div>
              <Wifi className="w-3 h-3 text-brand-sky animate-pulse" />
            </div>

            {/* scrolling outputs */}
            <div className="space-y-2 text-[8px] uppercase tracking-widest font-semibold text-neutral-500 max-h-[85px] overflow-y-auto pr-2 scrollbar-none">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-2 items-start leading-relaxed pl-1">
                  <span className="text-brand-sky select-none">&gt;</span>
                  <span className="whitespace-normal break-all select-text">{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </motion.div>

      {/* Background Bottom Multi-Factor Alert */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center flex items-center justify-center gap-2 text-neutral-500 font-display z-10 w-full px-4">
        <ShieldAlert className="w-4 h-4 shrink-0 text-neutral-600" />
        <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] font-black text-neutral-600">
          RESTRICTED PROTOCOLS ACTIVE // SECURE SYSTEM LOGINS ONLY
        </p>
      </div>
    </div>
  );
}
