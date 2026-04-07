import { Hono } from 'hono'
import { keysRouter } from './keys'
import { stripeRouter } from './stripe'

export const v1Router = new Hono()

v1Router.route('/keys', keysRouter)
v1Router.route('/stripe', stripeRouter)
