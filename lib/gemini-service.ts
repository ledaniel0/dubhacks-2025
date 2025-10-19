import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"
import type { FaceDetection } from "./types"

export interface PhotoAnalysis {
  title?: string
  description: string
  tags: string[]
  mood: string
  detectedFaces: FaceDetection[]
}

interface GeminiFace {
  position: string
  attributes: string
}

interface GeminiAnalysis {
  title: string
  description: string
  tags: string[]
  mood: string
  faces: GeminiFace[]
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null
  private model: GenerativeModel | null = null

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (apiKey && apiKey !== "your_api_key_here") {
      this.genAI = new GoogleGenerativeAI(apiKey)
      // Using Gemini 2.0 Flash for vision capabilities
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
    }
  }

  async analyzePhoto(imageFile: File | Buffer, mimeType?: string): Promise<PhotoAnalysis> {
    if (!this.model) {
      throw new Error("Gemini API key not configured. Please add your API key to .env.local")
    }

    try {
      // Convert File or Buffer to base64
      const imageData = await this.fileToGenerativePart(imageFile, mimeType)

      const prompt = `Analyze this photo and provide the following information in JSON format:

1. A concise, descriptive title (2-4 words that capture the essence of the photo)
2. A brief description of the photo (1 sentence, max 15 words)
3. A list of relevant tags/keywords (5-8 tags)
4. The overall mood/emotion conveyed (one word: e.g., "joyful", "peaceful", "energetic", "nostalgic", "adventurous", "serene")
5. Detect and describe any faces in the photo with approximate positions

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Short Title Here",
  "description": "Brief one-sentence description.",
  "tags": ["tag1", "tag2", "tag3"],
  "mood": "mood word",
  "faces": [
    {
      "position": "description of where the face is located (e.g., 'center left', 'top right')",
      "attributes": "brief description of the person (e.g., 'smiling woman with glasses')"
    }
  ]
}

If no faces are detected, return an empty array for faces.`

      const result = await this.model.generateContent([prompt, imageData])
      const response = await result.response
      const text = response.text()

      // Extract JSON from the response (sometimes Gemini wraps it in markdown)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Failed to parse Gemini response")
      }

      const analysis: GeminiAnalysis = JSON.parse(jsonMatch[0])

      // Convert face descriptions to FaceDetection objects
      const detectedFaces: FaceDetection[] = (analysis.faces || []).map((face: GeminiFace, index: number) => ({
        id: `face-${Date.now()}-${index}`,
        boundingBox: undefined, // We'll add precise bounding boxes when we integrate Google Vision
        confidence: 0.85, // Approximate confidence for Gemini-detected faces
      }))

      return {
        title: analysis.title || "",
        description: analysis.description || "",
        tags: analysis.tags || [],
        mood: analysis.mood || "neutral",
        detectedFaces,
      }
    } catch (error) {
      console.error("Error analyzing photo with Gemini:", error)
      throw new Error("Failed to analyze photo. Please try again.")
    }
  }

  private async fileToGenerativePart(
    file: File | Buffer,
    mimeType?: string
  ): Promise<{ inlineData: { data: string; mimeType: string } }> {
    // Handle Buffer (server-side)
    if (Buffer.isBuffer(file)) {
      return {
        inlineData: {
          data: file.toString("base64"),
          mimeType: mimeType || "image/jpeg",
        },
      }
    }

    // Handle File (client-side)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(",")[1]
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  isConfigured(): boolean {
    return this.model !== null
  }
}

// Export a singleton instance
export const geminiService = new GeminiService()
