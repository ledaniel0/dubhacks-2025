import type { Photo, Album, SharedAlbum } from "./types"

/**
 * DEVELOPER GUIDE: Adding New Photos
 *
 * To add a new photo to the library:
 * 1. Place your image in the /public folder (e.g., /public/my-photo.jpg)
 * 2. Use the createPhoto() helper below to generate a photo object
 * 3. Add it to the photoLibrary array
 * 4. (Optional) Add the photo ID to any albums
 *
 * Example:
 * const newPhoto = createPhoto({
 *   id: 22,
 *   name: "My New Photo",
 *   url: "/my-photo.jpg",
 *   date: "January 15, 2025",
 *   tags: ["nature", "landscape"]
 * })
 */

/**
 * Helper function to create a photo with sensible defaults
 * Only requires essential fields, provides defaults for optional ones
 */
export function createPhoto(data: {
  id: number
  name: string
  url: string
  date: string
  tags?: string[]
  description?: string
  location?: string
  liked?: boolean
  width?: number
  height?: number
  fileSize?: string
  camera?: string
  aperture?: string
  iso?: string
  focalLength?: string
}): Photo {
  return {
    id: data.id,
    name: data.name,
    url: data.url,
    date: data.date,
    tags: data.tags || [],
    description: data.description || "",
    location: data.location || "",
    liked: data.liked || false,
    width: data.width || 4000,
    height: data.height || 3000,
    fileSize: data.fileSize || "5.0 MB",
    camera: data.camera,
    aperture: data.aperture,
    iso: data.iso,
    focalLength: data.focalLength,
  }
}

/**
 * Helper function to create an album
 */
export function createAlbum(data: {
  id: number
  title: string
  photoIds: number[]
  description?: string
  coverPhotoId?: number
}): Album {
  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    photoIds: data.photoIds,
    createdAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    updatedAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    coverPhotoId: data.coverPhotoId || data.photoIds[0],
  }
}

