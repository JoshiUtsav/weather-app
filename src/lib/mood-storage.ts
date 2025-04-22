import { v4 as uuidv4 } from "uuid"

export interface MoodEntry {
    id: string
    date: string
    mood: string
    note: string
    location?: {
        lat: number
        lon: number
    }
    weather?: {
        temp: number | null
        icon: string | null
    }
}

export interface NewMoodEntry {
    date: Date
    mood: string
    note: string
    location?: {
        lat: number
        lon: number
    }
    weather?: {
        temp: number
        icon: string
    }
}

// Save a new mood entry
export async function saveMoodEntry(entry: NewMoodEntry): Promise<MoodEntry> {
    const newEntry: MoodEntry = {
        id: uuidv4(),
        date: entry.date.toISOString(),
        mood: entry.mood,
        note: entry.note,
        location: entry.location,
        weather: entry.weather,
    }

    // Get existing entries
    const existingEntries = await getAllMoodEntries()

    // Add new entry
    const updatedEntries = [...existingEntries, newEntry]

    // Save to localStorage
    if (typeof window !== "undefined") {
        localStorage.setItem("moodEntries", JSON.stringify(updatedEntries))
    }

    return newEntry
}

// Get all mood entries
export async function getAllMoodEntries(): Promise<MoodEntry[]> {
    if (typeof window === "undefined") {
        return []
    }

    const entriesJson = localStorage.getItem("moodEntries")

    if (!entriesJson) {
        return []
    }

    try {
        return JSON.parse(entriesJson)
    } catch (error) {
        console.error("Failed to parse mood entries:", error)
        return []
    }
}

// Get mood entries grouped by date
export async function getMoodEntriesByDate(): Promise<MoodEntry[]> {
    const entries = await getAllMoodEntries()

    // Create a map to store one entry per date (most recent)
    const entriesByDate = new Map<string, MoodEntry>()

    entries.forEach((entry) => {
        const dateKey = new Date(entry.date).toDateString()

        if (!entriesByDate.has(dateKey) || new Date(entry.date) > new Date(entriesByDate.get(dateKey)!.date)) {
            entriesByDate.set(dateKey, entry)
        }
    })

    return Array.from(entriesByDate.values())
}
