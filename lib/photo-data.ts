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
  {
    id: 1,
    name: "Golden Hour at Yosemite",
    url: "/sunset-mountain-landscape.jpg",
    description: "Breathtaking sunset view from Glacier Point",
    date: "March 15, 2024",
    location: "Yosemite National Park, CA",
    tags: ["nature", "landscape", "sunset", "mountains"],
    liked: true,
    width: 4000,
    height: 3000,
    fileSize: "8.2 MB",
    camera: "Canon EOS R5",
    aperture: "f/8",
    iso: "100",
    focalLength: "24mm",
  },
  {
    id: 2,
    name: "Urban Exploration",
    url: "/city-street-photography.jpg",
    description: "Street photography in the heart of the city",
    date: "March 12, 2024",
    location: "San Francisco, CA",
    tags: ["urban", "street", "architecture", "city"],
    liked: false,
    width: 3600,
    height: 2400,
    fileSize: "6.5 MB",
  },
  {
    id: 3,
    name: "Homemade Pasta",
    url: "/food-photography-pasta.jpg",
    description: "Fresh pasta with tomato basil sauce",
    date: "March 10, 2024",
    location: "Italian Restaurant, SF",
    tags: ["food", "dining", "italian"],
    liked: true,
    width: 3000,
    height: 3000,
    fileSize: "5.1 MB",
  },
  {
    id: 4,
    name: "Studio Portrait",
    url: "/portrait-photography.png",
    description: "Professional headshot session",
    date: "March 8, 2024",
    location: "Studio, Downtown",
    tags: ["portrait", "people", "professional"],
    liked: false,
    width: 2400,
    height: 3200,
    fileSize: "4.8 MB",
  },
  {
    id: 5,
    name: "Ocean Waves",
    url: "/beach-ocean-waves.jpg",
    description: "Crashing waves at sunset",
    date: "March 5, 2024",
    location: "Santa Cruz Beach, CA",
    tags: ["beach", "ocean", "nature", "sunset"],
    liked: true,
    width: 4200,
    height: 2800,
    fileSize: "9.1 MB",
  },
  {
    id: 6,
    name: "Morning Coffee",
    url: "/cozy-coffee-shop.png",
    description: "Cozy corner at my favorite cafe",
    date: "March 3, 2024",
    location: "Local Cafe, Berkeley",
    tags: ["coffee", "interior", "lifestyle"],
    liked: false,
    width: 3000,
    height: 2000,
    fileSize: "4.2 MB",
  },
  {
    id: 7,
    name: "Forest Trail",
    url: "/forest-hiking-trail.png",
    description: "Peaceful hiking trail through redwoods",
    date: "March 1, 2024",
    location: "Redwood Forest, CA",
    tags: ["hiking", "nature", "forest", "trail"],
    liked: true,
    width: 3800,
    height: 2400,
    fileSize: "7.3 MB",
  },
  {
    id: 8,
    name: "Live Concert",
    url: "/live-music-concert.png",
    description: "Amazing live performance",
    date: "February 28, 2024",
    location: "Music Hall, Oakland",
    tags: ["music", "concert", "entertainment", "night"],
    liked: false,
    width: 4000,
    height: 2667,
    fileSize: "6.8 MB",
  },
  {
    id: 9,
    name: "Tropical Paradise",
    url: "/tropical-beach-paradise.png",
    description: "Perfect beach day in Hawaii",
    date: "July 20, 2024",
    location: "Maui, Hawaii",
    tags: ["beach", "tropical", "vacation", "paradise"],
    liked: true,
    width: 4500,
    height: 3000,
    fileSize: "10.2 MB",
  },
  {
    id: 10,
    name: "Endless Blue",
    url: "/vast-blue-ocean.png",
    description: "The vast Pacific Ocean",
    date: "July 21, 2024",
    location: "Maui, Hawaii",
    tags: ["ocean", "nature", "seascape"],
    liked: false,
    width: 4000,
    height: 2250,
    fileSize: "7.9 MB",
  },
  {
    id: 11,
    name: "Sandy Textures",
    url: "/sand-texture.png",
    description: "Intricate patterns in the sand",
    date: "July 22, 2024",
    location: "Maui, Hawaii",
    tags: ["beach", "texture", "abstract"],
    liked: false,
    width: 3200,
    height: 2400,
    fileSize: "5.6 MB",
  },
  {
    id: 12,
    name: "Family Dinner",
    url: "/family-dinner.png",
    description: "Christmas dinner with the family",
    date: "December 25, 2023",
    location: "Home, San Jose",
    tags: ["family", "dinner", "holiday", "christmas"],
    liked: true,
    width: 3600,
    height: 2400,
    fileSize: "6.4 MB",
  },
  {
    id: 13,
    name: "New Year Celebration",
    url: "/vibrant-city-celebration.png",
    description: "Ringing in the new year downtown",
    date: "January 1, 2024",
    location: "Downtown SF",
    tags: ["celebration", "city", "party", "newyear"],
    liked: true,
    width: 4000,
    height: 3000,
    fileSize: "8.7 MB",
  },
  {
    id: 14,
    name: "Backyard BBQ",
    url: "/vibrant-outdoor-party.png",
    description: "Summer gathering with friends",
    date: "June 15, 2024",
    location: "Backyard, Home",
    tags: ["party", "outdoor", "gathering", "summer"],
    liked: false,
    width: 3800,
    height: 2533,
    fileSize: "7.1 MB",
  },
  {
    id: 15,
    name: "Mountain Majesty",
    url: "/majestic-mountain-range.png",
    description: "Stunning view of the Rockies",
    date: "August 10, 2024",
    location: "Rocky Mountains, CO",
    tags: ["mountain", "landscape", "nature", "peaks"],
    liked: true,
    width: 5000,
    height: 3333,
    fileSize: "11.5 MB",
  },
  {
    id: 16,
    name: "Adventure Squad",
    url: "/diverse-group-hiking.png",
    description: "Hiking with the crew",
    date: "August 11, 2024",
    location: "Rocky Mountains, CO",
    tags: ["hiking", "adventure", "people", "friends"],
    liked: true,
    width: 3600,
    height: 2400,
    fileSize: "6.9 MB",
  },
  {
    id: 17,
    name: "Winding Path",
    url: "/winding-forest-trail.png",
    description: "Trail through the mountain forest",
    date: "August 12, 2024",
    location: "Rocky Mountains, CO",
    tags: ["trail", "forest", "hiking", "nature"],
    liked: false,
    width: 3400,
    height: 2267,
    fileSize: "6.2 MB",
  },
  {
    id: 18,
    name: "Beach Day",
    url: "/family-beach-fun.png",
    description: "Family fun at the beach",
    date: "July 4, 2024",
    location: "Malibu Beach, CA",
    tags: ["family", "beach", "vacation", "summer"],
    liked: true,
    width: 4200,
    height: 2800,
    fileSize: "8.9 MB",
  },
  {
    id: 19,
    name: "Wedding Ceremony",
    url: "/elegant-wedding-ceremony.png",
    description: "Beautiful garden wedding",
    date: "September 15, 2024",
    location: "Garden Venue, Napa",
    tags: ["wedding", "ceremony", "celebration", "love"],
    liked: true,
    width: 4000,
    height: 2667,
    fileSize: "9.3 MB",
  },
  {
    id: 20,
    name: "Team Building",
    url: "/outdoor-team-building.png",
    description: "Corporate retreat activities",
    date: "October 5, 2024",
    location: "Corporate Retreat, Tahoe",
    tags: ["team", "work", "outdoor", "corporate"],
    liked: false,
    width: 3800,
    height: 2533,
    fileSize: "7.4 MB",
  },
  {
    id: 21,
    name: "Birthday Party",
    url: "/birthday-celebration-party.jpg",
    description: "Celebrating another year",
    date: "November 12, 2024",
    location: "Party Hall, Oakland",
    tags: ["birthday", "party", "celebration", "friends"],
    liked: true,
    width: 3600,
    height: 2400,
    fileSize: "6.7 MB",
  },
]

