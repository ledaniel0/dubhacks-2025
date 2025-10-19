"use client"

import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { PhotoBatch } from "@/components/photo-batch"
import { AlbumsList } from "@/components/albums-list"
import { SharedAlbums } from "@/components/shared-albums"
import { Library } from "@/components/library"
import { UploadModal } from "@/components/upload-modal"
import { RecentPhotos } from "@/components/recent-photos"
import { photoLibrary } from "@/lib/photo-data"
import { searchPhotosWithAI } from "@/lib/search-service"
import { useState } from "react"
import type { Photo } from "@/lib/types"

export default function HomePage() {
  const [activeView, setActiveView] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchResults, setSearchResults] = useState<Photo[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query || query.trim() === "") {
      setIsSearchMode(false)
      setSearchResults([])
      return
    }

    console.log("🔎 Search initiated for:", query)
    setSearchQuery(query)
    setIsSearchMode(true)
    setIsSearching(true)

    try {
      // Use AI-powered search with Gemini semantic understanding
      const results = await searchPhotosWithAI(photoLibrary, query)
      console.log("📸 Search results:", results.length, "photos")
      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleClearSearch = () => {
    setIsSearchMode(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleAlbumCreated = (title: string, description: string, photoIds: number[]) => {
    // In production, this would save the album to your backend
    console.log("Creating album:", { title, description, photoIds })
    
    // Optionally navigate to albums view
    // setActiveView("albums")
  }

  const handleNavigate = (view: string) => {
    setActiveView(view)
    // Clear search mode when navigating away from home
    if (view !== "home") {
      handleClearSearch()
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      {(activeView === "home" || activeView === "search-results" || activeView === "library") && (
        <TopHeader
          onUploadClick={() => setIsUploadModalOpen(true)}
          onSearch={handleSearch}
          showSearch={activeView === "home" || activeView === "search-results" || activeView === "library"}
        />
      )}

      <main className={`flex-1 ml-64 ${activeView === "home" || activeView === "search-results" || activeView === "library" ? "pt-20" : ""}`}>
        {activeView === "home" && (
          <div className="relative">
            {/* Home Content - Only visible when NOT in search mode */}
            {!isSearchMode && (
              <div className="transition-all duration-500">
                <RecentPhotos onViewAll={() => handleNavigate("library")} />
                <div className="max-w-7xl mx-auto px-8 py-12">
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Albums</h2>
                  <AlbumsList onAlbumClick={(id) => console.log("Album clicked:", id)} isPinterestStyle={true} />
                </div>
              </div>
            )}

            {/* Search Results Batch - Only visible in search mode */}
            {isSearchMode && (
              <div>
                {isSearching && (
                  <div className="max-w-7xl mx-auto px-8 py-12 text-center">
                    <p className="text-muted-foreground">Searching with AI...</p>
                  </div>
                )}
                {!isSearching && (
                  <PhotoBatch
                    photos={searchResults}
                    searchQuery={searchQuery}
                    onClearSearch={handleClearSearch}
                    onAlbumCreated={handleAlbumCreated}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {activeView === "albums" && <AlbumsList onAlbumClick={(id) => console.log("Album clicked:", id)} />}

        {activeView === "shared" && <SharedAlbums onAlbumClick={(id) => console.log("Shared album clicked:", id)} />}

        {activeView === "library" && <Library />}
      </main>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  )
}
