import * as fs from "fs";
import * as path from "path";

/**
 * Finds the D1 database for local development
 */
export function findSqliteDatabase() {
  const wranglerPath = path.join(
    ".wrangler",
    "state",
    "v3",
    "d1",
    "miniflare-D1DatabaseObject",
  );

  if (!fs.existsSync(wranglerPath)) return null;

  const files = fs.readdirSync(wranglerPath);
  const sqliteFile = files.find((file: string) => file.endsWith(".sqlite"));

  return sqliteFile ? path.join(wranglerPath, sqliteFile) : null;
}
