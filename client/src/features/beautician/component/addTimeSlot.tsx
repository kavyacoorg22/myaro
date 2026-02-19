import { useState } from "react";
import type { TimeSlot } from "../../types/schedule";
import { TimeInput } from "./calenderTime";
import { X } from "lucide-react";

interface AddTimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (slot: TimeSlot) => void;
  editingSlot?: TimeSlot | null;
}

export const AddTimeSlotModal: React.FC<AddTimeSlotModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  editingSlot
}) => {
  const [startTime, setStartTime] = useState(editingSlot?.startTime || "09:00");
  const [endTime, setEndTime] = useState(editingSlot?.endTime || "10:00");

  const handleAdd = () => {
    if (startTime && endTime) {
      onAdd({
        scheduleId: editingSlot?.scheduleId || Date.now().toString(),
        startTime,
        endTime
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-emerald-100 rounded-lg shadow-xl p-5 max-w-xs w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add time Slot</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Time slot</label>
          <div className="flex items-center gap-3">
            <TimeInput value={startTime} onChange={setStartTime} />
            <span className="text-sm text-gray-600">to</span>
            <TimeInput value={endTime} onChange={setEndTime} />
            <button
              onClick={onClose}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2.5 bg-teal-400 text-white rounded-md hover:bg-teal-500 transition font-medium"
        >
          Add
        </button>
      </div>
    </div>
  );
};