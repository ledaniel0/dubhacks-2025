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
import { AlbumDetail } from "@/components/album-detail"
import { Explore } from "@/components/explore"
import { ExplorePreview } from "@/components/explore-preview"
import { Organize } from "@/components/organize"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Sparkles, Download, FolderPlus, Upload } from "lucide-react"
import { photoLibrary, addSharedAlbum, addAlbum, albums } from "@/lib/photo-data"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import type { Photo, Album, PublicAlbum } from "@/lib/types"

export default function HomePage() {
  const [activeView, setActiveView] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Photo[]>([])
  const [initialSearchQuery, setInitialSearchQuery] = useState("")
  const [refineQuery, setRefineQuery] = useState("")
  const [isCreateSharedAlbumOpen, setIsCreateSharedAlbumOpen] = useState(false)
  const [sharedAlbumTitle, setSharedAlbumTitle] = useState("")
  const [sharedAlbumDescription, setSharedAlbumDescription] = useState("")
  const [isCreatingSharedAlbum, setIsCreatingSharedAlbum] = useState(false)
  const [createdSharedAlbum, setCreatedSharedAlbum] = useState<{ id: number; name: string } | null>(null)
  const [albumsUpdated, setAlbumsUpdated] = useState(0) // Trigger re-render when albums change
  const [showAlbumSuccess, setShowAlbumSuccess] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [selectedPublicAlbum, setSelectedPublicAlbum] = useState<PublicAlbum | null>(null)
  const [likedPhotos, setLikedPhotos] = useState<Set<number>>(new Set())
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isModalActive, setIsModalActive] = useState(false)
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([])
  const [clearSelectionTrigger, setClearSelectionTrigger] = useState(0)

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleSelectionChange = (photos: Photo[], isSelectionMode: boolean) => {
    setSelectedPhotos(photos)
    setIsSelectionMode(isSelectionMode)
  }

  const handleClearSelection = () => {
    setSelectedPhotos([])
    setIsSelectionMode(false)
    setClearSelectionTrigger(prev => prev + 1) // Trigger Library component to clear selections
  }


  const handleSearch = (query: string) => {
    if (!query.trim()) return

    // Check if this is a refinement or new search
    const isRefinement = isSearchMode && searchResults.length > 0

    // Set states - for refinement update refineQuery, for new search update initialSearchQuery
    setIsSearchMode(true)
    setIsSearching(true)
    setSearchQuery(query)

    if (isRefinement) {
      setRefineQuery(query)
    } else {
      setSearchResults([])
      setInitialSearchQuery(query)
      setRefineQuery("")
    }
    
    // Simulate AI search processing with delay (like ChatGPT)
    setTimeout(async () => {
      try {
        // Fetch photos from API
        const response = await fetch('/api/photos')
        const data = await response.json()
        const photos: Photo[] = data.photos || []
        
        // Filter photos based on query - split query into words
        const queryWords = query.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0)
        const results = photos.filter((photo) =>
          queryWords.some((word) =>
            photo.name.toLowerCase().includes(word) ||
            photo.location.toLowerCase().includes(word) ||
            photo.tags.some((tag) => tag.toLowerCase().includes(word)) ||
            photo.description?.toLowerCase().includes(word)
          )
        )
        
        setSearchResults(results)
        setIsSearching(false)
      } catch (error) {
        console.error('Error searching photos:', error)
        setSearchResults([])
        setIsSearching(false)
      }
    }, 800) // 0.8 second delay to simulate AI processing
  }

  const handleClearSearch = () => {
    setIsSearchMode(false)
    setIsSearching(false)
    setSearchQuery("")
    setSearchResults([])
    setInitialSearchQuery("")
    setRefineQuery("")
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
    // Always clear search when changing tabs (same as clear search button)
    handleClearSearch()
    setActiveView(view)
  }

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
    setIsModalActive(true)
  }

  const handleClosePhotoDetail = () => {
    setSelectedPhoto(null)
    setIsModalActive(false)
  }

  const handleAlbumClick = (albumId: number) => {
    const album = albums.find(a => a.id === albumId)
    if (album) {
      setSelectedAlbum(album)
      setIsModalActive(true)
    }
  }

  const handleCloseAlbumDetail = () => {
    setSelectedAlbum(null)
    // Clear any selected photo to prevent photo modal from opening
    setSelectedPhoto(null)
    setIsModalActive(false)
  }

  const handlePublicAlbumClick = (album: PublicAlbum) => {
    setSelectedPublicAlbum(album)
    // For now, just log it - could navigate to a detail view later
    console.log("Public album clicked:", album)
  }

  const toggleLike = (id: number) => {
    setLikedPhotos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
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

      <Sidebar 
        activeView={activeView} 
        onNavigate={handleNavigate} 
        onCollapseChange={setIsSidebarCollapsed}
        isModalActive={isModalActive}
      />
      {(activeView === "home" || activeView === "search-results" || activeView === "library") && (
        <TopHeader
          onSearch={handleSearch}
          onSearchQueryChange={handleSearchQueryChange}
          showSearch={activeView === "home" || activeView === "search-results" || activeView === "library"}
          searchQuery={searchQuery}
          isSidebarCollapsed={isSidebarCollapsed}
          isModalActive={isModalActive}
          pageTitle={activeView === "home" ? "Memories" : activeView === "library" ? "Library" : undefined}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
      )}

      <main className={cn(
        "flex-1 relative z-10 transition-all duration-500 ease-in-out",
        isModalActive ? "ml-0" : isSidebarCollapsed ? "ml-16" : "ml-64",
        activeView === "home" || activeView === "search-results" || activeView === "library" ? "pt-20" : ""
      )}>
        {activeView === "home" && (
          <div className="relative">
            {/* Home Content - Only visible when NOT in search mode */}
            {!isSearchMode && (
              <div className="transition-all duration-500 pt-4">
                <RecentPhotos onViewAll={() => handleNavigate("library")} onPhotoClick={handlePhotoClick} refreshTrigger={refreshTrigger} />
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
                  <AlbumsList key={albumsUpdated} onAlbumClick={handleAlbumClick} isPinterestStyle={true} />
                </div>

                {/* Explore Preview Section */}
                <ExplorePreview
                  onViewAll={() => handleNavigate("explore")}
                  onAlbumClick={handlePublicAlbumClick}
                />
              </div>
            )}

            {/* Search Results Batch - Only visible in search mode */}
            {isSearchMode && (
                  <PhotoBatch
                    photos={searchResults}
                    searchQuery={initialSearchQuery || searchQuery}
                    refineQuery={refineQuery}
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

        {activeView === "albums" && <AlbumsList key={albumsUpdated} onAlbumClick={handleAlbumClick} />}

        {activeView === "organize" && <Organize onPhotoClick={handlePhotoClick} />}

        {activeView === "shared" && <SharedAlbums onAlbumClick={(id) => console.log("Shared album clicked:", id)} onCreateSharedAlbum={() => setIsCreateSharedAlbumOpen(true)} />}

        {activeView === "explore" && <Explore onAlbumClick={handlePublicAlbumClick} onModalStateChange={setIsModalActive} />}

        {activeView === "library" && (
          <Library
            searchResults={isSearchMode ? searchResults : undefined}
            isSearchMode={isSearchMode}
            searchQuery={searchQuery}
            isLoading={isSearching}
            onPhotoClick={handlePhotoClick}
            refreshTrigger={refreshTrigger}
            onSelectionChange={handleSelectionChange}
            clearSelectionTrigger={clearSelectionTrigger}
          />
        )}
      </main>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onPhotoUploaded={() => setRefreshTrigger(prev => prev + 1)}
      />

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
        <PhotoDetail
          photo={selectedPhoto}
          onClose={handleClosePhotoDetail}
          isLiked={likedPhotos.has(selectedPhoto.id)}
          onToggleLike={toggleLike}
        />
      )}

      {/* Album Detail Modal */}
      {selectedAlbum && (
        <AlbumDetail
          album={selectedAlbum}
          onClose={handleCloseAlbumDetail}
          onPhotoClick={(photoId) => {
            // Add a small delay to prevent photo modal from opening when album is closing
            setTimeout(() => {
              const photo = photoLibrary.find(p => p.id === photoId)
              if (photo && selectedAlbum) { // Only open if album is still selected
                setSelectedPhoto(photo)
                setIsModalActive(true)
              }
            }, 100)
          }}
        />
      )}

      {/* Selection Footer */}
      <div className={cn(
        "fixed bottom-0 right-0 z-40 transition-all duration-500 ease-in-out",
        isModalActive ? "left-0" : isSidebarCollapsed ? "left-16" : "left-64",
        isSelectionMode 
          ? "translate-y-0 opacity-100" 
          : "translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "glass-effect border-t border-border/50 shadow-layered-hover transition-all duration-500",
          isSelectionMode ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        )}>
          <div className="max-w-7xl mx-auto px-8 py-4">
            <div className={cn(
              "flex items-center justify-between gap-4 transition-all duration-700 delay-100",
              isSelectionMode ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}>
              {/* Left side: Selection info and controls */}
              <div className={cn(
                "flex items-center gap-4 transition-all duration-700 delay-200",
                isSelectionMode ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center transition-all duration-500",
                    isSelectionMode ? "animate-in zoom-in-50 duration-500 delay-100" : ""
                  )}>
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                </div>
                {selectedPhotos.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                    className={cn(
                      "text-muted-foreground hover:text-foreground transition-all duration-500",
                      isSelectionMode ? "animate-in slide-in-from-left-4 fade-in duration-500 delay-300" : ""
                    )}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>

              {/* Right side: Action buttons */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  disabled={selectedPhotos.length === 0}
                  className={cn(
                    "border-2 border-primary/40 transition-all duration-300",
                    isSelectionMode ? "animate-in slide-in-from-right-4 fade-in duration-500 delay-200" : "",
                    selectedPhotos.length > 0
                      ? "hover:border-primary hover:bg-primary/10"
                      : "opacity-50 cursor-not-allowed",
                  )}
                  style={{
                    transitionDelay: selectedPhotos.length > 0 ? '0ms' : undefined
                  }}
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  disabled={selectedPhotos.length === 0}
                  className={cn(
                    "border-2 border-primary/40 transition-all duration-300",
                    isSelectionMode ? "animate-in slide-in-from-right-4 fade-in duration-500 delay-300" : "",
                    selectedPhotos.length > 0
                      ? "hover:border-primary hover:bg-primary/10"
                      : "opacity-50 cursor-not-allowed",
                  )}
                  style={{
                    transitionDelay: selectedPhotos.length > 0 ? '0ms' : undefined
                  }}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  disabled={selectedPhotos.length === 0}
                  className={cn(
                    "border-2 border-primary/40 transition-all duration-300",
                    isSelectionMode ? "animate-in slide-in-from-right-4 fade-in duration-500 delay-400" : "",
                    selectedPhotos.length > 0
                      ? "hover:border-primary hover:bg-primary/10"
                      : "opacity-50 cursor-not-allowed",
                  )}
                  style={{
                    transitionDelay: selectedPhotos.length > 0 ? '0ms' : undefined
                  }}
                >
                  <FolderPlus className="h-5 w-5 mr-2" />
                  Add to Album
                </Button>
                <Button
                  size="lg"
                  disabled={selectedPhotos.length === 0}
                  className={cn(
                    "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg transition-all duration-300",
                    isSelectionMode ? "animate-in slide-in-from-right-4 fade-in duration-500 delay-500" : "",
                    selectedPhotos.length > 0
                      ? "hover:shadow-glow hover:scale-105"
                      : "opacity-50 cursor-not-allowed",
                  )}
                  style={{
                    transitionDelay: selectedPhotos.length > 0 ? '0ms' : undefined
                  }}
                >
                  <FolderPlus className="h-5 w-5 mr-2" />
                  Create Album from {selectedPhotos.length} {selectedPhotos.length === 1 ? "Photo" : "Photos"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}