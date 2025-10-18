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
}

export interface Album {
  id: number
  title: string
  description?: string
  photoIds: number[]
  createdAt: string
  updatedAt: string
  coverPhotoId?: number
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
