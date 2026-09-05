'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

type Mode = 'system' | 'stack' | 'process';
type LabNode = {
  id: string;
  label: string;
  meta: string;
  detail: string;
  proof: string;
  x: number;
  y: number;
  tone?: 'green' | 'purple' | 'pink';
};

const MODES: Record<Mode, { title: string; description: string; nodes: LabNode[] }> = {
  system: {
    title: 'System',
    description: 'Follow the production path from user intent to scalable infrastructure.',
    nodes: [
      { id:'user', label:'User', meta:'Input', detail:'Natural-language requests and multimodal documents enter through a focused product workflow.', proof:'300+ internal users across production document workflows.', x:8, y:58, tone:'green' },
      { id:'agent', label:'Agent', meta:'Orchestrate', detail:'Stateful orchestration coordinates reasoning, tool use, validation and human review.', proof:'LangGraph used for stateful enterprise and multi-step agent workflows.', x:22, y:34, tone:'purple' },
      { id:'mcp', label:'MCP', meta:'Tools', detail:'Tool contracts keep model logic separated from business services and data access.', proof:'MCP-style tool boundaries support secure service integration.', x:36, y:60, tone:'green' },
      { id:'rag', label:'RAG', meta:'Ground', detail:'Retrieval constrains generation to focused enterprise context instead of relying on model memory.', proof:'Vector search + sentence-window retrieval improved HR answer relevance.', x:50, y:32, tone:'purple' },
      { id:'model', label:'LLM / VLM', meta:'Infer', detail:'Language and vision-language models perform generation, extraction and multimodal understanding.', proof:'Qwen2B VLM improved extraction accuracy by 40%; LLaMA 3.1-70B powered HR querying.', x:64, y:59, tone:'pink' },
      { id:'api', label:'APIs', meta:'Serve', detail:'Predictable REST boundaries expose AI workflows to products and automation.', proof:'Built Node.js / Express and FastAPI services with auth and persistence.', x:78, y:34, tone:'green' },
      { id:'infra', label:'Kubernetes', meta:'Operate', detail:'Containerized services run inside repeatable cloud-native deployment and scaling workflows.', proof:'Docker, Kubernetes, AWS and CI/CD form the operational layer.', x:92, y:58, tone:'purple' },
    ],
  },
  stack: {
    title: 'Stack',
    description: 'The same system expands into the concrete technologies used to implement each layer.',
    nodes: [
      { id:'python', label:'Python', meta:'Core', detail:'Primary language for AI workflows, model integration and FastAPI services.', proof:'Used across agentic AI and backend implementation.', x:9, y:42, tone:'green' },
      { id:'langgraph', label:'LangGraph', meta:'Agents', detail:'Stateful graphs make multi-step agent execution explicit and inspectable.', proof:'Used in enterprise HR conversations and open-source recommendation workflows.', x:24, y:68, tone:'purple' },
      { id:'chromadb', label:'ChromaDB', meta:'Retrieval', detail:'Vector persistence supports semantic retrieval for enterprise RAG.', proof:'Used in HR assistant retrieval workflows.', x:39, y:31, tone:'pink' },
      { id:'fastapi', label:'FastAPI', meta:'API', detail:'Typed Python APIs expose AI capabilities with simple, maintainable service boundaries.', proof:'Used for bulk and agent-facing APIs.', x:54, y:64, tone:'green' },
      { id:'node', label:'Node.js', meta:'Backend', detail:'Node.js services support production APIs, workflow integration and enterprise systems.', proof:'Used in inbound material digitization and backend systems.', x:68, y:32, tone:'purple' },
      { id:'docker', label:'Docker', meta:'Runtime', detail:'Containers make application dependencies and deployment behavior reproducible.', proof:'Part of the cloud-native deployment stack.', x:82, y:66, tone:'pink' },
      { id:'aws', label:'AWS', meta:'Cloud', detail:'Cloud infrastructure hosts services, storage and deployment workflows.', proof:'Production backend and AI services deployed on AWS.', x:93, y:38, tone:'green' },
    ],
  },
  process: {
    title: 'Process',
    description: 'The graph reorganizes into the engineering decisions that make the system trustworthy.',
    nodes: [
      { id:'problem', label:'Problem', meta:'Frame', detail:'Start with user friction, constraints and measurable outcomes before choosing a model.', proof:'Success criteria drive architecture choices.', x:10, y:56, tone:'green' },
      { id:'ground', label:'Ground', meta:'Context', detail:'Choose retrieval, extraction or orchestration only when it materially improves reliability.', proof:'RAG, VLMs and agents are applied selectively.', x:29, y:34, tone:'purple' },
      { id:'build', label:'Build', meta:'Boundary', detail:'Create clean contracts, auth, persistence and validation around the intelligence.', proof:'APIs and typed service boundaries make model behavior consumable.', x:49, y:58, tone:'pink' },
      { id:'ship', label:'Ship', meta:'Deploy', detail:'Containerize and automate delivery so environments stay reproducible.', proof:'Docker + CI/CD + cloud deployment.', x:69, y:34, tone:'green' },
      { id:'observe', label:'Observe', meta:'Operate', detail:'Treat metrics, errors, latency and maintainability as part of product quality.', proof:'Production systems are measured and iterated after release.', x:90, y:56, tone:'purple' },
    ],
  },
};

