"use client"

import { photoLibrary } from "@/lib/photo-data"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Photo } from "@/lib/types"

interface RecentPhotosProps {
  onViewAll?: () => void
  onPhotoClick?: (photo: Photo) => void
}

export function RecentPhotos({ onViewAll, onPhotoClick }: RecentPhotosProps) {
  const recentPhotos = photoLibrary.slice(0, 13)
  const [animatedPhotos, setAnimatedPhotos] = useState<Set<number>>(new Set())

  useEffect(() => {
    recentPhotos.forEach((photo, index) => {
      setTimeout(() => {
        setAnimatedPhotos((prev) => new Set(prev).add(photo.id))
      }, index * 50)
    })
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-8 pt-2 pb-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Recent Photos
        </h2>
        <Button
          onClick={onViewAll}
          variant="outline"
          className="border-2 border-primary/40 text-primary hover:text-primary hover:bg-gradient-to-r hover:from-[#FF6B35]/20 hover:via-[#E0338E]/20 hover:to-[#9D4EDD]/20 hover:border-primary transition-all duration-300 hover:shadow-glow hover:scale-105"
        >
          More Photos
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 md:gap-3 auto-rows-[100px] md:auto-rows-[150px] lg:auto-rows-[200px]">
        {recentPhotos.map((photo, index) => {
          const isAnimated = animatedPhotos.has(photo.id)

          // Responsive layout: scales from 6 cols (mobile) -> 8 cols (tablet) -> 12 cols (desktop)
          // Photos maintain proportional sizes across breakpoints

          let colSpan = 2
          let rowSpan = 1

          // Mobile: 6 cols, Tablet: 8 cols, Desktop: 12 cols
          if (index === 0) { colSpan = 2; rowSpan = 1 }       // Small
          else if (index === 1) { colSpan = 2; rowSpan = 1 }  // Small
          else if (index === 2) { colSpan = 4; rowSpan = 2 }  // Large
          else if (index === 3) { colSpan = 4; rowSpan = 2 }  // Large
          else if (index === 4) { colSpan = 4; rowSpan = 2 }  // Large (moved down)
          else if (index === 5) { colSpan = 3; rowSpan = 1 }  // Medium
          else if (index === 6) { colSpan = 3; rowSpan = 1 }  // Medium
          else if (index === 7) { colSpan = 2; rowSpan = 1 }  // Small
          else if (index === 8) { colSpan = 2; rowSpan = 1 }  // Small
          else if (index === 9) { colSpan = 2; rowSpan = 1 }  // Small
          else if (index === 10) { colSpan = 3; rowSpan = 1 } // Medium
          else if (index === 11) { colSpan = 2; rowSpan = 1 } // Small
          else if (index === 12) { colSpan = 3; rowSpan = 1 } // Medium
          else { colSpan = 2; rowSpan = 1 }

          return (
            <div
              key={photo.id}
              onClick={() => onPhotoClick?.(photo)}
              className={`
                group relative overflow-hidden rounded-3xl bg-muted cursor-pointer
                transition-all duration-300
                col-span-${colSpan} row-span-${rowSpan}
                ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.12)",
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
              }}
            >
              <Image
                src={photo.url || "/placeholder.svg"}
                alt={photo.location}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
