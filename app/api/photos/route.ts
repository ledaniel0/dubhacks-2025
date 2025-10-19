import { NextResponse } from "next/server"
import { getSessionPhotoLibrary } from "@/lib/photo-session"
import { clearUploadedPhotos } from "@/lib/photo-storage"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Clear uploaded photos on every GET request to start fresh
    clearUploadedPhotos()
    
    // Use session-based photo library that includes both static and uploaded photos
    const sessionPhotos = getSessionPhotoLibrary()

    console.log("GET /api/photos - Session photos:", sessionPhotos.length)

    return NextResponse.json({ photos: sessionPhotos })
  } catch (error) {
    console.error("Error loading photos:", error)
    return NextResponse.json({ photos: [] })
  }
}
