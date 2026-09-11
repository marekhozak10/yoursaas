import { TopBar } from "@/components/shell/TopBar"
import { StatusPill } from "@/components/ui-kit/StatusPill"
import { Avatar } from "@/components/ui-kit/Avatar"
import { Card } from "@/components/ui-kit/Card"
import { SectionHeading } from "@/components/ui-kit/SectionHeading"
import { Eyebrow } from "@/components/ui-kit/Eyebrow"
import { FieldLabel } from "@/components/ui-kit/FieldLabel"
import { Stat } from "@/components/ui-kit/Stat"
import { copy, type StatusKey } from "@/lib/copy"

/* ── Helper: colour swatch ─────────────────────────────────────────────── */
function Swatch({
  name,
  value,
  textDark = false,
}: {
  name: string
  value: string
  textDark?: boolean
}) {
  return (
    <div
      className="flex flex-col items-start rounded-[6px] p-3"
      style={{ background: value }}
    >
      <span
        className="text-[9px] font-bold uppercase tracking-[.08em] leading-none"
        style={{ color: textDark ? "#1b1a17" : "#ffffff" }}
      >
        {name}
      </span>
      <span
        className="mt-1 font-mono text-[9px] leading-none"
        style={{ color: textDark ? "#3a3730" : "rgba(255,255,255,.7)" }}
      >
        {value}
      </span>
    </div>
  )
}

/* ── Helper: section wrapper ───────────────────────────────────────────── */
function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-[11px] font-bold uppercase tracking-[.1em] text-faint border-b border-hairline pb-2">
        {title}
      </h2>
      {children}
    </section>
  )
}

