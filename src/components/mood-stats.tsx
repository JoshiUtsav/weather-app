"use client";

import { useState, useEffect } from "react";
import { getAllMoodEntries } from "@/lib/mood-storage";

interface MoodCount {
  mood: string;
  count: number;
}

export default function MoodStats() {
  const [moodCounts, setMoodCounts] = useState<MoodCount[]>([]);

  useEffect(() => {
    const loadMoodStats = async () => {
      const entries = await getAllMoodEntries();

      // Count moods
      const counts: Record<string, number> = {};
      entries.forEach((entry) => {
        counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      });

      // Convert to array and sort
      const moodStats = Object.entries(counts)
        .map(([mood, count]) => ({
          mood,
          count,
        }))
        .sort((a, b) => b.count - a.count);

      setMoodCounts(moodStats);
    };

    loadMoodStats();
  }, []);

  return (
    <div className="space-y-4">
      {moodCounts.map(({ mood, count }) => (
        <div key={mood} className="flex items-center gap-2">
          <div className="w-24 font-medium capitalize">{mood}</div>
          <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 dark:bg-orange-500 transition-all"
              style={{
                width: `${
                  (count / Math.max(...moodCounts.map((m) => m.count))) * 100
                }%`,
              }}
            />
          </div>
          <div className="w-12 text-right text-sm text-gray-600 dark:text-gray-400">
            {count}
          </div>
        </div>
      ))}
    </div>
  );
}
