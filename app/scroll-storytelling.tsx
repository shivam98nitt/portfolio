'use client';

import { motion } from 'framer-motion';

const STEPS = [
  {
    index: '01',
    title: 'Frame the problem',
    text: 'Start from user friction, business constraints and measurable outcomes instead of reaching for a model first.',
    meta: 'Signal → scope → success metric',
  },
  {
    index: '02',
    title: 'Ground the intelligence',
    text: 'Choose retrieval, multimodal extraction or agentic orchestration only where they improve reliability and usefulness.',
    meta: 'RAG · VLM · Agents',
  },
  {
    index: '03',
    title: 'Build the system boundary',
    text: 'Expose the intelligence through predictable APIs, typed contracts, auth and persistence so products can depend on it.',
    meta: 'FastAPI · Node.js · SQL',
  },
  {
    index: '04',
    title: 'Ship and operate',
    text: 'Containerize, deploy, measure and iterate. Production quality includes observability, scaling and maintainability.',
    meta: 'Docker · Kubernetes · AWS',
  },
];

export default function ScrollStorytelling({ reducedMotion = false }: { reducedMotion?: boolean }) {
  return (
    <div className="story-rail" aria-label="Engineering process">
      <div className="story-spine" aria-hidden="true"><span /></div>
      {STEPS.map((step, index) => (
        <motion.article
          key={step.index}
          className="story-step"
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : index * 0.06 }}
        >
          <div className="story-index"><span>{step.index}</span><i /></div>
          <div className="story-copy">
            <small>{step.meta}</small>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
