const LOCALE = "fr-FR";
/** Fixed time zone so server and browser render identical dates. */
const TIME_ZONE = "Europe/Paris";

export function formatCurrency(value: number, currency = "EUR", maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency, maximumFractionDigits }).format(value);
}

export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits }).format(value);
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat(LOCALE, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatPercent(value: number, digits = 1, signed = false): string {
  const formatted = new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
    signDisplay: signed ? "exceptZero" : "auto",
  }).format(value);
  return `${formatted} %`;
}

export function formatDate(iso: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }): string {
  return new Intl.DateTimeFormat(LOCALE, { ...options, timeZone: TIME_ZONE }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return formatDate(iso, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/** "il y a 3 h", "hier", "le 12 mars 2025" — relative to `now`. */
export function formatRelative(iso: string, now: number): string {
  const diffMs = now - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} jours`;
  return formatDate(iso);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${formatNumber(count)} ${count > 1 ? plural : singular}`;
}
