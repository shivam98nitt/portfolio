'use client';

import { FormEvent, useState } from 'react';
import { portfolio } from '@/data/portfolio';

export default function ContactPage() {
  const [status, setStatus] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const subject = String(form.get('subject') || 'Portfolio enquiry');
    const message = String(form.get('message') || '');
    const body = `Hi Shivam,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`;

    window.umami?.track?.('contact_action', { action: 'contact_form_submit' });
    window.location.href = `mailto:${portfolio.personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('Opening your email client…');
  }

  return (
    <main className="contact-page">
      <div className="eyebrow"><span className="status-dot"/>LET&apos;S TALK</div>
      <h1>Have a hard AI problem?<br/>I&apos;d like to hear it.</h1>
      <p className="intro">For roles, collaborations, AI platform work, agentic systems, RAG, multimodal AI or backend architecture, send a note here or reach me directly.</p>
      <div className="contact-grid">
        <aside className="contact-info">
          <a href={`mailto:${portfolio.personal.email}`} data-umami-event="contact_action" data-umami-event-action="contact_page_email"><small>Email</small>{portfolio.personal.email}</a>
          <a href={portfolio.personal.linkedin} target="_blank" rel="noreferrer" data-umami-event="linkedin_click" data-umami-event-location="contact_page"><small>LinkedIn</small>linkedin.com/in/shivam098 ↗</a>
          <a href={portfolio.personal.github} target="_blank" rel="noreferrer" data-umami-event="github_click" data-umami-event-location="contact_page"><small>GitHub</small>github.com/shivam98nitt ↗</a>
          <a href={portfolio.personal.resume} target="_blank" rel="noreferrer" data-umami-event="resume_open" data-umami-event-location="contact_page"><small>Resume</small>Open PDF ↗</a>
        </aside>
        <form className="contact-form" onSubmit={submit}>
          <label>Name<input name="name" required placeholder="Your name" /></label>
          <label>Email<input name="email" type="email" required placeholder="you@company.com" /></label>
          <label>Subject<input name="subject" required placeholder="What would you like to discuss?" /></label>
          <label>Message<textarea name="message" required placeholder="Tell me about the role, product or problem…" /></label>
          <button className="button primary" type="submit">Compose email ↗</button>
          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </main>
  );
}

declare global {
  interface Window {
    umami?: {
      track?: (event: string, data?: Record<string, string>) => void;
    };
  }
}
