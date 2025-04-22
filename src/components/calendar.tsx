"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { getMoodEntriesByDate } from "@/lib/mood-storage";

type MoodEntryDate = {
  date: Date;
  mood: string;
};

export default function Calendar() {
  const [moodDates, setMoodDates] = useState<MoodEntryDate[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    const loadMoodDates = async () => {
      const entries = await getMoodEntriesByDate();
      setMoodDates(
        entries.map((entry) => ({
          date: new Date(entry.date),
          mood: entry.mood,
        }))
      );
    };

    loadMoodDates();
  }, []);

  // Function to determine the CSS class for each day based on mood
  const getDayClass = (date: Date) => {
    const entry = moodDates.find(
      (d) => d.date.toDateString() === date.toDateString()
    );

    if (!entry) return "";

    const moodColors: Record<string, string> = {
      happy: "bg-green-400",
      neutral: "bg-yellow-400",
      sad: "bg-blue-400",
      angry: "bg-red-400",
      sick: "bg-gray-400",
    };

    return moodColors[entry.mood] || "";
  };

  return (
    <div className="calendar-container h-full">
      <CalendarUI
        mode="single"
        className="rounded-md border h-full"
        modifiers={{
          booked: moodDates.map((d) => d.date),
        }}
        modifiersClassNames={{
          booked: "font-bold",
        }}
        onMonthChange={setCurrentMonth}
        components={{
          DayContent: ({ date }: { date: Date }) => {
            const moodClass = getDayClass(date);
            return (
              <div className="relative w-full h-full flex items-center justify-center">
                <span>{date.getDate()}</span>
                {moodClass && (
                  <div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full ${moodClass}`}
                  />
                )}
              </div>
            );
          },
        }}
      />
    </div>
  );
}
