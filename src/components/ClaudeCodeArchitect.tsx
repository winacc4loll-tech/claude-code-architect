import { useState, useCallback } from "react";

// ═══════════════════════════════════════════════════
//  STAGE DEFINITIONS — The 7-Phase Workflow Pipeline
// ═══════════════════════════════════════════════════

interface Stage {
  id: string;
  num: string;
  icon: string;
  label: string;
  tagline: string;
  color: string;
  description: string;
}

const STAGES: Stage[] = [
  {
    id: "intent",
    num: "01",
    icon: "◎",
    label: "Intent & Discovery",
    tagline: "Understand the vision",
    color: "#a78bfa",
    description: "Extract the real goal, identify gaps, pull context from you, and perfect the brief before a single line of code is written.",
  },
  {
    id: "research",
    num: "02",
    icon: "⊛",
    label: "Deep Research",
    tagline: "Know everything first",
    color: "#38bdf8",
    description: "Research best practices, competing solutions, ideal architectures, and surface what's already been solved — then improve on it.",
  },
  {
    id: "blueprint",
    num: "03",
    icon: "◆",
    label: "Blueprint & Stage",
    tagline: "Architect the solution",
    color: "#34d399",
    description: "Design the full system architecture, file structure, data models, API contracts, and UI wireframes before building.",
  },
  {
    id: "tooling",
    num: "04",
    icon: "⚙",
    label: "Tooling & Setup",
    tagline: "Prepare the workspace",
    color: "#fbbf24",
    description: "Select and configure all dev tools, languages, frameworks, integrations, Git, CI/CD, environment, and dependencies.",
  },
  {
    id: "build",
    num: "05",
    icon: "⟐",
    label: "Build & Commit",
    tagline: "Ship working code",
    color: "#f472b6",
    description: "Write production-grade code in incremental commits. Each step produces a runnable state. Git checkpoint at every milestone.",
  },
  {
    id: "vibe",
    num: "06",
    icon: "✦",
    label: "Vibe & Iterate",
    tagline: "Polish to perfection",
    color: "#fb923c",
    description: "Rapid iteration loop: assess, debug, test edge cases, optimize performance, refine UX, and push quality to the highest standard.",
  },
  {
    id: "maintain",
    num: "07",
    icon: "◈",
    label: "Maintain & Evolve",
    tagline: "Keep it excellent",
    color: "#6ee7b7",
    description: "Ongoing updates, upgrades, monitoring, security patches, feature additions, documentation, and long-term code health.",
  },
];

// ═══════════════════════════════════════
//  STAGE-SPECIFIC FORM FIELDS & PROMPTS
// ═══════════════════════════════════════

interface QuestionField {
  id: string;
  label: string;
  placeholder: string;
  rows: number;
}

interface CheckboxOption {
  id: string;
  label: string;
  desc: string;
}

interface BuildMode {
  id: string;
  label: string;
  desc: string;
}

const INTENT_QUESTIONS: QuestionField[] = [
  { id: "goal", label: "What do you want to build?", placeholder: "Describe your vision in plain language...", rows: 3 },
  { id: "problem", label: "What problem does this solve?", placeholder: "Who has the problem? What pain does it fix?", rows: 2 },
  { id: "users", label: "Who are the end users?", placeholder: "e.g. Small business owners, developers, students, internal team...", rows: 1 },
  { id: "success", label: "What does 'done' look like?", placeholder: "How will you know this is successful? What's the MVP?", rows: 2 },
  { id: "constraints", label: "Any constraints or preferences?", placeholder: "Budget, timeline, existing systems, design preferences, must-haves...", rows: 2 },
  { id: "inspiration", label: "Any inspiration or examples?", placeholder: "Apps, sites, or products you like. 'Like X but with Y'...", rows: 1 },
];

const RESEARCH_OPTIONS: CheckboxOption[] = [
  { id: "competitors", label: "Competitor Analysis", desc: "Study existing solutions and find gaps to exploit" },
  { id: "bestpractices", label: "Best Practices", desc: "Industry standards, design patterns, proven approaches" },
  { id: "techstack", label: "Tech Stack Research", desc: "Compare frameworks, databases, and tools for this use case" },
  { id: "uiux", label: "UI/UX Patterns", desc: "Research optimal user flows, accessibility, and design systems" },
  { id: "security", label: "Security & Compliance", desc: "Auth patterns, data privacy, OWASP, regulatory requirements" },
  { id: "performance", label: "Performance & Scale", desc: "Caching strategies, CDN, load patterns, optimization techniques" },
  { id: "api", label: "API & Integrations", desc: "Third-party services, webhooks, payment, email, analytics" },
  { id: "ai", label: "AI/ML Integration", desc: "LLM APIs, embeddings, RAG, vector databases, prompt engineering" },
];

