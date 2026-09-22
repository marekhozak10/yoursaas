import { copy } from "@/lib/copy"

export function PlaceholderPage({ section }: { section: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6">
      <p className="text-[13px] font-semibold text-ink">{section}</p>
      <p className="text-[12px] text-muted max-w-xs">{copy.shell.placeholderBody}</p>
    </main>
  )
}
