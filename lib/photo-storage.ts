import fs from "fs"
import path from "path"
import type { Photo } from "./types"

const STORAGE_FILE = path.join(process.cwd(), "data", "uploaded-photos.json")

/**
 * Load uploaded photos from JSON file
 */
export function loadUploadedPhotos(): Photo[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, "utf-8")
      return JSON.parse(data)
    }
  } catch (error) {
    console.error("Error loading uploaded photos:", error)
  }
  return []
}

/**
 * Save uploaded photos to JSON file
 */
export function saveUploadedPhotos(photos: Photo[]): void {
  try {
    const dir = path.dirname(STORAGE_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(photos, null, 2), "utf-8")
  } catch (error) {
    console.error("Error saving uploaded photos:", error)
  }
}

/**
 * Add a new uploaded photo
 */
export function addUploadedPhoto(photo: Photo): void {
  const photos = loadUploadedPhotos()
  photos.unshift(photo) // Add to beginning
  saveUploadedPhotos(photos)
}

/**
 * Clear all uploaded photos from the JSON file
 * This should be called on app initialization to start fresh each session
 */
export function clearUploadedPhotos(): void {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      fs.writeFileSync(STORAGE_FILE, "[]", "utf-8")
      console.log("Cleared uploaded photos for new session")
    }
  } catch (error) {
    console.error("Error clearing uploaded photos:", error)
  }
}

