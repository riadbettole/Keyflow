# API Key Verification Flow

Every external API request goes through one endpoint:
POST /v1/keys/verify
x-api-key: kf_xxx

## What happens

Extract x-api-key header
→ missing: return 401 MissingApiKey
Check Redis cache (key: apikey:{raw_key})
→ hit:  use cached key data, skip Postgres
→ miss: call Better Auth verifyApiKey (reads Postgres)
→ invalid: return 401 InvalidApiKey
→ valid: write to Redis cache (TTL 5 min)
Sliding window rate limit check (Redis sorted set)
→ exceeded: return 429 RateLimitExceeded + Retry-After header
fire webhook (non-blocking)
→ allowed:  continue
Write to MongoDB usage_logs (async)
Return { valid: true, keyId, projectId, remaining }


## Rate limit headers

Every response includes rate limit headers regardless of outcome so clients can track their usage before hitting the wall:
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
Retry-After: 42  (only on 429)

## Known tradeoffs

The 5 minute cache TTL means a revoked key can still pass for up to 5 minutes after revocation. This is an accepted tradeoff — Stripe and Twilio use the same approach. The right fix is to delete the Redis cache entry immediately on revoke, which is a known improvement not yet implemented.

At 1000 requests per second, hitting Postgres on every verify call means 1000 database queries per second on the hot path. Redis handles hundreds of thousands of operations per second in memory. The cache-aside pattern exists specifically for this problem.
