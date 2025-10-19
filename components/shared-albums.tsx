"use client"

import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sharedAlbums } from "@/lib/photo-data"
import { SharedAlbumCard } from "./shared-album-card"

interface SharedAlbumsProps {
  onAlbumClick: (id: number) => void
  onCreateSharedAlbum?: () => void
}

export function SharedAlbums({ onAlbumClick, onCreateSharedAlbum }: SharedAlbumsProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shared Albums</h1>
          </div>
          <Button 
            onClick={onCreateSharedAlbum}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity duration-200"
          >
            <Users className="h-4 w-4 mr-2" />
            Create Shared Album
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sharedAlbums.map((album) => (
            <SharedAlbumCard key={album.id} album={album} onClick={() => onAlbumClick(album.id)} />
          ))}
        </div>
      </div>
    </div>
  )
}
