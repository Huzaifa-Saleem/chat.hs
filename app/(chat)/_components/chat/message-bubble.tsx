"use client";

import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./markdown-renderer";

interface MessageBubbleProps {
  content: string;
  role: "system" | "user" | "assistant" | "data";
}

export const MessageBubble = ({ content, role }: MessageBubbleProps) => {
  return (
    <div
      className={cn(
        "inline-block px-4 py-2 rounded-lg",
        role === "user" ? "bg-blue-600 text-white" : ""
      )}
    >
      {role === "assistant" ? (
        <div className="prose max-w-none">
          <MarkdownRenderer content={content} />
        </div>
      ) : (
        <p>{content}</p>
      )}
    </div>
  );
};
