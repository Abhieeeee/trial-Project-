"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: fine)").matches;
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);
  
  // Custom cursor position motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring animations for trailing ring (slight lag, smooth feel)
  const springConfig = { stiffness: 250, damping: 28, mass: 0.4 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  // Ref to track the current magnetic element we are hovering over
  const activeMagneticRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    // Dynamically hide standard cursor when custom cursor component mounts
    document.documentElement.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;

      if (activeMagneticRef.current) {
        // Magnetic calculations: pull cursor toward the center of the hovered element
        const rect = activeMagneticRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Lerp 60% towards the center of the button for magnetic feel
        targetX = targetX + (centerX - targetX) * 0.45;
        targetY = targetY + (centerY - targetY) * 0.45;
      }

      cursorX.set(targetX);
      cursorY.set(targetY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Expand outer ring on links, buttons, inputs and clickable items
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest('[role="button"]') ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.hasAttribute("data-hover");

      setIsHovered(!!isClickable);

      // Check if it's a magnetic element
      const magneticEl = target.closest("[data-magnetic]") as HTMLElement;
      if (magneticEl) {
        activeMagneticRef.current = magneticEl;
        setIsMagnetic(true);

        // Also add a physical magnetic translation to the button itself for complete polish!
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const onMouseMoveMagnetic = (moveEvent: MouseEvent) => {
          const dx = moveEvent.clientX - centerX;
          const dy = moveEvent.clientY - centerY;
          // Subtly shift the element itself (max 12px)
          magneticEl.style.transform = `translate(${dx * 0.2}px, ${dy * 0.2}px)`;
        };

        const onMouseLeaveMagnetic = () => {
          magneticEl.style.transform = "translate(0px, 0px)";
          magneticEl.removeEventListener("mousemove", onMouseMoveMagnetic);
          magneticEl.removeEventListener("mouseleave", onMouseLeaveMagnetic);
          if (activeMagneticRef.current === magneticEl) {
            activeMagneticRef.current = null;
            setIsMagnetic(false);
          }
        };

        magneticEl.addEventListener("mousemove", onMouseMoveMagnetic);
        magneticEl.addEventListener("mouseleave", onMouseLeaveMagnetic);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Center Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#00d2ff] rounded-full pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ x: cursorX, y: cursorY }}
      />

      {/* 2. Glowing Spring Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          width: isHovered ? (isMagnetic ? 60 : 50) : 24,
          height: isHovered ? (isMagnetic ? 60 : 50) : 24,
          backgroundColor: isHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0)",
          borderColor: isHovered 
            ? (isMagnetic ? "rgba(125, 211, 252, 0.8)" : "rgba(255, 255, 255, 0.8)")
            : "rgba(255, 255, 255, 0.4)",
          boxShadow: isHovered && isMagnetic 
            ? "0 0 15px rgba(125, 211, 252, 0.3)" 
            : "none",
        }}
        transition={{
          width: { type: "spring", stiffness: 300, damping: 25 },
          height: { type: "spring", stiffness: 300, damping: 25 },
          backgroundColor: { duration: 0.15 },
          borderColor: { duration: 0.15 },
        }}
      />
    </>
  );
}
