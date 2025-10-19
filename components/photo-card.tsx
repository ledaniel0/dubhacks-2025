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
    <div
      onClick={() => onPhotoClick?.(photo)}
      className="group relative aspect-square overflow-hidden rounded-3xl bg-card border border-border/50 cursor-pointer transition-all duration-300 hover:shadow-layered-hover hover:border-primary/30"
    >
      <img
        src={photo.url || "/placeholder.svg"}
        alt={photo.name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
    </div>
  )
}
