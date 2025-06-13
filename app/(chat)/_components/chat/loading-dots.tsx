"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export const LoadingDots = () => {
  const { theme } = useTheme();

  return (
    <div className="mb-4 text-left">
      <div
        className={cn(
          "inline-block px-4 py-2 rounded-lg",
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        )}
      >
        <div className="flex space-x-2">
          <div
            className={cn(
              "w-2 h-2 rounded-full animate-bounce",
              theme === "dark" ? "bg-gray-400" : "bg-gray-600"
            )}
          />
          <div
            className={cn(
              "w-2 h-2 rounded-full animate-bounce [animation-delay:0.2s]",
              theme === "dark" ? "bg-gray-400" : "bg-gray-600"
            )}
          />
          <div
            className={cn(
              "w-2 h-2 rounded-full animate-bounce [animation-delay:0.4s]",
              theme === "dark" ? "bg-gray-400" : "bg-gray-600"
            )}
          />
        </div>
      </div>
    </div>
  );
};