const BLUEPRINT_SECTIONS: CheckboxOption[] = [
  { id: "architecture", label: "System Architecture", desc: "High-level components, services, data flow" },
  { id: "datamodel", label: "Data Models & Schema", desc: "Database tables, relationships, types" },
  { id: "api_design", label: "API Design", desc: "Endpoints, request/response shapes, auth flows" },
  { id: "filestructure", label: "File & Folder Structure", desc: "Project organization, naming conventions" },
  { id: "uistructure", label: "UI Component Tree", desc: "Pages, layouts, shared components, routing" },
  { id: "statemgmt", label: "State Management", desc: "Client state, server state, caching strategy" },
];

const TOOLING_CATEGORIES: Record<string, string[]> = {
  "Frontend": ["React", "Next.js", "Vue", "Nuxt", "Svelte", "SvelteKit", "Astro", "Remix", "Angular"],
  "Styling": ["Tailwind CSS", "CSS Modules", "Styled Components", "Sass", "shadcn/ui", "Radix UI", "Material UI"],
  "Backend": ["Node.js", "Express", "FastAPI", "Django", "Flask", "Hono", "tRPC", "NestJS", "Go", "Rust"],
  "Database": ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis", "Supabase", "PlanetScale", "Drizzle", "Prisma"],
  "Auth": ["Supabase Auth", "NextAuth", "Clerk", "Auth0", "Firebase Auth", "Lucia", "Custom JWT"],
  "DevOps": ["Docker", "GitHub Actions", "Vercel", "Railway", "AWS", "Cloudflare", "Fly.io", "Terraform"],
  "Testing": ["Vitest", "Jest", "Playwright", "Cypress", "Testing Library", "Storybook"],
  "Languages": ["TypeScript", "JavaScript", "Python", "Go", "Rust", "Ruby", "PHP"],
};

const BUILD_MODES: BuildMode[] = [
  { id: "scaffold", label: "Full Scaffold", desc: "Build entire project from scratch" },
  { id: "feature", label: "New Feature", desc: "Add feature to existing codebase" },
  { id: "component", label: "Component", desc: "Build isolated component or module" },
  { id: "api_build", label: "API/Backend", desc: "Build backend services and APIs" },
  { id: "fullstack", label: "Full-Stack", desc: "Frontend + Backend + Database" },
];

const VIBE_ACTIONS: CheckboxOption[] = [
  { id: "assess", label: "Assess Quality", desc: "Full code review for bugs, smells, and improvements" },
  { id: "debug", label: "Debug Issues", desc: "Systematic root cause analysis and fixes" },
  { id: "test", label: "Test & Validate", desc: "Write tests, check edge cases, verify requirements" },
  { id: "perf", label: "Optimize", desc: "Performance profiling and optimization" },
  { id: "ux", label: "Refine UX", desc: "Polish UI, animations, responsiveness, accessibility" },
  { id: "refactor", label: "Refactor", desc: "Clean up code structure without changing behavior" },
  { id: "secure", label: "Security Audit", desc: "Check for vulnerabilities, fix security issues" },
];

const MAINTAIN_ACTIONS: CheckboxOption[] = [
  { id: "update", label: "Update Dependencies", desc: "Upgrade packages, fix deprecations, patch vulnerabilities" },
  { id: "monitor", label: "Add Monitoring", desc: "Logging, error tracking, analytics, health checks" },
  { id: "docs", label: "Documentation", desc: "README, API docs, architecture decision records" },
  { id: "ci", label: "CI/CD Pipeline", desc: "Automated testing, linting, deployment" },
  { id: "scale", label: "Scale & Optimize", desc: "Caching, CDN, database indexing, load testing" },
  { id: "newfeature", label: "New Feature Cycle", desc: "Plan and build the next feature increment" },
];

// ═══════════════════════════════
//  PROMPT GENERATORS PER STAGE
// ═══════════════════════════════

interface FormData {
  goal?: string;
  problem?: string;
  users?: string;
  success?: string;
  constraints?: string;
  inspiration?: string;
  research?: string[];
  blueprint?: string[];
  tooling?: string[];
  buildMode?: string;
  buildDetails?: string;
  vibeActions?: string[];
  vibeNotes?: string;
  maintainActions?: string[];
  maintainNotes?: string;
}

interface GlobalContext {
  goal?: string;
}

function generateIntentPrompt(data: FormData): string {
  const filled = INTENT_QUESTIONS.filter(q => (data[q.id as keyof FormData] as string | undefined)?.trim());
  if (filled.length === 0) return "";
  let p = `You are Claude Code Architect — a senior technical co-founder who is also an Engineer, AI Specialist, Consultant, Developer, Architect, Prompt Engineer, and Designer.\n\n`;
  p += `## Phase 1: Intent & Discovery\n\n`;
  p += `Before writing ANY code, deeply understand this project:\n\n`;
  filled.forEach(q => { p += `### ${q.label}\n${data[q.id as keyof FormData]}\n\n`; });
  p += `## Your Task\n`;
  p += `1. Analyze the intent above and identify any GAPS — things I haven't thought of but should have\n`;
  p += `2. Ask me 3-5 targeted questions to fill those gaps and perfect the context\n`;
  p += `3. Identify potential risks, challenges, and edge cases I should know about\n`;
  p += `4. Suggest the ONE thing that would make this 10x better than what I described\n`;
  p += `5. Map out the user journey — every touchpoint from first visit to power user\n`;
  p += `6. Summarize the refined project brief once we've aligned\n\n`;
  p += `Think step by step. Be my expert advisor. Challenge my assumptions. Pull information from me that I didn't know I needed to give you. The better you understand my intent, the better everything downstream will be.`;
  return p;
}

