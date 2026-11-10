"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTodayBogota, formatDateES } from "@/lib/utils";

interface DateCalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function DateCalendar({ selectedDate, onSelect }: DateCalendarProps) {
  const today = useMemo(() => getTodayBogota(), []);
  const [viewDate, setViewDate] = useState(() => {
    const d = selectedDate || today;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isDisabled = (day: number) => {
    const date = new Date(year, month, day);
    return date < today;
  };

  const handleSelect = (day: number) => {
    if (isDisabled(day)) return;
    onSelect(new Date(year, month, day));
  };

  const canGoPrev = () => {
    const prev = new Date(year, month - 1, 1);
    const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return prev >= todayMonth;
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev()}
          className="p-2 rounded-full hover:bg-rose-soft/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-5 h-5 text-rose-deep" />
        </button>
        <h3 className="font-serif text-lg text-rose-wine font-medium">
          {MONTHS[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-rose-soft/50 transition-colors"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="w-5 h-5 text-rose-deep" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-rose-wine/60 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const selected = selectedDate ? isSameDay(date, selectedDate) : false;
          const disabled = isDisabled(day);
          const isToday = isSameDay(date, today);

          return (
            <motion.button
              key={day}
              whileTap={!disabled ? { scale: 0.9 } : undefined}
              onClick={() => handleSelect(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-full flex items-center justify-center text-sm font-medium
                calendar-day
                ${selected ? "selected" : ""}
                ${disabled ? "disabled" : "cursor-pointer"}
                ${isToday && !selected ? "ring-1 ring-rose-powder" : ""}
                ${!selected && !disabled ? "text-rose-wine hover:bg-rose-soft/60" : ""}
              `}
            >
              {day}
            </motion.button>
          );
        })}
      </div>

      {/* Selected date display */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-center"
        >
          <p className="text-sm text-rose-wine/70">Fecha elegida</p>
          <p className="font-serif text-rose-deep text-lg capitalize mt-0.5">
            {formatDateES(selectedDate)}
          </p>
        </motion.div>
      )}
    </div>
  );
}
