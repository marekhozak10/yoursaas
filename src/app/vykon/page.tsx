export default function VykonPage() {
  const deptRows = [
    { dept: "HR", vedouci: "Lucie Horáková", done: 10, total: 12, avg: "4,1", trend: "↑" as const },
    { dept: "Finance", vedouci: "Pavel Šimánek", done: 16, total: 18, avg: "3,9", trend: "→" as const },
    { dept: "Sales & Marketing", vedouci: "Jana Procházková", done: 17, total: 24, avg: "3,7", trend: "↑" as const },
    { dept: "IT", vedouci: "Martin Novák", done: 7, total: 9, avg: "4,4", trend: "↑" as const },
    { dept: "Recepce", vedouci: "Kateřina Blahová", done: 31, total: 56, avg: "3,6", trend: "↓" as const },
    { dept: "F&B", vedouci: "Ondřej Červenka", done: 38, total: 72, avg: "3,8", trend: "→" as const },
    { dept: "Housekeeping", vedouci: "Markéta Švehlová", done: 31, total: 56, avg: "3,5", trend: "↓" as const },
  ]

  const prevCycles = [
    { name: "Q2 2026", pct: "100 %", avg: "3,7", closed: "30. 6. 2026" },
    { name: "Q1 2026", pct: "100 %", avg: "3,6", closed: "31. 3. 2026" },
    { name: "Q4 2025", pct: "96 %", avg: "3,8", closed: "31. 12. 2025" },
  ]

  const trendClass = (t: "↑" | "→" | "↓") => {
    if (t === "↑") return "text-ok"
    if (t === "↓") return "text-danger"
    return "text-muted"
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 w-full">
      {/* Page title */}
      <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink mb-6">Výkon</h1>

      {/* Active cycle banner */}
      <div className="bg-wait-soft border border-wait-line rounded-panel p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-bold text-wait">Hodnoticí cyklus Q3 2026</span>
          <span className="text-[12.5px] text-wait">·</span>
          <span className="text-[12.5px] text-wait">probíhá</span>
          <span className="text-[12.5px] text-wait">·</span>
          <span className="text-[12.5px] text-wait">termín 30. 9. 2026</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Dokončeno</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">68 %</div>
        </div>
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Průměrné hodnocení</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">3,8 <span className="text-[14px] text-muted font-normal">/ 5</span></div>
        </div>
        <div className="bg-surface rounded-panel border border-line shadow-card p-5">
          <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">Zbývá dokončit</div>
          <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">31</div>
        </div>
      </div>

      {/* Department table */}
      <div className="mb-8">
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-3">Hodnocení podle oddělení</h2>
        <div className="bg-surface rounded-panel border border-line shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-well">
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Oddělení</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Vedoucí</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Dokončeno</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Průměr</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {deptRows.map((row, i) => {
                const pct = Math.round((row.done / row.total) * 100)
                return (
                  <tr key={row.dept} className={`border-b border-hairline ${i % 2 === 1 ? "bg-canvas" : ""}`}>
                    <td className="px-4 py-3 text-[12.5px] font-bold text-ink">{row.dept}</td>
                    <td className="px-4 py-3 text-[12.5px] text-ink-soft">{row.vedouci}</td>
                    <td className="px-4 py-3 text-[12.5px] text-ink-soft">
                      {row.done}/{row.total} <span className="text-muted">({pct} %)</span>
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-ink-soft">★ {row.avg}</td>
                    <td className={`px-4 py-3 text-[13px] font-bold ${trendClass(row.trend)}`}>{row.trend}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Previous cycles */}
      <div>
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-3">Předchozí cykly</h2>
        <div className="bg-surface rounded-panel border border-line shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-well">
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Cyklus</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Dokončeno</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Průměr</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Uzavřeno</th>
              </tr>
            </thead>
            <tbody>
              {prevCycles.map((c) => (
                <tr key={c.name} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3 text-[12.5px] font-bold text-muted">{c.name}</td>
                  <td className="px-4 py-3 text-[12.5px] text-muted">{c.pct}</td>
                  <td className="px-4 py-3 text-[12.5px] text-muted">★ {c.avg}</td>
                  <td className="px-4 py-3 text-[12.5px] text-muted">{c.closed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
