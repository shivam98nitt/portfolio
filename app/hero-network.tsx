'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type HeroNetworkProps = {
  reducedMotion?: boolean;
};

type NetworkData = {
  points: Float32Array;
  lines: Float32Array;
};

function buildNetwork(count: number): NetworkData {
  const points = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const spiral = index * 2.3999632297;
    const layer = (index % 7) / 7;
    const radius = 1.25 + layer * 1.65;
    const x = Math.cos(spiral) * radius + Math.sin(index * 0.61) * 0.35;
    const y = Math.sin(spiral) * radius * 0.62 + Math.cos(index * 0.43) * 0.28;
    const z = Math.sin(index * 1.17) * 1.15 - 0.45;

    points[index * 3] = x;
    points[index * 3 + 1] = y;
    points[index * 3 + 2] = z;
  }

  const segments: number[] = [];
  const maxDistance = count > 40 ? 1.38 : 1.58;
  const maxSegments = count > 40 ? 92 : 46;

  for (let a = 0; a < count && segments.length / 6 < maxSegments; a += 1) {
    const ax = points[a * 3];
    const ay = points[a * 3 + 1];
    const az = points[a * 3 + 2];

    for (let b = a + 1; b < Math.min(count, a + 10) && segments.length / 6 < maxSegments; b += 1) {
      const bx = points[b * 3];
      const by = points[b * 3 + 1];
      const bz = points[b * 3 + 2];
      const distance = Math.hypot(ax - bx, ay - by, az - bz);

      if (distance < maxDistance) {
        segments.push(ax, ay, az, bx, by, bz);
      }
    }
  }

  return { points, lines: new Float32Array(segments) };
}

function Network({ compact, reducedMotion }: { compact: boolean; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const data = useMemo(() => buildNetwork(compact ? 30 : 58), [compact]);

  useEffect(() => {
    if (reducedMotion || compact) return undefined;

    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointerTarget.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [compact, reducedMotion]);

  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;

    const targetY = pointerTarget.current.x * 0.11;
    const targetX = -pointerTarget.current.y * 0.07;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.035);
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.13) * 0.025;
    group.current.position.y = Math.sin(clock.elapsedTime * 0.22) * 0.045;
  });

  return (
    <group ref={group} rotation={[0.03, -0.08, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.points, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#92f3cf"
          size={compact ? 0.055 : 0.047}
          transparent
          opacity={compact ? 0.48 : 0.58}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#adb3ff" transparent opacity={compact ? 0.12 : 0.18} depthWrite={false} />
      </lineSegments>

      <mesh position={[1.25, 0.65, -1.5]}>
        <sphereGeometry args={[0.72, 20, 20]} />
        <meshBasicMaterial color="#92f3cf" transparent opacity={0.035} depthWrite={false} />
      </mesh>
      <mesh position={[-1.4, -0.65, -1.9]}>
        <sphereGeometry args={[0.92, 20, 20]} />
        <meshBasicMaterial color="#adb3ff" transparent opacity={0.03} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function HeroNetwork({ reducedMotion = false }: HeroNetworkProps) {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 720px)');
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return (
    <div className="hero-network-canvas" aria-hidden="true">
      <Canvas
        dpr={compact ? [1, 1.15] : [1, 1.4]}
        camera={{ position: [0, 0, 6.2], fov: 52 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <Network compact={compact} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
