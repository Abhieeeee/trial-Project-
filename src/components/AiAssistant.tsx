"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Cpu,
  Sparkles,
  Terminal,
  Trash2,
  ExternalLink,
  Compass,
  Shirt,
  Ruler,
  ShoppingBag,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiAssistant() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; role: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "System connection established. AURA STREET AI Stylist online.\n\nAsk me for outfit recommendations, sizing guidance, fabric specs, or store navigation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("name, role, email")
          .eq("id", user.id)
          .single();
        if (data) {
          const role = data.email === "staff@aurastreet.com" ? "staff" : data.role;
          setProfile({ name: data.name, role: role });
        }
      }
    }
    loadProfile();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages.slice(1), userMessage],
          pathname,
          profile,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Gateway connection fallback active. Visit /shop to explore our streetwear collections.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Terminal reset complete. AURA STREET AI Stylist ready for new queries.",
      },
    ]);
  };

  // Extract clickable route links from AI message text
  const extractLinks = (content: string) => {
    const routeRegex = /(\/(?:shop|lookbook|editorial|archive|sizing|cart|checkout|user-dashboard|admin\/dashboard|super-admin\/dashboard)(?:\?[a-zA-Z0-9=&_-]+)?)/g;
    const matches = content.match(routeRegex);
    return matches ? Array.from(new Set(matches)) : [];
  };

  // Prompts by role
  const isStaffOrAdmin = profile?.role === "staff" || profile?.role === "admin" || profile?.role === "super_admin";
  const suggestedPrompts = [
    "Recommend a full outfit",
    "How does the sizing fit?",
    "Tell me about Japanese fabrics",
    ...(isStaffOrAdmin ? ["Check store revenue metrics"] : ["Where is my cart?"]),
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-4 bg-black hover:bg-neutral-950 border border-white/15 hover:border-[#00d2ff] rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.9)] focus:outline-none cursor-pointer"
          title="Toggle AI Stylist"
        >
          {/* Outer Pulsating Ring */}
          <span className="absolute inset-0 rounded-full border border-[#00d2ff]/40 scale-110 group-hover:scale-125 transition-transform duration-500 animate-pulse pointer-events-none" />

          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <X className="w-5 h-5 text-[#00d2ff] transition-transform duration-300 rotate-90" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#00d2ff] group-hover:rotate-12 transition-transform duration-300" />
            )}
          </div>
        </button>
      </div>

      {/* Chat Modal Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] h-[560px] bg-black/95 border border-white/10 rounded-[20px] shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-50 flex flex-col overflow-hidden font-mono"
          >
            {/* HUD Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-950/80">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d2ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00d2ff]"></span>
                </div>
                <div>
                  <h3 className="text-[10px] tracking-[0.25em] font-bold uppercase text-white font-display">
                    AURA STYLIST // AI CORE
                  </h3>
                  <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-mono">
                    {profile ? `${profile.name} (${profile.role.toUpperCase()})` : "Neural Network Active"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClearChat}
                  className="p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                  title="Clear chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-[11px] scrollbar-thin scrollbar-thumb-neutral-800">
              {messages.map((msg, idx) => {
                const detectedLinks = msg.role === "assistant" ? extractLinks(msg.content) : [];

                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-xl px-4 py-3 text-[11px] leading-relaxed uppercase tracking-wider ${
                        msg.role === "user"
                          ? "bg-[#00d2ff] text-black font-bold rounded-tr-none shadow-[0_0_15px_rgba(0,210,255,0.2)]"
                          : "bg-neutral-900/80 border border-white/10 text-neutral-200 rounded-tl-none font-normal"
                      }`}
                    >
                      {msg.role === "assistant" && idx === 0 && (
                        <div className="flex items-center gap-1.5 mb-2 text-[8px] text-[#00d2ff] font-bold tracking-widest border-b border-white/5 pb-1">
                          <Terminal className="w-3 h-3" />
                          <span>NEURAL LINK ESTABLISHED</span>
                        </div>
                      )}
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                    </div>

                    {/* Interactive Action Buttons inside assistant responses */}
                    {detectedLinks.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                        {detectedLinks.map((path, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              router.push(path);
                              setIsOpen(false);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#00d2ff]/10 border border-[#00d2ff]/30 text-[#00d2ff] hover:bg-[#00d2ff]/20 text-[9px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" /> Go to {path}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900/80 border border-white/10 text-[#00d2ff] rounded-xl rounded-tl-none px-4 py-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2.5">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>ANALYZING STYLE PROTOCOLS...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Bar */}
            {messages.length < 4 && !loading && (
              <div className="px-5 py-2 border-t border-white/5 flex flex-wrap gap-1.5 bg-black/40">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[8px] uppercase tracking-widest font-bold px-3 py-1.5 border border-white/10 hover:border-[#00d2ff] bg-neutral-900/50 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded transition-all cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Terminal Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-4 border-t border-white/10 bg-neutral-950/90 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Stylist..."
                className="flex-1 bg-black border border-neutral-800 hover:border-neutral-700 focus:border-[#00d2ff]/50 rounded-lg px-4 py-2.5 text-[11px] uppercase tracking-wider text-white placeholder:text-neutral-600 focus:outline-none transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 bg-[#00d2ff] hover:bg-[#00b5dc] disabled:opacity-40 text-black rounded-lg transition-all flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
