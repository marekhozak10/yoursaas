/**
 * Restore the store from the seed file.
 *
 * File mode  (default): copies data/seed.json → data/store.json
 * Redis mode (STORE_DRIVER=redis): writes the seed JSON to the pb_store key
 *
 * Run via: npm run reset
 */

import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const root     = process.cwd()
const seedPath = join(root, "data", "seed.json")
const storePath = join(root, "data", "store.json")

const seedText = readFileSync(seedPath, "utf-8")

if (process.env.STORE_DRIVER === "redis") {
  const { Redis } = await import("@upstash/redis")

  const redis = new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  await redis.set("pb_store", JSON.parse(seedText))
  console.log("✓ Reset: seed written to Redis key pb_store")
} else {
  writeFileSync(storePath, seedText)
  console.log("✓ Reset: data/store.json restored from data/seed.json")
}
