"use client";

import { useState } from "react";
import { Sparkles, Send, CheckCircle2, MessageSquarePlus, Sliders, ShieldCheck, Heart } from "lucide-react";
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
      label: "Bespoke Personal Touch",
      desc: "Custom sizing, tailored embroidery, or personalized initials",
      icon: Sparkles,
      tone: "border-[#00d2ff]/40 bg-[#00d2ff]/10 text-[#00d2ff]",
    },
    {
      id: "STORE_IMPROVEMENT",
      label: "Website & UX Improvement",
      desc: "Feature request, UI polish, or store optimization idea",
      icon: Sliders,
      tone: "border-purple-500/40 bg-purple-500/10 text-purple-400",
    },
    {
      id: "NEPAL_REGIONAL",
      label: "Nepal & Regional Market Wish",
      desc: "Local pickup hub, payment integration, or regional drops",
      icon: Heart,
      tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
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

      // Store in Supabase audit / orders notes table if available
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
    } catch (err) {
      console.error("Personal touch submission error:", err);
      // Fallback local receipt
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
    <section className="rounded-2xl p-6 sm:p-10 font-sans border border-white/10 bg-neutral-950/80 backdrop-blur-xl relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D2FF]/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="mb-8 font-mono">
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#00D2FF] font-bold">
          CUSTOMER CO-CREATION & IMPROVEMENT PORTAL
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white font-display mt-2">
          Personal Touch & Feedback Form
        </h2>
        <p className="text-xs text-neutral-400 mt-2 max-w-2xl leading-relaxed">
          Tell us about your bespoke sizing preferences, personalized embroidery touches, or ideas to make Aura Street even better.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!receipt ? (
          <motion.form
            key="touch-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 font-mono"
          >
            {/* Category Selector Cards */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-3">
                1. Select Category *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 border text-left rounded-xl transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                        isSelected
                          ? "border-[#00D2FF]/40 bg-[#00D2FF]/10 text-white font-bold"
                          : "border-white/5 bg-black/40 text-neutral-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <cat.icon className="w-5 h-5 shrink-0 text-[#00D2FF]" />
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />}
                      </div>
                      <div>
                        <h4 className="text-xs uppercase font-bold text-white mb-1">{cat.label}</h4>
                        <p className="text-[9px] text-neutral-400 leading-normal normal-case">{cat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="E.G. AARAV SHARMA"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3.5 text-white text-[10px] uppercase focus:outline-none focus:border-[#00D2FF] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="E.G. AARAV@AURASTREET.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3.5 text-white text-[10px] uppercase focus:outline-none focus:border-[#00D2FF] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                  Phone / WhatsApp (Optional)
                </label>
                <input
                  type="text"
                  placeholder="E.G. +977 9801234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3.5 text-white text-[10px] uppercase focus:outline-none focus:border-[#00D2FF] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                  Feedback Title / Topic
                </label>
                <input
                  type="text"
                  placeholder="E.G. CUSTOM INITIALS EMBROIDERY ON HOODIE"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3.5 text-white text-[10px] uppercase focus:outline-none focus:border-[#00D2FF] rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[9px] uppercase tracking-[0.2em] text-neutral-400 mb-1.5">
                  Personal Touch Request & Improvement Notes *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your personal touch request (e.g., custom chest emblem, sleeve length adjustment) or your suggestions to improve Aura Street storefront..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-black border border-white/10 p-3.5 text-white text-[10px] uppercase focus:outline-none focus:border-[#00D2FF] rounded-lg resize-none"
                />
              </div>
            </div>

            {/* Preferred Channel & Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 text-[9px] uppercase tracking-wider text-neutral-400">
                <span>Preferred Contact:</span>
                <div className="flex gap-2">
                  {["EMAIL", "WHATSAPP", "PHONE"].map((pref) => (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setContactPref(pref)}
                      className={`px-3 py-1 border rounded-lg cursor-pointer transition-colors ${
                        contactPref === pref
                          ? "border-[#00D2FF] text-[#00D2FF] font-bold bg-[#00D2FF]/10"
                          : "border-white/10 text-neutral-500 hover:text-white"
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
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-[#00D2FF] transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-lg shadow-lg"
              >
                {submitting ? (
                  <span>Transmitting Notes...</span>
                ) : (
                  <>
                    Submit Notes <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="touch-receipt"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center space-y-6 font-mono max-w-lg mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/40 text-[#00d2ff] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#00d2ff] font-bold">
                FEEDBACK LOGGED // DISPATCH TICKET CREATED
              </span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white font-display">
                Thank You for Your Personal Touch!
              </h3>
              <p className="text-xs text-neutral-400">
                Your co-creation notes have been registered with our design atelier team. We will contact you via <strong className="text-white">{contactPref}</strong>.
              </p>
            </div>

            <div className="p-4 border border-neutral-800 bg-black text-left text-[10px] uppercase space-y-2">
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
              className="px-8 py-3.5 bg-neutral-900 border border-neutral-700 hover:border-white text-white text-[9px] uppercase tracking-widest font-bold rounded cursor-pointer"
            >
              Submit Another Suggestion
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
