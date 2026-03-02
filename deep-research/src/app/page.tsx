"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { SearchInput } from "@/components/search-input";
import { StepDisplay } from "@/components/step-display";
import { ResearchReport } from "@/components/research-report";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [input, setInput] = useState("");
  const [topic, setTopic] = useState("");
  const [searchKey, setSearchKey] = useState(0);
  const { messages, setMessages, sendMessage, status, error } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input;
    setTopic(text);
    setInput("");
    setMessages([]);
    setSearchKey((k) => k + 1);
    await sendMessage({ text });
  };

  // Collect all tool invocations and final text from assistant messages
  interface ToolStep {
    state: string;
    query?: string;
    results?: Array<{ title: string; url: string; text: string }>;
  }
  const toolSteps: ToolStep[] = [];
  let reportContent = "";

  for (const message of messages) {
    if (message.role === "assistant" && message.parts) {
      for (const part of message.parts) {
        // In AI SDK v6, tool parts have type "tool-<toolName>" e.g. "tool-webSearch"
        if (part.type.startsWith("tool-")) {
          const p = part as Record<string, unknown>;
          const toolInput = p.input as { query?: string } | undefined;
          const toolOutput = p.output as {
            query: string;
            results: Array<{ title: string; url: string; text: string }>;
          } | undefined;
          toolSteps.push({
            state: p.state as string,
            query: toolInput?.query,
            results: toolOutput?.results,
          });
        } else if (part.type === "text") {
          const textPart = part as { type: "text"; text: string };
          if (textPart.text) {
            reportContent = textPart.text;
          }
        }
      }
    }
  }

  const isIdle = messages.length === 0 && !error;
  const hasReport = reportContent.length > 0;

  return (
    <div className="flex min-h-screen flex-col items-center px-4">
      <div
        className={`flex w-full flex-col items-center transition-all duration-500 ${
          isIdle ? "mt-[30vh]" : "mt-8"
        }`}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Deep Research
          </h1>
          {isIdle && (
            <p className="mt-2 text-muted-foreground">
              Enter a topic and let AI research it for you
            </p>
          )}
        </div>

        <SearchInput
          value={input}
          onChange={setInput}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>

      <div className="mt-8 flex w-full flex-col items-center gap-4 pb-16">
        {topic && !isIdle && (
          <h2 className="w-full max-w-2xl text-lg font-medium text-muted-foreground">
            Researching: <span className="text-foreground">{topic}</span>
          </h2>
        )}

        {error && (
          <div className="w-full max-w-2xl rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-medium">Something went wrong</p>
            <p className="mt-1 opacity-80">{error.message}</p>
          </div>
        )}

        {isLoading && toolSteps.length === 0 && !error && (
          <div className="w-full max-w-2xl space-y-3">
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        )}

        {toolSteps.length > 0 && (
          <StepDisplay key={searchKey} steps={toolSteps} hasReport={hasReport} />
        )}

        {hasReport && (
          <div id="report" className="w-full max-w-2xl">
            <ResearchReport content={reportContent} />
          </div>
        )}

        {isLoading && hasReport && (
          <div className="w-full max-w-2xl">
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
      </div>
    </div>
  );
}
