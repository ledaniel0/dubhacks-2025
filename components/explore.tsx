"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Compass, Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { PublicAlbumCard } from "./public-album-card"
import { publicAlbums } from "@/lib/photo-data"
import type { PublicAlbum } from "@/lib/types"

interface ExploreProps {
  onAlbumClick?: (album: PublicAlbum) => void
}

export function Explore({ onAlbumClick }: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [displayCount, setDisplayCount] = useState(12)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Filter albums based on search
  const filteredAlbums = useMemo(() => {
    if (!searchQuery.trim()) return publicAlbums

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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Explore Public Albums
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Discover and contribute to community photo collections from landmarks around the world
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by location, landmark, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary/50"
          />
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-8 p-4 rounded-2xl glass-effect border border-border/50">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="text-foreground font-medium">
              {filteredAlbums.length} {filteredAlbums.length === 1 ? 'Location' : 'Locations'}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="text-muted-foreground text-sm">
            {searchQuery ? `Searching for "${searchQuery}"` : 'Showing all public albums'}
          </div>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedAlbums.map((album) => (
            <PublicAlbumCard
              key={album.id}
              album={album}
              onClick={() => onAlbumClick?.(album)}
            />
          ))}
        </div>

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
      </div>
    </div>
  )
}
