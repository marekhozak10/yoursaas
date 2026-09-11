/**
 * ESM loader hook + auto-register.
 *
 * When used with --import, registers itself as a loader hook that resolves
 * the @/ path alias (Next.js convention) to src/ so smoke.ts can import
 * from src/lib/* without a bundler.
 *
 * Usage: node --import ./scripts/loader.mjs --experimental-strip-types scripts/smoke.ts
 */
import { register }    from 'node:module'
import { pathToFileURL } from 'node:url'
import { resolve as pathResolve } from 'node:path'

// Register this file itself as the hook implementation
register(pathToFileURL(import.meta.filename).href, { data: { cwd: process.cwd() } })

// ── Hook implementation (called for every import when this file is the loader) ──

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const rel = specifier.slice(2)
    const abs = pathResolve(process.cwd(), 'src', rel)
    return nextResolve(pathToFileURL(abs + '.ts').href, context)
  }
  return nextResolve(specifier, context)
}