function generateResearchPrompt(data: FormData, context: GlobalContext): string {
  const selected = data.research || [];
  if (selected.length === 0) return "";
  const labels = selected.map(id => RESEARCH_OPTIONS.find(r => r.id === id)).filter((x): x is CheckboxOption => Boolean(x));
  let p = `You are Claude Code Architect — conducting deep research to find and surpass the best existing solutions.\n\n`;
  if (context.goal) p += `## Project Context\n${context.goal}\n\n`;
  p += `## Phase 2: Deep Research\n\n`;
  p += `Research the following areas thoroughly. Your goal is to find what's ALREADY been solved, study the best implementations, and identify how we can improve on them:\n\n`;
  labels.forEach((l, i) => { p += `${i + 1}. **${l.label}** — ${l.desc}\n`; });
  p += `\n## Instructions\n`;
  p += `For each area:\n`;
  p += `- Use web search to find the BEST current approaches and implementations\n`;
  p += `- Study how top products in this space solve the same problems\n`;
  p += `- Compare at least 2-3 alternatives with specific pros/cons\n`;
  p += `- Identify what the top 1% of projects do differently\n`;
  p += `- Find open-source repos, libraries, or templates we can learn from or build on\n`;
  p += `- Flag any emerging patterns or tools that could give us an edge\n`;
  p += `- Note any pitfalls or anti-patterns to avoid\n\n`;
  p += `## Output Format\n`;
  p += `For each research area, provide:\n`;
  p += `1. **Current Best Practice** — what the industry standard is\n`;
  p += `2. **Top Implementations** — specific products/repos that do it best\n`;
  p += `3. **Our Approach** — recommended approach that improves on what exists\n`;
  p += `4. **Tools & Libraries** — specific packages/services to use\n\n`;
  p += `End with a unified "Recommended Stack & Architecture" that synthesizes all findings.\n`;
  p += `Be thorough. This research phase determines the quality ceiling of everything we build.`;
  return p;
}

function generateBlueprintPrompt(data: FormData, context: GlobalContext): string {
  const selected = data.blueprint || [];
  if (selected.length === 0) return "";
  const labels = selected.map(id => BLUEPRINT_SECTIONS.find(b => b.id === id)).filter((x): x is CheckboxOption => Boolean(x));
  let p = `You are Claude Code Architect — designing a complete system blueprint.\n\n`;
  if (context.goal) p += `## Project: ${context.goal}\n\n`;
  p += `## Phase 3: Blueprint & Architecture\n\n`;
  p += `Design comprehensive, production-grade blueprints for:\n\n`;
  labels.forEach((l, i) => { p += `${i + 1}. **${l.label}** — ${l.desc}\n`; });
  p += `\n## Instructions\n`;
  p += `For each section:\n`;
  p += `- Provide clear visual representations (ASCII diagrams, tree structures, tables)\n`;
  p += `- Explain WHY each decision was made (not just WHAT)\n`;
  p += `- Show how components connect, communicate, and handle failures\n`;
  p += `- Define naming conventions, patterns, and coding standards\n`;
  p += `- Identify the critical path — what MUST be built first\n`;
  p += `- Plan for scale — what changes when we go from 100 to 10,000 users?\n`;
  p += `- Include error states, loading states, and edge cases in UI blueprints\n\n`;
  p += `## Critical Requirements\n`;
  p += `- This blueprint becomes our source of truth for the entire build\n`;
  p += `- It should be precise enough that any senior dev could build from it\n`;
  p += `- Include a phased delivery plan: MVP → V1 → V2\n`;
  p += `- DO NOT write implementation code — this is pure architecture and planning\n\n`;
  p += `Make it thorough. Shortcuts in planning become bugs in production.`;
  return p;
}

