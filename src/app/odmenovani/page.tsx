export default function OdmenovaniPage() {
  const bands = [
    { level: "Junior", min: "32 000 Kč", mid: "42 000 Kč", max: "52 000 Kč", inBand: 58, outside: 3 },
    { level: "Medior", min: "48 000 Kč", mid: "62 000 Kč", max: "78 000 Kč", inBand: 84, outside: 2 },
    { level: "Senior", min: "70 000 Kč", mid: "90 000 Kč", max: "115 000 Kč", inBand: 46, outside: 4 },
    { level: "Lead", min: "95 000 Kč", mid: "120 000 Kč", max: "148 000 Kč", inBand: 28, outside: 1 },
    { level: "Manager", min: "110 000 Kč", mid: "145 000 Kč", max: "185 000 Kč", inBand: 22, outside: 0 },
    { level: "Director", min: "155 000 Kč", mid: "195 000 Kč", max: "250 000 Kč", inBand: 9, outside: 0 },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 w-full">
      {/* Page title */}
      <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink mb-6">Odměňování</h1>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Průměrná mzda", value: "68 400 Kč" },
          { label: "Medián mzdy", value: "58 200 Kč" },
          { label: "Pod pásmem", value: "4,1 %" },
          { label: "Nad pásmem", value: "2,3 %" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-panel border border-line shadow-card p-5">
            <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">{stat.label}</div>
            <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Mzdová pásma */}
      <div className="mb-8">
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-3">Mzdová pásma</h2>
        <div className="bg-surface rounded-panel border border-line shadow-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-well">
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Úroveň</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Min</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Střed</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Max</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Zam. v pásmu</th>
                <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Mimo pásmo</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((b, i) => (
                <tr key={b.level} className={`border-b border-hairline last:border-0 ${i % 2 === 1 ? "bg-canvas" : ""}`}>
                  <td className="px-4 py-3 text-[12.5px] font-bold text-ink">{b.level}</td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-soft">{b.min}</td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-soft">{b.mid}</td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-soft">{b.max}</td>
                  <td className="px-4 py-3 text-[12.5px] text-ink-soft">{b.inBand}</td>
                  <td className="px-4 py-3 text-[12.5px]">
                    {b.outside > 0
                      ? <span className="text-danger font-bold">{b.outside}</span>
                      : <span className="text-faint">—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Přehledy odměňování */}
      <div>
        <h2 className="text-[15px] font-bold tracking-[-0.02em] text-ink mb-3">Přehledy odměňování</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Card 1 - Gender pay */}
          <div className="bg-ok-soft border border-ok-line rounded-panel p-5">
            <div className="text-[12.5px] font-bold text-ink mb-2">Genderová rovnost</div>
            <div className="text-[12.5px] text-ink-soft">
              Ženy vydělávají v průměru <span className="font-bold text-ok">98,2 %</span> platu mužů na stejné pozici.
            </div>
          </div>
          {/* Card 2 - Band revision */}
          <div className="bg-wait-soft border border-wait-line rounded-panel p-5">
            <div className="text-[12.5px] font-bold text-ink mb-2">Revize pásem</div>
            <div className="text-[12.5px] text-ink-soft">
              Plánovaná revize mzdových pásem <span className="font-bold text-wait">1. 1. 2027</span>.
            </div>
          </div>
          {/* Card 3 - Bonuses */}
          <div className="bg-surface border border-line rounded-panel p-5">
            <div className="text-[12.5px] font-bold text-ink mb-2">Bonusy Q2 2026</div>
            <div className="text-[12.5px] text-ink-soft">
              Průměrný bonus <span className="font-bold text-ink">8,4 %</span> ročního platu, vyplaceno 215 zaměstnancům.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
