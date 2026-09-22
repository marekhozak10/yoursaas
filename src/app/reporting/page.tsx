export default function ReportingPage() {
  const deptHeadcount = [
    { name: "F&B", count: 72 },
    { name: "Housekeeping", count: 56 },
    { name: "Recepce", count: 56 },
    { name: "Sales", count: 24 },
    { name: "Finance", count: 18 },
    { name: "HR", count: 12 },
    { name: "IT", count: 9 },
  ]
  const maxCount = 72

  const months = [
    { label: "Led", hires: 2 },
    { label: "Úno", hires: 1 },
    { label: "Bře", hires: 3 },
    { label: "Dub", hires: 4 },
    { label: "Kvě", hires: 2 },
    { label: "Čvn", hires: 1 },
    { label: "Čvc", hires: 3 },
    { label: "Srp", hires: 5 },
    { label: "Zář", hires: 2 },
  ]
  const maxHires = 5

  const fluktRows = [
    { dept: "F&B", odchody: 9, pct: "12,5 %", status: "nad" },
    { dept: "Housekeeping", odchody: 7, pct: "12,5 %", status: "nad" },
    { dept: "Recepce", odchody: 6, pct: "10,7 %", status: "ok" },
    { dept: "Sales", odchody: 3, pct: "12,5 %", status: "nad" },
    { dept: "Finance", odchody: 1, pct: "5,6 %", status: "ok" },
    { dept: "HR", odchody: 1, pct: "8,3 %", status: "ok" },
    { dept: "IT", odchody: 1, pct: "11,1 %", status: "ok" },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 w-full">
      {/* Page title + period */}
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink">Reporting</h1>
        <span className="text-[12.5px] text-muted">Leden 2026 – Září 2026 · YTD</span>
      </div>

      {/* Big stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Headcount</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">247</div>
          <div className="text-[11px] text-muted mt-0.5">+3 YTD</div>
        </div>
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Fluktuace</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ok">11,4 %</div>
          <div className="text-[11px] text-muted mt-0.5">cíl &lt; 12 %</div>
        </div>
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Průměrná doba obsazení</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">38 dní</div>
        </div>
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Náklady na nábor</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">84 000 Kč</div>
          <div className="text-[11px] text-muted mt-0.5">na pozici</div>
        </div>
      </div>

      {/* Headcount by dept - horizontal bars */}
      <div className="bg-surface rounded-panel border border-line shadow-card p-6 mb-6">
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-4">Headcount podle oddělení</h2>
        <div className="flex flex-col gap-y-2">
          {deptHeadcount.map((d) => {
            const widthPct = Math.round((d.count / maxCount) * 100)
            return (
              <div key={d.name} className="flex items-center gap-3">
                <div className="text-[12px] text-ink-soft" style={{ width: "180px", flexShrink: 0 }}>{d.name}</div>
                <div className="flex-1 h-5 bg-well rounded-chip overflow-hidden">
                  <div className="h-full bg-brand rounded-chip" style={{ width: `${widthPct}%` }} />
                </div>
                <div className="text-[12px] font-bold text-ink w-8 text-right">{d.count}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly hiring bar chart */}
      <div className="bg-surface rounded-panel border border-line shadow-card p-6 mb-6">
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-4">Měsíční nábor YTD 2026</h2>
        <div className="flex items-end gap-3" style={{ height: "100px" }}>
          {months.map((m) => {
            const barHeight = Math.round((m.hires / maxHires) * 60)
            return (
              <div key={m.label} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                <div className="text-[10px] text-muted font-semibold">{m.hires}</div>
                <div
                  className="bg-brand rounded-t-chip w-8"
                  style={{ height: `${barHeight}px` }}
                />
                <div className="text-[10px] text-muted">{m.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Fluktuace table */}
      <div>
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-3">Fluktuace podle oddělení</h2>
        <div className="bg-surface rounded-panel border border-line shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-well">
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Oddělení</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Odchody YTD</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Fluktuace</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">vs. target</th>
              </tr>
            </thead>
            <tbody>
              {fluktRows.map((r, i) => (
                <tr key={r.dept} className={`border-b border-hairline last:border-0 ${i % 2 === 1 ? "bg-canvas" : ""}`}>
                  <td className="px-4 py-3 text-[12.5px] font-bold text-ink">{r.dept}</td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-soft">{r.odchody}</td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-soft">{r.pct}</td>
                  <td className="px-4 py-3 text-[12.5px] font-semibold">
                    {r.status === "nad"
                      ? <span className="text-danger">↑ nad cílem</span>
                      : <span className="text-ok">✓ v pásmu</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
