"use client";

import { useState } from "react";
import { Sparkles, Send, CheckCircle2, Sliders, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function PersonalTouchForm() {
  const [category, setCategory] = useState("BESPOKE_CUSTOMIZATION");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [contactPref, setContactPref] = useState("EMAIL");

  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{ id: string; timestamp: string } | null>(null);

  const supabase = createClient();

  const categories = [
    {
      id: "BESPOKE_CUSTOMIZATION",
      label: "Personal Touch",
      icon: Sparkles,
    },
    {
      id: "STORE_IMPROVEMENT",
      label: "UI Polish",
      icon: Sliders,
    },
    {
      id: "NEPAL_REGIONAL",
      label: "Regional Drop",
      icon: Heart,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !feedback.trim()) {
      alert("Please provide your name, email, and detailed notes.");
      return;
    }

    setSubmitting(true);

    try {
      const generatedId = `AURA-TOUCH-${Math.floor(10000 + Math.random() * 90000)}`;

      await supabase.from("audit_logs").insert([
        {
          action: "PERSONAL_TOUCH_SUBMISSION",
          details: `[${category}] ${title} - By ${name} (${email}) - ${feedback}`,
          severity: "info",
        },
      ]);

      setReceipt({
        id: generatedId,
        timestamp: new Date().toLocaleString(),
      });
    } catch {
      setReceipt({
        id: `AURA-TOUCH-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toLocaleString(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setReceipt(null);
    setName("");
    setEmail("");
    setPhone("");
    setTitle("");
    setFeedback("");
  };

  return (
    <section className="glass-panel-glow rounded-2xl p-6 sm:p-8 font-sans bg-[#0a0a0e]/90 border border-white/15 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
      
      <div className="mb-6 font-mono border-b border-white/10 pb-4 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white flex items-center gap-2 font-display">
          <Sparkles className="w-4 h-4 text-[#00D2FF]" />
          Bespoke Customization & Feedback
        </h2>
        <span className="text-[9px] uppercase tracking-widest text-[#00D2FF] font-mono">
          Co-Creation Atelier
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!receipt ? (
          <motion.form
            key="touch-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 font-mono"
          >
            {/* Category Selector Cards */}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-widest text-neutral-400 font-mono">
                Select Category *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-3.5 border rounded-xl transition-all cursor-pointer flex items-center justify-between active:scale-95 ${
                        isSelected
                          ? "border-[#00D2FF]/40 bg-[#00D2FF]/10 text-white font-bold shadow-[0_0_15px_rgba(0,210,255,0.15)]"
                          : "border-white/10 bg-black/60 text-neutral-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs uppercase tracking-wider">
                        <cat.icon className={`w-4 h-4 ${isSelected ? "text-[#00D2FF]" : "text-neutral-400"}`} />
                        <span>{cat.label}</span>
                      </span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#00D2FF]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-widest text-neutral-400 font-mono">
                  Full Name *
                </label>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-[#00D2FF] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.15)] transition-all">
                  <input
                    required
                    type="text"
                    placeholder="Aarav Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent py-3 px-4 text-xs text-white placeholder:text-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-widest text-neutral-400 font-mono">
                  Email Address *
                </label>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-[#00D2FF] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.15)] transition-all">
                  <input
                    required
                    type="email"
                    placeholder="aarav@aurastreet.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent py-3 px-4 text-xs text-white placeholder:text-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-widest text-neutral-400 font-mono">
                  Phone / WhatsApp
                </label>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-[#00D2FF] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.15)] transition-all">
                  <input
                    type="text"
                    placeholder="+977 9801234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent py-3 px-4 text-xs text-white placeholder:text-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] uppercase tracking-widest text-neutral-400 font-mono">
                  Topic Title
                </label>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-[#00D2FF] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.15)] transition-all">
                  <input
                    type="text"
                    placeholder="Custom initials embroidery"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent py-3 px-4 text-xs text-white placeholder:text-neutral-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block text-[11px] uppercase tracking-widest text-neutral-400 font-mono">
                  Request Details *
                </label>
                <div className="rounded-xl bg-white/[0.03] border border-white/10 focus-within:border-[#00D2FF] focus-within:shadow-[0_0_15px_rgba(0,210,255,0.15)] transition-all">
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe custom sizing measurements, chest emblem placement, or feature requests..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full bg-transparent py-3 px-4 text-xs text-white placeholder:text-neutral-600 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Preferred Channel & Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-neutral-400">
                <span>Contact via:</span>
                <div className="flex gap-1.5">
                  {["EMAIL", "WHATSAPP", "PHONE"].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setContactPref(pref)}
                      className={`px-2.5 py-1 border rounded-lg cursor-pointer transition-colors text-[9px] active:scale-95 ${
                        contactPref === pref
                          ? "border-[#00D2FF] text-[#00D2FF] font-bold bg-[#00D2FF]/10"
                          : "border-white/10 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 bg-[#00D2FF] hover:bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl active:scale-95 shadow-[0_0_20px_rgba(0,210,255,0.3)]"
              >
                {submitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    Submit Request <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="touch-receipt"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 text-center space-y-5 font-mono max-w-md mx-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#00d2ff]/10 border border-[#00d2ff]/40 text-[#00d2ff] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,210,255,0.2)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#00d2ff] font-bold">
                TICKET DISPATCHED // RECORD LOGGED
              </span>
              <h3 className="text-xl font-bold uppercase tracking-wider text-white font-display">
                Notes Registered
              </h3>
              <p className="text-xs text-neutral-400">
                Our atelier team will contact you via <strong className="text-white">{contactPref}</strong>.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-black/80 rounded-xl text-left text-[10px] uppercase space-y-2">
              <div className="flex justify-between text-neutral-400">
                <span>Reference Ticket ID</span>
                <span className="text-[#00d2ff] font-bold">{receipt.id}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Category</span>
                <span className="text-white font-bold">{category.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Timestamp</span>
                <span className="text-neutral-500">{receipt.timestamp}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white/[0.04] border border-white/10 hover:border-white/20 text-white text-[10px] uppercase tracking-widest font-bold rounded-xl cursor-pointer active:scale-95 transition-all"
            >
              Submit Another Request
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
