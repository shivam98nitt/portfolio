# Shivam Singh — Portfolio

Ultra-modern Next.js portfolio focused on production AI engineering, measurable impact, open-source work and backend/system-design projects.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Customize later

The main portfolio content lives in:

```text
data/content.ts
```

Add future employers to `experience`, projects to `work`, skills to `skills`, and edit personal/contact details under `personal`.

`data/portfolio.ts` only applies site-level overrides such as the downloadable resume path.

## Main pages

- `/` — portfolio home, selected work, experience, skills, education
- `/contact` — contact details and message composer
- `/Shivam-Singh-Resume.html` — downloadable/printable resume; use the button inside it to save as PDF

## Featured work

The portfolio combines resume-backed production work with selected public repositories:

- Inbound Material Digitization System
- HR Assistant — Enterprise RAG
- Hyper-Personalised Gift Recommendation Agent
- Taxi Dispatch Backend
- Medical Record Storage System

## Deployment

Works with standard Next.js deployments such as Vercel. No database or server-side secrets are required for the portfolio itself.
