import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getStore } from '@/lib/store'
import { notifyDecision } from '@/lib/appmixer'
import { copy } from '@/lib/copy'
import { isTerminal } from '@/lib/types'

/**
 * POST /api/pozadavky/approve
 *
 * Approves a role request. Works regardless of whether draft.ready has been
 * received — any non-terminal request can be approved in one call.
 * Auth: Bearer <callbackToken> — the token sent in the original trigger payload.
 *
 * Body:
 *   { "requestId": "string", "approvedBy": { "id": "string", "name": "string" } }
 *
 * Responses:
 *   200 { "ok": true }
 *   400 missing fields
 *   401 invalid or missing token
 *   404 request not found
 *   409 request already in a terminal state (open/declined/failed)
 */
function relaxedParse(s: string): unknown {
  // Strip trailing commas before ] or } to fix common Appmixer templating artifacts
  return JSON.parse(s.replace(/,\s*([\]}])/g, '$1'))
}

async function parseBody(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text()
    let parsed = relaxedParse(text)
    // Handle double-encoded JSON (Appmixer wraps body in extra quotes)
    if (typeof parsed === 'string') parsed = relaxedParse(parsed)
    return parsed as Record<string, unknown>
  } catch {
    return null
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await parseBody(req)
  if (!body) return NextResponse.json({ error: 'invalid json' }, { status: 400 })

  const requestId  = body.requestId  as string | undefined
  const rawBy      = body.approvedBy as { id?: string; name?: string } | undefined
  const approvedBy = {
    id:   rawBy?.id   ?? 'appmixer',
    name: rawBy?.name ?? 'Appmixer',
  }
  const jobAdUrl    = body.jobAdUrl    as string | undefined
  const linkedInUrl = body.linkedInUrl as string | undefined

  if (!requestId) {
    return NextResponse.json(
      { error: 'missing required field: requestId' },
      { status: 400 },
    )
  }

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  const store = getStore()
  let result: 'ok' | 'not_found' | 'invalid_token' | 'already_terminal' = 'not_found'
  let approvedRequest: Awaited<ReturnType<typeof store.read>>['requests'][number] | undefined

  const now = new Date().toISOString()

  await store.mutate(s => {
    const req = s.requests.find(r => r.id === requestId)
    if (!req) { result = 'not_found'; return }
    if (req.callbackToken !== token) { result = 'invalid_token'; return }
    if (isTerminal(req.status)) { result = 'already_terminal'; return }

    // If no approval object yet (draft.ready not sent), create one now
    if (!req.approval) {
      req.approval = { approverId: approvedBy.id, decision: 'pending' }
    }
    // If already decided, treat as terminal
    if (req.approval.decision !== 'pending') { result = 'already_terminal'; return }

    req.approval.decision      = 'approved'
    req.approval.decidedAt     = now
    req.approval.decidedByName = approvedBy.name
    req.status = 'approved'
    if (jobAdUrl)    req.jobAdUrl    = jobAdUrl
    if (linkedInUrl) req.linkedInUrl = linkedInUrl
    req.events.push({
      id:      nanoid(),
      at:      now,
      type:    'local.approved',
      actor:   approvedBy.id,
      summary: `${approvedBy.name} schválil/a`,
    })
    req.updatedAt = now
    result = 'ok'
    approvedRequest = req
  })

  if (result === 'not_found')      return NextResponse.json({ error: 'request not found' }, { status: 404 })
  if (result === 'invalid_token')  return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  if (result === 'already_terminal') return NextResponse.json({ error: 'request already decided' }, { status: 409 })

  if (approvedRequest) {
    notifyDecision(approvedRequest, approvedBy).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
