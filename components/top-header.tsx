"use client"

import { Search, Send, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TopHeaderProps {
  onSearch?: (query: string) => void
  showSearch?: boolean
  searchQuery?: string
  onSearchQueryChange?: (query: string) => void
  isSidebarCollapsed?: boolean
  isModalActive?: boolean
  pageTitle?: string
  onUploadClick?: () => void
}

export function TopHeader({ onSearch, showSearch = true, searchQuery = "", onSearchQueryChange, isSidebarCollapsed = false, isModalActive = false, pageTitle, onUploadClick }: TopHeaderProps) {
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
      <div className="relative flex items-center justify-between py-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-8">
          {/* Page Title - Left */}
          <div className="flex-shrink-0">
            {pageTitle && (
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {pageTitle}
              </h1>
            )}
          </div>

          {/* Search bar - Center */}
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

          {/* Upload Button - Right */}
          <div className="flex-shrink-0">
            {onUploadClick && (
              <Button
                onClick={onUploadClick}
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-glow hover:scale-105 transition-all duration-300"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Photos
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
