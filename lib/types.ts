export interface Photo {
  id: number
  name: string
  url: string
  description?: string
  date: string
  location: string
  tags: string[]
  liked: boolean
  width?: number
  height?: number
  fileSize?: string
  camera?: string
  aperture?: string
  iso?: string
  focalLength?: string
  // AI-generated metadata
  aiDescription?: string // Detailed description from Gemini
  aiTags?: string[] // Tags extracted from AI analysis
  mood?: string // Mood/emotion of the photo (e.g., "joyful", "peaceful", "energetic")
  detectedFaces?: FaceDetection[] // Faces detected in the photo
}

export interface FaceDetection {
  id: string // Unique identifier for this face
  boundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  personId?: string // ID to group photos by person (populated later)
  confidence?: number // Confidence score of face detection
}

export interface Album {
  id: number
  title: string
  description?: string
  photoIds: number[]
  createdAt: string
  updatedAt: string
  coverPhotoId?: number
  owner?: string
}

export interface SharedAlbum {
  id: number
  name: string
  description?: string
  photoIds: number[]
  sharedWith: number
  lastUpdated: string
  owner: string
  isOwner: boolean
  coverPhotoId?: number
}

export interface PublicAlbum {
  id: number
  title: string
  location: string // Landmark name (e.g., "Eiffel Tower, Paris")
  description: string
  photoIds: number[]
  contributorCount: number
  photoCount: number
  coverPhotoId?: number
  isPublic: true
  tags: string[]
  createdAt: string
  lastContributed: string
}
