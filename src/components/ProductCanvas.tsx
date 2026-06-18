"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Suspense } from "react";
import HoodieModel from "./HoodieModel";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Camera parallax and auto-centering rig
function CameraRig() {
  useFrame((state) => {
    // Lerp camera position based on mouse position to create cinematic depth
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.3, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.2 + 0.1, 0.05);
    state.camera.lookAt(0, -0.1, 0);
  });
  return null;
}

export default function ProductCanvas() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Minimalist Premium Spinner */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-neutral-900" />
              <div className="absolute inset-0 rounded-full border-t border-brand-sky animate-spin" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-500">
                Aura
              </span>
            </div>
          </div>
        }
      >
        <Canvas
          shadows
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          camera={{ position: [0, 0, 2.6], fov: 45 }}
          dpr={[1, 2]} // High DPI optimization
          className="w-full h-full block"
        >
          {/* Ambient lighting to soften the overall scene */}
          <ambientLight intensity={0.4} />

          {/* Key Light: Strong cool light highlighting the main folds and shape from top-right */}
          <directionalLight
            position={[4, 5, 3]}
            intensity={2.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />

          {/* Fill Light: Soft warm light filling in shadows from bottom-left */}
          <directionalLight position={[-4, -2, 2]} intensity={1.2} color="#fef08a" />

          {/* Rim Light: High intensity backlight behind model to make edges glow, giving studio photography finish */}
          <directionalLight position={[0, 4, -5]} intensity={4.5} color="#e0f2fe" />

          {/* Subtle accent light from the front */}
          <spotLight position={[0, 0, 5]} intensity={0.8} distance={10} angle={0.3} penumbra={1} />

          {/* Procedural Hoodie Model */}
          <HoodieModel />

          {/* Contact Shadows: ground the model with soft floor shadows */}
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.75}
            scale={5.0}
            blur={2.4}
            far={2.0}
          />

          {/* Camera movement controller */}
          <CameraRig />
        </Canvas>
      </Suspense>
    </div>
  );
}
