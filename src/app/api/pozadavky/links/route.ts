import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@/lib/store'
import { revalidatePath } from 'next/cache'

/**
 * POST /api/pozadavky/links
 *
 * Sets jobAdUrl and/or linkedInUrl on a request. Call this from Appmixer
 * after publishing the job ad and LinkedIn post.
 * Auth: Bearer <callbackToken>
 *
 * Body:
 *   {
 *     "requestId": "string",
 *     "jobAdUrl":    "https://docs.google.com/...",   // optional
 *     "linkedInUrl": "https://www.linkedin.com/..."   // optional
 *   }
 *
 * Responses:
 *   200 { "ok": true }
 *   400 missing fields
 *   401 invalid token
 *   404 request not found
 */
async function parseBody(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    let parsed = await req.json()
    if (typeof parsed === 'string') parsed = JSON.parse(parsed)
    return parsed as Record<string, unknown>
  } catch {
    return null
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await parseBody(req)
  if (!body) return NextResponse.json({ error: 'invalid json' }, { status: 400 })

  const requestId   = body.requestId   as string | undefined
  const jobAdUrl    = body.jobAdUrl    as string | undefined
  const linkedInUrl = body.linkedInUrl as string | undefined

  if (!requestId) {
    return NextResponse.json({ error: 'missing required field: requestId' }, { status: 400 })
  }

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  let result: 'ok' | 'not_found' | 'invalid_token' = 'not_found'

  await getStore().mutate(s => {
    const request = s.requests.find(r => r.id === requestId)
    if (!request) { result = 'not_found'; return }
    if (request.callbackToken !== token) { result = 'invalid_token'; return }

    if (jobAdUrl)    request.jobAdUrl    = jobAdUrl
    if (linkedInUrl) request.linkedInUrl = linkedInUrl

    request.updatedAt = new Date().toISOString()
    result = 'ok'
  })

  if (result === 'not_found')     return NextResponse.json({ error: 'request not found' }, { status: 404 })
  if (result === 'invalid_token') return NextResponse.json({ error: 'invalid token' }, { status: 401 })

  revalidatePath(`/pozadavky/${requestId}`)
  return NextResponse.json({ ok: true })
}
