"use client"

import { ArrowLeft, Calendar, MapPin, Tag, Camera, Heart, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Photo } from "@/lib/types"
import { useEffect, useState } from "react"

interface PhotoDetailProps {
  photo: Photo
  onClose: () => void
  isLiked?: boolean
  onToggleLike?: (id: number) => void
}

export function PhotoDetail({ photo, onClose, isLiked = false, onToggleLike }: PhotoDetailProps) {
  const [dimensions, setDimensions] = useState({ width: photo.width, height: photo.height })
  const [liked, setLiked] = useState(isLiked)

  useEffect(() => {
    // Disable scroll on mount
    document.body.style.overflow = 'hidden'

    // Load actual image dimensions
    const img = new Image()
    img.src = photo.url
    img.onload = () => {
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
    }

    // Re-enable scroll on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [photo.url])

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop, not on children
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleLikeToggle = () => {
    setLiked(!liked)
    onToggleLike?.(photo.id)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${photo.name}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm" onClick={handleBackdropClick}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 glass-effect border-b border-border/50">
        <div className="flex items-center justify-between px-8 py-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-primary/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={handleLikeToggle}>
              <Heart className={cn("h-4 w-4", liked ? "text-red-500 fill-red-500" : "text-muted-foreground")} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={handleDownload}>
              <Download className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 h-full overflow-y-auto" onClick={handleBackdropClick}>
        <div className="max-w-6xl mx-auto px-8 py-8" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Photo */}
            <div className="h-full">
              <div className="h-full rounded-2xl overflow-hidden shadow-2xl bg-card">
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-col bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
              {/* Title and Description */}
              <div className="space-y-4 mb-6">
                <h1 className="text-3xl font-bold text-foreground">{photo.name}</h1>
                {photo.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{photo.description}</p>
                )}
              </div>

              {/* Basic Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-foreground font-medium">{photo.date}</span>
                </div>

                {photo.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">{photo.location}</span>
                  </div>
                )}
              </div>

              {/* Camera Info */}
              {(photo.camera || photo.aperture || photo.iso || photo.focalLength) && (
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">Camera Details</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {photo.camera && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Camera</span>
                        <p className="text-foreground font-medium">{photo.camera}</p>
                      </div>
                    )}
                    {photo.aperture && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Aperture</span>
                        <p className="text-foreground font-medium">{photo.aperture}</p>
                      </div>
                    )}
                    {photo.iso && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground">ISO</span>
                        <p className="text-foreground font-medium">{photo.iso}</p>
                      </div>
                    )}
                    {photo.focalLength && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Focal Length</span>
                        <p className="text-foreground font-medium">{photo.focalLength}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}


              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="space-y-3 mt-auto pb-6">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    <span className="text-foreground font-medium">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* File Info */}
              <div className="space-y-3">
                <span className="text-foreground font-medium">File Information</span>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Dimensions</span>
                    <p className="text-foreground font-medium">{dimensions.width} × {dimensions.height}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-muted-foreground">File Size</span>
                    <p className="text-foreground font-medium">{photo.fileSize}</p>
                  </div>
                </div>
              </div>

              {/* Photo Actions - at bottom */}
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-border/50">
                <Button variant="outline" className="flex items-center gap-2" onClick={handleLikeToggle}>
                  <Heart className={cn("h-4 w-4", liked ? "text-red-500 fill-red-500" : "")} />
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button variant="outline" className="flex items-center gap-2" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
