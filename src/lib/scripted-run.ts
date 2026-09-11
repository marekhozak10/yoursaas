import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { nanoid } from 'nanoid'
import { getStore } from '@/lib/store'
import { applyEvent } from '@/lib/apply-event'
import type { CallbackPayload } from '@/lib/apply-event'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function evt(requestId: string, event: string, data: Record<string, unknown>): CallbackPayload {
  return { eventId: nanoid(), requestId, event, at: new Date().toISOString(), data }
}

async function apply(requestId: string, event: string, data: Record<string, unknown>): Promise<void> {
  const payload = evt(requestId, event, data)
  await getStore().mutate(s => { applyEvent(s, payload) })
}

/* ── Draft parser ─────────────────────────────────────────────────────────── */

interface ScriptedDraft {
  jobAd:                string
  screeningCriteria:    string[]
  annualCostMinor:      number
  currency:             string
  seniorityDetected:    string
  inBand:               boolean
  band:                 string
  medianTimeToFillDays: number
  lastAdWrittenAt:      string
}

function parseDraft(): ScriptedDraft {
  const raw = readFileSync(join(process.cwd(), 'data', 'scripted-draft.md'), 'utf-8')

  // Split frontmatter from body
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error('scripted-draft.md: missing frontmatter delimiters')

  const fm   = match[1]
  const jobAd = match[2].trim()

  // Minimal YAML parser: scalar key: value and list items under screeningCriteria
  const kv: Record<string, string> = {}
  const criteria: string[]          = []
  let inList = false

  for (const line of fm.split('\n')) {
    if (/^\s+-\s+/.test(line)) {
      criteria.push(line.replace(/^\s+-\s+/, '').trim())
      continue
    }
    inList = false
    const m = line.match(/^([\w]+):\s*(.*)$/)
    if (!m) continue
    if (m[1] === 'screeningCriteria') { inList = true; continue }
    kv[m[1]] = m[2].trim()
  }
  void inList // used implicitly above

  return {
    jobAd,
    screeningCriteria:    criteria,
    annualCostMinor:      Number(kv.annualCostMinor),
    currency:             kv.currency ?? 'CZK',
    seniorityDetected:    kv.seniorityDetected,
    inBand:               kv.inBand === 'true',
    band:                 kv.band,
    medianTimeToFillDays: Number(kv.medianTimeToFillDays),
    lastAdWrittenAt:      kv.lastAdWrittenAt,
  }
}

/* ── Main export ──────────────────────────────────────────────────────────── */

/**
 * Replays the full Appmixer event sequence through the same applyEvent reducer,
 * with realistic delays. Pauses after draft.ready and waits for the human decision
 * before continuing with system provisioning.
 *
 * Call this inside after() so it runs after the response is sent.
 */
export async function startScriptedRun(requestId: string): Promise<void> {
  let draft: ScriptedDraft
  try {
    draft = parseDraft()
  } catch (e) {
    console.error('[scripted-run] Failed to parse scripted-draft.md:', e)
    return
  }

  // ── Pre-decision sequence ──────────────────────────────────────────────────
  // Delays are elapsed time from the previous event (not cumulative from start).
  // Derived from the doc table by taking the delta between consecutive rows.

  await sleep(600)   // 0.6 s → flow.started
  await apply(requestId, 'flow.started', {})

  await sleep(1500)  // 2.1 s total → context.loaded
  await apply(requestId, 'context.loaded', {
    band:                 draft.band,
    medianTimeToFillDays: draft.medianTimeToFillDays,
    lastAdWrittenAt:      draft.lastAdWrittenAt,
  })

  await sleep(4300)  // 6.4 s total → draft.ready
  await apply(requestId, 'draft.ready', {
    jobAd:             draft.jobAd,
    screeningCriteria: draft.screeningCriteria,
    annualCostMinor:   draft.annualCostMinor,
    currency:          draft.currency,
    seniorityDetected: draft.seniorityDetected,
    inBand:            draft.inBand,
    band:              draft.band,
  })

  // ── Wait for the human decision (no timeout) ───────────────────────────────
  let approved = false
  for (;;) {
    await sleep(500)
    const { requests } = await getStore().read()
    const req = requests.find(r => r.id === requestId)
    if (!req?.approval) return              // request disappeared
    if (req.approval.decision === 'approved') { approved = true; break }
    if (req.approval.decision === 'declined') return  // already terminal
  }

  if (!approved) return

  // ── Post-approval system provisioning ─────────────────────────────────────
  // Numbers below are deltas from the doc's cumulative column (1.2, 2.4, 3.1, 4.0, 4.6).

  await sleep(1200)  // 1.2 s after decision
  await apply(requestId, 'system.updated', { system: 'ats',      status: 'created', ref: 'ATS-2026-00847' })

  await sleep(1200)  // 2.4 s after decision
  await apply(requestId, 'system.updated', { system: 'job_board', status: 'created', ref: 'JB-2026-00312' })

  await sleep(700)   // 3.1 s after decision
  await apply(requestId, 'system.updated', { system: 'slack',    status: 'created', ref: '#revenue-eu-hiring' })

  await sleep(900)   // 4.0 s after decision
  await apply(requestId, 'system.updated', { system: 'drive',    status: 'created', ref: 'Drive/Revenue-manager-POZ-2026-014' })

  await sleep(600)   // 4.6 s after decision
  await apply(requestId, 'flow.completed', { outcome: 'success' })
}
