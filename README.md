# Keyflow

> A developer platform for issuing API keys, tracking usage, and managing access — built with production-grade architecture.

## What is Keyflow?

Keyflow is a platform that lets developers monetize and manage their APIs.

Think of it as the infrastructure layer between your API and your users. Instead of building auth, rate limiting, usage tracking, and billing yourself, you integrate Keyflow and get all of it out of the box.

### The core story

You built an AI image generation API. You want to:
- Give users access via API keys
- Track how many requests each user makes  
- Rate limit them based on their plan
- Get notified when usage thresholds are hit
- See everything in a clean dashboard

That's exactly what Keyflow does.

### User stories

**As an API developer (you):**
- I can create projects and generate API keys for them
- I can see how many requests each key has made
- I can set rate limits per key
- I can receive webhooks when usage thresholds are hit
- I can manage my team with role-based access
- I can charge users via Stripe based on usage

**As an API consumer (your users):**
- I receive an API key to authenticate my requests
- I get clear errors when I exceed my rate limit
- I can see my own usage

## Architecture
```
Client Dashboard (React + Vite)
          ↓
    API Gateway (Hono)
          ↓
    ┌─────┴──────────┐
  tRPC            REST /v1
(dashboard)     (SDK + CLI)
    └─────┬──────────┘
          ↓
    Core Services
    ├── Auth (Better Auth)
    ├── API Key Management
    ├── Rate Limiting
    ├── Usage Tracking
    ├── Webhooks
    └── Billing (Stripe)
          ↓
  ┌───────┼───────┐
Postgres Redis  MongoDB
```

## Key engineering decisions

### Cache-aside for API key validation
Every inbound request validates an API key. Hitting Postgres on every request creates a bottleneck at scale. Keys are cached in Redis with a 5 minute TTL — cache hit means microsecond validation, cache miss falls through to Postgres. If Redis goes down the system degrades gracefully, never breaks.

### Two separate MongoDB collections
`usage_logs` captures every verify call for billing and charts. `audit_logs` captures user actions (key created, key revoked) for accountability. They answer different questions and grow at different rates — merging them would be the wrong tradeoff.

### Rate limiting with sliding window
Instead of a simple counter, Keyflow uses a sliding window algorithm in Redis. This prevents burst abuse at window boundaries — a known weakness of fixed window rate limiting.

### RBAC with organization-scoped ownership
API keys belong to organizations, not individuals. Team members have explicit typed roles (admin, member). When someone leaves a company their keys don't disappear — the org owns them.

### REST + tRPC dual layer
tRPC serves the dashboard frontend with full end-to-end type safety. REST `/v1` serves the SDK and CLI — external developers can't import your tRPC router so they get a clean versioned HTTP API. Same backend, two interfaces, each suited to its consumer.

### Idempotency on payments (coming)
Stripe webhooks can deliver the same event multiple times. Every payment operation will use an idempotency key so duplicate events produce no duplicate effect.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TanStack Router |
| Backend | Hono, tRPC, Better Auth |
| ORM | Drizzle |
| Primary DB | PostgreSQL |
| Cache | Redis |
| Document store | MongoDB |
| Payments | Stripe (coming) |
| Infra | Docker, AWS, Terraform (coming) |
| Tooling | Turborepo, Bun, Biome, GitHub Actions |

## Project structure
```
apps/
  api/          → Hono backend (tRPC + REST)
  web/          → React dashboard (coming)

packages/
  db/           → Drizzle schema + migrations
  errors/       → Shared error types and Result pattern
  env/          → t3-env validated environment variables

tools/
  cli/          → CLI tool (coming)
```

## Running locally

**Prerequisites:** Bun, Docker
```bash
# clone
git clone https://github.com/riadbettole/keyflow

# install
bun install

# start databases
docker compose up -d

# environment
cp apps/api/.env.example apps/api/.env

# push schema
bun db:push

# start
bun dev
```

## API

### Verify an API key
```
POST /v1/keys/verify
x-api-key: kf_your_key_here
```
```json
{
  "valid": true,
  "keyId": "...",
  "projectId": "...",
  "organizationId": "...",
  "remaining": 950,
  "expiresAt": null
}
```

## Roadmap

- [x] Monorepo + tooling (Turborepo, Bun, Biome, CI)
- [x] Auth with organization RBAC (Better Auth)
- [x] Database layer (Drizzle + Postgres)
- [x] Local infrastructure (Docker — Postgres, Redis, MongoDB)
- [x] API key management (create, list, revoke)
- [x] Key verification with Redis cache-aside
- [x] Usage tracking (MongoDB)
- [x] Audit logs (MongoDB)
- [ ] Rate limiting (sliding window)
- [ ] Dashboard (React)
- [ ] Webhooks
- [ ] Billing (Stripe)
- [ ] SDK
- [ ] CLI
- [ ] Terraform + AWS