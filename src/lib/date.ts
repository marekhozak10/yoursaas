/**
 * date-fns helpers with Czech locale pre-applied.
 * Import formatting functions from here, not from date-fns directly.
 */
import { cs } from "date-fns/locale"
import {
  format as _format,
  formatRelative as _formatRelative,
  formatDistance as _formatDistance,
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
