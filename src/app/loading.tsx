"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loading() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hudIndex, setHudIndex] = useState(0);

  const hudSteps = [
    "INITIALIZING CORE SYSTEM PROTOCOLS...",
    "ESTABLISHING AURA.SECURE HANDSHAKE...",
    "LOADING 3D GEOMETRY AND SPATIAL ASSETS...",
    "DECRYPTING DESIGN ENVELOPE...",
    "SYSTEM DEPLOYMENT SUCCESSFUL // GATE OPEN",
  ];

  useEffect(() => {
    // HUD text step animation
    const interval = setInterval(() => {
      setHudIndex((prev) => (prev < hudSteps.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; size: number; speedY: number; opacity: number }[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed floating dust particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 0.4 + 0.1),
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw faint grid gridlines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 0.5;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw floating cyber-dust
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(125, 211, 252, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speedY;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#030303] z-[9999] flex flex-col items-center justify-center font-mono overflow-hidden select-none">
      
      {/* Dynamic Cyber Grid & Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      />

      {/* Cybernetic Scanline Laser Sweep */}
      <div 
        className="absolute left-0 w-full h-[1.5px] bg-[#7dd3fc]/20 pointer-events-none"
        style={{
          boxShadow: "0 0 15px 1px #7dd3fc",
          animation: "scanline-sweep 4s infinite linear",
          zIndex: 10,
        }}
      />

      {/* Futuristic CRT scanlines effect overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-40 z-20" />

      {/* Center Cinematic Container */}
      <div className="relative flex flex-col items-center gap-8 z-30">
        
        {/* Animated Tech circular dial */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.svg
            className="w-full h-full text-white/5"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4 8"
              fill="none"
            />
          </motion.svg>

          <motion.svg
            className="absolute w-24 h-24 text-[#7dd3fc]/30"
            viewBox="0 0 100 100"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="40 10 15 25"
              fill="none"
            />
          </motion.svg>

          {/* Tiny blinking center dot */}
          <div className="absolute w-2.5 h-2.5 bg-[#7dd3fc] rounded-full animate-ping" />
          <div className="absolute w-1.5 h-1.5 bg-[#7dd3fc] rounded-full shadow-[0_0_10px_#7dd3fc]" />
        </div>

        {/* Wordmark & Info HUD */}
        <div className="flex flex-col items-center gap-3 text-center">
          
          <motion.h1
            className="text-lg md:text-xl tracking-[0.5em] text-white font-extrabold uppercase"
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            AURA.STREET
          </motion.h1>

          <div className="h-6 flex items-center justify-center mt-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={hudIndex}
                className="text-[8px] uppercase tracking-[0.25em] text-[#7dd3fc] font-bold text-glow-sky"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.85, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {hudSteps[hudIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

        </div>

        {/* System parameters list overlay */}
        <div className="absolute -bottom-24 flex gap-10 text-[7px] text-neutral-600 uppercase tracking-widest font-mono">
          <div>LATENCY // 14MS</div>
          <div>COORD // 48.8566° N</div>
          <div>ENCRYPT // AES-GCM</div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes scanline-sweep {
          0% {
            top: -5%;
          }
          100% {
            top: 105%;
          }
        }
      `}</style>
    </div>
  );
}
