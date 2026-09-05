'use client';

import { Html } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

type SystemNode = {
  id: string;
  label: string;
  short: string;
  category: string;
  detail: string;
  proof: string;
  tech: string[];
  position: [number, number, number];
};

const SYSTEM_NODES: SystemNode[] = [
  {
    id: 'user',
    label: 'User',
    short: 'Input',
    category: 'Experience layer',
    detail: 'Natural-language queries and multimodal documents enter through a simple user-facing workflow.',
    proof: 'Production document workflows support 300+ internal users and 20+ vendors.',
    tech: ['Web UI', 'Documents', 'Natural language'],
    position: [-3.05, -0.35, 0.25],
  },
  {
    id: 'agent',
    label: 'Agent',
    short: 'Agent',
    category: 'Orchestration layer',
    detail: 'Stateful agent logic coordinates multi-step decisions, tool calls and human-review checkpoints.',
    proof: 'LangGraph powers stateful enterprise conversations and multi-step recommendation workflows.',
    tech: ['LangGraph', 'Guardrails', 'Human-in-loop'],
    position: [-2.05, 0.62, -0.15],
  },
  {
    id: 'mcp',
    label: 'MCP',
    short: 'Tools',
    category: 'Tool interface',
    detail: 'A clean tool-contract boundary lets agents reach business services and data without tightly coupling model logic to each backend.',
    proof: 'Used as an integration pattern for tool-oriented AI systems and service access.',
    tech: ['MCP', 'Tool contracts', 'Auth'],
    position: [-1.05, -0.24, 0.5],
  },
  {
    id: 'rag',
    label: 'RAG',
    short: 'Retrieve',
    category: 'Knowledge layer',
    detail: 'Retrieval narrows large enterprise knowledge bases into focused context before generation.',
    proof: 'Enterprise HR assistant combines vector search, ChromaDB and sentence-window retrieval for 80% faster query resolution.',
    tech: ['ChromaDB', 'Embeddings', 'Vector search'],
    position: [0, 0.65, -0.2],
  },
  {
    id: 'model',
    label: 'LLM / VLM',
    short: 'Models',
    category: 'Model layer',
    detail: 'Language and vision-language models handle generation, extraction and multimodal understanding.',
    proof: 'LLaMA 3.1-70B powers HR querying; Qwen2B VLM improved document extraction accuracy by 40%.',
    tech: ['LLaMA 3.1-70B', 'Qwen2B VLM', 'Prompting'],
    position: [1.05, -0.28, 0.48],
  },
  {
    id: 'api',
    label: 'APIs',
    short: 'Serve',
    category: 'Application layer',
    detail: 'Typed service boundaries expose model workflows safely to products, systems and automation.',
    proof: 'Built REST APIs with Node.js / Express and FastAPI, plus JWT/SSO and SQL persistence.',
    tech: ['FastAPI', 'Node.js', 'REST'],
    position: [2.08, 0.6, -0.18],
  },
  {
    id: 'k8s',
    label: 'Kubernetes',
    short: 'Scale',
    category: 'Infrastructure layer',
    detail: 'Containerized services move into cloud-native infrastructure where scaling, health and deployment become repeatable.',
    proof: 'Docker, Kubernetes, AWS and CI/CD form the deployment and operations layer of the engineering stack.',
    tech: ['Docker', 'Kubernetes', 'AWS'],
    position: [3.08, -0.34, 0.24],
  },
];

function scenePosition(position: [number, number, number], compact: boolean): [number, number, number] {
  if (!compact) return position;
  return [position[0] * 0.72, position[1] * 0.78, position[2]];
}

function SystemNodeMesh({
  node,
  compact,
  selected,
  reducedMotion,
  onSelect,
}: {
  node: SystemNode;
  compact: boolean;
  selected: boolean;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const position = scenePosition(node.position, compact);

  useFrame(({ clock }) => {
    if (mesh.current && !reducedMotion) {
      const target = selected ? 1.18 : hovered ? 1.1 : 1;
      const current = mesh.current.scale.x;
      mesh.current.scale.setScalar(THREE.MathUtils.lerp(current, target, 0.1));
      mesh.current.rotation.y += selected ? 0.006 : 0.0025;
      mesh.current.position.y = Math.sin(clock.elapsedTime * 0.7 + position[0]) * 0.035;
    }
    if (ring.current && !reducedMotion) ring.current.rotation.z += 0.008;
  });

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[compact ? 0.22 : 0.25, 1]} />
        <meshStandardMaterial
          color={selected ? '#92f3cf' : hovered ? '#d9fff1' : '#adb3ff'}
          emissive={selected ? '#4ee7b1' : '#4c55a8'}
          emissiveIntensity={selected ? 0.95 : hovered ? 0.58 : 0.28}
          roughness={0.38}
          metalness={0.2}
          transparent
          opacity={0.96}
        />
      </mesh>

      {selected && (
        <mesh ref={ring} rotation={[Math.PI / 2.8, 0, 0]}>
          <torusGeometry args={[compact ? 0.36 : 0.4, 0.014, 8, 64]} />
          <meshBasicMaterial color="#92f3cf" transparent opacity={0.72} />
        </mesh>
      )}

      <Html center distanceFactor={compact ? 7.5 : 8.5} position={[0, compact ? -0.42 : -0.48, 0]} style={{ pointerEvents: 'none' }}>
        <span className={`system-node-label ${selected ? 'is-active' : ''}`}>{node.label}</span>
      </Html>
    </group>
  );
}

