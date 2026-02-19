import { useState, useEffect } from "react";
import type { AvailabilityModalProps ,Slot, TimeSlot } from "../../types/schedule";
import { Plus, Trash2, X } from "lucide-react";
import { AddTimeSlotModal } from "./addTimeSlot";
import type { IAddAvailabilityRequest } from "../../../types/api/beautician";
import { BeauticianApi } from "../../../services/api/beautician";
import { publicAPi } from "../../../services/api/public";
import { convertSlotsToTimeSlots } from "../../../lib/utils/dateUtil";

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  onClose,
  selectedDates,
  viewMode,
  existingSlots = [],
  onSave,
  beauticianId
}) => {
  const isEditable = viewMode === 'own-beautician';
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [currentScheduleId, setCurrentScheduleId] = useState<string>('');

  // Fetch availability when modal opens
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!isOpen || selectedDates.length === 0) {
        setTimeSlots([]);
        return;
      }

      setIsFetchingSlots(true);
      try {
        let response;
        
        if (isEditable) {
          response = await BeauticianApi.getAvailbilitySchedule(selectedDates[0]);
        } else if (beauticianId) {
          response = await publicAPi.getAvailbilitySchedule(beauticianId, selectedDates[0]);
        }
        
        if (response?.data?.data?.availability) {
          const { scheduleId, slots } = response.data.data.availability;
          setCurrentScheduleId(scheduleId);
          
          const timeSlots = convertSlotsToTimeSlots(slots, scheduleId);
          setTimeSlots(timeSlots);
          
          console.log('✅ Fetched availability:', timeSlots);
        } else {
          setTimeSlots([]);
          setCurrentScheduleId('');
        }
      } catch (error) {
        console.error('❌ Error fetching availability:', error);
        setTimeSlots([]);
        setCurrentScheduleId('');
      } finally {
        setIsFetchingSlots(false);
      }
    };

    fetchAvailability();
  }, [isOpen, selectedDates, isEditable, beauticianId]);

  const handleAddSlot = (slot: TimeSlot) => {
    if (editingSlot) {
      setTimeSlots(timeSlots.map(s => s.scheduleId=== slot.scheduleId ? slot : s));
      setEditingSlot(null);
    } else {
      setTimeSlots([...timeSlots, slot]);
    }
  };

  const handleDeleteSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.scheduleId !== id));
  };

  const handleDone = async () => {
    if (onSave && timeSlots.length > 0 && isEditable) {
      setIsLoading(true);
      
      // Format slots according to IAddAvailabilityRequest
      const formattedSlots: Slot[] = timeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }));

      // Create the request payload
      const requestData: IAddAvailabilityRequest = {
        dates: selectedDates,
        slots: formattedSlots
      };

      try {
        await onSave(requestData);
        onClose();
      } catch (error) {
        console.error('Error saving availability:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Display formatted date
  const displayDate = selectedDates.length === 1 
    ? new Date(selectedDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : `${selectedDates.length} dates selected`;

  // VIEW MODE - Other beautician viewing availability
  if (!isEditable) {
    return (
      <div className="fixed inset-0 flex items-center justify-end z-[60] pointer-events-none">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mr-4 pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{displayDate}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium mb-3">Available</p>
            {isFetchingSlots ? (
              <p className="text-sm text-gray-500 py-4 text-center">Loading availability...</p>
            ) : timeSlots.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No availability</p>
            ) : (
              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.scheduleId}
                    className="bg-green-100 text-green-900 px-4 py-3 rounded-lg text-sm font-medium"
                  >
                    {slot.startTime} to {slot.endTime}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // EDIT MODE - Own beautician managing availability
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-end z-[60] pointer-events-none">
        <div className="bg-white rounded-lg shadow-xl p-5 max-w-sm w-full mr-4 pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Availability</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Initial state - No slots */}
          {timeSlots.length === 0 ? (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Custom time</p>
                <button
                  onClick={() => setIsAddSlotOpen(true)}
                  className="text-sm text-teal-500 hover:text-teal-600 font-medium"
                >
                  + Custom time
                </button>
              </div>
            </div>
          ) : (
            /* After slots added - Show schedule */
            <div className="mb-4">
              <div className="mb-3">
                <p className="text-base font-semibold mb-3">Schedule {displayDate}</p>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.scheduleId}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2.5 rounded-md"
                    >
                      <span className="text-sm font-medium">
                        {slot.startTime} to {slot.endTime}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteSlot(slot.scheduleId)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsAddSlotOpen(true)}
                className="w-full py-2.5 bg-teal-100 text-teal-600 rounded-md hover:bg-teal-200 transition font-medium text-sm flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
                Add new time Slot
              </button>
            </div>
          )}

          <button
            onClick={handleDone}
            disabled={isLoading}
            className="w-full py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Done'}
          </button>
        </div>
      </div>

      {/* Add/Edit Time Slot Modal - You need to create this component */}
      <AddTimeSlotModal
        isOpen={isAddSlotOpen}
        onClose={() => {
          setIsAddSlotOpen(false);
          setEditingSlot(null);
        }}
        onAdd={handleAddSlot}
        editingSlot={editingSlot}
      />
    </>
  );
};