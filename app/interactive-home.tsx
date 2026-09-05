'use client';

import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { portfolio } from '@/data/portfolio';
import HeroNetwork from './hero-network';
import AISystemVisualization from './ai-system-visualization';
import CommandPalette from './command-palette';
import WorkUniverse from './work-universe';

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function InteractiveHome() {
  const reduceMotion = useReducedMotion();
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
          <div><small>01 / WORK UNIVERSE</small><h2>Strongest work first. Depth on demand.</h2></div>
          <p>Three projects anchor the experience. Select one to inspect impact, stack and implementation context; secondary work stays in a compact archive.</p>
        </header>
        <WorkUniverse reducedMotion={Boolean(reduceMotion)} />
      </section>

      <section className="v2-section" id="system">
        <header className="v2-stage-head">
          <div><small>02 / AI SYSTEM LAB</small><h2>How the intelligence becomes a production system.</h2></div>
          <p>Phase 3 will turn this into one morphing System / Stack / Process lab instead of separate architecture concepts.</p>
        </header>
        <div className="v2-system-preview"><AISystemVisualization reducedMotion={Boolean(reduceMotion)} /></div>
      </section>

      <section className="v2-section" id="about">
        <header className="v2-stage-head">
          <div><small>03 / PROFILE</small><h2>About, experience and contact — without another long page.</h2></div>
          <p>High-signal profile information stays visible; deeper interaction moves into the Profile Hub in Phase 4.</p>
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
    </main>
  );
}