export const photoLibrary: Photo[] = [
  createPhoto({
    id: 1,
    name: "Tokyo Morning",
    url: "/images/japan/20230801_095353.jpg",
    description: "Beautiful morning view in Tokyo",
    date: "August 1, 2023",
    location: "Tokyo, Japan",
    tags: ["tokyo", "morning", "cityscape", "japan"],
    liked: true,
  }),
  createPhoto({
    id: 2,
    name: "Sunset Over Tokyo Bay",
    url: "/images/japan/20230806_181910.jpg",
    description: "Stunning sunset view over Tokyo Bay",
    date: "August 6, 2023",
    location: "Tokyo Bay, Japan",
    tags: ["sunset", "tokyo", "bay", "nature", "peaceful"],
    liked: true,
  }),
  createPhoto({
    id: 3,
    name: "Traditional Japanese Meal",
    url: "/images/japan/food/20230806_203250.jpg",
    description: "Authentic Japanese dinner spread",
    date: "August 6, 2023",
    location: "Tokyo, Japan",
    tags: ["food", "japanese", "dinner", "traditional", "culture"],
    liked: true,
  }),
  createPhoto({
    id: 4,
    name: "Temple Garden",
    url: "/images/japan/20230807_174057.jpg",
    description: "Peaceful temple garden in Kyoto",
    date: "August 7, 2023",
    location: "Kyoto, Japan",
    tags: ["temple", "garden", "kyoto", "peaceful", "nature"],
    liked: true,
  }),
  createPhoto({
    id: 5,
    name: "Street View",
    url: "/images/japan/20230809_143015.jpg",
    description: "Bustling Tokyo street scene",
    date: "August 9, 2023",
    location: "Tokyo, Japan",
    tags: ["street", "tokyo", "urban", "cityscape"],
  }),
  createPhoto({
    id: 6,
    name: "Late Night Ramen",
    url: "/images/japan/food/20230809_232407.jpg",
    description: "Delicious late-night ramen",
    date: "August 9, 2023",
    location: "Tokyo, Japan",
    tags: ["food", "ramen", "japanese", "dinner", "proudest"],
    liked: true,
  }),
  createPhoto({
    id: 7,
    name: "Morning Architecture",
    url: "/images/japan/20230810_091148.jpg",
    description: "Modern Japanese architecture",
    date: "August 10, 2023",
    location: "Tokyo, Japan",
    tags: ["architecture", "tokyo", "modern", "building"],
  }),
  createPhoto({
    id: 8,
    name: "City Walk",
    url: "/images/japan/20230810_092913.jpg",
    description: "Morning walk through the city",
    date: "August 10, 2023",
    location: "Tokyo, Japan",
    tags: ["urban", "walk", "tokyo", "morning"],
  }),
  createPhoto({
    id: 9,
    name: "Urban Exploration",
    url: "/images/japan/20230810_095135.jpg",
    description: "Exploring Tokyo neighborhoods",
    date: "August 10, 2023",
    location: "Tokyo, Japan",
    tags: ["urban", "exploration", "tokyo", "travel"],
  }),
  createPhoto({
    id: 10,
    name: "Midday Scene",
    url: "/images/japan/20230810_103406.jpg",
    description: "Tokyo midday scenery",
    date: "August 10, 2023",
    location: "Tokyo, Japan",
    tags: ["tokyo", "midday", "cityscape"],
  }),
  createPhoto({
    id: 11,
    name: "Evening Lights",
    url: "/images/japan/20230811_185634.jpg",
    description: "Tokyo evening lights coming alive",
    date: "August 11, 2023",
    location: "Tokyo, Japan",
    tags: ["evening", "tokyo", "lights", "cityscape"],
    liked: true,
  }),
  createPhoto({
    id: 12,
    name: "Traditional Dinner",
    url: "/images/japan/food/20230811_204958.jpg",
    description: "Beautiful traditional Japanese dinner",
    date: "August 11, 2023",
    location: "Tokyo, Japan",
    tags: ["food", "japanese", "dinner", "traditional"],
    liked: true,
  }),
  createPhoto({
    id: 13,
    name: "Night Market",
    url: "/images/japan/20230811_213536.jpg",
    description: "Vibrant night market atmosphere",
    date: "August 11, 2023",
    location: "Tokyo, Japan",
    tags: ["night", "market", "tokyo", "vibrant"],
  }),
  createPhoto({
    id: 14,
    name: "Late Night Food",
    url: "/images/japan/food/20230811_222936.jpg",
    description: "Late night food adventure",
    date: "August 11, 2023",
    location: "Tokyo, Japan",
    tags: ["food", "night", "japanese", "proudest"],
    liked: true,
  }),
  createPhoto({
    id: 15,
    name: "Scenic Overlook",
    url: "/images/japan/20230816_151450.jpg",
    description: "Breathtaking view from the overlook",
    date: "August 16, 2023",
    location: "Japan",
    tags: ["scenic", "nature", "overlook", "peaceful"],
    liked: true,
  }),
  createPhoto({
    id: 16,
    name: "Cultural Site",
    url: "/images/japan/IMG_0661.jpg",
    description: "Historic cultural site",
    date: "August 2023",
    location: "Japan",
    tags: ["culture", "historic", "japan", "travel"],
  }),
  createPhoto({
    id: 17,
    name: "Sushi Artistry",
    url: "/images/japan/food/IMG_4282.jpg",
    description: "Beautiful sushi presentation",
    date: "August 2023",
    location: "Tokyo, Japan",
    tags: ["food", "sushi", "japanese", "proudest"],
    liked: true,
  }),
  createPhoto({
    id: 18,
    name: "Panoramic View",
    url: "/images/japan/IMG_4289.jpg",
    description: "Wide panoramic city view",
    date: "August 2023",
    location: "Tokyo, Japan",
    tags: ["panorama", "tokyo", "cityscape", "view"],
  }),
  createPhoto({
    id: 19,
    name: "Traditional Architecture",
    url: "/images/japan/IMG_4328.jpg",
    description: "Beautiful traditional Japanese building",
    date: "August 2023",
    location: "Japan",
    tags: ["architecture", "traditional", "japan", "culture"],
    liked: true,
  }),
  createPhoto({
    id: 20,
    name: "Mountain Vista",
    url: "/images/japan/IMG_4374.jpg",
    description: "Stunning mountain landscape",
    date: "August 2023",
    location: "Japan",
    tags: ["mountain", "nature", "landscape", "peaceful"],
    liked: true,
  }),
  createPhoto({
    id: 21,
    name: "Japanese Cuisine",
    url: "/images/japan/food/IMG_4395.jpg",
    description: "Exquisite Japanese dining experience",
    date: "August 2023",
    location: "Japan",
    tags: ["food", "japanese", "dining", "culture", "proudest"],
    liked: true,
  }),
]

