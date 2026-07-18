"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { getUserRole } from "@/app/actions/auth";
import Link from "next/link";

// ── Orbitron exclusively for wordmark "AURA.STREET" ────────────────────────────────
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["700"],
});

// ── General Sans / Inter fallback for forms, labels, buttons ───────────────────────────
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
});

// ── JetBrains Mono for status strip ────────────────────────────────
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("super@aurastreet.com");
  const [password, setPassword] = useState("SuperAdminSecure123!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Status states: "SYSTEM READY" → "VERIFYING CREDENTIALS…" → "ROLE DETECTED" → "REDIRECTING…"
  const [statusText, setStatusText] = useState("SYSTEM READY");
  
  // Successful auth flash color tracker: null -> "staff" | "admin" | "super_admin"
  const [authRole, setAuthRole] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // requestAnimationFrame Canvas loop (Slow rotating 3D low-poly wireframe garment outline)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 800);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // 3D Silhouette Vertices (Minimal hoodie outline)
    const vertices = [
      // Torso / Shoulders
      { x: -60, y: -50, z: -25 }, // 0: Left shoulder front
      { x: 60, y: -50, z: -25 },  // 1: Right shoulder front
      { x: -60, y: -50, z: 25 },   // 2: Left shoulder back
      { x: 60, y: -50, z: 25 },    // 3: Right shoulder back
      { x: -45, y: 70, z: -20 },  // 4: Left waist front
      { x: 45, y: 70, z: -20 },   // 5: Right waist front
      { x: -45, y: 70, z: 20 },   // 6: Left waist back
      { x: 45, y: 70, z: 20 },    // 7: Right waist back

      // Collar
      { x: -22, y: -62, z: -12 }, // 8: Left collar front
      { x: 22, y: -62, z: -12 },  // 9: Right collar front
      { x: -22, y: -62, z: 12 },  // 10: Left collar back
      { x: 22, y: -62, z: 12 },   // 11: Right collar back

      // Hood
      { x: -26, y: -95, z: 2 },   // 12: Left hood top
      { x: 26, y: -95, z: 2 },    // 13: Right hood top
      { x: 0, y: -105, z: 18 },   // 14: Hood tip back

      // Left sleeve
      { x: -105, y: 5, z: -12 },  // 15: Left elbow front
      { x: -105, y: 5, z: 12 },   // 16: Left elbow back
      { x: -125, y: 55, z: -8 },  // 17: Left wrist front
      { x: -125, y: 55, z: 8 },   // 18: Left wrist back

      // Right sleeve
      { x: 105, y: 5, z: -12 },   // 19: Right elbow front
      { x: 105, y: 5, z: 12 },    // 20: Right elbow back
      { x: 125, y: 55, z: -8 },   // 21: Right wrist front
      { x: 125, y: 55, z: 8 },    // 22: Right wrist back
    ];

    // Edges linking coordinates to define low-poly garment form
    const edges = [
      // Torso outer loops
      [0, 1], [1, 3], [3, 2], [2, 0],
      [4, 5], [5, 7], [7, 6], [6, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],

      // Collar / Neck loops
      [8, 9], [9, 11], [11, 10], [10, 8],
      [8, 0], [9, 1], [10, 2], [11, 3],

      // Hood architecture
      [12, 13], [12, 8], [13, 9], [12, 14], [13, 14], [14, 10], [14, 11],

      // Left arm structures
      [0, 15], [2, 16], [15, 16],
      [15, 17], [16, 18], [17, 18],

      // Right arm structures
      [1, 19], [3, 20], [19, 20],
      [19, 21], [20, 22], [21, 22],
    ];

    const focalLength = 380;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate Y continuous logic ~40s per revolution
      angle += 0.003; 

      const cosY = Math.cos(angle);
      const sinY = Math.sin(angle);

      // Detect mobile breakpoints to lower opacity automatically
      const isMobile = window.innerWidth < 768;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.0;
      if (isMobile) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      }

      const projectedPoints: { x: number; y: number }[] = [];

      // Project vertices to 2D
      for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];
        
        // Y rotate transformations
        const xRot = v.x * cosY - v.z * sinY;
        const zRot = v.x * sinY + v.z * cosY;

        // Apply depth values
        const scale = focalLength / (zRot + 300);
        const x2d = width / 2 + xRot * scale;
        const y2d = height / 2 + v.y * scale;

        projectedPoints.push({ x: x2d, y: y2d });
      }

      // Draw wireframe edges
      for (let i = 0; i < edges.length; i++) {
        const p1 = projectedPoints[edges[i][0]];
        const p2 = projectedPoints[edges[i][1]];

        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusText("VERIFYING CREDENTIALS…");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(authError.message);
        setStatusText("SYSTEM READY");
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Authentication failed. Please try again.");
        setStatusText("SYSTEM READY");
        setLoading(false);
        return;
      }

      setStatusText("ROLE DETECTED");
      const userRole = await getUserRole(data.user.id);
      
      // staff -> white, admin -> sky blue, super_admin -> crimson
      setAuthRole(userRole);

      setStatusText("REDIRECTING…");
      
      // Delay redirect slightly for 300ms color flash animation to display cleanly
      setTimeout(() => {
        if (userRole === "super_admin") {
          router.push("/super-admin/dashboard");
        } else if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user-dashboard");
        }
      }, 500);
    } catch (err: any) {
      setError(err?.message || "A network error occurred.");
      setStatusText("SYSTEM READY");
      setLoading(false);
    }
  };

  const getSuccessBorderColor = () => {
    if (authRole === "super_admin") return "border-[#ef4444] shadow-[0_0_25px_rgba(239,68,68,0.25)]";
    if (authRole === "admin") return "border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.25)]";
    if (authRole === "staff" || authRole === "user") return "border-white shadow-[0_0_25px_rgba(255,255,255,0.25)]";
    return "border-white/10";
  };

  const getSuccessBtnColor = () => {
    if (authRole === "super_admin") return "bg-[#ef4444] text-white border-[#ef4444]";
    if (authRole === "admin") return "bg-[#00d2ff] text-black border-[#00d2ff]";
    if (authRole === "staff" || authRole === "user") return "bg-white text-black border-white";
    return "bg-white text-black hover:bg-transparent hover:border-white hover:text-white border-transparent";
  };

  return (
    <div className={`min-h-screen w-full relative flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden select-none ${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
      
      {/* Repeating Animated scanlines drift overlay (CSS漂移动画) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] scanline-overlay" />

      {/* Y-axis rotating wireframe silhouette canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 scale-90 sm:scale-100"
      />

      {/* Centered glass access module */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`w-full max-w-[420px] bg-black/40 border backdrop-blur-2xl rounded-lg px-8 sm:px-10 py-12 z-10 transition-all duration-300 mx-4 ${getSuccessBorderColor()}`}
      >
        {/* Core Wordmark "AURA.STREET" */}
        <div className="text-center mb-10 select-none">
          <h1 className="font-orbitron text-2xl sm:text-3xl font-bold tracking-[0.4em] uppercase text-white">
            AURA.STREET
          </h1>
        </div>

        {/* Error alert row */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 p-3 text-xs tracking-wider uppercase font-mono flex items-center gap-2"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Access Form */}
        <form onSubmit={handleLogin} className="space-y-7">
          
          {/* Email input - Underline-only */}
          <div className="space-y-1.5">
            <label className="block text-[8px] uppercase tracking-[0.2em] text-white/50 font-mono">
              [SECURE ID EMAIL]
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-transparent border-b border-white/20 focus:border-white transition-colors duration-200 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:outline-none font-mono"
              aria-label="Email address"
              required
            />
          </div>

          {/* Password input - Underline-only */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <label className="block text-[8px] uppercase tracking-[0.2em] text-white/50 font-mono">
                [DECRYPT ACCESS KEY]
              </label>
              <Link 
                href="#"
                className="text-[7.5px] text-white/30 hover:text-white uppercase tracking-[0.15em] transition-colors font-mono"
                aria-label="Reset access keys Link"
              >
                FORGOT?
              </Link>
            </div>
            <div className="relative border-b border-white/20 focus-within:border-white transition-colors duration-200">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-none py-2.5 pr-8 text-xs text-white placeholder:text-white/20 outline-none focus:outline-none font-mono"
                aria-label="Decrypt Access Key"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Trigger Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-[10px] uppercase font-sans font-bold tracking-wider transition-all duration-300 border select-none cursor-pointer ${getSuccessBtnColor()}`}
            aria-label="Enter drop portal"
          >
            {loading ? "INITIALIZING..." : "ENTER"}
          </button>

          {/* Collapsed single-line status strip */}
          <div className="text-center pt-2 select-none">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40">
              {statusText}
            </span>
          </div>

        </form>
      </motion.div>

      {/* Global CSS Styles for repeating animated scanlines drift */}
      <style jsx global>{`
        @keyframes scanline-drift {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 0 -100px;
          }
        }
        .scanline-overlay {
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 3px,
            rgba(255, 255, 255, 0.04) 3px,
            rgba(255, 255, 255, 0.04) 6px
          );
          background-size: 100% 100px;
          animation: scanline-drift 20s linear infinite;
        }
      `}</style>

      {/* Compact Alert Icon wrapper import helper */}
      <div className="hidden">
        <AlertCircle className="w-1 h-1" />
      </div>
    </div>
  );
}
