import type { RecurringConfig, EndType } from '../../../../lib/utils/recurringUtil';
import { DAYS_SHORT, WEEKDAYS_FULL, MONTH_POSITIONS } from '../../../../lib/utils/recurringUtil';


// ─── Accent theme ──────────────────────────────────────────────────────────────
export interface Accent {
  pill:     string; // active pill bg
  pillText: string;
  radio:    string; // radio active border+bg
  input:    string; // input focus border
  addBtn:   string;
  saveBtn:  string;
  tabText:  string;
}

export const TEAL_ACCENT: Accent = {
  pill:     'bg-teal-500',
  pillText: 'text-white',
  radio:    'border-teal-500 bg-teal-500',
  input:    'focus:border-teal-400',
  addBtn:   'bg-teal-100 text-teal-600 hover:bg-teal-200',
  saveBtn:  'bg-teal-500 hover:bg-teal-600',
  tabText:  'text-teal-600',
};

export const RED_ACCENT: Accent = {
  pill:     'bg-red-500',
  pillText: 'text-white',
  radio:    'border-red-500 bg-red-500',
  input:    'focus:border-red-400',
  addBtn:   'bg-red-100 text-red-600 hover:bg-red-200',
  saveBtn:  'bg-red-500 hover:bg-red-600',
  tabText:  'text-red-500',
};

