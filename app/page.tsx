import Link from "next/link";
import { portfolio } from "@/data/portfolio";
import { githubProjects } from "@/data/github-projects";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return (
    <main>
      <section className="hero section">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" />Production AI · Backend · Systems</div>
          <h1>Building AI systems that <span>ship, scale & solve.</span></h1>
          <p>{portfolio.personal.summary}</p>
          <div className="hero-actions">
            <a className="button primary" href="#work">Explore my work <span>↘</span></a>
            <a className="button secondary" href={portfolio.personal.resume} download>Download resume <span>↓</span></a>
            <Link className="button secondary" href="/contact">Contact me <Arrow /></Link>
          </div>
          <div className="hero-meta">
            <div><small>Based in</small><b>{portfolio.personal.location}</b></div>
            <div><small>Current focus</small><b>GenAI · RAG · VLM · Agents</b></div>
          </div>
        </div>
        <aside className="hero-visual">
          <div className="visual-top"><span>PROFILE / 2026</span><i>ACTIVE</i></div>
          <div className="portrait-orbit"><div className="avatar">SS</div><div className="ring ring-a"/><div className="ring ring-b"/></div>
          <div className="terminal">
            <div className="terminal-bar"><span/><span/><span/><small>shivam@ai-engineering</small></div>
            <code><em>$</em> role<br/><b>AI Engineer</b><br/><em>$</em> stack --current<br/><b>Python · LangGraph · RAG · VLM</b><br/><em>$</em> production_ready<br/><strong>true</strong></code>
          </div>
        </aside>
      </section>

      <section className="metrics section-tight">
        {portfolio.metrics.map((m) => <article key={m.label}><strong>{m.value}</strong><span>{m.label}</span></article>)}
      </section>

      <section className="section" id="work">
        <header className="section-head"><div><span>SELECTED WORK</span><h2>Systems with measurable impact.</h2></div><p>Production work and public engineering projects spanning multimodal AI, enterprise RAG, agents, backend architecture and decentralized systems.</p></header>
        <div className="work-grid">
          {portfolio.work.map((item, i) => (
            <article className={`work-card ${item.featured ? "featured" : ""}`} key={item.title}>
              <div className="work-index">0{i + 1} / {item.type}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="impact-row">{item.impact.map(x => <span key={x}>{x}</span>)}</div>
              <div className="card-bottom"><div className="stack">{item.stack.map(x => <span key={x}>{x}</span>)}</div>{item.href && <a href={item.href} target="_blank" rel="noreferrer">View repository <Arrow /></a>}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="github">
        <header className="section-head"><div><span>GITHUB ARCHIVE</span><h2>More things I&apos;ve built.</h2></div><p>The case studies above are deliberately curated. This archive gives a broader view of public projects, experiments, mobile work, backend practice and engineering exercises.</p></header>
        <div className="skills-grid">
          {githubProjects.map(project => (
            <article key={project.href}>
              <h3>{project.name}</h3>
              <div><span>{project.note}</span><a href={project.href} target="_blank" rel="noreferrer" className="button secondary">Open GitHub <Arrow /></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="experience">
        <header className="section-head"><div><span>EXPERIENCE</span><h2>Production constraints. Real outcomes.</h2></div><p>Enterprise software and AI systems designed around reliability, measurable impact and operational adoption.</p></header>
        <div className="timeline">
          {portfolio.experience.map(exp => <article key={exp.company} className="experience-card"><div className="company"><b>{exp.company}</b><span>{exp.location}</span><small>{exp.period}</small></div><div><h3>{exp.role}</h3><ul>{exp.bullets.map(b => <li key={b}>{b}</li>)}</ul></div></article>)}
        </div>
      </section>

      <section className="section" id="skills">
        <header className="section-head"><div><span>TECHNICAL DEPTH</span><h2>From model layer to infrastructure.</h2></div><p>A practical stack built around production AI, retrieval, APIs, distributed services and cloud-native delivery.</p></header>
        <div className="skills-grid">{Object.entries(portfolio.skills).map(([group, skills]) => <article key={group}><h3>{group}</h3><div>{skills.map(skill => <span key={skill}>{skill}</span>)}</div></article>)}</div>
      </section>

      <section className="section">
        <article className="education"><div><span className="kicker">EDUCATION</span><h2>{portfolio.education.degree}</h2><p>{portfolio.education.school}</p></div><div className="edu-meta"><div><small>Duration</small><b>{portfolio.education.period}</b></div><div><small>GPA</small><b>{portfolio.education.gpa}</b></div></div></article>
      </section>

      <section className="section contact-band">
        <article><span>LET&apos;S BUILD</span><h2>Working on an ambitious AI product?</h2><p>Talk to me about production GenAI, agentic systems, multimodal AI, retrieval, MCP, backend architecture or AI platform engineering.</p><div><Link className="button light" href="/contact">Start a conversation <Arrow /></Link><a href={portfolio.personal.resume} download>Download resume ↓</a></div></article>
      </section>
    </main>
  );
}
