# Portfolio V2 — Spatial Engineering Interface

## Product goal
Rebuild the current long, section-heavy homepage into a concise, recruiter-friendly, highly interactive spatial portfolio that feels modern for the next several years without sacrificing performance, accessibility, clarity, or mobile usability.

The final homepage should communicate the strongest signal in roughly 60–90 seconds, while deeper engineering detail remains available on demand.

## Product principles
- Professional portfolio first; interaction second; 3D third.
- Progressive disclosure: show high-signal summaries first, reveal depth on interaction.
- Reuse one design language across the whole product.
- Use real WebGL only where spatial interaction adds meaning.
- Prefer CSS 3D + Framer Motion for standard UI.
- No giant decorative models, noisy effects, or long keyword walls.
- Every interaction must have a keyboard/touch fallback.
- Mobile is a first-class product surface, not a reduced afterthought.
- `prefers-reduced-motion` must be respected everywhere.
- GitHub Pages/static export must remain deployable after every phase.

## Target homepage structure
1. Hero
2. Work Universe
3. AI System Lab
4. About / Experience / Contact

Everything else should be interaction, a drawer, tab, command action, or project detail page rather than another long homepage section.

---

# Phase 1 — Information architecture + concise shell

## Objective
Shorten the homepage before adding any more visual complexity.

## Changes
- Replace the current 8+ section flow with the 4-stage homepage shell.
- Keep the existing 3D hero but tighten copy and metrics.
- Remove duplicate homepage sections for Technology Universe, Engineering Process, GitHub strip, standalone Experience, and standalone Contact.
- Introduce compact stage navigation for Hero / Work / System Lab / About.
- Add a command palette (`Cmd/Ctrl + K`) for fast navigation and recruiter actions.
- Keep links to Resume, GitHub, LinkedIn, Contact, and Chess available without competing with the primary story.
- Make all project/detail-heavy content progressive rather than vertically stacked.

## Acceptance criteria
- Homepage is substantially shorter than current version.
- Four clear top-level experiences only.
- Keyboard navigation works.
- No loss of important recruiter information.
- Existing deployment remains functional.

---

# Phase 2 — Work Universe + project depth

## Objective
Merge Selected Work and GitHub into one interactive project experience.

## Changes
- Build an interactive Work Universe for the strongest projects.
- Show the three strongest projects by default; secondary projects live in a compact archive.
- Add spatial/depth interactions on desktop and touch-safe interactions on mobile.
- Project selection reveals architecture, impact, stack, and repository without forcing page scroll.
- Add dedicated static case-study pages for the strongest projects where useful.
- Project details use progressive disclosure and clear back/close behavior.
- GitHub repository links move into the relevant project context.

## Acceptance criteria
- Selected Work + GitHub no longer require separate homepage sections.
- Strongest projects are understandable in under 15 seconds each.
- Hover is never required to access content.
- Mobile cards remain readable and fast.

---

# Phase 3 — Unified AI System Lab

## Objective
Replace Technology Universe + AI Architecture + Engineering Process with one coherent interactive system.

## Modes
### SYSTEM
User → Agent → MCP → RAG → LLM/VLM → APIs → Kubernetes

### STACK
The same spatial model morphs into implementation technologies such as LangGraph, FastAPI, ChromaDB, Python, Node.js, Docker, Kubernetes, AWS, CI/CD, etc.

### PROCESS
The same interface reorganizes into Problem → Ground → Build → Ship → Observe.

## Changes
- Build one System Lab component with three switchable modes.
- Reuse the same underlying node graph where possible instead of mounting unrelated scenes.
- Add meaningful node selection and contextual evidence from actual project experience.
- Use motion to morph between representations rather than adding separate scroll sections.
- Provide a non-WebGL compact mobile representation where necessary.

## Acceptance criteria
- Three current concepts become one homepage stage.
- The visitor can understand both architecture and engineering thinking without scrolling through separate sections.
- Mode switching is smooth, readable, and accessible.
- Scene pauses or simplifies when off-screen/mobile/reduced-motion.

---

# Phase 4 — Compact profile hub + interaction system + performance architecture

## Objective
Turn About, Experience, Contact, and secondary navigation into a compact interactive product surface.

## Changes
- Build one Profile Hub with tabs for About / Experience / Contact.
- Keep current role, location, education, resume, LinkedIn, GitHub, and email in a single compact area.
- Experience becomes a concise interactive timeline/details panel.
- Education becomes one line unless expanded.
- Add premium but restrained micro-interactions to buttons, nav, cards, tabs, and drawers.
- Introduce an interaction/performance architecture for heavy scenes:
  - lazy mounting
  - viewport-aware pause/unmount
  - DPR limits
  - mobile density reduction
  - reduced-motion fallbacks
- Simplify the main navigation to Work / System Lab / About + Resume.
- Keep Chess and experiments under a secondary Lab/More access point.

## Acceptance criteria
- No standalone long Experience/Contact sections.
- Mobile and keyboard paths expose the same information.
- WebGL use is bounded and does not keep unnecessary scenes rendering off-screen.
- Navigation is shorter and clearer.

---

# Phase 5 — Product hardening, testing, mobile optimization, accessibility, deployment validation

## Objective
Treat the portfolio as production code and verify the final system end-to-end.

## Functional testing
- Verify every primary CTA and internal route.
- Verify Resume, LinkedIn, GitHub, email, contact, project links, case-study links, and Chess/More navigation.
- Verify command palette behavior and keyboard escape/focus handling.
- Verify project drawers/modals open and close correctly.
- Verify all System Lab modes and node selection.
- Verify no broken images or missing GitHub Pages assets.

## Build/static export testing
- Run `npm ci`.
- Run `npm run lint` if available.
- Run `npm run build` / `next build` locally where possible.
- Verify static export completes.
- Verify GitHub Pages workflow status after final commit.

## Responsive/mobile testing targets
- 320px
- 360px
- 390px
- 430px
- 768px
- 1024px
- desktop 1440px+

## Mobile requirements
- No accidental horizontal page overflow.
- Touch targets >= ~44px where practical.
- No hover-only information.
- Reduced 3D density/DPR.
- Off-screen canvases paused/unmounted where possible.
- Text does not overflow cards or modals.
- Modals/drawers fit viewport height and scroll internally.

## Accessibility testing
- Logical heading order.
- Semantic buttons/links.
- Focus-visible states.
- Keyboard usable tabs/dialogs/command palette.
- Escape closes overlays where expected.
- ARIA labels for interactive visualizations.
- Reduced-motion behavior.
- Sufficient contrast in both themes.

## Performance targets
- Hero remains visually rich but lightweight.
- Avoid more than the necessary number of active WebGL canvases.
- Desktop DPR capped around 1.5.
- Mobile DPR approximately 1–1.15.
- No expensive post-processing by default.
- Prefer procedural geometry and lightweight DOM overlays.
- Lazy-load non-critical interactive modules when practical.

## Final acceptance criteria
- Four-stage homepage only.
- Mobile optimized and tested.
- No known broken links/assets.
- Static production build passes.
- GitHub Pages deployment succeeds.
- No critical accessibility or interaction blockers.
- Final code remains modular and maintainable.

---

# Implementation order
1. Phase 1 — concise shell
2. Phase 2 — Work Universe
3. Phase 3 — unified System Lab
4. Phase 4 — Profile Hub + interaction/performance architecture
5. Phase 5 — full validation and hardening

Do not skip ahead when a previous phase leaves a broken build. Every phase should leave `main` in a deployable state.
