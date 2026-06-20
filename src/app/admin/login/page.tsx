"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "superadmin">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock authentication delay
    setTimeout(() => {
      setLoading(false);
      router.push("/admin/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Glow */}
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
            Secure Admin Portal
          </p>
        </div>

        <div className="glass-panel border border-white/10 rounded-2xl p-8 backdrop-blur-xl bg-neutral-950/80">
          
          {/* Role Toggle */}
          <div className="flex bg-black/50 p-1 rounded-lg border border-white/5 mb-8">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-md transition-all ${
                role === "admin" 
                  ? "bg-white/10 text-white shadow-lg border border-white/5" 
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole("superadmin")}
              className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold rounded-md transition-all ${
                role === "superadmin" 
                  ? "bg-brand-sky/20 text-brand-sky shadow-lg border border-brand-sky/30" 
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              Super Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "superadmin" ? "super@aurastreet.com" : "admin@aurastreet.com"}
                  className="w-full bg-black border border-neutral-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">
                  Password
                </label>
                <a href="#" className="text-[10px] text-brand-sky hover:text-brand-sky/80">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-neutral-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-brand-sky transition-colors text-white placeholder:text-neutral-700"
                  required
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-white text-black py-4 rounded-lg text-[10px] uppercase tracking-[0.2em] font-extrabold flex items-center justify-center gap-2 hover:bg-brand-sky hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
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
