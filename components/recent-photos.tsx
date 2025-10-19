"use client"

import { photoLibrary } from "@/lib/photo-data"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RecentPhotosProps {
  onViewAll?: () => void
}

export function RecentPhotos({ onViewAll }: RecentPhotosProps) {
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
      <div className="grid grid-cols-12 gap-3 auto-rows-[200px]">
        {recentPhotos.map((photo, index) => {
          const isAnimated = animatedPhotos.has(photo.id)

          // Define photo sizes and positions to perfectly fill 12 cols × 4 rows
          // Row 1: 2-col + 2-col + 4-col = 8 cols
          // Row 2: 4-col (tall) + 3-col + 3-col + (4-col continues from row 1-2) = 12 cols
          // Row 3: (4-col continues) + 3-col + 2-col + 2-col = 11 cols

          let colSpan = 2
          let rowSpan = 1

          if (index === 0) { colSpan = 2; rowSpan = 1 }       // Row 1, cols 1-2
          else if (index === 1) { colSpan = 2; rowSpan = 1 }  // Row 1, cols 3-4
          else if (index === 2) { colSpan = 4; rowSpan = 2 }  // Row 1-2, cols 5-8
          else if (index === 3) { colSpan = 4; rowSpan = 2 }  // Row 1-2, cols 9-12
          else if (index === 4) { colSpan = 4; rowSpan = 2 }  // Row 2-3, cols 1-4 (MOVED DOWN)
          else if (index === 5) { colSpan = 3; rowSpan = 1 }  // Row 2, cols 9-11
          else if (index === 6) { colSpan = 3; rowSpan = 1 }  // Row 3, cols 5-7
          else if (index === 7) { colSpan = 2; rowSpan = 1 }  // Row 3, cols 8-9
          else if (index === 8) { colSpan = 2; rowSpan = 1 }  // Row 3, cols 10-11
          else if (index === 9) { colSpan = 2; rowSpan = 1 }  // Row 4, cols 1-2
          else if (index === 10) { colSpan = 3; rowSpan = 1 } // Row 4, cols 3-5
          else if (index === 11) { colSpan = 2; rowSpan = 1 } // Row 4, cols 6-7
          else if (index === 12) { colSpan = 3; rowSpan = 1 } // Row 4, cols 8-10 (new photo, width 3)
          else { colSpan = 2; rowSpan = 1 }

          return (
            <div
              key={photo.id}
              className={`
                group relative overflow-hidden rounded-3xl bg-muted cursor-pointer
                transition-all duration-500 hover:scale-[1.03] magnetic-hover
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
                className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-500">
                <div className="glass-effect-dark rounded-xl p-3 border border-white/20 backdrop-blur-xl">
                  <p className="text-sm font-semibold truncate text-white mb-1">{photo.location}</p>
                  <p className="text-xs text-white/90">{photo.date}</p>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
            </div>
          )
        })}
      </div>
    </section>
  )
}
