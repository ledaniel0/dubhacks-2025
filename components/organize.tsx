"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Sparkles, FolderPlus, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Photo, Album } from "@/lib/types"

interface OrganizeProps {
  onPhotoClick?: (photo: Photo) => void
}

interface PhotoSuggestion {
  photo: Photo
  suggestedAlbums: {
    album: Album
    confidence: "high" | "medium" | "low"
    reason: string
  }[]
  assignedAlbums: number[] // Album IDs this photo is assigned to
}

export function Organize({ onPhotoClick }: OrganizeProps) {
  const [suggestions, setSuggestions] = useState<PhotoSuggestion[]>([])
  const [allPhotos, setAllPhotos] = useState<Photo[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingPhotoId, setProcessingPhotoId] = useState<number | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)

        // Fetch photos and albums
        const [photosRes, albumsRes] = await Promise.all([
          fetch('/api/photos'),
          fetch('/api/albums')
        ])

        const photosData = await photosRes.json()
        const albumsData = await albumsRes.json()

        setAllPhotos(photosData.photos || [])
        setAlbums(albumsData.albums || [])

        // Generate AI suggestions (placeholder - will be replaced with actual AI)
        generateSuggestions(photosData.photos || [], albumsData.albums || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const generateSuggestions = (photos: Photo[], albums: Album[]) => {
    // Placeholder AI logic - you'll replace this with actual AI integration
    // For now, it suggests albums based on location and tags matching
    const photoSuggestions: PhotoSuggestion[] = photos.slice(0, 20).map(photo => {
      const suggestedAlbums = albums
        .filter(album => !album.photoIds.includes(photo.id)) // Not already in album
        .map(album => {
          // Simple matching logic - replace with AI
          const titleLocationMatch = album.title.toLowerCase().includes(photo.location.toLowerCase()) ||
                                     photo.location.toLowerCase().includes(album.title.toLowerCase())

          const tagMatch = photo.tags?.some(tag =>
            album.title.toLowerCase().includes(tag.toLowerCase())
          ) || false

          const descriptionMatch = album.description?.toLowerCase().includes(photo.location.toLowerCase()) ||
                                  photo.tags?.some(tag =>
                                    album.description?.toLowerCase().includes(tag.toLowerCase())
                                  ) || false

          let confidence: "high" | "medium" | "low" = "low"
          let reason = "AI suggests this album"

          if ((titleLocationMatch || descriptionMatch) && tagMatch) {
            confidence = "high"
            reason = `Matches "${album.title}" theme and relevant tags`
          } else if (titleLocationMatch || descriptionMatch) {
            confidence = "medium"
            reason = `Location or theme matches "${album.title}"`
          } else if (tagMatch) {
            confidence = "medium"
            reason = "Tags match album theme"
          }

          return {
            album,
            confidence,
            reason
          }
        })
        .filter(s => s.confidence !== "low")
        .sort((a, b) => {
          const confidenceOrder = { high: 3, medium: 2, low: 1 }
          return confidenceOrder[b.confidence] - confidenceOrder[a.confidence]
        })
        .slice(0, 3) // Top 3 suggestions

      return {
        photo,
        suggestedAlbums,
        assignedAlbums: []
      }
    }).filter(s => s.suggestedAlbums.length > 0)

    setSuggestions(photoSuggestions)
  }

  const handleAssignToAlbum = async (photoId: number, albumId: number) => {
    setProcessingPhotoId(photoId)

    // TODO: Add API call to assign photo to album
    // await fetch('/api/albums/assign', { method: 'POST', body: JSON.stringify({ photoId, albumId }) })

    // Update local state
    setSuggestions(prev => prev.map(suggestion => {
      if (suggestion.photo.id === photoId) {
        return {
          ...suggestion,
          assignedAlbums: [...suggestion.assignedAlbums, albumId],
          suggestedAlbums: suggestion.suggestedAlbums.filter(s => s.album.id !== albumId)
        }
      }
      return suggestion
    }))

    setTimeout(() => setProcessingPhotoId(null), 500)
  }

  const handleRejectSuggestion = (photoId: number, albumId: number) => {
    setSuggestions(prev => prev.map(suggestion => {
      if (suggestion.photo.id === photoId) {
        return {
          ...suggestion,
          suggestedAlbums: suggestion.suggestedAlbums.filter(s => s.album.id !== albumId)
        }
      }
      return suggestion
    }).filter(s => s.suggestedAlbums.length > 0))
  }

  const getConfidenceBadgeColor = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high":
        return "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/40"
      case "medium":
        return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/40"
      case "low":
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 dark:text-gray-400 border-gray-500/40"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-12 h-12 mb-4">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                  className="text-primary animate-spin"
                  style={{
                    strokeDasharray: "126",
                    strokeDashoffset: "100",
                  }}
                />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Analyzing your photos...</p>
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
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Organize
              </h1>
            </div>
            <p className="text-muted-foreground">
              {suggestions.length > 0
                ? `${suggestions.length} photos with smart album suggestions`
                : "All photos are organized! Check back later for new suggestions."
              }
            </p>
          </div>
        </div>

        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground max-w-md">
              Your photos are well organized. New suggestions will appear here when you add more photos.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.photo.id}
                className="glass-effect rounded-2xl p-6 border border-border/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex gap-6">
                  {/* Photo Preview */}
                  <div
                    className="relative w-48 h-48 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group"
                    onClick={() => onPhotoClick?.(suggestion.photo)}
                  >
                    <Image
                      src={suggestion.photo.url || "/placeholder.svg"}
                      alt={suggestion.photo.location}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Suggestions */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-1">{suggestion.photo.name}</h3>
                      <p className="text-sm text-muted-foreground">{suggestion.photo.location}</p>
                      {suggestion.assignedAlbums.length > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <Check className="h-4 w-4" />
                          <span>Added to {suggestion.assignedAlbums.length} album{suggestion.assignedAlbums.length > 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      {suggestion.suggestedAlbums.map((albumSuggestion) => (
                        <div
                          key={albumSuggestion.album.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 transition-all duration-300 hover:border-primary/40"
                        >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <FolderPlus className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium truncate">{albumSuggestion.album.title}</h4>
                                <Badge className={`${getConfidenceBadgeColor(albumSuggestion.confidence)} text-xs`}>
                                  {albumSuggestion.confidence} confidence
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{albumSuggestion.reason}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRejectSuggestion(suggestion.photo.id, albumSuggestion.album.id)}
                              className="hover:bg-red-500/10 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAssignToAlbum(suggestion.photo.id, albumSuggestion.album.id)}
                              disabled={processingPhotoId === suggestion.photo.id}
                              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
