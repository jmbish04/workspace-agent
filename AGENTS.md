# Coding Agent Instructions

## MANDATORY STANDARDS — READ BEFORE ANY WORK

### 0. Secrets Management (CRITICAL)
- ❌ Do NOT access secrets directly via `env.SECRET_NAME`.
- ✅ **MUST** use the asynchronous `.get()` method: `await env.SECRET_NAME.get()`.
- **Google Service Account Auth:** Because SA keys exceed Cloudflare Worker secret limits, the key is split into two parts. You MUST reconstruct it precisely:
  ```typescript
  const pt1 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_1.get();
  const pt2 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_2.get();
  const privateKey = pt1 + pt2;

### 1. Type Safety & Env Management
- ALWAYS run `pnpm run types` (`npx wrangler types`) after ANY change to `wrangler.jsonc`.
- The generated `worker-configuration.d.ts` is the SINGLE SOURCE OF TRUTH for the `Env` type.
- NEVER redefine or manually type `Env`. 

### 2. Import Paths
- EVERY module import MUST use TypeScript path aliases defined in `tsconfig.json` (`@frontend/*`, `@backend/*`, etc.).

### 3. Secrets Management & Google Auth
- The Google Workspace integrations require `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and a `GOOGLE_REFRESH_TOKEN` (or service account JSON).
- ALWAYS use Secrets Store bindings in `wrangler.jsonc` for these. Never hardcode them.

### 4. Database
- Use Drizzle ORM with D1.
- Run `pnpm run db:generate` after modifying schemas in `src/backend/db/schemas/`.

### 5. API Framework
- Use Hono with `@hono/zod-openapi` for all REST routes.
- **CRITICAL:** Every route MUST include an `operationId`. 
- The OpenAPI configuration in `src/backend/index.ts` MUST set `servers: [{ url: 'https://workspace-agent.hacolby.workers.dev' }]`.
- Serve `/openapi.json` and `/swagger`.

### 6. AI & Agents (WorkspaceAgent)
- NEVER use Vercel AI SDK (`ai`, `useChat`). Use `@cloudflare/ai-chat` and `agents`.
- The Agent class must extend `AIChatAgent`.
- **AI Gateway Universal Endpoint:** To dynamically support multiple models via OpenAI compat formatting, construct the base URL using:
  `const baseUrl = env.AI.gateway('workspace-agent').url('universal');`
  Configure the underlying OpenAI/Langchain client inside the agent to use this `baseUrl`.
- Tools MUST include full implementations for Google Docs, Sheets, Gmail, and Apps Script.
- To fulfill the requirement of saving transcripts to D1, utilize the Agent's lifecycle hooks (e.g., `onChatMessage` or a scheduled alarm) to mirror the DO SQLite state to the D1 `transcripts` and `messages` tables.

### 7. Frontend Layout & assistant-ui
- DEFAULT DARK THEME SHADCN — no exceptions. `html class="dark"`.
- Use shadcn `Resizable` to create a split-pane layout on `pages/index.astro` (or the root React component).
- **Left Pane:** `assistant-ui` threaded chat (`<ThreadList>` + `<Thread>`).
- **Right Pane:** An iframe or canvas. 
- **Reactivity:** When the Agent executes a Google tool (like `createGoogleDoc`), the React frontend must parse the tool call result from the message stream and update the right-pane iframe `src` to load that specific document/sheet embedded URL (`https://docs.google.com/document/d/.../edit?embedded=true`).

### 8. Package Manager & Wrangler
- ALWAYS use `pnpm`.
- `pnpm add -D wrangler@latest` before deploying.
- `compatibility_date` is `2026-03-13`.

### 9. Task Management
- Follow `project_tasks.json` in exact sequential order.
- **MANDATORY** -- Update statuses as you progress
- **MANDATORY** -- Use your `cloudflare docs` mcp tool to query each task before starting tasks.