function generateToolingPrompt(data: FormData, context: GlobalContext): string {
  const selected = data.tooling || [];
  if (selected.length === 0) return "";
  let p = `You are Claude Code Architect — setting up a professional development environment.\n\n`;
  if (context.goal) p += `## Project: ${context.goal}\n\n`;
  p += `## Phase 4: Tooling & Environment Setup\n\n`;
  p += `## Selected Stack\n${selected.join(", ")}\n\n`;
  p += `## Instructions\n`;
  p += `Set up the COMPLETE development environment from scratch:\n\n`;
  p += `### Project Initialization\n`;
  p += `1. Create project directory and initialize with proper package manager\n`;
  p += `2. Install ALL dependencies (production + dev) with exact versions\n`;
  p += `3. Configure TypeScript (strict mode, path aliases)\n\n`;
  p += `### Git & Version Control\n`;
  p += `4. Initialize git repo with .gitignore (comprehensive, not minimal)\n`;
  p += `5. Set up branch strategy (main, develop, feature branches)\n`;
  p += `6. Configure commit conventions (conventional commits)\n`;
  p += `7. Create initial commit with all config files\n\n`;
  p += `### Configuration Files\n`;
  p += `8. ESLint + Prettier with opinionated rules\n`;
  p += `9. Tailwind / styling config with custom theme\n`;
  p += `10. Environment variables — .env.example with ALL vars documented\n`;
  p += `11. VS Code settings + recommended extensions list\n\n`;
  p += `### Dev Scripts\n`;
  p += `12. dev, build, start, test, lint, format, typecheck commands\n`;
  p += `13. Database migration/seed scripts if applicable\n\n`;
  p += `### CI/CD Skeleton\n`;
  p += `14. GitHub Actions for lint + typecheck + test on PR\n`;
  p += `15. Deploy pipeline configuration\n\n`;
  p += `Install everything, verify it compiles and runs, then make an initial git commit.\n`;
  p += `The project should be 100% bootstrapped and ready for feature development.`;
  return p;
}

function generateBuildPrompt(data: FormData, context: GlobalContext): string {
  const mode = BUILD_MODES.find(m => m.id === data.buildMode);
  let p = `You are Claude Code Architect — building production-grade code with excellence.\n\n`;
  if (context.goal) p += `## Project: ${context.goal}\n\n`;
  p += `## Phase 5: Build & Commit\n\n`;
  if (mode) p += `**Mode:** ${mode.label} — ${mode.desc}\n\n`;
  if (data.buildDetails) p += `## Build Specification\n${data.buildDetails}\n\n`;
  p += `## Build Protocol\n`;
  p += `Follow this exact workflow:\n\n`;
  p += `1. **Read first** — examine ALL existing files before modifying anything\n`;
  p += `2. **Plan the build order** — identify dependencies, build core logic first\n`;
  p += `3. **Core loop first** — get the minimum working feature running\n`;
  p += `4. **Run after EVERY step** — verify it works before moving on\n`;
  p += `5. **Git commit at milestones** — clear, descriptive commit messages\n`;
  p += `6. **Layer complexity** — add features incrementally, never all at once\n\n`;
  p += `## Code Standards (Non-negotiable)\n`;
  p += `- **Error handling** — every external call (API, DB, fs) has proper error handling\n`;
  p += `- **Types** — full TypeScript types, ZERO \`any\`\n`;
  p += `- **Validation** — validate ALL inputs at system boundaries\n`;
  p += `- **Security** — sanitize inputs, env vars for secrets, secure headers, parameterized queries\n`;
  p += `- **Functions** — under 30 lines, single responsibility\n`;
  p += `- **Names** — meaningful (not data, result, temp, x)\n`;
  p += `- **Comments** — explain WHY, never WHAT\n`;
  p += `- **Responsive** — mobile-first by default\n`;
  p += `- **Accessible** — semantic HTML, ARIA, keyboard nav, proper contrast\n`;
  p += `- **No magic numbers** — use named constants\n`;
  p += `- **No TODO comments** — implement it or don't add it\n\n`;
  p += `## Commit Strategy\n`;
  p += `- Commit after each working milestone\n`;
  p += `- Format: \`type(scope): description\` (feat, fix, refactor, style, test, chore)\n`;
  p += `- Never commit broken code\n\n`;
  p += `Ship working code at every step. The project is NEVER in a broken state.`;
  return p;
}

function generateVibePrompt(data: FormData, context: GlobalContext): string {
  const selected = (data.vibeActions || []).map(id => VIBE_ACTIONS.find(v => v.id === id)).filter((x): x is CheckboxOption => Boolean(x));
  if (selected.length === 0) return "";
  let p = `You are Claude Code Architect — in rapid iteration and quality escalation mode.\n\n`;
  if (context.goal) p += `## Project: ${context.goal}\n\n`;
  p += `## Phase 6: Vibe & Iterate\n\n`;
  p += `Perform these quality escalation actions on the current codebase:\n\n`;
  selected.forEach((s, i) => { p += `${i + 1}. **${s.label}** — ${s.desc}\n`; });
  if (data.vibeNotes) p += `\n## Specific Issues & Context\n${data.vibeNotes}\n`;
  p += `\n## Iteration Protocol\n`;
  p += `1. **Audit first** — read all relevant files, understand the current state\n`;
  p += `2. **Prioritize** — fix critical issues first, then optimize\n`;
  p += `3. **One concern at a time** — make focused, testable changes\n`;
  p += `4. **Run after each change** — verify nothing broke\n`;
  p += `5. **Commit after each fix** — clear messages describing what changed and why\n`;
  p += `6. **Flag scope creep** — if you find issues beyond the request, list them but don't fix unless asked\n\n`;
  p += `## Quality Bar\n`;
  p += `Would a principal engineer at a top-tier tech company approve this in code review?\n`;
  p += `If not, it's not done. Push quality to the absolute highest standard.\n`;
  p += `Check: error handling, edge cases, loading states, empty states, mobile, accessibility, performance, security.`;
  return p;
}

