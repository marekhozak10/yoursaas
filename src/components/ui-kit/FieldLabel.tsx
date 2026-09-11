import { cn } from "cn"

interface FieldLabelProps {
  children: React.ReactNode
  htmlFor?: string
  /** Optional helper text rendered right-aligned beside the label. */
  helper?: string
  className?: string
}

/** 11 px / 600 field label. Sits above form inputs. */
export function FieldLabel({ children, htmlFor, helper, className }: FieldLabelProps) {
  return (
    <div className={cn("flex items-baseline justify-between", className)}>
      <label
        htmlFor={htmlFor}
        className="text-[11px] font-semibold text-ink-soft"
      >
        {children}
      </label>
      {helper && (
        <span className="text-[10px] text-faint">{helper}</span>
      )}
    </div>
  )
}
