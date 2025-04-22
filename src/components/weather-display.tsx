"use client"; 

import { useEffect, useState } from "react";
import { getCurrentWeather } from "@/lib/weather";
import { Sun, Loader2, CloudOff } from "lucide-react";
import type { WeatherData } from "@/lib/weather";

export default function WeatherDisplay() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchWeather = async () => {
      try {
        const data = await getCurrentWeather();
        if (mounted) {
          setWeather(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch weather');
          // Don't retry if location was denied
          if (!(err instanceof Error) || !err.message.includes('denied')) {
            setTimeout(fetchWeather, 5000);
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchWeather();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <Loader2 className="h-5 w-5 animate-spin text-white" />;
  }

  if (error || !weather) {
    return (
      <div className="flex items-center text-white gap-2">
        <CloudOff className="h-5 w-5 opacity-50" />
        {error && <span className="text-xs">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center text-white">
      <Sun className="mr-1 h-5 w-5" />
      <span>{Math.round(weather.current.temp_c)}°C</span>
    </div>
  );
}
