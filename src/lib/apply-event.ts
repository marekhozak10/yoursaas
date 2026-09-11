import { copy } from '@/lib/copy'
import { isTerminal } from '@/lib/types'
import type { Store, RoleRequest, Seniority } from '@/lib/types'

export interface CallbackPayload {
  eventId:    string
  requestId:  string
  event:      string
  at:         string
  flowRunId?: string
  data:       Record<string, unknown>
}

export type ApplyResult =
  | 'ok'
  | 'deduplicated'
  | 'not_found'
  | 'terminal'

/**
 * Applies one Appmixer callback event to the store in-place.
 * Pure function over the store object — caller is responsible for persisting.
 */
export function applyEvent(s: Store, payload: CallbackPayload): ApplyResult {
  const req = s.requests.find(r => r.id === payload.requestId)
  if (!req) return 'not_found'

  if (isTerminal(req.status)) return 'terminal'

  // Deduplicate: eventId already present in the timeline
  if (req.events.some(e => e.id === payload.eventId)) return 'deduplicated'

  const { event, at, data } = payload
  if (payload.flowRunId) req.flowRunId = payload.flowRunId

  switch (event) {
    case 'flow.started':
      req.status = 'processing'
      push(req, payload.eventId, at, event, 'workflow',
        copy.timeline.summaries['flow.started'])
      break

    case 'context.loaded': {
      req.context = {
        band:                 data.band as string | undefined,
        medianTimeToFillDays: data.medianTimeToFillDays as number | undefined,
        lastAdWrittenAt:      data.lastAdWrittenAt as string | undefined,
      }
      push(req, payload.eventId, at, event, 'workflow',
        copy.timeline.summaries['context.loaded'])
      break
    }

    case 'draft.ready': {
      let criteria = (data.screeningCriteria as string[]) ?? []
      if (criteria.length > 5) {
        console.warn(`[applyEvent] draft.ready sent ${criteria.length} criteria; taking first 5`)
        criteria = criteria.slice(0, 5)
      }
      const inBand = Boolean(data.inBand)
      req.draft = {
        jobAd:             String(data.jobAd ?? ''),
        screeningCriteria: criteria,
        annualCostMinor:   Number(data.annualCostMinor ?? 0),
        currency:          'CZK',
        seniorityDetected: (data.seniorityDetected as Seniority) ?? req.seniority,
        inBand,
        band:              data.band as string | undefined,
        note:              data.note as string | undefined,
      }
      req.status   = 'awaiting_approval'
      req.approval = { approverId: 'u_petra', decision: 'pending' }
      push(req, payload.eventId, at, event, 'agent',
        inBand
          ? copy.timeline.summaries['draft.ready']
          : copy.timeline.summaries['draft.ready.outOfBand'])
      break
    }

    case 'system.updated': {
      const key    = data.system as string
      const status = data.status as 'created' | 'failed'
      const sys = req.systems.find(s => s.key === key)
      if (sys) {
        sys.status    = status
        sys.ref       = data.ref as string | undefined
        sys.url       = data.url as string | undefined
        sys.updatedAt = at
      }
      const summaryKey = `system.updated.${key}`
      push(req, payload.eventId, at, event, 'system',
        copy.timeline.summaries[summaryKey] ?? `Systém ${key} aktualizován`)
      break
    }

    case 'flow.completed':
      req.status = 'open'
      push(req, payload.eventId, at, event, 'workflow',
        copy.timeline.summaries['flow.completed'])
      break

    case 'flow.failed': {
      req.status = 'failed'
      push(req, payload.eventId, at, event, 'workflow',
        copy.timeline.flowFailed(String(data.message ?? 'neznámá chyba')))
      break
    }

    default:
      // Unknown event — log generic entry, change no status
      push(req, payload.eventId, at, event, 'system', `Neznámá událost: ${event}`)
      break
  }

  req.updatedAt = at
  return 'ok'
}

function push(
  req: RoleRequest,
  id: string, at: string, type: string, actor: string, summary: string,
): void {
  req.events.push({ id, at, type, actor, summary })
}