function ArchitectureScene({
  selectedId,
  compact,
  reducedMotion,
  onSelect,
}: {
  selectedId: string;
  compact: boolean;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);

  const positions = useMemo(() => SYSTEM_NODES.map((node) => scenePosition(node.position, compact)), [compact]);
  const connectionPositions = useMemo(() => {
    const values: number[] = [];
    for (let index = 0; index < positions.length - 1; index += 1) {
      values.push(...positions[index], ...positions[index + 1]);
    }
    return new Float32Array(values);
  }, [positions]);

  useFrame(({ clock, pointer }) => {
    if (!reducedMotion && group.current) {
      const targetY = compact ? 0 : pointer.x * 0.08;
      const targetX = compact ? 0 : -pointer.y * 0.045;
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.035);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.035);
    }

    if (!reducedMotion && pulse.current) {
      const pathProgress = (clock.elapsedTime * 0.42) % (positions.length - 1);
      const index = Math.floor(pathProgress);
      const t = pathProgress - index;
      pulse.current.position.lerpVectors(
        new THREE.Vector3(...positions[index]),
        new THREE.Vector3(...positions[Math.min(index + 1, positions.length - 1)]),
        t,
      );
    }
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connectionPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#92f3cf" transparent opacity={0.24} depthWrite={false} />
      </lineSegments>

      <mesh ref={pulse}>
        <sphereGeometry args={[compact ? 0.045 : 0.052, 12, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>

      {SYSTEM_NODES.map((node) => (
        <SystemNodeMesh
          key={node.id}
          node={node}
          compact={compact}
          selected={node.id === selectedId}
          reducedMotion={reducedMotion}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

export default function AISystemVisualization({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [selectedId, setSelectedId] = useState('rag');
  const [compact, setCompact] = useState(false);

  useMemo(() => {
    if (typeof window !== 'undefined') setCompact(window.innerWidth <= 720);
    return null;
  }, []);

  const selected = SYSTEM_NODES.find((node) => node.id === selectedId) ?? SYSTEM_NODES[3];

  return (
    <div className="system-visualization-shell">
      <div className="system-canvas-wrap" aria-label="Interactive AI system architecture">
        <Canvas
          dpr={compact ? [1, 1.1] : [1, 1.35]}
          camera={{ position: [0, 0, compact ? 6.9 : 7.2], fov: compact ? 58 : 50 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          frameloop={reducedMotion ? 'demand' : 'always'}
          onPointerMissed={() => setSelectedId('rag')}
        >
          <ambientLight intensity={0.75} />
          <pointLight position={[0, 3.8, 4.8]} intensity={1.35} color="#d9fff1" />
          <pointLight position={[-3.4, -2.6, 2.8]} intensity={0.7} color="#adb3ff" />
          <ArchitectureScene selectedId={selectedId} compact={compact} reducedMotion={reducedMotion} onSelect={setSelectedId} />
        </Canvas>
        <div className="system-flow-caption" aria-hidden="true"><span>INPUT</span><b>→</b><span>ORCHESTRATE</span><b>→</b><span>RETRIEVE</span><b>→</b><span>INFER</span><b>→</b><span>SERVE</span></div>
      </div>

      <div className="system-node-tabs" role="tablist" aria-label="AI system layers">
        {SYSTEM_NODES.map((node) => (
          <button
            key={node.id}
            type="button"
            role="tab"
            aria-selected={selectedId === node.id}
            className={selectedId === node.id ? 'active' : ''}
            onClick={() => setSelectedId(node.id)}
          >
            <small>{node.short}</small>
            <span>{node.label}</span>
          </button>
        ))}
      </div>

      <div className="system-detail-panel" role="tabpanel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected.id}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <span className="system-detail-index">{String(SYSTEM_NODES.findIndex((node) => node.id === selected.id) + 1).padStart(2, '0')} / 07</span>
            <div>
              <small>{selected.category}</small>
              <h3>{selected.label}</h3>
              <p>{selected.detail}</p>
              <strong>{selected.proof}</strong>
            </div>
            <div className="system-tech-list">{selected.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
