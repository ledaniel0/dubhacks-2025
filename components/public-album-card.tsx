"use client"

import { MapPin, Users, ImageIcon, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PublicAlbum } from "@/lib/types"
import { getPublicAlbumCoverPhoto } from "@/lib/photo-data"

interface PublicAlbumCardProps {
  album: PublicAlbum
  onClick: () => void
  onViewAlbum?: (album: PublicAlbum) => void
  variant?: "grid" | "compact"
}

export function PublicAlbumCard({ album, onClick, onViewAlbum, variant = "grid" }: PublicAlbumCardProps) {
  const isEmpty = album.photoCount === 0
  const coverPhoto = !isEmpty && album.photoIds.length > 0 ? getPublicAlbumCoverPhoto(album.photoIds[0]) : null

  if (variant === "compact") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "group relative overflow-hidden rounded-3xl bg-card/80 glass-effect border border-border/50 transition-all duration-300 cursor-pointer",
          "hover:scale-[1.02] hover:shadow-layered-hover hover:border-primary/30"
        )}
      >
        <div className="p-6">
          {/* Location Icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200 truncate">
                {album.title}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {album.location}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{album.contributorCount}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              <span>{album.photoCount} photos</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            size="sm"
            variant={isEmpty ? "default" : "outline"}
            className={cn(
              "w-full transition-all duration-300",
              isEmpty && "animated-gradient text-primary-foreground"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isEmpty ? "Be the First to Add" : "Add Photos"}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-3xl bg-card/80 glass-effect border border-border/50 transition-all duration-300 cursor-pointer",
        "hover:scale-[1.02] hover:shadow-layered-hover hover:border-primary/30"
      )}
    >
      {/* Cover Image or Placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
        {isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-3">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">No photos yet</p>
          </div>
        ) : (
          <img
            src={coverPhoto?.url || "/placeholder.svg"}
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags Badge */}
        {album.tags.length > 0 && (
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="glass-effect border-0 text-xs">
              {album.tags[0]}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col min-h-[200px]">
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
          {album.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span>{album.location}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
          {album.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{album.contributorCount} {album.contributorCount === 1 ? 'contributor' : 'contributors'}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4" />
            <span>{album.photoCount}</span>
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow" />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation()
              onViewAlbum?.(album)
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Album
          </Button>
          <Button
            size="sm"
            variant={isEmpty ? "default" : "outline"}
            className={cn(
              "flex-1 transition-all duration-300",
              isEmpty && "animated-gradient text-primary-foreground pulse-glow"
            )}
            onClick={(e) => {
              e.stopPropagation()
              onClick()
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isEmpty ? "Add Photos" : "Add Photos"}
          </Button>
        </div>
      </div>
    </div>
  )
}
