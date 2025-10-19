"use client"

import { Search, Sparkles, Send, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TopHeaderProps {
  onUploadClick: () => void
  onSearch?: (query: string) => void
  showSearch?: boolean
  searchQuery?: string
  onSearchQueryChange?: (query: string) => void
  isSidebarCollapsed?: boolean
  isModalActive?: boolean
}

export function TopHeader({ onUploadClick, onSearch, showSearch = true, searchQuery = "", onSearchQueryChange, isSidebarCollapsed = false, isModalActive = false }: TopHeaderProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = () => {
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <header className={cn(
      "fixed top-0 right-0 border-b border-border/40 z-40 bg-background/30 backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-in-out",
      isModalActive ? "left-0" : isSidebarCollapsed ? "left-16" : "left-64"
    )}>
      <div className="relative flex items-center justify-center px-8 py-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-8">
          {/* Left side - Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="h-10 w-10 rounded-xl animated-gradient flex items-center justify-center shadow-glow">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#E0338E] to-[#00B4D8] bg-clip-text text-transparent">
              Echo
            </span>
          </div>

          {/* Center - Search bar */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              <div
                className={cn(
                  "relative flex items-center rounded-2xl transition-all duration-500",
                  isFocused
                    ? "scale-[1.02] shadow-glow ring-2 ring-transparent bg-gradient-to-r from-primary via-accent to-primary p-[2px]"
                    : "shadow-sm",
                )}
              >
                <div className="relative flex items-center w-full bg-card rounded-2xl">
                  <div className="absolute left-4 flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground transition-colors duration-200" />
                    {isFocused && <Sparkles className="h-3 w-3 text-primary animate-pulse" />}
                  </div>
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange?.(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder='Try "my proudest moments" or "photos where I felt peaceful"'
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={cn(
                      "h-12 text-sm bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300",
                      isFocused ? "pl-16 pr-16" : "pl-12 pr-16",
                    )}
                  />
                  <Button
                    onClick={handleSearch}
                    size="icon"
                    className="absolute right-2 h-8 w-8 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-glow hover:scale-105 transition-all duration-300"
                  >
                    <Send className="h-4 w-4 rotate-45 -translate-x-[1px]" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Right side - Upload button */}
          <div className="flex-shrink-0">
            <Button
              onClick={onUploadClick}
              className="animated-gradient shadow-layered hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              Upload Photos
              <Upload className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
