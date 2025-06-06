import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TimeSlot } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CalendarProps {
  timeSlots: TimeSlot[];
  onSelectSlot: (slot: TimeSlot) => void;
}

export function Calendar({ timeSlots, onSelectSlot }: CalendarProps) {
  const { t, language } = useLanguage();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: language === 'ar' ? 'long' : 'short',
      day: 'numeric',
      month: 'short',
    }).format(date);
  };

  const dates = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, -7))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-semibold">
          {new Intl.DateTimeFormat(
            language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR',
            { month: 'long', year: 'numeric' }
          ).format(selectedDate)}
        </h3>
        <button
          onClick={() => setSelectedDate(addDays(selectedDate, 7))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-4">
        {dates.map((date) => (
          <div key={date.toISOString()} className="text-center">
            <div className="text-sm font-medium mb-2">{formatDate(date)}</div>
            <div className="space-y-2">
              {timeSlots
                .filter((slot) => new Date(slot.startTime).toDateString() === date.toDateString())
                .map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => onSelectSlot(slot)}
                    disabled={slot.isBooked}
                    className={`w-full py-2 text-sm rounded ${
                      slot.isBooked
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    {new Date(slot.startTime).toLocaleTimeString(
                      language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR',
                      {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}