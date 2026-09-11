/**
 * Smoke test: submit → scripted event sequence → approve → assert open + 4 systems.
 *
 * Tests the same applyEvent reducer used by both live callbacks and scripted mode.
 * Run via: npm test
 */

import { nanoid }     from 'nanoid'
import { applyEvent } from '../src/lib/apply-event.ts'
import type { Store, RoleRequest } from '../src/lib/types.ts'

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function assert(condition: boolean, msg: string): void {
  if (!condition) {
    console.error(`FAIL: ${msg}`)
    process.exit(1)
  }
}

function evt(requestId: string, event: string, data: Record<string, unknown>) {
  return { eventId: nanoid(), requestId, event, at: new Date().toISOString(), data }
}

/* ── Minimal store fixture ────────────────────────────────────────────────── */

function makeRequest(id: string): RoleRequest {
  return {
    id,
    publicId:        'POZ-2026-SMOKE',
    requesterId:     'u_jana',
    teamId:          't_revmgmt',
    title:           'Revenue manager',
    seniority:       'senior',
    location:        'Praha',
    targetStartDate: '2026-11-01',
    justification:   'Smoke test.',
    status:          'submitted',
    createdAt:       new Date().toISOString(),
    updatedAt:       new Date().toISOString(),
    approval:        null,
    systems: [
      { key: 'ats',       status: 'pending' },
      { key: 'job_board', status: 'pending' },
      { key: 'slack',     status: 'pending' },
      { key: 'drive',     status: 'pending' },
    ],
    events:        [],
    callbackToken: nanoid(),
  }
}

/* ── Run ──────────────────────────────────────────────────────────────────── */

const id  = nanoid()
const req = makeRequest(id)

const store: Store = {
  users: [],
  teams: [],
  bands: [],
  requests: [req],
}

function apply(event: string, data: Record<string, unknown>) {
  const result = applyEvent(store, evt(id, event, data))
  assert(result === 'ok' || result === 'deduplicated',
    `applyEvent returned '${result}' for event '${event}'`)
}

// Pre-decision sequence
apply('flow.started', {})
assert(req.status === 'processing', 'status should be processing after flow.started')

apply('context.loaded', {
  band:                 'Pásmo 4',
  medianTimeToFillDays: 47,
  lastAdWrittenAt:      '2026-06-01T00:00:00Z',
})
assert(req.context?.band === 'Pásmo 4', 'context.band should be set')

apply('draft.ready', {
  jobAd:             'Revenue manager, střední Evropa\n\nNávrh inzerátu.',
  screeningCriteria: ['A', 'B', 'C', 'D', 'E'],
  annualCostMinor:   186_000_00,
  currency:          'CZK',
  seniorityDetected: 'senior',
  inBand:            true,
  band:              'Pásmo 4',
})
assert(req.status === 'awaiting_approval', 'status should be awaiting_approval after draft.ready')
assert(req.draft != null, 'draft should be set')
assert(req.approval?.decision === 'pending', 'approval should be pending')

// Simulate human approval
req.approval!.decision  = 'approved'
req.approval!.decidedAt = new Date().toISOString()

// Post-approval provisioning
apply('system.updated', { system: 'ats',       status: 'created', ref: 'ATS-2026-SMOKE' })
apply('system.updated', { system: 'job_board', status: 'created', ref: 'JB-2026-SMOKE'  })
apply('system.updated', { system: 'slack',     status: 'created', ref: '#smoke-hiring'  })
apply('system.updated', { system: 'drive',     status: 'created', ref: 'Drive/Smoke'    })

const created = req.systems.filter(s => s.status === 'created')
assert(created.length === 4, `expected 4 created systems, got ${created.length}`)

apply('flow.completed', { outcome: 'success' })
assert(req.status === 'open', `expected status open, got ${req.status}`)

// Deduplication guard
const before = req.events.length
const dup = applyEvent(store, evt(id, 'flow.completed', { outcome: 'success' }))
// terminal guard fires before dedup — both 'terminal' and 'deduplicated' are acceptable
assert(dup === 'terminal' || dup === 'deduplicated',
  `expected terminal/deduplicated for post-terminal event, got '${dup}'`)
assert(req.events.length === before, 'no extra event should be pushed after terminal')

console.log('✓ Smoke test passed')
