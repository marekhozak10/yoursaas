export type Role = 'manager' | 'hrbp'

export type User = {
  id: string            // 'u_jana'
  name: string          // 'Jana Dvořáková'
  nameGenitive: string  // 'Jany Dvořákové' — used in approval lead line
  initials: string      // 'JD'
  title: string         // 'ředitelka provozu, střední Evropa'
  email: string
  role: Role
}

export type Team = {
  id: string            // 't_revmgmt'
  name: string          // 'Revenue management, střední Evropa'
  costCenter: string
}

export type Seniority = 'junior' | 'medior' | 'senior' | 'lead'

export type SalaryBand = {
  teamId: string
  seniority: Seniority
  band: string          // 'Pásmo 4'
  currency: 'CZK'
  minMinor: number      // monthly, haléře
  maxMinor: number
}

export type RequestStatus =
  | 'submitted'          // written locally, trigger not confirmed yet
  | 'processing'         // Appmixer picked it up
  | 'awaiting_approval'  // draft ready, Petra has to decide
  | 'approved'           // decided yes, systems not finished yet
  | 'open'               // terminal — everything provisioned
  | 'declined'           // terminal
  | 'failed'             // terminal

export const TERMINAL_STATUSES: readonly RequestStatus[] = ['open', 'declined', 'failed']

export function isTerminal(status: RequestStatus): boolean {
  return TERMINAL_STATUSES.includes(status)
}

export type SystemKey = 'ats' | 'job_board' | 'slack' | 'drive'

export type SystemState = {
  key: SystemKey
  status: 'pending' | 'created' | 'failed'
  ref?: string
  url?: string
  updatedAt?: string
}

export type Approval = {
  approverId: string            // always 'u_petra'
  decision: 'pending' | 'approved' | 'declined'
  decidedAt?: string
  comment?: string | null       // required when declined
}

export type AiDraft = {
  jobAd: string                 // markdown, several paragraphs
  screeningCriteria: string[]   // exactly 5
  annualCostMinor: number
  currency: 'CZK'
  seniorityDetected: Seniority
  inBand: boolean
  band?: string
  note?: string                 // one line, only when inBand is false
}

export type TimelineEvent = {
  id: string
  at: string                    // ISO UTC
  type: string                  // callback event name or 'local.*'
  actor: string                 // 'workflow' | 'agent' | 'system' | userId
  summary: string               // Czech, one line
  detail?: string
}

export type RoleRequest = {
  id: string
  publicId: string              // 'POZ-2026-014'
  requesterId: string
  teamId: string
  title: string
  seniority: Seniority
  location: string
  targetStartDate: string       // ISO date
  justification: string
  status: RequestStatus
  createdAt: string             // ISO UTC
  updatedAt: string             // ISO UTC
  context?: {
    band?: string
    medianTimeToFillDays?: number
    lastAdWrittenAt?: string
  }
  draft?: AiDraft | null
  approval: Approval | null     // one, not an array
  systems: SystemState[]        // always four, seeded as 'pending'
  events: TimelineEvent[]
  callbackToken: string
  flowRunId?: string
}

export type Store = {
  users: User[]
  teams: Team[]
  bands: SalaryBand[]
  requests: RoleRequest[]
}
