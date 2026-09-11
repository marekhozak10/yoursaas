import { cn } from "cn"

interface StatProps {
  label: string
  value: string
  caption?: string
  /**
   * "lg"  – 22 px / 700 number, for standalone stat tiles.
   * "sm"  – 12.5 px / 600, for compact grids (approval card, context block).
   */
  size?: "lg" | "sm"
  className?: string
}

/** Stat tile: eyebrow label, value, optional caption. */
export function Stat({ label, value, caption, size = "sm", className }: StatProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {/* Label – eyebrow style */}
      <span
        className="text-[8.5px] font-bold uppercase tracking-[.09em] text-faint leading-none"
      >
        {label}
      </span>

      {/* Value */}
      {size === "lg" ? (
        <span
          className="mt-1.5 font-bold tracking-[-0.02em] text-ink leading-none"
          style={{ fontSize: "22px" }}
        >
          {value}
        </span>
      ) : (
        <span
          className="mt-1 font-semibold text-ink leading-none"
          style={{ fontSize: "12.5px" }}
        >
          {value}
        </span>
      )}

      {/* Caption */}
      {caption && (
        <span
          className={cn(
            "mt-0.5 text-muted leading-none",
            size === "lg" ? "text-[11px]" : "text-[10.5px]"
          )}
        >
          {caption}
        </span>
      )}
    </div>
  )
}
