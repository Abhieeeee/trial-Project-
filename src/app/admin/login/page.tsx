"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, AlertCircle, ShieldAlert, Cpu, Terminal, KeyRound, Monitor, HardDrive, Wifi, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
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

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
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
    "SYSINIT // INITIALIZING SYSTEM DIAGNOSTICS",
    "MATHEMATICAL ENGINE // PROJECTING 3D VECTOR GRID",
    "DB ROUTE // SYNCHRONIZING SECURE TUNNELS",
    "AWAITING DECRYPTION KEY HANDSHAKE..."
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Normalized mouse coordinates relative to screen center
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

  // requestAnimationFrame Canvas grid animation loop
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

    const getParticleColor = () => {
      if (role === "superadmin") return "#ef4444"; // Crimson Red
      if (role === "admin") return "#00d2ff"; // Sky Blue
      return "#ffffff"; // White
    };

    const cols = 26;
    const rows = 26;
    const spacing = 36;
    const focalLength = 300;
    let time = 0;

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.fillRect(0, 0, width, height);

      // Lerp mouse coordinate values to create smooth inertia movement
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.08;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.08;

      time += 0.035;

      const pColor = getParticleColor();
      const rotY = currentMouse.current.x * 0.55;
      const rotX = currentMouse.current.y * 0.55;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Coordinate offset for mouse projection
      const mouseGridX = currentMouse.current.x * cols * spacing * 1.4;
      const mouseGridZ = currentMouse.current.y * rows * spacing * 1.4;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          let x3d = (c - cols / 2) * spacing;
          let z3d = (r - rows / 2) * spacing;

          // Rolling sine/cos waves
          let y3d = Math.sin(x3d * 0.018 + time) * 20 + Math.cos(z3d * 0.018 + time) * 20;

          // Mouse warp distortion calculations
          const dx = x3d - mouseGridX;
          const dz = z3d - mouseGridZ;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const warpRadius = 130;

          if (dist < warpRadius) {
            const factor = (1 - dist / warpRadius);
            y3d -= factor * 45;
            x3d += (dx / (dist || 1)) * factor * 20;
            z3d += (dz / (dist || 1)) * factor * 20;
          }

          // Y rotation matrix
          let xRotY = x3d * cosY - z3d * sinY;
          let zRotY = x3d * sinY + z3d * cosY;

          // X rotation matrix
          let yRotX = y3d * cosX - zRotY * sinX;
          let zRotX = y3d * sinX + zRotY * cosX;

          // 3D perspective projection
          const perspectiveFactor = focalLength / (zRotX + 450);
          const x2d = width / 2 + xRotY * perspectiveFactor;
          const y2d = height / 2 + yRotX * perspectiveFactor;

          if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
            const size = Math.max(0.7, perspectiveFactor * 1.6);
            const alpha = Math.min(1.0, Math.max(0.18, (450 - zRotX) / 750));

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
      setEnvStatus("BUILD ERROR: Connection variables missing!");
      addLog("GATEWAY STATUS // ERROR: INVALID CREDENTIAL PATHS");
    } else {
      setEnvStatus(`DATALINK ONLINE: ${url.replace("https://", "").substring(0, 20)}...`);
      addLog("GATEWAY STATUS // DATA ROUTING VERIFIED SECURE");
    }
  }, []);

  const addLog = (logText: string) => {
    setTerminalLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} // ${logText}`].slice(-8));
  };

  useEffect(() => {
    addLog(`SECURITY TUNNEL COMPILING // LEVEL: [${role.toUpperCase()}]`);
  }, [role]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.length > 0 && val.length % 5 === 0) {
      addLog(`DATA TRANSIT // INPUT STRINGS ENCRYPTED`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    addLog("DISPATCHING ENCRYPTED CREDENTIAL KEYS...");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        addLog(`ACCESS DENIED // STATUS: ${authError.message.toUpperCase()}`);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Authentication failed. Please try again.");
        addLog("ACCESS DENIED // STATUS: DATA BUFFER RESOLVED TO NULL");
        setLoading(false);
        return;
      }

      addLog("ACCESS KEY APPROVED // MATCHING USER ACCESS PERMISSIONS...");
      const userRole = await getUserRole(data.user.id);
      addLog(`ACCESS PRIVILEGE VERIFIED // GROUP: ${userRole.toUpperCase()}`);

      if (userRole === "super_admin") {
        addLog("ROUTING PROTOCOL // DIRECTING TO SUPER ADMIN DASHBOARD...");
        setTimeout(() => router.push("/super-admin/dashboard"), 800);
      } else if (userRole === "admin") {
        addLog("ROUTING PROTOCOL // DIRECTING TO ADMIN PANEL...");
        setTimeout(() => router.push("/admin/dashboard"), 800);
      } else {
        addLog("ROUTING PROTOCOL // DIRECTING TO CLIENT ACCOUNT...");
        setTimeout(() => router.push("/user-dashboard"), 800);
      }
    } catch (err: any) {
      const errMsg = err?.message || "A network error occurred.";
      setError(errMsg);
      addLog(`GATEWAY NETWORK FAULT // DISCONNECTING: ${errMsg.toUpperCase()}`);
      setLoading(false);
    }
  };

  const getRoleTheme = () => {
    switch (role) {
      case "superadmin":
        return {
          colorClass: "text-[#ef4444]",
          borderClass: "border-[#ef4444]/30",
          hoverBorderClass: "focus:border-[#ef4444] border-[#ef4444]/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
          btnClass: "bg-[#ef4444] text-white hover:bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.45)]",
          badgeClass: "bg-[#ef4444]/10 text-red-400 border-[#ef4444]/30",
          bgGradient: "from-red-950/20 via-black to-black",
          highlightClass: "bg-[#ef4444]/15 text-red-400 border-[#ef4444]/30",
          hudColor: "rgba(239, 68, 68, 0.2)",
        };
      case "admin":
        return {
          colorClass: "text-[#00d2ff]",
          borderClass: "border-[#00d2ff]/30",
          hoverBorderClass: "focus:border-[#00d2ff] border-[#00d2ff]/60 shadow-[0_0_20px_rgba(0,210,255,0.25)]",
          btnClass: "bg-[#00d2ff] text-black hover:bg-[#33dfff] shadow-[0_0_40px_rgba(0,210,255,0.55)]",
          badgeClass: "bg-[#00d2ff]/10 text-sky-300 border-[#00d2ff]/30",
          bgGradient: "from-sky-950/20 via-black to-black",
          highlightClass: "bg-[#00d2ff]/15 text-sky-300 border-[#00d2ff]/30",
          hudColor: "rgba(0, 210, 255, 0.2)",
        };
      default:
        return {
          colorClass: "text-white",
          borderClass: "border-white/20",
          hoverBorderClass: "focus:border-white border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.15)]",
          btnClass: "bg-white text-black hover:bg-neutral-200 shadow-[0_0_40px_rgba(255,255,255,0.25)]",
          badgeClass: "bg-white/5 text-neutral-300 border-white/20",
          bgGradient: "from-neutral-900/40 via-black to-black",
          highlightClass: "bg-white/15 text-white border-white/30",
          hudColor: "rgba(255, 255, 255, 0.15)",
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row bg-black text-white select-none overflow-hidden ${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
      
      {/* LEFT COLUMN (60% width on desktop) */}
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

        {/* Diagnostic Metadata Base Logs (Bottom Left) */}
        <div className="absolute bottom-8 left-10 z-10 hidden sm:flex flex-col gap-2 font-mono tracking-widest text-[10px] uppercase text-zinc-400 leading-relaxed select-text">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-[1.5px] bg-[#00d2ff] animate-ping" />
            <span className="text-white">SYS NODE // 48.8566 N, 2.3522 E</span>
          </div>
          <span>GRID PROTOCOL ACTIVATED // FABRIC: OSAKA JP</span>
          <span>ESTABLISHED DESIGN STUDIO // PARIS ATELIER DECRYPT</span>
        </div>

        {/* Vector HUD targeting crosshair */}
        <div className="absolute z-10 pointer-events-none text-neutral-700 opacity-60">
          <div className="w-20 h-20 relative flex items-center justify-center">
            <div className="w-8 h-[1px] bg-current" />
            <div className="h-8 w-[1px] bg-current absolute" />
            <div className="w-12 h-12 rounded-full border border-current opacity-30 absolute animate-pulse" />
          </div>
        </div>

        {/* Symmetrical Brand Title */}
        <div className="relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.45em] uppercase font-display text-white select-none">
            U R A<span className="text-[#00d2ff]">.</span>S T R E E T
          </h2>
          <span className="block text-[8px] sm:text-[9.5px] uppercase tracking-[0.4em] text-neutral-400 mt-4 font-black font-display">
            HIGH-END TECHWEAR // R&D GATEWAY
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN (40% width on desktop) */}
      <div className="relative w-full lg:w-[40%] h-[65vh] lg:h-screen flex items-center justify-center p-6 bg-black overflow-hidden border-t lg:border-t-0 border-white/5">
        
        {/* Interactive 3D Dotted Canvas Grid underlying the layout */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
        />

        {/* Centered flat glassmorphic control dock wrapper */}
        <div className="w-full max-w-sm z-10 flex flex-col justify-between h-[95%] max-h-[580px]">
          
          {/* Top navigation utility header */}
          <div className="flex items-center justify-between px-6 py-4.5 bg-neutral-950/95 border border-white/10 rounded-t-[18px] backdrop-blur-md font-display">
            <Link href="/" className="text-[9.5px] uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-all font-black">
              &lt; HOME
            </Link>
            <div className="flex items-center gap-2 text-[8.5px] uppercase tracking-widest font-black text-neutral-500">
              <Cpu className={`w-3.5 h-3.5 ${theme.colorClass} animate-pulse`} />
              <span>ACCESS PROTOCOL</span>
            </div>
          </div>

          {/* Secure Login Credentials Block */}
          <motion.div
            animate={{ borderColor: theme.hudColor }}
            className="border-x border-b bg-neutral-950/70 p-6 sm:p-8 backdrop-blur-md relative"
          >
            {/* Symmetrical bracket design details */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20" />

            {/* Symmetrical Role Toggle Selector Row */}
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
                    className="flex-1 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black rounded transition-all duration-300 relative z-10 text-neutral-500 hover:text-white"
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

            {/* Error Message Panel */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded px-4 py-3.5 mb-5 overflow-hidden font-display"
                >
                  <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-[9px] uppercase tracking-widest font-black text-red-500">Security Alert</h4>
                    <p className="text-[8px] text-red-400 font-bold leading-normal uppercase tracking-wider">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Inputs Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* [SECURE ID EMAIL] */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[8px] uppercase tracking-[0.25em] font-black text-zinc-500 font-display">
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

              {/* [DECRYPT ACCESS KEY] */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[8px] uppercase tracking-[0.25em] font-black text-zinc-500 font-display">
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

              {/* Secure Link Status Info */}
              <div className={`text-[7.5px] uppercase tracking-[0.15em] font-black border py-2 px-3 rounded text-center select-text transition-colors duration-500 ${
                envStatus.includes("ERROR") 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : "bg-black/60 border-neutral-900 text-neutral-500"
              }`}>
                {envStatus}
              </div>

              {/* AUTHORIZE ACCESS Submit Button */}
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

          {/* Terminal Decrypt Logger Panel */}
          <div className="bg-zinc-950/90 border border-zinc-900 rounded-b-[18px] p-4.5 font-mono text-[9px] flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-black text-neutral-400">
                <Monitor className="w-3 h-3 text-neutral-500" />
                <span>TERMINAL DECRYPT LOG</span>
              </div>
              <Wifi className="w-2.5 h-2.5 text-[#00d2ff] animate-pulse" />
            </div>

            {/* log streams */}
            <div className="space-y-1.5 text-[7.5px] uppercase tracking-widest font-semibold text-neutral-500 max-h-[70px] overflow-y-auto pr-1.5 scrollbar-none select-text">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-2 items-start leading-relaxed pl-1">
                  <span className="text-brand-sky select-none">&gt;</span>
                  <span className="whitespace-normal break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Restricted warning footer */}
      <div className="absolute bottom-4 right-6 text-right hidden sm:flex items-center justify-end gap-2 text-neutral-600 font-display z-10">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <p className="text-[7.5px] uppercase tracking-[0.25em] font-black">
          RESTRICTED PROTOCOLS ACTIVE // SECURE SYSTEM ONLY
        </p>
      </div>
    </div>
  );
}
