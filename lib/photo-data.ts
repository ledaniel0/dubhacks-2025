import type { Photo, Album, SharedAlbum, FaceDetection, PublicAlbum } from "./types"

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

// Base photo library (static photos)
export const basePhotoLibrary: Photo[] = [
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
    tags: ["sunset", "tokyo", "bay", "nature", "peaceful", "long"],
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
    tags: ["temple", "garden", "kyoto", "peaceful", "nature", "long"],
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
    tags: ["urban", "exploration", "tokyo", "travel", "happiest"],
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
    tags: ["panorama", "tokyo", "cityscape", "view", "long"],
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
    tags: ["mountain", "nature", "landscape", "peaceful", "long"],
    liked: true,
  }),
  createPhoto({
    id: 21,
    name: "Japanese Cuisine",
    url: "/images/japan/IMG_4395.jpg",
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
    tags: ["dubhacks", "hackathon", "coding", "workspace", "tech", "happiest"],
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
    tags: ["salesforce", "internship", "milestone", "professional", "proudest", "happiest"],
    liked: true,
  }),
  
  // New York Photos
  createPhoto({
    id: 31,
    name: "Brooklyn Streets",
    url: "/images/ny/DSC00001.JPG",
    description: "Street view in Brooklyn",
    date: "Fall 2024",
    location: "Brooklyn, NY",
    tags: ["new york", "brooklyn", "street", "urban", "cityscape"],
    liked: true,
  }),
  createPhoto({
    id: 32,
    name: "Manhattan Architecture",
    url: "/images/ny/DSC00002.JPG",
    description: "Modern Manhattan buildings",
    date: "Fall 2024",
    location: "Manhattan, NY",
    tags: ["new york", "manhattan", "architecture", "buildings", "urban"],
  }),
  createPhoto({
    id: 33,
    name: "NYC Sunset",
    url: "/images/ny/DSC00003.JPG",
    description: "Beautiful NYC sunset view",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "sunset", "cityscape", "golden hour"],
    liked: true,
  }),
  createPhoto({
    id: 34,
    name: "Central Park",
    url: "/images/ny/DSC00005.JPG",
    description: "Peaceful moment in Central Park",
    date: "Fall 2024",
    location: "Central Park, NY",
    tags: ["new york", "central park", "nature", "peaceful"],
  }),
  createPhoto({
    id: 35,
    name: "Times Square",
    url: "/images/ny/DSC00006.JPG",
    description: "Vibrant Times Square at night",
    date: "Fall 2024",
    location: "Times Square, NY",
    tags: ["new york", "times square", "night", "vibrant", "lights"],
    liked: true,
  }),
  createPhoto({
    id: 36,
    name: "NYC Skyline",
    url: "/images/ny/DSC00019.JPG",
    description: "Iconic NYC skyline view",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "skyline", "cityscape", "iconic"],
  }),
  createPhoto({
    id: 37,
    name: "Brooklyn Bridge",
    url: "/images/ny/DSC00022.JPG",
    description: "Brooklyn Bridge crossing",
    date: "Fall 2024",
    location: "Brooklyn Bridge, NY",
    tags: ["new york", "brooklyn bridge", "bridge", "landmark"],
    liked: true,
  }),
  createPhoto({
    id: 38,
    name: "East Village",
    url: "/images/ny/DSC00024.JPG",
    description: "Charming East Village streets",
    date: "Fall 2024",
    location: "East Village, NY",
    tags: ["new york", "east village", "street", "neighborhood"],
  }),
  createPhoto({
    id: 39,
    name: "Hudson River View",
    url: "/images/ny/DSC00025.JPG",
    description: "Hudson River waterfront",
    date: "Fall 2024",
    location: "Hudson River, NY",
    tags: ["new york", "hudson river", "waterfront", "scenic"],
  }),
  createPhoto({
    id: 40,
    name: "SoHo Streets",
    url: "/images/ny/DSC00026.JPG",
    description: "Trendy SoHo neighborhood",
    date: "Fall 2024",
    location: "SoHo, NY",
    tags: ["new york", "soho", "street", "trendy"],
  }),
  createPhoto({
    id: 41,
    name: "NYC Architecture",
    url: "/images/ny/DSC00084.JPG",
    description: "Unique NYC building design",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "architecture", "buildings", "design"],
  }),
  createPhoto({
    id: 42,
    name: "Downtown Manhattan",
    url: "/images/ny/DSC00120.JPG",
    description: "Downtown Manhattan streets",
    date: "Fall 2024",
    location: "Downtown Manhattan, NY",
    tags: ["new york", "downtown", "manhattan", "urban"],
  }),
  createPhoto({
    id: 43,
    name: "NYC Rooftop View",
    url: "/images/ny/DSC00137.JPG",
    description: "Rooftop view of the city",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "rooftop", "view", "cityscape"],
    liked: true,
  }),
  createPhoto({
    id: 44,
    name: "Williamsburg",
    url: "/images/ny/DSC00153.JPG",
    description: "Trendy Williamsburg area",
    date: "Fall 2024",
    location: "Williamsburg, NY",
    tags: ["new york", "williamsburg", "brooklyn", "trendy"],
  }),
  createPhoto({
    id: 45,
    name: "NYC Street Life",
    url: "/images/ny/DSC00243.JPG",
    description: "Bustling NYC street scene",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "street", "bustling", "life"],
  }),
  createPhoto({
    id: 46,
    name: "Statue of Liberty",
    url: "/images/ny/IMG_0043.JPG",
    description: "Iconic Statue of Liberty view",
    date: "Fall 2024",
    location: "Liberty Island, NY",
    tags: ["new york", "statue of liberty", "landmark", "iconic"],
    liked: true,
  }),
  createPhoto({
    id: 47,
    name: "Empire State Building",
    url: "/images/ny/IMG_0058.JPG",
    description: "Empire State Building",
    date: "Fall 2024",
    location: "Manhattan, NY",
    tags: ["new york", "empire state", "landmark", "building"],
    liked: true,
  }),
  createPhoto({
    id: 48,
    name: "NYC Night Lights",
    url: "/images/ny/IMG_0574.JPG",
    description: "City lights at night",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "night", "lights", "cityscape"],
  }),
  createPhoto({
    id: 49,
    name: "High Line Park",
    url: "/images/ny/IMG_0592.JPG",
    description: "Elevated High Line Park",
    date: "Fall 2024",
    location: "High Line, NY",
    tags: ["new york", "high line", "park", "elevated"],
  }),
  createPhoto({
    id: 50,
    name: "Chelsea Market",
    url: "/images/ny/IMG_0595.JPG",
    description: "Vibrant Chelsea Market",
    date: "Fall 2024",
    location: "Chelsea, NY",
    tags: ["new york", "chelsea", "market", "food"],
  }),
  createPhoto({
    id: 51,
    name: "Greenwich Village",
    url: "/images/ny/IMG_0597.JPG",
    description: "Historic Greenwich Village",
    date: "Fall 2024",
    location: "Greenwich Village, NY",
    tags: ["new york", "greenwich village", "historic", "neighborhood"],
  }),
  createPhoto({
    id: 52,
    name: "NYC Subway",
    url: "/images/ny/IMG_0603.JPG",
    description: "Underground NYC subway",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "subway", "underground", "transportation"],
  }),
  createPhoto({
    id: 53,
    name: "Wall Street",
    url: "/images/ny/IMG_0614.JPG",
    description: "Historic Wall Street area",
    date: "Fall 2024",
    location: "Wall Street, NY",
    tags: ["new york", "wall street", "financial", "historic"],
  }),
  createPhoto({
    id: 54,
    name: "NYC Harbor",
    url: "/images/ny/IMG_0615.JPG",
    description: "New York Harbor view",
    date: "Fall 2024",
    location: "New York Harbor, NY",
    tags: ["new york", "harbor", "waterfront", "scenic"],
  }),
  createPhoto({
    id: 55,
    name: "One World Trade",
    url: "/images/ny/IMG_0617.JPG",
    description: "One World Trade Center",
    date: "Fall 2024",
    location: "Lower Manhattan, NY",
    tags: ["new york", "one world trade", "landmark", "memorial"],
    liked: true,
  }),
  createPhoto({
    id: 56,
    name: "NYC Street Art",
    url: "/images/ny/IMG_0620.JPG",
    description: "Vibrant street art",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "street art", "art", "vibrant"],
  }),
  createPhoto({
    id: 57,
    name: "Midtown Manhattan",
    url: "/images/ny/IMG_0630.JPG",
    description: "Busy Midtown streets",
    date: "Fall 2024",
    location: "Midtown Manhattan, NY",
    tags: ["new york", "midtown", "manhattan", "busy"],
  }),
  createPhoto({
    id: 58,
    name: "NYC Coffee Shop",
    url: "/images/ny/IMG_0631.JPG",
    description: "Cozy NYC coffee shop",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "coffee", "cozy", "cafe"],
  }),
  createPhoto({
    id: 59,
    name: "Flatiron Building",
    url: "/images/ny/IMG_0730.JPG",
    description: "Iconic Flatiron Building",
    date: "Fall 2024",
    location: "Flatiron District, NY",
    tags: ["new york", "flatiron", "landmark", "architecture"],
    liked: true,
  }),
  createPhoto({
    id: 60,
    name: "NYC Park View",
    url: "/images/ny/IMG_0748.JPG",
    description: "Peaceful park in the city",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "park", "peaceful", "green"],
  }),
  createPhoto({
    id: 61,
    name: "Grand Central",
    url: "/images/ny/IMG_0767.JPG",
    description: "Grand Central Terminal",
    date: "Fall 2024",
    location: "Grand Central, NY",
    tags: ["new york", "grand central", "terminal", "landmark"],
  }),
  createPhoto({
    id: 62,
    name: "NYC Museum",
    url: "/images/ny/IMG_0768.JPG",
    description: "Museum district",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "museum", "culture", "art"],
  }),
  createPhoto({
    id: 63,
    name: "NYC Evening",
    url: "/images/ny/IMG_1232.JPG",
    description: "Evening in the city",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "evening", "cityscape", "lights"],
  }),
  createPhoto({
    id: 64,
    name: "Brooklyn Waterfront",
    url: "/images/ny/IMG_2311.JPG",
    description: "Brooklyn waterfront view",
    date: "Fall 2024",
    location: "Brooklyn, NY",
    tags: ["new york", "brooklyn", "waterfront", "scenic"],
  }),
  createPhoto({
    id: 65,
    name: "NYC Street Scene",
    url: "/images/ny/IMG_2331.JPG",
    description: "Typical NYC street",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "street", "urban", "scene"],
  }),
  createPhoto({
    id: 66,
    name: "City Reflections",
    url: "/images/ny/IMG_2333.JPG",
    description: "City lights reflecting",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "reflections", "lights", "artistic"],
  }),
  createPhoto({
    id: 67,
    name: "NYC Architecture Detail",
    url: "/images/ny/IMG_2409.JPG",
    description: "Architectural details",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "architecture", "detail", "design"],
  }),
  createPhoto({
    id: 68,
    name: "Battery Park",
    url: "/images/ny/IMG_5961.JPG",
    description: "Battery Park waterfront",
    date: "Fall 2024",
    location: "Battery Park, NY",
    tags: ["new york", "battery park", "waterfront", "park"],
  }),
  createPhoto({
    id: 69,
    name: "NYC Taxi",
    url: "/images/ny/IMG_5984.JPG",
    description: "Classic yellow cab",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "taxi", "yellow cab", "iconic"],
  }),
  createPhoto({
    id: 70,
    name: "NYC Food Scene",
    url: "/images/ny/IMG_5998.JPG",
    description: "NYC culinary experience",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "food", "culinary", "dining"],
  }),
  createPhoto({
    id: 71,
    name: "Lower East Side",
    url: "/images/ny/IMG_6025.JPG",
    description: "Lower East Side neighborhood",
    date: "Fall 2024",
    location: "Lower East Side, NY",
    tags: ["new york", "lower east side", "neighborhood", "urban"],
  }),
  createPhoto({
    id: 72,
    name: "NYC Bridges",
    url: "/images/ny/IMG_6048.JPG",
    description: "NYC bridge architecture",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "bridges", "architecture", "infrastructure"],
  }),
  createPhoto({
    id: 73,
    name: "Manhattan Sunset",
    url: "/images/ny/IMG_6103.JPG",
    description: "Manhattan at golden hour",
    date: "Fall 2024",
    location: "Manhattan, NY",
    tags: ["new york", "manhattan", "sunset", "golden hour"],
    liked: true,
  }),
  createPhoto({
    id: 74,
    name: "NYC River View",
    url: "/images/ny/IMG_6105.JPG",
    description: "River view of the city",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "river", "view", "scenic"],
  }),
  createPhoto({
    id: 75,
    name: "NYC Nightlife",
    url: "/images/ny/IMG_6114.JPG",
    description: "Vibrant NYC nightlife",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "nightlife", "vibrant", "entertainment"],
  }),
  createPhoto({
    id: 76,
    name: "Chinatown NYC",
    url: "/images/ny/IMG_6115.JPG",
    description: "Colorful Chinatown district",
    date: "Fall 2024",
    location: "Chinatown, NY",
    tags: ["new york", "chinatown", "culture", "colorful"],
  }),
  createPhoto({
    id: 77,
    name: "NYC Urban Life",
    url: "/images/ny/IMG_6165.JPG",
    description: "Daily life in NYC",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "urban", "life", "daily"],
  }),
  createPhoto({
    id: 78,
    name: "NYC Panorama",
    url: "/images/ny/IMG_6166.JPG",
    description: "Panoramic city view",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "panorama", "view", "cityscape"],
    liked: true,
  }),
  createPhoto({
    id: 79,
    name: "NYC Memories",
    url: "/images/ny/IMG_6169.JPG",
    description: "Memorable NYC moments",
    date: "Fall 2024",
    location: "New York, NY",
    tags: ["new york", "memories", "moments", "special"],
    liked: true,
  }),
  
  // San Francisco Photos
  createPhoto({
    id: 80,
    name: "Golden Gate Bridge",
    url: "/images/sf/IMG_0928.JPG",
    description: "Iconic Golden Gate Bridge view",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "golden gate", "bridge", "landmark", "architecture"],
    liked: true,
  }),
  createPhoto({
    id: 81,
    name: "SF Skyline",
    url: "/images/sf/IMG_0914.JPG",
    description: "Beautiful San Francisco cityscape",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "skyline", "cityscape", "urban", "architecture"],
    liked: true,
  }),
  createPhoto({
    id: 82,
    name: "Coit Tower View",
    url: "/images/sf/IMG_0899.jpg",
    description: "Panoramic view from Coit Tower",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "coit tower", "panorama", "view", "landmark"],
    liked: true,
  }),
  createPhoto({
    id: 83,
    name: "Fisherman's Wharf",
    url: "/images/sf/IMG_0888.JPG",
    description: "Vibrant Fisherman's Wharf district",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "fishermans wharf", "waterfront", "tourist", "vibrant"],
    liked: true,
  }),
  createPhoto({
    id: 84,
    name: "Lombard Street",
    url: "/images/sf/IMG_0853.JPG",
    description: "The famous crooked street",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "lombard street", "crooked", "famous", "street"],
    liked: true,
  }),
  createPhoto({
    id: 85,
    name: "Cable Car",
    url: "/images/sf/IMG_0839.JPG",
    description: "Classic San Francisco cable car",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "cable car", "transportation", "classic", "historic"],
    liked: true,
  }),
  createPhoto({
    id: 86,
    name: "Alcatraz Island",
    url: "/images/sf/IMG_0837.jpg",
    description: "Historic Alcatraz Island",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "alcatraz", "island", "historic", "prison"],
    liked: true,
  }),
  createPhoto({
    id: 87,
    name: "SF Bay View",
    url: "/images/sf/IMG_0828.JPG",
    description: "Beautiful San Francisco Bay",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "bay", "water", "scenic", "peaceful"],
    liked: true,
  }),
  createPhoto({
    id: 88,
    name: "Chinatown",
    url: "/images/sf/IMG_0814.JPG",
    description: "Vibrant Chinatown district",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "chinatown", "culture", "vibrant", "district"],
    liked: true,
  }),
  createPhoto({
    id: 89,
    name: "SF Architecture",
    url: "/images/sf/IMG_0810.jpg",
    description: "Beautiful San Francisco architecture",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "architecture", "buildings", "urban", "beautiful"],
    liked: true,
  }),
  createPhoto({
    id: 90,
    name: "SF Sunset",
    url: "/images/sf/IMG_0770.JPG",
    description: "Stunning San Francisco sunset",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "sunset", "golden hour", "beautiful", "scenic"],
    liked: true,
  }),
  createPhoto({
    id: 91,
    name: "SF Streets",
    url: "/images/sf/IMG_0118.JPG",
    description: "Charming San Francisco streets",
    date: "Fall 2024",
    location: "San Francisco, CA",
    tags: ["san francisco", "streets", "urban", "charming", "city"],
    liked: true,
  }),
  createPhoto({
    id: 43,
    name: "Long Grasshopper",
    url: "/images/japan/longgrasshopper.jpg",
    description: "Interesting long grasshopper in Japan",
    date: "August 2023",
    location: "Japan",
    tags: ["nature", "japan", "wildlife", "insect", "long"],
    liked: false,
  }),
  createPhoto({
    id: 44,
    name: "Baby Vivi Portrait 2",
    url: "/images/Baby Vivi/PXL_20250729_003438121.jpg",
    description: "Adorable portrait of baby Vivi",
    date: "July 29, 2025",
    location: "Home",
    tags: ["baby", "family", "portrait", "cute", "happiest"],
    liked: true,
  }),
]

