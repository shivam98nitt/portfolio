'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { portfolio } from '@/data/portfolio';

type Command = {
  label: string;
  hint: string;
  action: () => void;
};

function navigateTo(hash: string) {
  const target = document.querySelector(hash);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function CommandPalette({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => [
    { label: 'Explore strongest work', hint: 'Projects', action: () => navigateTo('#work') },
    { label: 'Open AI System Lab', hint: 'Architecture', action: () => navigateTo('#system') },
    { label: 'About Shivam', hint: 'Profile', action: () => navigateTo('#about') },
    { label: 'Download resume', hint: 'PDF', action: () => window.open(portfolio.personal.resume, '_blank', 'noopener,noreferrer') },
    { label: 'Open GitHub', hint: 'External', action: () => window.open(portfolio.personal.github, '_blank', 'noopener,noreferrer') },
    { label: 'Open LinkedIn', hint: 'External', action: () => window.open(portfolio.personal.linkedin, '_blank', 'noopener,noreferrer') },
    { label: 'Email Shivam', hint: 'Contact', action: () => { window.location.href = `mailto:${portfolio.personal.email}`; } },
    { label: 'Open chess lab', hint: 'Experiment', action: () => { window.location.href = '/portfolio/chess/'; } },
  ], []);

  const filtered = commands.filter((command) => `${command.label} ${command.hint}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 10);
    return () => {
      window.clearTimeout(timer);
      previous?.focus?.();
    };
  }, [open]);

  const run = (command: Command) => {
    setOpen(false);
    setQuery('');
    window.setTimeout(command.action, 40);
  };

  return (
    <>
      <button type="button" className="command-trigger" onClick={() => setOpen(true)} aria-label="Open command palette">
        <span>Quick nav</span><kbd>⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="command-backdrop"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.16 }}
            onMouseDown={() => setOpen(false)}
          >
            <motion.div
              className="command-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Portfolio command palette"
              initial={reducedMotion ? false : { opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: reducedMotion ? 0 : 0.18 }}
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="command-search-row">
                <span aria-hidden="true">⌕</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Jump to work, system, resume…"
                  aria-label="Search portfolio actions"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && filtered[0]) run(filtered[0]);
                  }}
                />
                <kbd>ESC</kbd>
              </div>
              <div className="command-results">
                {filtered.length ? filtered.map((command) => (
                  <button key={command.label} type="button" onClick={() => run(command)}>
                    <span>{command.label}</span><small>{command.hint}</small>
                  </button>
                )) : <p>No matching action.</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
