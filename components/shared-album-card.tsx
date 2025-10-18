"use client"

import { Users, MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { SharedAlbum } from "@/lib/types"
import { getPhotoById } from "@/lib/photo-data"

interface SharedAlbumCardProps {
  album: SharedAlbum
  onClick: () => void
}

export function SharedAlbumCard({ album, onClick }: SharedAlbumCardProps) {
  const coverPhoto = album.coverPhotoId ? getPhotoById(album.coverPhotoId) : getPhotoById(album.photoIds[0])

  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden rounded-xl bg-card border border-border cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={coverPhoto?.url || "/placeholder.svg"}
          alt={album.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
            {album.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Album</DropdownMenuItem>
              {album.isOwner && <DropdownMenuItem>Manage Sharing</DropdownMenuItem>}
              <DropdownMenuItem>Download All</DropdownMenuItem>
              {!album.isOwner && <DropdownMenuItem className="text-destructive">Leave Album</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {album.description && <p className="text-sm text-muted-foreground mb-3">{album.description}</p>}

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>{album.photoIds.length} photos</span>
          <span>•</span>
          <span>{album.lastUpdated}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{album.sharedWith} people</span>
          </div>
          {album.isOwner ? (
            <Badge variant="secondary" className="text-xs">
              Owner
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">by {album.owner}</span>
          )}
        </div>
      </div>
    </div>
  )
}
