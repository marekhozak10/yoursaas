export default function VzdelavaniPage() {
  const programs = [
    {
      name: "Zákaznický servis v luxusní hotelnictví",
      enrolled: 48,
      pct: 85,
      mandatory: true,
      target: "Recepce, F&B",
    },
    {
      name: "Leadership development",
      enrolled: 24,
      pct: 62,
      mandatory: true,
      target: "Lead, Manager",
    },
    {
      name: "Pokročilý Excel a Power BI",
      enrolled: 18,
      pct: 71,
      mandatory: false,
      target: null,
    },
    {
      name: "Bezpečnost potravin (HACCP)",
      enrolled: 31,
      pct: 91,
      mandatory: true,
      target: "F&B",
    },
    {
      name: "Jazykový kurz němčina B2",
      enrolled: 12,
      pct: 58,
      mandatory: false,
      target: null,
    },
    {
      name: "Wellness a duševní zdraví",
      enrolled: 38,
      pct: 79,
      mandatory: false,
      target: null,
    },
    {
      name: "Revenue management základy",
      enrolled: 9,
      pct: 67,
      mandatory: false,
      target: null,
    },
    {
      name: "BOZP 2026",
      enrolled: 189,
      pct: 77,
      mandatory: true,
      target: "Všechny",
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 w-full">
      {/* Page title */}
      <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink mb-6">Vzdělávání</h1>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Aktivní programy", value: "8" },
          { label: "Zapsaných zaměstnanců", value: "134" },
          { label: "Průměrné dokončení", value: "74 %" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-panel border border-line shadow-card p-5">
            <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">{stat.label}</div>
            <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* BOZP compliance banner */}
      <div className="bg-agent-soft border border-agent-line rounded-panel p-4 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[12.5px] font-bold text-agent">Povinné školení BOZP 2026</span>
          <span className="text-[12.5px] text-agent">·</span>
          <span className="text-[12.5px] text-agent">termín 31. 10. 2026</span>
          <span className="text-[12.5px] text-agent">·</span>
          <span className="text-[12.5px] text-agent">dokončeno 189/923 (77 %)</span>
        </div>
        <div className="h-2 bg-well rounded-full overflow-hidden">
          <div className="h-full bg-agent rounded-full" style={{ width: "77%" }} />
        </div>
      </div>

      {/* Programs grid */}
      <div>
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-4">Aktivní programy</h2>
        <div className="grid grid-cols-2 gap-4">
          {programs.map((p) => (
            <div key={p.name} className="bg-surface rounded-card border border-line shadow-card p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="text-[12.5px] font-bold text-ink leading-snug">{p.name}</div>
                <span className={`shrink-0 text-[9px] font-bold uppercase tracking-[.09em] rounded-[4px] px-1.5 py-0.5 border ${p.mandatory ? "bg-agent-soft text-agent border-agent-line" : "bg-well text-muted border-line"}`}>
                  {p.mandatory ? "Povinné" : "Volitelné"}
                </span>
              </div>
              {p.target && (
                <div className="text-[11px] text-muted mb-1.5">
                  Povinné pro: <span className="text-ink-soft">{p.target}</span>
                </div>
              )}
              <div className="text-[11px] text-muted mb-2">{p.enrolled} zapsáno</div>
              <div className="h-1.5 bg-well rounded-full overflow-hidden mb-1">
                <div className="h-full bg-brand rounded-full" style={{ width: `${p.pct}%` }} />
              </div>
              <div className="text-[11px] text-muted">{p.pct} % dokončeno</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
