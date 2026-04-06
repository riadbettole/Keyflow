/**
 * Example: Using Keyflow SDK to protect your API
 *
 * Install: npm install @keyflow/sdk
 *
 * This example shows how an AI Image API developer
 * would integrate Keyflow into their Express app.
 */
/** biome-ignore-all lint/suspicious/noExplicitAny: <example file> */
/** biome-ignore-all lint/correctness/noUnusedVariables: <example file> */

import { KeyflowClient } from '@keyflow/sdk'

const keyflow = new KeyflowClient({
	baseUrl: 'https://your-keyflow-instance.com',
})

// Express middleware example
async function requireApiKey(req: any, res: any, next: any) {
	const key = req.headers['x-api-key']

	if (!key) {
		return res.status(401).json({ error: 'API key required' })
	}

	const result = await keyflow.keys.verify(key)

	if (!result.valid) {
		if (result.reason === 'RateLimitExceeded') {
			return res.status(429).json({
				error: 'Rate limit exceeded',
				retryAfter: result.retryAfter,
			})
		}
		return res.status(401).json({ error: 'Invalid API key' })
	}

	// attach key info to request for downstream use
	req.keyInfo = result
	next()
}

// Your protected route
async function generateImage(req: any, res: any) {
	// req.keyInfo.keyId, req.keyInfo.remaining etc available here
	res.json({ image: '...', requestsRemaining: req.keyInfo.remaining })
}
