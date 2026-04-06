import { Hono } from 'hono'
import { keysRouter } from './keys'

export const v1Router = new Hono()

v1Router.route('/keys', keysRouter)
