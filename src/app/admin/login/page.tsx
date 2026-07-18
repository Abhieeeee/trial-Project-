"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { getUserRole } from "@/app/actions/auth";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPOGRAPHY — Three faces, each with a single purpose.
   ───────────────────────────────────────────────────────────────────────────── */

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
});

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
   ───────────────────────────────────────────────────────────────────────────── */

const TOKENS = {
  color: {
    void: "#050505",
    warmWhite: "#E8E4DF",
    error: "#EF4444",
    roleStaff: "#E8E4DF",
    roleAdmin: "#00D2FF",
    roleSuper: "#EF4444",
  },
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  timing: {
    darkness: 600,
    lineReveal: 1200,
    wordmarkDelay: 1800,
    subtitleDelay: 2200,
    invitationDelay: 3000,
  },
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   PHASES — The six emotional beats of arrival.
   ───────────────────────────────────────────────────────────────────────────── */

type Phase = "darkness" | "line" | "identity" | "invitation" | "auth" | "threshold";

/* ─────────────────────────────────────────────────────────────────────────────
   THE VESTIBULE
   ───────────────────────────────────────────────────────────────────────────── */

export default function AdminLogin() {
  const router = useRouter();
  const supabase = createClient();

  // ── Phase & entrance ──
  const [phase, setPhase] = useState<Phase>("darkness");
  const [formOpen, setFormOpen] = useState(false);

  // ── Form state ──
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Status & role ──
  const [statusText, setStatusText] = useState("SYSTEM READY");
  const [authRole, setAuthRole] = useState<string | null>(null);

  // ── Reduced motion preference ──
  const [prefersReduced, setPrefersReduced] = useState(false);

  /* ── Entrance sequence choreography ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    if (mq.matches) {
      // Skip entrance, show everything immediately
      setPhase("invitation");
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setPhase("line"), TOKENS.timing.darkness));
    timers.push(setTimeout(() => setPhase("identity"), TOKENS.timing.wordmarkDelay));
    timers.push(setTimeout(() => setPhase("invitation"), TOKENS.timing.invitationDelay));

    return () => timers.forEach(clearTimeout);
  }, []);

  /* ── Phase helpers ── */
  const phaseReached = useCallback(
    (target: Phase): boolean => {
      const order: Phase[] = ["darkness", "line", "identity", "invitation", "auth", "threshold"];
      return order.indexOf(phase) >= order.indexOf(target);
    },
    [phase]
  );

  /* ── Open auth form ── */
  const handleIdentify = () => {
    setFormOpen(true);
    setPhase("auth");
  };

  /* ── Clear error on retype ── */
  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (error) setError(null);
  };
  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (error) setError(null);
  };

  /* ── Authentication handler ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setStatusText("VERIFYING CREDENTIALS");

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

      // Role detection
      setStatusText("ACCESS GRANTED");
      const role = await getUserRole(data.user.id);
      setAuthRole(role);
      setPhase("threshold");

      // Brief pause for the color flash to be perceived
      setTimeout(() => {
        setStatusText("REDIRECTING");
      }, 200);

      setTimeout(() => {
        if (role === "super_admin") {
          router.push("/super-admin/dashboard");
        } else if (role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user-dashboard");
        }
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "A network error occurred.";
      setError(message);
      setStatusText("SYSTEM READY");
      setLoading(false);
    }
  };

  /* ── Role color mapping ── */
  const getRoleColor = (): string => {
    if (!authRole) return TOKENS.color.warmWhite;
    if (authRole === "super_admin") return TOKENS.color.roleSuper;
    if (authRole === "admin") return TOKENS.color.roleAdmin;
    return TOKENS.color.roleStaff;
  };

  /* ── Wordmark character stagger ── */
  const wordmark = "AURA.STREET";
  const charDelay = prefersReduced ? 0 : 0.05;

  /* ── Shared motion config ── */
  const gravityEase = TOKENS.ease;

  return (
    <main
      className={`
        min-h-screen w-full relative flex flex-col items-center justify-start
        overflow-hidden select-none
        ${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}
      `}
      style={{ backgroundColor: TOKENS.color.void }}
    >
      {/* ── Atmospheric photograph layer ── */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/hero-editorial.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "grayscale(1) brightness(0.4)",
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: phase === "threshold" ? 0.08 : 0,
        }}
        transition={{ duration: 0.6, ease: gravityEase }}
      />

      {/* ── Composition container — optically centered ── */}
      <motion.div
        className="vestibule-composition relative z-10 flex flex-col items-center w-full px-8 sm:px-6"
        style={{ paddingTop: "38vh" }}
        animate={
          phase === "threshold"
            ? { scale: 1.02 }
            : { scale: 1 }
        }
        transition={{ duration: 0.6, ease: gravityEase }}
      >
        {/* ── PHASE 3: Wordmark ── */}
        <div
          className="overflow-hidden mb-3"
          style={{ minHeight: "2.5rem" }}
          aria-label="AURA.STREET"
        >
          {phaseReached("identity") && (
            <motion.h1
              className="font-display font-bold tracking-[0.4em] uppercase text-center flex justify-center"
              style={{
                color: TOKENS.color.warmWhite,
                fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                lineHeight: 1.2,
              }}
            >
              {wordmark.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * charDelay,
                    duration: 0.8,
                    ease: gravityEase,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          )}
        </div>

        {/* ── PHASE 3: Subtitle ── */}
        <AnimatePresence>
          {phaseReached("identity") && (
            <motion.p
              className="font-body uppercase text-center mb-8 sm:mb-10"
              style={{
                fontSize: "9px",
                letterSpacing: "0.35em",
                color: `${TOKENS.color.warmWhite}59`, // 35% opacity
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: prefersReduced ? 0 : 0.4,
                duration: 0.6,
                ease: gravityEase,
              }}
            >
              PRIVATE ACCESS
            </motion.p>
          )}
        </AnimatePresence>

        {/* ── PHASE 2: The architectural line ── */}
        <div className="flex justify-center mb-8 sm:mb-10" style={{ minHeight: "1px" }}>
          {phaseReached("line") && (
            <motion.div
              style={{
                height: "1px",
                backgroundColor:
                  phase === "threshold"
                    ? getRoleColor()
                    : `${TOKENS.color.warmWhite}4D`, // 30% opacity
                width: "280px",
                boxShadow:
                  phase === "threshold"
                    ? `0 0 20px ${getRoleColor()}40`
                    : "none",
              }}
              initial={{ scaleX: 0 }}
              animate={{
                scaleX: 1,
                backgroundColor:
                  phase === "threshold"
                    ? getRoleColor()
                    : `${TOKENS.color.warmWhite}4D`,
              }}
              transition={{
                scaleX: {
                  duration: prefersReduced ? 0 : 1.2,
                  ease: gravityEase,
                },
                backgroundColor: {
                  duration: 0.4,
                  ease: gravityEase,
                },
              }}
            />
          )}
        </div>

        {/* ── PHASE 4: Invitation / PHASE 5: Authentication form ── */}
        <div className="w-full flex flex-col items-center" style={{ maxWidth: "340px" }}>
          <AnimatePresence mode="wait">
            {/* ── The invitation word: IDENTIFY ── */}
            {phaseReached("invitation") && !formOpen && (
              <motion.button
                key="identify"
                onClick={handleIdentify}
                className="font-body uppercase cursor-pointer bg-transparent border-none outline-none focus-visible:outline-1 focus-visible:outline-offset-4"
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.3em",
                  color: `${TOKENS.color.warmWhite}80`, // 50% opacity
                  padding: "12px 24px",
                  transition: "color 300ms, letter-spacing 300ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = TOKENS.color.warmWhite;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = `${TOKENS.color.warmWhite}80`;
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.6, ease: gravityEase }}
                aria-label="Open authentication form"
              >
                IDENTIFY
              </motion.button>
            )}

            {/* ── The authentication form ── */}
            {formOpen && (
              <motion.form
                key="auth-form"
                onSubmit={handleLogin}
                className="w-full flex flex-col items-center"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: gravityEase }}
                noValidate
              >
                {/* ── Email ── */}
                <div className="w-full mb-6">
                  <label
                    htmlFor="vestibule-email"
                    className="block font-body uppercase mb-2"
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.25em",
                      color: `${TOKENS.color.warmWhite}4D`, // 30%
                    }}
                  >
                    ID
                  </label>
                  <input
                    id="vestibule-email"
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="name@domain.com"
                    required
                    autoComplete="email"
                    className="
                      w-full bg-transparent border-none outline-none
                      font-body
                      focus-visible:outline-none
                    "
                    style={{
                      fontSize: "13px",
                      color: TOKENS.color.warmWhite,
                      padding: "8px 0",
                      borderBottom: `1px solid ${TOKENS.color.warmWhite}33`, // 20%
                      transition: "border-color 200ms",
                      caretColor: TOKENS.color.warmWhite,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderBottomColor = `${TOKENS.color.warmWhite}99`; // 60%
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderBottomColor = `${TOKENS.color.warmWhite}33`; // 20%
                    }}
                    aria-label="Email address"
                  />
                </div>

                {/* ── Password ── */}
                <div className="w-full mb-8">
                  <label
                    htmlFor="vestibule-key"
                    className="block font-body uppercase mb-2"
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.25em",
                      color: `${TOKENS.color.warmWhite}4D`, // 30%
                    }}
                  >
                    KEY
                  </label>
                  <div className="relative">
                    <input
                      id="vestibule-key"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="
                        w-full bg-transparent border-none outline-none
                        font-body
                        focus-visible:outline-none
                      "
                      style={{
                        fontSize: "13px",
                        color: TOKENS.color.warmWhite,
                        padding: "8px 0",
                        paddingRight: "32px",
                        borderBottom: `1px solid ${TOKENS.color.warmWhite}33`,
                        transition: "border-color 200ms",
                        caretColor: TOKENS.color.warmWhite,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderBottomColor = `${TOKENS.color.warmWhite}99`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderBottomColor = `${TOKENS.color.warmWhite}33`;
                      }}
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="
                        absolute right-0 top-1/2 -translate-y-1/2
                        bg-transparent border-none cursor-pointer outline-none
                        focus-visible:outline-1 focus-visible:outline-offset-2
                      "
                      style={{
                        color: `${TOKENS.color.warmWhite}4D`, // 30%
                        transition: "color 200ms",
                        padding: "8px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = `${TOKENS.color.warmWhite}99`; // 60%
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = `${TOKENS.color.warmWhite}4D`; // 30%
                      }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff style={{ width: 14, height: 14 }} />
                      ) : (
                        <Eye style={{ width: 14, height: 14 }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Error ── */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="w-full font-body text-center mb-6"
                      style={{
                        fontSize: "10px",
                        color: `${TOKENS.color.error}B3`, // 70%
                      }}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3, ease: gravityEase }}
                      role="alert"
                      aria-live="assertive"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* ── ENTER — the action word ── */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="
                    bg-transparent border-none cursor-pointer outline-none
                    font-body uppercase
                    focus-visible:outline-1 focus-visible:outline-offset-4
                    disabled:cursor-wait
                  "
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.3em",
                    color: TOKENS.color.warmWhite,
                    padding: "12px 24px",
                    transition: "letter-spacing 300ms, opacity 200ms",
                  }}
                  whileHover={
                    !loading
                      ? { letterSpacing: "0.45em" }
                      : undefined
                  }
                  whileTap={
                    !loading
                      ? { opacity: 0.7 }
                      : undefined
                  }
                  aria-label={loading ? "Verifying credentials" : "Enter"}
                >
                  {loading ? "VERIFYING" : "ENTER"}
                </motion.button>

                {/* ── Status line ── */}
                <motion.p
                  className="font-mono uppercase text-center mt-8"
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.2em",
                    color: `${TOKENS.color.warmWhite}40`, // 25%
                  }}
                  aria-live="polite"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: gravityEase }}
                >
                  {statusText}
                </motion.p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Injected global styles via useEffect to avoid Turbopack styled-jsx CSS parse errors ── */}
      <GlobalStyles />
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES — Injected as a plain <style> element to bypass Turbopack's
   CSS parser limitations with template literal interpolation in styled-jsx.
   ───────────────────────────────────────────────────────────────────────────── */

function GlobalStyles() {
  useEffect(() => {
    const id = "vestibule-global-styles";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      input::placeholder {
        color: #E8E4DF26 !important;
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

      @media (max-width: 767px) {
        .vestibule-composition {
          padding-top: 28vh !important;
        }
      }

      @media (max-width: 767px) and (orientation: landscape) {
        .vestibule-composition {
          padding-top: 15vh !important;
        }
      }

      @media (min-width: 768px) and (max-width: 1023px) {
        .vestibule-composition {
          padding-top: 35vh !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  return null;
}

