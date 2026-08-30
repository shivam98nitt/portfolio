'use client';

import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const THEME_KEY = 'portfolio-theme';

type Theme = 'dark' | 'light';

function getCurrentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 1000 : 180,
    damping: reduceMotion ? 1000 : 28,
    mass: 0.25,
  });

  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={{ scaleX: reduceMotion ? scrollYProgress : scaleX }}
    />
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem(THEME_KEY, next);
    setTheme(next);
  }

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      data-umami-event="theme_toggle"
      data-umami-event-theme={nextTheme}
    >
      <span className="theme-toggle-track" aria-hidden="true">
        <span className="theme-toggle-thumb">
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" focusable="false"><path d="M20.4 15.3A8.6 8.6 0 0 1 8.7 3.6 8.7 8.7 0 1 0 20.4 15.3Z" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>
          )}
        </span>
      </span>
    </button>
  );
}

export function RevealManager() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main > section, .contact-page > .eyebrow, .contact-page > h1, .contact-page > .intro, .contact-grid'
      )
    );

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    elements.forEach((element) => element.classList.add('reveal-ready'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.add('is-visible');
          observer.unobserve(element);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [reduceMotion]);

  return null;
}
