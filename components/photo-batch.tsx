"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Check, FolderPlus, CheckSquare, Square, X, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { Photo } from "@/lib/types"

interface PhotoBatchProps {
  photos: Photo[]
  searchQuery: string
  onClearSearch: () => void
  onAlbumCreated?: (title: string, description: string, photoIds: number[]) => void
}

export function PhotoBatch({ photos, searchQuery, onClearSearch, onAlbumCreated }: PhotoBatchProps) {
  const [animatedPhotos, setAnimatedPhotos] = useState<Set<number>>(new Set())
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<number[]>([])
  const [isCreateAlbumDialogOpen, setIsCreateAlbumDialogOpen] = useState(false)
  const [albumTitle, setAlbumTitle] = useState("")
  const [albumDescription, setAlbumDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [prevCount, setPrevCount] = useState(0)

  useEffect(() => {
    // Staggered animation for photo appearance
    photos.forEach((photo, index) => {
      setTimeout(() => {
        setAnimatedPhotos((prev) => new Set(prev).add(photo.id))
      }, index * 50)
    })
  }, [photos])

  useEffect(() => {
    // Trigger animation when count changes
    if (selectedPhotoIds.length !== prevCount) {
      setPrevCount(selectedPhotoIds.length)
    }
  }, [selectedPhotoIds.length, prevCount])

  const isSelected = (id: number) => selectedPhotoIds.includes(id)

  const handlePhotoClick = (photoId: number, index: number, event: React.MouseEvent) => {
    if (event.shiftKey && lastSelectedIndex !== null) {
      // Shift-click: select range
      const start = Math.min(lastSelectedIndex, index)
      const end = Math.max(lastSelectedIndex, index)
      const rangeIds = photos.slice(start, end + 1).map((p) => p.id)
      const newSelection = [...new Set([...selectedPhotoIds, ...rangeIds])]
      setSelectedPhotoIds(newSelection)
    } else if (event.metaKey || event.ctrlKey) {
      // Cmd/Ctrl-click: toggle individual
      if (isSelected(photoId)) {
        setSelectedPhotoIds(selectedPhotoIds.filter((id) => id !== photoId))
      } else {
        setSelectedPhotoIds([...selectedPhotoIds, photoId])
      }
      setLastSelectedIndex(index)
    } else {
      // Regular click: toggle individual
      if (isSelected(photoId)) {
        setSelectedPhotoIds(selectedPhotoIds.filter((id) => id !== photoId))
      } else {
        setSelectedPhotoIds([...selectedPhotoIds, photoId])
      }
      setLastSelectedIndex(index)
    }
  }

  const handleSelectAll = () => {
    setSelectedPhotoIds(photos.map((photo) => photo.id))
  }

  const handleDeselectAll = () => {
    setSelectedPhotoIds([])
  }

  const handleCreateAlbum = () => {
    setIsCreateAlbumDialogOpen(true)
  }

  const handleAlbumSubmit = async () => {
    if (!albumTitle.trim()) return

    setIsCreating(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (onAlbumCreated) {
      onAlbumCreated(albumTitle.trim(), albumDescription.trim(), selectedPhotoIds)
    }

    setIsCreating(false)
    setIsCreateAlbumDialogOpen(false)
    setAlbumTitle("")
    setAlbumDescription("")
    setSelectedPhotoIds([])
    onClearSearch()
  }

  const handleCloseDialog = () => {
    if (!isCreating) {
      setAlbumTitle("")
      setAlbumDescription("")
      setIsCreateAlbumDialogOpen(false)
    }
  }

  const selectedPhotos = photos.filter((photo) => selectedPhotoIds.includes(photo.id))
  const allSelected = selectedPhotoIds.length === photos.length && photos.length > 0

  if (photos.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">No photos found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Try a different search query or browse your albums
          </p>
          <Button onClick={onClearSearch} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Clear Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-8 py-8 pb-32">
        <div className="mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Found {photos.length} {photos.length === 1 ? "Photo" : "Photos"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Results for &quot;{searchQuery}&quot; • Select photos to create an album
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => {
            const selected = isSelected(photo.id)
            const hovered = hoveredPhoto === photo.id
            const animated = animatedPhotos.has(photo.id)

            return (
              <button
                key={photo.id}
                onClick={(e) => handlePhotoClick(photo.id, index, e)}
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-2xl bg-card border-2 transition-all duration-300",
                  selected
                    ? "border-primary shadow-layered-hover scale-[0.98]"
                    : "border-border/50 hover:border-primary/30 hover:shadow-layered",
                  animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                )}
              >
                {/* Photo */}
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.name}
                  className={cn(
                    "h-full w-full object-cover transition-all duration-500",
                    selected ? "scale-95" : "group-hover:scale-110",
                  )}
                />

                {/* Selection Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-primary/20 transition-opacity duration-300",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />

                {/* Gradient Overlay on Hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300",
                    hovered && !selected ? "opacity-100" : "opacity-0",
                  )}
                />

                {/* Selection Checkbox */}
                <div
                  className={cn(
                    "absolute top-3 right-3 w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                    selected
                      ? "bg-primary border-primary scale-100"
                      : "bg-black/30 border-white/50 backdrop-blur-sm scale-0 group-hover:scale-100",
                  )}
                >
                  {selected && <Check className="h-5 w-5 text-white" />}
                </div>

                {/* Photo Info on Hover */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 p-4 transition-all duration-300",
                    hovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                  )}
                >
                  <div className="glass-effect-dark rounded-xl p-3 border border-white/20 backdrop-blur-xl">
                    <p className="text-sm font-semibold text-white mb-2 line-clamp-1">{photo.name}</p>
                    <div className="flex items-center gap-3 text-xs text-white/90">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{photo.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{photo.location}</span>
                      </div>
                    </div>
                    {photo.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {photo.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-white/20 text-white border-0 px-2 py-0.5"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Corner Accent */}
                <div
                  className={cn(
                    "absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-transparent rounded-bl-full transition-opacity duration-300",
                    selected ? "opacity-100" : "opacity-0",
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Batch Actions Bar */}
      <div className="fixed bottom-0 left-64 right-0 z-40 translate-y-0 opacity-100 transition-all duration-500">
        <div className="glass-effect border-t border-border/50 shadow-layered-hover">
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left side: Selection info and controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      <span
                        className={cn(
                          "inline-block transition-all duration-300",
                          selectedPhotoIds.length !== prevCount && "scale-125",
                        )}
                      >
                        {selectedPhotoIds.length}
                      </span>{" "}
                      of {photos.length} photos selected
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPhotoIds.length === 0
                        ? "Click photos to select them"
                        : selectedPhotoIds.length === 1
                          ? "Select more to create an album"
                          : "Ready to create an album"}
                    </p>
                  </div>
                </div>

                <div className="h-8 w-px bg-border" />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={allSelected ? handleDeselectAll : handleSelectAll}
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  {allSelected ? (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Select All
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSearch}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Search
                </Button>
              </div>

              {/* Right side: Create album button */}
              <Button
                onClick={handleCreateAlbum}
                disabled={selectedPhotoIds.length === 0}
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg transition-all duration-300",
                  selectedPhotoIds.length > 0
                    ? "hover:shadow-glow hover:scale-105"
                    : "opacity-50 cursor-not-allowed",
                )}
              >
                <FolderPlus className="h-5 w-5 mr-2" />
                Create Album from {selectedPhotoIds.length} {selectedPhotoIds.length === 1 ? "Photo" : "Photos"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Album Dialog */}
      <Dialog open={isCreateAlbumDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl glass-effect border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <FolderPlus className="h-6 w-6 text-primary" />
              </div>
              Create New Album
            </DialogTitle>
            <DialogDescription>
              Create an album from {selectedPhotos.length} selected {selectedPhotos.length === 1 ? "photo" : "photos"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Album Title */}
            <div className="space-y-2">
              <label htmlFor="album-title" className="text-sm font-semibold text-foreground">
                Album Title *
              </label>
              <Input
                id="album-title"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                placeholder="e.g., Summer Vacation 2024"
                className="h-12 text-base"
                disabled={isCreating}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && albumTitle.trim()) {
                    handleAlbumSubmit()
                  }
                }}
              />
            </div>

            {/* Album Description */}
            <div className="space-y-2">
              <label htmlFor="album-description" className="text-sm font-semibold text-foreground">
                Description (optional)
              </label>
              <textarea
                id="album-description"
                value={albumDescription}
                onChange={(e) => setAlbumDescription(e.target.value)}
                placeholder="Add a description for this album..."
                className="w-full h-24 px-4 py-3 text-base bg-card border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isCreating}
              />
            </div>

            {/* Photo Preview */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Selected Photos ({selectedPhotos.length})
              </label>
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 rounded-lg bg-muted/30">
                {selectedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-lg overflow-hidden border border-border/50 shadow-sm"
                  >
                    <img src={photo.url || "/placeholder.svg"} alt={photo.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="ghost" onClick={handleCloseDialog} disabled={isCreating}>
              Cancel
            </Button>
            <Button
              onClick={handleAlbumSubmit}
              disabled={!albumTitle.trim() || isCreating}
              className={cn(
                "bg-gradient-to-r from-primary to-accent text-primary-foreground transition-all duration-300",
                !albumTitle.trim() || isCreating ? "opacity-50" : "hover:shadow-glow hover:scale-105",
              )}
            >
              {isCreating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Creating Album...
                </>
              ) : (
                <>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Album
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
