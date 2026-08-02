"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, Sparkles, SlidersHorizontal } from "lucide-react";

interface Product360RotatorProps {
  productName: string;
  activeColor: string;
  onColorChange: (color: string) => void;
}

export default function Product360Rotator({
  productName,
  activeColor,
  onColorChange,
}: Product360RotatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const angleStartRef = useRef(0);

  const colors = [
    { id: "cyan", name: "Obsidian Cyan", hex: "#00D2FF", glow: "rgba(0, 210, 255, 0.4)" },
    { id: "black", name: "Matte Black", hex: "#171717", glow: "rgba(255, 255, 255, 0.2)" },
    { id: "gray", name: "Stealth Gray", hex: "#737373", glow: "rgba(115, 115, 115, 0.4)" },
  ];

  // Render 3D 360 Canvas Rotator Wireframe & Lighting
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const activeColorHex = colors.find((c) => c.name === activeColor)?.hex || "#00D2FF";

    const render3D = () => {
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const rad = (rotationAngle * Math.PI) / 180;
      const centerX = w / 2;
      const centerY = h / 2 + 10;
      const radiusX = Math.min(w, h) * 0.32;
      const radiusY = radiusX * 0.4;

      // Draw 360 Base Ring Surface
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 90, radiusX * 1.1, radiusY * 1.1, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 3D Wireframe Silhouette Nodes (360 degrees)
      const numNodes = 24;
      for (let i = 0; i < numNodes; i++) {
        const theta = (i / numNodes) * Math.PI * 2 + rad;
        const x = centerX + Math.cos(theta) * radiusX;
        const y = centerY + Math.sin(theta) * radiusY - 30;
        const z = Math.sin(theta); // depth factor

        const scale = 0.75 + (z + 1) * 0.25;
        const alpha = Math.max(0.1, (z + 1) / 2);

        ctx.fillStyle = activeColorHex;
        ctx.beginPath();
        ctx.arc(x, y, 3 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Connect vertical 3D garment wireframe lines
        ctx.strokeStyle = `rgba(0, 210, 255, ${alpha * 0.25})`;
        ctx.lineWidth = 0.8 * scale;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 100 * scale);
        ctx.stroke();
      }

      // Draw active orientation indicator ray
      const frontX = centerX + Math.cos(rad) * radiusX;
      const frontY = centerY + Math.sin(rad) * radiusY + 90;
      ctx.strokeStyle = "#00D2FF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY + 90);
      ctx.lineTo(frontX, frontY);
      ctx.stroke();

      ctx.fillStyle = "#00D2FF";
      ctx.beginPath();
      ctx.arc(frontX, frontY, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render3D);
    };

    render3D();

    return () => cancelAnimationFrame(animId);
  }, [rotationAngle, activeColor]);

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = e.clientX;
    angleStartRef.current = rotationAngle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartRef.current;
    setRotationAngle((angleStartRef.current + delta * 0.8) % 360);
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-[#0a0a0e]/95 space-y-4 font-mono text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 text-[#00D2FF]">
          <RotateCw className={`w-4 h-4 ${isDragging ? "animate-spin" : ""}`} />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            3D 360° Colorway Rotator
          </span>
        </div>
        <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
          {Math.round((rotationAngle + 360) % 360)}° View Angle
        </span>
      </div>

      {/* 3D Canvas Box */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative aspect-video w-full bg-neutral-950/80 rounded-xl overflow-hidden border border-white/5 cursor-grab active:cursor-grabbing flex items-center justify-center group"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Help Tip Overlay */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[8px] text-neutral-400 uppercase tracking-wider backdrop-blur-md">
          Drag horizontally to rotate 360°
        </div>
      </div>

      {/* Interactive Colorway Swatches */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">
          Active Fabric Shade:
        </span>
        <div className="flex items-center gap-2">
          {colors.map((c) => {
            const isSelected = activeColor === c.name;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onColorChange(c.name);
                  setRotationAngle((prev) => (prev + 90) % 360);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] uppercase font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#00D2FF] bg-[#00D2FF]/15 text-white shadow-[0_0_12px_rgba(0,210,255,0.3)]"
                    : "border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white/30"
                  style={{ backgroundColor: c.hex }}
                />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
