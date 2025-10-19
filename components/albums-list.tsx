"use client"

import { Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { albums } from "@/lib/photo-data"
import { AlbumCard } from "./album-card"

interface AlbumsListProps {
  onAlbumClick: (albumId: number) => void
  isPinterestStyle?: boolean
}

export function AlbumsList({ onAlbumClick, isPinterestStyle = false }: AlbumsListProps) {
  const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null)

  if (isPinterestStyle) {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6" style={{ columnFill: "balance" }}>
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            onClick={() => onAlbumClick(album.id)}
            isHovered={hoveredAlbum === album.id}
            onHoverChange={(hovered) => setHoveredAlbum(hovered ? album.id : null)}
            variant="pinterest"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">My Albums</h1>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <Plus className="h-5 w-5 mr-2" />
            New Album
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onClick={() => onAlbumClick(album.id)}
              isHovered={hoveredAlbum === album.id}
              onHoverChange={(hovered) => setHoveredAlbum(hovered ? album.id : null)}
              variant="grid"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