const allStatuses: StatusKey[] = [
  "submitted",
  "processing",
  "awaiting_approval",
  "approved",
  "open",
  "declined",
  "failed",
]

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Live TopBar with mock data */}
      <TopBar pendingApprovals={2} currentUser={{ name: "Jana Dvořáková", initials: "JD" }} />

      <main className="mx-auto max-w-4xl px-8 py-10 space-y-12">

        {/* ── Status pills ─────────────────────────────────────── */}
        <Section title="Status pills">
          <div className="flex flex-wrap gap-3 items-center">
            {allStatuses.map((s) => (
              <StatusPill key={s} status={s} />
            ))}
          </div>
          <p className="text-[11px] text-muted mt-1">
            All seven statuses · 9 px/700 uppercase · radius 4 · 1 px border
          </p>
        </Section>

        {/* ── Avatars ──────────────────────────────────────────── */}
        <Section title="Avatar">
          <div className="flex items-center gap-4">
            <Avatar initials="JD" />
            <Avatar initials="PM" />
            <span className="text-[11px] text-muted">26 px · warm off-white · #6c665c initials</span>
          </div>
        </Section>

        {/* ── Cards ────────────────────────────────────────────── */}
        <Section title="Card">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <p className="text-[12.5px]">Výchozí karta. Bílá, 1 px rámeček, radius 12, stín.</p>
            </Card>
            <Card variant="agent">
              <div className="flex items-center gap-2 mb-2">
                <Eyebrow variant="agent">{copy.detail.draftEyebrow}</Eyebrow>
              </div>
              <p className="text-[12.5px] text-ink-soft">Agentská karta. Terakota rámeček 1,5 px, tintové pozadí.</p>
            </Card>
          </div>
        </Section>

        {/* ── Type scale ───────────────────────────────────────── */}
        <Section title="Typografie">
          <div className="space-y-3 bg-surface rounded-panel border border-line p-6 shadow-card">
            <div>
              <p className="text-[9px] font-bold text-faint uppercase tracking-[.1em] mb-1">Page title · 23 px / 700 / –.025 em</p>
              <p className="text-[23px] font-bold tracking-[-0.025em] text-ink">Požadavky na pozice</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-faint uppercase tracking-[.1em] mb-1">Section heading · 15 px / 700 / –.02 em</p>
              <SectionHeading>Návrh</SectionHeading>
            </div>
            <div>
              <p className="text-[9px] font-bold text-faint uppercase tracking-[.1em] mb-1">Card title / body · 12.5 px / 400 / lh 1.6</p>
              <p className="text-[12.5px] leading-[1.6] text-ink">Revenue manager, střední Evropa</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-faint uppercase tracking-[.1em] mb-1">Field label · 11 px / 600</p>
              <FieldLabel helper={copy.form.justificationHelper}>
                {copy.form.labels.justification}
              </FieldLabel>
            </div>
            <div>
              <p className="text-[9px] font-bold text-faint uppercase tracking-[.1em] mb-1">Small / helper · 11 px / 400</p>
              <p className="text-[11px] text-muted">Šest polí. Žádný ticket na HR.</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-faint uppercase tracking-[.1em] mb-1">Eyebrow · 9 px / 700 / uppercase / .1 em</p>
              <Eyebrow>Nábor</Eyebrow>
            </div>
            <div>
              <p className="text-[9px] font-bold text-faint uppercase tracking-[.1em] mb-1">Stat number (large) · 22 px / 700 / –.02 em</p>
              <Stat label={copy.approvalCard.statLabels.annualCost} value="1,86 mil. Kč" caption={copy.detail.costCaption} size="lg" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-faint uppercase tracking-[.1em] mb-1">Mono · JetBrains Mono</p>
              <p className="font-mono text-[12.5px] text-muted">POZ-2026-014</p>
            </div>
          </div>
        </Section>

        {/* ── Stat grid (approval-card style) ─────────────────── */}
        <Section title="Stat — compact grid">
          <div
            className="rounded-card border border-hairline overflow-hidden"
            style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 1, background: "#eceae4" }}
          >
            <div className="bg-surface px-4 py-[11px]">
              <Stat
                label={copy.approvalCard.statLabels.salaryBand}
                value="Pásmo 4"
                caption={copy.detail.contextCaptions.inBand}
                size="sm"
              />
            </div>
            <div className="bg-surface px-4 py-[11px]">
              <Stat
                label={copy.approvalCard.statLabels.annualCost}
                value="1,86 mil. Kč"
                caption={copy.detail.costCaption}
                size="sm"
              />
            </div>
            <div className="bg-surface px-4 py-[11px]">
              <Stat
                label={copy.approvalCard.statLabels.timeToFill}
                value="47 dní"
                caption={copy.detail.contextCaptions.medianCaption}
                size="sm"
              />
            </div>
          </div>
        </Section>

        {/* ── Colour palette ───────────────────────────────────── */}
        <Section title="Paleta barev">

          <div className="space-y-3">
            <p className="text-[11px] text-muted">Ink</p>
            <div className="grid grid-cols-4 gap-2">
              <Swatch name="ink"      value="#1b1a17" />
              <Swatch name="ink-soft" value="#3a3730" />
              <Swatch name="muted"    value="#6f6b62" />
              <Swatch name="faint"    value="#969187" />
            </div>

            <p className="text-[11px] text-muted">Surfaces</p>
            <div className="grid grid-cols-4 gap-2">
              <Swatch name="surface"  value="#ffffff" textDark />
              <Swatch name="canvas"   value="#faf9f7" textDark />
              <Swatch name="sunken"   value="#f5f4f0" textDark />
              <Swatch name="well"     value="#f3f1ec" textDark />
            </div>

            <p className="text-[11px] text-muted">Lines</p>
            <div className="grid grid-cols-3 gap-2">
              <Swatch name="line"      value="#e3e0d9" textDark />
              <Swatch name="hairline"  value="#eceae4" textDark />
              <Swatch name="input"     value="#dcd8d0" textDark />
            </div>

            <p className="text-[11px] text-muted">Brand (teal – human decisions)</p>
            <div className="grid grid-cols-5 gap-2">
              <Swatch name="brand"      value="#12655f" />
              <Swatch name="brand-hover" value="#0d4d48" />
              <Swatch name="brand-soft"  value="#e4efec" textDark />
              <Swatch name="brand-line"  value="#cfe2dd" textDark />
              <Swatch name="brand-ink"   value="#125b56" />
            </div>

            <p className="text-[11px] text-muted">Agent (terracotta – AI decisions)</p>
            <div className="grid grid-cols-5 gap-2">
              <Swatch name="agent"      value="#9a5548" />
              <Swatch name="agent-soft" value="#f6eae6" textDark />
              <Swatch name="agent-tint" value="#fbf3f0" textDark />
              <Swatch name="agent-line" value="#ecd9d3" textDark />
              <Swatch name="agent-ink"  value="#7b5449" />
            </div>

            <p className="text-[11px] text-muted">States</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Swatch name="ok"          value="#2f6b4a" />
                <Swatch name="ok-soft"     value="#e6f1ea" textDark />
                <Swatch name="ok-line"     value="#cfe5d9" textDark />
              </div>
              <div className="space-y-1">
                <Swatch name="danger"      value="#9c3b32" />
                <Swatch name="danger-soft" value="#f7eae8" textDark />
                <Swatch name="danger-line" value="#eed6d2" textDark />
              </div>
              <div className="space-y-1">
                <Swatch name="wait"        value="#8a6a1c" />
                <Swatch name="wait-soft"   value="#f6efdd" textDark />
                <Swatch name="wait-line"   value="#e8dcbe" textDark />
              </div>
            </div>
          </div>
        </Section>

        {/* ── Eyebrow variants ─────────────────────────────────── */}
        <Section title="Eyebrow">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[11px] text-muted mb-2">default (faint)</p>
              <Eyebrow>Nábor</Eyebrow>
            </div>
            <div>
              <p className="text-[11px] text-muted mb-2">agent (terracotta)</p>
              <Eyebrow variant="agent">{copy.detail.draftEyebrow}</Eyebrow>
            </div>
          </div>
        </Section>

        {/* ── Scripted mode badge ──────────────────────────────── */}
        <Section title="Scripted mode badge">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center rounded-chip px-2 py-0.5 text-[9px] font-bold tracking-[.05em] border"
              style={{ color: "#8a6a1c", background: "#f6efdd", borderColor: "#e8dcbe" }}
            >
              {copy.shell.scriptedBadge}
            </span>
            <span className="text-[11px] text-muted">Amber · visible to speaker, easy to miss from audience</span>
          </div>
        </Section>

      </main>
    </div>
  )
}