// Export the base photo library (client-safe)
export const photoLibrary = basePhotoLibrary

/**
 * PUBLIC ALBUM PHOTOS
 * Photos that exist only in public albums, not in personal library
 * These represent community-contributed photos for public locations
 */
export const publicAlbumPhotos: Photo[] = [
  // Mariners Photos
  createPhoto({
    id: 100,
    name: "Mariners Game Action",
    url: "/images/mariners/mariners3.jpg",
    description: "Exciting Mariners game action at T-Mobile Park",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["mariners", "baseball", "game", "seattle", "sports", "t-mobile-park"],
    liked: true,
  }),
  createPhoto({
    id: 101,
    name: "Mariners Stadium View",
    url: "/images/mariners/mariners4.jpeg",
    description: "Beautiful view of T-Mobile Park during the game",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["mariners", "stadium", "t-mobile-park", "seattle", "baseball"],
    liked: true,
  }),
  createPhoto({
    id: 102,
    name: "Mariners Playoff Atmosphere",
    url: "/images/mariners/mariners5.jpg",
    description: "Electric playoff atmosphere at T-Mobile Park",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["mariners", "playoffs", "atmosphere", "seattle", "baseball", "fans"],
    liked: true,
  }),
  createPhoto({
    id: 103,
    name: "Mariners Victory Celebration",
    url: "/images/mariners/mariners8.jpg",
    description: "Mariners victory celebration with fans",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["mariners", "victory", "celebration", "seattle", "baseball", "fans"],
    liked: true,
  }),
  
  // Umi Photos
  createPhoto({
    id: 95,
    name: "Umi Restaurant",
    url: "/images/umi/umi.jpeg",
    description: "Beautiful Umi restaurant interior",
    date: "2024",
    location: "Seattle, WA",
    tags: ["umi", "restaurant", "japanese", "seattle", "dining"],
    liked: true,
  }),
  createPhoto({
    id: 96,
    name: "Umi Sushi Bar",
    url: "/images/umi/umi2.jpg",
    description: "Elegant sushi bar at Umi",
    date: "2024",
    location: "Seattle, WA",
    tags: ["umi", "sushi", "bar", "japanese", "seattle"],
    liked: true,
  }),
  createPhoto({
    id: 97,
    name: "Umi Dining Experience",
    url: "/images/umi/umi5.jpeg",
    description: "Fine dining experience at Umi",
    date: "2024",
    location: "Seattle, WA",
    tags: ["umi", "dining", "japanese", "fine dining", "seattle"],
    liked: true,
  }),
  createPhoto({
    id: 98,
    name: "Umi Interior",
    url: "/images/umi/umi6.jpg",
    description: "Sophisticated interior design at Umi",
    date: "2024",
    location: "Seattle, WA",
    tags: ["umi", "interior", "design", "japanese", "seattle"],
    liked: true,
  }),
  
  // DubHacks 2024 Photos
  createPhoto({
    id: 104,
    name: "DubHacks 2024 Event",
    url: "/images/dubhacks24/dubhacks1.png",
    description: "DubHacks 2024 hackathon event",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["dubhacks", "hackathon", "event", "seattle", "uw", "tech"],
    liked: true,
  }),
  createPhoto({
    id: 105,
    name: "DubHacks Participants",
    url: "/images/dubhacks24/dubhacks2.jpeg",
    description: "DubHacks 2024 participants working on projects",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["dubhacks", "hackathon", "participants", "seattle", "uw", "coding"],
    liked: true,
  }),
  createPhoto({
    id: 106,
    name: "DubHacks Team Collaboration",
    url: "/images/dubhacks24/dubhacks3.jpeg",
    description: "Team collaboration at DubHacks 2024",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["dubhacks", "hackathon", "collaboration", "seattle", "uw", "teamwork"],
    liked: true,
  }),
  createPhoto({
    id: 107,
    name: "DubHacks Innovation",
    url: "/images/dubhacks24/dubhacks4.jpeg",
    description: "Innovation and creativity at DubHacks 2024",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["dubhacks", "hackathon", "innovation", "seattle", "uw", "creativity"],
    liked: true,
  }),
  createPhoto({
    id: 108,
    name: "DubHacks Tech Environment",
    url: "/images/dubhacks24/dubhacks5.jpeg",
    description: "Tech environment and atmosphere at DubHacks 2024",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["dubhacks", "hackathon", "tech", "seattle", "uw", "environment"],
    liked: true,
  }),
  createPhoto({
    id: 109,
    name: "DubHacks Final Presentation",
    url: "/images/dubhacks24/dubhacks6.jpeg",
    description: "Final project presentation at DubHacks 2024",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["dubhacks", "hackathon", "presentation", "seattle", "uw", "final"],
    liked: true,
  }),
  createPhoto({
    id: 110,
    name: "DubHacks Celebration",
    url: "/images/dubhacks24/dubhacks7.jpeg",
    description: "DubHacks 2024 celebration and networking",
    date: "October 2024",
    location: "Seattle, WA",
    tags: ["dubhacks", "hackathon", "celebration", "seattle", "uw", "networking"],
    liked: true,
  }),
]

