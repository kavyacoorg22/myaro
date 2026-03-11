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
  RED_ACCENT,
  Radio,
  WeeklySection,
  MonthlySection,
  EndCondition,
  RRuleChip,
  SectionLabel,
} from '../schedule/recurringShared';
import type { IAddRecursionScheduleRequest } from '../../../../types/api/beautician';
import { BeauticianApi } from '../../../../services/api/beautician';
import { toast } from 'react-toastify';
import { handleApiError } from '../../../../lib/utils/handleApiError';

interface RecurringLeaveModalProps {
  isOpen:       boolean;
  onClose:      () => void;
  beauticianId?: string;
  onSave?:      (payload: RecurringSavePayload) => Promise<void>;
}

export const RecurringLeaveModal: React.FC<RecurringLeaveModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [cfg, setCfg] = useState<RecurringConfig>({
    ...DEFAULT_CONFIG,
  });
  const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

  const rrule = buildRRule(cfg);

const handleSave = async () => {
  setIsLoading(true);
  try {
    const payload = buildPayload(cfg, 'leave');

    const requestData: IAddRecursionScheduleRequest = {
      rrule:     payload.rrule,
      type:      'leave',
      startDate: new Date(payload.startDate),
      endType:   payload.endType,
      endDate:   payload.endDate ? new Date(payload.endDate) : undefined,
      endCount:  payload.endCount,
    };

    const res = await BeauticianApi.addRecurringSchedule(requestData);
    toast.success(res.data.message);
    console.log('✅ Recurring leave saved:', requestData);
    if (onSave) await onSave(payload);
    onClose();
  } catch (err: any) {
    console.error('❌ Error saving recurring leave:', err);
      

    handleApiError(err);

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
            <h3 className="text-base font-semibold text-gray-900">Recurring Leave</h3>
            <p className="text-xs text-gray-500 mt-0.5">Set repeating days off</p>
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
              <Radio checked={cfg.freq === 'weekly'}  onChange={() => setCfg(p => ({ ...p, freq: 'weekly'  }))} label="Weekly"  accent={RED_ACCENT} />
              <Radio checked={cfg.freq === 'monthly'} onChange={() => setCfg(p => ({ ...p, freq: 'monthly' }))} label="Monthly" accent={RED_ACCENT} />
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* ── Dynamic section ── */}
          {cfg.freq === 'weekly'  && <WeeklySection  cfg={cfg} setCfg={setCfg} accent={RED_ACCENT} />}
          {cfg.freq === 'monthly' && <MonthlySection cfg={cfg} setCfg={setCfg} accent={RED_ACCENT} />}

          <div className="h-px bg-gray-100" />

          {/* ── Start date ── */}
          <div className="space-y-1.5">
            <SectionLabel>Starts on</SectionLabel>
            <input
              type="date"
              value={cfg.startDate}
              onChange={e => setCfg(p => ({ ...p, startDate: e.target.value }))}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md outline-none focus:border-red-400"
            />
          </div>

          {/* ── End condition ── */}
          <div className="space-y-1.5">
            <SectionLabel>Ends</SectionLabel>
            <EndCondition
              endType={cfg.endType}    setEndType={v => setCfg(p => ({ ...p, endType: v }))}
              endDate={cfg.endDate}    setEndDate={v => setCfg(p => ({ ...p, endDate: v }))}
              endCount={cfg.endCount}  setEndCount={v => setCfg(p => ({ ...p, endCount: v }))}
              accent={RED_ACCENT}
            />
          </div>

          <div className="h-px bg-gray-100" />

          {/* ── RRule preview ── */}
          <RRuleChip rrule={rrule} accent={RED_ACCENT} />

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
            className="flex-[2] py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Recurring Leave'}
          </button>
        </div>

      </div>
    </div>
  );
};