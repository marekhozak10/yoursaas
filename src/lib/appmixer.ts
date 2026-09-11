import { createHmac } from 'node:crypto'
import { nanoid } from 'nanoid'
import { getStore } from '@/lib/store'
import { copy } from '@/lib/copy'
import { startScriptedRun } from '@/lib/scripted-run'
import type { RoleRequest } from '@/lib/types'

function sign(body: string): string {
  const secret = process.env.APPMIXER_SIGNING_SECRET ?? ''
  return 'sha256=' + createHmac('sha256', secret).update(body, 'utf-8').digest('hex')
}

/**
 * Fires the Appmixer trigger webhook. Never throws.
 * On failure, appends a local.trigger_failed timeline event.
 * If APPMIXER_TRIGGER_URL is unset, returns silently (scripted mode will handle it).
 */
export async function triggerFlow(request: RoleRequest): Promise<void> {
  // Scripted mode: skip the real webhook and replay the sequence locally
  const triggerUrl = process.env.APPMIXER_TRIGGER_URL
  if (process.env.DEMO_MODE === 'scripted' || !triggerUrl) {
    await startScriptedRun(request.id)
    return
  }

  const store = getStore()
  const { users, teams } = await store.read()
  const requester = users.find(u => u.id === request.requesterId)
  const team = teams.find(t => t.id === request.teamId)
  if (!requester || !team) return

  const appUrl = (process.env.APP_PUBLIC_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  const payload = {
    requestId:    request.id,
    publicId:     request.publicId,
    submittedAt:  request.createdAt,
    tenant: { id: 'alpina', name: 'Alpina Hotels Group' },
    requester: {
      id:    requester.id,
      name:  requester.name,
      email: requester.email,
      title: requester.title,
    },
    team: {
      id:         team.id,
      name:       team.name,
      costCenter: team.costCenter,
    },
    role: {
      title:           request.title,
      seniority:       request.seniority,
      location:        request.location,
      targetStartDate: request.targetStartDate,
    },
    justification: request.justification,
    callbackUrl:   `${appUrl}/api/appmixer/callback`,
    callbackToken: request.callbackToken,
  }

  const body = JSON.stringify(payload)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(triggerUrl, {
      method:  'POST',
      headers: {
        'Content-Type':            'application/json; charset=utf-8',
        'X-Peoplebase-Signature':  sign(body),
        'X-Peoplebase-Request-Id': request.id,
      },
      body,
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) {
      await appendTriggerFailed(request.id)
      await startScriptedRun(request.id)
    }
  } catch {
    clearTimeout(timer)
    await appendTriggerFailed(request.id)
    await startScriptedRun(request.id)
  }
}

/**
 * Notifies Appmixer of a human approval decision. Never throws.
 * If APPMIXER_DECISION_URL is unset, returns silently.
 */
export async function notifyDecision(
  request: RoleRequest,
  decidedBy: { id: string; name: string },
): Promise<void> {
  const decisionUrl = process.env.APPMIXER_DECISION_URL
  if (!decisionUrl) return
  if (!request.approval || request.approval.decision === 'pending') return

  const payload = {
    requestId:  request.id,
    publicId:   request.publicId,
    decision:   request.approval.decision,
    decidedBy,
    comment:    request.approval.comment ?? null,
    decidedAt:  request.approval.decidedAt,
  }

  const body = JSON.stringify(payload)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 5000)

  try {
    await fetch(decisionUrl, {
      method: 'POST',
      headers: {
        'Content-Type':           'application/json; charset=utf-8',
        'X-Peoplebase-Signature': sign(body),
      },
      body,
      signal: controller.signal,
    })
    clearTimeout(timer)
  } catch {
    clearTimeout(timer)
    // Decision is already persisted locally — no timeline event needed
  }
}

async function appendTriggerFailed(requestId: string): Promise<void> {
  const now = new Date().toISOString()
  await getStore().mutate(s => {
    const req = s.requests.find(r => r.id === requestId)
    if (!req) return
    req.events.push({
      id:      nanoid(),
      at:      now,
      type:    'local.trigger_failed',
      actor:   'system',
      summary: copy.timeline.summaries['local.trigger_failed'],
    })
    req.updatedAt = now
  })
}
