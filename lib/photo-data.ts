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
    name: "Tech Presentation",
    url: "/tech-presentation-perplexity.jpg",
    description: "Presenting at tech showcase event",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["presentation", "tech", "hackathon", "demo", "proudest"],
    liked: true,
    width: 4000,
    height: 3000,
    fileSize: "7.8 MB",
  },
  {
    id: 2,
    name: "Superclassroom Demo",
    url: "/superclassroom-demo.jpg",
    description: "Learning tools made for you - project showcase",
    date: "October 18, 2025",
    location: "Event Hall, Seattle",
    tags: ["hackathon", "presentation", "project", "demo", "proudest"],
    liked: true,
    width: 3600,
    height: 2400,
    fileSize: "6.2 MB",
  },
  {
    id: 3,
    name: "Hackathon Team Photo",
    url: "/hackathon-large-group.jpg",
    description: "Amazing group of hackers and innovators",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["hackathon", "team", "group", "friends", "tech"],
    liked: true,
    width: 4200,
    height: 2800,
    fileSize: "8.5 MB",
  },
  {
    id: 4,
    name: "Superc Platform Demo",
    url: "/superc-presentation.jpg",
    description: "Presenting our innovative platform",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["presentation", "demo", "hackathon", "tech", "proudest"],
    liked: true,
    width: 4000,
    height: 3000,
    fileSize: "7.5 MB",
  },
  {
    id: 5,
    name: "FutureForce Interns",
    url: "/futureforce-intern-group.jpg",
    description: "Internship program team photo",
    date: "September 20, 2025",
    location: "Salesforce Office, Seattle",
    tags: ["internship", "team", "work", "friends", "professional"],
    liked: true,
    width: 3800,
    height: 2533,
    fileSize: "6.9 MB",
  },
  {
    id: 6,
    name: "Achievement Moment",
    url: "/outdoor-thumbs-up.jpg",
    description: "Celebrating success outdoors",
    date: "October 15, 2025",
    location: "UW Campus, Seattle",
    tags: ["celebration", "outdoor", "achievement", "proudest"],
    liked: true,
    width: 3000,
    height: 4000,
    fileSize: "6.1 MB",
  },
  {
    id: 7,
    name: "DubHacks Squad",
    url: "/dubhacks-team.jpg",
    description: "Team photo at DubHacks hackathon",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["hackathon", "dubhacks", "team", "friends", "tech"],
    liked: true,
    width: 3600,
    height: 2400,
    fileSize: "6.4 MB",
  },
  {
    id: 8,
    name: "Team Dinner",
    url: "/team-dining-celebration.jpg",
    description: "Celebrating our hard work over dinner",
    date: "October 10, 2025",
    location: "Restaurant, Seattle",
    tags: ["team", "dinner", "celebration", "friends", "food"],
    liked: true,
    width: 4000,
    height: 3000,
    fileSize: "7.2 MB",
  },
  {
    id: 9,
    name: "Outdoor Team Gathering",
    url: "/outdoor-large-group.jpg",
    description: "Large team gathering in nature",
    date: "September 25, 2025",
    location: "Park, Seattle",
    tags: ["team", "outdoor", "gathering", "friends", "nature"],
    liked: true,
    width: 4500,
    height: 3000,
    fileSize: "9.1 MB",
  },
  {
    id: 10,
    name: "Munch App Demo",
    url: "/munch-project-demo.jpg",
    description: "Presenting our food waste reduction app",
    date: "October 18, 2025",
    location: "UW Campus, Seattle",
    tags: ["hackathon", "demo", "project", "presentation", "proudest"],
    liked: true,
    width: 3600,
    height: 2400,
    fileSize: "6.7 MB",
  },
  {
    id: 11,
    name: "Seattle Waterfront Team",
    url: "/seattle-waterfront-group.jpg",
    description: "Team photo with Seattle skyline backdrop",
    date: "October 1, 2025",
    location: "Seattle Waterfront, WA",
    tags: ["team", "outdoor", "seattle", "waterfront", "friends"],
    liked: true,
    width: 4200,
    height: 2800,
    fileSize: "8.8 MB",
  },
  {
    id: 12,
    name: "Salesforce Celebration",
    url: "/salesforce-flowers-celebration.jpg",
    description: "Internship closing ceremony with flowers",
    date: "August 30, 2025",
    location: "Salesforce Office, Seattle",
    tags: ["internship", "celebration", "professional", "team", "proudest"],
    liked: true,
    width: 4000,
    height: 3000,
    fileSize: "7.9 MB",
  },
  {
    id: 13,
    name: "Salesforce Trailblazer",
    url: "/salesforce-trailblazer-mascot.jpg",
    description: "With the Salesforce Trailblazer mascot",
    date: "August 15, 2025",
    location: "Salesforce Office, Seattle",
    tags: ["internship", "salesforce", "professional", "work", "fun"],
    liked: true,
    width: 3000,
    height: 4000,
    fileSize: "6.3 MB",
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
    title: "DubHacks 2025",
    description: "Hackathon presentations and team moments",
    photoIds: [1, 2, 3, 4, 7, 10],
    createdAt: "October 18, 2025",
    updatedAt: "October 18, 2025",
    coverPhotoId: 1,
  },
  {
    id: 2,
    title: "Salesforce Internship",
    description: "Summer 2025 internship memories",
    photoIds: [5, 12, 13],
    createdAt: "August 15, 2025",
    updatedAt: "September 20, 2025",
    coverPhotoId: 13,
  },
  {
    id: 3,
    title: "Team Moments",
    description: "Group photos and celebrations",
    photoIds: [3, 7, 8, 9, 11],
    createdAt: "September 25, 2025",
    updatedAt: "October 18, 2025",
    coverPhotoId: 11,
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
    name: "DubHacks Team",
    description: "Shared hackathon memories with the team",
    photoIds: [3, 7],
    sharedWith: 15,
    lastUpdated: "2 days ago",
    owner: "You",
    isOwner: true,
    coverPhotoId: 3,
  },
  {
    id: 2,
    name: "Presentation Highlights",
    description: "Best demo moments",
    photoIds: [1, 2, 4, 10],
    sharedWith: 8,
    lastUpdated: "1 week ago",
    owner: "You",
    isOwner: true,
    coverPhotoId: 1,
  },
  {
    id: 3,
    name: "Intern Squad 2025",
    description: "Salesforce internship cohort photos",
    photoIds: [5, 12, 13],
    sharedWith: 12,
    lastUpdated: "3 days ago",
    owner: "Sarah Chen",
    isOwner: false,
    coverPhotoId: 5,
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
