"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Sparkles, FolderPlus, Check, X, Wand2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
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
  const [animatedSuggestions, setAnimatedSuggestions] = useState<Set<number>>(new Set())
  const [recentlyAdded, setRecentlyAdded] = useState<Set<number>>(new Set())

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

    // Stagger animation for suggestions
    photoSuggestions.forEach((suggestion, index) => {
      setTimeout(() => {
        setAnimatedSuggestions(prev => new Set(prev).add(suggestion.photo.id))
      }, index * 100)
    })
  }

  const handleAssignToAlbum = async (photoId: number, albumId: number) => {
    setProcessingPhotoId(photoId)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))

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

    // Show success animation
    setRecentlyAdded(prev => new Set(prev).add(photoId))
    setTimeout(() => {
      setRecentlyAdded(prev => {
        const newSet = new Set(prev)
        newSet.delete(photoId)
        return newSet
      })
    }, 2000)

    setProcessingPhotoId(null)
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
        return "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/50"
      case "medium":
        return "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-700 dark:text-amber-400 border-amber-500/50"
      case "low":
        return "bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-700 dark:text-slate-400 border-slate-500/50"
    }
  }

  const getConfidenceIcon = (confidence: "high" | "medium" | "low") => {
    return confidence === "high" ? "✨" : confidence === "medium" ? "⭐" : "💫"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex flex-col items-center justify-center py-32">
            {/* Animated gradient icon */}
            <div className="relative mb-6">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#FF6B35] via-[#E0338E] to-[#9D4EDD] flex items-center justify-center shadow-glow animate-pulse">
                <Wand2 className="h-12 w-12 text-white animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FF6B35] via-[#E0338E] to-[#9D4EDD] rounded-2xl blur opacity-30 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI is Analyzing Your Photos
            </h3>
            <p className="text-sm text-muted-foreground">Generating smart album suggestions...</p>

            {/* Progress indicator */}
            <div className="mt-6 w-64 h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF6B35] via-[#E0338E] to-[#9D4EDD] rounded-full animate-pulse"
                style={{
                  width: '100%',
                  animation: 'progress 2s ease-in-out infinite'
                }}
              />
            </div>

            <style jsx>{`
              @keyframes progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8 pb-16">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#FF6B35] via-[#E0338E] to-[#9D4EDD] flex items-center justify-center shadow-glow">
              <Wand2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI Organize
              </h1>
              <p className="text-muted-foreground mt-1">
                {suggestions.length > 0
                  ? `${suggestions.length} photo${suggestions.length > 1 ? 's' : ''} ready for smart organization`
                  : "All photos are organized! Check back later for new suggestions."
                }
              </p>
            </div>
          </div>

          {/* Info Card */}
          {suggestions.length > 0 && (
            <div className="mt-6 glass-effect rounded-2xl p-5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">AI-Powered Suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI has analyzed your photos and albums to suggest the best matches. Review each suggestion and add photos with one click.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {suggestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-6">
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                <Check className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E0338E] flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">
              All Caught Up!
            </h3>
            <p className="text-muted-foreground max-w-md text-lg">
              Your photos are perfectly organized. New AI suggestions will appear here when you add more photos.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {suggestions.map((suggestion, index) => {
              const isAnimated = animatedSuggestions.has(suggestion.photo.id)
              const wasRecentlyAdded = recentlyAdded.has(suggestion.photo.id)

              return (
                <div
                  key={suggestion.photo.id}
                  className={cn(
                    "glass-effect rounded-2xl p-6 border border-border/50 transition-all duration-500",
                    "hover:shadow-layered hover:border-primary/30",
                    isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                    wasRecentlyAdded && "ring-2 ring-emerald-500/50 shadow-glow"
                  )}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-6 flex-col md:flex-row">
                    {/* Photo Preview */}
                    <div className="relative md:w-56 md:h-56 w-full h-64 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group">
                      <div onClick={() => onPhotoClick?.(suggestion.photo)} className="relative w-full h-full">
                        <Image
                          src={suggestion.photo.url || "/placeholder.svg"}
                          alt={suggestion.photo.location}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* View icon on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                            <ArrowRight className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </div>

                      {/* Photo badge */}
                      <div className="absolute top-3 left-3 glass-effect-dark px-3 py-1.5 rounded-lg border border-white/20">
                        <p className="text-xs font-semibold text-white">
                          {suggestion.suggestedAlbums.length} {suggestion.suggestedAlbums.length === 1 ? 'match' : 'matches'}
                        </p>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-5">
                        <h3 className="font-bold text-xl mb-1.5 text-foreground">{suggestion.photo.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                          {suggestion.photo.location}
                        </p>
                        {suggestion.assignedAlbums.length > 0 && (
                          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                              Added to {suggestion.assignedAlbums.length} album{suggestion.assignedAlbums.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {suggestion.suggestedAlbums.map((albumSuggestion, albumIndex) => (
                          <div
                            key={albumSuggestion.album.id}
                            className={cn(
                              "group/album flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                              "bg-gradient-to-r from-muted/40 to-muted/20 border border-border/40",
                              "hover:border-primary/50 hover:shadow-md hover:from-primary/5 hover:to-accent/5"
                            )}
                            style={{
                              animationDelay: `${(index * 100) + (albumIndex * 50)}ms`,
                            }}
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 group-hover/album:from-primary/30 group-hover/album:to-accent/30 transition-all duration-300">
                                <FolderPlus className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                  <h4 className="font-semibold text-foreground">{albumSuggestion.album.title}</h4>
                                  <Badge className={cn(
                                    "text-xs font-medium border",
                                    getConfidenceBadgeColor(albumSuggestion.confidence)
                                  )}>
                                    <span className="mr-1">{getConfidenceIcon(albumSuggestion.confidence)}</span>
                                    {albumSuggestion.confidence}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">{albumSuggestion.reason}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRejectSuggestion(suggestion.photo.id, albumSuggestion.album.id)}
                                className="h-9 w-9 p-0 hover:bg-red-500/10 hover:text-red-600 transition-all duration-300 hover:scale-110 hover:rotate-90"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAssignToAlbum(suggestion.photo.id, albumSuggestion.album.id)}
                                disabled={processingPhotoId === suggestion.photo.id}
                                className={cn(
                                  "relative overflow-hidden group bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold",
                                  "hover:shadow-glow transition-all duration-300",
                                  processingPhotoId === suggestion.photo.id
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:scale-110 active:scale-95"
                                )}
                              >
                                {/* Shimmer effect on hover */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                                {/* Pulse rings on hover */}
                                <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute inset-0 rounded-md bg-white/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                                </div>

                                <span className="relative z-10 flex items-center">
                                  {processingPhotoId === suggestion.photo.id ? (
                                    <>
                                      <Sparkles className="h-4 w-4 mr-1.5 animate-spin" />
                                      Adding...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="h-4 w-4 mr-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                                      <span className="transition-transform duration-300 group-hover:translate-x-0.5">Add</span>
                                    </>
                                  )}
                                </span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
