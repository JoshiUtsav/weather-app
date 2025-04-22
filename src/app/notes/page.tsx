import { Suspense } from "react";
import MoodNotesList from "@/components/mood-notes-list";
import WeatherDisplay from "@/components/weather-display";
import UiLayout from "@/components/ui-layout";
import ExportButtons from "@/components/export-buttons";

export default function NotesPage() {
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Notes</h2>
          <ExportButtons />
        </div>

        <Suspense
          fallback={
            <div className="h-40 bg-white/20 dark:bg-gray-700/20 rounded animate-pulse" />
          }
        >
          <MoodNotesList />
        </Suspense>
      </div>
    </UiLayout>
  );
}
