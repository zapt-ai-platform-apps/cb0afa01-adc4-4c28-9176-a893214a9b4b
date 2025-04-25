import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../drizzle/schema.js';

export function getDbClient() {
  const connectionString = process.env.COCKROACH_DB_URL;
  if (!connectionString) {
    throw new Error('Missing COCKROACH_DB_URL environment variable');
  }
  
  const client = postgres(connectionString);
  return drizzle(client, { schema });
}