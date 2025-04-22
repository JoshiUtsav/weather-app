"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface UiLayoutProps {
  children: ReactNode;
  title: string;
  weatherDisplay: ReactNode;
}

export default function UiLayout({
  children,
  title,
  weatherDisplay,
}: UiLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-300 to-orange-200 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <div className="flex items-center gap-2">
            {weatherDisplay}
            <ThemeToggle />
          </div>
        </div>

        {/* Main content */}
        <div className="mb-20">{children}</div>

        {/* Bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg">
          <div className="container mx-auto max-w-4xl">
            <div className="flex justify-around py-3">
              <Link
                href="/input"
                className={`flex flex-col items-center ${
                  pathname === "/input"
                    ? "text-orange-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <Home size={24} />
                <span className="text-xs mt-1">Home</span>
              </Link>
              <Link
                href="/notes"
                className={`flex flex-col items-center ${
                  pathname === "/notes"
                    ? "text-orange-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <FileText size={24} />
                <span className="text-xs mt-1">Notes</span>
              </Link>
              <Link
                href="/stats"
                className={`flex flex-col items-center ${
                  pathname === "/stats"
                    ? "text-orange-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <BarChart2 size={24} />
                <span className="text-xs mt-1">Stats</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
