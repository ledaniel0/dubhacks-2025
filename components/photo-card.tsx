"use client"

import { memo } from "react"
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

function PhotoCardComponent({ photo, isLiked, onToggleLike, onPhotoClick }: PhotoCardProps) {
  return (
    <div
      onClick={() => onPhotoClick?.(photo)}
      className="group relative aspect-square overflow-hidden rounded-3xl bg-card border border-border/50 cursor-pointer transition-all duration-300 hover:shadow-layered-hover hover:border-primary/30"
      style={{ contentVisibility: 'auto' }}
    >
      <img
        src={photo.url || "/placeholder.svg"}
        alt={photo.name}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}

export const PhotoCard = memo(PhotoCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.photo.id === nextProps.photo.id &&
    prevProps.isLiked === nextProps.isLiked &&
    prevProps.onToggleLike === nextProps.onToggleLike &&
    prevProps.onPhotoClick === nextProps.onPhotoClick
  )
})
