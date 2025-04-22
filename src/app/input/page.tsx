import { Suspense } from "react";
import MoodInput from "@/components/mood-input";
import WeatherDisplay from "@/components/weather-display";
import UiLayout from "@/components/ui-layout";

export default function InputPage() {
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
      <MoodInput />
    </UiLayout>
  );
}
