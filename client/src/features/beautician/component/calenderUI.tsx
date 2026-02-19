import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useState } from "react";
import type { CalendarModalProps } from "../../types/schedule";
import { useCalendarLogic } from "../pages/calender";
import { AvailabilityModal } from "./availabilityModel";
import { formatDateDisplay, formatDatesForAPI } from "../../../lib/utils/dateUtil";

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

  const calendar = useCalendarLogic(initialDate, initialSelectedDates, isEditable);

  const handleDateClick = (date: number) => {
    calendar.handleDateClick(date);
    
    // Update parent component
    onDateSelect?.(calendar.selectedDates);
    
    if (!isEditable) {
      // In view mode, open availability modal after selecting date
      setIsAvailabilityOpen(true);
    }
  };

  const handleConfirm = () => {
    if (isEditable && onConfirm) {
      onConfirm(calendar.selectedDates, calendar.selectionMode);
    }
    onClose();
  };

  const handleOpenAvailability = () => {
    if (calendar.selectedDates.length > 0) {
      setIsAvailabilityOpen(true);
    }
  };

  // ✅ Handle closing availability modal and clearing selection
  const handleCloseAvailability = () => {
    setIsAvailabilityOpen(false);
    // Clear selected dates after closing availability modal
    calendar.clearSelection();
    onDateSelect?.([]);
  };

  // Get formatted dates for API
  const getFormattedDates = (): string[] => {
    return formatDatesForAPI(
      calendar.selectedDates,
      calendar.currentDate.getFullYear(),
      calendar.currentDate.getMonth()
    );
  };

  // Get display date for availability modal
  const getDisplayDate = (): string => {
    if (calendar.selectedDates.length === 0) return '';
    if (calendar.selectedDates.length === 1) {
      return formatDateDisplay(
        calendar.selectedDates[0],
        calendar.monthNames[calendar.currentDate.getMonth()]
      );
    }
    return `${calendar.selectedDates.length} dates`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-5 max-w-sm w-full mx-4">
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Availability</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Section - Compact */}
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

          {/* Month Navigation - Compact */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={calendar.handlePrevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="text-base font-medium">
              {calendar.monthNames[calendar.currentDate.getMonth()]} {calendar.currentDate.getFullYear()}
            </h3>
            <button
              onClick={calendar.handleNextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-full transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid - Compact */}
          <div className="mb-4">
            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {calendar.dayNames.map((day) => (
                <div key={day} className="text-center text-xs text-gray-500 font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendar.days.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day.isCurrentMonth ? (
                    <button
                      onClick={() => handleDateClick(day.date)}
                      className={`w-full h-full flex items-center justify-center rounded-md text-sm font-medium transition ${
                        day.isSelected
                          ? 'bg-teal-400 text-white hover:bg-teal-500'
                          : 'hover:bg-gray-100 text-gray-900'
                      }`}
                    >
                      {day.date}
                    </button>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Selection Mode Toggle with Add Icon - Only show in edit mode */}
          {isEditable && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => calendar.handleSelectionModeChange('single')}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition ${
                  calendar.selectionMode === 'single'
                    ? 'bg-teal-400 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Single day
              </button>
              <button
                onClick={() => calendar.handleSelectionModeChange('multiple')}
                className={`flex-1 px-3 py-2 text-sm rounded-md transition ${
                  calendar.selectionMode === 'multiple'
                    ? 'bg-teal-400 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Multiple days
              </button>
              <button
                onClick={handleOpenAvailability}
                disabled={calendar.selectedDates.length === 0}
                className={`p-2 rounded-md transition ${
                  calendar.selectedDates.length > 0
                    ? 'bg-teal-400 text-white hover:bg-teal-500'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title="Add availability slots"
              >
                <Plus className="w-5 h-5" />
              </button>
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
    </>
  );
};