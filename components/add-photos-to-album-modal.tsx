"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FolderOpen, Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Album } from "@/lib/types"

interface AddPhotosToAlbumModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPhotoIds: number[]
  onAddToAlbum?: (albumId: number) => void
}

export function AddPhotosToAlbumModal({ isOpen, onClose, selectedPhotoIds, onAddToAlbum }: AddPhotosToAlbumModalProps) {
  const [albums, setAlbums] = useState<Album[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchAlbums()
    }
  }, [isOpen])

  const fetchAlbums = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/albums')
      const data = await response.json()
      setAlbums(data.albums || [])
    } catch (error) {
      console.error('Error fetching albums:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddToAlbum = () => {
    if (selectedAlbumId !== null) {
      onAddToAlbum?.(selectedAlbumId)
      handleClose()
    }
  }

  const handleClose = () => {
    setSelectedAlbumId(null)
    setSearchQuery("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-2xl glass-effect border-border/50 max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FF6B35] via-[#E0338E] to-[#9D4EDD] flex items-center justify-center shadow-glow">
              <FolderOpen className="h-7 w-7 text-white" />
            </div>
            Add to Album
          </DialogTitle>
          <DialogDescription>
            Add {selectedPhotoIds.length} photo{selectedPhotoIds.length > 1 ? 's' : ''} to an existing album
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search albums..."
              className="pl-10"
            />
          </div>

          {/* Albums List */}
          <div className="flex-1 overflow-y-auto -mx-6 px-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : filteredAlbums.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "No albums found" : "No albums yet. Create one first!"}
                </p>
              </div>
            ) : (
              <div className="space-y-2 pb-4">
                {filteredAlbums.map((album) => {
                  const isSelected = selectedAlbumId === album.id

                  return (
                    <button
                      key={album.id}
                      onClick={() => setSelectedAlbumId(album.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
                        isSelected
                          ? "bg-gradient-to-r from-primary/20 to-accent/20 border-primary/40 shadow-lg"
                          : "bg-muted/30 border-border/30 hover:border-primary/30 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn(
                        "h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0",
                        isSelected
                          ? "bg-gradient-to-br from-primary to-accent"
                          : "bg-muted"
                      )}>
                        <FolderOpen className={cn(
                          "h-6 w-6",
                          isSelected ? "text-white" : "text-muted-foreground"
                        )} />
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <h3 className="font-semibold truncate">{album.title}</h3>
                        {album.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {album.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {album.photoIds.length} photo{album.photoIds.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      {isSelected && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleAddToAlbum}
            disabled={selectedAlbumId === null}
            className={cn(
              "animated-gradient text-primary-foreground transition-all duration-300 font-semibold",
              selectedAlbumId === null ? "opacity-50" : "hover:shadow-glow hover:scale-105"
            )}
          >
            <Check className="h-4 w-4 mr-2" />
            Add to Album
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
