import { env } from '@keyflow/env/server'
import { MongoClient } from 'mongodb'

const client = new MongoClient(env.MONGODB_URL)

export const mongo = client.db('keyflow')

client.connect()
