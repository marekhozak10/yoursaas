import Link from "next/link"
import { cn } from "cn"
import { copy } from "@/lib/copy"
import { getStore } from "@/lib/store"
import { currentUser } from "@/lib/person"
import { formatRelativeNow } from "@/lib/date"
import { StatusPill } from "@/components/ui-kit/StatusPill"
import { Avatar } from "@/components/ui-kit/Avatar"
import type { RequestStatus } from "@/lib/types"

type FilterKey = "all" | "submitted" | "approved" | "declined"

const filterStatuses: Record<FilterKey, RequestStatus[]> = {
  all:       [],
  submitted: ["submitted", "processing", "awaiting_approval"],
  approved:  ["approved", "open"],
  declined:  ["declined", "failed"],
}

const filterLabels: Record<FilterKey, string> = {
  all:       copy.list.filters.all,
  submitted: copy.list.filters.submitted,
  approved:  copy.list.filters.approved,
  declined:  copy.list.filters.declined,
}

const filterOrder: FilterKey[] = ["all", "submitted", "approved", "declined"]

export default async function PozadavkyPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const activeFilter: FilterKey =
    filter && filter in filterStatuses ? (filter as FilterKey) : "all"

  const store = await getStore().read()
  await currentUser()

  const statuses = filterStatuses[activeFilter]
  const filtered =
    statuses.length === 0
      ? [...store.requests]
      : store.requests.filter((r) => statuses.includes(r.status))

  // Sort newest updatedAt first
  filtered.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink">
          {copy.list.title}
        </h1>
        <Link
          href="/pozadavky/novy"
          className="inline-flex items-center justify-center rounded-ctl bg-brand text-surface text-[12.5px] font-semibold px-4 py-2 hover:bg-brand-hover transition-colors"
        >
          {copy.list.newButton}
        </Link>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filterOrder.map((key) => {
          const isActive = key === activeFilter
          return (
            <Link
              key={key}
              href={key === "all" ? "/pozadavky" : `?filter=${key}`}
              className={cn(
                "inline-flex items-center rounded-chip px-3 py-1 text-[11.5px] font-medium transition-colors",
                isActive
                  ? "bg-brand text-surface"
                  : "bg-well text-muted border border-hairline hover:text-ink-soft"
              )}
            >
              {filterLabels[key]}
            </Link>
          )
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-[12.5px] text-muted">
          {copy.list.empty}
        </div>
      ) : (
        <div className="bg-surface rounded-panel border border-line shadow-card overflow-hidden">
          {/* Header row */}
          <div
            className="grid items-center px-4 py-2 border-b border-hairline"
            style={{ gridTemplateColumns: "140px 2fr 1fr 160px 1fr" }}
          >
            <span className="text-[11px] font-semibold text-faint">{copy.list.columns.number}</span>
            <span className="text-[11px] font-semibold text-faint">{copy.list.columns.position}</span>
            <span className="text-[11px] font-semibold text-faint">{copy.list.columns.requester}</span>
            <span className="text-[11px] font-semibold text-faint">{copy.list.columns.status}</span>
            <span className="text-[11px] font-semibold text-faint">{copy.list.columns.updated}</span>
          </div>

          {/* Data rows */}
          {filtered.map((request, index) => {
            const requester = store.users.find((u) => u.id === request.requesterId)
            const team = store.teams.find((t) => t.id === request.teamId)

            return (
              <Link
                key={request.id}
                href={`/pozadavky/${request.id}`}
                className={cn(
                  "grid items-center px-4 hover:bg-well cursor-pointer transition-colors",
                  index < filtered.length - 1 && "border-b border-hairline"
                )}
                style={{ gridTemplateColumns: "140px 2fr 1fr 160px 1fr", minHeight: 48 }}
              >
                {/* Číslo */}
                <span className="font-mono text-[12px] text-faint">
                  {request.publicId}
                </span>

                {/* Pozice */}
                <div className="py-3">
                  <p className="text-[12.5px] font-semibold text-ink leading-tight">
                    {request.title}
                  </p>
                  {team && (
                    <p className="text-[11px] text-muted mt-0.5">{team.name}</p>
                  )}
                </div>

                {/* Žadatel */}
                <div className="flex items-center gap-2">
                  {requester && <Avatar initials={requester.initials} />}
                  <span className="text-[12.5px] text-ink">
                    {requester?.name ?? request.requesterId}
                  </span>
                </div>

                {/* Stav */}
                <div>
                  <StatusPill status={request.status} />
                </div>

                {/* Aktualizováno */}
                <span className="text-[11px] text-muted">
                  {formatRelativeNow(request.updatedAt)}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
