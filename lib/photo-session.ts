import type { Photo } from "./types"
import { loadUploadedPhotos } from "./photo-storage"
import { basePhotoLibrary } from "./photo-data"

/**
 * Server-side session-based photo library that merges static photos with uploaded photos
 * This ensures uploaded photos have full functionality during the session
 * This file should only be imported in server-side code (API routes)
 */
export function getSessionPhotoLibrary(): Photo[] {
  try {
    const uploadedPhotos = loadUploadedPhotos()
    
    // Merge uploaded photos with base library, avoiding duplicates
    const allPhotos = [...basePhotoLibrary]
    
    // Add uploaded photos that aren't already in the base library
    uploadedPhotos.forEach(uploadedPhoto => {
      const exists = allPhotos.some(photo => photo.url === uploadedPhoto.url)
      if (!exists) {
        allPhotos.unshift(uploadedPhoto) // Add uploaded photos to the beginning
      }
    })
    
    return allPhotos
  } catch (error) {
    console.error("Error loading session photo library:", error)
    return basePhotoLibrary
  }
}
