import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __amplifyPgClient: ReturnType<typeof postgres> | undefined;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill in your Postgres connection string."
  );
}

// Reuse the connection across hot-reloads in development so we don't open a
// new pool of Postgres connections on every file save.
const client =
  global.__amplifyPgClient ??
  postgres(connectionString, { prepare: false, max: 10 });

if (process.env.NODE_ENV !== "production") {
  global.__amplifyPgClient = client;
}

export const db = drizzle(client, { schema });
