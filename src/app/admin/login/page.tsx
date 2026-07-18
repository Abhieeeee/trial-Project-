"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ShieldAlert, Cpu, Monitor, Wifi, Eye, EyeOff } from "lucide-react";
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

  const [role, setRole] = useState<Role>("superadmin");
  const [email, setEmail] = useState("super@aurastreet.com");
  const [password, setPassword] = useState("SuperAdminSecure123!");
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envStatus, setEnvStatus] = useState<string>("Verifying connectivity...");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [timestamp, setTimestamp] = useState<string>("2026.07.18 // 14:30:36");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });

  // Stream live logs line-by-line using a set interval script
  useEffect(() => {
    const logsList = [
      "SYSINIT // INITIALIZING PREMIUM NODE TOPOLOGY...",
      "MATHEMATICAL ENGINE // INITIATING 3D PERSPECTIVE CALCULUS...",
      "DATABASE PROTOCOL // SYNCHRONIZING SECURED TUNNELS...",
      "AWAITING ENCRYPTED ACCESS KEY DECRYPTION..."
    ];
    setTerminalLogs([]);
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < logsList.length) {
        setTerminalLogs((prev) => [...prev, logsList[idx]]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 250);
    return () => clearInterval(interval);
  }, [role]);

  // Track coordinates via mouse move listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      targetMouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Update timezone timestamp on mount
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(
        now.getFullYear() + "." + 
        String(now.getMonth() + 1).padStart(2, "0") + "." + 
        String(now.getDate()).padStart(2, "0") + " // " + 
        String(now.getHours()).padStart(2, "0") + ":" + 
        String(now.getMinutes()).padStart(2, "0") + ":" + 
        String(now.getSeconds()).padStart(2, "0")
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update default test profile credentials dynamically when role changes
  useEffect(() => {
    if (role === "superadmin") {
      setEmail("super@aurastreet.com");
      setPassword("SuperAdminSecure123!");
    } else if (role === "admin") {
      setEmail("admin@aurastreet.com");
      setPassword("AdminSecure123!");
    } else {
      setEmail("staff@aurastreet.com");
      setPassword("StaffSecure123!");
    }
  }, [role]);

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

    const cols = 22;
    const rows = 22;
    const spacing = 42;
    const focalLength = 320;
    let time = 0;

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(0, 0, width, height);

      // Lerp mouse coordinates to create smooth inertia movement
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.06;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.06;

      time += 0.025;

      const pColor = getParticleColor();
      const rotY = currentMouse.current.x * 0.4;
      const rotX = currentMouse.current.y * 0.4;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Coordinate offset for mouse projection
      const mouseGridX = currentMouse.current.x * cols * spacing * 1.2;
      const mouseGridZ = currentMouse.current.y * rows * spacing * 1.2;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          let x3d = (c - cols / 2) * spacing;
          let z3d = (r - rows / 2) * spacing;

          // Rolling subtle mathematical wave plane
          let y3d = Math.sin(x3d * 0.015 + time) * 12 + Math.cos(z3d * 0.015 + time) * 12;

          // Proximity mouse elevation warp
          const dx = x3d - mouseGridX;
          const dz = z3d - mouseGridZ;
          const dist = Math.sqrt(dx * dx + dz * dz);
          const warpRadius = 120;

          if (dist < warpRadius) {
            const factor = (1 - dist / warpRadius);
            y3d -= factor * 35;
          }

          // Rotation matrix
          let xRotY = x3d * cosY - z3d * sinY;
          let zRotY = x3d * sinY + z3d * cosY;
          let yRotX = y3d * cosX - zRotY * sinX;
          let zRotX = y3d * sinX + zRotY * cosX;

          // 3D perspective projection
          const perspectiveFactor = focalLength / (zRotX + 480);
          const x2d = width / 2 + xRotY * perspectiveFactor;
          const y2d = height / 2 + yRotX * perspectiveFactor;

          if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
            const size = Math.max(0.5, perspectiveFactor * 1.1);
            const alpha = Math.min(0.25, Math.max(0.08, (480 - zRotX) / 800));

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
      addLog("GATEWAY STATUS // ERROR: INVALID CREDENTIAL LINKAGE");
    } else {
      setEnvStatus(`DATALINK ONLINE: ${url.replace("https://", "").substring(0, 20)}...`);
      addLog("GATEWAY STATUS // DATA ROUTING STABILIZED");
    }
  }, []);

  const addLog = (logText: string) => {
    setTerminalLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} // ${logText}`].slice(-8));
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.length > 0 && val.length % 5 === 0) {
      addLog("DATA TRANSIT // INPUT STRINGS ENCRYPTED");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    addLog("DISPATCHING DECRYPT ACCESS KEY SECURELY...");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        addLog(`KEY DISMISS // REGISTRATION FAILURE: ${authError.message.toUpperCase()}`);
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Authentication failed. Please try again.");
        addLog("KEY DISMISS // DATA STREAM RESOLVED NULL");
        setLoading(false);
        return;
      }

      addLog("ACCESS KEY APPROVED // MATCHING AUTHORIZATION USER GROUP...");
      const userRole = await getUserRole(data.user.id);
      addLog(`ACCESS PRIVILEGE VERIFIED // GROUP: ${userRole.toUpperCase()}`);

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
      addLog(`GATEWAY NETWORK FAULT // PROTOCOL DISCONNECT: ${errMsg.toUpperCase()}`);
      setLoading(false);
    }
  };

  const getRoleTheme = () => {
    switch (role) {
      case "superadmin":
        return {
          colorClass: "text-[#ef4444]",
          borderClass: "border-[#ef4444]/30",
          hoverBorderClass: "focus-within:border-[#ef4444] focus-within:ring-1 focus-within:ring-[#ef4444]/15 border-zinc-800 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
          btnClass: "bg-[#ef4444] text-white hover:bg-red-600 focus:ring-1 focus:ring-red-400 focus:outline-none shadow-[0_0_20px_rgba(239,68,68,0.3)]",
          badgeClass: "bg-[#ef4444]/10 text-red-400 border-[#ef4444]/30",
          bgGradient: "from-red-950/20 via-black to-black",
          highlightClass: "bg-[#ef4444]/15 text-red-400 border-[#ef4444]/30",
          hudColor: "rgba(239, 68, 68, 0.2)",
          activeTabBorder: "border-[#ef4444]",
          tabIndicator: "bg-[#ef4444]",
          checkboxAccent: "checked:bg-[#ef4444] checked:border-[#ef4444]",
        };
      case "admin":
        return {
          colorClass: "text-[#00d2ff]",
          borderClass: "border-[#00d2ff]/30",
          hoverBorderClass: "focus-within:border-[#00d2ff] focus-within:ring-1 focus-within:ring-[#00d2ff]/15 border-zinc-800 shadow-[0_0_15px_rgba(0,210,255,0.12)]",
          btnClass: "bg-[#00d2ff] text-black hover:bg-[#33dfff] focus:ring-1 focus:ring-[#00d2ff] focus:outline-none shadow-[0_0_20px_rgba(0,210,255,0.35)]",
          badgeClass: "bg-[#00d2ff]/10 text-sky-300 border-[#00d2ff]/30",
          bgGradient: "from-sky-950/20 via-black to-black",
          highlightClass: "bg-[#00d2ff]/15 text-sky-300 border-[#00d2ff]/30",
          hudColor: "rgba(0, 210, 255, 0.2)",
          activeTabBorder: "border-[#00d2ff]",
          tabIndicator: "bg-[#00d2ff]",
          checkboxAccent: "checked:bg-[#00d2ff] checked:border-[#00d2ff]",
        };
      default:
        return {
          colorClass: "text-white",
          borderClass: "border-white/20",
          hoverBorderClass: "focus-within:border-white focus-within:ring-1 focus-within:ring-white/10 border-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.08)]",
          btnClass: "bg-white text-black hover:bg-neutral-200 focus:ring-1 focus:ring-white focus:outline-none shadow-[0_0_20px_rgba(255,255,255,0.15)]",
          badgeClass: "bg-white/5 text-neutral-300 border-white/20",
          bgGradient: "from-neutral-900/40 via-black to-black",
          highlightClass: "bg-white/15 text-white border-white/30",
          hudColor: "rgba(255, 255, 255, 0.15)",
          activeTabBorder: "border-white",
          tabIndicator: "bg-white",
          checkboxAccent: "checked:bg-white checked:border-white",
        };
    }
  };

  const theme = getRoleTheme();

  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row bg-black text-white select-none overflow-hidden ${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
      
      {/* LEFT COLUMN (60% width on desktop) */}
      <div className="relative w-full lg:w-[60%] h-[35vh] lg:h-screen flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 bg-black" role="region" aria-label="Brand Lookbook">
        {/* Immersive Brand Artwork background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-editorial.png"
            alt="AURA STREET Cyberpunk Outerwear"
            fill
            className="object-cover grayscale opacity-70 mix-blend-luminosity scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Diagnostic Metadata Base Logs (Bottom Left) */}
        <div className="absolute bottom-8 left-10 z-10 hidden sm:flex flex-col gap-2 font-mono tracking-widest text-[9.5px] uppercase text-zinc-500 leading-relaxed select-text" aria-label="Diagnostic Metadata">
          <span>COORDINATES // 48.8566 N, 2.3522 E</span>
          <span>NODE // EUR-PAR-NODE-01</span>
          <span>TIMESTAMP // {timestamp}</span>
          <span>BUILD VERSION // ALPHA-V16.2.10</span>
        </div>

        {/* Vector HUD targeting crosshair */}
        <div className="absolute z-10 pointer-events-none text-neutral-700 opacity-60">
          <div className="w-20 h-20 relative flex items-center justify-center">
            <div className="w-8 h-[1px] bg-current" />
            <div className="h-8 w-[1px] bg-current absolute" />
            <div className="w-12 h-12 rounded-full border border-current opacity-30 absolute" />
          </div>
        </div>

        {/* Core Branding Title */}
        <div className="relative z-10 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.45em] uppercase font-sans text-white select-none">
            U R A <span className="inline-block w-4 h-4 rounded-full bg-[#00d2ff] mx-1 align-baseline" /> S T R E E T
          </h2>
          <span className="block text-[8px] sm:text-[9.5px] uppercase tracking-[0.4em] text-neutral-400 mt-4 font-black font-display">
            HIGH-END TECHWEAR // R&D GATEWAY
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN (40% width on desktop) */}
      <div className="relative w-full lg:w-[40%] h-[65vh] lg:h-screen flex items-center justify-center p-6 bg-black overflow-hidden border-t lg:border-t-0 border-white/5" role="region" aria-label="Access Gate">
        
        {/* Subtle Mathematical Particle Canvas Engine (z-0) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
        />

        {/* Frosted Control Dock (z-10) */}
        <div className="w-full max-w-sm z-10 flex flex-col justify-between h-[96%] max-h-[580px]">
          
          {/* Top utility row */}
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-950/95 border border-white/10 rounded-t-[18px] backdrop-blur-3xl font-display z-10">
            <Link href="/" className="text-[9.5px] uppercase tracking-[0.25em] text-neutral-400 hover:text-white transition-all font-black" aria-label="Go back home">
              &lt; HOME
            </Link>
            <div className="flex items-center gap-2 text-[8.5px] uppercase tracking-widest font-black text-neutral-500">
              <Cpu className={`w-3.5 h-3.5 ${theme.colorClass} animate-pulse`} />
              <span>ACCESS PROTOCOL</span>
            </div>
          </div>

          {/* Frosted Secure Input Blocks Container */}
          <motion.div
            animate={{ borderColor: theme.hudColor }}
            className="border-x border-b bg-black/50 border border-white/10 backdrop-blur-3xl p-6 sm:p-8 relative flex flex-col justify-center"
          >
            {/* ACCESS TERMINAL TITLE HEADER */}
            <div className="mb-6 space-y-1">
              <h3 className="font-display text-base uppercase tracking-[0.18em] font-extrabold text-white">
                ACCESS TERMINAL
              </h3>
              <p className="text-[8.5px] uppercase tracking-wider text-zinc-500 font-mono">
                SECURE LUXURY OS AUTHENTICATION GATEWAY
              </p>
            </div>

            {/* Tab selector row */}
            <div className="flex bg-black/80 p-1 rounded-lg border border-white/5 mb-6 relative font-display">
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
                    className={`flex-1 py-2 text-[9px] uppercase tracking-[0.2em] font-black rounded transition-all duration-300 relative z-10 text-neutral-500 hover:text-white border-b-2 ${isActive ? theme.activeTabBorder : "border-transparent"}`}
                    aria-label={`Select ${r} role`}
                  >
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
                  className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded px-4 py-3.5 mb-5 overflow-hidden font-display"
                  role="alert"
                >
                  <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="text-[9px] uppercase tracking-widest font-black text-red-500">Security Alert</h4>
                    <p className="text-[8px] text-red-400 font-bold leading-normal uppercase tracking-wider">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email secure block */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[8.5px] uppercase tracking-[0.25em] font-black text-zinc-500 font-display">
                    [SECURE ID EMAIL]
                  </label>
                  <span className={`text-[7px] uppercase tracking-widest font-black px-2 py-0.5 border rounded font-display transition-colors duration-500 ${theme.badgeClass}`}>
                    {role} Mode
                  </span>
                </div>
                {/* Thin, Minimal Full Border with Custom Transition */}
                <div className={`relative border rounded bg-black/40 transition-all duration-300 ${theme.hoverBorderClass}`}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-transparent border-0 outline-none py-3.5 px-4 text-xs font-semibold font-mono text-white placeholder:text-neutral-700 focus:ring-0 focus:outline-none"
                    aria-label="Secure ID Email"
                    required
                  />
                </div>
              </div>

              {/* Password secure block */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-[8.5px] uppercase tracking-[0.25em] font-black text-zinc-500 font-display">
                    [DECRYPT ACCESS KEY]
                  </label>
                </div>
                {/* Thin, Minimal Full Border with Custom Transition */}
                <div className={`relative border rounded bg-black/40 transition-all duration-300 ${theme.hoverBorderClass}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-0 outline-none py-3.5 px-4 text-xs font-semibold font-mono text-white placeholder:text-neutral-700 focus:ring-0 focus:outline-none"
                    aria-label="Decrypt Access Key"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors z-10 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember device checkbox & Forgot Password link */}
              <div className="flex items-center justify-between text-[8px] font-mono tracking-widest uppercase text-zinc-400 select-none py-1">
                <label className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors font-mono">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className={`w-3.5 h-3.5 rounded bg-black border border-zinc-800 transition-colors focus:ring-0 cursor-pointer ${theme.checkboxAccent}`}
                    aria-label="Remember Device checkbox"
                  />
                  <span>REMEMBER DEVICE</span>
                </label>
                <a 
                  href="#" 
                  className="hover:text-white transition-colors font-mono"
                  aria-label="Forgot access credentials query link"
                >
                  FORGOT ACCESS KEY?
                </a>
              </div>

              {/* Dynamic Status bar */}
              <div className={`text-[7.5px] uppercase tracking-[0.15em] font-black border py-2 px-3 rounded text-center select-text transition-colors duration-500 ${
                envStatus.includes("ERROR") 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : "bg-black/60 border-neutral-900 text-neutral-500"
              }`}>
                {envStatus}
              </div>

              {/* INITIALIZE SESSION trigger button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-3 py-4 text-[9.5px] uppercase tracking-[0.25em] font-sans font-bold flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer ${theme.btnClass}`}
                aria-label="Initialize Session"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  "INITIALIZE SESSION"
                )}
              </button>
            </form>
          </motion.div>

          {/* Decrypt Terminal Logger */}
          <div className="h-28 w-full bg-zinc-950/90 border border-zinc-900 rounded-b-[18px] p-4 font-mono text-[9px] text-zinc-400 overflow-hidden flex flex-col gap-2 shadow-xl z-10">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/5 shrink-0 select-none">
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-black text-neutral-400 font-mono">
                <Monitor className="w-3 h-3 text-neutral-500" />
                <span>TERMINAL DECRYPT LOG</span>
              </div>
              <Wifi className="w-2.5 h-2.5 text-[#00d2ff] animate-pulse" />
            </div>

            {/* log streams */}
            <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-none select-text space-y-1 font-mono">
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex gap-2 items-start leading-normal text-zinc-400">
                  <span className="text-[#00d2ff] select-none">&gt;</span>
                  <span className="whitespace-normal break-all">{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Footer System Warning */}
      <div className="absolute bottom-4 right-6 text-right hidden sm:flex items-center justify-end gap-2 text-neutral-600 font-display z-10 pointer-events-none">
        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
        <p className="text-[7.5px] uppercase tracking-[0.25em] font-black">
          RESTRICTED PROTOCOLS ACTIVE // SECURE SYSTEM ONLY
        </p>
      </div>
    </div>
  );
}
