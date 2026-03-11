// ─── Shared types ──────────────────────────────────────────────────────────────
export type RepeatFreq = 'weekly' | 'monthly';
export type EndType   = 'never' | 'on' | 'after';

export interface RecurringConfig {
  freq:         RepeatFreq;
  // weekly
  weeklyDays:   string[];
  interval:     number;
  // monthly
  monthlyPos:   string;   // "1","2","3","4","-1"
  monthlyDay:   string;   // "Monday" etc.
  // time
  timeFrom:     string;
  timeTo:       string;
  // range
  startDate:    string;
  endType:      EndType;
  endDate:      string;
  endCount:     number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────
export const DAYS_SHORT  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
export const DAYS_RRULE: Record<string,string> = {
  Mon:'MO', Tue:'TU', Wed:'WE', Thu:'TH', Fri:'FR', Sat:'SA', Sun:'SU',
};
export const WEEKDAYS_FULL = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export const WEEKDAYS_RRULE: Record<string,string> = {
  Monday:'MO', Tuesday:'TU', Wednesday:'WE', Thursday:'TH',
  Friday:'FR', Saturday:'SA', Sunday:'SU',
};
export const MONTH_POSITIONS = [
  { label:'1st',  value:'1'  },
  { label:'2nd',  value:'2'  },
  { label:'3rd',  value:'3'  },
  { label:'4th',  value:'4'  },
  { label:'Last', value:'-1' },
];

export const DEFAULT_CONFIG: RecurringConfig = {
  freq:       'weekly',
  weeklyDays: ['Mon','Wed','Fri'],
  interval:   1,
  monthlyPos: '1',
  monthlyDay: 'Monday',
  timeFrom:   '09:00',
  timeTo:     '18:00',
  startDate:  new Date().toISOString().split('T')[0],
  endType:    'never',
  endDate:    '',
  endCount:   10,
};

// ─── RRule builder ─────────────────────────────────────────────────────────────
export function buildRRule(cfg: RecurringConfig): string {
  const parts: string[] = [];

  if (cfg.freq === 'weekly') {
    parts.push('FREQ=WEEKLY');
    if (cfg.interval > 1) parts.push(`INTERVAL=${cfg.interval}`);
    if (cfg.weeklyDays.length)
      parts.push(`BYDAY=${cfg.weeklyDays.map(d => DAYS_RRULE[d]).join(',')}`);
  } else {
    parts.push('FREQ=MONTHLY');
    parts.push(`BYDAY=${WEEKDAYS_RRULE[cfg.monthlyDay]}`);
    parts.push(`BYSETPOS=${cfg.monthlyPos}`);
  }

  if (cfg.endType === 'on'    && cfg.endDate)
    parts.push(`UNTIL=${cfg.endDate.replace(/-/g,'')}`);
  if (cfg.endType === 'after' && cfg.endCount)
    parts.push(`COUNT=${cfg.endCount}`);

  return parts.join(';');
}

// ─── Default save payload shape ────────────────────────────────────────────────
export interface RecurringSavePayload {
  type:      'availability' | 'leave';
  rrule:     string;
  timeFrom:  string;
  timeTo:    string;
  startDate: string;
  endType:   EndType;
  endDate?:  string;
  endCount?: number;
}

export function buildPayload(
  cfg: RecurringConfig,
  type: 'availability' | 'leave'
): RecurringSavePayload {
  return {
    type,
    rrule:     buildRRule(cfg),
    timeFrom:  cfg.timeFrom,
    timeTo:    cfg.timeTo,
    startDate: cfg.startDate,
    endType:   cfg.endType,
    ...(cfg.endType === 'on'    && { endDate:  cfg.endDate }),
    ...(cfg.endType === 'after' && { endCount: cfg.endCount }),
  };
}