
import { ScheduleEndType, ScheduleType } from "../../domain/enum/beauticianEnum";
import { toDate, toStr, addDays, overlaps } from "./dateHelper";
import { getEffectiveEndDate, setUntil, stripEnd, FAR_FUTURE } from "./RruleHelper";

// ── Mirrors your RecurringSchedule entity exactly ─────────────────────────────
export interface RecurringRule {
  id:          string;
  rrule:       string;
  timeFrom:    string;
  timeTo:      string;
  type:        ScheduleType;
  startDate:   Date;
  endType:     ScheduleEndType;
  endDate?:    Date;
  endCount?:   number;
}

// ── What we hand back to the repo (no id/createdAt/updatedAt) ─────────────────
export interface RuleSegment {
  rrule:       string;
  timeFrom:    string;
  timeTo:      string;
  type:        ScheduleType;
  startDate:   Date;
  endType:     ScheduleEndType;
  endDate?:    Date;
  endCount?:   number;
}

export interface SplitResult {
  deleteId: string;
  segments: RuleSegment[];
}

/**
 * Given one existing rule and the incoming new rule's date window,
 * returns what to delete + segments to re-insert.
 * Returns null if no overlap.
 */
export function computeSplit(
  existing: RecurringRule,
  newStart: Date | string,
  newEnd:   Date | string
): SplitResult | null {
  // Normalise to string for date comparison helpers
  const existingStartStr = existing.startDate.toISOString().split("T")[0];
  const existingEndStr   = existing.endDate
    ? existing.endDate.toISOString().split("T")[0]
    : getEffectiveEndDate({
        endType:   existing.endType,
        endCount:  existing.endCount,
        startDate: existingStartStr,
        rrule:     existing.rrule,
      });

  const newStartStr = newStart instanceof Date
    ? newStart.toISOString().split("T")[0]
    : newStart;
  const newEndStr = newEnd instanceof Date
    ? newEnd.toISOString().split("T")[0]
    : newEnd;

  if (!overlaps(existingStartStr, existingEndStr, newStartStr, newEndStr)) return null;

  const existingStartDate = toDate(existingStartStr);
  const existingEndDate   = toDate(existingEndStr);
  const newStartDate      = toDate(newStartStr);
  const newEndDate        = toDate(newEndStr);

  const hasBefore = existingStartDate < newStartDate;
  const hasAfter  = existingEndDate   > newEndDate;

  const segments: RuleSegment[] = [];

  // ── Segment BEFORE new rule ────────────────────────────────────────────────
  if (hasBefore) {
    const beforeEnd = toStr(addDays(newStartDate, -1));
    segments.push({
      rrule:     setUntil(existing.rrule, beforeEnd),
      timeFrom:  existing.timeFrom,
      timeTo:    existing.timeTo,
      type:      existing.type,
      startDate: existing.startDate,            // keep original Date
      endType:   ScheduleEndType.ON,
      endDate:   new Date(beforeEnd),
      endCount:  undefined,
    });
  }

  // ── Segment AFTER new rule ─────────────────────────────────────────────────
  if (hasAfter) {
    const afterStart = toStr(addDays(newEndDate, 1));
    const isNever    = existingEndStr === FAR_FUTURE;

    segments.push({
      rrule:     isNever ? stripEnd(existing.rrule) : setUntil(existing.rrule, existingEndStr),
      timeFrom:  existing.timeFrom,
      timeTo:    existing.timeTo,
      type:      existing.type,
      startDate: new Date(afterStart),
      endType:   isNever ? ScheduleEndType.NEVER : ScheduleEndType.ON,
      endDate:   isNever ? undefined : existing.endDate,
      endCount:  undefined,
    });
  }

  return { deleteId: existing.id, segments };
}

export function carveLeaveFromAvailability(
  newAvail: RuleSegment,
  leaveRules: RecurringRule[]
): RuleSegment[] {
  let segments: RuleSegment[] = [{ ...newAvail }];

  for (const leave of leaveRules) {
    const leaveStartStr = leave.startDate.toISOString().split("T")[0];
    const leaveEndStr   = leave.endDate
      ? leave.endDate.toISOString().split("T")[0]
      : getEffectiveEndDate({
          endType:   leave.endType,
          endCount:  leave.endCount,
          startDate: leaveStartStr,
          rrule:     leave.rrule,
        });

    const next: RuleSegment[] = [];

    for (const seg of segments) {
      const segStartStr = seg.startDate.toISOString().split("T")[0];
      const segEndStr   = seg.endDate
        ? seg.endDate.toISOString().split("T")[0]
        : getEffectiveEndDate({
            endType:   seg.endType,
            endCount:  seg.endCount,
            startDate: segStartStr,
            rrule:     seg.rrule,
          });

      if (!overlaps(segStartStr, segEndStr, leaveStartStr, leaveEndStr)) {
        next.push(seg); // no conflict — keep as-is
        continue;
      }

      const segStart   = toDate(segStartStr);
      const segEnd     = toDate(segEndStr);
      const leaveStart = toDate(leaveStartStr);
      const leaveEnd   = toDate(leaveEndStr);

      // Piece BEFORE leave window
      if (segStart < leaveStart) {
        const beforeEnd = toStr(addDays(leaveStart, -1));
        next.push({
          ...seg,
          rrule:     setUntil(seg.rrule, beforeEnd),
          startDate: seg.startDate,
          endType:   ScheduleEndType.ON,
          endDate:   new Date(beforeEnd),
          endCount:  undefined,
        });
      }

      // Piece AFTER leave window
      if (segEnd > leaveEnd) {
        const afterStart = toStr(addDays(leaveEnd, 1));
        const isNever    = segEndStr === FAR_FUTURE;
        next.push({
          ...seg,
          rrule:     isNever ? stripEnd(seg.rrule) : setUntil(seg.rrule, segEndStr),
          startDate: new Date(afterStart),
          endType:   isNever ? ScheduleEndType.NEVER : ScheduleEndType.ON,
          endDate:   isNever ? undefined : seg.endDate,
          endCount:  undefined,
        });
      }
      // leave completely swallows this segment — drop it
    }

    segments = next;
    if (segments.length === 0) break;
  }

  return segments;
}