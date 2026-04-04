# Architecture Decisions

## Why three databases?

Each database is used where its model fits naturally.

**Postgres** — relational core data. Users, organizations, projects, API keys all have clear relationships and need ACID guarantees. Foreign keys and constraints matter here.

**Redis** — ephemeral, high-performance data. Rate limit counters and API key cache need microsecond access times. Redis is in-memory and purpose-built for this.

**MongoDB** — flexible document store. Audit logs and usage logs have varying shapes depending on the event type. A document store handles this more naturally than rigid SQL columns, and these collections are append-only which plays to MongoDB's strengths.

## Why tRPC + REST?

tRPC gives end-to-end type safety between the dashboard frontend and the API — input and output types are shared automatically, no manual type definitions, TypeScript catches breaking changes at compile time.

REST `/v1` exists because external developers using the SDK can't import a tRPC router. They need a stable, versioned HTTP API. Same backend logic, two transport layers.

## Why Better Auth instead of custom auth?

RBAC, organization management, session handling, and API key lifecycle are solved problems. Engineering effort goes into the features that are unique to this platform — the rate limiter, the usage tracking, the webhook system. Better Auth handles the plumbing.

## Why Bun?

Fast installs, fast runtime, built-in test runner, native TypeScript. The whole toolchain is simpler — no ts-node, no transpilation step, no separate test framework needed.

## Why Turborepo?

The project has four distinct consumers of shared code — API, frontend, SDK, CLI. Turborepo manages the build graph so shared packages rebuild only when changed, dev runs in parallel across apps, and the CI pipeline caches correctly.