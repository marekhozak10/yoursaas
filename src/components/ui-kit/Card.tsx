import { cn } from "cn"

interface CardProps {
  children: React.ReactNode
  className?: string
  /** Agent variant: terracotta 1.5 px border, agent-tint fill */
  variant?: "default" | "agent"
}

/** Standard content card. White, 1 px line border, panel radius, card shadow. */
export function Card({ children, className, variant = "default" }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-panel bg-surface p-5",
        variant === "default" && "border border-line shadow-card",
        variant === "agent" && "border-[1.5px] border-agent bg-agent-tint",
        className
      )}
    >
      {children}
    </div>
  )
}
