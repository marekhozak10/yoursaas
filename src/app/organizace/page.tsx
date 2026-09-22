export default function OrganizacePage() {
  const departments = [
    { name: "HR", vedouci: "Lucie Horáková", count: 12, open: 1 },
    { name: "Finance", vedouci: "Pavel Šimánek", count: 18, open: 0 },
    { name: "Sales & Marketing", vedouci: "Jana Procházková", count: 24, open: 2 },
    { name: "IT", vedouci: "Martin Novák", count: 9, open: 0 },
    { name: "Recepce & Front Office", vedouci: "Kateřina Blahová", count: 56, open: 1 },
    { name: "F&B", vedouci: "Ondřej Červenka", count: 72, open: 1 },
    { name: "Housekeeping", vedouci: "Markéta Švehlová", count: 56, open: 0 },
  ]

  const locations = [
    { city: "Praha", count: 142 },
    { city: "Vídeň", count: 58 },
    { city: "Bratislava", count: 31 },
    { city: "Brno", count: 16 },
  ]

  const openLabel = (n: number) => {
    if (n === 0) return null
    if (n === 1) return "1 otevřená"
    return `${n} otevřené`
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 w-full">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink">Organizace</h1>
        <p className="text-[12.5px] text-muted mt-1">Alpina Hotels Group — 247 zaměstnanců ve 4 lokalitách</p>
      </div>

      {/* CEO card */}
      <div className="flex justify-center mb-8">
        <div className="bg-surface rounded-panel border border-line shadow-card p-5 text-center min-w-[220px]">
          <div className="flex justify-center mb-3">
            <span style={{ background: "#e8e4dc", borderRadius: "50%", width: "40px", height: "40px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#6c665c" }}>
              TK
            </span>
          </div>
          <div className="text-[13px] font-bold text-ink">Tomáš Kratochvíl</div>
          <div className="text-[11px] text-muted mt-0.5">Generální ředitel</div>
          <div className="mt-2">
            <span className="bg-brand text-surface text-[9px] font-bold uppercase tracking-[.09em] rounded-[4px] px-1.5 py-0.5">CEO</span>
          </div>
        </div>
      </div>

      {/* Connector line */}
      <div className="flex justify-center mb-8">
        <div className="w-px h-6 bg-line" />
      </div>

      {/* Department cards grid */}
      <div className="mb-10">
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-4">Oddělení</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {departments.slice(0, 4).map((dept) => {
            const label = openLabel(dept.open)
            return (
              <div key={dept.name} className="bg-surface rounded-panel border border-line shadow-card p-5">
                <div className="text-[13px] font-bold text-ink mb-1">{dept.name}</div>
                <div className="text-[11px] text-muted mb-3">Vedoucí: {dept.vedouci}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[22px] font-bold tracking-[-0.02em] text-ink">{dept.count}</span>
                  <span className="text-[11px] text-muted">zaměstnanců</span>
                </div>
                {label && (
                  <div className="mt-2">
                    <span className="bg-wait-soft text-wait border border-wait-line text-[9px] font-bold uppercase tracking-[.09em] rounded-[4px] px-1.5 py-0.5">
                      {label}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {departments.slice(4).map((dept) => {
            const label = openLabel(dept.open)
            return (
              <div key={dept.name} className="bg-surface rounded-panel border border-line shadow-card p-5">
                <div className="text-[13px] font-bold text-ink mb-1">{dept.name}</div>
                <div className="text-[11px] text-muted mb-3">Vedoucí: {dept.vedouci}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[22px] font-bold tracking-[-0.02em] text-ink">{dept.count}</span>
                  <span className="text-[11px] text-muted">zaměstnanců</span>
                </div>
                {label && (
                  <div className="mt-2">
                    <span className="bg-wait-soft text-wait border border-wait-line text-[9px] font-bold uppercase tracking-[.09em] rounded-[4px] px-1.5 py-0.5">
                      {label}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Locations */}
      <div>
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-4">Lokality</h2>
        <div className="grid grid-cols-4 gap-4">
          {locations.map((loc) => (
            <div key={loc.city} className="bg-surface rounded-panel border border-line shadow-card p-5">
              <div className="text-[13px] font-bold text-ink mb-1">{loc.city}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-bold tracking-[-0.02em] text-ink">{loc.count}</span>
                <span className="text-[11px] text-muted">zaměstnanců</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
