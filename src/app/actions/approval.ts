'use server'

import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'
import { getStore } from '@/lib/store'
import { currentUser } from '@/lib/person'
import { notifyDecision } from '@/lib/appmixer'
import { copy } from '@/lib/copy'

export async function approveRequest(requestId: string): Promise<void> {
  const user = await currentUser()
  if (user.role !== 'hrbp') return

  const now = new Date().toISOString()

  await getStore().mutate(s => {
    const req = s.requests.find(r => r.id === requestId)
    if (!req || !req.approval || req.approval.decision !== 'pending') return
    req.approval.decision      = 'approved'
    req.approval.decidedAt     = now
    req.approval.decidedByName = user.name
    req.status = 'approved'
    req.events.push({
      id:      nanoid(),
      at:      now,
      type:    'local.approved',
      actor:   user.id,
      summary: copy.timeline.summaries['local.approved'],
    })
    req.updatedAt = now
  })

  after(async () => {
    const { requests } = await getStore().read()
    const req = requests.find(r => r.id === requestId)
    if (req) await notifyDecision(req, { id: user.id, name: user.name })
  })

  revalidatePath('/pozadavky')
  revalidatePath(`/pozadavky/${requestId}`)
  revalidatePath('/ke-schvaleni')
}

export async function declineRequest(requestId: string, comment: string): Promise<void> {
  const user = await currentUser()
  if (user.role !== 'hrbp') return

  const now = new Date().toISOString()

  await getStore().mutate(s => {
    const req = s.requests.find(r => r.id === requestId)
    if (!req || !req.approval || req.approval.decision !== 'pending') return
    req.approval.decision      = 'declined'
    req.approval.decidedAt     = now
    req.approval.decidedByName = user.name
    req.approval.comment       = comment
    req.status = 'declined'
    req.events.push({
      id:      nanoid(),
      at:      now,
      type:    'local.declined',
      actor:   user.id,
      summary: copy.timeline.summaries['local.declined'],
    })
    req.updatedAt = now
  })

  after(async () => {
    const { requests } = await getStore().read()
    const req = requests.find(r => r.id === requestId)
    if (req) await notifyDecision(req, { id: user.id, name: user.name })
  })

  revalidatePath('/pozadavky')
  revalidatePath(`/pozadavky/${requestId}`)
  revalidatePath('/ke-schvaleni')
}
