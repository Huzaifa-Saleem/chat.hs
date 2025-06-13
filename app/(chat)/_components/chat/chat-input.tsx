"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import SelectModel from "./select-model";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({
  input,
  handleInputChange,
  onSubmit,
  selectedModel,
  onModelChange,
  isLoading,
}: ChatInputProps) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        "border p-1 rounded-t-lg",
        theme === "dark"
          ? "bg-gray-900 border-gray-800"
          : "bg-white border-gray-200"
      )}
    >
      <form
        onSubmit={onSubmit}
        className={cn(
          "border p-2 pb-0 rounded-t-lg space-x-2",
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-gray-50 border-gray-200"
        )}
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className={cn(
            "min-h-[60px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none shadow-none mb-2",
            theme === "dark"
              ? "bg-gray-800 text-gray-200"
              : "bg-gray-50 text-gray-800"
          )}
        />
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <SelectModel
              selectedModel={selectedModel}
              onModelChange={onModelChange}
            />
            <Badge variant="outline">Badge</Badge>
            <Badge variant="outline">Badge</Badge>
          </div>
          <Button
            type="submit"
            size="icon"
            className={cn(
              "transition-opacity duration-200",
              input.trim() ? "opacity-100" : "opacity-50"
            )}
            disabled={!input.trim()}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
