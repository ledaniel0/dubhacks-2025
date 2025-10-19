"use client"

import { Upload, ImageIcon, Cloud, Box, Folder, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

type TabType = "upload" | "cloud" | "google-photos"

interface CloudService {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("upload")
  const [connectedServices, setConnectedServices] = useState<Set<string>>(new Set())
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const cloudServices: CloudService[] = [
    {
      id: "google-photos",
      name: "Google Photos",
      icon: <Image className="h-6 w-6" />,
      color: "from-red-500 to-yellow-500",
      description: "Import from Google Photos",
    },
    {
      id: "icloud",
      name: "iCloud Photos",
      icon: "☁️",
      color: "from-blue-400 to-blue-600",
      description: "Import from iCloud",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      icon: <Box className="h-6 w-6" />,
      color: "from-blue-500 to-blue-700",
      description: "Import from Dropbox",
    },
    {
      id: "onedrive",
      name: "OneDrive",
      icon: <Cloud className="h-6 w-6" />,
      color: "from-blue-600 to-blue-800",
      description: "Import from OneDrive",
    },
    {
      id: "amazon-photos",
      name: "Amazon Photos",
      icon: <Folder className="h-6 w-6" />,
      color: "from-orange-400 to-orange-600",
      description: "Import from Amazon Photos",
    },
  ]

  const handleServiceConnect = (serviceId: string) => {
    // Mock connection - simulate OAuth flow
    setTimeout(() => {
      setConnectedServices((prev) => new Set(prev).add(serviceId))
    }, 500)
  }

  // Get all images from public/images/japan directory
  const googlePhotosImages = [
    "/images/japan/20230801_095353.jpg",
    "/images/japan/20230806_181910.jpg",
    "/images/japan/20230806_203250.jpg",
    "/images/japan/20230807_174057.jpg",
    "/images/japan/20230809_143015.jpg",
    "/images/japan/20230809_232407.jpg",
    "/images/japan/20230810_091148.jpg",
    "/images/japan/20230810_092913.jpg",
    "/images/japan/20230810_095135.jpg",
    "/images/japan/20230810_103406.jpg",
    "/images/japan/20230811_185634.jpg",
    "/images/japan/20230811_204958.jpg",
    "/images/japan/20230811_213536.jpg",
    "/images/japan/20230811_222936.jpg",
    "/images/japan/20230816_151450.jpg",
    "/images/japan/image0-1.jpg",
    "/images/japan/image0-2.jpg",
    "/images/japan/image0.jpg",
    "/images/japan/IMG_0661.jpg",
    "/images/japan/IMG_4282.jpg",
    "/images/japan/IMG_4289.jpg",
    "/images/japan/IMG_4328.jpg",
    "/images/japan/IMG_4374.jpg",
    "/images/japan/IMG_4395.jpg",
  ]

  const togglePhotoSelection = (photo: string) => {
    setSelectedPhotos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(photo)) {
        newSet.delete(photo)
      } else {
        newSet.add(photo)
      }
      return newSet
    })
  }

  const handleAddToLibrary = () => {
    // TODO: Add selected photos to library
    console.log("Adding photos to library:", Array.from(selectedPhotos))
    setActiveTab("cloud")
    setSelectedPhotos(new Set())
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      console.log("Selected files:", Array.from(files))
      // TODO: Process selected files
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      console.log("Dropped files:", Array.from(files))
      // TODO: Process dropped files
    }
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {activeTab === "google-photos" ? "Google Photos" : "Upload Photos"}
          </DialogTitle>
          <DialogDescription>
            {activeTab === "upload" 
              ? "Drag and drop your photos or click to browse" 
              : activeTab === "cloud"
              ? "Connect your cloud storage to import photos"
              : "Select photos to add to your library"}
          </DialogDescription>
        </DialogHeader>

        {/* Tabs Navigation */}
        {activeTab !== "google-photos" && (
          <div className="flex gap-1 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setActiveTab("upload")}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium",
                activeTab === "upload"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Upload className="h-4 w-4 inline-block mr-2" />
              Local Files
            </button>
            <button
              onClick={() => setActiveTab("cloud")}
              className={cn(
                "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium",
                activeTab === "cloud"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Cloud className="h-4 w-4 inline-block mr-2" />
              Cloud Import
            </button>
          </div>
        )}

        {/* Back Button for Google Photos */}
        {activeTab === "google-photos" && (
          <button
            onClick={() => setActiveTab("cloud")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Cloud Import
          </button>
        )}

        {/* Tab Content */}
        {activeTab === "upload" ? (
          <>
            <div
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-12 text-center",
                isDragging ? "border-primary bg-primary/5" : "border-border bg-muted/30",
              )}
            >
              <div className="flex flex-col items-center gap-4">
                <div
                  className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center",
                    isDragging ? "bg-primary/20" : "bg-muted",
                  )}
                >
                  <Upload className={cn("h-8 w-8", isDragging ? "text-primary" : "text-muted-foreground")} />
                </div>

                <div>
                  <p className="text-lg font-medium text-foreground mb-1">
                    {isDragging ? "Drop your photos here" : "Drag and drop photos here"}
                  </p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </div>

                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground active:scale-95 active:brightness-110"
                  onClick={handleFileSelect}
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/heic,image/heif"
              onChange={handleFileChange}
              className="hidden"
            />

            <p className="text-xs text-muted-foreground text-center">
              Supported formats: JPG, PNG, HEIC. Max file size: 50MB
            </p>
          </>
        ) : activeTab === "cloud" ? (
          <>
            <div className="px-1">
              <div className="grid grid-cols-1 gap-2 pr-1">
                {cloudServices.map((service) => {
                  const isConnected = connectedServices.has(service.id)
                  return (
                    <div
                      key={service.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border-2",
                        isConnected
                          ? "border-green-500 bg-green-50/50"
                          : "border-border bg-muted/30 hover:border-primary hover:bg-primary/5"
                      )}
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0",
                          !isConnected && `bg-gradient-to-br ${service.color}`
                        )}
                      >
                        {typeof service.icon === "string" ? (
                          <span className="text-lg">{service.icon}</span>
                        ) : (
                          <div className="text-white">{service.icon}</div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="font-medium text-foreground text-sm">{service.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{service.description}</p>
                      </div>
                      <div>
                        {service.id === "google-photos" ? (
                          <Button
                            size="sm"
                            onClick={() => setActiveTab("google-photos")}
                            className="bg-green-600 hover:bg-green-700 text-white active:scale-95 active:brightness-110"
                          >
                            View
                          </Button>
                        ) : isConnected ? (
                          <span className="text-sm font-medium text-green-600">Connected ✓</span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleServiceConnect(service.id)}
                            className="bg-gradient-to-r from-primary to-accent text-primary-foreground active:scale-95 active:brightness-110"
                          >
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Your credentials are securely stored and encrypted. We never access your photos without permission.
            </p>
          </>
        ) : (
          <>
            {/* Google Photos Selector */}
            <div className="h-[400px] overflow-y-auto pr-2 -mr-2">
              <div className="grid grid-cols-3 gap-3">
                {googlePhotosImages.map((photo) => {
                  const isSelected = selectedPhotos.has(photo)
                  return (
                    <button
                      key={photo}
                      onClick={() => togglePhotoSelection(photo)}
                      className={cn(
                        "relative aspect-square rounded-xl overflow-hidden border-2",
                        isSelected
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <img src={photo} alt="Uploaded photo preview" className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            ✓
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {selectedPhotos.size} photo{selectedPhotos.size !== 1 ? "s" : ""} selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setActiveTab("cloud")} className="active:scale-95 active:brightness-110">
                  Cancel
                </Button>
                <Button
                  onClick={handleAddToLibrary}
                  disabled={selectedPhotos.size === 0}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground active:scale-95 active:brightness-110"
                >
                  Add to Library ({selectedPhotos.size})
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}
