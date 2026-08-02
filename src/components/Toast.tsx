"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = ({ type, title, description }: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev.slice(-4), { id, type, title, description }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const success = (title: string, description?: string) => toast({ type: "success", title, description });
  const error = (title: string, description?: string) => toast({ type: "error", title, description });
  const info = (title: string, description?: string) => toast({ type: "info", title, description });

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2 max-w-sm w-full pointer-events-none font-mono text-xs select-none"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start justify-between gap-3 ${
                t.type === "success"
                  ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300"
                  : t.type === "error"
                  ? "bg-red-950/90 border-red-500/30 text-red-300"
                  : "bg-cyan-950/90 border-[#00D2FF]/30 text-[#00D2FF]"
              }`}
            >
              <div className="flex gap-2.5 items-start">
                {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                {t.type === "error" && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
                {t.type === "info" && <Info className="w-4 h-4 text-[#00D2FF] shrink-0 mt-0.5" />}
                <div>
                  <p className="font-bold uppercase tracking-wider text-[11px]">{t.title}</p>
                  {t.description && <p className="text-[10px] opacity-80 mt-0.5">{t.description}</p>}
                </div>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 hover:bg-white/10 rounded transition-colors text-white/60 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if used outside provider
    return {
      toast: () => {},
      success: (title: string) => alert(title),
      error: (title: string) => alert(title),
      info: (title: string) => alert(title),
    };
  }
  return context;
}
