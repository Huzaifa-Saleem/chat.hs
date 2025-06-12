"use client";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import SelectModel from "./select-model";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const Chat = () => {
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet");

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      toast.error("Please enter a message");
      return;
    }
    handleSubmit(e);
  };

  return (
    <div className="w-full flex items-center justify-center p-8 pb-0 h-[calc(100vh)] ">
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
              <div className="inline-block px-4 py-2 rounded-lg bg-sidebar-accent">
                {message.role === "assistant" ? (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-4 text-left">
              <div className="inline-block px-4 py-2 rounded-lg bg-sidebar-accent">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border bg-sidebar p-1 rounded-t-lg">
          <form
            onSubmit={onSubmit}
            className="border bg-sidebar-accent p-2 pb-0 rounded-t-lg space-x-2"
          >
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="min-h-[60px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none shadow-none mb-2"
            />
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2">
                <SelectModel
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
                <Badge variant="outline">Badge</Badge>
                <Badge variant="outline">Badge</Badge>
              </div>
              <Button
                type="submit"
                size="icon"
                className={`transition-opacity duration-200 ${
                  input.trim() ? "opacity-100" : "opacity-50"
                }`}
                disabled={!input.trim()}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
