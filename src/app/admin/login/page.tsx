"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { getUserRole } from "@/app/actions/auth";

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPOGRAPHY
   ═══════════════════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════════════════
   PHASES
   ═══════════════════════════════════════════════════════════════════════════════ */

type Phase = "void" | "wave" | "beam" | "brand" | "ready" | "auth" | "success";

/* ═══════════════════════════════════════════════════════════════════════════════
   3D WAVE MESH — Mathematical silk fabric
   ═══════════════════════════════════════════════════════════════════════════════ */

function useWaveMesh(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
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

    // Mesh configuration
    const cols = 60;
    const rows = 30;
    const spacing = 28;
    const focalLength = 600;
    const cameraZ = 300;

    const render = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      time += 0.008;

      const points: { x: number; y: number; z: number; sx: number; sy: number; opacity: number }[] = [];

      // Generate 3D wave surface
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col - cols / 2) * spacing;
          const z = (row - rows / 2) * spacing + 100;

          // Multi-layered wave function — organic flowing silk
          const wave1 = Math.sin(col * 0.12 + time * 1.2) * 25;
          const wave2 = Math.cos(row * 0.15 + time * 0.8) * 18;
          const wave3 = Math.sin((col + row) * 0.08 + time * 0.6) * 12;
          const y = wave1 + wave2 + wave3 - 40;

          // Perspective projection
          const depth = z + cameraZ;
          if (depth <= 0) continue;
          const scale = focalLength / depth;
          const sx = w / 2 + x * scale;
          const sy = h / 2 + y * scale;

          // Distance-based opacity falloff
          const distFromCenter = Math.sqrt(
            Math.pow((col - cols / 2) / (cols / 2), 2) +
            Math.pow((row - rows / 2) / (rows / 2), 2)
          );
          const opacity = Math.max(0, 0.12 * (1 - distFromCenter * 0.7) * Math.min(1, scale));

          points.push({ x, y, z, sx, sy, opacity });
        }
      }

      // Draw mesh lines — horizontal
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

      // Draw mesh lines — vertical
      for (let row = 0; row < rows - 1; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col;
          const j = i + cols;
          const p1 = points[i];
          const p2 = points[j];
          if (!p1 || !p2) continue;

          const avgOpacity = (p1.opacity + p2.opacity) / 2;
          if (avgOpacity < 0.01) continue;

          ctx.strokeStyle = `rgba(232, 228, 223, ${avgOpacity * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      }

      // Draw node points — subtle glowing vertices
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (p.opacity < 0.03) continue;
        if (i % 3 !== 0) continue; // Only every 3rd point

        ctx.fillStyle = `rgba(232, 228, 223, ${p.opacity * 1.5})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [canvasRef]);
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAGNETIC BUTTON — Follows cursor with subtle pull
   ═══════════════════════════════════════════════════════════════════════════════ */

