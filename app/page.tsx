"use client"

import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { SearchHero } from "@/components/search-hero"
import { PhotoBatch } from "@/components/photo-batch"
import { AlbumsList } from "@/components/albums-list"
import { SharedAlbums } from "@/components/shared-albums"
import { Library } from "@/components/library"
import { UploadModal } from "@/components/upload-modal"
import { RecentPhotos } from "@/components/recent-photos"
import { photoLibrary } from "@/lib/photo-data"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Photo } from "@/lib/types"

export default function HomePage() {
  const [activeView, setActiveView] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchResults, setSearchResults] = useState<Photo[]>([])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearchMode(true)
    
    // Simulate AI search - in production, this would call your AI API
    // For now, filter photos based on query
    const results = photoLibrary.filter(
      (photo) =>
        photo.name.toLowerCase().includes(query.toLowerCase()) ||
        photo.location.toLowerCase().includes(query.toLowerCase()) ||
        photo.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
        photo.description?.toLowerCase().includes(query.toLowerCase()),
    )
    
    setSearchResults(results)
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
      <TopHeader
        onUploadClick={() => setIsUploadModalOpen(true)}
        onSearch={handleSearch}
        showSearch={activeView === "home" || activeView === "search-results"}
      />

      <main className="flex-1 ml-64 pt-20">
        {activeView === "home" && (
          <div className="relative">
            {/* Search Hero - Always visible on home */}
            <SearchHero onSearch={handleSearch} isSearchActive={isSearchMode} currentQuery={searchQuery} />

            {/* Home Content - Only visible when NOT in search mode */}
            <div
              className={cn(
                "transition-all duration-500",
                isSearchMode ? "opacity-0 h-0 overflow-hidden" : "opacity-100",
              )}
            >
              <RecentPhotos />
              <div className="max-w-7xl mx-auto px-8 py-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">Albums</h2>
                <AlbumsList onAlbumClick={(id) => console.log("Album clicked:", id)} isPinterestStyle={true} />
              </div>
            </div>

            {/* Search Results Batch - Only visible in search mode */}
            {isSearchMode && (
              <PhotoBatch
                photos={searchResults}
                searchQuery={searchQuery}
                onClearSearch={handleClearSearch}
                onAlbumCreated={handleAlbumCreated}
              />
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
