# Coding Agent Instructions

## MANDATORY STANDARDS — READ BEFORE ANY WORK

### 1. Secrets Management (CRITICAL UPDATE)
- Do NOT access secrets directly via `env.SECRET_NAME`.
- **MUST** use the asynchronous `.get()` method: `await env.SECRET_NAME.get()`.
- **Google Service Account Auth:** Because SA keys exceed Cloudflare Worker secret limits, the key is split into two parts. You MUST reconstruct it precisely:
  ```typescript
  const pt1 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_1.get();
  const pt2 = await env.GOOGLE_CREDS_SA_PRIVATE_KEY_PT_2.get();
  const privateKey = pt1 + pt2;
