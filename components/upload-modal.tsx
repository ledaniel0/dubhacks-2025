"use client"

import { Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Upload Photos</DialogTitle>
          <DialogDescription>Drag and drop your photos or click to browse</DialogDescription>
        </DialogHeader>

        <div
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            // Handle file drop
          }}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200",
            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border bg-muted/30",
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center transition-colors duration-200",
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

            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <ImageIcon className="h-5 w-5 mr-2" />
              Choose Files
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Supported formats: JPG, PNG, HEIC. Max file size: 50MB
        </p>
      </DialogContent>
    </Dialog>
  )
}
