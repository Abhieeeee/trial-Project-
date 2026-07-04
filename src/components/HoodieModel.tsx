"use client";

import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function HoodieModel() {
  const groupRef = useRef<THREE.Group>(null);

  // 1. Procedural Cotton Weave Normal Map Generator
  const fabricNormalMap = useMemo(() => {
    // Generate a high-frequency, tileable grid normal map in memory
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      // Neutral normal map color: rgb(128, 128, 255)
      ctx.fillStyle = "rgb(128, 128, 255)";
      ctx.fillRect(0, 0, 256, 256);
      
      const imgData = ctx.getImageData(0, 0, 256, 256);
      const data = imgData.data;
      
      for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
          const idx = (y * 256 + x) * 4;
          
          // Microscopic textile thread weave simulation
          const waveX = Math.sin(x * 1.8) * 12;
          const waveY = Math.sin(y * 1.8) * 12;
          
          // Alternating warp and weft fibers
          const isWarp = (Math.floor(x / 2) + Math.floor(y / 2)) % 2 === 0;
          const fiberHeight = isWarp ? waveX : waveY;
          
          // Deterministic micro-noise keeps the weave organic without changing between renders.
          const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const noise = (seed - Math.floor(seed) - 0.5) * 6;
          
          data[idx] = Math.max(0, Math.min(255, 128 + fiberHeight + noise)); // X normal offset
          data[idx + 1] = Math.max(0, Math.min(255, 128 + (isWarp ? waveY : waveX) + noise)); // Y normal offset
          data[idx + 2] = 255; // Keep Z normal pointing outward
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(30, 30);
    return texture;
  }, []);

  // 2. High-Fashion Matte Fabrics and Ribbed Hem Materials
  const materials = useMemo(() => {
    const mainFabric = new THREE.MeshStandardMaterial({
      color: 0x111111, // Ultra-lux dark grey (not raw black to reveal details in shadow)
      roughness: 0.82,
      metalness: 0.05,
      normalMap: fabricNormalMap,
      normalScale: new THREE.Vector2(0.18, 0.18),
      side: THREE.DoubleSide,
    });

    const ribbedFabric = new THREE.MeshStandardMaterial({
      color: 0x0f0f0f, // Marginally darker for contrast
      roughness: 0.9,
      metalness: 0.05,
      normalMap: fabricNormalMap,
      normalScale: new THREE.Vector2(0.35, 0.35), // Deeper ridges
      side: THREE.DoubleSide,
    });

    const agletMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0e0e0, // Brushed chrome aglet metal
      roughness: 0.2,
      metalness: 0.95,
    });

    return { mainFabric, ribbedFabric, agletMaterial };
  }, [fabricNormalMap]);

  // 3. Custom Procedural Geometries (with folds, bulges, and organic shapes)
  const geometries = useMemo(() => {
    // A. Torso Geometry
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.35, 0.8, 64, 64);
    const torsoPos = torsoGeo.attributes.position;
    for (let i = 0; i < torsoPos.count; i++) {
      let x = torsoPos.getX(i);
      const y = torsoPos.getY(i);
      let z = torsoPos.getZ(i);

      // Oversized baggy streetwear fit: bulge in the middle (waist)
      const heightPercent = (y + 0.4) / 0.8; // 0 to 1
      const puff = 1.0 + Math.sin(heightPercent * Math.PI) * 0.14;
      x *= puff;
      z *= puff;

      // Physical horizontal and diagonal fabric wrinkles
      const angle = Math.atan2(z, x);
      const folds = Math.sin(y * 14 + angle * 3.5) * 0.012 * Math.sin(heightPercent * Math.PI);
      x += Math.cos(angle) * folds;
      z += Math.sin(angle) * folds;

      torsoPos.setXYZ(i, x, y, z);
    }
    torsoGeo.computeVertexNormals();

    // B. Kangaroo Pocket
    const pocketGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.24, 40, 16, true, -Math.PI / 4, Math.PI / 2);
    const pocketPos = pocketGeo.attributes.position;
    for (let i = 0; i < pocketPos.count; i++) {
      const x = pocketPos.getX(i);
      const y = pocketPos.getY(i);
      let z = pocketPos.getZ(i);

      // Push pocket geometry slightly forward of the torso and stitch edges
      z += 0.032;
      const angle = Math.atan2(z, x);
      const edgeWeight = Math.abs(angle);
      
      if (edgeWeight > 0.45) {
        z -= (edgeWeight - 0.45) * 0.06; // Pull edges backward so they blend into torso
      }

      // Add a small bulge to the pocket
      const heightPercent = (y + 0.12) / 0.24;
      z += Math.sin(heightPercent * Math.PI) * 0.012;

      pocketPos.setXYZ(i, x, y, z);
    }
    pocketGeo.computeVertexNormals();

    // C. Hood Geometry (Draped Sphere)
    const hoodGeo = new THREE.SphereGeometry(0.25, 64, 64, 0, Math.PI * 1.4, 0, Math.PI);
    const hoodPos = hoodGeo.attributes.position;
    for (let i = 0; i < hoodPos.count; i++) {
      let x = hoodPos.getX(i);
      let y = hoodPos.getY(i);
      let z = hoodPos.getZ(i);

      // Pull the back of the hood outwards and upwards for pointed streetwear drape
      if (z < 0) {
        z -= 0.065 * (y + 0.15); // Drape back
        x *= 0.94; // Flatten sides
      }
      if (y > 0) {
        y += 0.038;
        z -= 0.015;
      }
      
      // Fabric weight folds
      const fold = Math.sin(y * 10 + x * 5) * 0.006;
      y += fold;

      hoodPos.setXYZ(i, x, y, z);
    }
    hoodGeo.computeVertexNormals();

    // D. Left Sleeve (Bent Tube)
    const leftSleevePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.32, 0.0),
      new THREE.Vector3(-0.58, 0.14, 0.04),
      new THREE.Vector3(-0.68, -0.15, 0.04),
      new THREE.Vector3(-0.52, -0.42, 0.09),
    ]);
    const leftSleeveGeo = new THREE.TubeGeometry(leftSleevePath, 48, 0.115, 24, false);
    const leftSleevePos = leftSleeveGeo.attributes.position;
    for (let i = 0; i < leftSleevePos.count; i++) {
      const vx = leftSleevePos.getX(i);
      const vy = leftSleevePos.getY(i);
      const vz = leftSleevePos.getZ(i);
      const fold = Math.sin(vy * 18 + vx * 12) * 0.007;
      leftSleevePos.setXYZ(i, vx + fold, vy, vz + fold);
    }
    leftSleeveGeo.computeVertexNormals();

    // E. Right Sleeve (Bent Tube)
    const rightSleevePath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, 0.32, 0.0),
      new THREE.Vector3(0.58, 0.14, 0.04),
      new THREE.Vector3(0.68, -0.15, 0.04),
      new THREE.Vector3(0.52, -0.42, 0.09),
    ]);
    const rightSleeveGeo = new THREE.TubeGeometry(rightSleevePath, 48, 0.115, 24, false);
    const rightSleevePos = rightSleeveGeo.attributes.position;
    for (let i = 0; i < rightSleevePos.count; i++) {
      const vx = rightSleevePos.getX(i);
      const vy = rightSleevePos.getY(i);
      const vz = rightSleevePos.getZ(i);
      const fold = Math.sin(vy * 18 + vx * 12) * 0.007;
      rightSleevePos.setXYZ(i, vx + fold, vy, vz + fold);
    }
    rightSleeveGeo.computeVertexNormals();

    // F. Ribbed Elastic Details
    const hemGeo = new THREE.CylinderGeometry(0.35, 0.345, 0.075, 64, 4);
    const leftCuffGeo = new THREE.CylinderGeometry(0.062, 0.062, 0.07, 24, 4);
    const rightCuffGeo = new THREE.CylinderGeometry(0.062, 0.062, 0.07, 24, 4);
    const collarGeo = new THREE.TorusGeometry(0.15, 0.018, 12, 48);

    // G. Hanging Drawstrings
    const leftStringPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.07, 0.35, 0.18),
      new THREE.Vector3(-0.085, 0.16, 0.22),
      new THREE.Vector3(-0.06, -0.06, 0.21),
      new THREE.Vector3(-0.075, -0.26, 0.16),
    ]);
    const leftStringGeo = new THREE.TubeGeometry(leftStringPath, 32, 0.0055, 8, false);

    const rightStringPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.07, 0.35, 0.18),
      new THREE.Vector3(0.085, 0.18, 0.22),
      new THREE.Vector3(0.065, -0.04, 0.21),
      new THREE.Vector3(0.045, -0.22, 0.15),
    ]);
    const rightStringGeo = new THREE.TubeGeometry(rightStringPath, 32, 0.0055, 8, false);

    // H. Metal aglets
    const agletGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.035, 12);

    return {
      torsoGeo,
      pocketGeo,
      hoodGeo,
      leftSleeveGeo,
      rightSleeveGeo,
      hemGeo,
      leftCuffGeo,
      rightCuffGeo,
      collarGeo,
      leftStringGeo,
      rightStringGeo,
      agletGeo,
    };
  }, []);

  // 4. Smooth floating and mouse interpolation loop
  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Subtle breathing/floating vertical translation
    groupRef.current.position.y = Math.sin(time * 1.2) * 0.06;

    // Subtle organic idle rotation (wind/draft simulation)
    const idleRotY = Math.sin(time * 0.35) * 0.05;
    const idleRotX = Math.cos(time * 0.35) * 0.02;

    // Mouse interactive target rotation (with 0.45x yaw scale and 0.25x pitch scale)
    const targetY = state.pointer.x * 0.5 + idleRotY;
    const targetX = -state.pointer.y * 0.3 + idleRotX;

    // Butter-smooth lerping with no snapping
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.075);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.075);
    
    // Very subtle horizontal roll based on cursor position
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, state.pointer.x * 0.08, 0.075);
  });

  return (
    <group ref={groupRef} scale={[2.3, 2.3, 2.3]} position={[0, -0.2, 0]}>
      {/* Torso */}
      <mesh geometry={geometries.torsoGeo} material={materials.mainFabric} castShadow receiveShadow />

      {/* Front Kangaroo Pocket */}
      <mesh 
        geometry={geometries.pocketGeo} 
        material={materials.mainFabric} 
        position={[0, -0.16, 0.11]} 
        castShadow 
        receiveShadow 
      />

      {/* Hood (Rotated to face forward) */}
      <mesh
        geometry={geometries.hoodGeo}
        material={materials.mainFabric}
        position={[0, 0.39, 0.015]}
        rotation={[-Math.PI * 0.05, -Math.PI * 0.7, 0]}
        castShadow
        receiveShadow
      />

      {/* Bent Sleeves */}
      <mesh geometry={geometries.leftSleeveGeo} material={materials.mainFabric} castShadow receiveShadow />
      <mesh geometry={geometries.rightSleeveGeo} material={materials.mainFabric} castShadow receiveShadow />

      {/* Ribbed Bottom Hem */}
      <mesh 
        geometry={geometries.hemGeo} 
        material={materials.ribbedFabric} 
        position={[0, -0.435, 0]} 
        castShadow 
        receiveShadow 
      />

      {/* Wrist Cuffs */}
      <mesh
        geometry={geometries.leftCuffGeo}
        material={materials.ribbedFabric}
        position={[-0.51, -0.45, 0.095]}
        rotation={[0.1, 0, 0.35]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={geometries.rightCuffGeo}
        material={materials.ribbedFabric}
        position={[0.51, -0.45, 0.095]}
        rotation={[0.1, 0, -0.35]}
        castShadow
        receiveShadow
      />

      {/* Ribbed Collar Band */}
      <mesh
        geometry={geometries.collarGeo}
        material={materials.ribbedFabric}
        position={[0, 0.39, 0.045]}
        rotation={[Math.PI / 2 + 0.1, 0, 0]}
        castShadow
        receiveShadow
      />

      {/* Hanging Drawstrings */}
      <mesh geometry={geometries.leftStringGeo} material={materials.ribbedFabric} castShadow />
      <mesh geometry={geometries.rightStringGeo} material={materials.ribbedFabric} castShadow />

      {/* Brushed Chrome Aglet Ends */}
      <mesh
        geometry={geometries.agletGeo}
        material={materials.agletMaterial}
        position={[-0.075, -0.28, 0.16]}
        rotation={[-0.1, 0, -0.05]}
        castShadow
      />
      <mesh
        geometry={geometries.agletGeo}
        material={materials.agletMaterial}
        position={[0.045, -0.24, 0.15]}
        rotation={[-0.1, 0, 0.08]}
        castShadow
      />
    </group>
  );
}
