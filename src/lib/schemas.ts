import { z } from "zod"

/* ── Primitives ─────────────────────────────────────────────────────────── */

const SenioritySchema = z.enum(['junior', 'medior', 'senior', 'lead'])
const RequestStatusSchema = z.enum([
  'submitted', 'processing', 'awaiting_approval',
  'approved', 'open', 'declined', 'failed',
])
const SystemKeySchema = z.enum(['ats', 'job_board', 'slack', 'drive'])

/* ── Store sub-objects ──────────────────────────────────────────────────── */

export const UserSchema = z.object({
  id:           z.string(),
  name:         z.string(),
  nameGenitive: z.string(),
  initials:     z.string(),
  title:        z.string(),
  email:        z.string().email(),
  role:         z.enum(['manager', 'hrbp']),
})

export const TeamSchema = z.object({
  id:         z.string(),
  name:       z.string(),
  costCenter: z.string(),
})

export const SalaryBandSchema = z.object({
  teamId:    z.string(),
  seniority: SenioritySchema,
  band:      z.string(),
  currency:  z.literal('CZK'),
  minMinor:  z.number().int(),
  maxMinor:  z.number().int(),
})

export const SystemStateSchema = z.object({
  key:       SystemKeySchema,
  status:    z.enum(['pending', 'created', 'failed']),
  ref:       z.string().optional(),
  url:       z.string().optional(),
  updatedAt: z.string().optional(),
})

export const ApprovalSchema = z.object({
  approverId: z.string(),
  decision:   z.enum(['pending', 'approved', 'declined']),
  decidedAt:  z.string().optional(),
  comment:    z.string().nullable().optional(),
})

export const AiDraftSchema = z.object({
  jobAd:              z.string(),
  screeningCriteria:  z.array(z.string()).min(5).max(5),
  annualCostMinor:    z.number().int().positive(),
  currency:           z.literal('CZK'),
  seniorityDetected:  SenioritySchema,
  inBand:             z.boolean(),
  band:               z.string().optional(),
  note:               z.string().optional(),
})

export const TimelineEventSchema = z.object({
  id:      z.string(),
  at:      z.string(),
  type:    z.string(),
  actor:   z.string(),
  summary: z.string(),
  detail:  z.string().optional(),
})

export const RoleRequestSchema = z.object({
  id:              z.string(),
  publicId:        z.string(),
  requesterId:     z.string(),
  teamId:          z.string(),
  title:           z.string(),
  seniority:       SenioritySchema,
  location:        z.string(),
  targetStartDate: z.string(),
  justification:   z.string(),
  status:          RequestStatusSchema,
  createdAt:       z.string(),
  updatedAt:       z.string(),
  context: z.object({
    band:                  z.string().optional(),
    medianTimeToFillDays:  z.number().int().optional(),
    lastAdWrittenAt:       z.string().optional(),
  }).optional(),
  draft:         AiDraftSchema.nullable().optional(),
  approval:      ApprovalSchema.nullable(),
  systems:       z.array(SystemStateSchema),
  events:        z.array(TimelineEventSchema),
  callbackToken: z.string(),
  flowRunId:     z.string().optional(),
  jobAdUrl:      z.string().optional(),
  linkedInUrl:   z.string().optional(),
})

export const StoreSchema = z.object({
  users:    z.array(UserSchema),
  teams:    z.array(TeamSchema),
  bands:    z.array(SalaryBandSchema),
  requests: z.array(RoleRequestSchema),
})

/* ── Form input (Step 4) ────────────────────────────────────────────────── */

export const RoleRequestFormInputSchema = z.object({
  teamId:          z.string().min(1),
  title:           z.string().min(1),
  seniority:       SenioritySchema.default('senior'),
  targetStartDate: z.string().min(1),
  location:        z.string().default(''),
  justification:   z.string().min(40),
})

export type RoleRequestFormInput = z.infer<typeof RoleRequestFormInputSchema>

/* ── Appmixer callback (Step 5) ─────────────────────────────────────────── */

export const AppmixerCallbackSchema = z.object({
  eventId:    z.string(),
  eventType:  z.string(),
  requestId:  z.string(),
  flowRunId:  z.string().optional(),
  occurredAt: z.string(),
  data:       z.record(z.string(), z.unknown()).optional(),
})

export type AppmixerCallback = z.infer<typeof AppmixerCallbackSchema>