function buildEdges(nodes: LabNode[]) {
  return nodes.slice(0, -1).map((node, index) => [node, nodes[index + 1]] as const);
}

export default function SystemLab({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [mode, setMode] = useState<Mode>('system');
  const activeMode = MODES[mode];
  const [selectedId, setSelectedId] = useState(activeMode.nodes[3]?.id ?? activeMode.nodes[0].id);

  const selected = activeMode.nodes.find((node) => node.id === selectedId) ?? activeMode.nodes[0];
  const edges = useMemo(() => buildEdges(activeMode.nodes), [activeMode.nodes]);

  const switchMode = (next: Mode) => {
    setMode(next);
    const nodes = MODES[next].nodes;
    setSelectedId(nodes[Math.floor(nodes.length / 2)].id);
  };

  return (
    <div className="system-lab-shell">
      <div className="system-lab-toolbar">
        <div>
          <span>MODE</span>
          <strong>{activeMode.title}</strong>
          <p>{activeMode.description}</p>
        </div>
        <div className="system-lab-modes" role="tablist" aria-label="System lab modes">
          {(['system','stack','process'] as Mode[]).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={mode === item} className={mode === item ? 'active' : ''} onClick={() => switchMode(item)}>
              {MODES[item].title}
            </button>
          ))}
        </div>
      </div>

      <div className="system-lab-scene" aria-label={`${activeMode.title} interactive graph`}>
        <svg className="system-lab-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {edges.map(([from,to]) => <motion.line key={`${mode}-${from.id}-${to.id}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} initial={reducedMotion ? false : { pathLength:0, opacity:0 }} animate={{ pathLength:1, opacity:.5 }} transition={{ duration: reducedMotion ? 0 : .4 }} />)}
        </svg>
        <div className="system-lab-signal" aria-hidden="true" />
        {activeMode.nodes.map((node, index) => (
          <motion.button
            key={`${mode}-${node.id}`}
            type="button"
            className={`system-lab-node tone-${node.tone ?? 'green'} ${selected.id === node.id ? 'active' : ''}`}
            style={{ left:`${node.x}%`, top:`${node.y}%` }}
            onClick={() => setSelectedId(node.id)}
            aria-pressed={selected.id === node.id}
            initial={reducedMotion ? false : { opacity:0, scale:.72, y:12 }}
            animate={{ opacity:1, scale:selected.id === node.id ? 1.08 : 1, y:0 }}
            transition={{ duration: reducedMotion ? 0 : .28, delay: reducedMotion ? 0 : index*.025 }}
          >
            <small>{node.meta}</small><span>{node.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="system-lab-mobile-path" aria-label={`${activeMode.title} steps`}>
        {activeMode.nodes.map((node,index) => <button key={node.id} type="button" className={selected.id === node.id ? 'active' : ''} onClick={() => setSelectedId(node.id)}><small>{String(index+1).padStart(2,'0')}</small><span>{node.label}</span></button>)}
      </div>

      <div className="system-lab-detail" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article key={`${mode}-${selected.id}`} initial={reducedMotion ? false : { opacity:0,y:12 }} animate={{ opacity:1,y:0 }} exit={reducedMotion ? { opacity:0 } : { opacity:0,y:-8 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
            <div><span>{selected.meta}</span><h3>{selected.label}</h3><p>{selected.detail}</p></div>
            <aside><small>PRODUCTION EVIDENCE</small><strong>{selected.proof}</strong></aside>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
