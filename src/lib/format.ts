/**
 * Money and number formatting utilities.
 * No Czech strings here — those live in copy.ts.
 */

/**
 * Formats an annual cost in haléře as a human-readable Czech millions string.
 * e.g. 186_000_000 haléře → "1,86 mil. Kč"
 */
export function formatAnnualCost(costMinor: number): string {
  const kc = costMinor / 100
  const millions = kc / 1_000_000
  return (
    millions.toLocaleString("cs-CZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }) + " mil. Kč"
  )
}

/**
 * Formats a monthly salary band range in haléře.
 * e.g. minMinor=9_500_000, maxMinor=12_000_000 → "95 000 až 120 000 Kč"
 */
export function formatSalaryBand(minMinor: number, maxMinor: number): string {
  const fmt = (minor: number) =>
    (minor / 100).toLocaleString("cs-CZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  return `${fmt(minMinor)} až ${fmt(maxMinor)} Kč`
}
