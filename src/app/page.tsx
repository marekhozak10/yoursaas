import Link from 'next/link'
import { getStore } from '@/lib/store'
import { currentUser } from '@/lib/person'
import { StatusPill } from '@/components/ui-kit/StatusPill'
import { Avatar } from '@/components/ui-kit/Avatar'
import { formatRelativeNow } from '@/lib/date'

const SECTIONS = [
  { href: '/zamestnanci',  label: 'Zaměstnanci',    desc: 'Adresář, profily, pracovní poměry' },
  { href: '/organizace',   label: 'Organizace',      desc: 'Struktura oddělení a lokality' },
  { href: '/pozadavky',    label: 'Nábor',           desc: 'Požadavky na pozice a schvalování' },
  { href: '/vykon',        label: 'Výkon',           desc: 'Hodnoticí cykly a hodnocení' },
  { href: '/odmenovani',   label: 'Odměňování',      desc: 'Mzdová pásma a kompenzace' },
  { href: '/vzdelavani',   label: 'Vzdělávání',      desc: 'Programy a compliance školení' },
  { href: '/reporting',    label: 'Reporting',       desc: 'HR metriky a přehledy' },
]

export default async function DashboardPage() {
  const user = await currentUser()
  const { requests, users, teams } = await getStore().read()

  const pending  = requests.filter(r => r.approval?.decision === 'pending' && r.status === 'awaiting_approval').length
  const approved = requests.filter(r => r.status === 'approved' || r.status === 'open').length
  const declined = requests.filter(r => r.status === 'declined' || r.status === 'failed').length

  const recent = [...requests]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  const today = new Date().toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main className="max-w-6xl mx-auto px-6 py-8 w-full">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">{today}</p>
          <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink">
            Dobrý den, {user.name.split(' ')[0]}
          </h1>
          <p className="text-[12.5px] text-muted mt-1">Alpina Hotels Group · přehled</p>
        </div>
        <Avatar initials={user.initials} />
      </div>

      {/* ── KPI strip ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Zaměstnanci</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">923</div>
          <div className="text-[11px] text-muted mt-0.5">ve 4 lokalitách</div>
        </div>
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Požadavky na nábor</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">{requests.length}</div>
          <div className="text-[11px] text-muted mt-0.5">{approved} schváleno · {declined} zamítnuto</div>
        </div>
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Ke schválení</div>
          <div className={`text-[22px] font-bold tracking-[-0.02em] ${pending > 0 ? 'text-wait' : 'text-ink'}`}>
            {pending}
          </div>
          <div className="text-[11px] text-muted mt-0.5">čeká na rozhodnutí</div>
        </div>
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Fluktuace TTM</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ok">11,4 %</div>
          <div className="text-[11px] text-muted mt-0.5">cíl &lt; 12 %</div>
        </div>
      </div>

      {/* ── Two-column ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_320px] gap-6 mb-8">

        {/* Recent requests */}
        <div className="bg-surface rounded-panel border border-line shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
            <h2 className="text-[13px] font-bold tracking-[-0.02em] text-ink">Poslední požadavky na nábor</h2>
            <Link href="/pozadavky" className="text-[11.5px] text-brand-ink font-medium hover:underline">
              Zobrazit vše
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="px-5 py-8 text-[12px] text-muted text-center">Zatím žádné požadavky.</div>
          ) : (
            <div>
              {recent.map((req, i) => {
                const requester = users.find(u => u.id === req.requesterId)
                const team = teams.find(t => t.id === req.teamId)
                return (
                  <Link
                    key={req.id}
                    href={`/pozadavky/${req.id}`}
                    className={`flex items-center gap-3 px-5 py-3 hover:bg-well transition-colors ${i < recent.length - 1 ? 'border-b border-hairline' : ''}`}
                  >
                    {requester && <Avatar initials={requester.initials} />}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-ink truncate">{req.title}</p>
                      <p className="text-[11px] text-muted">{team?.name ?? '—'} · {formatRelativeNow(req.updatedAt)}</p>
                    </div>
                    <StatusPill status={req.status} />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Pending approval alert */}
          {pending > 0 && (
            <Link href="/ke-schvaleni" className="block bg-wait-soft border border-wait-line rounded-panel p-4 hover:bg-wait-soft/80 transition-colors">
              <div className="text-[12.5px] font-bold text-wait mb-1">
                {pending === 1 ? '1 požadavek čeká na schválení' : `${pending} požadavky čekají na schválení`}
              </div>
              <div className="text-[11.5px] text-wait">Přejít ke schválení →</div>
            </Link>
          )}

          {/* Quick stats */}
          <div className="bg-surface rounded-panel border border-line shadow-card p-5">
            <h3 className="text-[12.5px] font-bold text-ink mb-3">Stav náboru</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Odesláno',  count: requests.filter(r => ['submitted','processing','awaiting_approval'].includes(r.status)).length, color: 'bg-muted' },
                { label: 'Schváleno', count: approved, color: 'bg-ok' },
                { label: 'Zamítnuto', count: declined, color: 'bg-danger' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${row.color}`} />
                  <span className="text-[12px] text-ink-soft flex-1">{row.label}</span>
                  <span className="text-[12px] font-bold text-ink">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOZP compliance */}
          <div className="bg-agent-soft border border-agent-line rounded-panel p-4">
            <div className="text-[12px] font-bold text-agent mb-2">Povinné školení BOZP 2026</div>
            <div className="h-1.5 bg-well rounded-full overflow-hidden mb-1.5">
              <div className="h-full bg-agent rounded-full" style={{ width: '77%' }} />
            </div>
            <div className="text-[11px] text-agent">189/923 dokončeno · termín 31. 10. 2026</div>
          </div>

        </div>
      </div>

      {/* ── Sections grid ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-[13px] font-bold tracking-[-0.02em] text-ink mb-3">Rychlý přístup</h2>
        <div className="grid grid-cols-4 gap-3">
          {SECTIONS.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-surface rounded-panel border border-line shadow-card p-4 hover:bg-well hover:border-brand-line transition-colors group"
            >
              <div className="text-[12.5px] font-bold text-ink group-hover:text-brand-ink mb-1">{s.label}</div>
              <div className="text-[11px] text-muted leading-[1.5]">{s.desc}</div>
            </Link>
          ))}
        </div>
      </div>

    </main>
  )
}
