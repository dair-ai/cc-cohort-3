# Claude Code for Everyone — Cohort 3

A collection of projects and Claude Code skills built during [DAIR.AI](https://dair.ai)'s Claude Code for Everyone course (Cohort 3).

## Projects

### Deep Research (`deep-research/`)

A streaming AI research tool built with Next.js. Enter any topic and the AI breaks it into search queries, executes web searches via Exa, and produces a structured markdown report.

**Tech stack:** Next.js 16, React 19, Vercel AI SDK, OpenRouter (Gemini 3 Flash), Exa Search API, Tailwind CSS v4, shadcn/ui

**Getting started:**

```bash
cd deep-research
npm install
```

Create a `.env.local` file:

```
OPENROUTER_API_KEY=your_key_here
EXA_API_KEY=your_key_here
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Claude Code Skills

- **deep-research-baseline** — A CLI skill that conducts structured web research directly in Claude Code using a 5-phase workflow: query clarification, search, fetch/extract, analyze/synthesize, and report generation.
