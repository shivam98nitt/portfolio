'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { portfolio } from '@/data/portfolio';

type TechNode = {
  name: string;
  category: keyof typeof portfolio.skills;
  x: number;
  y: number;
  size: 's' | 'm' | 'l';
};

const NODES: TechNode[] = [
  { name: 'LangGraph', category: 'AI Frameworks', x: 50, y: 19, size: 'l' },
  { name: 'RAG', category: 'Generative AI', x: 28, y: 31, size: 'l' },
  { name: 'VLMs', category: 'Generative AI', x: 72, y: 31, size: 'm' },
  { name: 'LLMs', category: 'Generative AI', x: 50, y: 42, size: 'l' },
  { name: 'FastAPI', category: 'Engineering', x: 19, y: 51, size: 'm' },
  { name: 'Python', category: 'Engineering', x: 36, y: 59, size: 'l' },
  { name: 'Node.js', category: 'Engineering', x: 64, y: 59, size: 'm' },
  { name: 'ChromaDB', category: 'Search & Data', x: 80, y: 51, size: 'm' },
  { name: 'Docker', category: 'Cloud & DevOps', x: 24, y: 72, size: 'm' },
  { name: 'Kubernetes', category: 'Cloud & DevOps', x: 50, y: 78, size: 'l' },
  { name: 'AWS', category: 'Cloud & DevOps', x: 76, y: 72, size: 'm' },
  { name: 'SQL', category: 'Search & Data', x: 12, y: 34, size: 's' },
  { name: 'Embeddings', category: 'Generative AI', x: 88, y: 35, size: 's' },
  { name: 'TypeScript', category: 'Engineering', x: 10, y: 66, size: 's' },
  { name: 'CI/CD', category: 'Cloud & DevOps', x: 90, y: 66, size: 's' },
  { name: 'Hugging Face', category: 'AI Frameworks', x: 37, y: 10, size: 's' },
  { name: 'PyTorch', category: 'AI Frameworks', x: 63, y: 10, size: 's' },
];

const EDGES = [
  [0, 1], [0, 2], [0, 3], [1, 3], [1, 7], [2, 3], [2, 7], [3, 5], [3, 6],
  [4, 5], [4, 8], [5, 8], [5, 9], [6, 9], [6, 10], [7, 10], [8, 9], [9, 10],
  [11, 4], [12, 7], [13, 8], [14, 10], [15, 0], [16, 0],
];

const CATEGORY_NOTES: Record<keyof typeof portfolio.skills, string> = {
  'Generative AI': 'Reasoning, retrieval and multimodal intelligence.',
  'AI Frameworks': 'Agent orchestration and model-layer implementation.',
  'Search & Data': 'Retrieval, persistence and production data access.',
  Engineering: 'Reliable APIs and application-layer engineering.',
  'Cloud & DevOps': 'Deployment, scaling and operational repeatability.',
};

function projectsForTech(tech: string) {
  const normalized = tech.toLowerCase();
  return portfolio.work.filter((project) => {
    const haystack = `${project.title} ${project.type} ${project.description} ${project.stack.join(' ')}`.toLowerCase();
    if (normalized === 'rag') return haystack.includes('rag') || haystack.includes('retrieval');
    if (normalized === 'vlms') return haystack.includes('vlm') || haystack.includes('vision');
    if (normalized === 'llms') return haystack.includes('llama') || haystack.includes('openai') || haystack.includes('anthropic');
    if (normalized === 'kubernetes') return haystack.includes('kubernetes') || haystack.includes('cloud');
    return haystack.includes(normalized);
  }).slice(0, 3);
}

export default function TechnologyUniverse({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [selectedName, setSelectedName] = useState('LangGraph');
  const selected = NODES.find((node) => node.name === selectedName) ?? NODES[0];
  const relatedProjects = useMemo(() => projectsForTech(selected.name), [selected.name]);

  return (
    <div className="tech-universe-shell">
      <div className="tech-universe-map" aria-label="Interactive technology constellation">
        <svg className="tech-universe-lines" viewBox="0 0 100 88" preserveAspectRatio="none" aria-hidden="true">
          {EDGES.map(([fromIndex, toIndex]) => {
            const from = NODES[fromIndex];
            const to = NODES[toIndex];
            const active = from.name === selected.name || to.name === selected.name;
            return <line key={`${from.name}-${to.name}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={active ? 'active' : ''} />;
          })}
        </svg>

        {NODES.map((node, index) => (
          <motion.button
            key={node.name}
            type="button"
            className={`tech-node tech-node-${node.size} ${node.name === selected.name ? 'active' : ''}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => setSelectedName(node.name)}
            aria-pressed={node.name === selected.name}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.75 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reducedMotion ? 0 : 0.34, delay: reducedMotion ? 0 : Math.min(index * 0.025, 0.3) }}
          >
            <span>{node.name}</span>
          </motion.button>
        ))}

        <div className="tech-universe-core" aria-hidden="true"><span>AI</span><small>ENGINEERING</small></div>
      </div>

      <div className="tech-universe-mobile-list" aria-label="Technology list">
        {NODES.map((node) => (
          <button key={node.name} type="button" onClick={() => setSelectedName(node.name)} className={node.name === selected.name ? 'active' : ''}>
            {node.name}
          </button>
        ))}
      </div>

      <div className="tech-universe-detail" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected.name}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <div>
              <span>{selected.category}</span>
              <h3>{selected.name}</h3>
              <p>{CATEGORY_NOTES[selected.category]}</p>
            </div>
            <div className="tech-related-projects">
              <small>RELATED WORK</small>
              {relatedProjects.length ? relatedProjects.map((project) => <strong key={project.title}>{project.title}</strong>) : <strong>Used across the broader engineering stack</strong>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
