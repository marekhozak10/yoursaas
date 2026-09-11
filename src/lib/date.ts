/**
 * date-fns helpers with Czech locale pre-applied.
 * Import formatting functions from here, not from date-fns directly.
 */
import { cs } from "date-fns/locale";
import {
  format as _format,
  formatRelative as _formatRelative,
  formatDistance as _formatDistance,
} from "date-fns";
import type { FormatOptions } from "date-fns";

export { cs as czechLocale };

/** Default options for all date-fns calls in this project. */
const defaultOptions: FormatOptions = { locale: cs };

export function format(
  date: Date | number,
  formatStr: string,
  options?: FormatOptions
): string {
  return _format(date, formatStr, { ...defaultOptions, ...options });
}

export function formatRelative(
  date: Date | number,
  baseDate: Date | number,
  options?: FormatOptions
): string {
  return _formatRelative(date, baseDate, { ...defaultOptions, ...options });
}

export function formatDistance(
  date: Date | number,
  baseDate: Date | number,
  options?: Parameters<typeof _formatDistance>[2]
): string {
  return _formatDistance(date, baseDate, { ...defaultOptions, ...options });
}
