# API Key Verification Flow

## Overview

Every external API request goes through a single endpoint:
```
POST /v1/keys/verify
x-api-key: kf_xxx
```

## Flow
```
1. Extract x-api-key header
        ↓
2. Check Redis cache (key: apikey:{raw_key})
   → hit:  return cached data immediately
   → miss: fall through
        ↓
3. Call Better Auth verifyApiKey (reads Postgres)
   → invalid: return { valid: false }
   → valid: continue
        ↓
4. Write to Redis cache (TTL: 5 minutes)
        ↓
5. Write to MongoDB usage_logs
        ↓
6. Return { valid: true, keyId, projectId, remaining }
```

## Tradeoffs

**Cache TTL of 5 minutes** means a revoked key can remain valid for up to 5 minutes after revocation. This is a known and accepted tradeoff — the same approach Stripe and Twilio use. Immediate revocation would require bypassing the cache on every revoke call, which we do:

When a key is revoked via `apiKeys.revoke`, the cache entry should be deleted from Redis immediately. This is a known improvement to make.

## Why not just Postgres on every request?

At 1000 requests/second, hitting Postgres on every verify call means 1000 database queries per second on your hot path. Redis handles hundreds of thousands of operations per second in memory. The cache-aside pattern is the standard solution to this problem.