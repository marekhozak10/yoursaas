import { join } from "node:path"
import type { Store } from "./types"

/* ── Driver interface ────────────────────────────────────────────────────── */

export interface StoreDriver {
  read(): Promise<Store>
  write(next: Store): Promise<void>
  /**
   * Read → apply fn (which may mutate the store in-place) → write.
   * Serialised: concurrent mutates are queued, not interleaved.
   */
  mutate<T>(fn: (s: Store) => T): Promise<T>
}

/* ── Promise queue (shared serialisation primitive) ─────────────────────── */

function makeQueue() {
  let tail: Promise<void> = Promise.resolve()

  return function enqueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      tail = tail.then(async () => {
        try {
          resolve(await task())
        } catch (err) {
          reject(err)
        }
      })
    })
  }
}

/* ── File driver ─────────────────────────────────────────────────────────── */

class FileDriver implements StoreDriver {
  private readonly storePath: string
  private readonly seedPath: string
  private readonly enqueue = makeQueue()

  constructor(storePath: string, seedPath: string) {
    this.storePath = storePath
    this.seedPath  = seedPath
  }

  async read(): Promise<Store> {
    const { readFile } = await import("node:fs/promises")
    try {
      const raw = await readFile(this.storePath, "utf-8")
      return JSON.parse(raw) as Store
    } catch {
      // store.json missing → fall back to seed (first run / not yet reset)
      const raw = await readFile(this.seedPath, "utf-8")
      return JSON.parse(raw) as Store
    }
  }

  async write(next: Store): Promise<void> {
    const { writeFile, rename } = await import("node:fs/promises")
    const tmp = this.storePath + ".tmp"
    await writeFile(tmp, JSON.stringify(next, null, 2), "utf-8")
    await rename(tmp, this.storePath)
  }

  mutate<T>(fn: (s: Store) => T): Promise<T> {
    return this.enqueue(async () => {
      const s = await this.read()
      const result = fn(s)
      await this.write(s)
      return result
    })
  }
}

/* ── Redis driver ────────────────────────────────────────────────────────── */

class RedisDriver implements StoreDriver {
  private readonly key = "pb_store"
  private readonly enqueue = makeQueue()

  private async client() {
    const { Redis } = await import("@upstash/redis")
    return new Redis({
      url:   process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }

  async read(): Promise<Store> {
    const redis = await this.client()
    const data  = await redis.get<Store>(this.key)
    if (!data) throw new Error("pb_store key not found in Redis — run npm run reset")
    return data
  }

  async write(next: Store): Promise<void> {
    const redis = await this.client()
    await redis.set(this.key, next)
  }

  mutate<T>(fn: (s: Store) => T): Promise<T> {
    return this.enqueue(async () => {
      const s = await this.read()
      const result = fn(s)
      await this.write(s)
      return result
    })
  }
}

/* ── Singleton factory ──────────────────────────────────────────────────── */

let _driver: StoreDriver | null = null

export function getStore(): StoreDriver {
  if (_driver) return _driver

  const driver = process.env.STORE_DRIVER ?? "file"

  if (driver === "redis") {
    _driver = new RedisDriver()
  } else {
    _driver = new FileDriver(
      join(process.cwd(), "data", "store.json"),
      join(process.cwd(), "data", "seed.json"),
    )
  }

  return _driver
}
