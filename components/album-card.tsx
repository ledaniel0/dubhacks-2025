"use client"

import { FolderOpen, MoreVertical, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Album } from "@/lib/types"
import { getAlbumThumbnails } from "@/lib/photo-data"

interface AlbumCardProps {
  album: Album
  onClick: () => void
  isHovered: boolean
  onHoverChange: (hovered: boolean) => void
  variant?: "grid" | "pinterest"
}

export function AlbumCard({ album, onClick, isHovered, onHoverChange, variant = "grid" }: AlbumCardProps) {
  const thumbnails = getAlbumThumbnails(album.photoIds)

  if (variant === "pinterest") {
    return (
      <div
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        className="break-inside-avoid mb-6"
      >
        <div
          className={cn(
            "group relative overflow-hidden rounded-3xl bg-card/80 glass-effect border border-border/50 transition-all duration-300",
            isHovered ? "scale-[1.02] shadow-layered-hover border-primary/30" : "shadow-layered",
          )}
        >
          <button onClick={onClick} className="w-full text-left">
            {/* Pinterest-style grid: one large image on left, two smaller stacked on right */}
            <div className="relative overflow-hidden bg-muted rounded-2xl" style={{ height: "200px" }}>
              <div className="flex h-full gap-1">
                {/* Large image on left (2/3 width) */}
                <div className="flex-[2] relative overflow-hidden rounded-l-2xl bg-muted">
                  <img
                    src={thumbnails[0] || "/placeholder.svg"}
                    alt={album.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Two smaller images stacked on right (1/3 width) */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex-1 relative overflow-hidden rounded-tr-2xl bg-muted">
                    <img
                      src={thumbnails[1] || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 relative overflow-hidden rounded-br-2xl bg-muted">
                    <img
                      src={thumbnails[2] || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                {album.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">{album.owner || "You"}</span>
                <span>•</span>
                <span>{album.photoIds.length} {album.photoIds.length === 1 ? "photo" : "photos"}</span>
              </div>
            </div>
          </button>

          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 glass-effect border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Album
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Album
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    )
  }

  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        <div
          onMouseEnter={() => onHoverChange(true)}
          onMouseLeave={() => onHoverChange(false)}
          className={cn(
            "group relative overflow-hidden rounded-2xl bg-card border border-border p-4 transition-all duration-300",
            isHovered ? "scale-[1.02] shadow-xl border-primary/30" : "shadow-sm hover:shadow-lg",
          )}
        >
          <button onClick={onClick} className="w-full text-left">
            <div className="grid grid-cols-2 gap-2 mb-4 aspect-square">
              {thumbnails.map((thumb, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg bg-muted">
                  <img src={thumb || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1">{album.title}</h3>
                {album.description && <p className="text-sm text-muted-foreground mb-2">{album.description}</p>}
                <Badge variant="secondary" className="text-xs">
                  {album.photoIds.length} photos
                </Badge>
              </div>
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          </button>

          <div className="absolute top-6 right-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Album
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Album
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="right" className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{album.title}</h4>
          {album.description && <p className="text-sm text-muted-foreground">{album.description}</p>}
          <p className="text-sm text-muted-foreground">Created on {album.createdAt}</p>
          <p className="text-xs text-muted-foreground">Last updated {album.updatedAt}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
