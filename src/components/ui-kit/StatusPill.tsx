import { cn } from "cn"
import { copy, type StatusKey } from "@/lib/copy"

// All internal statuses collapse to one of three display groups
type DisplayGroup = 'submitted' | 'approved' | 'declined'

function toDisplayGroup(status: StatusKey): DisplayGroup {
  if (status === 'approved' || status === 'open') return 'approved'
  if (status === 'declined' || status === 'failed') return 'declined'
  return 'submitted' // submitted, processing, awaiting_approval
}

const pillVariants: Record<DisplayGroup, string> = {
  submitted: "text-muted bg-well border-hairline",
  approved:  "text-ok bg-ok-soft border-ok-line",
  declined:  "text-danger bg-danger-soft border-danger-line",
}

interface StatusPillProps {
  status: StatusKey
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const group = toDisplayGroup(status)
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border px-1.5 py-0.5",
        "text-[9px] font-bold uppercase tracking-[.09em] leading-none",
        pillVariants[group],
        className
      )}
    >
      {copy.statusLabels[group]}
    </span>
  )
}
