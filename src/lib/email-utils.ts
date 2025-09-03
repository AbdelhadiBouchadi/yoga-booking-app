import { format, toZonedTime } from "date-fns-tz";

const MOROCCO_TIMEZONE = "Africa/Casablanca";

export function formatDateForEmail(date: Date): string {
  const moroccoDate = toZonedTime(date, MOROCCO_TIMEZONE);
  return format(moroccoDate, "EEEE, MMMM d, yyyy", {
    timeZone: MOROCCO_TIMEZONE,
  });
}

export function formatTimeForEmail(date: Date): string {
  const moroccoTime = toZonedTime(date, MOROCCO_TIMEZONE);
  return format(moroccoTime, "h:mm a", { timeZone: MOROCCO_TIMEZONE });
}
