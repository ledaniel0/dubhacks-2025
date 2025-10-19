"use client"

import { Home, FolderOpen, Sparkles, Users, ImageIcon, User, Compass, Wand2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

const navigation = [
  { name: "Home", icon: Home, id: "home" },
  { name: "Library", icon: ImageIcon, id: "library" },
  { name: "Albums", icon: FolderOpen, id: "albums" },
  { name: "Organize", icon: Wand2, id: "organize" },
  { name: "Shared", icon: Users, id: "shared" },
  { name: "Explore", icon: Compass, id: "explore" },
]

interface SidebarProps {
  activeView: string
  onNavigate: (view: string) => void
  onCollapseChange?: (isCollapsed: boolean) => void
  isModalActive?: boolean
}

export function Sidebar({ activeView, onNavigate, onCollapseChange, isModalActive = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect()
        const isNearSidebar = e.clientX <= rect.right + 80 // Increased proximity for smoother detection
        
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        
        if (isNearSidebar) {
          setIsHovered(true)
        } else {
          // Add delay before collapsing for smoother animation
          timeoutRef.current = setTimeout(() => {
            setIsHovered(false)
          }, 150)
        }
      }
    }

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      setIsHovered(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Don't expand if modal is active
    const shouldCollapse = !isHovered || isModalActive
    setIsCollapsed(shouldCollapse)
    onCollapseChange?.(shouldCollapse)
  }, [isHovered, isModalActive, onCollapseChange])

  return (
    <aside 
      ref={sidebarRef}
      className={cn(
        "fixed left-0 top-0 h-screen border-r border-border/50 glass-effect z-50 transition-all duration-500 ease-in-out",
        isModalActive ? "hidden" : isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Echo Logo Section */}
        <div className="px-3 py-4 border-b border-border/50">
          <div className={cn(
            "flex items-center transition-all duration-500 ease-in-out",
            isCollapsed ? "justify-center px-2" : "justify-start px-4"
          )}>
            {/* Echo Logo Icon - Aligned with nav icons */}
            <div className={cn(
              "flex-shrink-0 w-10 h-10 flex items-center justify-center transition-all duration-500 ease-in-out",
              isCollapsed ? "" : ""
            )} style={{ marginLeft: isCollapsed ? '0px' : '-5px' }}>
              <div className="h-10 w-10 rounded-xl animated-gradient flex items-center justify-center shadow-glow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Echo Text - Slides in from right */}
            <div className={cn(
              "flex-1 min-w-0 transition-all duration-500 ease-in-out text-left",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 ml-3"
            )}>
              <span className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#E0338E] to-[#00B4D8] bg-clip-text text-transparent relative z-10 whitespace-nowrap text-left">
                Echo
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "flex w-full items-center rounded-xl py-3 text-sm font-semibold transition-all duration-500 ease-in-out group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-[#FF6B35]/20 via-[#E0338E]/20 to-[#9D4EDD]/20 text-sidebar-accent-foreground shadow-lg border-2 border-primary/40"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:shadow-md border-2 border-transparent hover:border-primary/20",
                  isCollapsed ? "justify-center px-2" : "justify-start px-4"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                {/* Animated gradient background on hover */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35]/10 via-[#00B4D8]/10 to-[#9D4EDD]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                {/* Icon - Fixed position */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <Icon className={cn(
                    "h-5 w-5 relative z-10 transition-all duration-300",
                    isActive ? "text-primary" : "group-hover:scale-110"
                  )} />
                </div>
                
                {/* Text - Slides in from right */}
                <div className={cn(
                  "flex-1 min-w-0 transition-all duration-500 ease-in-out text-left",
                  isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 ml-3"
                )}>
                  <span className="relative z-10 whitespace-nowrap text-left">{item.name}</span>
                </div>
              </button>
            )
          })}
        </nav>

        <div className="border-t border-border/50 p-4">
          <div className={cn(
            "flex items-center py-3 rounded-xl hover:bg-sidebar-accent/30 transition-all duration-500 ease-in-out cursor-pointer group",
            isCollapsed ? "justify-center px-2" : "justify-start px-3"
          )}>
            {/* Profile Picture - Fixed position */}
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF6B35] via-[#E0338E] to-[#9D4EDD] flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 group-hover:scale-105 overflow-hidden">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            
            {/* User Info - Slides in from right */}
            <div className={cn(
              "flex-1 min-w-0 transition-all duration-500 ease-in-out text-left",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 ml-3"
            )}>
              <p className="text-sm font-medium text-foreground truncate text-left">You</p>
              <p className="text-xs text-muted-foreground truncate text-left">ledaniel@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
