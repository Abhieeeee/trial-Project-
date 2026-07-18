"use client";

import { useEffect, useRef } from "react";

export default function HeroWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    const cols = 56;
    const rows = 28;
    const spacing = 28;
    const focalLength = 550;
    const cameraZ = 250;

    const render = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      time += 0.006;

      const points: { x: number; y: number; z: number; sx: number; sy: number; opacity: number }[] = [];
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = (col - cols / 2) * spacing;
          const z = (row - rows / 2) * spacing + 60;

          // Undulating waves
          const w1 = Math.sin(col * 0.12 + time * 1.1) * 20;
          const w2 = Math.cos(row * 0.14 + time * 0.8) * 14;
          let y = w1 + w2 + 20; // lower down in space

          const depth = z + cameraZ;
          const scale = focalLength / Math.max(1, depth);
          const sx = w / 2 + x * scale;
          const sy = h / 2 + y * scale;

          // Mouse ripple displacement
          if (mouseRef.current.active) {
            const dx = sx - mx;
            const dy = sy - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              const force = (1 - dist / 180) * 40;
              y += Math.sin(dist * 0.08 - time * 5) * force;
            }
          }

          const finalSy = h / 2 + y * scale;

          const distFromCenter = Math.sqrt(
            Math.pow((col - cols / 2) / (cols / 2), 2) +
            Math.pow((row - rows / 2) / (rows / 2), 2)
          );
          const opacity = Math.max(0, 0.08 * (1 - distFromCenter * 0.75) * Math.min(1, scale));

          points.push({ x, y, z, sx, sy: finalSy, opacity });
        }
      }

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols - 1; col++) {
          const i = row * cols + col;
          const j = i + 1;
          const p1 = points[i];
          const p2 = points[j];
          if (!p1 || !p2) continue;

          const avgOpacity = (p1.opacity + p2.opacity) / 2;
          if (avgOpacity < 0.01) continue;

          ctx.strokeStyle = `rgba(125, 211, 252, ${avgOpacity})`; // Brand-sky colored mesh lines!
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      }

      for (let row = 0; row < rows - 1; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * cols + col;
          const j = i + cols;
          const p1 = points[i];
          const p2 = points[j];
          if (!p1 || !p2) continue;

          const avgOpacity = (p1.opacity + p2.opacity) / 2;
          if (avgOpacity < 0.01) continue;

          ctx.strokeStyle = `rgba(125, 211, 252, ${avgOpacity * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ zIndex: 1 }}
    />
  );
}
