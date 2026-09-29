"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

const prongPositions: [number, number, number][] = [
  [-0.43, 1.67, 0.18],
  [0.43, 1.67, 0.18],
  [-0.43, 1.18, 0.18],
  [0.43, 1.18, 0.18],
];

function Jewel({ pointer }) {
  const group = useRef<THREE.Group>(null);
  const gem = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.55 + state.clock.elapsedTime * 0.08, 0.04);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * -0.22 + 0.15, 0.04);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
    if (gem.current) {
      gem.current.rotation.y += delta * 0.22;
      gem.current.rotation.z += delta * 0.08;
    }
  });

  const gold = "#d8ad4f";

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.17, 48, 180]} />
        <meshPhysicalMaterial color={gold} metalness={1} roughness={0.14} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      <mesh position={[0, 1.33, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.075, 24, 100]} />
        <meshPhysicalMaterial color={gold} metalness={1} roughness={0.1} clearcoat={1} />
      </mesh>
      <mesh ref={gem} position={[0, 1.42, 0.03]} scale={[0.78, 0.98, 0.62]}>
        <octahedronGeometry args={[0.63, 2]} />
        <meshPhysicalMaterial color="#0a6b4e" roughness={0.02} transmission={0.65} thickness={1.2} ior={2.25} transparent opacity={0.96} clearcoat={1} />
      </mesh>
      {prongPositions.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshStandardMaterial color={gold} metalness={1} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

export default function JewelScene() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  return (
    <div
      className="h-full w-full"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPointer({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <Canvas camera={{ position: [0, 0.15, 5.2], fov: 38 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 5]} intensity={5.5} color="#fff1d2" />
        <directionalLight position={[-4, 1, 3]} intensity={3} color="#c9ecff" />
        <pointLight position={[0, -2, 4]} intensity={3.5} color="#d7aa55" />
        <Jewel pointer={pointer} />
      </Canvas>
    </div>
  );
}
