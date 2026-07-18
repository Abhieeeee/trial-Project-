"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  
  // Spring animations to make progress changes feel incredibly smooth and organic
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-brand-sky origin-left z-50"
      style={{
        scaleX,
        boxShadow: "0 0 12px #7dd3fc, 0 0 4px #7dd3fc",
      }}
    />
  );
}
