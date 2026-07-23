"use client";

import { useState } from "react";
import { Mail, MessageCircle, Headphones, MapPin, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageIntro from "@/components/PageIntro";
import PageShell from "@/components/PageShell";
import PersonalTouchForm from "@/components/PersonalTouchForm";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("GENERAL INQUIRY");
  const [message, setMessage] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setEmail("");
        setMessage("");
      }, 4000);
    }, 1500);
  };

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto py-12">
        <PageIntro
          eyebrow="Contact"
          title="Support for orders, sizing, shipping, and private drops"
          text="Use this support surface for customer questions, order tracking, return requests, collaborations, and wholesale inquiries."
        />
        <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
          
          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
            className="glass-panel-glow rounded-xl p-8 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="form"
                  onSubmit={handleSubmit} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                    <UnderlineContactInput placeholder="FULL NAME" value={name} onChange={setName} />
                    <UnderlineContactInput placeholder="EMAIL ADDRESS" value={email} onChange={setEmail} />
                    
                    <div className="relative w-full mb-6 font-mono md:col-span-2">
                      <label className="block text-[8px] uppercase tracking-[0.25em] text-neutral-500 font-bold mb-2">Subject Preference</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-black border border-neutral-800 py-3 px-3 text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-brand-sky text-white rounded-lg"
                      >
                        <option value="GENERAL INQUIRY">General Inquiry</option>
                        <option value="ORDER SUPPORT">Order Support</option>
                        <option value="RETURNS & EXCHANGES">Returns & Exchanges</option>
                        <option value="PRESS & WHOLESALE">Press & Wholesale</option>
                      </select>
                    </div>

                    <div className="relative w-full mb-6 font-mono md:col-span-2">
                      <textarea
                        placeholder="MESSAGE CONTENT"
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-transparent border-b border-neutral-850 py-3 px-1 text-[10px] uppercase tracking-[0.2em] focus:outline-none text-white placeholder:text-neutral-700 resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting || !name || !email || !message}
                    className="h-14 rounded bg-white text-black hover:bg-brand-sky transition-all duration-[220ms] px-8 text-[10px] uppercase tracking-[0.22em] font-extrabold flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    {submitting ? "Sending Transmission..." : "Send Message"}
                    <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-16 space-y-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-brand-sky animate-pulse" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white">Transmission Successful</h3>
                  <p className="text-[10px] uppercase tracking-widest text-neutral-500 max-w-sm">
                    Your query has been logged. Our dispatch operations typically respond within 4 business hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Info Panels */}
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-4"
          >
            {[
              { icon: Mail, title: "Email Details", text: "support@aurastreet.com", details: "Direct operational routing box." },
              { icon: MessageCircle, title: "Live Chat", text: "Active 24/7 during drop periods", details: "Average response time: 2 mins." },
              { icon: Headphones, title: "Customer Care", text: "Order support, size exchanges & shipping", details: "Available Mon-Fri, 9am-6pm CET." },
              { icon: MapPin, title: "Paris Atelier", text: "Le Marais district, Paris, France", details: "Central headquarters and product showroom." },
            ].map((item) => (
              <motion.div 
                key={item.title} 
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
                }}
                className="glass-panel-glow rounded-xl p-6 hover:border-brand-sky/25 transition-colors"
              >
                <item.icon className="w-5 h-5 text-brand-sky mb-4" />
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-2 text-white">{item.title}</h2>
                <p className="text-[11px] text-white font-semibold leading-relaxed">{item.text}</p>
                <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">{item.details}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Personal Touch & Improvement Portal Section */}
        <section className="px-6 md:px-12 max-w-7xl mx-auto pb-28">
          <PersonalTouchForm />
        </section>
      </div>
    </PageShell>
  );
}

function UnderlineContactInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative w-full mb-6 font-mono">
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-transparent border-none py-3 px-1 text-[10px] uppercase tracking-[0.2em] focus:outline-none text-white placeholder:text-neutral-700"
      />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-neutral-900" />
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-sky shadow-[0_0_8px_#7dd3fc]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
    </div>
  );
}
