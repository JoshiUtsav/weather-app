import { Suspense } from "react";
import WeatherDisplay from "@/components/weather-display";
import UiLayout from "@/components/ui-layout";
import MoodStats from "@/components/mood-stats";

export default function StatsPage() {
  return (
    <UiLayout
      title="MoodMate"
      weatherDisplay={
        <Suspense
          fallback={
            <div className="h-6 w-16 bg-white/20 rounded animate-pulse" />
          }
        >
          <WeatherDisplay />
        </Suspense>
      }
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">Mood Statistics</h2>

        <Suspense
          fallback={
            <div className="h-80 bg-white/20 dark:bg-gray-700/20 rounded animate-pulse" />
          }
        >
          <MoodStats />
        </Suspense>
      </div>
    </UiLayout>
  );
}
