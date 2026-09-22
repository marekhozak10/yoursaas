"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"
import { copy } from "@/lib/copy"
import { Avatar } from "@/components/ui-kit/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { switchPerson } from "@/app/actions/person"

/** Peoplebase mark: teal rounded square with tent/mountain glyph. */
function Mark() {
  return (
    <span
      className="inline-flex items-center justify-center shrink-0 rounded-chip"
      style={{ width: 24, height: 24, background: "#12655f" }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 16V8l7 4 7-4v8" />
      </svg>
    </span>
  )
}

interface NavLinkProps {
  href: string
  active: boolean
  children: React.ReactNode
  badge?: number
}

function NavLink({ href, active, children, badge }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-1.5 text-[12px] font-medium px-1 py-0.5 transition-colors",
        active ? "text-ink font-semibold" : "text-muted hover:text-ink-soft"
      )}
    >
      {children}
      {badge != null && badge > 0 && (
        <span
          className="inline-flex items-center justify-center rounded-full bg-agent text-surface font-bold leading-none"
          style={{ fontSize: "9px", minWidth: 16, height: 16, padding: "0 4px" }}
        >
          {badge}
        </span>
      )}
    </Link>
  )
}

interface TopBarProps {
  /** Count of pending approvals for the current user. Pass 0 to hide badge. */
  pendingApprovals?: number
  /** Current user shown in the switcher avatar. */
  currentUser?: { name: string; initials: string }
  /** When true, shows the amber "nanečisto" scripted-mode badge. */
  scripted?: boolean
}

export function TopBar({ pendingApprovals = 0, currentUser, scripted }: TopBarProps) {
  const pathname = usePathname()
  const isRequests  = pathname.startsWith("/pozadavky")
  const isApprovals = pathname.startsWith("/ke-schvaleni")

  const user = currentUser ?? { name: "Matouš Vrba", initials: "MV" }

  return (
    <header
      className="flex items-center gap-3 border-b border-line bg-surface px-5"
      style={{ height: 56 }}
    >
      {/* ── Brand ─────────────────────────────────────────────── */}
      <Link href="/" className="flex items-center gap-2.5 shrink-0">
        <Mark />
        <span className="text-[13.5px] font-bold tracking-[-0.02em] text-ink">
          {copy.shell.appName}
        </span>
      </Link>

      {/* ── Divider ───────────────────────────────────────────── */}
      <span className="h-4 w-px bg-hairline shrink-0" />

      {/* ── Section nav ───────────────────────────────────────── */}
      <nav className="flex items-center gap-4">
        <NavLink href="/zamestnanci" active={pathname.startsWith("/zamestnanci")}>
          {copy.shell.sections.zamestnanci}
        </NavLink>
        <NavLink href="/organizace" active={pathname.startsWith("/organizace")}>
          {copy.shell.sections.organizace}
        </NavLink>
        <NavLink href="/pozadavky" active={isRequests || isApprovals}>
          {copy.shell.sections.nabor}
        </NavLink>
        <NavLink href="/vykon" active={pathname.startsWith("/vykon")}>
          {copy.shell.sections.vykon}
        </NavLink>
        <NavLink href="/odmenovani" active={pathname.startsWith("/odmenovani")}>
          {copy.shell.sections.odmenovani}
        </NavLink>
        <NavLink href="/vzdelavani" active={pathname.startsWith("/vzdelavani")}>
          {copy.shell.sections.vzdelavani}
        </NavLink>
        <NavLink href="/reporting" active={pathname.startsWith("/reporting")}>
          {copy.shell.sections.reporting}
        </NavLink>
      </nav>

      {/* ── Nábor sub-nav (Požadavky + Ke schválení) ──────────── */}
      {(isRequests || isApprovals) && (
        <>
          <span className="h-4 w-px bg-hairline shrink-0" />
          <nav className="flex items-center gap-3">
            <NavLink href="/pozadavky" active={isRequests}>
              {copy.shell.sections.pozadavky}
            </NavLink>
            <NavLink href="/ke-schvaleni" active={isApprovals} badge={pendingApprovals}>
              {copy.shell.sections.keSchvaleni}
            </NavLink>
          </nav>
        </>
      )}

      {/* ── Spacer ────────────────────────────────────────────── */}
      <span className="flex-1" />

      {/* ── Scripted-mode badge ───────────────────────────────── */}
      {scripted && (
        <span className="text-[10px] font-semibold text-wait bg-wait-soft border border-wait-line rounded-chip px-1.5 py-0.5 leading-none">
          {copy.shell.scriptedBadge}
        </span>
      )}

      {/* ── Tenant name ───────────────────────────────────────── */}
      <span className="text-[11.5px] text-muted hidden sm:block">
        {copy.shell.tenant}
      </span>

      {/* ── Person switcher ───────────────────────────────────── */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full"
          aria-label="Přepnout uživatele"
        >
          <Avatar initials={user.initials} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <p className="text-[10.5px] text-faint font-semibold uppercase tracking-[.06em] px-2 pb-1">
            {copy.shell.switcherHeading}
          </p>
          <form action={switchPerson.bind(null, "u_jana")} className="w-full">
            <button
              type="submit"
              className="flex w-full items-center gap-2 text-[12.5px] rounded-sm px-2 py-1.5 hover:bg-well cursor-pointer transition-colors"
            >
              <Avatar initials="MV" />
              <span>Matouš Vrba</span>
            </button>
          </form>
          <form action={switchPerson.bind(null, "u_petra")} className="w-full">
            <button
              type="submit"
              className="flex w-full items-center gap-2 text-[12.5px] rounded-sm px-2 py-1.5 hover:bg-well cursor-pointer transition-colors"
            >
              <Avatar initials="PM" />
              <span>Petra Málková</span>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
