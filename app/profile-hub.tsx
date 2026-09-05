'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { portfolio } from '@/data/portfolio';

type ProfileTab = 'about' | 'experience' | 'contact';

const tabs: { id: ProfileTab; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export default function ProfileHub({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [tab, setTab] = useState<ProfileTab>('about');
  const currentRole = portfolio.experience[0];

  return (
    <div className="profile-hub-shell">
      <aside className="profile-hub-identity">
        <span className="kicker">SHIVAM SINGH</span>
        <h3>AI Engineer</h3>
        <p>{portfolio.personal.location}</p>
        <div className="profile-hub-status"><i /><span>Production AI · Backend · Systems</span></div>
        <div className="profile-hub-actions">
          <a className="button primary" href={portfolio.personal.resume} target="_blank" rel="noreferrer">Resume ↗</a>
          <a href={portfolio.personal.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href={portfolio.personal.github} target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
        <div className="profile-hub-education">
          <small>EDUCATION</small>
          <strong>{portfolio.education.school}</strong>
          <span>{portfolio.education.degree} · {portfolio.education.period}</span>
        </div>
      </aside>

      <div className="profile-hub-panel">
        <div className="profile-hub-tabs" role="tablist" aria-label="Profile details">
          {tabs.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="profile-hub-content" role="tabpanel">
          <AnimatePresence mode="wait" initial={false}>
            {tab === 'about' && (
              <motion.div key="about" initial={reducedMotion ? false : { opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
                <small>ABOUT</small>
                <h4>Production-minded AI engineering.</h4>
                <p>I turn ambiguous product problems into maintainable AI systems across GenAI, RAG, agents, multimodal extraction, APIs and cloud-native backends. The goal is not model novelty by itself — it is useful software with measurable outcomes.</p>
                <blockquote>Readable boundaries. Useful systems. Measurable outcomes.</blockquote>
              </motion.div>
            )}

            {tab === 'experience' && (
              <motion.div key="experience" initial={reducedMotion ? false : { opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
                <small>CURRENT ROLE</small>
                <h4>{currentRole.role}</h4>
                <p className="profile-role-meta">{currentRole.company} · {currentRole.location} · {currentRole.period}</p>
                <div className="profile-impact-list">
                  {currentRole.bullets.map((bullet) => <article key={bullet}><i /><span>{bullet}</span></article>)}
                </div>
              </motion.div>
            )}

            {tab === 'contact' && (
              <motion.div key="contact" initial={reducedMotion ? false : { opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-8 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
                <small>CONTACT</small>
                <h4>Have an ambitious AI problem?</h4>
                <p>For production GenAI, RAG, agentic systems, multimodal AI, MCP integrations or backend architecture, the fastest route is email or LinkedIn.</p>
                <div className="profile-contact-grid">
                  <a href={`mailto:${portfolio.personal.email}`}><span>Email</span><strong>{portfolio.personal.email}</strong><b>↗</b></a>
                  <a href={portfolio.personal.linkedin} target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>Professional profile</strong><b>↗</b></a>
                  <a href={portfolio.personal.github} target="_blank" rel="noreferrer"><span>GitHub</span><strong>Projects & code</strong><b>↗</b></a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
