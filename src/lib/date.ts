/**
 * date-fns helpers with Czech locale pre-applied.
 * Import formatting functions from here, not from date-fns directly.
 */
import { cs } from "date-fns/locale"
import {
  format as _format,
  formatRelative as _formatRelative,
  formatDistance as _formatDistance,
  formatDistanceStrict as _formatDistanceStrict,
} from "date-fns"

export { cs as czechLocale }

export function format(
  date: Date | number,
  formatStr: string
): string {
  return _format(date, formatStr, { locale: cs })
}

export function formatRelative(
  date: Date | number,
  baseDate: Date | number
): string {
  return _formatRelative(date, baseDate, { locale: cs })
}

export function formatDistance(
  date: Date | number,
  baseDate: Date | number,
  options?: { addSuffix?: boolean; includeSeconds?: boolean }
): string {
  return _formatDistance(date, baseDate, { locale: cs, ...options })
}

/** Formats an ISO UTC string as Czech long-form date in Prague time.
 *  e.g. "1. listopadu 2026"
 */
export function formatPragueDate(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Prague",
  }).format(date)
}

/** Formats an ISO UTC string as time in Prague time. e.g. "9:14" */
export function formatPragueTime(iso: string): string {
  const date = new Date(iso)
  return new Intl.DateTimeFormat("cs-CZ", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/Prague",
  }).format(date)
}

/** Formats an ISO UTC string as date + time in Prague time. e.g. "1. listopadu 2026, 9:14" */
export function formatPragueDateTime(iso: string): string {
  return `${formatPragueDate(iso)}, ${formatPragueTime(iso)}`
}

/** For dates within the last 24 hours returns a relative string (e.g. "před 3 hodinami"),
 *  for older dates returns the long date form.
 */
export function formatRelativeNow(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const twentyFourHours = 24 * 60 * 60 * 1000
  if (diffMs >= 0 && diffMs < twentyFourHours) {
    return _formatDistanceStrict(date, now, { locale: cs, addSuffix: true })
  }
  return formatPragueDate(iso)
}
