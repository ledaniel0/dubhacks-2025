"use client"

import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { PhotoBatch } from "@/components/photo-batch"
import { AlbumsList } from "@/components/albums-list"
import { SharedAlbums } from "@/components/shared-albums"
import { Library } from "@/components/library"
import { UploadModal } from "@/components/upload-modal"
import { RecentPhotos } from "@/components/recent-photos"
import { PhotoDetail } from "@/components/photo-detail"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Sparkles } from "lucide-react"
import { photoLibrary, addSharedAlbum, addAlbum } from "@/lib/photo-data"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { Photo } from "@/lib/types"

export default function HomePage() {
  const [activeView, setActiveView] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Photo[]>([])
  const [isCreateSharedAlbumOpen, setIsCreateSharedAlbumOpen] = useState(false)
  const [sharedAlbumTitle, setSharedAlbumTitle] = useState("")
  const [sharedAlbumDescription, setSharedAlbumDescription] = useState("")
  const [isCreatingSharedAlbum, setIsCreatingSharedAlbum] = useState(false)
  const [createdSharedAlbum, setCreatedSharedAlbum] = useState<{ id: number; name: string } | null>(null)
  const [albumsUpdated, setAlbumsUpdated] = useState(0) // Trigger re-render when albums change
  const [showAlbumSuccess, setShowAlbumSuccess] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) return
    
    setIsSearchMode(true)
    setIsSearching(true)
    setSearchResults([])
    
    // Simulate AI search processing with delay (like ChatGPT)
    setTimeout(() => {
      // In production, this would call your AI API
      // For now, filter photos based on query
      const results = photoLibrary.filter(
        (photo) =>
          photo.name.toLowerCase().includes(query.toLowerCase()) ||
          photo.location.toLowerCase().includes(query.toLowerCase()) ||
          photo.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())) ||
          photo.description?.toLowerCase().includes(query.toLowerCase()),
      )
      
      setSearchResults(results)
      setIsSearching(false)
    }, 800) // 0.8 second delay to simulate AI processing
  }

  const handleClearSearch = () => {
    setIsSearchMode(false)
    setIsSearching(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleAlbumCreated = (title: string, description: string, photoIds: number[]) => {
    // Create and save the album
    const newAlbum = addAlbum(title, description, photoIds)
    console.log("Created album:", newAlbum)
    
    // Trigger re-render of albums list
    setAlbumsUpdated(prev => prev + 1)
    
    // Show success notification
    setShowAlbumSuccess(true)
    setTimeout(() => setShowAlbumSuccess(false), 3000) // Hide after 3 seconds
  }

  const handleCreateSharedAlbum = async () => {
    if (!sharedAlbumTitle.trim()) return

    setIsCreatingSharedAlbum(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Store the title before clearing it
    const albumTitle = sharedAlbumTitle.trim()
    const albumDescription = sharedAlbumDescription.trim()

    // Create the shared album
    const newSharedAlbum = addSharedAlbum(albumTitle, albumDescription, [])
    setCreatedSharedAlbum(newSharedAlbum)
    
    console.log("Created shared album:", newSharedAlbum)
    
    setIsCreatingSharedAlbum(false)
    setIsCreateSharedAlbumOpen(false)
    
    // Clear form fields after successful creation
    setSharedAlbumTitle("")
    setSharedAlbumDescription("")
    setCreatedSharedAlbum(null)
    
    // Navigate to photo selection mode and trigger search
    handleSearch(albumTitle)
  }

  const handleCloseSharedAlbumDialog = () => {
    if (!isCreatingSharedAlbum) {
      setSharedAlbumTitle("")
      setSharedAlbumDescription("")
      setCreatedSharedAlbum(null)
      setIsCreateSharedAlbumOpen(false)
    }
  }

  const handleAddToSharedAlbum = (photoIds: number[]) => {
    if (createdSharedAlbum) {
      // In production, this would update the shared album with the new photos
      console.log("Adding photos to shared album:", { albumId: createdSharedAlbum.id, photoIds })
      
      // Clear the shared album context and return to home
      setCreatedSharedAlbum(null)
      setIsSearchMode(false)
      setSearchQuery("")
      setSearchResults([])
    }
  }

  const handleNavigate = (view: string) => {
    setActiveView(view)
    // Clear search mode when navigating away from home and library (pages that support search)
    if (view !== "home" && view !== "library") {
      handleClearSearch()
    }
  }

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const handleClosePhotoDetail = () => {
    setSelectedPhoto(null)
  }

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Vibrant animated background mesh gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#FF6B35]/20 to-[#F7931E]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-gradient-to-br from-[#00B4D8]/15 to-[#4A90E2]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-br from-[#9D4EDD]/20 to-[#E0338E]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-[#F7931E]/15 to-[#FF6B35]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      {(activeView === "home" || activeView === "search-results" || activeView === "library") && (
        <TopHeader
          onUploadClick={() => setIsUploadModalOpen(true)}
          onSearch={handleSearch}
          onSearchQueryChange={handleSearchQueryChange}
          showSearch={activeView === "home" || activeView === "search-results" || activeView === "library"}
          searchQuery={searchQuery}
        />
      )}

      <main className={`flex-1 ml-64 relative z-10 ${activeView === "home" || activeView === "search-results" || activeView === "library" ? "pt-20" : ""}`}>
        {activeView === "home" && (
          <div className="relative">
            {/* Home Content - Only visible when NOT in search mode */}
            {!isSearchMode && (
              <div className="transition-all duration-500">
                <RecentPhotos onViewAll={() => handleNavigate("library")} onPhotoClick={handlePhotoClick} />
                <div className="max-w-7xl mx-auto px-8 py-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Albums</h2>
                    <Button
                      onClick={() => setIsCreateSharedAlbumOpen(true)}
                      variant="outline"
                      className="border-2 border-primary/40 text-primary hover:text-primary hover:bg-gradient-to-r hover:from-[#FF6B35]/20 hover:via-[#E0338E]/20 hover:to-[#9D4EDD]/20 hover:border-primary transition-all duration-300 hover:shadow-glow hover:scale-105 font-semibold"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Create Shared Album
                    </Button>
                  </div>
                  <AlbumsList key={albumsUpdated} onAlbumClick={(id) => console.log("Album clicked:", id)} isPinterestStyle={true} />
                </div>
              </div>
            )}

            {/* Search Results Batch - Only visible in search mode */}
            {isSearchMode && (
                  <PhotoBatch
                    photos={searchResults}
                    searchQuery={searchQuery}
                    isLoading={isSearching}
                    onClearSearch={handleClearSearch}
                    onAlbumCreated={handleAlbumCreated}
                    onPhotoClick={handlePhotoClick}
                    sharedAlbumContext={createdSharedAlbum ? {
                      albumId: createdSharedAlbum.id,
                      albumTitle: createdSharedAlbum.name,
                      onAddToSharedAlbum: handleAddToSharedAlbum
                    } : undefined}
                  />
            )}
          </div>
        )}

        {activeView === "albums" && <AlbumsList key={albumsUpdated} onAlbumClick={(id) => console.log("Album clicked:", id)} />}

        {activeView === "shared" && <SharedAlbums onAlbumClick={(id) => console.log("Shared album clicked:", id)} onCreateSharedAlbum={() => setIsCreateSharedAlbumOpen(true)} />}

        {activeView === "library" && (
          <Library 
            searchResults={isSearchMode ? searchResults : undefined}
            isSearchMode={isSearchMode}
            searchQuery={searchQuery}
            isLoading={isSearching}
            onPhotoClick={handlePhotoClick}
          />
        )}
      </main>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />

      {/* Create Shared Album Dialog */}
      <Dialog open={isCreateSharedAlbumOpen} onOpenChange={handleCloseSharedAlbumDialog}>
        <DialogContent className="sm:max-w-2xl glass-effect border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FF6B35] via-[#E0338E] to-[#9D4EDD] flex items-center justify-center shadow-glow">
                <Share2 className="h-7 w-7 text-white" />
              </div>
              Create Shared Album
            </DialogTitle>
            <DialogDescription>
              Create a shared album and generate a link to invite others. You'll then search and add photos to populate it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Album Title */}
            <div className="space-y-2">
              <label htmlFor="shared-album-title" className="text-sm font-semibold text-foreground">
                Album Title *
              </label>
              <Input
                id="shared-album-title"
                value={sharedAlbumTitle}
                onChange={(e) => setSharedAlbumTitle(e.target.value)}
                placeholder="e.g., Team Photos 2025"
                className="h-12 text-base"
                disabled={isCreatingSharedAlbum}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && sharedAlbumTitle.trim()) {
                    handleCreateSharedAlbum()
                  }
                }}
              />
            </div>

            {/* Album Description */}
            <div className="space-y-2">
              <label htmlFor="shared-album-description" className="text-sm font-semibold text-foreground">
                Description (optional)
              </label>
              <textarea
                id="shared-album-description"
                value={sharedAlbumDescription}
                onChange={(e) => setSharedAlbumDescription(e.target.value)}
                placeholder="Add a description for this shared album..."
                className="w-full h-24 px-4 py-3 text-base bg-card border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isCreatingSharedAlbum}
              />
            </div>

            {/* Share Link Preview */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Share Link
              </label>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Share this link with others:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-background px-3 py-2 rounded border">
                    {typeof window !== 'undefined' ? `${window.location.origin}/shared/${sharedAlbumTitle.trim().toLowerCase().replace(/\s+/g, '-')}` : `/shared/${sharedAlbumTitle.trim().toLowerCase().replace(/\s+/g, '-')}`}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!sharedAlbumTitle.trim()}
                    onClick={() => {
                      if (typeof window !== 'undefined' && sharedAlbumTitle.trim()) {
                        const link = `${window.location.origin}/shared/${sharedAlbumTitle.trim().toLowerCase().replace(/\s+/g, '-')}`
                        navigator.clipboard.writeText(link)
                      }
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="ghost" onClick={handleCloseSharedAlbumDialog} disabled={isCreatingSharedAlbum}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateSharedAlbum}
              disabled={!sharedAlbumTitle.trim() || isCreatingSharedAlbum}
              className={cn(
                "animated-gradient text-primary-foreground transition-all duration-300 font-semibold",
                !sharedAlbumTitle.trim() || isCreatingSharedAlbum ? "opacity-50" : "hover:shadow-glow hover:scale-105 pulse-glow",
              )}
            >
              {isCreatingSharedAlbum ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Creating Album...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Create & Add Photos
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Notification */}
      {showAlbumSuccess && (
        <div className="fixed top-20 right-8 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="font-medium">Album created successfully!</span>
          </div>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <PhotoDetail photo={selectedPhoto} onClose={handleClosePhotoDetail} />
      )}
    </div>
  )
}