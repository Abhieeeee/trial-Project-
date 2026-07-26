"use client";

import { useEffect, useRef } from "react";

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

    // Mouse tracking with smooth spring interpolation
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 200,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 3D Grid Parameters
    const cols = 28;
    const rows = 20;
    const spacing = 65;
    const fov = 380;

    interface Node3D {
      bx: number; // base x
      by: number; // base y
      bz: number; // base z
      x: number;
      y: number;
      z: number;
      px: number; // projected screen x
      py: number; // projected screen y
      scale: number;
    }

    const nodes: Node3D[] = [];

    // Initialize 3D Grid Nodes
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bx = (c - cols / 2) * spacing;
        const by = (r - rows / 2) * spacing + 100;
        const bz = 0;
        nodes.push({
          bx,
          by,
          bz,
          x: bx,
          y: by,
          z: bz,
          px: 0,
          py: 0,
          scale: 1,
        });
      }
    }

    const lerp = (start: number, end: number, amt: number) => start + (end - start) * amt;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x = lerp(mouse.x, mouse.targetX, 0.05);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.05);

      // Parallax 3D angles based on mouse offset from center
      const angleY = ((mouse.x - width / 2) / width) * 0.45;
      const angleX = -((mouse.y - height / 2) / height) * 0.35 + 0.45; // tilt floor perspective

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Project & update 3D nodes
      nodes.forEach((node) => {
        // Distance to screen-space mouse
        const dx = node.px - mouse.x;
        const dy = node.py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 3D Ripple Elevation Displacement
        let targetZ = node.bz;
        if (dist < mouse.radius) {
          const factor = (1 - dist / mouse.radius);
          targetZ = node.bz + Math.sin(factor * Math.PI) * 75;
        }

        node.z = lerp(node.z, targetZ, 0.1);

        // 3D Rotation (Y-axis then X-axis)
        let rx1 = node.bx * cosY + node.z * sinY;
        let ry1 = node.by;
        let rz1 = -node.bx * sinY + node.z * cosY;

        let rx2 = rx1;
        let ry2 = ry1 * cosX - rz1 * sinX;
        let rz2 = ry1 * sinX + rz1 * cosX + 450; // offset Z to camera

        // Perspective Projection
        const scale = fov / (fov + rz2);
        node.scale = scale;
        node.px = width / 2 + rx2 * scale;
        node.py = height / 2 + ry2 * scale;
      });

      // Draw Grid Lines connecting nodes
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const currIdx = r * cols + c;
          const curr = nodes[currIdx];

          // Draw Right Connection
          if (c < cols - 1) {
            const right = nodes[currIdx + 1];
            const lineAlpha = Math.min(0.25, Math.max(0.02, (curr.scale - 0.4) * 0.3));
            ctx.beginPath();
            ctx.moveTo(curr.px, curr.py);
            ctx.lineTo(right.px, right.py);
            ctx.strokeStyle = `rgba(0, 210, 255, ${lineAlpha})`;
            ctx.stroke();
          }

          // Draw Bottom Connection
          if (r < rows - 1) {
            const bottom = nodes[currIdx + cols];
            const lineAlpha = Math.min(0.25, Math.max(0.02, (curr.scale - 0.4) * 0.3));
            ctx.beginPath();
            ctx.moveTo(curr.px, curr.py);
            ctx.lineTo(bottom.px, bottom.py);
            ctx.strokeStyle = `rgba(0, 210, 255, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw Glowing Particle Node Points
      nodes.forEach((node) => {
        if (node.scale <= 0.2) return;
        const dx = node.px - mouse.x;
        const dy = node.py - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const isHovered = dist < mouse.radius;
        const pointSize = Math.max(1, (isHovered ? 3.5 : 1.8) * node.scale);
        const alpha = isHovered
          ? Math.min(0.9, (1 - dist / mouse.radius) * 0.9 + 0.2)
          : Math.min(0.35, node.scale * 0.35);

        ctx.beginPath();
        ctx.arc(node.px, node.py, pointSize, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? `rgba(0, 210, 255, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;

        if (isHovered) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = "#00D2FF";
        } else {
          ctx.shadowBlur = 0;
        }

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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden bg-[#030305] pointer-events-none"
    >
      {/* Radial Dark Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030305]/80 to-[#030305] opacity-95 pointer-events-none" />

      {/* Cyan Ambient Backlight Orbs */}
      <div className="absolute top-[10%] left-[25%] h-[500px] w-[500px] rounded-full bg-[#00D2FF]/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[15%] h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[140px] pointer-events-none" />

      {/* 3D Pattern Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
}
