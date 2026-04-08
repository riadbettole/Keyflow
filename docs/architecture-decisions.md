rkdown# Architecture Decisions

## Three databases

Postgres handles relational data — users, organizations, projects, API keys. These have real relationships, need foreign keys, and payment operations need ACID guarantees. It's the source of truth.

Redis handles two things: the API key cache (5 minute TTL, cache-aside pattern) and the rate limiter (sorted sets for sliding window). Both need microsecond access times. Redis is in-memory and purpose-built for exactly this.

MongoDB handles audit logs and usage logs. These are append-only collections where each document has a different shape depending on the event type — a project.created event looks nothing like a key.rate_limit_exceeded event. A document store is more natural here than forcing a rigid SQL schema. Neither collection is ever updated, only inserted.

## tRPC and REST coexisting

The dashboard uses tRPC — full end-to-end type safety, input and output types shared automatically, TypeScript catches breaking changes at compile time. No manually maintained API types.

REST `/v1` exists for the SDK and CLI. External developers can't import your tRPC router, and they shouldn't have to. Same backend logic, two transport layers. tRPC for internal consumers, REST for external ones.

## Better Auth over custom auth

RBAC, organization management, session handling, API key lifecycle — these are solved problems. The engineering effort here goes into what's actually unique: the sliding window rate limiter, the webhook delivery system, the cache-aside pattern. Better Auth handles the plumbing so we don't have to.

## Bun

Fast installs, fast runtime, native TypeScript. No ts-node, no transpilation, no separate test runner needed. The whole toolchain is simpler and the monorepo builds faster because of it.

## Turborepo

Four separate consumers of shared code — API, frontend, SDK, CLI — all in one repo. Turborepo manages the build graph so shared packages only rebuild when they change, dev servers run in parallel, and CI caches correctly across runs.

## Stripe idempotency

Stripe can deliver the same webhook multiple times. Every processed event ID is stored in a processed_events table. Before handling any event we check this table — duplicates are acknowledged and skipped. This means payment operations are safe under retry storms without any additional coordination.

## Active organization on session

Better Auth stores activeOrganizationId on the session rather than the user, which supports multi-org users but requires explicitly setting it on each new session. Keyflow handles this via a `/v1/auth/activate` endpoint that all clients call after login — browser, CLI, and future SDK integrations. This centralizes the logic instead of duplicating workarounds per client.

