"use client"

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { photoLibrary } from "@/lib/photo-data"
import { cn } from "@/lib/utils"
import type { Photo } from "@/lib/types"

interface RecentPhotosProps {
  onViewAll?: () => void
  onPhotoClick?: (photo: Photo) => void
  refreshTrigger?: number
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

export function RecentPhotos({ onViewAll, onPhotoClick, refreshTrigger }: RecentPhotosProps) {
  const [allPhotos, setAllPhotos] = useState<Photo[]>(photoLibrary)
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([])
  const [animatedPhotos, setAnimatedPhotos] = useState<Set<number>>(new Set())
  const [fadingPhotos, setFadingPhotos] = useState<Set<number>>(new Set())
  const [availablePhotoIndices, setAvailablePhotoIndices] = useState<number[]>([])

  // Initialize with static data immediately - no delay!
  useEffect(() => {
    const seed = Date.now()
    const initialPhotos = shuffleArrayWithSeed(photoLibrary, seed).slice(0, 12)
    setDisplayedPhotos(initialPhotos)

    // Create pool of available indices (excluding initial 12)
    const usedIds = new Set(initialPhotos.map(p => p.id))
    const available = photoLibrary
      .map((_, index) => index)
      .filter(index => !usedIds.has(photoLibrary[index].id))
    setAvailablePhotoIndices(available)
  }, [])

  // Fetch fresh data from API in background
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/api/photos')
        const data = await response.json()
        const photos: Photo[] = data.photos || []

        // Update allPhotos for rotation, but don't replace displayed photos
        setAllPhotos(photos)

        // Update available pool with fresh data
        const usedIds = new Set(displayedPhotos.map(p => p.id))
        const available = photos
          .map((_, index) => index)
          .filter(index => !usedIds.has(photos[index].id))
        setAvailablePhotoIndices(available)
      } catch (error) {
        console.error('Error fetching photos:', error)
      }
    }

    fetchPhotos()
  }, [refreshTrigger])

  // Initial fade-in animation - faster stagger for instant feel
  useEffect(() => {
    if (displayedPhotos.length === 0) return

    displayedPhotos.forEach((photo, index) => {
      setTimeout(() => {
        setAnimatedPhotos((prev) => new Set(prev).add(photo.id))
        console.log(`Animating photo ${photo.id} at index ${index}`)
      }, index * 30) // Reduced from 100ms to 30ms - 390ms total
    })
  }, [displayedPhotos.length])

  // Continuous photo rotation
  useEffect(() => {
    if (displayedPhotos.length === 0 || allPhotos.length <= 12) return

    let currentAvailableIndices = [...availablePhotoIndices]
    let isRotating = false

    const rotatePhoto = () => {
      if (isRotating) return
      isRotating = true

      // Pick a random slot (0-11) to replace
      const slotToReplace = Math.floor(Math.random() * 12)
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
        isRotating = false
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
      console.log(`Fading out photo ${photoToReplace.id}`)
      setFadingPhotos((prev) => {
        const newSet = new Set(prev)
        newSet.add(photoToReplace.id)
        console.log(`Fading photos set:`, Array.from(newSet))
        return newSet
      })
      setAnimatedPhotos((prev) => {
        const newSet = new Set(prev)
        newSet.delete(photoToReplace.id)
        console.log(`Animated photos set:`, Array.from(newSet))
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
          console.log(`Cleared fading photos set:`, Array.from(newSet))
          return newSet
        })

        // Fade in new photo (slower, more gradual)
        setTimeout(() => {
          console.log(`Fading in photo ${newPhoto.id}`)
          setAnimatedPhotos((prev) => {
            const newSet = new Set(prev)
            newSet.add(newPhoto.id)
            console.log(`Added to animated photos set:`, Array.from(newSet))
            return newSet
          })
        }, 200)

        // Add old photo back to available pool
        const oldPhotoIndex = allPhotos.findIndex(p => p.id === photoToReplace.id)
        if (oldPhotoIndex !== -1 && !currentAvailableIndices.includes(oldPhotoIndex)) {
          currentAvailableIndices.push(oldPhotoIndex)
        }
        
        isRotating = false
      }, 1500) // Slower fade out duration - 1.5 seconds
    }

    // Start rotating photos with very fast timing
    const scheduleNextRotation = () => {
      const randomDelay = 6000 + Math.random() * 4000
      return setTimeout(() => {
        rotatePhoto()
        scheduleNextRotation() // Schedule next rotation
      }, randomDelay)
    }

    const timeoutId = scheduleNextRotation()

    return () => clearTimeout(timeoutId)
  }, [allPhotos.length]) // Only depend on allPhotos.length, not the full arrays

  // No loading state needed - photos appear instantly!
  return (
    <section className="max-w-7xl mx-auto px-8 py-2" data-section="memories">
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1.5 md:gap-2.5 auto-rows-[95px] md:auto-rows-[140px] lg:auto-rows-[170px]">
        {displayedPhotos.map((photo, index) => {
          const isAnimated = animatedPhotos.has(photo.id)
          const isFading = fadingPhotos.has(photo.id)
          
          // Debug logging
          if (index === 0) {
            console.log(`Photo ${photo.id}: isAnimated=${isAnimated}, isFading=${isFading}`)
          }

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
          else if (index === 9) { colSpan = 3; rowSpan = 1 }  // Medium
          else if (index === 10) { colSpan = 3; rowSpan = 1 } // Medium
          else if (index === 11) { colSpan = 2; rowSpan = 1 } // Small
          else if (index === 12) { colSpan = 3; rowSpan = 1 } // Medium
          else { colSpan = 2; rowSpan = 1 }

          return (
            <div
              key={`${photo.id}-${index}`}
              onClick={() => onPhotoClick?.(photo)}
              className={cn(
                "group relative overflow-hidden rounded-3xl bg-muted cursor-pointer transition-all duration-500 ease-in-out",
                `col-span-${colSpan} row-span-${rowSpan}`,
                isAnimated && !isFading ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              )}
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.12)",
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
                opacity: isAnimated && !isFading ? 1 : 0,
                transform: isAnimated && !isFading ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
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
        
        {/* More Photos Button - Last item in grid */}
        <div 
          className="col-span-2 row-span-1 relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-dashed border-primary/40 cursor-pointer transition-all duration-300 hover:border-primary hover:bg-gradient-to-br hover:from-primary/30 hover:to-accent/30 hover:scale-105 group"
          onClick={onViewAll}
        >
          <div className="absolute inset-0 bg-background/20 backdrop-blur-sm"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
            <div className="bg-primary/20 rounded-full p-3 mb-2 group-hover:bg-primary/30 transition-colors duration-300">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors duration-300">
              More Photos
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