function useMagnetic(ref: React.RefObject<HTMLButtonElement | null>, strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

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

/* ═══════════════════════════════════════════════════════════════════════════════
   LIGHT TRACE INPUT — Luminous trace along underline on focus
   ═══════════════════════════════════════════════════════════════════════════════ */

function TraceInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  label,
  autoComplete,
  ariaLabel,
  endAdornment,
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
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative w-full" style={{ marginBottom: "32px" }}>
      {/* Floating label */}
      <motion.label
        htmlFor={id}
        className="absolute pointer-events-none font-body uppercase select-none"
        style={{
          left: 0,
          letterSpacing: "0.25em",
          color: focused ? `${T.white}80` : `${T.white}33`,
          transformOrigin: "left center",
        }}
        animate={{
          top: focused || hasValue ? "-6px" : "10px",
          fontSize: focused || hasValue ? "7px" : "11px",
          letterSpacing: focused || hasValue ? "0.3em" : "0.15em",
        }}
        transition={{ duration: 0.3, ease: EASE }}
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
        placeholder={focused ? placeholder : ""}
        required
        autoComplete={autoComplete}
        className="w-full bg-transparent border-none outline-none focus-visible:outline-none font-body"
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

      {/* Base line */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "1px", backgroundColor: `${T.white}1A` }}
      />

      {/* Active trace line */}
      <motion.div
        className="absolute bottom-0 left-0 w-full"
        style={{ height: "1px", transformOrigin: "center" }}
        initial={{ scaleX: 0 }}
        animate={{
          scaleX: focused ? 1 : 0,
          backgroundColor: focused ? T.accent : `${T.white}40`,
        }}
        transition={{ duration: 0.4, ease: EASE }}
      />

      {/* Focus glow */}
      <motion.div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ height: "1px" }}
        animate={{
          boxShadow: focused ? `0 0 15px 2px ${T.accent}30` : "0 0 0 0 transparent",
        }}
        transition={{ duration: 0.4, ease: EASE }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   LOADING PULSE — Geometric morphing indicator
   ═══════════════════════════════════════════════════════════════════════════════ */

function LoadingPulse() {
  return (
    <div className="flex items-center gap-1.5" style={{ height: "14px" }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          style={{
            width: "2px",
            backgroundColor: T.accent,
            borderRadius: "1px",
          }}
          animate={{
            height: ["4px", "14px", "4px"],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   THE VESTIBULE — MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();

  // Phase & entrance
  const [phase, setPhase] = useState<Phase>("void");
  const [formOpen, setFormOpen] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Status & role
  const [statusText, setStatusText] = useState("SYSTEM READY");
  const [authRole, setAuthRole] = useState<string | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);
  const magnetic = useMagnetic(enterBtnRef, 0.25);

  // Reduced motion
  const [prefersReduced, setPrefersReduced] = useState(false);

  // 3D Wave Mesh
  useWaveMesh(canvasRef);

  /* ── Entrance choreography ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    if (mq.matches) {
      setPhase("ready");
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("wave"), 300));
    timers.push(setTimeout(() => setPhase("beam"), 1200));
    timers.push(setTimeout(() => setPhase("brand"), 2000));
    timers.push(setTimeout(() => setPhase("ready"), 3200));

    return () => timers.forEach(clearTimeout);
  }, []);

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

  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (error) setError(null);
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (error) setError(null);
  };

  /* ── Authentication ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setStatusText("AUTHENTICATING");

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
        setError("Authentication failed.");
        setStatusText("SYSTEM READY");
        setLoading(false);
        return;
      }

      setStatusText("ACCESS GRANTED");
      const role = await getUserRole(data.user.id);
      setAuthRole(role);
      setPhase("success");

      setTimeout(() => setStatusText("REDIRECTING"), 300);

      setTimeout(() => {
        if (role === "super_admin") router.push("/super-admin/dashboard");
        else if (role === "admin") router.push("/admin/dashboard");
        else router.push("/user-dashboard");
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error.";
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

  /* ── Wordmark ── */
  const wordmark = "AURA.STREET";

  return (
    <main
      className={`min-h-screen w-full relative flex items-center justify-center overflow-hidden select-none ${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      style={{ backgroundColor: T.void }}
    >
      {/* ── 3D Wave Mesh Canvas ── */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phaseReached("wave") ? 1 : 0 }}
        transition={{ duration: 2, ease: EASE }}
      />

      {/* ── Atmospheric vignette overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, ${T.void} 100%)`,
        }}
      />

      {/* ── Vertical beam of light (entrance) ── */}
      <AnimatePresence>
        {phase === "beam" && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: "50%",
              top: "20%",
              width: "1px",
              height: "60%",
              transform: "translateX(-50%)",
              background: `linear-gradient(to bottom, transparent, ${T.white}40, ${T.accent}20, ${T.white}40, transparent)`,
              zIndex: 2,
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        )}
      </AnimatePresence>

      {/* ── Corner frame marks ── */}
      {phaseReached("brand") && (
        <>
          {/* Top-left */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ top: "6%", left: "5%", zIndex: 5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div style={{ width: "30px", height: "1px", backgroundColor: T.white }} />
            <div style={{ width: "1px", height: "30px", backgroundColor: T.white }} />
          </motion.div>
          {/* Top-right */}
          <motion.div
            className="absolute pointer-events-none flex flex-col items-end"
            style={{ top: "6%", right: "5%", zIndex: 5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div style={{ width: "30px", height: "1px", backgroundColor: T.white }} />
            <div style={{ width: "1px", height: "30px", backgroundColor: T.white, alignSelf: "flex-end" }} />
          </motion.div>
          {/* Bottom-left */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ bottom: "6%", left: "5%", zIndex: 5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div style={{ width: "1px", height: "30px", backgroundColor: T.white }} />
            <div style={{ width: "30px", height: "1px", backgroundColor: T.white }} />
          </motion.div>
          {/* Bottom-right */}
          <motion.div
            className="absolute pointer-events-none flex flex-col items-end"
            style={{ bottom: "6%", right: "5%", zIndex: 5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div style={{ width: "1px", height: "30px", backgroundColor: T.white, alignSelf: "flex-end" }} />
            <div style={{ width: "30px", height: "1px", backgroundColor: T.white }} />
          </motion.div>
        </>
      )}

      {/* ── Bottom metadata strip ── */}
      {phaseReached("ready") && (
        <motion.div
          className="absolute flex justify-between items-end font-mono"
          style={{
            bottom: "3%",
            left: "5%",
            right: "5%",
            zIndex: 5,
            fontSize: "8px",
            letterSpacing: "0.2em",
            color: `${T.white}26`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span>AURA.STREET // PRIVATE GATEWAY</span>
          <span>v4.2.0</span>
        </motion.div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
         COMPOSITION — The central experience
         ═══════════════════════════════════════════════════════════════════════ */}
      <motion.div
        className="vestibule-composition relative flex flex-col items-center w-full px-8 sm:px-6"
        style={{ zIndex: 10, maxWidth: "440px" }}
        animate={phase === "success" ? { scale: 1.03 } : { scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {/* ── Wordmark ── */}
        {phaseReached("brand") && (
          <motion.div className="text-center mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1
              className="font-display font-bold uppercase flex justify-center items-center"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2rem)",
                letterSpacing: "0.4em",
                color: T.white,
                lineHeight: 1.2,
              }}
            >
              {wordmark.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: prefersReduced ? 0 : 0.05 * i,
                    duration: 0.8,
                    ease: EASE,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </h1>
          </motion.div>
        )}

        {/* ── Subtitle ── */}
        {phaseReached("brand") && (
          <motion.p
            className="font-body uppercase text-center"
            style={{
              fontSize: "8px",
              letterSpacing: "0.4em",
              color: `${T.white}40`,
              marginBottom: "40px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReduced ? 0 : 0.6, duration: 0.8, ease: EASE }}
          >
            PRIVATE ACCESS TERMINAL
          </motion.p>
        )}

        {/* ── Architectural line ── */}
        {phaseReached("brand") && (
          <div className="flex justify-center w-full" style={{ marginBottom: "40px" }}>
            <motion.div
              style={{
                height: "1px",
                width: "100%",
                maxWidth: "280px",
                background: phase === "success"
                  ? `linear-gradient(90deg, transparent, ${getRoleColor()}, transparent)`
                  : `linear-gradient(90deg, transparent, ${T.white}30, transparent)`,
                boxShadow: phase === "success" ? `0 0 30px ${getRoleColor()}50` : "none",
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: prefersReduced ? 0 : 1.2, ease: EASE }}
            />
          </div>
        )}

        {/* ── Invitation / Auth Form ── */}
        <div className="w-full flex flex-col items-center" style={{ maxWidth: "320px" }}>
          <AnimatePresence mode="wait">
            {/* ── IDENTIFY button ── */}
            {phaseReached("ready") && !formOpen && phase !== "success" && (
              <motion.button
                key="identify-btn"
                onClick={handleIdentify}
                className="font-body uppercase cursor-pointer bg-transparent border-none outline-none focus-visible:outline-1 focus-visible:outline-offset-4 relative overflow-hidden"
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  letterSpacing: "0.35em",
                  color: `${T.white}60`,
                  padding: "16px 40px",
                  border: `1px solid ${T.white}15`,
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: EASE }}
                whileHover={{
                  color: T.white,
                  borderColor: `${T.white}40`,
                  letterSpacing: "0.45em",
                }}
              >
                {/* Hover light sweep */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${T.white}08 50%, transparent 100%)`,
                    transform: "translateX(-100%)",
                  }}
                  whileHover={{ transform: "translateX(100%)" }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
                IDENTIFY
              </motion.button>
            )}

            {/* ── Authentication Form ── */}
            {formOpen && (
              <motion.form
                key="auth-form"
                onSubmit={handleLogin}
                className="w-full flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                noValidate
              >
                {/* Email */}
                <TraceInput
                  id="vestibule-email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="name@domain.com"
                  label="SECURE ID"
                  autoComplete="email"
                  ariaLabel="Email address"
                />

                {/* Password */}
                <TraceInput
                  id="vestibule-key"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••"
                  label="ACCESS KEY"
                  autoComplete="current-password"
                  ariaLabel="Password"
                  endAdornment={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="bg-transparent border-none cursor-pointer outline-none focus-visible:outline-1 focus-visible:outline-offset-2"
                      style={{
                        color: `${T.white}30`,
                        transition: "color 200ms",
                        padding: "8px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = `${T.white}80`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = `${T.white}30`;
                      }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff style={{ width: 14, height: 14 }} />
                      ) : (
                        <Eye style={{ width: 14, height: 14 }} />
                      )}
                    </button>
                  }
                />

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="w-full font-body text-center"
                      style={{ fontSize: "10px", color: `${T.error}B3`, marginBottom: "24px" }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      role="alert"
                      aria-live="assertive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* ── ENTER — magnetic action button ── */}
                <motion.button
                  ref={enterBtnRef}
                  type="submit"
                  disabled={loading}
                  className="relative font-body uppercase cursor-pointer outline-none focus-visible:outline-1 focus-visible:outline-offset-4 disabled:cursor-wait overflow-hidden"
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.35em",
                    color: loading ? T.void : T.void,
                    backgroundColor: loading ? `${T.white}80` : T.white,
                    padding: "16px 64px",
                    border: "none",
                    marginTop: "8px",
                    x: magnetic.x,
                    y: magnetic.y,
                  }}
                  whileHover={
                    !loading
                      ? {
                          backgroundColor: "transparent",
                          color: T.white,
                          boxShadow: `inset 0 0 0 1px ${T.white}`,
                          letterSpacing: "0.5em",
                        }
                      : undefined
                  }
                  whileTap={!loading ? { scale: 0.97 } : undefined}
                  transition={{ duration: 0.3, ease: EASE }}
                  aria-label={loading ? "Verifying" : "Enter"}
                >
                  {/* Sweep light on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${T.white}20 50%, transparent 100%)`,
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <LoadingPulse />
                        <span>VERIFYING</span>
                      </>
                    ) : (
                      "ENTER"
                    )}
                  </span>
                </motion.button>

                {/* ── Status line ── */}
                <motion.div
                  className="flex items-center gap-2 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
                >
                  <motion.div
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      backgroundColor:
                        statusText === "SYSTEM READY"
                          ? `${T.white}30`
                          : statusText === "ACCESS GRANTED"
                          ? "#22c55e"
                          : T.accent,
                    }}
                    animate={
                      statusText !== "SYSTEM READY"
                        ? { opacity: [1, 0.3, 1] }
                        : { opacity: 1 }
                    }
                    transition={
                      statusText !== "SYSTEM READY"
                        ? { duration: 1, repeat: Infinity }
                        : {}
                    }
                  />
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.25em",
                      color: `${T.white}35`,
                    }}
                    aria-live="polite"
                  >
                    {statusText}
                  </p>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Injected global styles ── */}
      <GlobalStyles />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES
   ═══════════════════════════════════════════════════════════════════════════════ */

function GlobalStyles() {
  useEffect(() => {
    const id = "vestibule-styles";
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
        outline-color: #E8E4DF33;
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  return null;
}
