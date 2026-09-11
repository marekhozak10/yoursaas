'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from 'cn'
import { copy } from '@/lib/copy'
import { isTerminal } from '@/lib/types'
import {
  formatPragueDate,
  formatPragueDateTime,
  formatPragueTime,
} from '@/lib/date'
import { formatAnnualCost } from '@/lib/format'
import { StatusPill } from '@/components/ui-kit/StatusPill'
import { Card } from '@/components/ui-kit/Card'
import { SectionHeading } from '@/components/ui-kit/SectionHeading'
import { Eyebrow } from '@/components/ui-kit/Eyebrow'
import { Stat } from '@/components/ui-kit/Stat'
import { ApprovalCard } from '@/components/ApprovalCard'
import type { RoleRequest, User, Team, SystemKey } from '@/lib/types'

interface Props {
  initialRequest: RoleRequest
  user:  User
  users: User[]
  teams: Team[]
}

export function DetailLive({ initialRequest, user, users, teams }: Props) {
  const [request, setRequest] = useState<RoleRequest>(initialRequest)

  // Track how many events existed at mount — new ones get the fade animation
  const initialEventCount = useRef(initialRequest.events.length)

  // Ref to the scrollable timeline body for auto-scroll
  const timelineBodyRef = useRef<HTMLDivElement>(null)

  const live = !isTerminal(request.status)

  /* ── Polling ────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!live) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pozadavky/${initialRequest.id}`)
        if (!res.ok) return
        const data = await res.json() as RoleRequest
        setRequest(data)
        if (isTerminal(data.status)) clearInterval(interval)
      } catch { /* network hiccup — retry next tick */ }
    }, 1500)
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Auto-scroll timeline ───────────────────────────────────────────────── */
  useEffect(() => {
    const el = timelineBodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [request.events.length])

  /* ── Derived data ───────────────────────────────────────────────────────── */
  const team       = teams.find(t => t.id === request.teamId)
  const requester  = users.find(u => u.id === request.requesterId)
  const hasSystems = request.systems.some(s => s.status !== 'pending')

  const isPetraPending =
    request.approval?.decision === 'pending' && user.id === 'u_petra'

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 w-full">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[12px] text-faint mb-1">{request.publicId}</p>
            <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink">
              {request.title}
            </h1>
            <p className="text-[12.5px] text-muted mt-1">
              {team?.name} · {request.location}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <StatusPill status={request.status} />
          </div>
        </div>

        {request.status === 'open' && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {request.systems.map(sys => (
              <span
                key={sys.key}
                className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-ok bg-ok-soft border border-ok-line rounded-chip px-2 py-0.5"
              >
                {copy.systems.titles[sys.key as SystemKey]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Two-column grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-[2fr_1fr] gap-8 items-start">

        {/* Left: content blocks */}
        <div className="space-y-6">

          {/* 1. Požadavek — always */}
          <section>
            <SectionHeading className="mb-4">{copy.detail.sectionHeadings.request}</SectionHeading>
            <Card>
              <dl className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-3">
                <dt className="text-[11px] font-semibold text-ink-soft">{copy.detail.requestFields.team}</dt>
                <dd className="text-[12.5px] text-ink">{team?.name ?? '—'}</dd>

                <dt className="text-[11px] font-semibold text-ink-soft">{copy.detail.requestFields.seniority}</dt>
                <dd className="text-[12.5px] text-ink">
                  {request.seniority.charAt(0).toUpperCase() + request.seniority.slice(1)}
                </dd>

                <dt className="text-[11px] font-semibold text-ink-soft">{copy.detail.requestFields.startDate}</dt>
                <dd className="text-[12.5px] text-ink">{formatPragueDate(request.targetStartDate)}</dd>

                <dt className="text-[11px] font-semibold text-ink-soft">{copy.detail.requestFields.location}</dt>
                <dd className="text-[12.5px] text-ink">{request.location}</dd>

                <dt className="text-[11px] font-semibold text-ink-soft">{copy.detail.requestFields.justification}</dt>
                <dd className="text-[12.5px] text-ink leading-relaxed">{request.justification}</dd>
              </dl>
            </Card>
          </section>

          {/* 2. Kontext — when context exists */}
          {request.context && (
            <section>
              <SectionHeading className="mb-4">{copy.detail.sectionHeadings.context}</SectionHeading>
              <div
                className="rounded-card overflow-hidden"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 1, background: '#eceae4' }}
              >
                <div className="bg-surface p-4">
                  <Stat label={copy.detail.contextTiles.salaryBand} value={request.context.band ?? '—'} size="sm" />
                </div>
                <div className="bg-surface p-4">
                  <Stat
                    label={copy.detail.contextTiles.timeToFill}
                    value={request.context.medianTimeToFillDays != null ? `${request.context.medianTimeToFillDays} dní` : '—'}
                    caption={copy.detail.contextCaptions.medianCaption}
                    size="sm"
                  />
                </div>
                <div className="bg-surface p-4">
                  <Stat
                    label={copy.detail.contextTiles.lastAd}
                    value={request.context.lastAdWrittenAt ? formatPragueDate(request.context.lastAdWrittenAt) : '—'}
                    size="sm"
                  />
                </div>
              </div>
            </section>
          )}

          {/* 3. Návrh — when draft exists */}
          {request.draft != null && (
            <section>
              <SectionHeading className="mb-4">{copy.detail.sectionHeadings.draft}</SectionHeading>
              <Card variant="agent">
                <div className="flex items-center gap-2 mb-3">
                  <Eyebrow variant="agent">{copy.detail.draftEyebrow}</Eyebrow>
                </div>
                <div className="relative mb-2">
                  <div className="overflow-hidden text-[12.5px] leading-relaxed text-ink-soft" style={{ maxHeight: 180 }}>
                    {request.draft.jobAd}
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, var(--color-agent-tint, #fbf3f0))' }}
                  />
                </div>
                <a href="#" className="text-brand text-[11px] font-semibold mt-2 inline-block">
                  {copy.detail.draftLink}
                </a>
                {request.draft.screeningCriteria.length > 0 && (
                  <div className="mt-4">
                    <Eyebrow className="mb-2">{copy.detail.criteriaHeading}</Eyebrow>
                    <div className="flex flex-wrap gap-1.5">
                      {request.draft.screeningCriteria.map((c, i) => (
                        <span key={i} className="bg-well text-ink-soft text-[10.5px] rounded-full px-2.5 py-1">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-agent-line">
                  <Stat
                    label={copy.detail.costLabel}
                    value={formatAnnualCost(request.draft.annualCostMinor)}
                    caption={copy.detail.costCaption}
                    size="sm"
                  />
                  {!request.draft.inBand && request.draft.note && (
                    <p className="text-[11px] text-danger mt-1">{request.draft.note}</p>
                  )}
                </div>
              </Card>
            </section>
          )}

          {/* 4. Rozhodnutí — when approval is not null */}
          {request.approval !== null && (
            <section>
              <SectionHeading className="mb-4">{copy.detail.sectionHeadings.decision}</SectionHeading>

              {/* Petra with pending decision → full interactive approval card */}
              {isPetraPending && requester && (
                <div>
                  <p className="text-[12.5px] text-ink mb-4">
                    {copy.approvalCard.leadLine(requester.nameGenitive, requester.titleGenitive)}
                  </p>
                  <ApprovalCard request={request} requester={requester} />
                </div>
              )}

              {/* Anyone else with pending decision → waiting state */}
              {request.approval.decision === 'pending' && !isPetraPending && (
                <Card>
                  <p className="text-[12.5px] text-muted mb-4">{copy.detail.waitingState}</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-hairline">
                    <span className="size-2 rounded-full bg-wait flex-none" />
                    <span className="text-[11px] text-muted">{copy.approvalCard.waitingFooter}</span>
                  </div>
                </Card>
              )}

              {/* Decided — approved */}
              {request.approval.decision === 'approved' && request.approval.decidedAt && (
                <Card>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-ok flex-none" />
                    <span className="text-[12.5px] text-ink">
                      {copy.approvalCard.decidedApproved(formatPragueTime(request.approval.decidedAt))}
                    </span>
                  </div>
                </Card>
              )}

              {/* Decided — declined */}
              {request.approval.decision === 'declined' && request.approval.decidedAt && (
                <Card>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-danger flex-none" />
                    <span className="text-[12.5px] text-ink">
                      {copy.approvalCard.decidedDeclined(formatPragueTime(request.approval.decidedAt))}
                    </span>
                  </div>
                  {request.approval.comment && (
                    <p className="text-[12.5px] text-muted mt-2 ml-4">{request.approval.comment}</p>
                  )}
                </Card>
              )}
            </section>
          )}

          {/* 5. Systémy — when any system is created or failed */}
          {hasSystems && (
            <section>
              <SectionHeading className="mb-4">{copy.detail.sectionHeadings.systems}</SectionHeading>
              <div className="grid grid-cols-2 gap-3">
                {request.systems.map(sys => (
                  <div key={sys.key} className="bg-surface border border-line rounded-card p-4 shadow-card">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn('size-2 rounded-full flex-none',
                        sys.status === 'created' ? 'bg-ok' : sys.status === 'failed' ? 'bg-danger' : 'bg-wait'
                      )} />
                      <span className="text-[12.5px] font-semibold text-ink">
                        {copy.systems.titles[sys.key as SystemKey]}
                      </span>
                    </div>
                    {sys.ref && <p className="font-mono text-[11px] text-muted">{sys.ref}</p>}
                    <p className="text-[11px] text-muted mt-1">
                      {sys.status === 'created'
                        ? copy.systems.captions.created[sys.key as SystemKey]
                        : sys.status === 'failed'
                        ? copy.systems.captions.failed
                        : copy.systems.captions.pending}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: Timeline */}
        <div className="sticky top-6">
          <div className="bg-surface rounded-panel border border-line shadow-card">

            {/* Header */}
            <div className="flex items-center px-4 py-3 border-b border-hairline">
              {live ? (
                <span className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                  <span className="size-2 rounded-full bg-brand animate-pulse" />
                  {copy.detail.timelineHeader.live}
                </span>
              ) : (
                <span className="text-[12.5px] font-semibold text-ink">
                  {copy.detail.timelineHeader.done}
                </span>
              )}
            </div>

            {/* Events */}
            <div
              ref={timelineBodyRef}
              className="px-4 py-3 space-y-4 relative overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 14rem)' }}
            >
              {/* Vertical rule */}
              <div className="absolute left-[23px] top-3 bottom-3 w-px bg-line pointer-events-none" />

              {request.events.map((event, index) => {
                const isNew     = index >= initialEventCount.current
                const isAgent   = event.actor === 'agent'
                const isHuman   = event.actor.startsWith('u_')
                const dotColor  = isAgent ? 'bg-agent' : isHuman ? 'bg-brand' : 'bg-faint'
                const actorUser = isHuman ? users.find(u => u.id === event.actor) : null
                const actorName = actorUser
                  ? actorUser.name
                  : event.actor === 'agent'    ? 'Agent'
                  : event.actor === 'workflow' ? 'Workflow'
                  : 'Systém'

                return (
                  <div
                    key={event.id}
                    className={cn('flex gap-3 relative', isNew && 'animate-fade-rise')}
                  >
                    <span className={cn('size-[7px] rounded-full flex-none mt-[5px] z-10', dotColor)} />
                    <div>
                      <p className="text-[12.5px] font-semibold text-ink leading-tight">{event.summary}</p>
                      <p className="text-[11px] text-muted mt-0.5">
                        {actorName} · {formatPragueDateTime(event.at)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