/**
 * PHOTO LIBRARY
 * Single source of truth for all photos in the app
 * Now includes both static photos and session-uploaded photos
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
    title: "New York",
    description: "Adventures in the city that never sleeps",
    photoIds: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
    coverPhotoId: 31,
  }),
  createAlbum({
    id: 7,
    title: "San Francisco",
    description: "Exploring the beautiful city by the bay",
    photoIds: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91],
    coverPhotoId: 80,
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
 * PUBLIC ALBUMS
 * Community-driven albums based on local Seattle events, restaurants, and landmarks
 * AI can detect these locations from photo metadata and suggest adding to public albums
 */
export const publicAlbums: PublicAlbum[] = [
  {
    id: 1,
    title: "ALCS Game 5",
    location: "Seattle, WA",
    description: "American League Championship Series Game 5 at T-Mobile Park. Mariners lead 3-2.",
    photoIds: [100, 101, 102, 103],
    contributorCount: 1,
    photoCount: 4,
    isPublic: true,
    tags: ["baseball", "mariners", "playoffs", "seattle", "sports", "t-mobile-park"],
    createdAt: "October 2024",
    lastContributed: "Today",
  },
  {
    id: 2,
    title: "Umi Sake House",
    location: "Seattle, WA",
    description: "Premier sushi and Japanese cuisine restaurant in Seattle's Belltown neighborhood.",
    photoIds: [95, 96, 97, 98],
    contributorCount: 1,
    photoCount: 4,
    isPublic: true,
    tags: ["restaurant", "sushi", "japanese", "seattle", "food", "belltown"],
    createdAt: "January 1, 2024",
    lastContributed: "Today",
  },
  {
    id: 3,
    title: "DubHacks 2024",
    location: "Seattle, WA",
    description: "The University of Washington's premier hackathon.",
    photoIds: [104, 105, 106, 107, 108, 109, 110],
    contributorCount: 1,
    photoCount: 7,
    isPublic: true,
    tags: ["hackathon", "uw", "seattle", "tech", "programming", "innovation"],
    createdAt: "October 2024",
    lastContributed: "Today",
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

// Helper function to get photos for public albums
export function getPublicAlbumPhotos(photoIds: number[]): Photo[] {
  return photoIds
    .map((id) => publicAlbumPhotos.find((photo) => photo.id === id))
    .filter((photo): photo is Photo => photo !== undefined)
}

// Helper function to get public album cover photo
export function getPublicAlbumCoverPhoto(photoId: number): Photo | undefined {
  return publicAlbumPhotos.find((photo) => photo.id === photoId)
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
 * Adds a new photo to the library
 * Returns the created photo
 */
export function addPhoto(photoData: {
  name: string
  url: string
  date: string
  location?: string
  description?: string
  tags?: string[]
  width?: number
  height?: number
  fileSize?: string
  aiDescription?: string
  aiTags?: string[]
  mood?: string
  detectedFaces?: FaceDetection[]
}): Photo {
  const newId = Math.max(...photoLibrary.map(p => p.id), 0) + 1
  const newPhoto = createPhoto({
    id: newId,
    name: photoData.name,
    url: photoData.url,
    date: photoData.date,
    location: photoData.location,
    description: photoData.description,
    tags: photoData.tags,
    width: photoData.width,
    height: photoData.height,
    fileSize: photoData.fileSize,
    aiDescription: photoData.aiDescription,
    aiTags: photoData.aiTags,
    mood: photoData.mood,
    detectedFaces: photoData.detectedFaces,
  })

  // Note: This function is kept for compatibility
  // The actual photo addition happens via the upload API route
  return newPhoto
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
