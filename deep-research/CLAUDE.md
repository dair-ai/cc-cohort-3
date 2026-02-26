# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains "Claude Code for Everyone" — a collection of projects and Claude Code skills. The main application is a **deep research tool** built with Next.js that uses AI to conduct multi-step web research on any topic.

## Commands

All commands run from the `deep-research/` directory:

```bash
cd deep-research
npm run dev -- -p 3001  # Start dev server at localhost:3001
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test framework is configured.

## Architecture

### deep-research/ — Next.js App (App Router)

A streaming AI research application. Users enter a topic, the AI breaks it into search queries, executes web searches, and produces a structured markdown report.

**End-to-end flow:**
1. User submits topic via `SearchInput` → `useChat()` hook sends POST to `/api/chat`
2. Server-side route calls OpenRouter (Gemini 3 Flash) with a research system prompt
3. AI generates 3-5 search queries, each executed against Exa search API as tool calls
4. Results stream back; AI analyzes and cross-references findings (up to 10 steps)
5. Final markdown report streams to client, rendered by `ResearchReport` component

**Key files:**
- `src/app/page.tsx` — Main page (client component), orchestrates UI states and processes message parts from `useChat()`
- `src/app/api/chat/route.ts` — API endpoint with tool definitions, system prompt, and OpenRouter/Exa integration
- `src/components/search-input.tsx` — Topic input form
- `src/components/step-display.tsx` — Shows each search step with sources found
- `src/components/research-report.tsx` — Renders final markdown report with `react-markdown`

**AI SDK message structure (v6):** Messages use `message.parts[]` array with types `"text"` and `"tool-<toolName>"`. Tool parts have `state: "call"` (in-progress) or `"result"` (completed). The page component iterates these parts to extract search queries and results for the StepDisplay.

**Tech stack:**
- Next.js 16 + React 19 + TypeScript
- Vercel AI SDK (`ai`, `@ai-sdk/react`) for streaming and tool use
- OpenRouter provider (`@openrouter/ai-sdk-provider`) → Gemini 3 Flash model
- Exa API for web search (called directly via fetch in the tool definition)
- Tailwind CSS v4 + shadcn/ui (New York style) + Tailwind Typography plugin
- Path alias: `@/*` → `./src/*`

**Environment variables required (in `.env.local`):**
- `OPENROUTER_API_KEY` — OpenRouter API key for LLM access
- `EXA_API_KEY` — Exa search API key

### .claude/skills/deep-research-baseline/ — Claude Code Skill

A custom skill that Claude Code can invoke (via `/deep-research-baseline`) to conduct structured web research directly in the CLI. Uses a 5-phase workflow: query clarification → search → fetch/extract → analyze/synthesize → report. Includes source evaluation templates with credibility tiers.