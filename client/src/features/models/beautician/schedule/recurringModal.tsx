import { useState } from 'react';
import { X } from 'lucide-react';
import {
  buildPayload,
  buildRRule,
  DEFAULT_CONFIG,
  type RecurringConfig,
  type RecurringSavePayload,
} from '../../../../lib/utils/recurringUtil';
import {
  TEAL_ACCENT,
  Radio,
  WeeklySection,
  MonthlySection,
  TimeRange,
  EndCondition,
  RRuleChip,
  SectionLabel,
} from '../schedule/recurringShared';
import { BeauticianApi } from '../../../../services/api/beautician';
import type { IAddRecursionScheduleRequest } from '../../../../types/api/beautician';
import { handleApiError } from '../../../../lib/utils/handleApiError';

interface RecurringModalProps {
  isOpen:      boolean;
  onClose:     () => void;
  beauticianId?: string;
  onSave?:     (payload: RecurringSavePayload) => Promise<void>;
}

export const RecurringModal: React.FC<RecurringModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [cfg, setCfg] = useState<RecurringConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
  const rrule = buildRRule(cfg);

const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = buildPayload(cfg, 'availability');

      const requestData: IAddRecursionScheduleRequest= {
        rrule:     payload.rrule,
        timeFrom:  payload.timeFrom,
        timeTo:    payload.timeTo,
        type:      'availability',
        startDate: new Date(payload.startDate),
        endType:   payload.endType,
        endDate:   payload.endDate ? new Date(payload.endDate) : undefined,
        endCount:  payload.endCount,
      };

      await BeauticianApi.addRecurringSchedule(requestData);

      console.log('✅ Recurring availability saved:', requestData);

      if (onSave) await onSave(payload);
      onClose();
    } catch (err: any) {
      console.error('❌ Error saving recurring availability:', err);
      handleApiError(err)
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Recurring Availability</h3>
            <p className="text-xs text-gray-500 mt-0.5">Set a repeating schedule</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">

          {/* ── Repeat type ── */}
          <div className="space-y-1.5">
            <SectionLabel>Repeat</SectionLabel>
            <div className="space-y-2 pt-1">
              <Radio checked={cfg.freq === 'weekly'}  onChange={() => setCfg(p => ({ ...p, freq: 'weekly'  }))} label="Weekly"  accent={TEAL_ACCENT} />
              <Radio checked={cfg.freq === 'monthly'} onChange={() => setCfg(p => ({ ...p, freq: 'monthly' }))} label="Monthly" accent={TEAL_ACCENT} />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* ── Dynamic section ── */}
          {cfg.freq === 'weekly'  && <WeeklySection  cfg={cfg} setCfg={setCfg} accent={TEAL_ACCENT} />}
          {cfg.freq === 'monthly' && <MonthlySection cfg={cfg} setCfg={setCfg} accent={TEAL_ACCENT} />}

          <div className="h-px bg-gray-100" />

          {/* ── Time ── */}
          <div className="space-y-1.5">
            <SectionLabel>Time</SectionLabel>
            <TimeRange
              timeFrom={cfg.timeFrom} timeTo={cfg.timeTo}
              setTimeFrom={v => setCfg(p => ({ ...p, timeFrom: v }))}
              setTimeTo={v => setCfg(p => ({ ...p, timeTo: v }))}
              accent={TEAL_ACCENT}
            />
          </div>

          <div className="h-px bg-gray-100" />

          {/* ── Start date ── */}
          <div className="space-y-1.5">
            <SectionLabel>Starts on</SectionLabel>
            <input
              type="date"
              value={cfg.startDate}
              onChange={e => setCfg(p => ({ ...p, startDate: e.target.value }))}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md outline-none focus:border-teal-400"
            />
          </div>

          {/* ── End condition ── */}
          <div className="space-y-1.5">
            <SectionLabel>Ends</SectionLabel>
            <EndCondition
              endType={cfg.endType}    setEndType={v => setCfg(p => ({ ...p, endType: v }))}
              endDate={cfg.endDate}    setEndDate={v => setCfg(p => ({ ...p, endDate: v }))}
              endCount={cfg.endCount}  setEndCount={v => setCfg(p => ({ ...p, endCount: v }))}
              accent={TEAL_ACCENT}
            />
          </div>

          <div className="h-px bg-gray-100" />

          {/* ── RRule preview ── */}
          <RRuleChip rrule={rrule} accent={TEAL_ACCENT} />

        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || (cfg.freq === 'weekly' && cfg.weeklyDays.length === 0)}
            className="flex-2 flex-[2] py-2.5 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Recurring'}
          </button>
        </div>

      </div>
    </div>
  );
};