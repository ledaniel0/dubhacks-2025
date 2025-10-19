"use client"

import Image from "next/image"
import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { photoLibrary } from "@/lib/photo-data" // Removed - using API instead
import { cn } from "@/lib/utils"
import type { Photo } from "@/lib/types"

interface RecentPhotosProps {
  onViewAll?: () => void
  onPhotoClick?: (photo: Photo) => void
  refreshTrigger?: number
  resetAnimation?: number
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

export function RecentPhotos({ onViewAll, onPhotoClick, refreshTrigger, resetAnimation }: RecentPhotosProps) {
  const [allPhotos, setAllPhotos] = useState<Photo[]>([])
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([])
  const [animatedPhotos, setAnimatedPhotos] = useState<Set<number>>(new Set())
  const [fadingPhotos, setFadingPhotos] = useState<Set<number>>(new Set())
  const [availablePhotoIndices, setAvailablePhotoIndices] = useState<number[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isRotating, setIsRotating] = useState(false)

  // Store a snapshot of photos to use in the animation callback
  const displayedPhotosRef = useRef<Photo[]>([])

  // Update ref whenever displayedPhotos changes
  useEffect(() => {
    displayedPhotosRef.current = displayedPhotos
  }, [displayedPhotos])

  // Initialize with API data
  useEffect(() => {
    async function initializePhotos() {
      try {
        const response = await fetch('/api/photos')
        const data = await response.json()
        const photos: Photo[] = data.photos || []
        
        if (photos.length > 0) {
          setAllPhotos(photos)
          
          const seed = Date.now()
          const initialPhotos = shuffleArrayWithSeed(photos, seed).slice(0, 12)
          setDisplayedPhotos(initialPhotos)

          // Clear any existing animations to ensure fresh start
          setAnimatedPhotos(new Set())
          setFadingPhotos(new Set())

          // Create pool of available indices (excluding initial 12)
          const usedIds = new Set(initialPhotos.map(p => p.id))
          const available = photos
            .map((_, index) => index)
            .filter(index => !usedIds.has(photos[index].id))
          setAvailablePhotoIndices(available)
          
          setIsInitialized(true)
        }
      } catch (error) {
        console.error('Error initializing photos:', error)
      }
    }

    initializePhotos()
  }, [refreshTrigger])

  // Update available pool when allPhotos changes
  useEffect(() => {
    if (allPhotos.length > 0 && displayedPhotos.length > 0) {
      const usedIds = new Set(displayedPhotos.map(p => p.id))
      const available = allPhotos
        .map((_, index) => index)
        .filter(index => !usedIds.has(allPhotos[index].id))
      setAvailablePhotoIndices(available)
    }
  }, [allPhotos, displayedPhotos])

  // Initial fade-in animation when photos are first loaded
  useEffect(() => {
    if (displayedPhotos.length === 0 || !isInitialized) return

    // Clear any existing animations
    setAnimatedPhotos(new Set())
    setFadingPhotos(new Set())

    // Store all timeouts for cleanup
    const allTimeouts: NodeJS.Timeout[] = []

    // Small delay to ensure the clear takes effect
    const initialDelay = setTimeout(() => {
      // Trigger staggered fade-in animation
      displayedPhotos.forEach((photo, index) => {
        const timeout = setTimeout(() => {
          setAnimatedPhotos((prev) => {
            const newSet = new Set(prev)
            newSet.add(photo.id)
            return newSet
          })
        }, index * 50) // 50ms stagger between each photo
        allTimeouts.push(timeout)
      })
    }, 50) // 50ms delay to ensure opacity: 0 is applied first

    allTimeouts.push(initialDelay)

    // Cleanup function - clear all timeouts
    return () => {
      allTimeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [displayedPhotos.length, isInitialized])

  // Handle re-animation when navigating back to home page
  useEffect(() => {
    // Skip if resetAnimation is 0 (initial value)
    if (resetAnimation === 0) return

    console.log('Re-animating photos, resetAnimation:', resetAnimation)

    // Immediately clear any existing animations to force opacity: 0
    setAnimatedPhotos(new Set())
    setFadingPhotos(new Set())

    // Store all timeouts for cleanup
    const allTimeouts: NodeJS.Timeout[] = []

    // Wait for React to process the state update (clear animations)
    // Use requestAnimationFrame to ensure the DOM has updated
    const rafId = requestAnimationFrame(() => {
      // Get the LATEST photos from ref at animation time
      const currentPhotos = displayedPhotosRef.current
      if (currentPhotos.length === 0) return

      console.log('Starting fade-in animation for', currentPhotos.length, 'photos')

      // Small additional delay to ensure opacity: 0 is visible
      const initialDelay = setTimeout(() => {
        // Trigger staggered fade-in animation using ref (won't change during animation)
        currentPhotos.forEach((photo, index) => {
          const timeout = setTimeout(() => {
            setAnimatedPhotos((prev) => {
              const newSet = new Set(prev)
              newSet.add(photo.id)
              return newSet
            })
          }, index * 50) // 50ms stagger between each photo
          allTimeouts.push(timeout)
        })
      }, 100) // 100ms delay to ensure opacity: 0 is visible

      allTimeouts.push(initialDelay)
    })

    // Cleanup function - clear all timeouts and cancel RAF
    return () => {
      cancelAnimationFrame(rafId)
      allTimeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [resetAnimation])

  // Continuous photo rotation
  useEffect(() => {
    if (displayedPhotos.length === 0 || allPhotos.length <= 12 || isRotating) return

    let currentAvailableIndices = [...availablePhotoIndices]

    const rotatePhoto = () => {
      if (isRotating || fadingPhotos.size > 0) return
      
      // Double-check that no photos are currently fading
      if (fadingPhotos.size > 0) return
      
      setIsRotating(true)

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

      // Start fade out animation
      setFadingPhotos((prev) => {
        const newSet = new Set(prev)
        newSet.add(photoToReplace.id)
        return newSet
      })
      setAnimatedPhotos((prev) => {
        const newSet = new Set(prev)
        newSet.delete(photoToReplace.id)
        return newSet
      })

      // After fade out completes (1200ms), swap the photo and fade in the new photo
      setTimeout(() => {
        // Swap the photo in displayedPhotos
        setDisplayedPhotos((prev) => {
          const newPhotos = [...prev]
          newPhotos[slotToReplace] = newPhoto
          return newPhotos
        })

        // Clear fading state for the old photo
        setFadingPhotos((prev) => {
          const newSet = new Set(prev)
          newSet.delete(photoToReplace.id)
          return newSet
        })

        // Immediately start fade-in for the new photo
        setTimeout(() => {
          setAnimatedPhotos((prev) => {
            const newSet = new Set(prev)
            newSet.add(newPhoto.id)
            return newSet
          })
        }, 50) // Small delay to ensure DOM is updated

        // Add old photo back to available pool
        const oldPhotoIndex = allPhotos.findIndex(p => p.id === photoToReplace.id)
        if (oldPhotoIndex !== -1 && !currentAvailableIndices.includes(oldPhotoIndex)) {
          currentAvailableIndices.push(oldPhotoIndex)
        }
        
        // Reset rotation state after fade-in completes
        setTimeout(() => {
          setIsRotating(false)
        }, 1200) // Wait for fade-in to complete (1200ms CSS transition)
      }, 1200) // Wait for fade-out to complete (1200ms CSS transition)
    }

    // Start rotating photos with faster timing
    const scheduleNextRotation = () => {
      const randomDelay = 3000 + Math.random() * 3000 // 3-6 seconds
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
              className="group relative overflow-hidden rounded-3xl bg-muted cursor-pointer"
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.12)",
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
                opacity: isFading ? 0 : (isAnimated ? 1 : 0),
                transform: isFading ? 'translateY(-16px) scale(0.95)' : (isAnimated ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)'),
                transition: 'opacity 1.2s ease-in-out, transform 1.2s ease-in-out',
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
