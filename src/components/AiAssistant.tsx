"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Cpu, Sparkles, Terminal } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "Recommend a full outfit",
  "How does the sizing fit?",
  "Tell me about the Japanese fabrics",
];

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "System connection established. AURA STREET AI Stylist is online. Initialize styling query analysis...",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
          messages: [...messages.slice(1), userMessage], // skip the initial greeting
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
        { role: "assistant", content: "Gateway connection lost. Please retry query." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative group p-5 bg-black hover:bg-neutral-950 border border-white/10 hover:border-brand-sky/50 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] focus:outline-none"
        >
          {/* Pulsating Brand Outer Ring */}
          <span className="absolute inset-0 rounded-full border border-brand-sky/30 scale-110 group-hover:scale-125 transition-transform duration-500 animate-pulse" />
          
          <div className="relative">
            {isOpen ? (
              <X className="w-6 h-6 text-brand-sky transition-transform duration-300 rotate-90" />
            ) : (
              <Sparkles className="w-6 h-6 text-brand-sky group-hover:rotate-12 transition-transform duration-300" />
            )}
          </div>
        </button>
      </div>

      {/* Futuristic Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-6 w-[400px] h-[550px] bg-black/90 border border-white/10 rounded-[24px] shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 flex flex-col overflow-hidden font-sans"
          >
            {/* Holographic HUD Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-neutral-950/80">
              <div className="flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-sky opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-sky"></span>
                </div>
                <div>
                  <h3 className="text-xs tracking-[0.25em] font-black uppercase text-white font-display">
                    AURA STYLIST // AI
                  </h3>
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold font-display">
                    System Node Activated
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Thread Panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-neutral-800">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 text-xs leading-relaxed uppercase tracking-wider ${
                      msg.role === "user"
                        ? "bg-brand-sky text-black font-semibold rounded-tr-none shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                        : "bg-neutral-900/60 border border-white/5 text-neutral-200 rounded-tl-none font-medium"
                    }`}
                  >
                    {msg.role === "assistant" && idx === 0 && (
                      <div className="flex items-center gap-2 mb-2 text-[9px] text-brand-sky font-black font-display tracking-widest">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>DECRYPTING INCOMING PACKET...</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900/60 border border-white/5 text-brand-sky rounded-2xl rounded-tl-none px-5 py-4 text-xs font-semibold uppercase tracking-wider flex items-center gap-3">
                    <Cpu className="w-4 h-4 animate-spin" />
                    <span>ANALYZING STYLE PROTOCOLS...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Actions Selector */}
            {messages.length === 1 && !loading && (
              <div className="px-6 py-2 flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[9px] uppercase tracking-widest font-black px-3.5 py-2 border border-white/10 hover:border-brand-sky bg-black/40 hover:bg-neutral-950 text-neutral-400 hover:text-white rounded-lg transition-all duration-300 font-display"
                  >
                    [{prompt}]
                  </button>
                ))}
              </div>
            )}

            {/* Input Terminal Interface */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-5 border-t border-white/5 bg-neutral-950/80 flex gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="PROMPT AI STYLIST..."
                className="flex-1 bg-black/80 border border-neutral-800 hover:border-neutral-700 focus:border-brand-sky/50 rounded-xl px-5 py-3 text-xs uppercase tracking-wider text-white placeholder:text-neutral-600 focus:outline-none transition-all"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 bg-brand-sky hover:bg-sky-400 disabled:opacity-50 text-black rounded-xl transition-all flex items-center justify-center shrink-0"
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
