"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
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
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const userRole = profile?.role ?? "user";

    if (userRole === "super_admin") {
      router.push("/super-admin/dashboard");
    } else if (userRole === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/user-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-sky/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold tracking-[0.3em] uppercase font-display select-none text-white mb-2">
            AURA<span className="text-brand-sky">.</span>STREET
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">
            Secure Portal Gateway
          </p>
        </div>

        <div className="border border-white/10 rounded-2xl p-8 backdrop-blur-xl bg-neutral-950/80">

          {/* Role Toggle (UI hint only — actual role comes from DB) */}
          <div className="flex bg-black/50 p-1 rounded-lg border border-white/5 mb-8">
            {(["user", "admin", "superadmin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 text-[9px] uppercase tracking-widest font-bold rounded-md transition-all ${
                  role === r
                    ? r === "superadmin"
                      ? "bg-red-500/20 text-red-500 border border-red-500/30"
                      : r === "admin"
                      ? "bg-brand-sky/20 text-brand-sky border border-brand-sky/30"
                      : "bg-white/10 text-white border border-white/5"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {r === "superadmin" ? "Super Admin" : r === "admin" ? "Admin" : "Staff"}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-6"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-[11px] text-red-400">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === "superadmin" ? "super@aurastreet.com"
                  : role === "admin" ? "admin@aurastreet.com"
                  : "staff@aurastreet.com"
                }
                className="w-full bg-black border border-neutral-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-700"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Password</label>
                <a href="#" className="text-[10px] text-brand-sky hover:text-brand-sky/80">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-black border border-neutral-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-700"
                  required
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-white text-black py-4 rounded-lg text-[10px] uppercase tracking-[0.2em] font-extrabold flex items-center justify-center gap-2 hover:bg-brand-sky hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-[9px] uppercase tracking-widest text-neutral-600">
            Internal Use Only. Unauthorized access is strictly prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
