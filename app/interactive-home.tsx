'use client';

import { useReducedMotion } from 'framer-motion';
import { portfolio } from '@/data/portfolio';
import HeroNetwork from './hero-network';
import CommandPalette from './command-palette';
import WorkUniverse from './work-universe';
import SystemLab from './system-lab';
import ProfileHub from './profile-hub';

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function InteractiveHome() {
  const reduceMotion = useReducedMotion();

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
            <div className="avatar profile-avatar" role="img" aria-label="Profile portrait" />
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
          <div><small>02 / AI SYSTEM LAB</small><h2>One system. Three ways to understand how I build.</h2></div>
          <p>Switch between System, Stack and Process. The same spatial interface reorganizes instead of sending you through three separate sections.</p>
        </header>
        <SystemLab reducedMotion={Boolean(reduceMotion)} />
      </section>

      <section className="v2-section" id="about">
        <header className="v2-stage-head">
          <div><small>03 / PROFILE HUB</small><h2>Everything a recruiter needs, in one compact surface.</h2></div>
          <p>About, current experience and contact details live behind tabs instead of three more vertical sections.</p>
        </header>
        <ProfileHub reducedMotion={Boolean(reduceMotion)} />
      </section>
    </main>
  );
}
