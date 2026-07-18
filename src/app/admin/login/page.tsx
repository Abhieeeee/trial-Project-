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
    "SYSINIT // DETECTING SYSTEM TOPOLOGY",
    "MATHEMATICAL WAVEENGINE // COMPILING...",
    "DATABASE PROTOCOL // SYNCHRONIZING NODE",
    "SECURE ROUTE // GATEWAY INITIALIZED"
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Normalized mouse coordinates: target values mapping window center to (-0.5, 0.5)
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      targetMouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 3D Dotted Canvas Particle System driven by vanilla requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Color definitions corresponding to the active role
    const getParticleColor = () => {
      if (role === "superadmin") return "#ef4444"; // Crimson Red
      if (role === "admin") return "#00d2ff"; // Sky Blue
      return "#ffffff"; // White
    };

    // Strict 3D Coordinate Grid configuration
    const cols = 28;
    const rows = 28;
    const spacing = 38;
    const focalLength = 320;
    let time = 0;

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);

      // Lerp mouse coordinates for ultra-smooth inertia tracking
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.08;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.08;

      time += 0.035;

      const pColor = getParticleColor();
      const rotY = currentMouse.current.x * 0.6; 
      const rotX = currentMouse.current.y * 0.6; 

      // Rotation matrix helpers
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Interactive cursor projection variables in grid coordinate scale
      const mouseGridX = currentMouse.current.x * cols * spacing * 1.5;
      const mouseGridZ = currentMouse.current.y * rows * spacing * 1.5;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          // Calculate raw grid coordinates centered around (0,0)
          let x3d = (c - cols / 2) * spacing;
          let z3d = (r - rows / 2) * spacing;

          // Rolling sine wave dynamics
          let y3d = Math.sin(x3d * 0.015 + time) * 22 + Math.cos(z3d * 0.015 + time) * 22;

          // Interactive ripple repulsion distortion logic
          const dx = x3d - mouseGridX;
          const dz = z3d - mouseGridZ;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const warpRadius = 140;

          if (dist < warpRadius) {
            const factor = (1 - dist / warpRadius);
            // Push elevation and displace coordinates slightly away from cursor
            y3d -= factor * 50; 
            x3d += (dx / (dist || 1)) * factor * 25;
            z3d += (dz / (dist || 1)) * factor * 25;
          }

          // Apply 3D Y-Axis Rotation
          let xRotY = x3d * cosY - z3d * sinY;
          let zRotY = x3d * sinY + z3d * cosY;

          // Apply 3D X-Axis Rotation
          let yRotX = y3d * cosX - zRotY * sinX;
          let zRotX = y3d * sinX + zRotY * cosX;

          // Project to 2D screen coordinates via perspective projection
          const perspectiveFactor = focalLength / (zRotX + 500);
          const x2d = width / 2 + xRotY * perspectiveFactor;
          const y2d = height / 2 + yRotX * perspectiveFactor;

          // Render coordinate dot
          if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
            const size = Math.max(0.6, perspectiveFactor * 1.8);
            const alpha = Math.min(1.0, Math.max(0.15, (500 - zRotX) / 800));

            ctx.beginPath();
            ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
            ctx.fillStyle = pColor;
            ctx.globalAlpha = alpha;
            ctx.fill();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [role]);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon || url.includes("placeholder-url")) {
      setEnvStatus("BUILD ERROR: Gateway credentials missing!");
      addLog("GATEWAY STATUS // ERROR: INVALID INLINE KEYS");
    } else {
      setEnvStatus(`DATALINK ONLINE: ${url.replace("https://", "").substring(0, 20)}...`);
      addLog("GATEWAY STATUS // SECURE DATA SHIELD ESTABLISHED");
    }
  }, []);

  const addLog = (logText: string) => {
    setTerminalLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} // ${logText}`].slice(-8));
  };

  useEffect(() => {
    addLog(`DOTTED WAVE RELOAD // ENCRYPT MODE: [${role.toUpperCase()}]`);
  }, [role]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.length > 0 && val.length % 5 === 0) {
      addLog(`INPUT ENCRYPTION // DATA STREAM BUFFERED`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    addLog("DISPATCHING DECRYPT KEYS TO SECURE SERVER...");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        addLog(`KEY DISMISS // FAILURE: ${authError.message.toUpperCase()}`);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Authentication failed. Please try again.");
        addLog("KEY DISMISS // NODE FAILED TO COMPREHEND");
        setLoading(false);
        return;
      }

      addLog("GATEWAY ACCESS APPROVED // RESOLVING IDENTITY...");
      const userRole = await getUserRole(data.user.id);
      addLog(`RESOLVED ACCORDING ROLE: ${userRole.toUpperCase()}`);

      if (userRole === "super_admin") {
        addLog("SYSTEM REDIRECT // LAUNCHING SUPER ADMIN PORTAL...");
        setTimeout(() => router.push("/super-admin/dashboard"), 800);
      } else if (userRole === "admin") {
        addLog("SYSTEM REDIRECT // LAUNCHING ADMIN CLOUD...");
        setTimeout(() => router.push("/admin/dashboard"), 800);
      } else {
        addLog("USER REDIRECT // ACCESSING STYLES BOARD...");
        setTimeout(() => router.push("/user-dashboard"), 800);
      }
    } catch (err: any) {
      const errMsg = err?.message || "A network error occurred.";
      setError(errMsg);
      addLog(`GATEWAY NETWORK FAULT // PROTOCOL SHUTDOWN: ${errMsg.toUpperCase()}`);
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
          hoverBorderClass: "focus:border-red-500 border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.25)]",
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
          hoverBorderClass: "focus:border-sky-500 border-sky-500/60 shadow-[0_0_25px_rgba(0,210,255,0.3)]",
          btnClass: "bg-sky-500 text-black hover:bg-sky-400 shadow-[0_0_40px_rgba(0,210,255,0.55)]",
          badgeClass: "bg-sky-500/10 text-sky-300 border-sky-500/30",
          bgGradient: "from-sky-950/20 via-black to-black",
          highlightClass: "bg-sky-500/15 text-sky-300 border-sky-500/30",
          hudColor: "rgba(0, 210, 255, 0.2)",
          modelAccent: "rgba(0, 210, 255, 0.3)",
        };
      default:
        return {
          colorClass: "text-white",
          glowClass: "bg-white/10",
          borderClass: "border-white/20",
          hoverBorderClass: "focus:border-white border-white/50 shadow-[0_0_25px_rgba(255,255,255,0.2)]",
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
    <div className={`min-h-screen w-full bg-black text-white flex flex-col lg:flex-row relative overflow-hidden select-none ${orbitron.variable} ${spaceGrotesk.variable} font-sans`}>
      
      {/* LEFT COLUMN: Luxury Streetwear Lookbook Branding Panel */}
      <div className="relative w-full lg:w-[60%] h-[35vh] lg:h-screen flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 bg-black">
        {/* Immersive Brand Artwork background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-editorial.png"
            alt="AURA STREET Cyberpunk Outerwear"
            fill
            className="object-cover opacity-35 mix-blend-luminosity scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Low opacity digital metadata HUD parameters */}
        <div className="absolute bottom-6 left-8 z-10 hidden sm:flex flex-col gap-1.5 text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-bold font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-[1.5px] bg-brand-sky animate-ping" />
            <span className="text-white">COORDINATES // 48.8566 N, 2.3522 E</span>
          </div>
          <span>GRID PROTOCOL V4 // FABRIC SOURCE OSAKA, JP</span>
          <span>ESTABLISHED DESIGN STUDIO // PARIS LAB DECRYPT</span>
        </div>

        {/* Techwear vector Crosshair */}
        <div className="absolute z-10 pointer-events-none text-neutral-600 opacity-60">
          <div className="w-16 h-16 relative flex items-center justify-center">
            <div className="w-6 h-[1px] bg-current" />
            <div className="h-6 w-[1px] bg-current absolute" />
            <div className="w-10 h-10 rounded-full border border-current opacity-30 absolute" />
          </div>
        </div>

        {/* Giant Outlined Logo Header */}
        <div className="relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-[0.55em] uppercase font-display text-white select-none drop-shadow-3xl">
            AURA<span className="text-brand-sky">.</span>STREET
          </h2>
          <span className="block text-[8px] sm:text-[9.5px] uppercase tracking-[0.45em] text-neutral-400 mt-4 font-black">
            HIGH-END TECHWEAR // R&D GATEWAY
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Login Container (With Embedded Wave Canvas) */}
      <div className="relative w-full lg:w-[40%] h-[65vh] lg:h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden">
        
        {/* Dotted 3D perspective Canvas Particle system */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
        />

        {/* Centered flat glassmorphic interface block */}
        <div className="w-full max-w-sm z-10 flex flex-col justify-between h-[90%] max-h-[580px]">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-950/95 border border-white/10 rounded-t-[18px] backdrop-blur-md font-display">
            <Link href="/" className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-all font-black">
              &lt; HOME
            </Link>
            <div className="flex items-center gap-2 text-[8px] sm:text-[9px] uppercase tracking-widest font-black text-neutral-500">
              <Cpu className={`w-3.5 h-3.5 ${theme.colorClass} animate-pulse`} />
              <span>ACCESS PROTOCOL</span>
            </div>
          </div>

          {/* Secure Form Body Container */}
          <motion.div
            animate={{ borderColor: theme.hudColor }}
            className="border-x border-b bg-neutral-950/70 p-6 sm:p-8 backdrop-blur-md relative"
          >
            {/* L-bracket details */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20" />

            {/* Toggle Selector tabs */}
            <div className="flex bg-black/80 p-1.5 rounded-lg border border-white/5 mb-6 relative font-display">
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
                    className="flex-1 py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black rounded transition-all duration-300 relative z-10 text-neutral-500 hover:text-white"
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeRoleHighlight"
                        className={`absolute inset-0 rounded border transition-colors duration-500 ${theme.highlightClass}`}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    {r === "superadmin" ? "SUPER" : r === "admin" ? "ADMIN" : "STAFF"}
                  </button>
                );
              })}
            </div>

            {/* Error Notification Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded px-4 py-3 mb-5 overflow-hidden font-display"
                >
                  <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-[9px] uppercase tracking-widest font-black text-red-500">Security Alert</h4>
                    <p className="text-[8px] text-red-400 font-bold leading-normal uppercase tracking-wider">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Credential Inputs Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Secure ID Email */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[8px] uppercase tracking-[0.25em] font-black text-neutral-500 font-display">
                    [SECURE ID EMAIL]
                  </label>
                  <span className={`text-[7px] uppercase tracking-widest font-black px-2 py-0.5 border rounded font-display transition-colors duration-500 ${theme.badgeClass}`}>
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
                    className={`w-full bg-black/60 border border-neutral-900 focus:border-white rounded-lg py-3.5 px-4 text-xs font-semibold focus:outline-none transition-all duration-300 text-white placeholder:text-neutral-700 ${theme.hoverBorderClass}`}
                    required
                  />
                  <KeyRound className="absolute right-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                </div>
              </div>

              {/* Password Secure ID */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[8px] uppercase tracking-[0.25em] font-black text-neutral-500 font-display">
                    [DECRYPT ACCESS KEY]
                  </label>
                  <a href="#" className="text-[7.5px] text-neutral-600 hover:text-white uppercase tracking-[0.2em] font-black transition-colors font-display">Forgot?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-black/60 border border-neutral-900 focus:border-white rounded-lg py-3.5 px-4 text-xs font-semibold focus:outline-none transition-all duration-300 text-white placeholder:text-neutral-700 ${theme.hoverBorderClass}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Gateway link connection diagnostics */}
              <div className={`text-[7.5px] uppercase tracking-[0.15em] font-black border py-2 px-3 rounded text-center select-text transition-colors duration-500 ${
                envStatus.includes("ERROR") 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : "bg-black/60 border-neutral-900 text-neutral-500"
              }`}>
                {envStatus}
              </div>

              {/* Authorize Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-3 py-4 rounded text-[9.5px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group font-display ${theme.btnClass}`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    AUTHORIZE ACCESS
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Connected Live Decrypt Logs Panel */}
          <div className="border-x border-b border-white/10 rounded-b-[18px] bg-neutral-950/80 p-4.5 font-mono flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-black text-neutral-400">
                <Monitor className="w-3 h-3 text-neutral-500" />
                <span>DECRYPT LOGGER</span>
              </div>
              <Wifi className="w-2.5 h-2.5 text-brand-sky animate-pulse" />
            </div>

            {/* log thread */}
            <div className="space-y-1.5 text-[7.5px] uppercase tracking-widest font-semibold text-neutral-500 max-h-[70px] overflow-y-auto pr-1.5 scrollbar-none">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-2 items-start leading-relaxed pl-1">
                  <span className="text-brand-sky select-none">&gt;</span>
                  <span className="whitespace-normal break-all select-text">{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Multi-Factor Warning overlay footer */}
      <div className="absolute bottom-4 right-6 text-right hidden sm:flex items-center justify-end gap-2 text-neutral-600 font-display z-10">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <p className="text-[7.5px] uppercase tracking-[0.25em] font-black">
          RESTRICTED PORTAL SYSTEM ACTIVE
        </p>
      </div>
    </div>
  );
}
