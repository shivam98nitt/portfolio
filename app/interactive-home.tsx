'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { portfolio } from '@/data/portfolio';
import { githubProjects } from '@/data/github-projects';

const Arrow = () => <span aria-hidden="true">↗</span>;

type AboutTab = 'about' | 'philosophy' | 'stack';

export default function InteractiveHome() {
  const reduceMotion = useReducedMotion();
  const [aboutTab, setAboutTab] = useState<AboutTab>('about');
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [experienceOpen, setExperienceOpen] = useState(false);

  const stack = useMemo(() => Object.values(portfolio.skills).flat(), []);
  const featuredGithub = githubProjects.slice(0, 6);
  const selectedProject = openProject === null ? null : portfolio.work[openProject];

  const transition = reduceMotion ? { duration: 0 } : { duration: 0.24, ease: 'easeOut' as const };

  return (
    <main>
      <section className="hero section compact-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" />Production AI · Backend · Systems</div>
          <h1>Building AI systems that <span>ship, scale & solve.</span></h1>
          <p>{portfolio.personal.summary}</p>
          <div className="hero-actions">
            <a className="button primary" href="#work">Explore my work <span>↘</span></a>
            <a className="button secondary" href={portfolio.personal.resume} target="_blank" rel="noreferrer" data-umami-event="resume_open" data-umami-event-location="hero">View resume <span>↗</span></a>
            <a className="button secondary" href={`mailto:${portfolio.personal.email}`} data-umami-event="contact_action" data-umami-event-location="hero_email">Email me <Arrow /></a>
          </div>
          <div className="hero-recruiter-links" aria-label="Recruiter links">
            <a href={portfolio.personal.linkedin} target="_blank" rel="noreferrer" data-umami-event="linkedin_click" data-umami-event-location="hero">LinkedIn ↗</a>
            <a href={portfolio.personal.github} target="_blank" rel="noreferrer" data-umami-event="github_click" data-umami-event-location="hero">GitHub ↗</a>
            <Link href="/contact" data-umami-event="contact_action" data-umami-event-location="hero_contact_page">Contact page ↗</Link>
          </div>

          <div className="hero-metrics" aria-label="Impact highlights">
            {portfolio.metrics.map((metric) => (
              <article key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>

        <aside className="hero-visual compact-visual">
          <div className="visual-top"><span>PROFILE / 2026</span><i>ACTIVE</i></div>
          <div className="portrait-orbit">
            <div className="avatar profile-avatar">
              <Image src="/profile-photo-fixed.svg" alt="Shivam Singh" fill priority sizes="(max-width: 600px) 88px, 100px" />
            </div>
            <div className="ring ring-a"/>
            <div className="ring ring-b"/>
          </div>
          <div className="terminal interactive-terminal">
            <div className="terminal-bar"><span/><span/><span/><small>shivam@ai-engineering</small></div>
            <code><em>$</em> role<br/><b>AI Engineer</b><br/><em>$</em> current_focus<br/><b>GenAI · RAG · VLM · Agents</b><br/><em>$</em> production_ready<br/><strong>true</strong></code>
          </div>
        </aside>
      </section>

      <section className="section compact-section" id="skills">
        <header className="section-head compact-head">
          <div><span>ME, IN THREE TABS</span><h2>Less scrolling. More signal.</h2></div>
          <p>Choose what you want to know instead of reading everything at once.</p>
        </header>

        <div className="about-console">
          <div className="tab-list" role="tablist" aria-label="About me tabs">
            {(['about', 'philosophy', 'stack'] as AboutTab[]).map((tab) => (
              <button key={tab} role="tab" aria-selected={aboutTab === tab} className={aboutTab === tab ? 'active' : ''} onClick={() => setAboutTab(tab)}>
                {tab === 'about' ? 'About' : tab === 'philosophy' ? 'Philosophy' : 'My Stack'}
              </button>
            ))}
          </div>

          <div className="tab-panel" role="tabpanel">
            <AnimatePresence mode="wait" initial={false}>
              {aboutTab === 'about' && (
                <motion.div key="about" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={transition}>
                  <span className="kicker">WHO I AM</span>
                  <h3>AI engineer focused on production systems.</h3>
                  <p>I enjoy turning ambiguous product problems into reliable systems across GenAI, RAG, agents, multimodal AI, APIs and backend architecture. I like shipping things that are useful, measurable and maintainable.</p>
                </motion.div>
              )}
              {aboutTab === 'philosophy' && (
                <motion.div key="philosophy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={transition}>
                  <span className="kicker">ENGINEERING PHILOSOPHY</span>
                  <blockquote>“I don’t like dirty code.”</blockquote>
                  <p>Readable boundaries, sensible abstractions, small functions and predictable behavior beat clever shortcuts that make future changes painful.</p>
                  <div className="philosophy-tags"><span>Readable</span><span>Maintainable</span><span>Testable</span><span>Simple</span></div>
                </motion.div>
              )}
              {aboutTab === 'stack' && (
                <motion.div key="stack" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={transition}>
                  <span className="kicker">TOOLBOX</span>
                  <h3>From model layer to infrastructure.</h3>
                  <div className="stack-cloud">{stack.map((skill) => <span key={skill}>{skill}</span>)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="section compact-section" id="work">
        <header className="section-head compact-head">
          <div><span>SELECTED WORK</span><h2>Tap a project. Get the details.</h2></div>
          <p>The homepage shows the signal. Deeper technical context opens only when you ask for it.</p>
        </header>

        <div className="project-bento">
          {portfolio.work.map((item, index) => (
            <button type="button" className={`project-tile ${index < 2 ? 'project-tile-large' : ''}`} key={item.title} onClick={() => setOpenProject(index)} data-umami-event="project_click" data-umami-event-project={item.title}>
              <span className="project-type">0{index + 1} · {item.type}</span>
              <strong>{item.title}</strong>
              <div className="project-impact">{item.impact.slice(0, 2).map((impact) => <span key={impact}>{impact}</span>)}</div>
              <div className="project-tile-footer"><span>{item.stack.slice(0, 3).join(' · ')}</span><b>Open ↗</b></div>
            </button>
          ))}
        </div>
      </section>

      <section className="section compact-section github-strip-section" id="github">
        <header className="section-head compact-head">
          <div><span>GITHUB</span><h2>Swipe through the archive.</h2></div>
          <a className="inline-cta" href={portfolio.personal.github} target="_blank" rel="noreferrer" data-umami-event="github_click" data-umami-event-location="github_archive">View all on GitHub ↗</a>
        </header>
        <div className="github-strip" aria-label="Featured GitHub repositories">
          {featuredGithub.map((project) => (
            <a key={project.href} href={project.href} target="_blank" rel="noreferrer" className="github-chip-card" data-umami-event="project_click" data-umami-event-project={project.name}>
              <span>REPOSITORY</span><strong>{project.name}</strong><p>{project.note}</p><b>Open GitHub ↗</b>
            </a>
          ))}
        </div>
      </section>

      <section className="section compact-section" id="experience">
        <header className="section-head compact-head">
          <div><span>EXPERIENCE</span><h2>One timeline. Expand when useful.</h2></div>
          <p>Current role and impact stay compact until you want the detail.</p>
        </header>
        {portfolio.experience.map((exp) => (
          <article className={`experience-accordion ${experienceOpen ? 'open' : ''}`} key={exp.company}>
            <button type="button" className="experience-summary" onClick={() => setExperienceOpen((value) => !value)} aria-expanded={experienceOpen}>
              <div><span className="experience-dot" /><div><strong>{exp.company}</strong><small>{exp.location} · {exp.period}</small></div></div>
              <div><b>{exp.role}</b><span className="accordion-symbol">{experienceOpen ? '−' : '+'}</span></div>
            </button>
            <AnimatePresence initial={false}>
              {experienceOpen && <motion.div className="experience-details" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={transition}><ul>{exp.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></motion.div>}
            </AnimatePresence>
          </article>
        ))}
      </section>

      <section className="section compact-end-section">
        <div className="compact-contact">
          <div><span className="kicker">LET&apos;S BUILD</span><h2>Have an ambitious AI problem?</h2><p>Production GenAI, agentic systems, multimodal AI, retrieval, MCP or backend architecture.</p></div>
          <div className="compact-contact-actions">
            <a className="button primary" href={`mailto:${portfolio.personal.email}`} data-umami-event="contact_action" data-umami-event-location="compact_contact">Email me <Arrow /></a>
            <a href={portfolio.personal.linkedin} target="_blank" rel="noreferrer" data-umami-event="linkedin_click" data-umami-event-location="compact_contact">LinkedIn ↗</a>
            <a href={portfolio.personal.resume} target="_blank" rel="noreferrer" data-umami-event="resume_open" data-umami-event-location="compact_contact">Resume ↗</a>
          </div>
          <div className="education-inline"><span>Education</span><strong>{portfolio.education.school}</strong><small>{portfolio.education.degree} · {portfolio.education.period} · GPA {portfolio.education.gpa}</small></div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div className="project-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition} onMouseDown={() => setOpenProject(null)}>
            <motion.article className="project-modal" role="dialog" aria-modal="true" aria-label={`${selectedProject.title} project details`} initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }} transition={transition} onMouseDown={(event) => event.stopPropagation()}>
              <button type="button" className="modal-close" onClick={() => setOpenProject(null)} aria-label="Close project details">×</button>
              <span className="project-type">{selectedProject.type}</span><h2>{selectedProject.title}</h2><p>{selectedProject.description}</p>
              <div className="modal-grid"><div><small>IMPACT</small><div className="project-impact">{selectedProject.impact.map((impact) => <span key={impact}>{impact}</span>)}</div></div><div><small>STACK</small><div className="stack-cloud compact-stack">{selectedProject.stack.map((tech) => <span key={tech}>{tech}</span>)}</div></div></div>
              {selectedProject.href && <a className="button primary modal-repo" href={selectedProject.href} target="_blank" rel="noreferrer">View repository <Arrow /></a>}
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}