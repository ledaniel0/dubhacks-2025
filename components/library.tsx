"use client"

import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { photoLibrary } from "@/lib/photo-data"
import { PhotoCard } from "./photo-card"

export function Library() {
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(
    new Set(photoLibrary.filter((p) => p.liked).map((p) => p.id)),
  )

  const toggleLike = (id: number) => {
    setLikedPhotos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Library</h1>
            <p className="text-muted-foreground">{photoLibrary.length} photos in your collection</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Sort by Date
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photoLibrary.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} isLiked={likedPhotos.has(photo.id)} onToggleLike={toggleLike} />
          ))}
        </div>
      </div>
    </div>
  )
}
