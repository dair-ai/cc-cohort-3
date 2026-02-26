"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { FormEvent } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export function SearchInput({
  value,
  onChange,
  onSubmit,
  isLoading,
}: SearchInputProps) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-2xl">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter a research topic..."
            className="h-12 pl-10 pr-4 text-base"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" size="lg" disabled={isLoading || !value.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Researching
            </>
          ) : (
            "Research"
          )}
        </Button>
      </div>
    </form>
  );
}