/**
 * PHOTO LIBRARY
 * Single source of truth for all photos in the app
 * Add new photos here using the createPhoto() helper
 */
export const albums: Album[] = [
  createAlbum({
    id: 1,
    title: "Tokyo Highlights",
    description: "Best moments exploring Tokyo",
    photoIds: [1, 2, 5, 7, 8, 9, 10, 11, 13, 18],
  }),
  createAlbum({
    id: 2,
    title: "Japanese Cuisine",
    description: "Delicious food adventures in Japan",
    photoIds: [3, 6, 12, 14, 17, 21],
    coverPhotoId: 17,
  }),
  createAlbum({
    id: 3,
    title: "Cultural Journey",
    description: "Temples, tradition, and history",
    photoIds: [4, 15, 16, 19, 20],
    coverPhotoId: 19,
  }),
]

/**
 * ALBUMS
 * Collections of photos from the library
 * Reference photos by their ID from photoLibrary
 */
export const sharedAlbums: SharedAlbum[] = [
  {
    id: 1,
    name: "Japan Trip 2023",
    description: "Shared memories from Japan",
    photoIds: [1, 2, 4, 11, 15, 19, 20],
    sharedWith: 12,
    lastUpdated: "2 days ago",
    owner: "You",
    isOwner: true,
    coverPhotoId: 2,
  },
  {
    id: 2,
    name: "Tokyo Adventures",
    description: "Exploring the city together",
    photoIds: [1, 5, 7, 8, 9, 10, 13],
    sharedWith: 8,
    lastUpdated: "1 week ago",
    owner: "You",
    isOwner: true,
    coverPhotoId: 11,
  },
  {
    id: 3,
    name: "Food Tour",
    description: "Amazing food experiences in Japan",
    photoIds: [3, 6, 12, 14, 17, 21],
    sharedWith: 15,
    lastUpdated: "3 days ago",
    owner: "Yuki Tanaka",
    isOwner: false,
    coverPhotoId: 17,
  },
]

/**
 * SHARED ALBUMS
 * Albums shared with other users
 * Reference photos by their ID from photoLibrary
 */

// Helper function to get a single photo by ID
export function getPhotoById(photoId: number): Photo | undefined {
  return photoLibrary.find((photo) => photo.id === photoId)
}

// Helper function to get photos by IDs
export function getPhotosByIds(photoIds: number[]): Photo[] {
  return photoIds
    .map((id) => photoLibrary.find((photo) => photo.id === id))
    .filter((photo): photo is Photo => photo !== undefined)
}

// Helper function to get album cover (first 4 photos)
export function getAlbumThumbnails(photoIds: number[]): string[] {
  return getPhotosByIds(photoIds.slice(0, 4)).map((photo) => photo.url)
}

/**
 * Validates that all photo IDs in albums exist in the library
 * Useful for debugging
 */
export function validatePhotoReferences(): {
  valid: boolean
  missingIds: number[]
} {
  const allPhotoIds = photoLibrary.map((p) => p.id)
  const allReferencedIds = [...albums.flatMap((a) => a.photoIds), ...sharedAlbums.flatMap((a) => a.photoIds)]
  const missingIds = allReferencedIds.filter((id) => !allPhotoIds.includes(id))

  return {
    valid: missingIds.length === 0,
    missingIds,
  }
}
