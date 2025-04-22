"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { getAllMoodEntries, type MoodEntry } from "@/lib/mood-storage";
import { Card } from "@/components/ui/card";

export default function MoodNotesList() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      const allEntries = await getAllMoodEntries();
      setEntries(
        allEntries.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    };

    loadEntries();
  }, []);

  const getMoodEmoji = (mood: string) => {
    const emojiMap: Record<string, string> = {
      happy: "😊",
      neutral: "😐",
      sad: "😔",
      angry: "😡",
      sick: "😷",
    };

    return emojiMap[mood] || "😐";
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No mood entries yet. Start by adding your first mood!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {entries.map((entry) => (
        <Card
          key={entry.id}
          className="p-4 bg-white/90 dark:bg-gray-700/90 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
            <div className="flex-1">
              <p className="text-gray-800 dark:text-gray-200">{entry.note}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(entry.date), "MMMM d, yyyy")}
                </p>
                {entry.weather && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-1">{entry.weather.temp}°C</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