function generateMaintainPrompt(data: FormData, context: GlobalContext): string {
  const selected = (data.maintainActions || []).map(id => MAINTAIN_ACTIONS.find(m => m.id === id)).filter((x): x is CheckboxOption => Boolean(x));
  if (selected.length === 0) return "";
  let p = `You are Claude Code Architect — in long-term maintenance and evolution mode.\n\n`;
  if (context.goal) p += `## Project: ${context.goal}\n\n`;
  p += `## Phase 7: Maintain & Evolve\n\n`;
  p += `Perform these maintenance and evolution tasks:\n\n`;
  selected.forEach((s, i) => { p += `${i + 1}. **${s.label}** — ${s.desc}\n`; });
  if (data.maintainNotes) p += `\n## Known Issues & Concerns\n${data.maintainNotes}\n`;
  p += `\n## Maintenance Protocol\n`;
  p += `1. **Audit current state** — read the codebase, check dependency versions, review logs\n`;
  p += `2. **Zero downtime** — no breaking changes without a migration path\n`;
  p += `3. **Update tests** — cover any new or changed behavior\n`;
  p += `4. **Document everything** — CHANGELOG, commit messages, README updates\n`;
  p += `5. **Backwards compatible** — verify nothing breaks for existing users\n`;
  p += `6. **Check changelogs** — when upgrading deps, read their breaking changes\n`;
  p += `7. **Security scan** — check for known vulnerabilities in dependencies\n\n`;
  p += `## Evolution Mindset\n`;
  p += `- The codebase should be HEALTHIER after every maintenance pass\n`;
  p += `- Leave it better than you found it\n`;
  p += `- Reduce tech debt, don't accumulate it\n`;
  p += `- Plan for the next 6 months, not just today\n`;
  p += `- If a pattern is causing repeated issues, refactor it — don't keep patching`;
  return p;
}

type GeneratorFn = (data: FormData, context: GlobalContext) => string;

const GENERATORS: Record<string, GeneratorFn> = {
  intent: generateIntentPrompt,
  research: generateResearchPrompt,
  blueprint: generateBlueprintPrompt,
  tooling: generateToolingPrompt,
  build: generateBuildPrompt,
  vibe: generateVibePrompt,
  maintain: generateMaintainPrompt,
};

// ═══════════════
//  UI COMPONENTS
// ═══════════════

const FONT_MONO = "'Geist Mono', 'JetBrains Mono', 'SF Mono', monospace";
const FONT_SANS = "'DM Sans', 'Outfit', system-ui, sans-serif";

const COLORS = {
  bg: "#07070a",
  s1: "#0d0d12",
  s2: "#131319",
  s3: "#1a1a23",
  b1: "#1f1f2e",
  b2: "#2a2a3d",
  tx: "#e8e8ed",
  txd: "#6b6b80",
  txdd: "#44445a",
} as const;

interface StageNavProps {
  stages: Stage[];
  active: string;
  onSelect: (id: string) => void;
  completedStages: string[];
}

