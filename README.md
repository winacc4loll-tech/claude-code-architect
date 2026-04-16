# Claude Code Architect

A 7-phase workflow engine that generates expert prompts for Claude Code — from intent to production.

## What It Does

Claude Code Architect is an interactive web app that guides you through a structured 7-phase development pipeline:

1. **Intent & Discovery** — Extract the real goal and identify gaps
2. **Deep Research** — Find and surpass the best existing solutions
3. **Blueprint & Stage** — Design the complete architecture
4. **Tooling & Setup** — Configure a professional workspace
5. **Build & Commit** — Ship production-grade code incrementally
6. **Vibe & Iterate** — Polish to perfection (loop)
7. **Maintain & Evolve** — Keep the codebase healthy (ongoing)

Each phase generates a precision-crafted prompt you paste into Claude Code. The better your inputs, the better every downstream prompt becomes.

## Running Locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Building for Production

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build
```

## Type Checking

```bash
npx tsc --noEmit
```

## Deploying to Vercel

The project is pre-configured for Vercel. With the Vercel CLI:

```bash
vercel --prod
```

Or connect your GitHub repo at vercel.com and it auto-deploys on every push.

## Tech Stack

- **React 19** + **TypeScript** — UI framework
- **Vite** — Build tool and dev server
- **Tailwind CSS v3** — Utility-first styling
- **Google Fonts** — DM Sans + Outfit (loaded via CSS)

## Project Structure

```
src/
  components/
    ClaudeCodeArchitect.tsx   # Main app component
  App.tsx                     # Root component
  main.tsx                    # Entry point
  index.css                   # Tailwind directives
```

---

*Bismillah. Build with excellence.*
