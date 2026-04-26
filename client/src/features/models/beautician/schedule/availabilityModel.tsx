import { useState, useEffect } from "react";
import { Plus, Trash2, X, CalendarOff, Check } from "lucide-react";
import type { AvailabilityModalProps, Slot, TimeSlot } from "../../../types/schedule";
import { BeauticianApi } from "../../../../services/api/beautician";
import { publicAPi } from "../../../../services/api/public";
import { convertSlotsToTimeSlots } from "../../../../lib/utils/dateUtil";
import type { IAddAvailabilityRequest } from "../../../../types/api/beautician";
import { AddTimeSlotModal } from "../../../beautician/component/addTimeSlot";
import type { ScheduleTypeValue } from "../../../../constants/types/beautician";

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  onClose,
  selectedDates,
  viewMode,
  existingSlots = [],
  onSave,
  beauticianId,
}) => {
  const isEditable = viewMode === "own-beautician";

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ScheduleTypeValue>("availability");

  // ── Shared state ───────────────────────────────────────────────────────────
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [currentScheduleId, setCurrentScheduleId] = useState<string>("");

  // ── Source — needed to know which delete endpoint to call ─────────────────
  const [scheduleSource, setScheduleSource] = useState<"recurring" | "manual">("manual");

  // ── Whether the fetched data is leave (not user-switched tab) ─────────────
  const [isFetchedLeave, setIsFetchedLeave] = useState(false);

  // ── View mode fetched type ─────────────────────────────────────────────────
  const [viewFetchedType, setViewFetchedType] = useState<"availability" | "leave" | "none">("none");

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("availability");
      setIsFetchedLeave(false);
      setScheduleSource("manual");
      setViewFetchedType("none");
    }
  }, [isOpen]);

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
          const { scheduleId, slots, type, source } = response.data.data.availability;

          setCurrentScheduleId(scheduleId);
          setScheduleSource(source === 'recurring' ? 'recurring' : 'manual');

          if (type === 'leave') {
            setIsFetchedLeave(true);
            setActiveTab('leave');
            setTimeSlots([]);
            setViewFetchedType("leave");
          } else {
            setIsFetchedLeave(false);
            const converted = convertSlotsToTimeSlots(slots, scheduleId);
            setTimeSlots(converted);
            setViewFetchedType("availability");
          }
        } else {
          setTimeSlots([]);
          setCurrentScheduleId('');
          setIsFetchedLeave(false);
          setViewFetchedType("none");
        }
      } catch (error) {
        console.error('❌ Error fetching:', error);
        setTimeSlots([]);
        setCurrentScheduleId('');
        setIsFetchedLeave(false);
        setViewFetchedType("none");
      } finally {
        setIsFetchingSlots(false);
      }
    };

    fetchAvailability();
  }, [isOpen, selectedDates, isEditable, beauticianId]); // ← removed activeTab dependency

  // Clear slots when user manually switches tabs (edit mode only)
  useEffect(() => {
    if (!isFetchedLeave && isEditable) {
      setTimeSlots([]);
      setCurrentScheduleId("");
    }
  }, [activeTab]);

  const handleAddSlot = (slot: TimeSlot) => {
    if (editingSlot) {
      setTimeSlots(timeSlots.map((s) => (s.scheduleId === slot.scheduleId ? slot : s)));
      setEditingSlot(null);
    } else {
      setTimeSlots([...timeSlots, slot]);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.scheduleId !== id));

    try {
      if (scheduleSource === "recurring") {
        await BeauticianApi.deleteRecurringSchedule(currentScheduleId, {
          date: new Date(selectedDates[0]),
        });
      } else {
        const slot = timeSlots.find((s) => s.scheduleId === id);
        if (slot) {
          await BeauticianApi.deleteAvailabilitySlot(
            { startTime: slot.startTime, endTime: slot.endTime },
            currentScheduleId,
          );
        }
      }
    } catch (error) {
      console.error("❌ Error deleting slot:", error);
    }
  };

  const handleDone = async () => {
    if (onSave && isEditable) {
      setIsLoading(true);

      if (activeTab === "leave") {
        try {
          await onSave({ dates: selectedDates, slots: [], type: "leave" });
          onClose();
        } catch (error) {
          console.error("Error saving leave:", error);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      if (timeSlots.length === 0) {
        setIsLoading(false);
        onClose();
        return;
      }

      const formattedSlots: Slot[] = timeSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

      const requestData: IAddAvailabilityRequest = {
        dates: selectedDates,
        slots: formattedSlots,
        type: activeTab,
      };

      try {
        await onSave(requestData);
        onClose();
      } catch (error) {
        console.error("Error saving:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  const displayDate =
    selectedDates.length === 1
      ? new Date(selectedDates[0]).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : `${selectedDates.length} dates selected`;

  // ─────────────────────────────────────────────────────────────────────────
  // VIEW MODE — only changed section
  // ─────────────────────────────────────────────────────────────────────────
  if (!isEditable) {
    return (
      <div className="fixed inset-0 flex items-center justify-end z-[60] pointer-events-none">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mr-4 pointer-events-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{displayDate}</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            {isFetchingSlots ? (
              <p className="text-sm text-gray-500 py-4 text-center">Loading availability...</p>
            ) : viewFetchedType === "leave" ? (
              // ── On Leave ──────────────────────────────────────────────────
              <div className="flex flex-col items-center py-6 gap-2">
                <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
                  <CalendarOff className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-sm font-semibold text-red-600">On Leave</p>
                <p className="text-xs text-red-400">Not available on this day</p>
              </div>
            ) : viewFetchedType === "none" ? (
              // ── No availability set ───────────────────────────────────────
              <p className="text-sm text-gray-500 py-4 text-center">No availability set</p>
            ) : (
              // ── Show time slots ───────────────────────────────────────────
              <>
                <p className="text-sm font-medium mb-3">Available</p>
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
              </>
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

  // ─────────────────────────────────────────────────────────────────────────
  // EDIT MODE — unchanged
  // ─────────────────────────────────────────────────────────────────────────
  const isLeave = activeTab === "leave";

  const accent = {
    addLink: isLeave ? "text-red-500 hover:text-red-600" : "text-teal-500 hover:text-teal-600",
    slotBg: isLeave ? "bg-red-50" : "bg-gray-50",
    addBtn: isLeave ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-teal-100 text-teal-600 hover:bg-teal-200",
    doneBtn: isLeave ? "bg-red-500 hover:bg-red-600" : "bg-black hover:bg-gray-800",
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-end z-[60] pointer-events-none">
        <div className="bg-white rounded-lg shadow-xl p-5 max-w-sm w-full mr-4 pointer-events-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{displayDate}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-4">
            <button
              onClick={() => { setActiveTab("availability"); setIsFetchedLeave(false); }}
              disabled={isFetchedLeave}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
                activeTab === "availability"
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Availability
            </button>
            <button
              onClick={() => { setActiveTab("leave"); setIsFetchedLeave(false); }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
                activeTab === "leave"
                  ? "bg-white text-red-500 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Leave
            </button>
          </div>

          {/* ── LEAVE TAB ── */}
          {isLeave ? (
            <div className="mb-4">
              {isFetchedLeave && currentScheduleId ? (
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5 flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
                    <CalendarOff className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-sm font-semibold text-red-700">On Leave</p>
                  <p className="text-xs text-red-400">
                    {scheduleSource === "recurring" ? "Recurring leave" : "Manual leave"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50 p-5 flex flex-col items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center">
                      <CalendarOff className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-red-700">Full Day Leave</p>
                      <p className="text-xs text-red-400 mt-0.5">No appointments on selected dates</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {selectedDates.map((d) => (
                      <div key={d} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-red-50">
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-sm text-red-700 font-medium">
                          {new Date(d).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            isFetchingSlots ? (
              <p className="text-sm text-gray-500 py-4 text-center mb-4">Loading...</p>
            ) : timeSlots.length === 0 ? (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-600">Custom time</p>
                  <button
                    onClick={() => setIsAddSlotOpen(true)}
                    className={`text-sm font-medium ${accent.addLink}`}
                  >
                    + Custom time
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-base font-semibold mb-3">Schedule — {displayDate}</p>
                <div className="space-y-2 mb-3">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.scheduleId}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-md ${accent.slotBg}`}
                    >
                      <span className="text-sm font-medium">
                        {slot.startTime} to {slot.endTime}
                      </span>
                      <button
                        onClick={() => handleDeleteSlot(slot.scheduleId)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setIsAddSlotOpen(true)}
                  className={`w-full py-2.5 rounded-md transition font-medium text-sm flex items-center justify-center gap-2 ${accent.addBtn}`}
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4" />
                  Add new time slot
                </button>
              </div>
            )
          )}

          {!(isFetchedLeave && currentScheduleId) && (
            <button
              onClick={handleDone}
              disabled={isLoading || (!isLeave && timeSlots.length === 0)}
              className={`w-full py-2.5 text-white rounded-md transition font-medium disabled:opacity-50 disabled:cursor-not-allowed ${accent.doneBtn}`}
            >
              {isLoading ? "Saving..." : isLeave ? "Mark as Leave" : "Done"}
            </button>
          )}

        </div>
      </div>

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