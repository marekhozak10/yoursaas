import { cn } from "cn"
import { copy, type StatusKey } from "@/lib/copy"

const pillVariants: Record<StatusKey, string> = {
  submitted:         "text-muted bg-well border-hairline",
  processing:        "text-wait bg-wait-soft border-wait-line",
  awaiting_approval: "text-agent bg-agent-soft border-agent-line",
  approved:          "text-ok bg-ok-soft border-ok-line",
  open:              "text-ok bg-ok-soft border-ok-line",
  declined:          "text-danger bg-danger-soft border-danger-line",
  failed:            "text-danger bg-danger-soft border-danger-line",
}

interface StatusPillProps {
  status: StatusKey
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border px-1.5 py-0.5",
        "text-[9px] font-bold uppercase tracking-[.09em] leading-none",
        pillVariants[status],
        className
      )}
    >
      {copy.statusLabels[status]}
    </span>
  )
}
