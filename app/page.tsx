"use client"

import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { PhotoBatch } from "@/components/photo-batch"
import { AlbumsList } from "@/components/albums-list"
import { SharedAlbums } from "@/components/shared-albums"
import { Library } from "@/components/library"
import { UploadModal } from "@/components/upload-modal"
import { RecentPhotos } from "@/components/recent-photos"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Sparkles } from "lucide-react"
import { photoLibrary, addSharedAlbum } from "@/lib/photo-data"
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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
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
    }, 1500) // 1.5 second delay to simulate AI processing
  }

  const handleClearSearch = () => {
    setIsSearchMode(false)
    setIsSearching(false)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleAlbumCreated = (title: string, description: string, photoIds: number[]) => {
    // In production, this would save the album to your backend
    console.log("Creating album:", { title, description, photoIds })
    
    // Optionally navigate to albums view
    // setActiveView("albums")
  }

  const handleCreateSharedAlbum = async () => {
    if (!sharedAlbumTitle.trim()) return

    setIsCreatingSharedAlbum(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Create the shared album
    const newSharedAlbum = addSharedAlbum(sharedAlbumTitle.trim(), sharedAlbumDescription.trim(), [])
    setCreatedSharedAlbum(newSharedAlbum)
    
    console.log("Created shared album:", newSharedAlbum)
    
    setIsCreatingSharedAlbum(false)
    setIsCreateSharedAlbumOpen(false)
    
    // Navigate to photo selection mode and trigger search
    handleSearch(sharedAlbumTitle.trim())
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
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Albums</h2>
                    <Button
                      onClick={() => setIsCreateSharedAlbumOpen(true)}
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Create Shared Album
                    </Button>
                  </div>
                  <AlbumsList onAlbumClick={(id) => console.log("Album clicked:", id)} isPinterestStyle={true} />
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
                    sharedAlbumContext={createdSharedAlbum ? {
                      albumId: createdSharedAlbum.id,
                      albumTitle: createdSharedAlbum.name,
                      onAddToSharedAlbum: handleAddToSharedAlbum
                    } : undefined}
                  />
            )}
          </div>
        )}

        {activeView === "albums" && <AlbumsList onAlbumClick={(id) => console.log("Album clicked:", id)} />}

        {activeView === "shared" && <SharedAlbums onAlbumClick={(id) => console.log("Shared album clicked:", id)} />}

        {activeView === "library" && <Library />}
      </main>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />

      {/* Create Shared Album Dialog */}
      <Dialog open={isCreateSharedAlbumOpen} onOpenChange={handleCloseSharedAlbumDialog}>
        <DialogContent className="sm:max-w-2xl glass-effect border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-primary" />
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
                "bg-gradient-to-r from-primary to-accent text-primary-foreground transition-all duration-300",
                !sharedAlbumTitle.trim() || isCreatingSharedAlbum ? "opacity-50" : "hover:shadow-glow hover:scale-105",
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
    </div>
  )
}