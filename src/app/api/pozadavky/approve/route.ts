import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getStore } from '@/lib/store'
import { notifyDecision } from '@/lib/appmixer'
import { copy } from '@/lib/copy'

/**
 * POST /api/pozadavky/approve
 *
 * Approves a pending role request. Intended for automation tools (e.g. Appmixer).
 * Auth: Bearer <callbackToken> — the token that was sent in the original trigger payload.
 *
 * Body:
 *   { "requestId": "string", "approvedBy": { "id": "string", "name": "string" } }
 *
 * Responses:
 *   200 { "ok": true }
 *   400 missing fields
 *   401 invalid or missing token
 *   404 request not found
 *   409 request not in awaiting_approval state
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Parse body
  let body: Record<string, unknown>
  try {
    body = await req.json() as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const requestId = body.requestId as string | undefined
  const approvedBy = body.approvedBy as { id: string; name: string } | undefined

  if (!requestId || !approvedBy?.id || !approvedBy?.name) {
    return NextResponse.json(
      { error: 'missing required fields: requestId, approvedBy.id, approvedBy.name' },
      { status: 400 },
    )
  }

  // Auth: Bearer token must match the request's callbackToken
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  const store = getStore()
  let result: 'ok' | 'not_found' | 'invalid_token' | 'not_pending' = 'not_found'
  let approvedRequest: Awaited<ReturnType<typeof store.read>>['requests'][number] | undefined

  const now = new Date().toISOString()

  await store.mutate(s => {
    const req = s.requests.find(r => r.id === requestId)
    if (!req) { result = 'not_found'; return }
    if (req.callbackToken !== token) { result = 'invalid_token'; return }
    if (req.approval?.decision !== 'pending') { result = 'not_pending'; return }

    req.approval.decision  = 'approved'
    req.approval.decidedAt = now
    req.status = 'approved'
    req.events.push({
      id:      nanoid(),
      at:      now,
      type:    'local.approved',
      actor:   approvedBy.id,
      summary: copy.timeline.summaries['local.approved'],
    })
    req.updatedAt = now
    result = 'ok'
    approvedRequest = req
  })

  if (result === 'not_found') {
    return NextResponse.json({ error: 'request not found' }, { status: 404 })
  }
  if (result === 'invalid_token') {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  }
  if (result === 'not_pending') {
    return NextResponse.json({ error: 'request is not awaiting approval' }, { status: 409 })
  }

  // Notify Appmixer of the decision (best-effort, non-blocking)
  if (approvedRequest) {
    notifyDecision(approvedRequest, approvedBy).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
