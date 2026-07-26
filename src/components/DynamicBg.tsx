"use client";

import { useEffect, useRef } from "react";

export default function DynamicBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    // Mouse tracking with smooth spring interpolation
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      radius: 220,
      active: false,
      idleTimer: 0,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
      mouse.idleTimer = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Denser 3D Grid — 35×24
    const cols = 35;
    const rows = 24;
    const spacing = 60;
    const fov = 400;

    interface Node3D {
      bx: number;
      by: number;
      bz: number;
      x: number;
      y: number;
      z: number;
      px: number;
      py: number;
      scale: number;
      phase: number; // individual breathing phase offset
    }

    const nodes: Node3D[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const bx = (c - cols / 2) * spacing;
        const by = (r - rows / 2) * spacing + 80;
        nodes.push({
          bx, by, bz: 0,
          x: bx, y: by, z: 0,
          px: 0, py: 0, scale: 1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    const lerp = (start: number, end: number, amt: number) =>
      start + (end - start) * amt;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;
      mouse.idleTimer += 1;
      if (mouse.idleTimer > 180) mouse.active = false;

      // Smooth mouse interpolation
      mouse.x = lerp(mouse.x, mouse.targetX, 0.06);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.06);

      // Ambient slow drift when mouse is idle
      const idleFactor = mouse.active ? 0 : 1;
      const idleOffsetX = idleFactor * Math.sin(time * 0.28) * 180;
      const idleOffsetY = idleFactor * Math.cos(time * 0.18) * 100;

      const effectiveMouseX = mouse.active ? mouse.x : width / 2 + idleOffsetX;
      const effectiveMouseY = mouse.active ? mouse.y : height / 2 + idleOffsetY;

      // Parallax 3D angles
      const angleY = ((effectiveMouseX - width / 2) / width) * 0.42;
      const angleX = -((effectiveMouseY - height / 2) / height) * 0.32 + 0.42;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // Project & update 3D nodes
      nodes.forEach((node) => {
        const dx = node.px - effectiveMouseX;
        const dy = node.py - effectiveMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 3D Ripple Elevation
        let targetZ = node.bz;
        if (dist < mouse.radius) {
          const factor = 1 - dist / mouse.radius;
          targetZ = node.bz + Math.sin(factor * Math.PI) * 90;
        }

        // Ambient wave undulation (idle breathing)
        targetZ += Math.sin(time * 0.9 + node.phase) * 12 * idleFactor;

        node.z = lerp(node.z, targetZ, 0.1);

        // 3D Rotation
        const rx1 = node.bx * cosY + node.z * sinY;
        const ry1 = node.by;
        const rz1 = -node.bx * sinY + node.z * cosY;

        const rx2 = rx1;
        const ry2 = ry1 * cosX - rz1 * sinX;
        const rz2 = ry1 * sinX + rz1 * cosX + 480;

        const scale = fov / (fov + rz2);
        node.scale = scale;
        node.px = width / 2 + rx2 * scale;
        node.py = height / 2 + ry2 * scale;
      });

      // Draw Grid Lines
      ctx.lineWidth = 0.8;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const currIdx = r * cols + c;
          const curr = nodes[currIdx];

          if (c < cols - 1) {
            const right = nodes[currIdx + 1];
            const lineAlpha = Math.min(0.22, Math.max(0.015, (curr.scale - 0.4) * 0.28));
            ctx.beginPath();
            ctx.moveTo(curr.px, curr.py);
            ctx.lineTo(right.px, right.py);
            ctx.strokeStyle = `rgba(0, 210, 255, ${lineAlpha})`;
            ctx.stroke();
          }

          if (r < rows - 1) {
            const bottom = nodes[currIdx + cols];
            const lineAlpha = Math.min(0.18, Math.max(0.012, (curr.scale - 0.4) * 0.22));
            ctx.beginPath();
            ctx.moveTo(curr.px, curr.py);
            ctx.lineTo(bottom.px, bottom.py);
            ctx.strokeStyle = `rgba(0, 210, 255, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw Nodes — with breathing glow on hover
      nodes.forEach((node) => {
        if (node.scale <= 0.18) return;
        const dx = node.px - effectiveMouseX;
        const dy = node.py - effectiveMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const isHovered = dist < mouse.radius;
        const breatheFactor = isHovered
          ? 1 + Math.sin(time * 3.5 + node.phase) * 0.45
          : 1;

        const pointSize = Math.max(0.8, (isHovered ? 3.8 : 1.6) * node.scale * breatheFactor);
        const alpha = isHovered
          ? Math.min(0.95, (1 - dist / mouse.radius) * 0.85 + 0.2)
          : Math.min(0.3, node.scale * 0.3);

        // Color wave shift: white → cyan on hover proximity
        const hoverRatio = isHovered ? 1 - dist / mouse.radius : 0;
        const r = Math.round(255 * (1 - hoverRatio));
        const g = Math.round(210 + (255 - 210) * (1 - hoverRatio));
        const b = 255;

        ctx.beginPath();
        ctx.arc(node.px, node.py, pointSize, 0, Math.PI * 2);
        ctx.fillStyle = isHovered
          ? `rgba(${r}, ${g}, ${b}, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`;

        if (isHovered) {
          ctx.shadowBlur = 18 * breatheFactor;
          ctx.shadowColor = "#00D2FF";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
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
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#030305] pointer-events-none">
      {/* Deep radial vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, #030305 100%)"
        }}
      />

      {/* Subtle cyan atmospheric orbs */}
      <div className="absolute top-[8%] left-[20%] h-[600px] w-[600px] rounded-full bg-[#00D2FF]/[0.038] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[8%] right-[12%] h-[500px] w-[500px] rounded-full bg-[#0050AA]/[0.04] blur-[160px] pointer-events-none" />
      <div className="absolute top-[50%] right-[35%] h-[300px] w-[300px] rounded-full bg-[#00D2FF]/[0.022] blur-[120px] pointer-events-none" />

      {/* 3D Pattern Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Edge scanline fade */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #030305 0%, transparent 6%, transparent 94%, #030305 100%)"
        }}
      />
    </div>
  );
}
