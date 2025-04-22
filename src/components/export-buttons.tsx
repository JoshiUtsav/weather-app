"use client";

import { useState } from "react";
import { Download, FileType, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllMoodEntries } from "@/lib/mood-storage";
import { exportAsCSV, exportAsPDF } from "@/lib/export-utils";
import { toast } from "sonner";

export default function ExportButtons() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "csv" | "pdf") => {
    setIsExporting(true);

    try {
      const entries = await getAllMoodEntries();

      if (entries.length === 0) {
        toast.error("No entries to export", {
          description: "Add some mood entries first before exporting.",
        });
        return;
      }

      // Process entries to include weather data
      const processedEntries = entries.map((entry) => ({
        ...entry,
        weather: entry.weather || undefined
      }));

      if (format === "csv") {
        await exportAsCSV(processedEntries);
        toast.success("Export successful", {
          description: "Your mood journal has been exported as CSV.",
        });
      } else {
        await exportAsPDF(processedEntries);
        toast.success("Export successful", {
          description: "Your mood journal has been exported as PDF.",
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed", {
        description: "There was an error exporting your mood journal.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport("csv")} disabled={isExporting}>
          <FileType className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")} disabled={isExporting}>
          <FileType className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
