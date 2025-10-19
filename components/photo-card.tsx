"use client"

import { Calendar, MapPin, Heart, Download, Share2, MoreVertical, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import type { Photo } from "@/lib/types"

interface PhotoCardProps {
  photo: Photo
  isLiked: boolean
  onToggleLike: (id: number) => void
  onPhotoClick?: (photo: Photo) => void
}

export function PhotoCard({ photo, isLiked, onToggleLike, onPhotoClick }: PhotoCardProps) {
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div
          onClick={() => onPhotoClick?.(photo)}
          className="group relative aspect-square overflow-hidden rounded-3xl bg-card border border-border/50 cursor-pointer transition-all duration-500 hover:shadow-layered-hover hover:scale-[1.03] hover:border-primary/30 magnetic-hover"
        >
          <img
            src={photo.url || "/placeholder.svg"}
            alt={photo.name}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 glass-effect-dark hover:bg-white/40 text-white border border-white/30 shadow-lg hover:scale-110 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleLike(photo.id)
                  }}
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-300 ${isLiked ? "fill-red-500 text-red-500 scale-110" : ""}`}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 glass-effect-dark hover:bg-white/40 text-white border border-white/30 shadow-lg hover:scale-110 transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 glass-effect-dark hover:bg-white/40 text-white border border-white/30 shadow-lg hover:scale-110 transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-10 w-10 glass-effect-dark hover:bg-white/40 text-white border border-white/30 shadow-lg hover:scale-110 transition-all duration-300"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-effect border-border/50">
                  <DropdownMenuItem>
                    <Info className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>Add to Album</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-80 glass-effect border-border/50 shadow-layered-hover">
        <div className="space-y-3">
          <h4 className="font-bold text-lg text-foreground">{photo.name}</h4>
          {photo.description && <p className="text-sm text-muted-foreground leading-relaxed">{photo.description}</p>}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">{photo.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">{photo.location}</span>
            </div>
          </div>
          {photo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {photo.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium px-2.5 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {photo.camera && (
            <div className="pt-3 border-t text-xs text-muted-foreground">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium">{photo.camera}</span>
                {photo.aperture && <span>{photo.aperture}</span>}
                {photo.iso && <span>ISO {photo.iso}</span>}
                {photo.focalLength && <span>{photo.focalLength}</span>}
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
