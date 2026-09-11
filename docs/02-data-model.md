# Data model

One JSON document behind `lib/store.ts`. Types in `lib/types.ts`, zod schemas derived
from them. Keys and values in English, only the labels are Czech.

```ts
type Role = 'manager' | 'hrbp'

type User = {
  id: string            // 'u_jana'
  name: string          // 'Jana Dvořáková'
  initials: string      // 'JD'
  title: string         // 'ředitelka provozu, střední Evropa'
  email: string
  role: Role
}

type Team = {
  id: string            // 't_revmgmt'
  name: string          // 'Revenue management, střední Evropa'
  costCenter: string
}

type Seniority = 'junior' | 'medior' | 'senior' | 'lead'

type SalaryBand = {
  teamId: string
  seniority: Seniority
  band: string          // 'Pásmo 4'
  currency: 'CZK'
  minMinor: number      // monthly, haléře
  maxMinor: number
}

type RequestStatus =
  | 'submitted'          // written locally, trigger not confirmed yet
  | 'processing'         // Appmixer picked it up
  | 'awaiting_approval'  // draft ready, Petra has to decide
  | 'approved'           // decided yes, systems not finished yet
  | 'open'               // terminal, everything provisioned
  | 'declined'           // terminal
  | 'failed'             // terminal

type SystemKey = 'ats' | 'job_board' | 'slack' | 'drive'

type SystemState = {
  key: SystemKey
  status: 'pending' | 'created' | 'failed'
  ref?: string
  url?: string
  updatedAt?: string
}

type Approval = {
  approverId: string            // always 'u_petra'
  decision: 'pending' | 'approved' | 'declined'
  decidedAt?: string
  comment?: string              // required when declined
}

type AiDraft = {
  jobAd: string                 // markdown, several paragraphs
  screeningCriteria: string[]   // exactly 5
  annualCostMinor: number
  currency: 'CZK'
  seniorityDetected: Seniority
  inBand: boolean
  band?: string
  note?: string                 // one line, only when inBand is false
}

type TimelineEvent = {
  id: string
  at: string                    // ISO UTC
  type: string                  // the callback event name, or 'local.*'
  actor: 'workflow' | 'agent' | 'system' | string  // a user id for human actions
  summary: string               // Czech, one line, bold in the UI
  detail?: string
}

type RoleRequest = {
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
  createdAt: string
  updatedAt: string
  context?: {
    band?: string
    medianTimeToFillDays?: number
    lastAdWrittenAt?: string
  }
  draft?: AiDraft
  approval: Approval | null     // one, not an array
  systems: SystemState[]        // always four, seeded as 'pending'
  events: TimelineEvent[]
  callbackToken: string
  flowRunId?: string
}

type Store = {
  users: User[]                 // two
  teams: Team[]
  bands: SalaryBand[]
  requests: RoleRequest[]
}
```

Note what is not here: no headcount plan, no budget owner, no second approver, no
`changes_requested` status. The flow was deliberately cut down to form, agent, one
human decision, fan out. Do not add any of it back.

## Status transitions

```
submitted ──flow.started──────────► processing
processing ──draft.ready──────────► awaiting_approval
awaiting_approval ──approve───────► approved
awaiting_approval ──decline───────► declined   (terminal)
approved ──flow.completed─────────► open       (terminal)
any ──flow.failed─────────────────► failed     (terminal)
```

Guard every transition. A callback for a request already in a terminal state is
appended to the timeline and otherwise ignored, never an error.

## Store driver

```ts
export interface StoreDriver {
  read(): Promise<Store>
  write(next: Store): Promise<void>
  mutate<T>(fn: (s: Store) => T): Promise<T>   // read, apply, write, returns fn's value
}
```

`mutate` serialises writes with an in-process promise queue. The file driver writes a
temp file and renames. Two drivers only, `file` and `redis`, same document shape.

## Seed

`data/seed.json`: two people, three teams, the bands, and five historical requests in
mixed terminal states so the list is not empty. The sixth is created live on stage.

`npm run reset` copies the seed over `data/store.json`, or writes it to the Redis key.