// ─── Radio ─────────────────────────────────────────────────────────────────────
interface RadioProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  accent: Accent;
}
export function Radio({ checked, onChange, label, accent }: RadioProps) {
  return (
    <label onClick={onChange} className="flex items-center gap-2.5 cursor-pointer select-none">
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        checked ? accent.radio : 'border-gray-300'
      }`}>
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

// ─── Day Pill Picker ───────────────────────────────────────────────────────────
interface DayPickerProps {
  selected: string[];
  onToggle: (day: string) => void;
  accent: Accent;
}
export function DayPicker({ selected, onToggle, accent }: DayPickerProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {DAYS_SHORT.map(day => {
        const active = selected.includes(day);
        return (
          <button
            key={day}
            onClick={() => onToggle(day)}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border transition ${
              active
                ? `${accent.pill} ${accent.pillText} border-transparent`
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}

// ─── End Condition ─────────────────────────────────────────────────────────────
interface EndConditionProps {
  endType:    EndType;
  setEndType: (v: EndType) => void;
  endDate:    string;
  setEndDate: (v: string) => void;
  endCount:   number;
  setEndCount:(v: number) => void;
  accent:     Accent;
}
export function EndCondition({
  endType, setEndType, endDate, setEndDate, endCount, setEndCount, accent
}: EndConditionProps) {
  return (
    <div className="space-y-2.5">
      <Radio checked={endType === 'never'} onChange={() => setEndType('never')} label="Never" accent={accent} />

      <div className="flex items-center gap-2 flex-wrap">
        <Radio checked={endType === 'on'} onChange={() => setEndType('on')} label="On date" accent={accent} />
        {endType === 'on' && (
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className={`flex-1 min-w-0 px-2.5 py-1.5 text-xs border border-gray-300 rounded-md outline-none ${accent.input}`}
          />
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Radio checked={endType === 'after'} onChange={() => setEndType('after')} label="After" accent={accent} />
        {endType === 'after' && (
          <>
            <input
              type="number"
              value={endCount}
              min={1}
              onChange={e => setEndCount(Math.max(1, parseInt(e.target.value) || 1))}
              className={`w-16 px-2.5 py-1.5 text-xs border border-gray-300 rounded-md outline-none ${accent.input}`}
            />
            <span className="text-xs text-gray-500">occurrences</span>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Weekly Section ────────────────────────────────────────────────────────────
interface WeeklySectionProps {
  cfg:    RecurringConfig;
  setCfg: React.Dispatch<React.SetStateAction<RecurringConfig>>;
  accent: Accent;
}
// Friendly interval options instead of raw number input
const INTERVAL_OPTIONS = [
  { value: 1, label: 'Every week',     hint: 'e.g. Mon this week → Mon next week → Mon after that...' },
  { value: 2, label: 'Every 2 weeks',  hint: 'e.g. Works Mon → skip a week → works Mon again' },
  { value: 3, label: 'Every 3 weeks',  hint: 'e.g. Works Mon → 2 weeks gap → works Mon again' },
  { value: 4, label: 'Once a month',   hint: 'e.g. Works Mon → 3 weeks gap → works Mon again' },
];

export function WeeklySection({ cfg, setCfg, accent }: WeeklySectionProps) {
  const toggle = (day: string) =>
    setCfg(p => ({
      ...p,
      weeklyDays: p.weeklyDays.includes(day)
        ? p.weeklyDays.filter(d => d !== day)
        : [...p.weeklyDays, day],
    }));

  const selected = INTERVAL_OPTIONS.find(o => o.value === cfg.interval) || INTERVAL_OPTIONS[0];

  return (
    <div className="space-y-3">

      {/* Frequency dropdown with hint */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500">Frequency</p>
        <select
          value={cfg.interval}
          onChange={e => setCfg(p => ({ ...p, interval: parseInt(e.target.value) }))}
          className={`w-full px-2.5 py-2 text-sm border border-gray-300 rounded-md outline-none bg-white ${accent.input}`}
        >
          {INTERVAL_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {/* Hint line below dropdown */}
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <span>ℹ</span> {selected.hint}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1.5">Select days</p>
        <DayPicker selected={cfg.weeklyDays} onToggle={toggle} accent={accent} />
      </div>
    </div>
  );
}

// ─── Monthly Section ───────────────────────────────────────────────────────────
interface MonthlySectionProps {
  cfg:    RecurringConfig;
  setCfg: React.Dispatch<React.SetStateAction<RecurringConfig>>;
  accent: Accent;
}
export function MonthlySection({ cfg, setCfg, accent }: MonthlySectionProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">Repeat on</p>
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={cfg.monthlyPos}
          onChange={e => setCfg(p => ({ ...p, monthlyPos: e.target.value }))}
          className={`px-2.5 py-1.5 text-xs border border-gray-300 rounded-md outline-none bg-white ${accent.input}`}
        >
          {MONTH_POSITIONS.map(pos => (
            <option key={pos.value} value={pos.value}>{pos.label}</option>
          ))}
        </select>
        <select
          value={cfg.monthlyDay}
          onChange={e => setCfg(p => ({ ...p, monthlyDay: e.target.value }))}
          className={`px-2.5 py-1.5 text-xs border border-gray-300 rounded-md outline-none bg-white ${accent.input}`}
        >
          {WEEKDAYS_FULL.map(d => <option key={d}>{d}</option>)}
        </select>
        <span className="text-xs text-gray-500">of every month</span>
      </div>
    </div>
  );
}

// ─── Time Range ────────────────────────────────────────────────────────────────
interface TimeRangeProps {
  timeFrom:    string;
  timeTo:      string;
  setTimeFrom: (v: string) => void;
  setTimeTo:   (v: string) => void;
  accent:      Accent;
}
export function TimeRange({ timeFrom, timeTo, setTimeFrom, setTimeTo, accent }: TimeRangeProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">From</p>
        <input
          type="time"
          value={timeFrom}
          onChange={e => setTimeFrom(e.target.value)}
          className={`w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md outline-none ${accent.input}`}
        />
      </div>
      <div className="pt-4 text-gray-400 text-xs">→</div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">To</p>
        <input
          type="time"
          value={timeTo}
          onChange={e => setTimeTo(e.target.value)}
          className={`w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md outline-none ${accent.input}`}
        />
      </div>
    </div>
  );
}

// ─── RRule Preview chip ────────────────────────────────────────────────────────
export function RRuleChip({ rrule, accent }: { rrule: string; accent: Accent }) {
  return (
    <div className="bg-gray-50 rounded-md px-3 py-2">
      <p className="text-xs text-gray-400 mb-0.5">RRULE</p>
      <code className={`text-xs break-all ${accent.tabText}`}>{rrule}</code>
    </div>
  );
}

// ─── Section divider label ─────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{children}</p>
  );
}