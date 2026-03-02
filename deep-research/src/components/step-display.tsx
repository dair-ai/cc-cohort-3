"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Loader2, ChevronDown, ChevronRight } from "lucide-react";

interface SearchResult {
  title: string;
  url: string;
  text: string;
}

interface ToolStep {
  state: string;
  query?: string;
  results?: SearchResult[];
}

interface StepDisplayProps {
  steps: ToolStep[];
  hasReport?: boolean;
}

export function StepDisplay({ steps, hasReport = false }: StepDisplayProps) {
  const [manualToggle, setManualToggle] = useState<boolean | null>(null);

  // Auto-collapse when report appears, but respect manual toggle
  const collapsed = manualToggle !== null ? manualToggle : hasReport;

  if (!steps || steps.length === 0) return null;

  const completedSteps = steps.filter(
    (s) => s.results && s.results.length > 0
  );
  const totalSources = completedSteps.reduce(
    (sum, s) => sum + (s.results?.length ?? 0),
    0
  );

  if (collapsed) {
    return (
      <div className="w-full max-w-2xl">
        <button
          onClick={() => setManualToggle(false)}
          className="flex w-full items-center gap-2 rounded-lg border bg-card px-4 py-3 text-sm transition-colors hover:bg-accent"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Search className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">
            {completedSteps.length} search{completedSteps.length !== 1 ? "es" : ""} completed
          </span>
          <span className="text-muted-foreground">—</span>
          <Badge variant="secondary">{totalSources} sources found</Badge>
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      {hasReport && (
        <button
          onClick={() => setManualToggle(true)}
          className="flex items-center gap-1 self-start text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronDown className="h-3 w-3" />
          Collapse search steps
        </button>
      )}
      {steps.map((step, index) => {
        const isLoading =
          step.state === "call" ||
          step.state === "input-streaming" ||
          step.state === "input-available";
        const hasResults = step.results && step.results.length > 0;

        return (
          <Card
            key={index}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                {isLoading && !hasResults ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <Search className="h-4 w-4 text-primary" />
                )}
                <span className="text-muted-foreground">Searching:</span>
                <span>{step.query || "..."}</span>
              </CardTitle>
            </CardHeader>
            {hasResults && (
              <CardContent className="pt-0">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary">
                    {step.results!.length} sources found
                  </Badge>
                </div>
                <ul className="space-y-1">
                  {step.results!.slice(0, 5).map((result, i) => (
                    <li key={i}>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {result.title || result.url}
                        </span>
                      </a>
                    </li>
                  ))}
                  {step.results!.length > 5 && (
                    <li className="pl-5 text-xs text-muted-foreground">
                      +{step.results!.length - 5} more sources
                    </li>
                  )}
                </ul>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
