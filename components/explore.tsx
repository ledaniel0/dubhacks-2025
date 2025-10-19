"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Search, MapPin, Sparkles, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PublicAlbumCard } from "./public-album-card"
import { AlbumDetail } from "./album-detail"
import { publicAlbums } from "@/lib/photo-data"
import type { PublicAlbum, Photo, Album } from "@/lib/types"

interface ExploreProps {
  onAlbumClick?: (album: PublicAlbum) => void
  onModalStateChange?: (isModalActive: boolean) => void
}

export function Explore({ onAlbumClick, onModalStateChange }: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [displayCount, setDisplayCount] = useState(12)
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPublicAlbum, setSelectedPublicAlbum] = useState<PublicAlbum | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Fetch recent photos on mount
  useEffect(() => {
    async function fetchRecentPhotos() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/photos')
        const data = await response.json()
        const photos: Photo[] = data.photos || []
        
        // Get recent photos (last 20)
        const recent = photos.slice(0, 20)
        setRecentPhotos(recent)
      } catch (error) {
        console.error('Error fetching recent photos:', error)
        setRecentPhotos([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchRecentPhotos()
  }, [])

  // Suggest albums based on recent photos
  const suggestedAlbums = useMemo(() => {
    if (recentPhotos.length === 0) return publicAlbums // Show all albums if no recent photos
    
    const suggestions: { album: PublicAlbum; score: number }[] = []
    
    publicAlbums.forEach(album => {
      let score = 0
      
      // Analyze recent photos for matches
      recentPhotos.forEach(photo => {
        // Check location matches
        if (photo.location.toLowerCase().includes(album.location.toLowerCase().split(',')[0])) {
          score += 3
        }
        
        // Check tag matches
        photo.tags.forEach(tag => {
          if (album.tags.some(albumTag => albumTag.toLowerCase().includes(tag.toLowerCase()))) {
            score += 2
          }
        })
        
        // Check description matches
        if (photo.description?.toLowerCase().includes(album.title.toLowerCase())) {
          score += 4
        }
        
        // Check name matches
        if (photo.name.toLowerCase().includes(album.title.toLowerCase())) {
          score += 2
        }
      })
      
      if (score > 0) {
        suggestions.push({ album, score })
      }
    })
    
    // Sort by score and return top suggestions, or all albums if no suggestions
    const sortedSuggestions = suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.album)
    
    // If no suggestions found, return all albums
    return sortedSuggestions.length > 0 ? sortedSuggestions : publicAlbums
  }, [recentPhotos])

  // Filter albums based on search or show suggestions
  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) {
      // Always show all public albums when no search query
      return publicAlbums
    }

    const query = searchQuery.toLowerCase()
    return publicAlbums.filter(
      (album) =>
        album.title.toLowerCase().includes(query) ||
        album.location.toLowerCase().includes(query) ||
        album.description.toLowerCase().includes(query) ||
        album.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }, [searchQuery])

  const displayedAlbums = useMemo(() =>
    filteredAlbums.slice(0, displayCount),
    [filteredAlbums, displayCount]
  )

  // Set up Intersection Observer for infinite scrolling
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current
    if (!loadMoreElement) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && displayCount < filteredAlbums.length) {
          setDisplayCount((prev) => Math.min(prev + 12, filteredAlbums.length))
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    observerRef.current.observe(loadMoreElement)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [displayCount, filteredAlbums.length])

  // Reset display count when search changes
  useEffect(() => {
    setDisplayCount(12)
  }, [searchQuery])

  const handleViewAlbum = (album: PublicAlbum) => {
    setSelectedPublicAlbum(album)
    onModalStateChange?.(true)
  }

  const handleCloseAlbum = () => {
    setSelectedPublicAlbum(null)
    onModalStateChange?.(false)
  }

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedPublicAlbum) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedPublicAlbum])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Explore Public Albums
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            AI-suggested albums based on your recent photos and shared community experiences
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-2xl">
          <div className="relative flex items-center rounded-2xl shadow-sm">
            <div className="relative flex items-center w-full bg-card rounded-2xl">
              <div className="absolute left-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground transition-colors duration-200" />
              </div>
              <Input
                type="text"
                placeholder="Search by event, place, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-sm bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 pl-12 pr-16"
              />
              <Button
                size="icon"
                className="absolute right-2 h-8 w-8 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-glow hover:scale-105 transition-all duration-300"
              >
                <Send className="h-4 w-4 rotate-45 -translate-x-[1px]" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-8 p-4 rounded-2xl glass-effect border border-border/50">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-5 w-5 rounded-full bg-primary/20 animate-pulse" />
            ) : (
              <Sparkles className="h-5 w-5 text-primary" />
            )}
            <span className="text-foreground font-medium">
              {isLoading ? 'Analyzing your photos...' : `${filteredAlbums.length} ${filteredAlbums.length === 1 ? 'Suggestion' : 'Suggestions'}`}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="text-muted-foreground text-sm">
            {isLoading ? 'Finding relevant albums...' : searchQuery ? `Searching for "${searchQuery}"` : 'Based on your recent uploads'}
          </div>
        </div>

        {/* Albums Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl bg-card/80 glass-effect border border-border/50 p-6 animate-pulse"
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-4" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedAlbums.map((album) => (
              <PublicAlbumCard
                key={album.id}
                album={album}
                onClick={() => onAlbumClick?.(album)}
                onViewAlbum={handleViewAlbum}
              />
            ))}
          </div>
        )}

        {/* Load More Trigger */}
        {displayCount < filteredAlbums.length && (
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-8">
            <div className="animate-pulse text-muted-foreground">Loading more albums...</div>
          </div>
        )}

        {/* Empty State */}
        {filteredAlbums.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No albums found</h3>
            <p className="text-muted-foreground max-w-md">
              Try searching with different keywords or browse all available public albums
            </p>
          </div>
        )}

        {/* Public Album Modal */}
        {selectedPublicAlbum && (
          <AlbumDetail
            album={{
              id: selectedPublicAlbum.id,
              title: selectedPublicAlbum.title,
              description: selectedPublicAlbum.description,
              photoIds: selectedPublicAlbum.photoIds,
              createdAt: selectedPublicAlbum.createdAt,
              updatedAt: selectedPublicAlbum.lastContributed,
              owner: "Community",
              isPublic: true,
              tags: selectedPublicAlbum.tags,
              location: selectedPublicAlbum.location
            }}
            onClose={handleCloseAlbum}
          />
        )}
      </div>
    </div>
  )
}
