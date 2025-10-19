"use client"

import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { photoLibrary } from "@/lib/photo-data"
import { PhotoCard } from "./photo-card"
import type { Photo } from "@/lib/types"

type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "location" | "liked"

const sortOptions = [
  { value: "date-desc" as SortOption, label: "Date (Newest First)" },
  { value: "date-asc" as SortOption, label: "Date (Oldest First)" },
  { value: "name-asc" as SortOption, label: "Name (A-Z)" },
  { value: "name-desc" as SortOption, label: "Name (Z-A)" },
  { value: "location" as SortOption, label: "Location" },
  { value: "liked" as SortOption, label: "Liked Photos First" },
]

interface LibraryProps {
  searchResults?: typeof photoLibrary
  isSearchMode?: boolean
  searchQuery?: string
  isLoading?: boolean
  onPhotoClick?: (photo: Photo) => void
}

export function Library({ searchResults, isSearchMode = false, searchQuery = "", isLoading = false, onPhotoClick }: LibraryProps = {}) {
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(
    new Set(photoLibrary.filter((p) => p.liked).map((p) => p.id)),
  )
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")
  const [displayCount, setDisplayCount] = useState(20)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const toggleLike = useCallback((id: number) => {
    setLikedPhotos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  // Loading state - show AI processing animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col items-center justify-center py-32">
            {/* Circular Progress Indicator */}
            <div className="relative w-12 h-12 mb-4">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                {/* Background circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-muted/20"
                />
                {/* Progress arc with fill animation */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="text-primary"
                  style={{
                    strokeDasharray: "126",
                    strokeDashoffset: "126",
                    animation: "fillProgress 0.8s ease-out forwards",
                  }}
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              Searching for &quot;{searchQuery}&quot;
            </p>
            
            <style jsx>{`
              @keyframes fillProgress {
                0% {
                  stroke-dashoffset: 126;
                }
                100% {
                  stroke-dashoffset: 20;
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    )
  }

  const photosToDisplay = isSearchMode && searchResults ? searchResults : photoLibrary

  const sortedPhotos = useMemo(() => {
    return [...photosToDisplay].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "location":
          return a.location.localeCompare(b.location)
        case "liked":
          const aLiked = likedPhotos.has(a.id) ? 1 : 0
          const bLiked = likedPhotos.has(b.id) ? 1 : 0
          return bLiked - aLiked
        default:
          return 0
      }
    })
  }, [photosToDisplay, sortBy, likedPhotos])

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Date (Newest First)"

  // Set up Intersection Observer for infinite scrolling with debouncing
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current
    if (!loadMoreElement) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && displayCount < sortedPhotos.length) {
          // Debounce the loading to prevent excessive updates during fast scrolling
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
          }
          debounceTimerRef.current = setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 20, sortedPhotos.length))
          }, 100)
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    observerRef.current.observe(loadMoreElement)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [displayCount, sortedPhotos.length])

  // Reset display count when sorting changes
  useEffect(() => {
    setDisplayCount(20)
  }, [sortBy])

  const displayedPhotos = useMemo(() =>
    sortedPhotos.slice(0, displayCount),
    [sortedPhotos, displayCount]
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">Library</h1>
            <p className="text-muted-foreground">
              {isSearchMode 
                ? `${searchResults?.length || 0} photos found for "${searchQuery}"`
                : `${photoLibrary.length} photos in your collection`
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {currentSortLabel}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={sortBy === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} isLiked={likedPhotos.has(photo.id)} onToggleLike={toggleLike} onPhotoClick={onPhotoClick} />
          ))}
        </div>

        {/* Load more trigger */}
        {displayCount < sortedPhotos.length && (
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
            <div className="animate-pulse text-muted-foreground">Loading more photos...</div>
          </div>
        )}
      </div>
    </div>
  )
}
