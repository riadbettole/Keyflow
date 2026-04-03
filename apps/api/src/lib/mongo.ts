import { env } from '@keyflow/env/server'
import { MongoClient } from 'mongodb'
import { logger } from './logger'

const client = new MongoClient(env.MONGODB_URL)

await client.connect()
logger.info('MongoDB connected')

export const mongo = client.db('keyflow')
