"use client"

import { ArrowRight, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicAlbumCard } from "./public-album-card"
import { publicAlbums } from "@/lib/photo-data"
import type { PublicAlbum } from "@/lib/types"

interface ExplorePreviewProps {
  onViewAll?: () => void
  onAlbumClick?: (album: PublicAlbum) => void
}

export function ExplorePreview({ onViewAll, onAlbumClick }: ExplorePreviewProps) {
  // Show first 6 albums
  const previewAlbums = publicAlbums.slice(0, 6)

  return (
    <section className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Discover Public Albums
          </h2>
        </div>
        <Button
          onClick={onViewAll}
          variant="outline"
          className="border-2 border-primary/40 text-primary hover:text-primary hover:bg-gradient-to-r hover:from-[#FF6B35]/20 hover:via-[#E0338E]/20 hover:to-[#9D4EDD]/20 hover:border-primary transition-all duration-300 hover:shadow-glow hover:scale-105 font-semibold"
        >
          View All
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      <p className="text-muted-foreground mb-8">
        Contribute your photos to community collections from landmarks and places around the world
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {previewAlbums.map((album) => (
          <PublicAlbumCard
            key={album.id}
            album={album}
            onClick={() => onAlbumClick?.(album)}
          />
        ))}
      </div>
    </section>
  )
}
