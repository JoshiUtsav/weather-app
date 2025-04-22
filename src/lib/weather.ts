// Weather API integration using WeatherAPI.com
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "demo";
const BASE_URL = "http://api.weatherapi.com/v1";

// @typescript-eslint/no-unused-vars
const DEFAULT_LAT = 40.7128;
// @typescript-eslint/no-unused-vars
const DEFAULT_LON = -74.006;

export interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
  location: {
    name: string;
    region: string;
    country: string;
  };
}

// Get current weather based on browser geolocation
export async function getCurrentWeather(): Promise<WeatherData> {
  // Only proceed if we're in the browser and geolocation is available
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    throw new Error("Geolocation is not supported in this browser");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          resolve(data);
        } catch (error) {
          console.error("Failed to fetch weather data:", error);
          reject(new Error("Failed to fetch weather data"));
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error(
                "Location access denied. Please enable location services."
              )
            );
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("Location request timed out."));
            break;
          default:
            reject(new Error("Unable to get your location."));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

// Get weather by coordinates
export async function getWeatherByCoords(
  lat: number,
  lon: number,
  date?: Date
): Promise<WeatherData> {
  // Build the URL based on whether we need historical or current data
  let url: string;

  if (date && isHistoricalDate(date)) {
    // Format date as YYYY-MM-DD for historical API
    const formattedDate = date.toISOString().split("T")[0];
    url = `${BASE_URL}/history.json?key=${API_KEY}&q=${lat},${lon}&dt=${formattedDate}`;
  } else {
    // Current weather
    url = `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`;
  }

  const response = await fetch(url, { next: { revalidate: 1800 } }); // Cache for 30 minutes

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  return await response.json();
}

// Helper to determine if a date is in the past (for historical data)
function isHistoricalDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate < today;
}
