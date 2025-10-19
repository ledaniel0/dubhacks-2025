"use client"

import { Filter, ChevronDown, CheckSquare, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { PhotoCard } from "./photo-card"
import { cn } from "@/lib/utils"
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
  searchResults?: Photo[]
  isSearchMode?: boolean
  searchQuery?: string
  isLoading?: boolean
  onPhotoClick?: (photo: Photo) => void
  refreshTrigger?: number
  onSelectionChange?: (selectedPhotos: Photo[], isSelectionMode: boolean) => void
  clearSelectionTrigger?: number
}

export function Library({ searchResults, isSearchMode = false, searchQuery = "", isLoading = false, onPhotoClick, refreshTrigger, onSelectionChange, clearSelectionTrigger }: LibraryProps = {}) {
  const [photoLibrary, setPhotoLibrary] = useState<Photo[]>([])
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")
  const [displayCount, setDisplayCount] = useState(20)
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(true)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clear selections when trigger changes
  useEffect(() => {
    if (clearSelectionTrigger !== undefined && clearSelectionTrigger > 0) {
      setIsSelectionMode(false)
      setSelectedPhotos(new Set())
      onSelectionChange?.([], false)
    }
  }, [clearSelectionTrigger])

  // Toggle selection mode
  const toggleSelectionMode = () => {
    const newSelectionMode = !isSelectionMode
    setIsSelectionMode(newSelectionMode)
    if (!newSelectionMode) {
      setSelectedPhotos(new Set())
      onSelectionChange?.([], newSelectionMode)
    } else {
      onSelectionChange?.(Array.from(selectedPhotos).map(id => photoLibrary.find(p => p.id === id)).filter(Boolean) as Photo[], newSelectionMode)
    }
  }

  // Toggle photo selection
  const togglePhotoSelection = (photoId: number) => {
    const newSelected = new Set(selectedPhotos)
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId)
    } else {
      newSelected.add(photoId)
    }
    setSelectedPhotos(newSelected)
    onSelectionChange?.(Array.from(newSelected).map(id => photoLibrary.find(p => p.id === id)).filter(Boolean) as Photo[], isSelectionMode)
  }

  // Fetch photos from API on mount and when refreshTrigger changes
  useEffect(() => {
    async function fetchPhotos() {
      try {
        setIsLoadingPhotos(true)
        const response = await fetch('/api/photos')
        const data = await response.json()
        setPhotoLibrary(data.photos)
        setLikedPhotos(new Set(data.photos.filter((p: Photo) => p.liked).map((p: Photo) => p.id)))
        setIsLoadingPhotos(false)
      } catch (error) {
        console.error('Error fetching photos:', error)
        setIsLoadingPhotos(false)
      }
    }
    fetchPhotos()
  }, [refreshTrigger])

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

  // Calculate photos to display (must be before early return to maintain hook order)
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

  // Loading state - show AI processing animation (after all hooks)
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-lg text-muted-foreground">
              {isSearchMode
                ? `${searchResults?.length || 0} photos found for "${searchQuery}"`
                : (
                  <>
                    <span className="font-bold text-foreground">{photoLibrary.length} photos</span> in your collection
                  </>
                )
              }
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleSelectionMode}
              variant={isSelectionMode ? "default" : "outline"}
              className={cn(
                "border-2 transition-all duration-300 hover:shadow-glow hover:scale-105",
                isSelectionMode 
                  ? "bg-gradient-to-r from-[#FF6B35] to-[#E0338E] text-white border-primary" 
                  : "border-primary/40 text-primary hover:text-primary hover:bg-gradient-to-r hover:from-[#FF6B35]/20 hover:via-[#E0338E]/20 hover:to-[#9D4EDD]/20 hover:border-primary"
              )}
            >
              {isSelectionMode ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
              {isSelectionMode ? "Selecting" : "Select"}
            </Button>
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
            <div key={photo.id} className="relative">
              <PhotoCard 
                photo={photo} 
                isLiked={likedPhotos.has(photo.id)} 
                onToggleLike={toggleLike} 
                onPhotoClick={isSelectionMode ? () => togglePhotoSelection(photo.id) : onPhotoClick}
                isSelectionMode={isSelectionMode}
                isSelected={selectedPhotos.has(photo.id)}
              />
              {isSelectionMode && (
                <div className="absolute top-2 right-2 z-10">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                    selectedPhotos.has(photo.id) 
                      ? "bg-primary border-primary text-primary-foreground" 
                      : "bg-background/80 border-foreground/20 text-foreground/60"
                  )}>
                    {selectedPhotos.has(photo.id) && <CheckSquare className="h-4 w-4" />}
                  </div>
                </div>
              )}
            </div>
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
