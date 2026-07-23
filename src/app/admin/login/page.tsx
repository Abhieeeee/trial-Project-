"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { getUserRole } from "@/app/actions/auth";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPOGRAPHY
   ───────────────────────────────────────────────────────────────────────────── */

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400"],
});

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
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

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────────────────────────────────────────────── */

const T = {
  void: "#050505",
  white: "#E8E4DF",
  accent: "#00D2FF",
  error: "#EF4444",
  roleStaff: "#E8E4DF",
  roleAdmin: "#00D2FF",
  roleSuper: "#EF4444",
} as const;

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Phase = "void" | "wave" | "beam" | "brand" | "ready" | "auth" | "success";

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
}

/* ─────────────────────────────────────────────────────────────────────────────
   INTERACTIVE 3D WAVE CANVAS
   ───────────────────────────────────────────────────────────────────────────── */

function useInteractiveWaveMesh(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  sparks: Spark[],
  setSparks: React.Dispatch<React.SetStateAction<Spark[]>>
) {
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const cols = 64;
    const rows = 32;
    const spacing = 26;
    const focalLength = 500;
    const cameraZ = 280;

    const render = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      time += 0.009;

      const points: { x: number; y: number; z: number; sx: number; sy: number; opacity: number }[] = [];
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // 1. Generate grid vertices with mouse displacement
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col - cols / 2) * spacing;
          const z = (row - rows / 2) * spacing + 80;

          // Natural undulating wave formula
          const w1 = Math.sin(col * 0.1 + time * 1.3) * 22;
          const w2 = Math.cos(row * 0.12 + time * 0.9) * 16;
          const w3 = Math.sin((col + row) * 0.06 + time * 0.5) * 10;
          let y = w1 + w2 + w3 - 50;

          // Projected baseline center coordinate
          const depth = z + cameraZ;
          const scale = focalLength / Math.max(1, depth);
          const sx = w / 2 + x * scale;
          const sy = h / 2 + y * scale;

          // Interactive cursor ripple displacement
          if (mouseRef.current.active) {
            const dx = sx - mx;
            const dy = sy - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              const force = (1 - dist / 180) * 48;
              y += Math.sin(dist * 0.06 - time * 6) * force;
            }
          }

          // Recalculate projecting points with displacement
          const finalSy = h / 2 + y * scale;

          const distFromCenter = Math.sqrt(
            Math.pow((col - cols / 2) / (cols / 2), 2) +
            Math.pow((row - rows / 2) / (rows / 2), 2)
          );
          const opacity = Math.max(0, 0.15 * (1 - distFromCenter * 0.8) * Math.min(1, scale));

          points.push({ x, y, z, sx, sy: finalSy, opacity });
        }
      }

      // 2. Draw connections — horizontal links
      ctx.lineWidth = 0.5;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 1; col++) {
          const i = row * cols + col;
          const j = i + 1;
          const p1 = points[i];
          const p2 = points[j];
          if (!p1 || !p2) continue;

          const avgOpacity = (p1.opacity + p2.opacity) / 2;
          if (avgOpacity < 0.01) continue;

          ctx.strokeStyle = `rgba(232, 228, 223, ${avgOpacity})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      }

      // 3. Draw connections — vertical links
      for (let row = 0; row < rows - 1; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col;
          const j = i + cols;
          const p1 = points[i];
          const p2 = points[j];
          if (!p1 || !p2) continue;

          const avgOpacity = (p1.opacity + p2.opacity) / 2;
          if (avgOpacity < 0.01) continue;

          ctx.strokeStyle = `rgba(232, 228, 223, ${avgOpacity * 0.55})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      }

      // 4. Update and Draw active spark particles from typing
      if (sparks.length > 0) {
        setSparks((prevSparks) =>
          prevSparks
            .map((s) => {
              const nextLife = s.life - 0.02;
              return {
                ...s,
                x: s.x + s.vx,
                y: s.y + s.vy,
                life: nextLife,
              };
            })
            .filter((s) => s.life > 0)
        );

        sparks.forEach((s) => {
          ctx.fillStyle = s.color;
          ctx.globalAlpha = s.life;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [canvasRef, sparks, setSparks]);
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAGNETIC SPRING PHYSICS EFFECT
   ───────────────────────────────────────────────────────────────────────────── */

function useMagnetic(ref: React.RefObject<HTMLButtonElement | null>, strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 140, damping: 14 });
  const springY = useSpring(y, { stiffness: 140, damping: 14 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      x.set(deltaX);
      y.set(deltaY);
    };

    const handleLeave = () => {
      x.set(0);
      y.set(0);
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, strength, x, y]);

  return { x: springX, y: springY };
}

