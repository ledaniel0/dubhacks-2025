"use client"

import { photoLibrary } from "@/lib/photo-data"
import Image from "next/image"
import { useState, useEffect } from "react"

interface RecentPhotosProps {
  onViewAll?: () => void
}

export function RecentPhotos({ onViewAll }: RecentPhotosProps) {
  const recentPhotos = photoLibrary.slice(0, 12)
  const [animatedPhotos, setAnimatedPhotos] = useState<Set<number>>(new Set())

  useEffect(() => {
    recentPhotos.forEach((photo, index) => {
      setTimeout(() => {
        setAnimatedPhotos((prev) => new Set(prev).add(photo.id))
      }, index * 50)
    })
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Recent Photos
        </h2>
        <button
          onClick={onViewAll}
          className="text-sm font-medium text-primary hover:text-accent transition-colors duration-200"
        >
          View All →
        </button>
      </div>
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 auto-rows-[120px]">
        {recentPhotos.map((photo, index) => {
          const isLarge = index === 0 || index === 5 || index === 8
          const isMedium = index === 2 || index === 7
          const isAnimated = animatedPhotos.has(photo.id)

          return (
            <div
              key={photo.id}
              className={`
                group relative overflow-hidden rounded-3xl bg-muted cursor-pointer 
                transition-all duration-500 hover:scale-[1.03] magnetic-hover
                ${isLarge ? "col-span-3 row-span-2" : isMedium ? "col-span-2 row-span-2" : "col-span-2 row-span-1"}
                ${isAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
              `}
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.12)",
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
