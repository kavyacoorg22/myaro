import { useState } from "react";
import type { CalendarDay } from "../../types/schedule";

export const useCalendarLogic = (
  initialDate: Date = new Date(),
  initialSelectedDates: number[] = [],
  isEditable: boolean = true
) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDates, setSelectedDates] = useState<Set<number>>(
    new Set(initialSelectedDates)
  );
  const [selectionMode, setSelectionMode] = useState<'single' | 'multiple'|'recurring'>('single');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days: CalendarDay[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: 0, isCurrentMonth: false, isSelected: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        isCurrentMonth: true,
        isSelected: selectedDates.has(i)
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: number) => {
    // In view mode, only allow single date selection
    if (!isEditable) {
      setSelectedDates(new Set([date]));
      return;
    }
    
    // In edit mode, respect selection mode
    if (selectionMode === 'single') {
      setSelectedDates(new Set([date]));
    } else {
      const newSelected = new Set(selectedDates);
      if (newSelected.has(date)) {
        newSelected.delete(date);
      } else {
        newSelected.add(date);
      }
      setSelectedDates(newSelected);
    }
  };

  const handleSelectionModeChange = (mode: 'single' | 'multiple') => {
    setSelectionMode(mode);
    if (mode === 'single' && selectedDates.size > 1) {
      const firstDate = Array.from(selectedDates)[0];
      setSelectedDates(new Set([firstDate]));
    }
  };

  const getSelectedDatesArray = (): number[] => {
    return Array.from(selectedDates).sort((a, b) => a - b);
  };

  const clearSelection = () => {
    setSelectedDates(new Set());
  };

  return {
    currentDate,
    selectedDates: getSelectedDatesArray(),
    selectionMode,
    monthNames,
    dayNames,
    days: getDaysInMonth(currentDate),
    handlePrevMonth,
    handleNextMonth,
    handleDateClick,
    handleSelectionModeChange,
    clearSelection,
    setCurrentDate,
    setSelectedDates: (dates: number[]) => setSelectedDates(new Set(dates))
  };
};