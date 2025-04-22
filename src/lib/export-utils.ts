import { jsPDF } from "jspdf"
import { MoodEntry } from "./mood-storage"
import { format } from "date-fns"

// Export entries as CSV
export function exportAsCSV(entries: MoodEntry[]): void {
    // CSV header
    let csvContent = "Date,Mood,Note,Temperature\n"

    // Add each entry as a row
    entries.forEach((entry) => {
        const date = format(new Date(entry.date), "yyyy-MM-dd")
        const mood = entry.mood
        // Escape quotes in notes
        const note = entry.note ? `"${entry.note.replace(/"/g, '""')}"` : ""
        const temp = entry.weather?.temp ? `${entry.weather.temp}°C` : ""

        csvContent += `${date},${mood},${note},${temp}\n`
    })

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `mood-journal-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// Export entries as PDF
export function exportAsPDF(entries: MoodEntry[]): void {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text("Mood Journal", 105, 15, { align: "center" })
    doc.setFontSize(12)
    doc.text(`Generated on ${format(new Date(), "MMMM d, yyyy")}`, 105, 22, { align: "center" })

    // Set up table
    let y = 30
    const pageWidth = doc.internal.pageSize.width
    const margin = 10
    const colWidth = (pageWidth - margin * 2) / 3

    // Table header
    doc.setFont("helvetica", "bold")
    doc.text("Date", margin, y)
    doc.text("Mood", margin + colWidth, y)
    doc.text("Note", margin + colWidth * 2, y)
    doc.line(margin, y + 2, pageWidth - margin, y + 2)
    y += 10

    // Table content
    doc.setFont("helvetica", "normal")
    entries.forEach((entry) => {
        const date = format(new Date(entry.date), "MMM d, yyyy")
        const mood = getMoodEmoji(entry.mood) + " " + entry.mood
        const note = entry.note || ""

        // Check if we need a new page
        if (y > 270) {
            doc.addPage()
            y = 20
        }

        doc.text(date, margin, y)
        doc.text(mood, margin + colWidth, y)

        // Handle long notes with wrapping
        const splitNote = doc.splitTextToSize(note, colWidth - 5)
        doc.text(splitNote, margin + colWidth * 2, y)

        // Move down based on how many lines the note takes
        const lineHeight = 7
        const noteLines = splitNote.length
        y += Math.max(10, noteLines * lineHeight)
    })

    // Save the PDF
    doc.save(`mood-journal-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}

// Helper function to get mood emoji
function getMoodEmoji(mood: string): string {
    const emojiMap: Record<string, string> = {
        happy: "😊",
        neutral: "😐",
        sad: "😔",
        angry: "😡",
        sick: "😷",
    }

    return emojiMap[mood] || "😐"
}
