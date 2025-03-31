import { defineConfig } from "drizzle-kit";
import { findSqliteDatabase } from "./bin/find-db";

/**
 * This is currently assumed to be for local development
 * - migrations should be generated and tracked in git
 * - and applied with `wrangler d1 migrations apply` to the appropriate environment
 */
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: findSqliteDatabase(),
  },
});
