"use client"

import { Search, Sparkles, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SearchHeroProps {
  onSearch: (query: string) => void
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue)
    }
  }

  return (
    <section className="relative flex items-center justify-center min-h-[40vh] px-4">
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-96 h-96 bg-gradient-to-r from-primary/30 to-accent/30 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-3xl relative z-10">
        <div className="relative mx-auto max-w-2xl">
          <div
            className={cn(
              "relative flex items-center rounded-2xl transition-all duration-500",
              isFocused
                ? "scale-[1.03] shadow-glow ring-2 ring-transparent bg-gradient-to-r from-primary via-accent to-primary p-[2px]"
                : "shadow-layered",
            )}
          >
            <div className="relative flex items-center w-full bg-card rounded-2xl">
              <div className="absolute left-5 flex items-center gap-2">
                <Search className="h-5 w-5 text-muted-foreground transition-colors duration-200" />
                {isFocused && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
              </div>
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder='Try "my proudest moments" or "photos where I felt peaceful"'
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={cn(
                  "h-16 text-base bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300",
                  isFocused ? "pl-20 pr-36" : "pl-14 pr-36",
                )}
              />
              <Button
                onClick={handleSearch}
                size="icon"
                className="absolute right-2 h-12 w-12 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-glow hover:scale-105 transition-all duration-300 shadow-md"
              >
                <Send className="h-5 w-5 rotate-45 -translate-x-[1px]" />
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground font-semibold">Popular:</span>
            {["Happiest moments", "Road trips", "Artistic shots", "Celebrations"].map((query) => (
              <button
                key={query}
                onClick={() => {
                  setSearchValue(query)
                  onSearch(query)
                }}
                className="rounded-full bg-card border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 hover:shadow-md hover:scale-105 transition-all duration-300 magnetic-hover"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
