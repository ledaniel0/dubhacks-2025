"use client"

import { ArrowLeft, Calendar, MapPin, Users, Share2, Plus, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Album } from "@/lib/types"
import { getPhotosByIds } from "@/lib/photo-data"
import { useEffect } from "react"
import Image from "next/image"

interface AlbumDetailProps {
  album: Album
  onClose: () => void
  onPhotoClick?: (photoId: number) => void
}

export function AlbumDetail({ album, onClose, onPhotoClick }: AlbumDetailProps) {
  const photos = getPhotosByIds(album.photoIds)

  useEffect(() => {
    // Disable scroll on mount
    document.body.style.overflow = 'hidden'

    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop, not on children
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm" onClick={handleBackdropClick}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 glass-effect border-b border-border/50">
        <div className="flex items-center justify-between px-8 py-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 h-full overflow-y-auto" onClick={handleBackdropClick}>
        <div className="max-w-7xl mx-auto px-8 py-8" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Photo Grid - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              {/* Album Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
                  {album.title}
                </h1>
                {album.description && (
                  <p className="text-lg text-muted-foreground">{album.description}</p>
                )}
              </div>

              {/* Masonry Grid of Photos */}
              <div className="columns-2 md:columns-3 gap-4 space-y-4">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => onPhotoClick?.(photo.id)}
                    className="break-inside-avoid cursor-pointer group"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-card border border-border/50 transition-all duration-300 hover:shadow-layered-hover hover:border-primary/30 hover:scale-[1.02]">
                      <div className="relative w-full" style={{ paddingBottom: `${(photo.height || 3000) / (photo.width || 4000) * 100}%` }}>
                        <Image
                          src={photo.url}
                          alt={photo.name}
                          fill
                          loading="lazy"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      {/* Photo Info Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-semibold text-sm mb-1">{photo.name}</p>
                          <p className="text-white/80 text-xs">{photo.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {photos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6">
                    <Plus className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">No photos yet</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Start adding photos to this album to build your collection
                  </p>
                  <Button className="animated-gradient text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Photos
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar - Album Metadata */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="glass-effect border border-border/50 rounded-2xl p-6 shadow-layered">
                  {/* Album Stats */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{album.photoIds.length}</p>
                        <p className="text-sm text-muted-foreground">Photos</p>
                      </div>
                    </div>
                  </div>

                  {/* Album Info */}
                  <div className="space-y-4 mb-6 pb-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm font-medium text-foreground">{album.createdAt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Last Updated</p>
                        <p className="text-sm font-medium text-foreground">{album.updatedAt}</p>
                      </div>
                    </div>

                    {album.owner && (
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Owner</p>
                          <p className="text-sm font-medium text-foreground">{album.owner}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button className="w-full animated-gradient text-primary-foreground">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Photos
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Album
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
