export const toDate = (s: string): Date => new Date(s + "T00:00:00Z");
export const toStr  = (d: Date): string  => d.toISOString().split("T")[0];

export const addDays = (d: Date, n: number): Date =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));

export const overlaps = (
  aStart: string, aEnd: string,
  bStart: string, bEnd: string
): boolean =>
  toDate(aStart) <= toDate(bEnd) && toDate(aEnd) >= toDate(bStart);


export const toDateOnly = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));


export function normalizeDate(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0,0,0,0);
  return normalized;
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return `${weeks}w`;
}

export function extractBYDAY(rrule: string): string[] {
  const match = rrule.match(/BYDAY=([^;]+)/);
  if (!match) return [];
  return match[1].split(',');
}

export function timeToMinutes(time: string): number {
  const [timePart, modifier] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// utility — minutes back to time string
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const modifier = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')} ${modifier}`;
}