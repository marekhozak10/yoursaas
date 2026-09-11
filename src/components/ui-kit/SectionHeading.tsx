import { cn } from "cn"

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
}

/** 15 px / 700 / –.02 em. Used for the named blocks in the detail layout. */
export function SectionHeading({ children, className }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        "text-[15px] font-bold tracking-[-0.02em] text-ink",
        className
      )}
    >
      {children}
    </h2>
  )
}
