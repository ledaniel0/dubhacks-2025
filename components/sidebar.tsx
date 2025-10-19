"use client"

import { Home, FolderOpen, Sparkles, Users, ImageIcon, User, Compass } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", icon: Home, id: "home" },
  { name: "Library", icon: ImageIcon, id: "library" },
  { name: "Albums", icon: FolderOpen, id: "albums" },
  { name: "Shared", icon: Users, id: "shared" },
  { name: "Explore", icon: Compass, id: "explore" },
]

interface SidebarProps {
  activeView: string
  onNavigate: (view: string) => void
}

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border/50 glass-effect z-50">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl animated-gradient flex items-center justify-center shadow-glow">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#E0338E] to-[#00B4D8] bg-clip-text text-transparent">
              Echo
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-6">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-[#FF6B35]/20 via-[#E0338E]/20 to-[#9D4EDD]/20 text-sidebar-accent-foreground shadow-lg border-2 border-primary/40"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:shadow-md border-2 border-transparent hover:border-primary/20",
                )}
              >
                {/* Animated gradient background on hover */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/10 via-[#00B4D8]/10 to-[#9D4EDD]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                <Icon className={cn(
                  "h-5 w-5 relative z-10 transition-all duration-300",
                  isActive ? "text-primary" : "group-hover:scale-110"
                )} />
                <span className="relative z-10">{item.name}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-3 h-2 w-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#E0338E] animate-pulse" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-border/50 p-4">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-sidebar-accent/30 transition-all duration-300 cursor-pointer group">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#FF6B35] via-[#E0338E] to-[#9D4EDD] flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">You</p>
              <p className="text-xs text-muted-foreground truncate">ledaniel@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
