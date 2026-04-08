# Rate Limiter

Keyflow uses a sliding window algorithm implemented with Redis sorted sets. This is a meaningful choice over the simpler alternatives and worth understanding.

## The problem with fixed windows

A fixed window counter resets every N seconds. A user could send 1000 requests at 11:59 and 1000 more at 12:01 — 2000 requests in 2 minutes while technically staying within a 1000/hour limit. This burst vulnerability is a known weakness.

## How sliding window works

Instead of a counter that resets, every request is stored as an entry in a Redis sorted set, scored by its timestamp. To check the limit we count entries within the last N milliseconds. Old entries are removed automatically. The window moves with time rather than resetting at fixed boundaries.