'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { copy } from '@/lib/copy'
import { formatAnnualCost } from '@/lib/format'
import { formatPragueDate } from '@/lib/date'
import { Eyebrow } from '@/components/ui-kit/Eyebrow'
import { Stat } from '@/components/ui-kit/Stat'
import { approveRequest, declineRequest } from '@/app/actions/approval'
import type { RoleRequest, User } from '@/lib/types'

interface Props {
  request: RoleRequest
  requester: User
}

export function ApprovalCard({ request, requester }: Props) {
  const router = useRouter()
  const [acting, setActing] = useState<'approve' | 'decline' | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState(false)

  const draft = request.draft
  const ctx   = request.context

  async function handleApprove() {
    setActing('approve')
    try {
      await approveRequest(request.id)
      router.refresh()
    } finally {
      setActing(null)
    }
  }

  function openDeclineDialog() {
    setComment('')
    setCommentError(false)
    setShowDialog(true)
  }

  async function handleDecline() {
    if (!comment.trim()) { setCommentError(true); return }
    setActing('decline')
    try {
      await declineRequest(request.id, comment.trim())
      setShowDialog(false)
      router.refresh()
    } finally {
      setActing(null)
    }
  }

  const seniority = request.seniority.charAt(0).toUpperCase() + request.seniority.slice(1)

  return (
    <>
      {/* ── Card ────────────────────────────────────────────────────────── */}
      <div className="border border-line rounded-card overflow-hidden bg-surface"
           style={{ borderLeft: '3px solid #9a5548' }}>

        {/* Header */}
        <div className="px-4 pt-[14px]">
          <div className="text-[15px] font-bold tracking-[-0.02em] text-ink">
            {request.title}
          </div>
          <div className="text-[11.5px] text-muted mt-[3px]">
            {request.location}. {seniority}. Nástup {formatPragueDate(request.targetStartDate)}.
          </div>
        </div>

        {/* Stats grid */}
        <div
          className="mt-[14px] border-t border-b border-hairline"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 1, background: '#eceae4' }}
        >
          <div className="bg-surface px-4 py-[11px]">
            <Stat
              label={copy.approvalCard.statLabels.salaryBand}
              value={ctx?.band ?? '—'}
              caption={ctx?.band ? copy.detail.contextCaptions.inBand : undefined}
              size="sm"
            />
          </div>
          <div className="bg-surface px-4 py-[11px]">
            <Stat
              label={copy.approvalCard.statLabels.annualCost}
              value={draft ? formatAnnualCost(draft.annualCostMinor) : '—'}
              caption={copy.detail.costCaption}
              size="sm"
            />
          </div>
          <div className="bg-surface px-4 py-[11px]">
            <Stat
              label={copy.approvalCard.statLabels.timeToFill}
              value={ctx?.medianTimeToFillDays != null ? `${ctx.medianTimeToFillDays} dní` : '—'}
              caption={copy.detail.contextCaptions.medianCaption}
              size="sm"
            />
          </div>
        </div>

        {/* Draft preview */}
        {draft && (
          <div className="px-4 pt-[14px]">
            <div className="flex items-center gap-[7px] mb-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9a5548"
                   strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>
              </svg>
              <Eyebrow variant="agent">{copy.detail.draftEyebrow}</Eyebrow>
            </div>
            <div className="relative">
              <div className="border border-hairline rounded-ctl bg-canvas px-[14px] py-[13px]
                              text-[11.5px] leading-[1.65] text-ink-soft overflow-hidden"
                   style={{ maxHeight: 150 }}>
                {draft.jobAd}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none rounded-b-ctl"
                   style={{ background: 'linear-gradient(to bottom, transparent, var(--color-canvas))' }} />
            </div>
            <div className="text-[11px] font-semibold text-brand mt-2">
              {copy.detail.draftLink}
            </div>
          </div>
        )}

        {/* Criteria */}
        {draft && draft.screeningCriteria.length > 0 && (
          <div className="px-4 pt-[14px]">
            <Eyebrow className="mb-2">{copy.detail.criteriaHeading}</Eyebrow>
            <div className="flex flex-wrap gap-[5px]">
              {draft.screeningCriteria.map((c, i) => (
                <span key={i}
                      className="text-[10.5px] text-ink-soft bg-well rounded-full px-[10px] py-1">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2 px-4 py-4">
          <button
            onClick={handleApprove}
            disabled={acting !== null}
            className="inline-flex items-center text-[12px] font-semibold text-surface bg-ok
                       rounded-ctl px-[18px] py-[9px] hover:opacity-90 transition-opacity
                       disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {copy.approvalCard.approveButton}
          </button>
          <button
            onClick={openDeclineDialog}
            disabled={acting !== null}
            className="inline-flex items-center text-[12px] font-semibold text-ink bg-surface
                       border border-input-border rounded-ctl px-4 py-[8px]
                       hover:bg-well transition-colors disabled:opacity-50 cursor-pointer
                       disabled:cursor-not-allowed"
          >
            {copy.approvalCard.declineButton}
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-hairline bg-canvas px-4 py-[11px] flex items-center gap-2">
          <span className="size-[6px] rounded-full bg-wait flex-none" />
          <span className="text-[11px] text-muted">{copy.approvalCard.waitingFooter}</span>
        </div>
      </div>

      {/* Lead line below card */}
      <p className="text-[11px] text-faint mt-3 leading-[1.6]">
        {copy.detail.waitingState}
      </p>

      {/* ── Decline dialog ──────────────────────────────────────────────── */}
      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => !acting && setShowDialog(false)}
        >
          <div
            className="bg-surface rounded-panel shadow-raised w-[380px] p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-1">
              {copy.approvalCard.declineDialog.title}
            </h2>
            <p className="text-[11.5px] text-muted mb-4">
              {copy.approvalCard.declineDialog.helper}
            </p>
            <textarea
              className="w-full border border-input-border rounded-lg px-3 py-[10px]
                         text-[12.5px] text-ink leading-[1.6] resize-none
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              rows={3}
              value={comment}
              onChange={e => { setComment(e.target.value); setCommentError(false) }}
              autoFocus
            />
            {commentError && (
              <p className="text-[11px] text-danger mt-1">
                {copy.form.validation.required}
              </p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleDecline}
                disabled={acting !== null}
                className="inline-flex items-center text-[12px] font-semibold text-surface
                           bg-danger rounded-ctl px-[18px] py-[9px] hover:opacity-90
                           transition-opacity disabled:opacity-50 cursor-pointer"
              >
                {copy.approvalCard.declineDialog.confirm}
              </button>
              <button
                onClick={() => setShowDialog(false)}
                disabled={acting !== null}
                className="text-[12px] text-muted hover:text-ink-soft transition-colors cursor-pointer"
              >
                {copy.approvalCard.declineDialog.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
