
import { ScheduleEndType } from "../../domain/enum/beauticianEnum";
import { toDate, toStr, addDays } from "./dateHelper";
import { rrulestr } from "rrule";



export const FAR_FUTURE = "2099-12-31";

export function extractInterval(rrule: string): number {
  const match = rrule.match(/INTERVAL=(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

export function setUntil(rrule: string, until: string): string {
  return rrule
    .replace(/;?UNTIL=\d+/g, "")
    .replace(/;?COUNT=\d+/g, "")
    + ";UNTIL=" + until.replace(/-/g, "");
}

export function stripEnd(rrule: string): string {
  return rrule
    .replace(/;?UNTIL=\d+/g, "")
    .replace(/;?COUNT=\d+/g, "");
}


export function getEffectiveEndDate(rule: {
  endType:   ScheduleEndType;
  endDate?:  string;
  endCount?: number;
  startDate: string;
  rrule:     string;
}): string {
  if (rule.endType === ScheduleEndType.ON    && rule.endDate) return rule.endDate;
  if (rule.endType === ScheduleEndType.NEVER) return FAR_FUTURE;

  if (rule.endType === ScheduleEndType.AFTER && rule.endCount) {
    const interval = extractInterval(rule.rrule);
    const isWeekly = rule.rrule.includes("FREQ=WEEKLY");
    const start    = toDate(rule.startDate);

    if (isWeekly) {
      return toStr(addDays(start, (rule.endCount - 1) * interval * 7));
    } else {
      // Proper calendar month addition — not 30-day approximation
      const totalMonths = (rule.endCount - 1) * interval;
      return toStr(new Date(Date.UTC(
        start.getUTCFullYear(),
        start.getUTCMonth() + totalMonths,
        start.getUTCDate()
      )));
    }
  }

  return FAR_FUTURE;
}

export function rruleCoversDate(rule: { rrule: string; startDate: Date; endDate?: Date }, date: Date): boolean {
  try {
    const rruleStr = rule.rrule.includes("DTSTART")
      ? rule.rrule
      : `DTSTART:${toRRuleDateStr(rule.startDate)}
RRULE:${rule.rrule}`;

    const rrule    = rrulestr(rruleStr);
    const dayStart = date;
    const dayEnd   = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));

    return rrule.between(dayStart, dayEnd, true).length > 0;
  } catch {
    return false;
  }
}

export function toRRuleDateStr(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}