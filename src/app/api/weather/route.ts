import { NextRequest, NextResponse } from "next/server";

const API_KEY =
  process.env.WEATHER_API_KEY ||
  process.env.NEXT_PUBLIC_WEATHER_API_KEY ||
  "demo";
const BASE_URL = "https://api.weatherapi.com/v1";

export async function GET(request: NextRequest) {
  try {
    // Get parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const date = searchParams.get("dt");
    const type = searchParams.get("type");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Missing latitude or longitude parameters" },
        { status: 400 }
      );
    }

    // Determine which endpoint to use
    let endpoint = "current.json";
    if (type === "history" && date) {
      endpoint = "history.json";
    }

    // Build the URL for WeatherAPI.com
    let url = `${BASE_URL}/${endpoint}?key=${API_KEY}&q=${lat},${lon}`;

    // Add date parameter for historical requests
    if (type === "history" && date) {
      url += `&dt=${date}`;
    }

    // Make the request to the external API
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Weather API error: ${errorText}` },
        { status: response.status }
      );
    }

    // Return the data
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
