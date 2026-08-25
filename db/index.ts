import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.VISITOR_DB) {
    throw new Error(
      "Cloudflare D1 binding `VISITOR_DB` is unavailable. Configure the portfolio database before using it."
    );
  }

  return drizzle(env.VISITOR_DB, { schema });
}