function StageNav({ stages, active, onSelect, completedStages }: StageNavProps) {
  return (
    <div style={{ display: "flex", gap: 2, marginBottom: 32, overflowX: "auto", paddingBottom: 8 }}>
      {stages.map((s) => {
        const isActive = s.id === active;
        const isComplete = completedStages.includes(s.id);
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            aria-label={`Phase ${s.num}: ${s.label}`}
            aria-current={isActive ? "page" : undefined}
            style={{
              flex: "1 0 auto",
              minWidth: 44,
              padding: "10px 6px",
              background: isActive ? `${s.color}15` : "transparent",
              border: `1px solid ${isActive ? s.color + "44" : "transparent"}`,
              borderBottom: isActive
                ? `2px solid ${s.color}`
                : isComplete
                ? `2px solid ${s.color}44`
                : `2px solid transparent`,
              borderRadius: "8px 8px 0 0",
              cursor: "pointer",
              transition: "all 0.25s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 18, filter: isActive ? "none" : "grayscale(0.5)", opacity: isActive ? 1 : isComplete ? 0.8 : 0.4 }}>
              {isComplete && !isActive ? "✓" : s.icon}
            </span>
            <span style={{
              fontFamily: FONT_MONO,
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: isActive ? s.color : isComplete ? COLORS.txd : COLORS.txdd,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              {s.num}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface StageHeaderProps {
  stage: Stage;
}

function StageHeader({ stage }: StageHeaderProps) {
  return (
    <div style={{ marginBottom: 28, animation: "fadeSlide 0.35s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 28, lineHeight: 1 }} aria-hidden="true">{stage.icon}</span>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: stage.color, textTransform: "uppercase" }}>
            Phase {stage.num}
          </div>
          <h2 style={{ fontFamily: FONT_SANS, fontSize: 22, fontWeight: 700, color: COLORS.tx, margin: 0, lineHeight: 1.2 }}>
            {stage.label}
          </h2>
        </div>
      </div>
      <p style={{ fontFamily: FONT_SANS, fontSize: 13.5, color: COLORS.txd, lineHeight: 1.6, margin: 0, maxWidth: 600 }}>
        {stage.description}
      </p>
    </div>
  );
}

interface TextAreaFieldProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  rows?: number;
  label?: string;
}

function TextAreaField({ value, onChange, placeholder, rows = 2, label }: TextAreaFieldProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{
          fontFamily: FONT_MONO,
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: COLORS.txd,
          display: "block",
          marginBottom: 6,
        }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          width: "100%",
          boxSizing: "border-box",
          fontFamily: FONT_SANS,
          fontSize: 14,
          lineHeight: 1.6,
          padding: "12px 14px",
          background: COLORS.s1,
          border: `1px solid ${COLORS.b1}`,
          borderRadius: 10,
          color: COLORS.tx,
          outline: "none",
          resize: "vertical",
          transition: "border-color 0.2s",
        }}
        onFocus={e => { e.target.style.borderColor = "#555"; }}
        onBlur={e => { e.target.style.borderColor = COLORS.b1; }}
      />
    </div>
  );
}

interface ChipGridProps {
  items: CheckboxOption[];
  selected: string[];
  onToggle: (id: string) => void;
  color?: string;
}

function ChipGrid({ items, selected, onToggle, color = "#818cf8" }: ChipGridProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {items.map(item => {
        const active = selected.includes(item.id);
        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
            title={item.desc}
            aria-pressed={active}
            style={{
              padding: "7px 13px",
              background: active ? `${color}14` : "transparent",
              border: `1px solid ${active ? color + "44" : COLORS.b1}`,
              borderRadius: 8,
              color: active ? color : COLORS.txd,
              fontFamily: FONT_MONO,
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {active && <span style={{ fontSize: 10 }} aria-hidden="true">✓</span>}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

interface ToolingGridProps {
  categories: Record<string, string[]>;
  selected: string[];
  onToggle: (tool: string) => void;
  color: string;
}

function ToolingGrid({ categories, selected, onToggle, color }: ToolingGridProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {Object.entries(categories).map(([cat, tools]) => (
        <div key={cat}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.txd, marginBottom: 8 }}>{cat}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tools.map(tool => {
              const active = selected.includes(tool);
              return (
                <button
                  key={tool}
                  onClick={() => onToggle(tool)}
                  aria-pressed={active}
                  style={{
                    padding: "5px 11px",
                    background: active ? `${color}14` : "transparent",
                    border: `1px solid ${active ? color + "40" : COLORS.b1}`,
                    borderRadius: 6,
                    color: active ? color : COLORS.txdd,
                    fontFamily: FONT_MONO,
                    fontSize: 10.5,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {tool}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

interface RadioGroupProps {
  items: BuildMode[];
  selected: string;
  onSelect: (id: string) => void;
  color: string;
}

function RadioGroup({ items, selected, onSelect, color }: RadioGroupProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map(item => {
        const active = selected === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            role="radio"
            aria-checked={active}
            style={{
              padding: "10px 14px",
              textAlign: "left",
              background: active ? `${color}10` : COLORS.s1,
              border: `1px solid ${active ? color + "44" : COLORS.b1}`,
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${active ? color : COLORS.b2}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />}
            </div>
            <div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600, color: active ? COLORS.tx : COLORS.txd }}>{item.label}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: COLORS.txdd, marginTop: 1 }}>{item.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface PromptOutputProps {
  prompt: string;
  stageColor: string;
}

function PromptOutput({ prompt, stageColor }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const t = document.createElement("textarea");
      t.value = prompt;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (!prompt) return null;

  return (
    <div style={{ marginTop: 24, animation: "fadeSlide 0.35s ease" }}>
      <div style={{ background: COLORS.s1, border: `1px solid ${COLORS.b1}`, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", borderBottom: `1px solid ${COLORS.b1}`, background: COLORS.bg }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: stageColor }} aria-hidden="true" />
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.txd, letterSpacing: "0.06em", textTransform: "uppercase" }}>Generated Prompt</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.txdd }}>~{Math.ceil(prompt.length / 4)} tokens</span>
            <button
              onClick={copy}
              aria-label={copied ? "Copied to clipboard" : "Copy prompt to clipboard"}
              style={{
                padding: "4px 12px",
                background: copied ? "#34d39922" : `${stageColor}18`,
                border: `1px solid ${copied ? "#34d39944" : stageColor + "33"}`,
                borderRadius: 6,
                color: copied ? "#34d399" : stageColor,
                fontFamily: FONT_MONO,
                fontSize: 10,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>
        <pre style={{
          padding: 18,
          margin: 0,
          fontFamily: FONT_MONO,
          fontSize: 11.5,
          lineHeight: 1.7,
          color: COLORS.tx,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: 380,
          overflowY: "auto",
        }}>
          {prompt}
        </pre>
      </div>
    </div>
  );
}

// ═══════════════
//  MAIN APP
// ═══════════════

export default function ClaudeCodeArchitect() {
  const [activeStage, setActiveStage] = useState<string>("intent");
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [generatedPrompts, setGeneratedPrompts] = useState<Record<string, string>>({});
  const [globalContext, setGlobalContext] = useState<GlobalContext>({});

  const stage = STAGES.find(s => s.id === activeStage) ?? STAGES[0];
  const stageIdx = STAGES.findIndex(s => s.id === activeStage);

  const updateField = (key: keyof FormData, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const toggleArray = (key: keyof FormData, val: string) => {
    setFormData(prev => {
      const arr = (prev[key] as string[] | undefined) ?? [];
      return { ...prev, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const toggleTooling = (tool: string) => {
    setFormData(prev => {
      const arr = prev.tooling ?? [];
      return { ...prev, tooling: arr.includes(tool) ? arr.filter(x => x !== tool) : [...arr, tool] };
    });
  };

  const generate = useCallback(() => {
    const gen = GENERATORS[activeStage];
    if (!gen) return;
    if (activeStage === "intent" && formData.goal) {
      setGlobalContext(prev => ({ ...prev, goal: formData.goal }));
    }
    const prompt = gen(formData, { ...globalContext, goal: formData.goal ?? globalContext.goal });
    if (prompt) {
      setGeneratedPrompts(prev => ({ ...prev, [activeStage]: prompt }));
      if (!completedStages.includes(activeStage)) {
        setCompletedStages(prev => [...prev, activeStage]);
      }
    }
  }, [activeStage, formData, globalContext, completedStages]);

  const goNext = () => {
    if (stageIdx < STAGES.length - 1) setActiveStage(STAGES[stageIdx + 1].id);
  };

  const generateAll = useCallback(() => {
    const prompts: Record<string, string> = {};
    const ctx: GlobalContext = { goal: formData.goal ?? "" };
    STAGES.forEach(s => {
      const gen = GENERATORS[s.id];
      if (gen) {
        const p = gen(formData, ctx);
        if (p) prompts[s.id] = p;
      }
    });
    setGeneratedPrompts(prompts);
    setCompletedStages(STAGES.filter(s => prompts[s.id]).map(s => s.id));
  }, [formData]);

  const renderStageForm = () => {
    switch (activeStage) {
      case "intent":
        return INTENT_QUESTIONS.map(q => (
          <TextAreaField
            key={q.id}
            label={q.label}
            placeholder={q.placeholder}
            rows={q.rows}
            value={(formData[q.id as keyof FormData] as string | undefined) ?? ""}
            onChange={v => updateField(q.id as keyof FormData, v)}
          />
        ));
      case "research":
        return (
          <>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.txd, marginBottom: 10 }}>Select research areas</div>
            <ChipGrid items={RESEARCH_OPTIONS} selected={formData.research ?? []} onToggle={id => toggleArray("research", id)} color={stage.color} />
          </>
        );
      case "blueprint":
        return (
          <>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.txd, marginBottom: 10 }}>Select blueprint sections</div>
            <ChipGrid items={BLUEPRINT_SECTIONS} selected={formData.blueprint ?? []} onToggle={id => toggleArray("blueprint", id)} color={stage.color} />
          </>
        );
      case "tooling":
        return (
          <ToolingGrid categories={TOOLING_CATEGORIES} selected={formData.tooling ?? []} onToggle={toggleTooling} color={stage.color} />
        );
      case "build":
        return (
          <>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.txd, marginBottom: 10 }}>Build mode</div>
            <RadioGroup items={BUILD_MODES} selected={formData.buildMode ?? ""} onSelect={v => updateField("buildMode", v)} color={stage.color} />
            <div style={{ marginTop: 16 }}>
              <TextAreaField
                label="Build specification & details"
                placeholder="What specifically should be built? Features, pages, endpoints, components..."
                rows={3}
                value={formData.buildDetails ?? ""}
                onChange={v => updateField("buildDetails", v)}
              />
            </div>
          </>
        );
      case "vibe":
        return (
          <>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.txd, marginBottom: 10 }}>Iteration actions</div>
            <ChipGrid items={VIBE_ACTIONS} selected={formData.vibeActions ?? []} onToggle={id => toggleArray("vibeActions", id)} color={stage.color} />
            <div style={{ marginTop: 16 }}>
              <TextAreaField
                label="Specific issues or notes"
                placeholder="Describe bugs, UX issues, performance problems, or areas needing attention..."
                rows={2}
                value={formData.vibeNotes ?? ""}
                onChange={v => updateField("vibeNotes", v)}
              />
            </div>
          </>
        );
      case "maintain":
        return (
          <>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.txd, marginBottom: 10 }}>Maintenance tasks</div>
            <ChipGrid items={MAINTAIN_ACTIONS} selected={formData.maintainActions ?? []} onToggle={id => toggleArray("maintainActions", id)} color={stage.color} />
            <div style={{ marginTop: 16 }}>
              <TextAreaField
                label="Specific concerns"
                placeholder="Known issues, tech debt, upcoming requirements, dependency alerts..."
                rows={2}
                value={formData.maintainNotes ?? ""}
                onChange={v => updateField("maintainNotes", v)}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const totalTokens = Math.ceil(Object.values(generatedPrompts).join("").length / 4);
  const generatedCount = Object.keys(generatedPrompts).length;

  return (
    <div style={{ minHeight: "100vh", fontFamily: FONT_SANS, color: COLORS.tx, background: COLORS.bg, position: "relative" }}>
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 50% at 15% 5%, ${stage.color}08 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 95%, #f472b606 0%, transparent 60%), linear-gradient(180deg, #07070a 0%, #0a0a10 100%)`,
      }} aria-hidden="true" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto", padding: "28px 18px 60px" }}>

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 100, background: `${stage.color}10`, border: `1px solid ${stage.color}22`, marginBottom: 14 }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: stage.color, textTransform: "uppercase" }}>Claude Code Architect</span>
          </div>
          <h1 style={{
            fontFamily: FONT_MONO,
            fontSize: "clamp(22px, 4.5vw, 34px)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            margin: "0 0 8px",
            background: `linear-gradient(135deg, ${COLORS.tx} 30%, ${stage.color} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            7-Phase Workflow Engine
          </h1>
          <p style={{ fontFamily: FONT_SANS, fontSize: 13, color: COLORS.txd, margin: 0, lineHeight: 1.5 }}>
            Intent to production — every stage generates an expert prompt for Claude Code
          </p>
        </header>

        <nav aria-label="Pipeline phases">
          <StageNav stages={STAGES} active={activeStage} onSelect={setActiveStage} completedStages={completedStages} />
        </nav>

        <main>
          <div style={{ animation: "fadeSlide 0.3s ease" }} key={activeStage}>
            <StageHeader stage={stage} />
            {renderStageForm()}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              <button
                onClick={generate}
                style={{
                  flex: "2 1 200px",
                  padding: "13px 20px",
                  background: `linear-gradient(135deg, ${stage.color}cc, ${stage.color})`,
                  border: "none",
                  borderRadius: 10,
                  color: COLORS.bg,
                  fontFamily: FONT_MONO,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.03em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: `0 4px 20px ${stage.color}30`,
                }}
              >
                Generate Phase {stage.num} Prompt
              </button>
              {stageIdx < STAGES.length - 1 && (
                <button
                  onClick={() => { generate(); goNext(); }}
                  style={{
                    flex: "1 1 120px",
                    padding: "13px 16px",
                    background: "transparent",
                    border: `1px solid ${COLORS.b1}`,
                    borderRadius: 10,
                    color: COLORS.txd,
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  Next Phase →
                </button>
              )}
            </div>

            {stageIdx === 0 && formData.goal && (
              <button
                onClick={generateAll}
                style={{
                  width: "100%",
                  marginTop: 10,
                  padding: "11px",
                  background: COLORS.s2,
                  border: `1px dashed ${COLORS.b2}`,
                  borderRadius: 10,
                  color: COLORS.txd,
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Generate All 7 Phases at Once
              </button>
            )}

            <PromptOutput prompt={generatedPrompts[activeStage] ?? ""} stageColor={stage.color} />
          </div>

          {/* Pipeline Status */}
          <section aria-label="Pipeline status" style={{ marginTop: 36, padding: "16px 18px", background: COLORS.s1, border: `1px solid ${COLORS.b1}`, borderRadius: 12 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.txd, marginBottom: 10 }}>Pipeline Status</div>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {STAGES.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                  <div style={{
                    height: 6,
                    flex: 1,
                    borderRadius: 3,
                    background: generatedPrompts[s.id] ? s.color : COLORS.b1,
                    opacity: generatedPrompts[s.id] ? 1 : 0.3,
                    transition: "all 0.4s ease",
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.txdd }}>
                {generatedCount}/7 phases generated
              </span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: COLORS.txdd }}>
                ~{totalTokens} total tokens
              </span>
            </div>
          </section>

          {/* Workflow Guide */}
          <aside style={{ marginTop: 20, padding: "14px 16px", background: `${stage.color}06`, border: `1px solid ${stage.color}12`, borderRadius: 10 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", color: stage.color, textTransform: "uppercase", marginBottom: 8 }}>How to Use</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: COLORS.txd, lineHeight: 1.8 }}>
              <span style={{ color: stage.color, fontWeight: 700 }}>1.</span> Walk through each phase sequentially — or jump to any phase you need.{" "}
              <span style={{ color: stage.color, fontWeight: 700 }}>2.</span> Copy each generated prompt and paste into Claude Code.{" "}
              <span style={{ color: stage.color, fontWeight: 700 }}>3.</span> Phase 01 pulls your intent and context — the better you fill it, the better ALL downstream prompts become.{" "}
              <span style={{ color: stage.color, fontWeight: 700 }}>4.</span> Phases 06-07 are loops — use them repeatedly throughout development for continuous quality escalation.
            </div>
          </aside>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap');
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        textarea::-webkit-scrollbar, pre::-webkit-scrollbar { width: 5px; }
        textarea::-webkit-scrollbar-track, pre::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb, pre::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
        button:hover { filter: brightness(1.08); }
      `}</style>
    </div>
  );
}
