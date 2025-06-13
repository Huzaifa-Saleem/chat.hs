"use client";

import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const { theme } = useTheme();

  return (
    <ReactMarkdown
      components={{
        code: ({ node, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          return !match ? (
            <code
              className={cn(
                "bg-gray-800 rounded px-1.5 py-0.5 text-sm",
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              )}
              {...props}
            >
              {children}
            </code>
          ) : (
            <div className="relative">
              <div className="absolute right-2 top-2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-gray-200"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      String(children).replace(/\n$/, "")
                    );
                    toast.success("Code copied to clipboard!");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-copy"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </Button>
              </div>
              <pre
                className={cn(
                  "p-4 rounded-lg overflow-x-auto",
                  theme === "dark" ? "bg-gray-800" : "bg-gray-100"
                )}
              >
                <code
                  className={cn(
                    "text-sm",
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  )}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </code>
              </pre>
            </div>
          );
        },
        p: ({ children }) => (
          <p
            className={cn(
              "mb-4",
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            )}
          >
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul
            className={cn(
              "list-disc pl-6 mb-4",
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            )}
          >
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol
            className={cn(
              "list-decimal pl-6 mb-4",
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            )}
          >
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li
            className={cn(
              "mb-1",
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            )}
          >
            {children}
          </li>
        ),
        h1: ({ children }) => (
          <h1
            className={cn(
              "text-2xl font-bold mb-4",
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            )}
          >
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2
            className={cn(
              "text-xl font-bold mb-3",
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            )}
          >
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3
            className={cn(
              "text-lg font-bold mb-2",
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            )}
          >
            {children}
          </h3>
        ),
        blockquote: ({ children }) => (
          <blockquote
            className={cn(
              "border-l-4 border-gray-700 pl-4 italic mb-4",
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            )}
          >
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className={cn(
              "hover:underline",
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
