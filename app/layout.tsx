import type { Metadata } from "next";
import Link from "next/link";
import { RevealManager, ScrollProgress, ThemeToggle } from "./ui-effects";
import "./globals.css";
import "./responsive.css";
import "./ui-polish.css";
import "./profile-photo.css";
import "./hero-phase-one.css";
import "./phase-two.css";
import "./phase-three.css";
import "./chess-nav.css";

const siteUrl = "https://shivam98nitt.github.io";
const portfolioPath = "/portfolio";
const resumeHref = `${portfolioPath}/Shivam-Singh-Resume.pdf`;
const emailHref = "mailto:shivamsingh24680@gmail.com";
const linkedinHref = "https://linkedin.com/in/shivam098";
const githubHref = "https://github.com/shivam98nitt";

const themeBootScript = `(() => {
  try {
    const stored = localStorage.getItem('portfolio-theme');
    const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : (systemLight ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (_) {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
  }
})();`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Shivam Singh — AI Engineer | GenAI, RAG, Agents & Backend Systems",
    template: "%s | Shivam Singh",
  },
  description:
    "Portfolio of Shivam Singh, an AI Engineer building production Generative AI, RAG, agentic AI, multimodal VLM and scalable backend systems using Python, LangGraph, FastAPI, Node.js, AWS, Docker and Kubernetes.",
  keywords: [
    "Shivam Singh",
    "AI Engineer",
    "Generative AI Engineer",
    "RAG Engineer",
    "LangGraph",
    "Agentic AI",
    "Vision Language Models",
    "VLM",
    "MCP",
    "Python",
    "FastAPI",
    "Backend Engineer",
    "LLM Engineer",
  ],
  authors: [{ name: "Shivam Singh", url: `${siteUrl}${portfolioPath}/` }],
  creator: "Shivam Singh",
  publisher: "Shivam Singh",
  category: "technology",
  alternates: { canonical: `${portfolioPath}/` },
  openGraph: {
    type: "website",
    url: `${portfolioPath}/`,
    siteName: "Shivam Singh — AI Engineer",
    title: "Shivam Singh — AI Engineer",
    description:
      "Production GenAI, RAG, agentic AI, multimodal VLM and backend systems with measurable business impact.",
    images: [{ url: `${portfolioPath}/opengraph-image`, width: 1200, height: 630, alt: "Shivam Singh — AI Engineer portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivam Singh — AI Engineer",
    description:
      "Production GenAI, RAG, agentic AI, multimodal VLM and backend systems with measurable business impact.",
    images: [`${portfolioPath}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

const nav = [["Work", "/#work"], ["Experience", "/#experience"], ["Skills", "/#skills"], ["Chess", "/chess"], ["Contact", "/contact"]];
const recruiterLinks = [
  { label: "Email", href: emailHref, event: "contact_action", action: "footer_email" },
  { label: "LinkedIn", href: linkedinHref, event: "linkedin_click", action: "footer" },
  { label: "GitHub", href: githubHref, event: "github_click", action: "footer" },
  { label: "Resume", href: resumeHref, event: "resume_open", action: "footer" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="a203fa32-8545-445e-9dca-fed4f67dd4fd" />
      </head>
      <body>
        <ScrollProgress />
        <RevealManager />
        <div className="site-noise" />
        <header className="site-header">
          <nav className="nav-shell" aria-label="Primary navigation">
            <Link href="/" className="brand">
              <span className="brand-mark">SS</span>
              <span className="brand-copy"><b>Shivam Singh</b><small>AI Engineer</small></span>
            </Link>
            <div className="nav-links">{nav.map(([label, href]) => <Link key={href} href={href} data-umami-event={label === 'Chess' ? 'chess_open' : undefined}>{label}</Link>)}</div>
            <div className="nav-actions">
              <Link href="/chess" className="mobile-chess-link" data-umami-event="chess_open" aria-label="Open chess playground">♞ <span>Chess</span></Link>
              <ThemeToggle />
              <a className="nav-cta" href={resumeHref} target="_blank" rel="noreferrer" data-umami-event="resume_open" data-umami-event-location="navbar">Resume <span>↗</span></a>
            </div>
          </nav>
        </header>
        {children}
        <footer className="footer recruiter-footer">
          <span>Shivam Singh · AI Engineer</span>
          <nav className="footer-links" aria-label="Recruiter links">
            {recruiterLinks.map(({ label, href, event, action }) => (
              <a key={label} href={href} target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined} rel={href.startsWith("http") || href.endsWith(".pdf") ? "noreferrer" : undefined} data-umami-event={event} data-umami-event-location={action}>
                {label}{href.startsWith("http") || href.endsWith(".pdf") ? " ↗" : ""}
              </a>
            ))}
          </nav>
        </footer>
      </body>
    </html>
  );
}
