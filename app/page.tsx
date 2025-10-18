"use client"

import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { SearchResults } from "@/components/search-results"
import { AlbumsList } from "@/components/albums-list"
import { SharedAlbums } from "@/components/shared-albums"
import { Library } from "@/components/library"
import { UploadModal } from "@/components/upload-modal"
import { RecentPhotos } from "@/components/recent-photos"
import { useState } from "react"

export default function HomePage() {
  const [activeView, setActiveView] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleHeroCardClick = (query: string) => {
    setSearchQuery(query)
    setActiveView("search-results")
  }

  const handleCategoryClick = (filter: string) => {
    setSearchQuery(filter)
    setActiveView("search-results")
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setActiveView("search-results")
  }

  const handleNavigate = (view: string) => {
    setActiveView(view)
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
          <div>
            <RecentPhotos />
            <div className="max-w-7xl mx-auto px-8 py-12">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Albums</h2>
              <AlbumsList onAlbumClick={(id) => console.log("Album clicked:", id)} isPinterestStyle={true} />
            </div>
          </div>
        )}

        {activeView === "search-results" && (
          <SearchResults
            query={searchQuery}
            onClearSearch={() => setActiveView("home")}
            onSearchChange={(query) => setSearchQuery(query)}
          />
        )}

        {activeView === "albums" && <AlbumsList onAlbumClick={(id) => console.log("Album clicked:", id)} />}

        {activeView === "shared" && <SharedAlbums onAlbumClick={(id) => console.log("Shared album clicked:", id)} />}

        {activeView === "library" && <Library />}
      </main>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </div>
  )
}
