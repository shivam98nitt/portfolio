import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shivam Singh — AI Engineer",
  description: "AI Engineer building production GenAI, RAG, VLM and agentic AI systems.",
};

const nav = [
  ["Work", "/#work"],
  ["Experience", "/#experience"],
  ["Skills", "/#skills"],
  ["Contact", "/contact"],
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="site-noise" />
        <header className="site-header">
          <nav className="nav-shell">
            <Link href="/" className="brand">
              <span className="brand-mark">SS</span>
              <span className="brand-copy"><b>Shivam Singh</b><small>AI Engineer</small></span>
            </Link>
            <div className="nav-links">
              {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
            </div>
            <a className="nav-cta" href="/Shivam-Singh-Resume.pdf" target="_blank" rel="noreferrer">Resume <span>↗</span></a>
          </nav>
        </header>
        {children}
        <footer className="footer"><span>Shivam Singh · AI Engineer</span><span>Built for the next chapter.</span></footer>
      </body>
    </html>
  );
}
