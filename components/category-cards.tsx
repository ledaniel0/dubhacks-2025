"use client"

import { Calendar, MapPin, Users, Sparkles } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const categories = [
  { id: "recent", label: "Recent", icon: Calendar, filter: "recent" },
  { id: "places", label: "Places", icon: MapPin, filter: "places" },
  { id: "people", label: "People", icon: Users, filter: "people" },
  { id: "ai-picks", label: "AI Picks", icon: Sparkles, filter: "ai-picks" },
]

interface CategoryCardsProps {
  onCategoryClick: (filter: string) => void
}

export function CategoryCards({ onCategoryClick }: CategoryCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => {
        const Icon = category.icon
        const isHovered = hoveredCard === category.id

        return (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.filter)}
            onMouseEnter={() => setHoveredCard(category.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={cn(
              "group relative overflow-hidden rounded-xl bg-card border border-border p-6 transition-all duration-200 h-32 flex flex-col items-center justify-center",
              isHovered ? "scale-[1.02] shadow-lg border-primary/30" : "shadow-sm hover:shadow-md",
            )}
          >
            <Icon
              className={cn(
                "h-8 w-8 mb-2 text-muted-foreground transition-all duration-200",
                isHovered && "text-primary scale-110",
              )}
            />
            <span className="text-sm font-medium text-foreground">{category.label}</span>
          </button>
        )
      })}
    </div>
  )
}
