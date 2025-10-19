import type { Photo, Album, SharedAlbum, FaceDetection } from "./types"

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
  aiDescription?: string
  aiTags?: string[]
  mood?: string
  detectedFaces?: FaceDetection[]
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
    aiDescription: data.aiDescription,
    aiTags: data.aiTags,
    mood: data.mood,
    detectedFaces: data.detectedFaces,
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

/**
 * Helper function to create a shared album
 */
export function createSharedAlbum(data: {
  id: number
  name: string
  photoIds: number[]
  description?: string
  sharedWith?: number
  coverPhotoId?: number
}): SharedAlbum {
  return {
    id: data.id,
    name: data.name,
    description: data.description || "",
    photoIds: data.photoIds,
    sharedWith: data.sharedWith || 0,
    lastUpdated: "Just now",
    owner: "You",
    isOwner: true,
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
  
  // DubHacks 2025 Photos
  createPhoto({
    id: 22,
    name: "DubHacks Presentation",
    url: "/images/dubhacks-next/376A5482.jpg",
    description: "Presenting our project at DubHacks",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["dubhacks", "hackathon", "presentation", "tech", "proudest"],
    liked: true,
  }),
  createPhoto({
    id: 23,
    name: "Team Photo at DubHacks",
    url: "/images/dubhacks-next/376A5487.jpg",
    description: "Our amazing team at the hackathon",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["dubhacks", "hackathon", "team", "friends", "tech"],
    liked: true,
  }),
  createPhoto({
    id: 24,
    name: "Hackathon Workspace",
    url: "/images/dubhacks-next/IMG_3365.JPG",
    description: "Working hard on our project",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["dubhacks", "hackathon", "coding", "workspace", "tech"],
  }),
  createPhoto({
    id: 25,
    name: "Demo Day Setup",
    url: "/images/dubhacks-next/IMG_3865.JPG",
    description: "Setting up for project demonstrations",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["dubhacks", "hackathon", "demo", "setup", "tech"],
  }),
  createPhoto({
    id: 26,
    name: "Project Showcase",
    url: "/images/dubhacks-next/RenderedImage.jpg",
    description: "Our final project presentation",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["dubhacks", "hackathon", "project", "demo", "proudest"],
    liked: true,
  }),
  createPhoto({
    id: 27,
    name: "Team Celebration",
    url: "/images/dubhacks-next/attachment:19e20fd0-4c15-4caa-803e-b70542d64d32:IMG_0118.JPG",
    description: "Celebrating after the hackathon",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["dubhacks", "hackathon", "celebration", "team", "friends"],
    liked: true,
  }),
  
  // Salesforce Internship Photos
  createPhoto({
    id: 28,
    name: "Salesforce Office View",
    url: "/images/salesforce/12D28B00-0DF8-4691-8625-B1619D1690F0.jpg",
    description: "Beautiful office space at Salesforce",
    date: "Summer 2025",
    location: "Salesforce Tower, Seattle",
    tags: ["salesforce", "internship", "office", "professional", "work"],
    liked: true,
  }),
  createPhoto({
    id: 29,
    name: "Intern Team Photo",
    url: "/images/salesforce/IMG_0220.jpg",
    description: "Summer 2025 intern cohort",
    date: "Summer 2025",
    location: "Salesforce Office, Seattle",
    tags: ["salesforce", "internship", "team", "professional", "friends"],
    liked: true,
  }),
  createPhoto({
    id: 30,
    name: "Internship Milestone",
    url: "/images/salesforce/IMG_1689.jpg",
    description: "Celebrating internship achievements",
    date: "Summer 2025",
    location: "Salesforce Office, Seattle",
    tags: ["salesforce", "internship", "milestone", "professional", "proudest"],
    liked: true,
  }),
  
  // San Francisco Photos
  createPhoto({
    id: 31,
    name: "Golden Gate Bridge",
    url: "/images/sf/IMG_0928.JPG",
    description: "Iconic Golden Gate Bridge view",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "golden gate", "bridge", "landmark", "architecture"],
    liked: true,
  }),
  createPhoto({
    id: 32,
    name: "SF Skyline",
    url: "/images/sf/IMG_0914.JPG",
    description: "Beautiful San Francisco cityscape",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "skyline", "cityscape", "urban", "architecture"],
    liked: true,
  }),
  createPhoto({
    id: 33,
    name: "Coit Tower View",
    url: "/images/sf/IMG_0899.jpg",
    description: "Panoramic view from Coit Tower",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "coit tower", "panorama", "view", "landmark"],
    liked: true,
  }),
  createPhoto({
    id: 34,
    name: "Fisherman's Wharf",
    url: "/images/sf/IMG_0888.JPG",
    description: "Vibrant Fisherman's Wharf district",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "fishermans wharf", "waterfront", "tourist", "vibrant"],
    liked: true,
  }),
  createPhoto({
    id: 35,
    name: "Lombard Street",
    url: "/images/sf/IMG_0853.JPG",
    description: "The famous crooked street",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "lombard street", "crooked", "famous", "street"],
    liked: true,
  }),
  createPhoto({
    id: 36,
    name: "Cable Car",
    url: "/images/sf/IMG_0839.JPG",
    description: "Classic San Francisco cable car",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "cable car", "transportation", "classic", "historic"],
    liked: true,
  }),
  createPhoto({
    id: 37,
    name: "Alcatraz Island",
    url: "/images/sf/IMG_0837.jpg",
    description: "Historic Alcatraz Island",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "alcatraz", "island", "historic", "prison"],
    liked: true,
  }),
  createPhoto({
    id: 38,
    name: "SF Bay View",
    url: "/images/sf/IMG_0828.JPG",
    description: "Beautiful San Francisco Bay",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "bay", "water", "scenic", "peaceful"],
    liked: true,
  }),
  createPhoto({
    id: 39,
    name: "Chinatown",
    url: "/images/sf/IMG_0814.JPG",
    description: "Vibrant Chinatown district",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "chinatown", "culture", "vibrant", "district"],
    liked: true,
  }),
  createPhoto({
    id: 40,
    name: "SF Architecture",
    url: "/images/sf/IMG_0810.jpg",
    description: "Beautiful San Francisco architecture",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "architecture", "buildings", "urban", "beautiful"],
    liked: true,
  }),
  createPhoto({
    id: 41,
    name: "SF Sunset",
    url: "/images/sf/IMG_0770.JPG",
    description: "Stunning San Francisco sunset",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "sunset", "golden hour", "beautiful", "scenic"],
    liked: true,
  }),
  createPhoto({
    id: 42,
    name: "SF Streets",
    url: "/images/sf/IMG_0118.JPG",
    description: "Charming San Francisco streets",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "streets", "urban", "charming", "city"],
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
    title: "DubHacks 2025",
    description: "Hackathon presentations and team moments",
    photoIds: [22, 23, 24, 25, 26, 27],
    coverPhotoId: 22,
  }),
  createAlbum({
    id: 2,
    title: "Salesforce Internship",
    description: "Summer 2025 internship memories",
    photoIds: [28, 29, 30],
    coverPhotoId: 29,
  }),
  createAlbum({
    id: 3,
    title: "Tokyo Highlights",
    description: "Best moments exploring Tokyo",
    photoIds: [1, 2, 5, 7, 8, 9, 10, 11, 13, 18],
    coverPhotoId: 11,
  }),
  createAlbum({
    id: 4,
    title: "Japanese Cuisine",
    description: "Delicious food adventures in Japan",
    photoIds: [3, 6, 12, 14, 17, 21],
    coverPhotoId: 17,
  }),
  createAlbum({
    id: 5,
    title: "Cultural Journey",
    description: "Temples, tradition, and history",
    photoIds: [4, 15, 16, 19, 20],
    coverPhotoId: 19,
  }),
  createAlbum({
    id: 6,
    title: "San Francisco",
    description: "Exploring the beautiful city by the bay",
    photoIds: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42],
    coverPhotoId: 31,
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
    name: "DubHacks Team",
    description: "Shared hackathon memories with the team",
    photoIds: [22, 23, 24, 27],
    sharedWith: 15,
    lastUpdated: "2 days ago",
    owner: "You",
    isOwner: true,
    coverPhotoId: 23,
  },
  {
    id: 2,
    name: "Presentation Highlights",
    description: "Best demo moments from DubHacks",
    photoIds: [22, 25, 26],
    sharedWith: 8,
    lastUpdated: "1 week ago",
    owner: "You",
    isOwner: true,
    coverPhotoId: 26,
  },
  {
    id: 3,
    name: "Intern Squad 2025",
    description: "Salesforce internship cohort photos",
    photoIds: [28, 29, 30],
    sharedWith: 12,
    lastUpdated: "3 days ago",
    owner: "Sarah Chen",
    isOwner: false,
    coverPhotoId: 29,
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

/**
 * Adds a new album to the albums array
 * Returns the created album
 */
export function addAlbum(title: string, description: string, photoIds: number[]): Album {
  const newId = Math.max(...albums.map(a => a.id), 0) + 1
  const newAlbum = createAlbum({
    id: newId,
    title,
    description,
    photoIds,
  })
  
  // Add to the albums array
  albums.push(newAlbum)
  
  // In a real app, this would be persisted to a database
  // For now, we'll just return the album (it won't persist between sessions)
  return newAlbum
}

/**
 * Adds a new shared album to the sharedAlbums array
 * Returns the created shared album
 */
export function addSharedAlbum(title: string, description: string, photoIds: number[]): SharedAlbum {
  const newId = Math.max(...sharedAlbums.map(a => a.id), 0) + 1
  const newSharedAlbum = createSharedAlbum({
    id: newId,
    name: title,
    description,
    photoIds,
    sharedWith: 0, // Will be updated when invites are sent
  })
  
  // In a real app, this would be persisted to a database
  // For now, we'll just return the album (it won't persist between sessions)
  return newSharedAlbum
}
