"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Photo } from "@/lib/types"

interface RecentPhotosProps {
  onViewAll?: () => void
  onPhotoClick?: (photo: Photo) => void
}

// Fisher-Yates shuffle algorithm with seed for deterministic results
function shuffleArrayWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  let random = seed
  
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280
    return random / 233280
  }
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function RecentPhotos({ onViewAll, onPhotoClick }: RecentPhotosProps) {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([])
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([])
  const [animatedPhotos, setAnimatedPhotos] = useState<Set<number>>(new Set())
  const [fadingPhotos, setFadingPhotos] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [availablePhotoIndices, setAvailablePhotoIndices] = useState<number[]>([])

  useEffect(() => {
    // Fetch photos from API
    async function fetchPhotos() {
      try {
        setIsLoading(true)
        const response = await fetch('/api/photos')
        const data = await response.json()
        const photos: Photo[] = data.photos || []

        setAllPhotos(photos)

        // Initialize with random 13 photos
        const seed = Date.now()
        const initialPhotos = shuffleArrayWithSeed(photos, seed).slice(0, 13)
        setDisplayedPhotos(initialPhotos)

        // Create pool of available indices (excluding initial 13)
        const usedIds = new Set(initialPhotos.map(p => p.id))
        const available = photos
          .map((_, index) => index)
          .filter(index => !usedIds.has(photos[index].id))
        setAvailablePhotoIndices(available)
      } catch (error) {
        console.error('Error fetching photos:', error)
        setDisplayedPhotos([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  // Initial fade-in animation
  useEffect(() => {
    if (displayedPhotos.length === 0) return

    displayedPhotos.forEach((photo, index) => {
      setTimeout(() => {
        setAnimatedPhotos((prev) => new Set(prev).add(photo.id))
      }, index * 50)
    })
  }, [displayedPhotos.length])

  // Continuous photo rotation
  useEffect(() => {
    if (displayedPhotos.length === 0 || allPhotos.length <= 13) return

    let currentAvailableIndices = [...availablePhotoIndices]

    const rotatePhoto = () => {
      // Pick a random slot (0-12) to replace
      const slotToReplace = Math.floor(Math.random() * 13)
      const photoToReplace = displayedPhotos[slotToReplace]

      // Get currently displayed photo IDs
      const currentlyDisplayedIds = new Set(displayedPhotos.map(p => p.id))

      // If no more available photos, reset the pool (excluding currently displayed)
      if (currentAvailableIndices.length === 0) {
        currentAvailableIndices = allPhotos
          .map((_, index) => index)
          .filter(index => !currentlyDisplayedIds.has(allPhotos[index].id))
        setAvailablePhotoIndices(currentAvailableIndices)
      }

      // Filter out any photos that are currently displayed to prevent duplicates
      const availableNonDisplayed = currentAvailableIndices.filter(
        index => !currentlyDisplayedIds.has(allPhotos[index].id)
      )

      // If we somehow don't have any available photos (shouldn't happen), reset
      if (availableNonDisplayed.length === 0) {
        currentAvailableIndices = allPhotos
          .map((_, index) => index)
          .filter(index => !currentlyDisplayedIds.has(allPhotos[index].id))
        return
      }

      // Pick a random photo from available pool that isn't currently displayed
      const randomAvailableIndex = Math.floor(Math.random() * availableNonDisplayed.length)
      const newPhotoIndex = availableNonDisplayed[randomAvailableIndex]
      const newPhoto = allPhotos[newPhotoIndex]

      // Remove used index from available pool
      const indexInPool = currentAvailableIndices.indexOf(newPhotoIndex)
      if (indexInPool !== -1) {
        currentAvailableIndices.splice(indexInPool, 1)
      }

      // Start fade out animation (slower)
      setFadingPhotos((prev) => new Set(prev).add(photoToReplace.id))
      setAnimatedPhotos((prev) => {
        const newSet = new Set(prev)
        newSet.delete(photoToReplace.id)
        return newSet
      })

      // After fade out completes, swap the photo and fade in
      setTimeout(() => {
        setDisplayedPhotos((prev) => {
          const newPhotos = [...prev]
          newPhotos[slotToReplace] = newPhoto
          return newPhotos
        })

        setFadingPhotos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(photoToReplace.id)
          return newSet
        })

        // Fade in new photo (slower)
        setTimeout(() => {
          setAnimatedPhotos((prev) => new Set(prev).add(newPhoto.id))
        }, 100)

        // Add old photo back to available pool
        const oldPhotoIndex = allPhotos.findIndex(p => p.id === photoToReplace.id)
        if (oldPhotoIndex !== -1 && !currentAvailableIndices.includes(oldPhotoIndex)) {
          currentAvailableIndices.push(oldPhotoIndex)
        }
      }, 800) // Slower fade out duration
    }

    // Start rotating photos with balanced timing
    // Each photo changes every 4-7 seconds
    const scheduleNextRotation = () => {
      const randomDelay = 4000 + Math.random() * 2000 // 2-4 seconds
      return setTimeout(() => {
        rotatePhoto()
        scheduleNextRotation() // Schedule next rotation
      }, randomDelay)
    }

    const timeoutId = scheduleNextRotation()

    return () => clearTimeout(timeoutId)
  }, [displayedPhotos, allPhotos, availablePhotoIndices])
  
  // Show loading state or don't render until photos are loaded
  if (isLoading || displayedPhotos.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-8 pt-2 pb-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Memories
          </h2>
        </div>
        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 md:gap-3 auto-rows-[100px] md:auto-rows-[150px] lg:auto-rows-[200px]">
          {Array.from({ length: 13 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              style={{
                gridColumn: `span 2`,
                gridRow: `span 1`,
              }}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-8 pt-2 pb-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Memories
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
        {displayedPhotos.map((photo, index) => {
          const isAnimated = animatedPhotos.has(photo.id)
          const isFading = fadingPhotos.has(photo.id)

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
              key={`${photo.id}-${index}`}
              onClick={() => onPhotoClick?.(photo)}
              className={`
                group relative overflow-hidden rounded-3xl bg-muted cursor-pointer
                transition-all duration-700 ease-in-out
                col-span-${colSpan} row-span-${rowSpan}
                ${isAnimated && !isFading ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-90"}
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
