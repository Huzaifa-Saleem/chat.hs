"use client";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { MessageBubble } from "./message-bubble";
import { LoadingDots } from "./loading-dots";
import { ChatInput } from "./chat-input";

const Chat = () => {
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet");
  const { theme, setTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        model: selectedModel,
      },
      onError: (error) => {
        toast.error("Failed to send message. Please try again.");
      },
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("Please enter a message");
      return;
    }
    handleSubmit(e);
  };

  return (
    <div className="w-full flex items-center justify-center p-8 pb-0 h-[calc(100vh)] relative">
      {/* Theme toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="absolute top-4 right-4 rounded-full"
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      <div className="flex flex-col h-full w-full max-w-3xl">
        {/* Chat messages container */}
        <div className="h-full overflow-y-auto p-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <MessageBubble content={message.content} role={message.role} />
            </div>
          ))}
          {isLoading && <LoadingDots />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          onSubmit={onSubmit}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Chat;