/**
 * PHOTO LIBRARY
 * Single source of truth for all photos in the app
 * Add new photos here using the createPhoto() helper
 */
export const albums: Album[] = [
  {
    id: 1,
    title: "Summer 2024",
    description: "Best moments from our summer vacation",
    photoIds: [9, 10, 11, 5],
    createdAt: "July 1, 2024",
    updatedAt: "July 25, 2024",
    coverPhotoId: 9,
  },
  {
    id: 2,
    title: "Family Gatherings",
    description: "Precious moments with loved ones",
    photoIds: [12, 13, 14, 18],
    createdAt: "December 20, 2023",
    updatedAt: "June 20, 2024",
    coverPhotoId: 12,
  },
  {
    id: 3,
    title: "Mountain Adventures",
    description: "Hiking and exploring the Rockies",
    photoIds: [15, 16, 17, 1],
    createdAt: "August 1, 2024",
    updatedAt: "August 15, 2024",
    coverPhotoId: 15,
  },
]

/**
 * ALBUMS
 * Collections of photos from the library
 * Reference photos by their ID from photoLibrary
 */
export const sharedAlbums: SharedAlbum[] = [
  {
    id: 1,
    name: "Family Vacation 2024",
    description: "Our amazing family trip to Hawaii",
    photoIds: [18, 9, 10, 11, 5],
    sharedWith: 5,
    lastUpdated: "2 days ago",
    owner: "Sarah Chen",
    isOwner: false,
    coverPhotoId: 18,
  },
  {
    id: 2,
    name: "Wedding Memories",
    description: "Beautiful moments from the ceremony",
    photoIds: [19],
    sharedWith: 12,
    lastUpdated: "1 week ago",
    owner: "You",
    isOwner: true,
    coverPhotoId: 19,
  },
  {
    id: 3,
    name: "Team Retreat",
    description: "Company team building weekend",
    photoIds: [20],
    sharedWith: 8,
    lastUpdated: "3 days ago",
    owner: "Mike Johnson",
    isOwner: false,
    coverPhotoId: 20,
  },
  {
    id: 4,
    name: "Birthday Party",
    description: "Celebrating with friends",
    photoIds: [21],
    sharedWith: 15,
    lastUpdated: "5 days ago",
    owner: "You",
    isOwner: true,
    coverPhotoId: 21,
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
