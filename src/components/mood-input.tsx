"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveMoodEntry } from "@/lib/mood-storage";
import Calendar from "@/components/calendar";

const moods = [
  { emoji: "😊", name: "happy" },
  { emoji: "😐", name: "neutral" },
  { emoji: "😔", name: "sad" },
  { emoji: "😡", name: "angry" },
  { emoji: "😷", name: "sick" },
];

export default function MoodInput() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const currentDate = new Date();
  const router = useRouter();

  const handleSave = async () => {
    if (!selectedMood) return;

    try {
      // Get location for weather data
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      await saveMoodEntry({
        date: currentDate,
        mood: selectedMood,
        note,
        location: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
      });

      router.push("/notes");
    } catch (error) {
      console.error("Failed to save mood entry:", error);
      await saveMoodEntry({
        date: currentDate,
        mood: selectedMood,
        note,
      });
      router.push("/notes");
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="text-xl font-medium">
            {format(currentDate, "MMMM d, yyyy")}
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">
              How are you feeling today?
            </h2>
            <div className="flex justify-between mb-6">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`text-3xl p-2 rounded-full transition-transform ${
                    selectedMood === mood.name
                      ? "bg-orange-100 scale-125 shadow-md"
                      : "hover:scale-110"
                  }`}
                  aria-label={`Select ${mood.name} mood`}
                >
                  {mood.emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Textarea
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none h-24 bg-white/50"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-orange-400 hover:bg-orange-500 text-white"
            disabled={!selectedMood}
          >
            Save
          </Button>
        </div>

        <div className="hidden md:block">
          <h3 className="text-lg font-medium mb-4">
            {format(currentDate, "MMMM")}
          </h3>
          <div className="h-[300px] overflow-hidden">
            {" "}
            {/* Fixed height container */}
            <Calendar />
          </div>
        </div>
      </div>
    </Card>
  );
}
