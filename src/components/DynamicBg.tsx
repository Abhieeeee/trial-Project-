"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  maxOpacity: number;
}

export default function DynamicBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle count
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const particles: Particle[] = [];

    const createParticle = (initY = false): Particle => {
      const maxOpacity = Math.random() * 0.4 + 0.1;
      return {
        x: Math.random() * width,
        y: initY ? Math.random() * height : height + 10,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -(Math.random() * 0.2 + 0.1),
        opacity: initY ? Math.random() * maxOpacity : 0,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        maxOpacity,
      };
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update particles
      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Fade in or fade out near lifetime boundaries
        if (p.opacity < p.maxOpacity && p.y > 50) {
          p.opacity += p.fadeSpeed;
        }

        if (p.y <= 50) {
          p.opacity -= p.fadeSpeed * 2;
        }

        // Reset particle if off-screen or faded out
        if (p.y < -10 || p.opacity <= 0) {
          particles[idx] = createParticle(false);
        }

        // Draw particle with subtle sky-blue tint glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 211, 252, ${Math.max(0, Math.min(1, p.opacity))})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(125, 211, 252, 0.3)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-50 overflow-hidden bg-black"
    >
      {/* Heavy Studio Dark Vignette & Depth Gradients */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505] to-[#000000] opacity-90" />
      
      {/* Sky Blue Ambient Glow Backplate */}
      <div className="absolute top-[-20%] left-[20%] h-[60%] w-[60%] rounded-full bg-brand-sky/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] h-[50%] w-[50%] rounded-full bg-brand-sky/3 blur-[120px] pointer-events-none" />

      {/* Cinematic Volumetric Light Beams */}
      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20">
        <div className="absolute top-[-50%] left-[-20%] w-[40%] h-[200%] bg-gradient-to-r from-transparent via-brand-sky/10 to-transparent rotate-[35deg] animate-[sweep_25s_ease-in-out_infinite]" />
        <div className="absolute top-[-50%] right-[-10%] w-[35%] h-[200%] bg-gradient-to-r from-transparent via-brand-sky/8 to-transparent rotate-[25deg] animate-[sweep_18s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Floating Fog Layer using CSS animations and blurs */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen select-none">
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-neutral-900/40 blur-[80px] animate-[drift_20s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[-15%] w-[50%] h-[40%] rounded-full bg-neutral-900/30 blur-[90px] animate-[drift_28s_ease-in-out_infinite_reverse]" />
      </div>

      {/* Dust Particles Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      <style jsx global>{`
        @keyframes sweep {
          0%, 100% {
            transform: translateX(-10%) rotate(35deg);
            opacity: 0.15;
          }
          50% {
            transform: translateX(40%) rotate(30deg);
            opacity: 0.35;
          }
        }
        @keyframes drift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(8%, -6%) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
