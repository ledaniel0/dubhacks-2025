import { NextRequest, NextResponse } from "next/server"
import { geminiService } from "@/lib/gemini-service"
import { createPhoto } from "@/lib/photo-data"
import { getSessionPhotoLibrary } from "@/lib/photo-session"
import { addUploadedPhoto, loadUploadedPhotos } from "@/lib/photo-storage"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Supported formats: JPG, PNG, HEIC" },
        { status: 400 }
      )
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 50MB limit" }, { status: 400 })
    }

    // Convert file to buffer and save to public folder
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${sanitizedName}`
    const filepath = `/uploads/${filename}`

    // Save file to public/uploads directory
    const fs = require("fs")
    const path = require("path")
    const uploadsDir = path.join(process.cwd(), "public", "uploads")

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    fs.writeFileSync(path.join(uploadsDir, filename), buffer)

    // Get image dimensions
    let width = 4000
    let height = 3000

    try {
      // Try to get actual dimensions using a simple approach
      const Image = require("next/image")
      // For now, use default dimensions. In production, use a library like sharp
    } catch (error) {
      console.log("Could not determine image dimensions, using defaults")
    }

    // Format file size
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2)
    const fileSize = `${fileSizeInMB} MB`

    // Analyze photo with Gemini
    let analysis
    try {
      if (geminiService.isConfigured()) {
        // Pass buffer and mime type for server-side analysis
        analysis = await geminiService.analyzePhoto(buffer, file.type)
      } else {
        console.warn("Gemini API not configured, skipping AI analysis")
        analysis = {
          description: "",
          tags: [],
          mood: "neutral",
          detectedFaces: [],
        }
      }
    } catch (error) {
      console.error("Error analyzing photo with Gemini:", error)
      // Continue without AI analysis if it fails
      analysis = {
        description: "",
        tags: [],
        mood: "neutral",
        detectedFaces: [],
      }
    }

    // Create photo object and add to library
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Get current session library to determine next ID (includes both static and uploaded photos)
    const sessionLibrary = getSessionPhotoLibrary()
    const maxId = Math.max(...sessionLibrary.map((p) => p.id), 0)

    const newPhoto = createPhoto({
      id: maxId + 1,
      name: analysis.title || file.name.replace(/\.[^/.]+$/, ""), // Use AI-generated title as name
      url: filepath,
      date: currentDate,
      location: "", // Will be populated by user or EXIF data later
      description: analysis.description,
      tags: analysis.tags,
      width,
      height,
      fileSize,
      aiDescription: analysis.description,
      aiTags: analysis.tags,
      mood: analysis.mood,
      detectedFaces: analysis.detectedFaces,
    })

    // Save to JSON file
    addUploadedPhoto(newPhoto)

    console.log("Photo added:", newPhoto)
    console.log("Total uploaded photos:", loadUploadedPhotos().length)

    return NextResponse.json({
      success: true,
      photo: newPhoto,
      message: "Photo uploaded and analyzed successfully",
    })
  } catch (error) {
    console.error("Error uploading photo:", error)
    return NextResponse.json(
      { error: "Failed to upload photo. Please try again." },
      { status: 500 }
    )
  }
}
