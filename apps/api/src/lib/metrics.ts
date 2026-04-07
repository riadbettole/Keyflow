import { Counter, collectDefaultMetrics, Histogram, Registry } from 'prom-client'

export const registry = new Registry()

collectDefaultMetrics({ register: registry })

export const httpRequestsTotal = new Counter({
	name: 'http_requests_total',
	help: 'Total number of HTTP requests',
	labelNames: ['method', 'path', 'status'],
	registers: [registry],
})

export const httpRequestDuration = new Histogram({
	name: 'http_request_duration_ms',
	help: 'HTTP request duration in milliseconds',
	labelNames: ['method', 'path', 'status'],
	buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500],
	registers: [registry],
})

export const apiKeyVerifications = new Counter({
	name: 'api_key_verifications_total',
	help: 'Total number of API key verifications',
	labelNames: ['result'], // 'valid', 'invalid', 'rate_limited'
	registers: [registry],
})

// Rate limit hits counter
export const rateLimitHits = new Counter({
	name: 'rate_limit_hits_total',
	help: 'Total number of rate limit hits',
	registers: [registry],
})

// Webhook deliveries counter
export const webhookDeliveries = new Counter({
	name: 'webhook_deliveries_total',
	help: 'Total number of webhook delivery attempts',
	labelNames: ['status'], // 'success', 'failed'
	registers: [registry],
})
