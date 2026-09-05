'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { portfolio } from '@/data/portfolio';

export default function WorkUniverse({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const featured = portfolio.work.slice(0, 3);
  const archive = portfolio.work.slice(3);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const selected = portfolio.work[selectedIndex];

  const positions = useMemo(() => [
    { x: -27, y: 4, r: -5, z: 16 },
    { x: 0, y: -2, r: 0, z: 42 },
    { x: 27, y: 4, r: 5, z: 16 },
  ], []);

  return (
    <div className="work-universe-shell">
      <div className="work-universe-stage" aria-label="Featured project universe">
        <div className="work-universe-orbit" aria-hidden="true" />
        {featured.map((project, index) => {
          const active = selectedIndex === index;
          const position = positions[index];
          return (
            <motion.button
              key={project.title}
              type="button"
              className={`work-orbit-card ${active ? 'active' : ''}`}
              aria-pressed={active}
              onClick={() => setSelectedIndex(index)}
              initial={false}
              animate={{
                x: `${position.x}%`,
                y: position.y,
                rotate: active ? 0 : position.r,
                scale: active ? 1.06 : 0.94,
                zIndex: active ? 3 : 2,
              }}
              whileHover={reducedMotion ? undefined : { y: position.y - 5 }}
              transition={{ duration: reducedMotion ? 0 : 0.28, ease: 'easeOut' }}
            >
              <span>0{index + 1}</span>
              <small>{project.type}</small>
              <strong>{project.title}</strong>
              <div>{project.impact.slice(0, 2).map((impact) => <i key={impact}>{impact}</i>)}</div>
              <b>{active ? 'Selected' : 'Inspect'} ↗</b>
            </motion.button>
          );
        })}
        <div className="work-universe-core" aria-hidden="true"><span>SELECTED</span><strong>WORK</strong></div>
      </div>

      <div className="work-universe-mobile" aria-label="Featured projects">
        {featured.map((project, index) => (
          <button key={project.title} type="button" className={selectedIndex === index ? 'active' : ''} onClick={() => setSelectedIndex(index)}>
            <small>0{index + 1}</small><span>{project.title}</span>
          </button>
        ))}
      </div>

      <div className="work-universe-detail" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={selected.title}
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <div className="work-detail-copy">
              <span>{selected.type}</span>
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>
            </div>
            <div className="work-detail-proof">
              <small>IMPACT</small>
              <div>{selected.impact.map((impact) => <strong key={impact}>{impact}</strong>)}</div>
            </div>
            <div className="work-detail-stack">
              <small>STACK</small>
              <div>{selected.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>
            </div>
            <div className="work-detail-actions">
              {selected.href ? <a className="button primary" href={selected.href} target="_blank" rel="noreferrer">Repository ↗</a> : <span className="work-private-label">Enterprise production work</span>}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {archive.length > 0 && (
        <div className="work-archive">
          <button type="button" className="work-archive-toggle" onClick={() => setArchiveOpen((value) => !value)} aria-expanded={archiveOpen}>
            <span>Project archive</span><small>{archive.length} more</small><b>{archiveOpen ? '−' : '+'}</b>
          </button>
          <AnimatePresence initial={false}>
            {archiveOpen && (
              <motion.div className="work-archive-list" initial={reducedMotion ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}>
                {archive.map((project, offset) => (
                  <button type="button" key={project.title} onClick={() => { setSelectedIndex(offset + 3); setArchiveOpen(false); }}>
                    <span>{project.title}</span><small>{project.type}</small><b>Open ↗</b>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
