import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getStore } from '@/lib/store'
import { notifyDecision } from '@/lib/appmixer'
import { copy } from '@/lib/copy'
import { isTerminal } from '@/lib/types'

/**
 * POST /api/pozadavky/decline
 *
 * Declines a pending role request. Intended for automation tools (e.g. Appmixer).
 * Auth: Bearer <callbackToken> — the token that was sent in the original trigger payload.
 *
 * Body:
 *   {
 *     "requestId": "string",
 *     "declinedBy": { "id": "string", "name": "string" },
 *     "comment": "string"   // required — reason for declining
 *   }
 *
 * Responses:
 *   200 { "ok": true }
 *   400 missing fields
 *   401 invalid or missing token
 *   404 request not found
 *   409 request not in awaiting_approval state
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>
  try {
    body = await req.json() as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const requestId  = body.requestId  as string | undefined
  const declinedBy = body.declinedBy as { id: string; name: string } | undefined
  const comment    = body.comment    as string | undefined

  if (!requestId || !declinedBy?.id || !declinedBy?.name || !comment?.trim()) {
    return NextResponse.json(
      { error: 'missing required fields: requestId, declinedBy.id, declinedBy.name, comment' },
      { status: 400 },
    )
  }

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  const store = getStore()
  let result: 'ok' | 'not_found' | 'invalid_token' | 'already_terminal' = 'not_found'
  let declinedRequest: Awaited<ReturnType<typeof store.read>>['requests'][number] | undefined

  const now = new Date().toISOString()

  await store.mutate(s => {
    const req = s.requests.find(r => r.id === requestId)
    if (!req) { result = 'not_found'; return }
    if (req.callbackToken !== token) { result = 'invalid_token'; return }
    if (isTerminal(req.status)) { result = 'already_terminal'; return }

    // If no approval object yet, create one now
    if (!req.approval) {
      req.approval = { approverId: declinedBy.id, decision: 'pending' }
    }
    if (req.approval.decision !== 'pending') { result = 'already_terminal'; return }

    req.approval.decision  = 'declined'
    req.approval.decidedAt = now
    req.approval.comment   = comment.trim()
    req.status = 'declined'
    req.events.push({
      id:      nanoid(),
      at:      now,
      type:    'local.declined',
      actor:   declinedBy.id,
      summary: copy.timeline.summaries['local.declined'],
    })
    req.updatedAt = now
    result = 'ok'
    declinedRequest = req
  })

  if (result === 'not_found')        return NextResponse.json({ error: 'request not found' }, { status: 404 })
  if (result === 'invalid_token')    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  if (result === 'already_terminal') return NextResponse.json({ error: 'request already decided' }, { status: 409 })

  if (declinedRequest) {
    notifyDecision(declinedRequest, declinedBy).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
