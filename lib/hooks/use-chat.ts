import { useCallback, useState } from "react";
import { Message } from "@/lib/validations/chat";
import { FrontendModelKey } from "@/constants/frontend-models";

interface UseChatOptions {
  onError?: (error: Error) => void;
  onSuccess?: (response: any) => void;
  onStream?: (text: string) => void;
}

interface StreamResponse {
  messageId?: string;
  content?: string;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
  isContinued?: boolean;
}

export function useChat({ onError, onSuccess, onStream }: UseChatOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const parseStreamChunk = (chunk: string): StreamResponse | null => {
    try {
      // Remove any whitespace and split by newlines
      const lines = chunk.trim().split("\n");

      // Process each line
      const response: StreamResponse = {};

      for (const line of lines) {
        if (line.startsWith("f:")) {
          // Parse the first message metadata
          const data = JSON.parse(line.slice(2));
          response.messageId = data.messageId;
        } else if (line.startsWith("0:")) {
          // Accumulate content
          response.content = (response.content || "") + line.slice(2);
        } else if (line.startsWith("e:") || line.startsWith("d:")) {
          // Parse the end message metadata
          const data = JSON.parse(line.slice(2));
          response.finishReason = data.finishReason;
          response.usage = data.usage;
          response.isContinued = data.isContinued;
        }
      }

      return response;
    } catch (e) {
      console.error("Error parsing stream chunk:", e);
      return null;
    }
  };

  const sendMessage = useCallback(
    async (
      messages: Message[],
      model: FrontendModelKey,
      conversationId?: string
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            model,
            conversationId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedContent = "";
        let messageId: string | undefined;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value);
          const parsedResponse = parseStreamChunk(text);

          if (parsedResponse) {
            if (parsedResponse.messageId) {
              messageId = parsedResponse.messageId;
            }
            if (parsedResponse.content) {
              accumulatedContent += parsedResponse.content;
              onStream?.(parsedResponse.content);
            }
            if (parsedResponse.finishReason === "stop") {
              onSuccess?.({
                messageId,
                content: accumulatedContent,
                usage: parsedResponse.usage,
              });
            }
          }
        }

        return accumulatedContent;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An error occurred");
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [onError, onSuccess, onStream]
  );

  return {
    sendMessage,
    isLoading,
    error,
  };
}
