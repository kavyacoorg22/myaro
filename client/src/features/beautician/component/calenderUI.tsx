import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useState } from "react";
import type { CalendarModalProps } from "../../types/schedule";
import { useCalendarLogic } from "../pages/calender";
import { formatDateDisplay, formatDatesForAPI } from "../../../lib/utils/dateUtil";
import { AvailabilityModal } from "../../models/beautician/schedule/availabilityModel";
import { RecurringModal } from "../../models/beautician/schedule/recurringModal";
import { RecurringLeaveModal } from "../../models/beautician/schedule/leaveModal";

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  viewMode,
  profileName,
  profileUsername,
  profileImage,
  initialDate,
  initialSelectedDates,
  onDateSelect,
  onConfirm,
  existingSlots,
  onSaveSlots,
  onDeleteSlot,
  beauticianId
}) => {
  const isEditable = viewMode === 'own-beautician';
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isRecurringAvailOpen, setIsRecurringAvailOpen] = useState(false);
  const [isRecurringLeaveOpen, setIsRecurringLeaveOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'single' | 'multiple' | 'recurring'>('single');

  // ✅ pass beauticianId so hook knows which API to call
  const calendar = useCalendarLogic(initialDate, initialSelectedDates, isEditable, beauticianId);

  const handleDateClick = (date: number) => {
    calendar.handleDateClick(date);
    onDateSelect?.(calendar.selectedDates,calendar.currentDate);
    if (!isEditable) setIsAvailabilityOpen(true);
  };

  const handleConfirm = () => {
    if (isEditable && onConfirm) {
      const mode = activeMode === 'recurring' ? 'single' : activeMode;
      onConfirm(calendar.selectedDates, mode);
    }
    onClose();
  };

  const handleOpenAvailability = () => {
    if (calendar.selectedDates.length > 0) setIsAvailabilityOpen(true);
  };

  const handleCloseAvailability = () => {
    setIsAvailabilityOpen(false);
    calendar.clearSelection();
    calendar.fetchMonthData(); // ✅ refresh colors after save/delete
    onDateSelect?.([]);
  };

  const handleOpenRecurring = (type: 'availability' | 'leave') => {
    setActiveMode('single');
    if (type === 'availability') setIsRecurringAvailOpen(true);
    else setIsRecurringLeaveOpen(true);
  };

  const handleCloseRecurring = () => {
    setIsRecurringAvailOpen(false);
    setIsRecurringLeaveOpen(false);
    calendar.fetchMonthData(); // ✅ refresh colors after recurring save
  };

  const getFormattedDates = (): string[] =>
    formatDatesForAPI(
      calendar.selectedDates,
      calendar.currentDate.getFullYear(),
      calendar.currentDate.getMonth()
    );

  const getDisplayDate = (): string => {
    if (calendar.selectedDates.length === 0) return '';
    if (calendar.selectedDates.length === 1)
      return formatDateDisplay(
        calendar.selectedDates[0],
        calendar.monthNames[calendar.currentDate.getMonth()]
      );
    return `${calendar.selectedDates.length} dates`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-5 max-w-sm w-full mx-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Availability</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-teal-200 overflow-hidden flex-shrink-0">
              {profileImage ? (
                <img src={profileImage} alt={profileName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium text-sm">
                  {profileName?.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold truncate">{profileName}</h2>
              <p className="text-sm text-gray-600 truncate">{profileUsername}</p>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={calendar.handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-base font-medium">
              {calendar.monthNames[calendar.currentDate.getMonth()]} {calendar.currentDate.getFullYear()}
            </h3>
            <button onClick={calendar.handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="mb-2">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {calendar.dayNames.map(day => (
                <div key={day} className="text-center text-xs text-gray-500 font-medium">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendar.days.map((day, index) => {
                const status = day.isCurrentMonth ? calendar.getDateStatus(day.date) : null;
                return (
                  <div key={index} className="aspect-square">
                    {day.isCurrentMonth ? (
                      <button
                        onClick={() => handleDateClick(day.date)}
                        className={`w-full h-full flex flex-col items-center justify-center rounded-md text-sm font-medium transition
                          ${day.isSelected
                            ? 'bg-teal-400 text-white hover:bg-teal-500'
                            : status === 'leave'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : status === 'available'
                                ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                                : 'hover:bg-gray-100 text-gray-900'
                          }`}
                      >
                        {day.date}
                        {/* dot — hidden when selected since bg already shows it */}
                        {!day.isSelected && status && (
                          <span className={`w-1 h-1 rounded-full mt-0.5 ${
                            status === 'leave' ? 'bg-red-400' : 'bg-teal-400'
                          }`} />
                        )}
                      </button>
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" /> Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Leave
            </span>
          </div>

          {/* Controls — edit mode only */}
          {isEditable && (
            <div className="space-y-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => { calendar.handleSelectionModeChange('single'); setActiveMode('single'); }}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-md transition ${
                    activeMode === 'single'
                      ? 'bg-teal-400 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Single day
                </button>
                <button
                  onClick={() => { calendar.handleSelectionModeChange('multiple'); setActiveMode('multiple'); }}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-md transition ${
                    activeMode === 'multiple'
                      ? 'bg-teal-400 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Multiple days
                </button>
                <button
                  onClick={() => {
                    if (activeMode === 'recurring') {
                      setActiveMode('single');
                    } else {
                      setActiveMode('recurring');
                      calendar.clearSelection();
                      onDateSelect?.([]);
                    }
                  }}
                  className={`flex-1 px-2 py-1.5 text-xs rounded-md transition ${
                    activeMode === 'recurring'
                      ? 'bg-gray-700 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Recurring
                </button>
                {activeMode !== 'recurring' && (
                  <button
                    onClick={handleOpenAvailability}
                    disabled={calendar.selectedDates.length === 0}
                    className={`p-1.5 rounded-md transition ${
                      calendar.selectedDates.length > 0
                        ? 'bg-teal-400 text-white hover:bg-teal-500'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                    title="Add availability slots"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {activeMode === 'recurring' && (
                <div className="flex gap-1.5 p-2 bg-gray-50 rounded-md border border-gray-200">
                  <span className="text-xs text-gray-500 self-center mr-1">Add:</span>
                  <button
                    onClick={() => handleOpenRecurring('availability')}
                    className="flex-1 py-1.5 text-xs font-medium rounded-md bg-teal-500 text-white hover:bg-teal-600 transition"
                  >
                    Availability
                  </button>
                  <button
                    onClick={() => handleOpenRecurring('leave')}
                    className="flex-1 py-1.5 text-xs font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Leave
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Availability Modal */}
      <AvailabilityModal
        isOpen={isAvailabilityOpen}
        onClose={handleCloseAvailability}
        selectedDates={getFormattedDates()}
        displayDate={getDisplayDate()}
        viewMode={viewMode === 'own-beautician' ? 'own-beautician' : 'view-beautician'}
        existingSlots={existingSlots}
        onSave={onSaveSlots}
        onDeleteSlot={onDeleteSlot}
        beauticianId={beauticianId}
      />

      {/* Recurring Availability Modal */}
      <RecurringModal
        isOpen={isRecurringAvailOpen}
        onClose={handleCloseRecurring} 
        beauticianId={beauticianId}
      />

      {/* Recurring Leave Modal */}
      <RecurringLeaveModal
        isOpen={isRecurringLeaveOpen}
        onClose={handleCloseRecurring} 
        beauticianId={beauticianId}
      />
    </>
  );
};