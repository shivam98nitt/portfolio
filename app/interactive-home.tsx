'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { portfolio } from '@/data/portfolio';
import HeroNetwork from './hero-network';
import AISystemVisualization from './ai-system-visualization';
import CommandPalette from './command-palette';

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function InteractiveHome() {
  const reduceMotion = useReducedMotion();
  const [openProject, setOpenProject] = useState<number | null>(null);
  const selectedProject = openProject === null ? null : portfolio.work[openProject];
  const strongestProjects = portfolio.work.slice(0, 3);
  const currentRole = portfolio.experience[0];

  return (
    <main className="v2-main">
      <CommandPalette reducedMotion={Boolean(reduceMotion)} />

      <section className="v2-section v2-hero hero-3d-shell" id="top">
        <HeroNetwork reducedMotion={Boolean(reduceMotion)} />

        <div className="v2-hero-copy">
          <div className="eyebrow"><span className="status-dot" />Production AI · Backend · Systems</div>
          <h1>Building AI systems that <span>ship, scale & solve.</span></h1>
          <p>{portfolio.personal.summary}</p>
          <div className="v2-hero-actions">
            <a className="button primary" href="#work">Explore strongest work <span>↘</span></a>
            <a className="button secondary" href={portfolio.personal.resume} target="_blank" rel="noreferrer">Resume <Arrow /></a>
            <a className="button secondary" href={portfolio.personal.linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a>
          </div>
          <div className="v2-proof-grid" aria-label="Impact highlights">
            <article><strong>3+ yrs</strong><span>production engineering</span></article>
            <article><strong>300+</strong><span>internal users</span></article>
            <article><strong>40%</strong><span>accuracy improvement</span></article>
            <article><strong>80%</strong><span>faster HR resolution</span></article>
          </div>
        </div>

        <aside
          className="v2-profile-card"
          onPointerMove={(event) => {
            if (reduceMotion || event.pointerType === 'touch' || window.innerWidth <= 920) return;
            const element = event.currentTarget;
            const rect = element.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            element.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg)`;
            element.style.setProperty('--v2-card-x', `${x * 100}%`);
            element.style.setProperty('--v2-card-y', `${y * 100}%`);
          }}
          onPointerLeave={(event) => {
            event.currentTarget.style.transform = '';
            event.currentTarget.style.setProperty('--v2-card-x', '50%');
            event.currentTarget.style.setProperty('--v2-card-y', '35%');
          }}
        >
          <div className="v2-profile-top"><span>PROFILE / 2026</span><span>ACTIVE</span></div>
          <div className="v2-profile-orbit">
            <div className="avatar profile-avatar"><Image src="/yellow-kurta-profile.jpg" alt="Shivam Singh" fill priority sizes="118px" /></div>
            <div className="v2-profile-ring a" />
            <div className="v2-profile-ring b" />
          </div>
          <div className="v2-profile-terminal">
            <code><em>$</em> role<br/><b>AI Engineer</b><br/><em>$</em> focus<br/><b>GenAI · RAG · VLM · Agents</b><br/><em>$</em> status<br/><b>production_ready = true</b></code>
          </div>
        </aside>
      </section>

      <section className="v2-section" id="work">
        <header className="v2-stage-head">
          <div><small>01 / WORK</small><h2>Three projects. Maximum signal.</h2></div>
          <p>The homepage keeps only the strongest proof. Open a project for deeper architecture, impact and implementation context.</p>
        </header>
        <div className="v2-work-preview">
          {strongestProjects.map((project, index) => (
            <button className="v2-work-card" type="button" key={project.title} onClick={() => setOpenProject(index)}>
              <small>{project.type}</small>
              <strong>{project.title}</strong>
              <p>{project.impact.slice(0, 2).join(' · ')}</p>
              <span>{project.stack.slice(0, 4).join(' · ')} →</span>
            </button>
          ))}
        </div>
        <div className="v2-section-cta"><span>{portfolio.work.length - strongestProjects.length} more project{portfolio.work.length - strongestProjects.length === 1 ? '' : 's'} available in the deeper work experience.</span><a href={portfolio.personal.github} target="_blank" rel="noreferrer">GitHub archive ↗</a></div>
      </section>

      <section className="v2-section" id="system">
        <header className="v2-stage-head">
          <div><small>02 / AI SYSTEM LAB</small><h2>How the intelligence becomes a production system.</h2></div>
          <p>For now this keeps the proven architecture interaction in one concise stage. Phase 3 will unify system, stack and process into one morphing lab.</p>
        </header>
        <div className="v2-system-preview"><AISystemVisualization reducedMotion={Boolean(reduceMotion)} /></div>
      </section>

      <section className="v2-section" id="about">
        <header className="v2-stage-head">
          <div><small>03 / PROFILE</small><h2>About, experience and contact — without another long page.</h2></div>
          <p>High-signal profile information stays visible; deeper interaction will move into the Profile Hub in Phase 4.</p>
        </header>
        <div className="v2-profile-hub">
          <article className="v2-profile-summary">
            <small className="kicker">SHIVAM SINGH</small>
            <h3>AI Engineer</h3>
            <p>Bangalore, India · Production GenAI, RAG, agents, multimodal AI and scalable backend systems.</p>
            <div className="v2-inline-links">
              <a href={portfolio.personal.resume} target="_blank" rel="noreferrer">Resume ↗</a>
              <a href={portfolio.personal.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <a href={portfolio.personal.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={`mailto:${portfolio.personal.email}`}>Email ↗</a>
            </div>
          </article>
          <div className="v2-profile-panel">
            <article><small>Current</small><strong>{currentRole.role} · {currentRole.company}</strong><span>{currentRole.period} · {currentRole.location}</span></article>
            <article><small>Education</small><strong>{portfolio.education.school}</strong><span>{portfolio.education.degree} · {portfolio.education.period}</span></article>
            <article><small>Engineering philosophy</small><strong>Readable boundaries. Useful systems. Measurable outcomes.</strong><span>Keep the implementation simple enough to maintain and strong enough to operate.</span></article>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && openProject !== null && (
          <motion.div className="project-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setOpenProject(null)}>
            <motion.article className="project-modal" role="dialog" aria-modal="true" aria-label={`${selectedProject.title} project details`} initial={reduceMotion ? false : { opacity: 0, y: 24, scale: .985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: .985 }} onMouseDown={(event) => event.stopPropagation()}>
              <button type="button" className="modal-close" onClick={() => setOpenProject(null)} aria-label="Close project details">×</button>
              <span className="project-type">{selectedProject.type}</span>
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>
              <div className="modal-grid"><div><small>IMPACT</small><div className="project-impact">{selectedProject.impact.map((impact) => <span key={impact}>{impact}</span>)}</div></div><div><small>STACK</small><div className="stack-cloud compact-stack">{selectedProject.stack.map((tech) => <span key={tech}>{tech}</span>)}</div></div></div>
              {selectedProject.href && <a className="button primary modal-repo" href={selectedProject.href} target="_blank" rel="noreferrer">View repository <Arrow /></a>}
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
