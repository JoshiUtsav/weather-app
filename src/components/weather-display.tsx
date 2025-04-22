"use client";

import { useEffect, useState } from "react";
import { Sun, Cloud, CloudRain, Loader2, CloudOff } from "lucide-react";

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
    wind_dir: string;
    feelslike_c: number;
  };
}

export default function WeatherDisplay() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchWeather = async () => {
      try {
        setLoading(true);

        // Get user's location
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              maximumAge: 60000,
            });
          }
        );

        const { latitude, longitude } = position.coords;

        // Fetch weather data with coordinates
        const response = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (mounted) {
          setWeather(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch weather";
          setError(errorMessage);

          // Don't retry if location was denied
          if (!(err instanceof Error) || !errorMessage.includes("denied")) {
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

    return () => {
      mounted = false;
    };
  }, []);

  // Weather icon based on condition code
  const getWeatherIcon = () => {
    if (!weather) return <Sun className="h-5 w-5" />;

    const code = weather.current.condition.code;

    // Simple icon selection based on condition codes
    if (code >= 1000 && code <= 1003) {
      return <Sun className="h-5 w-5" />;
    } else if (code >= 1004 && code <= 1030) {
      return <Cloud className="h-5 w-5" />;
    } else {
      return <CloudRain className="h-5 w-5" />;
    }
  };

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
    <div className="flex items-center text-white gap-2">
      {getWeatherIcon()}
      <span>{Math.round(weather.current.temp_c)}°C</span>
      <span className="text-xs opacity-75">{weather.location.name}</span>
    </div>
  );
}
