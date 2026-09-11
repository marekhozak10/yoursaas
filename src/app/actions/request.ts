'use server'

import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { nanoid } from 'nanoid'
import { getStore } from '@/lib/store'
import { currentUser } from '@/lib/person'
import { RoleRequestFormInputSchema } from '@/lib/schemas'
import { copy } from '@/lib/copy'
import { triggerFlow } from '@/lib/appmixer'
import type { RoleRequest } from '@/lib/types'

export type FormState = {
  errors?: Partial<Record<string, string>>
}

function fieldError(field: string, code: string): string {
  if (field === 'justification' && code === 'too_small') {
    return copy.form.validation.tooShort
  }
  return copy.form.validation.required
}

export async function createRequest(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    teamId:          formData.get('teamId')          as string,
    title:           formData.get('title')           as string,
    seniority:       formData.get('seniority')       as string,
    targetStartDate: formData.get('targetStartDate') as string,
    location:        formData.get('location')        as string,
    justification:   formData.get('justification')   as string,
  }

  const parsed = RoleRequestFormInputSchema.safeParse(raw)

  if (!parsed.success) {
    const errors: Partial<Record<string, string>> = {}
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0])
      if (!errors[field]) errors[field] = fieldError(field, issue.code)
    }
    return { errors }
  }

  // Date must be today or in the future
  const targetDate = new Date(parsed.data.targetStartDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (targetDate < today) {
    return { errors: { targetStartDate: copy.form.validation.dateInPast } }
  }

  const user = await currentUser()
  const now  = new Date().toISOString()
  const requestId = nanoid()
  const store = getStore()

  const request: RoleRequest = {
    id:              requestId,
    publicId:        '',  // assigned inside mutate
    requesterId:     user.id,
    teamId:          parsed.data.teamId,
    title:           parsed.data.title,
    seniority:       parsed.data.seniority,
    location:        parsed.data.location,
    targetStartDate: parsed.data.targetStartDate,
    justification:   parsed.data.justification,
    status:          'submitted',
    createdAt:       now,
    updatedAt:       now,
    draft:           null,
    approval:        null,
    systems: [
      { key: 'ats',       status: 'pending' },
      { key: 'job_board', status: 'pending' },
      { key: 'slack',     status: 'pending' },
      { key: 'drive',     status: 'pending' },
    ],
    events: [{
      id:      nanoid(),
      at:      now,
      type:    'local.submitted',
      actor:   user.id,
      summary: copy.timeline.summaries['local.submitted'],
    }],
    callbackToken: nanoid(32),
  }

  await store.mutate(s => {
    const maxNum = s.requests.reduce((max, r) => {
      const m = r.publicId.match(/POZ-\d{4}-(\d+)/)
      return m ? Math.max(max, parseInt(m[1], 10)) : max
    }, 0)
    request.publicId = `POZ-${new Date().getFullYear()}-${String(maxNum + 1).padStart(3, '0')}`
    s.requests.push(request)
  })

  after(() => triggerFlow(request))
  redirect(`/pozadavky/${requestId}`)
}
