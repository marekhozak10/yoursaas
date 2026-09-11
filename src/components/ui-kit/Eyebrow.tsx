import { cn } from "cn"

interface EyebrowProps {
  children: React.ReactNode
  /** "agent" renders in terracotta for AI-produced content labels. */
  variant?: "default" | "agent"
  className?: string
}

/** 9 px / 700 / uppercase / .1 em tracking. Sits above titles and section labels. */
export function Eyebrow({ children, variant = "default", className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-[9px] font-bold uppercase tracking-[.1em] leading-none",
        variant === "default" && "text-faint",
        variant === "agent"   && "text-agent",
        className
      )}
    >
      {children}
    </p>
  )
}
