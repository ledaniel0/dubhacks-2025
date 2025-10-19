"use client"

import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { cn } from "@/lib/utils"

const mockPhotos = [
  { id: 1, url: "/beach-sunset.png", tags: ["beach", "sunset", "summer"] },
  { id: 2, url: "/mountain-hiking.png", tags: ["mountain", "hiking", "nature"] },
  { id: 3, url: "/family-dinner.png", tags: ["family", "dinner", "celebration"] },
  { id: 4, url: "/vibrant-city-skyline.png", tags: ["city", "skyline", "urban"] },
  { id: 5, url: "/forest-trail.png", tags: ["forest", "trail", "nature"] },
  { id: 6, url: "/beach-volleyball-game.png", tags: ["beach", "sports", "friends"] },
  { id: 7, url: "/sunset-pier.jpg", tags: ["sunset", "pier", "peaceful"] },
  { id: 8, url: "/serene-mountain-lake.png", tags: ["mountain", "lake", "reflection"] },
  { id: 9, url: "/city-night.png", tags: ["city", "night", "lights"] },
]

interface SearchResultsProps {
  query: string
  onClearSearch: () => void
  onSearchChange: (query: string) => void
}

export function SearchResults({ query, onClearSearch, onSearchChange }: SearchResultsProps) {
  const [searchValue, setSearchValue] = useState(query)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)

  const handleSearch = () => {
    setIsLoading(true)
    // Simulate search delay
    setTimeout(() => {
      onSearchChange(searchValue)
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search your photos..."
                className="h-12 pl-12 pr-4 text-base bg-card border-border"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              size="lg"
              className="bg-primary text-primary-foreground"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onClearSearch} variant="ghost" size="lg">
                    <X className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Found {mockPhotos.length} photos</h2>
          <p className="text-sm text-muted-foreground mt-1">Results for &quot;{query}&quot;</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPhotos.map((photo, index) => {
            const isHovered = hoveredPhoto === photo.id

            return (
              <button
                key={photo.id}
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
                className={cn(
                  "group relative overflow-hidden rounded-xl bg-card border border-border transition-all duration-300",
                  isHovered ? "scale-[1.03] shadow-xl border-primary/30" : "shadow-sm hover:shadow-lg",
                )}
                style={{
                  animation: `fadeIn 300ms ease-out ${index * 50}ms both`,
                }}
              >
                <div className="aspect-square">
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt={`Photo ${photo.id}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-all duration-200",
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                  )}
                >
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            Create Album from Results
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
