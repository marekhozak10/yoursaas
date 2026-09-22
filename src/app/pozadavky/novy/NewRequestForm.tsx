'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { cn } from 'cn'
import { copy } from '@/lib/copy'
import { FieldLabel } from '@/components/ui-kit/FieldLabel'
import { Eyebrow } from '@/components/ui-kit/Eyebrow'
import { createRequest, type FormState } from '@/app/actions/request'
import type { Team } from '@/lib/types'

const SENIORITIES = [
  { value: 'junior', label: copy.form.seniorityOptions.junior },
  { value: 'medior', label: copy.form.seniorityOptions.medior },
  { value: 'senior', label: copy.form.seniorityOptions.senior },
  { value: 'lead',   label: copy.form.seniorityOptions.lead   },
] as const

const INPUT_CLS = [
  'w-full border border-input-border rounded-lg bg-surface',
  'px-[13px] py-[11px] text-[12.5px] text-ink leading-none',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
  'placeholder:text-faint',
].join(' ')

interface Props {
  teams: Team[]
  defaultDate: string
}

const initialState: FormState = {}

export function NewRequestForm({ teams, defaultDate }: Props) {
  const [state, action, pending] = useActionState(createRequest, initialState)
  const errors = state.errors ?? {}

  return (
    <main className="appmixer-embed-area mx-auto max-w-[560px] px-8 py-16">
      <div>

        <Eyebrow>{copy.form.eyebrow}</Eyebrow>

        <h1 className="mt-1.5 text-[23px] font-bold tracking-[-0.025em] text-ink">
          {copy.form.title}
        </h1>
        <p className="mt-[5px] text-[12.5px] text-muted leading-[1.5]">
          {copy.form.subtitle}
        </p>

        <form action={action} className="mt-6 flex flex-col gap-[15px]">

          {/* Tým */}
          <div>
            <FieldLabel htmlFor="teamId">{copy.form.labels.team}</FieldLabel>
            <div className="mt-1.5 relative">
              <select
                id="teamId"
                name="teamId"
                className={cn(INPUT_CLS, 'appearance-none pr-8')}
              >
                <option value=""></option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {/* chevron */}
              <span className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#969187" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </div>
            {errors.teamId && <FieldError>{errors.teamId}</FieldError>}
          </div>

          {/* Název pozice */}
          <div>
            <FieldLabel htmlFor="title">{copy.form.labels.title}</FieldLabel>
            <div className="mt-1.5">
              <input
                id="title"
                name="title"
                type="text"
                className={INPUT_CLS}
              />
            </div>
            {errors.title && <FieldError>{errors.title}</FieldError>}
          </div>

          {/* Seniorita + Nástup od */}
          <div className="grid grid-cols-2 gap-[15px]">

            {/* Seniorita */}
            <div>
              <FieldLabel>{copy.form.labels.seniority}</FieldLabel>
              <div className="mt-1.5 flex border border-input-border rounded-lg overflow-hidden">
                {SENIORITIES.map((s, i) => (
                  <label key={s.value} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="seniority"
                      value={s.value}
                      defaultChecked={s.value === 'senior'}
                      className="sr-only peer"
                    />
                    <span className={cn(
                      'block w-full text-center text-[11.5px] py-[10px] transition-colors',
                      'text-muted peer-checked:bg-brand peer-checked:text-white peer-checked:font-semibold',
                      i > 0 && 'border-l border-hairline',
                    )}>
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.seniority && <FieldError>{errors.seniority}</FieldError>}
            </div>

            {/* Nástup od */}
            <div>
              <FieldLabel htmlFor="targetStartDate">{copy.form.labels.startDate}</FieldLabel>
              <div className="mt-1.5 relative">
                <input
                  id="targetStartDate"
                  name="targetStartDate"
                  type="date"
                  defaultValue={defaultDate}
                  className={cn(INPUT_CLS, 'pr-9')}
                />
                <span className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#969187" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3.5" y="5" width="17" height="15" rx="2"/>
                    <path d="M3.5 10h17M8 3v4M16 3v4"/>
                  </svg>
                </span>
              </div>
              {errors.targetStartDate && <FieldError>{errors.targetStartDate}</FieldError>}
            </div>

          </div>

          {/* Lokalita */}
          <div>
            <FieldLabel htmlFor="location">{copy.form.labels.location}</FieldLabel>
            <div className="mt-1.5">
              <input
                id="location"
                name="location"
                type="text"
                defaultValue="Praha, hybridně"
                className={INPUT_CLS}
              />
            </div>
            {errors.location && <FieldError>{errors.location}</FieldError>}
          </div>

          {/* Zdůvodnění */}
          <div>
            <FieldLabel htmlFor="justification" helper={copy.form.justificationHelper}>
              {copy.form.labels.justification}
            </FieldLabel>
            <div className="mt-1.5">
              <textarea
                id="justification"
                name="justification"
                rows={5}
                className={cn(INPUT_CLS, 'resize-none leading-[1.6] py-[11px] min-h-[112px]')}
              />
            </div>
            {errors.justification && <FieldError>{errors.justification}</FieldError>}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-[11px]">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center text-[13px] font-semibold text-white bg-brand rounded-lg px-[22px] py-3 hover:bg-brand-hover transition-colors disabled:opacity-60 cursor-pointer"
            >
              {copy.form.submitButton}
            </button>
            <Link
              href="/pozadavky"
              className="text-[12.5px] text-muted hover:text-ink-soft transition-colors"
            >
              {copy.form.cancelButton}
            </Link>
          </div>

        </form>

        {/* Footer */}
        <div className="mt-[22px] border-t border-hairline pt-[14px] text-[11px] text-faint leading-[1.6]">
          {copy.form.footer}
        </div>

      </div>

      {/* Appmixer badge — shown via CSS when html.appmixer-highlight is set */}
      <div className="appmixer-embed-badge">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/appmixer-logo.png" alt="Appmixer" width={16} height={16} style={{ flexShrink: 0, objectFit: 'contain' }} />
        <span className="appmixer-embed-badge-text">{copy.appmixerHighlight.badge}</span>
      </div>
    </main>
  )
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[11px] text-danger">{children}</p>
  )
}