/* ─────────────────────────────────────────────────────────────────────────────
   LUMINOUS TRACE INPUT FIELD
   ───────────────────────────────────────────────────────────────────────────── */

function LuminousInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  label,
  autoComplete,
  ariaLabel,
  endAdornment,
  onTypeAction,
}: {
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  autoComplete: string;
  ariaLabel: string;
  endAdornment?: React.ReactNode;
  onTypeAction?: (e: React.KeyboardEvent) => void;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative w-full mb-8 font-sans">
      {/* Dynamic Floating Label */}
      <motion.label
        htmlFor={id}
        className="absolute pointer-events-none font-body uppercase select-none"
        style={{
          left: 0,
          letterSpacing: "0.25em",
          color: focused ? `${T.white}A6` : `${T.white}4D`,
          transformOrigin: "left center",
        }}
        animate={{
          top: focused || hasValue ? "-10px" : "8px",
          fontSize: focused || hasValue ? "8px" : "12px",
          letterSpacing: focused || hasValue ? "0.3em" : "0.15em",
        }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        {label}
      </motion.label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onTypeAction}
        placeholder={focused ? placeholder : ""}
        required
        autoComplete={autoComplete}
        className="w-full bg-transparent border-none outline-none focus-visible:outline-none font-body tracking-wider"
        style={{
          fontSize: "14px",
          fontWeight: 300,
          color: T.white,
          padding: "10px 0",
          paddingRight: endAdornment ? "40px" : "0",
          caretColor: T.accent,
        }}
        aria-label={ariaLabel}
      />

      {endAdornment && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          {endAdornment}
        </div>
      )}

      {/* Underline base structure */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "1px", backgroundColor: `${T.white}1A` }}
      />

      {/* Luminous laser animation path */}
      <motion.div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "1px", transformOrigin: "center", backgroundColor: T.accent }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      />

      {/* Light glow reflection */}
      <motion.div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ height: "1px" }}
        animate={{
          boxShadow: focused ? `0 0 16px 2.5px ${T.accent}40` : "0 0 0 0 transparent",
        }}
        transition={{ duration: 0.45, ease: EASE }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HOLOGRAPHIC SYSTEM BOOT SEQUENCE LOADER
   ───────────────────────────────────────────────────────────────────────────── */

function BootLoader({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);
  const [bootStep, setBootStep] = useState("LOCATING ENCRYPTED GATEWAY...");

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        
        // Random incremental hops
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = Math.min(100, prev + increment);

        // Update technical loader logging labels
        if (next > 80) setBootStep("ESTABLISHING HANDSHAKE LINK...");
        else if (next > 55) setBootStep("ALLOCATING SYSTEM CORE ADDRESS...");
        else if (next > 30) setBootStep("DECRYPTING INTERFACE GEOMETRY...");
        
        return next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 bg-[#050505] flex flex-col items-center justify-center z-50 p-6 font-mono">
      <div className="w-full max-w-[340px] flex flex-col items-start gap-4">
        
        {/* Core wordmark flash */}
        <h2 className="text-[10px] tracking-[0.45em] text-white/40 uppercase mb-2 select-none">
          AURA.STREET // R&D DIVISION
        </h2>

        {/* Binary code simulator streams */}
        <div className="w-full bg-white/[0.02] border border-white/5 p-4 rounded text-[9px] text-[#00D2FF]/60 flex flex-col gap-1 select-none">
          <div>&gt; SECURE ACCESS AUTHENTICATION INITIATING</div>
          <div>&gt; CORE.ADDR: 0x5F39A1C // COORDS: 48.8566 N, 2.3522 E</div>
          <div>&gt; SHIELD_LOCK: SHA-256 ACTIVE</div>
          <div className="text-white/30">&gt; STATUS: {bootStep}</div>
        </div>

        {/* Progress bar details */}
        <div className="w-full flex justify-between items-center text-[10px] tracking-wider text-white/50">
          <span>INITIALIZING</span>
          <span>{percent}%</span>
        </div>

        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#00D2FF]"
            style={{ width: `${percent}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GEOMETRIC AUDIO-VISUAL AUDIO WAVE INDICATOR
   ───────────────────────────────────────────────────────────────────────────── */

function VisualizerPulse() {
  return (
    <div className="flex items-center gap-1" style={{ height: "12px" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          style={{
            width: "2px",
            backgroundColor: T.accent,
            borderRadius: "0.5px",
          }}
          animate={{
            height: ["3px", "12px", "3px"],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.08,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   THE VESTIBULE
   ───────────────────────────────────────────────────────────────────────────── */

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();

  // Loader & Page state
  const [booting, setBooting] = useState(true);
  const [phase, setPhase] = useState<Phase>("void");
  const [formOpen, setFormOpen] = useState(false);

  // Form parameters
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // System states
  const [statusText, setStatusText] = useState("SYSTEM READY");
  const [authRole, setAuthRole] = useState<string | null>(null);

  // Sparks and particle interaction states
  const [sparks, setSparks] = useState<Spark[]>([]);

  // DOM references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const magnetic = useMagnetic(enterBtnRef, 0.28);

  const [prefersReduced, setPrefersReduced] = useState(false);

  // Wireframe canvas initialization
  useInteractiveWaveMesh(canvasRef, sparks, setSparks);

  // Automatic login redirect if user is already authenticated
  useEffect(() => {
    async function checkActiveSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setStatusText("ACTIVE SESSION DETECTED");
          let role = "user";
          if (user.email === "super@aurastreet.com") {
            role = "super_admin";
          } else if (user.email === "admin@aurastreet.com") {
            role = "admin";
          } else if (user.email === "staff@aurastreet.com") {
            role = "staff";
          } else {
            try {
              const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();
              if (profile?.role) role = profile.role;
              else role = await getUserRole(user.id);
            } catch {
              role = await getUserRole(user.id);
            }
          }
          setAuthRole(role);
          setPhase("success");
          if (role === "super_admin") window.location.href = "/super-admin/dashboard";
          else if (role === "admin") window.location.href = "/admin/dashboard";
          else if (role === "staff") window.location.href = "/admin/orders";
          else window.location.href = "/user-dashboard";
        }
      } catch (e) {
        console.error("Session check error:", e);
      }
    }
    checkActiveSession();
  }, [supabase, router]);

  /* ── Typing feedback spark generator ── */
  const generateSparks = (e: React.KeyboardEvent) => {
    // Avoid generating sparks on system keys
    if (["Shift", "Control", "Alt", "Tab", "Meta", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      return;
    }

    const count = Math.floor(Math.random() * 3) + 2;
    const newSparks: Spark[] = [];

    // Get focused input coordinates to eject sparks
    const activeEl = document.activeElement;
    if (activeEl) {
      const rect = activeEl.getBoundingClientRect();
      const originX = rect.left + rect.width / 2 + (Math.random() - 0.5) * 40;
      const originY = rect.bottom;

      for (let i = 0; i < count; i++) {
        newSparks.push({
          id: Date.now() + Math.random(),
          x: originX,
          y: originY,
          size: Math.random() * 1.5 + 0.8,
          vx: (Math.random() - 0.5) * 3,
          vy: -(Math.random() * 2 + 1), // floating upwards
          color: `rgba(0, 210, 255, ${Math.random() * 0.8 + 0.2})`, // Sky-blue sparks
          life: 1.0,
        });
      }
    }

    setSparks((prev) => [...prev, ...newSparks]);
  };

  /* ── Boot completed sequence ── */
  const handleBootComplete = () => {
    setBooting(false);
    setPhase("wave");

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    if (mq.matches) {
      setPhase("ready");
      return;
    }

    // Choreographed entrance timing
    setTimeout(() => setPhase("beam"), 400);
    setTimeout(() => setPhase("brand"), 1200);
    setTimeout(() => setPhase("ready"), 2400);
  };

  const phaseReached = useCallback(
    (target: Phase): boolean => {
      const order: Phase[] = ["void", "wave", "beam", "brand", "ready", "auth", "success"];
      return order.indexOf(phase) >= order.indexOf(target);
    },
    [phase]
  );

  const handleIdentify = () => {
    setFormOpen(true);
    setPhase("auth");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setStatusText("CONNECTING GOOGLE OAUTH");

    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setStatusText("SYSTEM READY");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || "Google sign in error");
      setStatusText("SYSTEM READY");
      setLoading(false);
    }
  };

  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (error) setError(null);
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (error) setError(null);
  };

  /* ── Credentials submission ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setStatusText("DECRYPTING ACCESS KEY");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setStatusText("SYSTEM READY");
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Invalid secure payload credentials.");
        setStatusText("SYSTEM READY");
        setLoading(false);
        return;
      }

      setStatusText("ACCESS APPROVED");

      let role = "user";
      if (data.user.email === "super@aurastreet.com") {
        role = "super_admin";
      } else if (data.user.email === "admin@aurastreet.com") {
        role = "admin";
      } else if (data.user.email === "staff@aurastreet.com") {
        role = "staff";
      } else {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();
          if (profile?.role) {
            role = profile.role;
          } else {
            role = await getUserRole(data.user.id);
          }
        } catch {
          role = await getUserRole(data.user.id);
        }
      }

      setAuthRole(role);
      setPhase("success");

      setTimeout(() => setStatusText("LAUNCHING ENVIRONMENT"), 250);

      setTimeout(() => {
        if (role === "super_admin") window.location.href = "/super-admin/dashboard";
        else if (role === "admin") window.location.href = "/admin/dashboard";
        else if (role === "staff") window.location.href = "/admin/orders";
        else window.location.href = "/user-dashboard";
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Handshake exception.";
      setError(message);
      setStatusText("SYSTEM READY");
      setLoading(false);
    }
  };

  const getRoleColor = (): string => {
    if (authRole === "super_admin") return T.roleSuper;
    if (authRole === "admin") return T.roleAdmin;
    return T.roleStaff;
  };

  const wordmark = "AURA.STREET";

  return (
    <main
      className={`min-h-screen w-full relative flex items-center justify-center overflow-hidden select-none ${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      style={{ backgroundColor: T.void }}
    >
      {/* 1. Cinematic Holographic Boot Loader */}
      <AnimatePresence>
        {booting && (
          <motion.div
            className="absolute inset-0 z-50"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <BootLoader onComplete={handleBootComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Interactive 3D Wave Mesh Canvas background */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phaseReached("wave") ? 1 : 0 }}
        transition={{ duration: 1.5, ease: EASE }}
      />

      {/* 3. Deep studio vignette shadow backplate */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `radial-gradient(ellipse 70% 65% at 50% 50%, transparent 10%, ${T.void} 100%)`,
        }}
      />

      {/* 4. Vertical volumetric scanner light beam */}
      <AnimatePresence>
        {phase === "beam" && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: "15%",
              width: "1.5px",
              height: "70%",
              transform: "translateX(-50%)",
              background: `linear-gradient(to bottom, transparent, ${T.white}50, ${T.accent}30, ${T.white}50, transparent)`,
              zIndex: 2,
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        )}
      </AnimatePresence>

      {/* 5. Structural Corner Alignment Frame indicators */}
      {phaseReached("brand") && (
        <div className="absolute inset-0 pointer-events-none p-[5%] z-5 select-none opacity-20">
          <div className="w-full h-full relative">
            {/* Top-left */}
            <motion.div
              className="absolute top-0 left-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div style={{ width: "24px", height: "1px", backgroundColor: T.white }} />
              <div style={{ width: "1px", height: "24px", backgroundColor: T.white }} />
            </motion.div>
            {/* Top-right */}
            <motion.div
              className="absolute top-0 right-0 flex flex-col items-end"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div style={{ width: "24px", height: "1px", backgroundColor: T.white }} />
              <div style={{ width: "1px", height: "24px", backgroundColor: T.white }} />
            </motion.div>
            {/* Bottom-left */}
            <motion.div
              className="absolute bottom-0 left-0"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div style={{ width: "1px", height: "24px", backgroundColor: T.white }} />
              <div style={{ width: "24px", height: "1px", backgroundColor: T.white }} />
            </motion.div>
            {/* Bottom-right */}
            <motion.div
              className="absolute bottom-0 right-0 flex flex-col items-end"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div style={{ width: "1px", height: "24px", backgroundColor: T.white }} />
              <div style={{ width: "24px", height: "1px", backgroundColor: T.white }} />
            </motion.div>
          </div>
        </div>
      )}

      {/* 6. Base metadata diagnostic rows */}
      {phaseReached("ready") && (
        <motion.div
          className="absolute flex justify-between items-end font-mono"
          style={{
            bottom: "4%",
            left: "6%",
            right: "6%",
            zIndex: 5,
            fontSize: "8px",
            letterSpacing: "0.25em",
            color: `${T.white}20`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span>SYSTEM GATEWAY // PRIVATE R&D CONNECT</span>
          <span>BUILD // V4.2.0</span>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
         COMPOSITION — Optical placement center
         ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="vestibule-composition relative flex flex-col items-center w-full px-8 sm:px-6 z-10"
        style={{ maxWidth: "440px" }}
        animate={phase === "success" ? { scale: 1.03 } : { scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* wordmark branding title */}
        {phaseReached("brand") && (
          <motion.div className="text-center mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1
              className="font-display font-bold uppercase flex justify-center items-center"
              style={{
                fontSize: "clamp(1.6rem, 4.5vw, 2.2rem)",
                letterSpacing: "0.45em",
                color: T.white,
                lineHeight: 1.25,
              }}
            >
              {wordmark.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: prefersReduced ? 0 : 0.04 * i,
                    duration: 0.7,
                    ease: EASE,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </motion.div>
        )}

        {/* Subtitle tag */}
        {phaseReached("brand") && (
          <motion.p
            className="font-body uppercase text-center"
            style={{
              fontSize: "8.5px",
              letterSpacing: "0.4em",
              color: `${T.white}33`,
              marginBottom: "36px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReduced ? 0 : 0.5, duration: 0.7, ease: EASE }}
          >
            SECURE ACCESS SYSTEM
          </motion.p>
        )}

        {/* Centered architectural line aperture */}
        {phaseReached("brand") && (
          <div className="flex justify-center w-full" style={{ marginBottom: "36px" }}>
            <motion.div
              style={{
                height: "1px",
                width: "100%",
                maxWidth: "280px",
                background: phase === "success"
                  ? `linear-gradient(90deg, transparent, ${getRoleColor()}, transparent)`
                  : `linear-gradient(90deg, transparent, ${T.white}20, transparent)`,
                boxShadow: phase === "success" ? `0 0 25px ${getRoleColor()}40` : "none",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: prefersReduced ? 0 : 1, ease: EASE }}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
           FUTURISTIC LOGIN FORM CONTAINER
           ═══════════════════════════════════════════════════════════════════ */}
        <div className="w-full flex flex-col items-center" style={{ maxWidth: "380px" }}>
          <AnimatePresence mode="wait">

            {/* IDENTIFY Invitation state — Geometric pulse button */}
            {phaseReached("ready") && !formOpen && phase !== "success" && (
              <motion.button
                key="identify-btn"
                onClick={handleIdentify}
                className="font-body uppercase cursor-pointer bg-transparent outline-none focus-visible:outline-1 focus-visible:outline-offset-4 relative overflow-hidden group"
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.35em",
                  color: `${T.white}60`,
                  padding: "18px 48px",
                  border: `1px solid ${T.white}08`,
                  background: `linear-gradient(135deg, ${T.white}03, transparent)`,
                  backdropFilter: "blur(8px)",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: EASE }}
                whileHover={{
                  color: T.white,
                  borderColor: `${T.accent}40`,
                  boxShadow: `0 0 30px ${T.accent}10, inset 0 0 30px ${T.accent}05`,
                }}
              >
                {/* Sweeping light trace */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${T.accent}08 50%, transparent 100%)`,
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
                />
                {/* Corner tick marks */}
                <div className="absolute top-0 left-0 w-3 h-[1px] opacity-20" style={{ backgroundColor: T.accent }} />
                <div className="absolute top-0 left-0 w-[1px] h-3 opacity-20" style={{ backgroundColor: T.accent }} />
                <div className="absolute bottom-0 right-0 w-3 h-[1px] opacity-20" style={{ backgroundColor: T.accent }} />
                <div className="absolute bottom-0 right-0 w-[1px] h-3 opacity-20" style={{ backgroundColor: T.accent }} />
                <span className="relative z-10">IDENTIFY</span>
              </motion.button>
            )}

            {/* ─── The Authentication Console ─── */}
            {formOpen && (
              <motion.form
                key="auth-form"
                onSubmit={handleLogin}
                className="w-full relative"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: EASE }}
                noValidate
              >
                {/* ── Glassmorphic Panel Shell ── */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    padding: "1px",
                    background: `linear-gradient(160deg, ${T.accent}25, ${T.white}08, ${T.accent}12, transparent, ${T.white}05)`,
                    borderRadius: "2px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: `${T.void}F2`,
                      backdropFilter: "blur(40px) saturate(1.5)",
                      borderRadius: "1px",
                      padding: "36px 32px 32px",
                    }}
                  >
                    {/* Horizontal scanner line sweep */}
                    <motion.div
                      className="absolute left-0 right-0 pointer-events-none"
                      style={{
                        height: "1px",
                        background: `linear-gradient(90deg, transparent 5%, ${T.accent}30 40%, ${T.accent}60 50%, ${T.accent}30 60%, transparent 95%)`,
                        zIndex: 2,
                      }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />

                    {/* ── Form header row ── */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p
                          className="font-mono uppercase select-none"
                          style={{ fontSize: "7px", letterSpacing: "0.35em", color: `${T.accent}80` }}
                        >
                          ENCRYPTED CHANNEL
                        </p>
                        <p
                          className="font-display uppercase select-none mt-1"
                          style={{ fontSize: "13px", letterSpacing: "0.35em", color: `${T.white}90`, fontWeight: 700 }}
                        >
                          AUTHENTICATE
                        </p>
                      </div>

                      {/* Live connection dot */}
                      <div className="flex items-center gap-2">
                        <motion.div
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            backgroundColor:
                              statusText === "SYSTEM READY"
                                ? `${T.accent}50`
                                : statusText === "ACCESS APPROVED"
                                ? "#22c55e"
                                : T.accent,
                            boxShadow:
                              statusText === "SYSTEM READY"
                                ? `0 0 6px ${T.accent}30`
                                : statusText === "ACCESS APPROVED"
                                ? "0 0 8px #22c55e60"
                                : `0 0 8px ${T.accent}50`,
                          }}
                          animate={
                            statusText !== "SYSTEM READY"
                              ? { opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }
                              : { opacity: [0.5, 1, 0.5] }
                          }
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <p
                          className="font-mono uppercase"
                          style={{ fontSize: "7px", letterSpacing: "0.2em", color: `${T.white}25` }}
                          aria-live="polite"
                        >
                          {statusText}
                        </p>
                      </div>
                    </div>

                    {/* ── Accent border strip ── */}
                    <div
                      className="w-full mb-8"
                      style={{
                        height: "1px",
                        background: `linear-gradient(90deg, ${T.accent}30, ${T.white}08, transparent)`,
                      }}
                    />

                    {/* ── Email field ── */}
                    <div className="relative mb-7">
                      <div
                        className="absolute left-0 top-0 bottom-0"
                        style={{
                          width: "2px",
                          background: email.length > 0 ? T.accent : `${T.white}10`,
                          boxShadow: email.length > 0 ? `0 0 8px ${T.accent}40` : "none",
                          transition: "all 0.3s ease",
                        }}
                      />
                      <div className="pl-4">
                        <label
                          htmlFor="vestibule-email"
                          className="font-mono uppercase block select-none"
                          style={{ fontSize: "7px", letterSpacing: "0.35em", color: `${T.white}35`, marginBottom: "6px" }}
                        >
                          SECURE IDENTITY
                        </label>
                        <input
                          id="vestibule-email"
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(e.target.value)}
                          onKeyDown={generateSparks}
                          placeholder="operator@aurastreet.com"
                          required
                          autoComplete="email"
                          aria-label="Email address"
                          className="w-full bg-transparent border-none outline-none font-body tracking-wider"
                          style={{
                            fontSize: "13px",
                            fontWeight: 300,
                            color: T.white,
                            padding: "4px 0",
                            caretColor: T.accent,
                          }}
                        />
                      </div>
                    </div>

                    {/* ── Password field ── */}
                    <div className="relative mb-7">
                      <div
                        className="absolute left-0 top-0 bottom-0"
                        style={{
                          width: "2px",
                          background: password.length > 0 ? T.accent : `${T.white}10`,
                          boxShadow: password.length > 0 ? `0 0 8px ${T.accent}40` : "none",
                          transition: "all 0.3s ease",
                        }}
                      />
                      <div className="pl-4 relative">
                        <label
                          htmlFor="vestibule-key"
                          className="font-mono uppercase block select-none"
                          style={{ fontSize: "7px", letterSpacing: "0.35em", color: `${T.white}35`, marginBottom: "6px" }}
                        >
                          ACCESS KEY
                        </label>
                        <input
                          id="vestibule-key"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          onKeyDown={generateSparks}
                          placeholder="••••••••••"
                          required
                          autoComplete="current-password"
                          aria-label="Password"
                          className="w-full bg-transparent border-none outline-none font-body tracking-wider pr-10"
                          style={{
                            fontSize: "13px",
                            fontWeight: 300,
                            color: T.white,
                            padding: "4px 0",
                            caretColor: T.accent,
                          }}
                        />
                        {/* Eye toggle */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer outline-none"
                          style={{ color: `${T.white}20`, transition: "color 200ms", padding: "6px" }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = `${T.accent}90`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = `${T.white}20`; }}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff style={{ width: 13, height: 13 }} /> : <Eye style={{ width: 13, height: 13 }} />}
                        </button>
                      </div>
                    </div>

                    {/* ── Error display ── */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="flex items-center gap-2 mb-5 pl-4"
                          style={{
                            color: `${T.error}CC`,
                            borderLeft: `2px solid ${T.error}60`,
                            padding: "8px 0 8px 12px",
                          }}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          role="alert"
                          aria-live="assertive"
                        >
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <p className="font-body text-[10px] tracking-wide">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Biometric Submit Trigger ── */}
                    <motion.button
                      ref={enterBtnRef}
                      type="submit"
                      disabled={loading}
                      className="relative w-full font-body uppercase cursor-pointer outline-none focus-visible:outline-1 focus-visible:outline-offset-4 disabled:cursor-wait overflow-hidden group"
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.35em",
                        color: loading ? T.accent : T.void,
                        backgroundColor: loading ? "transparent" : T.white,
                        padding: "16px 0",
                        border: loading ? `1px solid ${T.accent}40` : "1px solid transparent",
                        borderRadius: "1px",
                        x: magnetic.x,
                        y: magnetic.y,
                        transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
                      }}
                      whileHover={
                        !loading
                          ? {
                              boxShadow: `0 0 30px ${T.accent}15, inset 0 0 20px ${T.accent}05`,
                            }
                          : undefined
                      }
                      whileTap={!loading ? { scale: 0.985 } : undefined}
                      transition={{ duration: 0.2, ease: EASE }}
                      aria-label={loading ? "Verifying payload" : "Enter"}
                    >
                      {/* Sweeping highlight */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: loading
                            ? `linear-gradient(90deg, transparent 0%, ${T.accent}10 50%, transparent 100%)`
                            : `linear-gradient(90deg, transparent 0%, ${T.white}10 50%, transparent 100%)`,
                        }}
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <VisualizerPulse />
                            <span>DECRYPTING</span>
                          </>
                        ) : (
                          <>
                            <span>AUTHORIZE</span>
                            <motion.span
                              style={{ display: "inline-block" }}
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                              →
                            </motion.span>
                          </>
                        )}
                      </span>
                    </motion.button>

                    {/* ── Google OAuth Sign-in Trigger ── */}
                    <div className="mt-4 pt-4 border-t border-white/10 text-center font-mono">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-white/5 border border-white/10 hover:border-[#00D2FF] text-white text-[9px] uppercase tracking-[0.25em] font-bold rounded flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:bg-white/10"
                      >
                        <GoogleIcon className="w-4 h-4" />
                        <span>Continue with Google Account</span>
                      </button>
                    </div>

                    {/* ── Bottom metadata row ── */}
                    <div
                      className="flex items-center justify-between mt-6 pt-5 select-none"
                      style={{ borderTop: `1px solid ${T.white}06` }}
                    >
                      <p
                        className="font-mono uppercase"
                        style={{ fontSize: "7px", letterSpacing: "0.25em", color: `${T.white}18` }}
                      >
                        SHA-256 // TLS 1.3
                      </p>
                      <p
                        className="font-mono uppercase"
                        style={{ fontSize: "7px", letterSpacing: "0.25em", color: `${T.white}18` }}
                      >
                        SESSION ENCRYPTED
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── External decorative corner brackets ── */}
                <div className="absolute -top-1 -left-1 pointer-events-none opacity-25">
                  <div style={{ width: "8px", height: "1px", backgroundColor: T.accent }} />
                  <div style={{ width: "1px", height: "8px", backgroundColor: T.accent }} />
                </div>
                <div className="absolute -top-1 -right-1 pointer-events-none opacity-25 flex flex-col items-end">
                  <div style={{ width: "8px", height: "1px", backgroundColor: T.accent }} />
                  <div style={{ width: "1px", height: "8px", backgroundColor: T.accent }} />
                </div>
                <div className="absolute -bottom-1 -left-1 pointer-events-none opacity-25">
                  <div style={{ width: "1px", height: "8px", backgroundColor: T.accent }} />
                  <div style={{ width: "8px", height: "1px", backgroundColor: T.accent }} />
                </div>
                <div className="absolute -bottom-1 -right-1 pointer-events-none opacity-25 flex flex-col items-end">
                  <div style={{ width: "1px", height: "8px", backgroundColor: T.accent }} />
                  <div style={{ width: "8px", height: "1px", backgroundColor: T.accent }} />
                </div>

              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Global CSS settings */}
      <GlobalStyles />
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES — Plain CSS Injection to bypass Turbopack interpolation limits
   ───────────────────────────────────────────────────────────────────────────── */

function GlobalStyles() {
  useEffect(() => {
    const id = "vestibule-enhanced-styles";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      input::placeholder {
        color: #E8E4DF20 !important;
        opacity: 1;
      }
      .font-display {
        font-family: var(--font-display), monospace;
      }
      .font-body {
        font-family: var(--font-body), 'Inter', sans-serif;
      }
      .font-mono {
        font-family: var(--font-mono), monospace;
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      *:focus-visible {
        outline-color: #E8E4DF20;
      }
      @media (max-width: 767px) {
        .vestibule-composition {
          padding-top: 24vh !important;
        }
      }
      @media (max-width: 767px) and (orientation: landscape) {
        .vestibule-composition {
          padding-top: 12vh !important;
        }
      }
      @media (min-width: 768px) and (max-width: 1023px) {
        .vestibule-composition {
          padding-top: 32vh !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return null;
}
