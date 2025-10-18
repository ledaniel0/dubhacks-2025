"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const heroCards = [
  {
    id: "summer-adventures",
    title: "Summer Adventures",
    query: "summer vacation beach trips",
    image: "/summer-beach-vacation.png",
  },
  {
    id: "family-moments",
    title: "Family Moments",
    query: "family gatherings celebrations",
    image: "/family-gathering-celebration.jpg",
  },
  {
    id: "nature-escapes",
    title: "Nature Escapes",
    query: "hiking mountains nature landscapes",
    image: "/mountain-hiking-nature-landscape.jpg",
  },
]

interface HeroCardsProps {
  onCardClick: (query: string) => void
}

export function HeroCards({ onCardClick }: HeroCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {heroCards.map((card) => {
        const isHovered = hoveredCard === card.id

        return (
          <button
            key={card.id}
            onClick={() => onCardClick(card.query)}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-300 h-64",
              isHovered ? "scale-[1.02] shadow-2xl border-primary/30" : "shadow-lg hover:shadow-xl",
            )}
          >
            {/* Image */}
            <img
              src={card.image || "/placeholder.svg"}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl font-bold text-white text-balance">{card.title}</h3>
            </div>

            {/* Hover effect */}
            <div
              className={cn(
                "absolute inset-0 bg-primary/10 transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
