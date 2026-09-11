import { cn } from "cn"

interface AvatarProps {
  initials: string
  className?: string
}

/** 26 px user-avatar circle with warm-off-white fill and brownish initials. */
export function Avatar({ initials, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "size-[26px] shrink-0",
        className
      )}
      style={{ background: "#e8e4dc" }}
    >
      <span
        className="font-bold leading-none select-none"
        style={{ fontSize: "9.5px", color: "#6c665c" }}
      >
        {initials}
      </span>
    </span>
  )
}
