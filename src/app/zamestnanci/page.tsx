export default function ZamestnancipPage() {
  const employees = [
    { initials: "TK", name: "Tomáš Kratochvíl", dept: "Management", position: "Generální ředitel", location: "Praha", since: "1. 3. 2018" },
    { initials: "LH", name: "Lucie Horáková", dept: "HR", position: "HR manažerka", location: "Praha", since: "15. 6. 2019" },
    { initials: "PŠ", name: "Pavel Šimánek", dept: "Finance", position: "Finanční ředitel", location: "Praha", since: "2. 9. 2019" },
    { initials: "JP", name: "Jana Procházková", dept: "Sales", position: "Sales Director", location: "Praha", since: "10. 1. 2020" },
    { initials: "MN", name: "Martin Novák", dept: "IT", position: "IT manažer", location: "Praha", since: "3. 3. 2021" },
    { initials: "KB", name: "Kateřina Blahová", dept: "Recepce", position: "Vedoucí recepce", location: "Praha", since: "8. 7. 2020" },
    { initials: "OČ", name: "Ondřej Červenka", dept: "F&B", position: "Šéfkuchař", location: "Praha", since: "14. 2. 2019" },
    { initials: "MŠ", name: "Markéta Švehlová", dept: "Housekeeping", position: "Vedoucí housekeepingu", location: "Praha", since: "20. 11. 2020" },
    { initials: "RH", name: "Radek Hájek", dept: "Recepce", position: "Front Office Manager", location: "Vídeň", since: "5. 5. 2021" },
    { initials: "SK", name: "Simona Konečná", dept: "Sales", position: "Sales Manager", location: "Vídeň", since: "12. 8. 2021" },
    { initials: "ZM", name: "Zdeněk Marek", dept: "F&B", position: "Šéfkuchař", location: "Bratislava", since: "1. 10. 2022" },
    { initials: "AB", name: "Alžběta Benešová", dept: "HR", position: "HR specialistka", location: "Praha", since: "17. 4. 2023" },
    { initials: "FD", name: "Filip Dvořák", dept: "Recepce", position: "Vedoucí recepce", location: "Brno", since: "3. 6. 2022" },
    { initials: "TCH", name: "Tereza Chaloupková", dept: "Sales", position: "Marketing manažerka", location: "Praha", since: "21. 9. 2022" },
    { initials: "JPO", name: "Jakub Pospíšil", dept: "Finance", position: "Revenue Manager", location: "Praha", since: "7. 1. 2023" },
    { initials: "EN", name: "Eva Navrátilová", dept: "IT", position: "IT specialistka", location: "Praha", since: "29. 3. 2023" },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 w-full">
      {/* Page title */}
      <h1 className="text-[23px] font-bold tracking-[-0.025em] text-ink mb-6">Zaměstnanci</h1>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Celkem zaměstnanců", value: "923" },
          { label: "Nástupy tento měsíc", value: "8" },
          { label: "Oddělení", value: "7" },
          { label: "Fluktuace TTM", value: "11,4 %" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface rounded-panel border border-line shadow-card p-5">
            <div className="text-[11px] font-semibold text-faint uppercase tracking-[.06em] mb-1">{stat.label}</div>
            <div className="text-[22px] font-bold tracking-[-0.02em] text-ink">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search bar + filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 bg-surface border border-input rounded-field px-3 py-2 text-[12.5px] text-muted">
          Hledat zaměstnance…
        </div>
        <span className="bg-surface border border-line rounded-chip px-3 py-1.5 text-[12px] text-ink-soft cursor-default">Oddělení</span>
        <span className="bg-surface border border-line rounded-chip px-3 py-1.5 text-[12px] text-ink-soft cursor-default">Lokalita</span>
      </div>

      {/* Employee table */}
      <div className="bg-surface rounded-panel border border-line shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-well">
              <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Jméno</th>
              <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Oddělení</th>
              <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Pozice</th>
              <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Lokalita</th>
              <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Nástup</th>
              <th className="text-left text-[11px] font-semibold text-faint uppercase tracking-[.06em] px-4 py-3">Stav</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={emp.name} className={`border-b border-hairline ${i % 2 === 1 ? "bg-canvas" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span style={{ background: "#e8e4dc", borderRadius: "50%", width: "26px", height: "26px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9.5px", fontWeight: 700, color: "#6c665c", flexShrink: 0 }}>
                      {emp.initials}
                    </span>
                    <span className="text-[12.5px] font-bold text-ink">{emp.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[12.5px] text-ink-soft">{emp.dept}</td>
                <td className="px-4 py-3 text-[12.5px] text-ink-soft">{emp.position}</td>
                <td className="px-4 py-3 text-[12.5px] text-ink-soft">{emp.location}</td>
                <td className="px-4 py-3 text-[12.5px] text-muted">{emp.since}</td>
                <td className="px-4 py-3">
                  <span className="bg-ok-soft text-ok border border-ok-line text-[9px] font-bold uppercase tracking-[.09em] rounded-[4px] px-1.5 py-0.5">
                    Aktivní
                  </span>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={6} className="px-4 py-3 text-[11px] text-muted text-center">
                Zobrazeno 16 z 923 zaměstnanců
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
