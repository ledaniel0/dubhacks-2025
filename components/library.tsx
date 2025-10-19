"use client"

import { Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { photoLibrary } from "@/lib/photo-data"
import { PhotoCard } from "./photo-card"

type SortOption = "date-desc" | "date-asc" | "name-asc" | "name-desc" | "location" | "liked"

const sortOptions = [
  { value: "date-desc" as SortOption, label: "Date (Newest First)" },
  { value: "date-asc" as SortOption, label: "Date (Oldest First)" },
  { value: "name-asc" as SortOption, label: "Name (A-Z)" },
  { value: "name-desc" as SortOption, label: "Name (Z-A)" },
  { value: "location" as SortOption, label: "Location" },
  { value: "liked" as SortOption, label: "Liked Photos First" },
]

export function Library() {
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(
    new Set(photoLibrary.filter((p) => p.liked).map((p) => p.id)),
  )
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")

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

  const sortedPhotos = [...photoLibrary].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "name-asc":
        return a.name.localeCompare(b.name)
      case "name-desc":
        return b.name.localeCompare(a.name)
      case "location":
        return a.location.localeCompare(b.location)
      case "liked":
        const aLiked = likedPhotos.has(a.id) ? 1 : 0
        const bLiked = likedPhotos.has(b.id) ? 1 : 0
        return bLiked - aLiked
      default:
        return 0
    }
  })

  const currentSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || "Date (Newest First)"

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">Library</h1>
            <p className="text-muted-foreground">{photoLibrary.length} photos in your collection</p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {currentSortLabel}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={sortBy === option.value ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sortedPhotos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} isLiked={likedPhotos.has(photo.id)} onToggleLike={toggleLike} />
          ))}
        </div>
      </div>
    </div>
  )
}
