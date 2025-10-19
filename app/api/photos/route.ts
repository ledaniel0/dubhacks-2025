import { NextResponse } from "next/server"
import { getSessionPhotoLibrary } from "@/lib/photo-session"
import { clearUploadedPhotos } from "@/lib/photo-storage"

export const dynamic = "force-dynamic"

// Track if we've cleared photos in this server instance
let hasClearedPhotos = false

export async function GET() {
  try {
    // Only clear uploaded photos on the first request after server restart
    if (!hasClearedPhotos) {
      clearUploadedPhotos()
      hasClearedPhotos = true
      console.log("Cleared uploaded photos on server start")
    }
    
    // Use session-based photo library that includes both static and uploaded photos
    const sessionPhotos = getSessionPhotoLibrary()

    console.log("GET /api/photos - Session photos:", sessionPhotos.length)

    return NextResponse.json({ photos: sessionPhotos })
  } catch (error) {
    console.error("Error loading photos:", error)
    return NextResponse.json({ photos: [] })
  }
}
