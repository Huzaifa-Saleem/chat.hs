"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import SelectModel from "./select-model";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

const Chat = () => {
  const [input, setInput] = useState("");

  // Example messages for UI demonstration
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hello! How can I help you today?", role: "assistant" },
    { id: "2", content: "I need help with my project", role: "user" },
    {
      id: "3",
      content:
        "I'd be happy to help with your project. What specifically are you working on?",
      role: "assistant",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Just UI, no functionality as requested
    setInput("");
  };

  return (
    <div className="w-full flex items-center justify-center p-8 pb-0 h-[calc(100vh)] ">
      <div className="flex flex-col h-full w-full max-w-3xl">
        {/* Chat messages container */}
        <div className="h-full overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <p className="inline-block px-4 py-2 rounded-full">
                {message.content}
              </p>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border bg-sidebar p-1 rounded-t-lg">
          <form
            onSubmit={handleSubmit}
            className=" border bg-sidebar-accent p-2 pb-0 rounded-t-lg space-x-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="min-h-[60px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 outline-none shadow-none mb-2"
            />
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2">
                <SelectModel />
                <Badge variant="outline">Badge</Badge>
                <Badge variant="outline">Badge</Badge>
              </div>
              <Button type="submit" size="icon" className="opacity-50">
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
