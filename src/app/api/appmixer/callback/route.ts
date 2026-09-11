import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import { applyEvent } from '@/lib/apply-event'

function verifySignature(body: string, header: string | null): boolean {
  if (!header) return false
  const secret = process.env.APPMIXER_SIGNING_SECRET ?? ''
  const expected = 'sha256=' + createHmac('sha256', secret).update(body, 'utf-8').digest('hex')
  try {
    if (expected.length !== header.length) return false
    return timingSafeEqual(Buffer.from(expected, 'utf-8'), Buffer.from(header, 'utf-8'))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Read raw body for signature verification
  let rawBody: string
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  // 2. Verify signature
  if (!verifySignature(rawBody, req.headers.get('x-appmixer-signature'))) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  // 3. Parse JSON
  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  const { eventId, requestId, event, at, flowRunId, data } = payload
  if (!eventId || !requestId || !event || !at) {
    return NextResponse.json({ error: 'missing required fields' }, { status: 400 })
  }

  // 4. Verify Bearer token — looked up against the stored callbackToken
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  const store = getStore()

  // 5. Apply event (token check + mutation in one serialised step)
  let tokenOk = false
  await store.mutate(s => {
    const found = s.requests.find(r => r.id === String(requestId))
    if (!found) { tokenOk = true; return }   // unknown request — still 200 later
    if (found.callbackToken !== token) return  // tokenOk stays false
    tokenOk = true
    applyEvent(s, {
      eventId:   String(eventId),
      requestId: String(requestId),
      event:     String(event),
      at:        String(at),
      flowRunId: flowRunId != null ? String(flowRunId) : undefined,
      data:      (data as Record<string, unknown>) ?? {},
    })
  })

  if (!tokenOk) {
    return NextResponse.json({ error: 'invalid token' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
